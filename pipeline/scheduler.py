"""
SignalAtlas — Main Pipeline Runner
Generates and publishes articles using the 4-Layer Discovery Pipeline + Groq LLM.
Run manually: python scheduler.py
Run as cron:  0 1,7,13 * * * cd /path/to/pipeline && python scheduler.py
"""
import os
import sys
import time
import json
from datetime import datetime

# Add parent dir to path
sys.path.insert(0, os.path.dirname(__file__))

from generator import generate_article
from publisher import publish_article, find_recent_duplicate, fetch_evergreen_articles, HEADERS as PUB_HEADERS, SUPABASE_URL
from scraper import fetch_all_topics
from scorer import score_topics
import requests

ARTICLES_PER_RUN = int(os.environ.get("ARTICLES_PER_RUN", "5"))
DELAY_BETWEEN = int(os.environ.get("DELAY_BETWEEN_SECS", "30"))

def load_published_topics() -> set:
    """Load already-published topics to avoid repeats."""
    cache_file = os.path.join(os.path.dirname(__file__), "published_topics.json")
    if os.path.exists(cache_file):
        with open(cache_file) as f:
            return set(json.load(f))
    return set()

def save_published_topic(topic: str) -> None:
    cache_file = os.path.join(os.path.dirname(__file__), "published_topics.json")
    existing = load_published_topics()
    existing.add(topic)
    with open(cache_file, "w") as f:
        json.dump(list(existing), f, indent=2)

def fetch_existing_articles() -> list:
    """Fetch existing articles from Supabase for connection scoring."""
    r = requests.get(
        f"{SUPABASE_URL}/rest/v1/articles",
        headers=PUB_HEADERS,
        params={"select": "id,slug,title,category,countries,topics", "status": "eq.published"},
    )
    if r.status_code == 200:
        return r.json()
    return []

def calculate_and_insert_connections(new_id: str, new_article: dict, existing_articles: list) -> int:
    """
    Score and insert bidirectional article connections into article_connections table.
    Mirrors the same logic in research_compiler.py for consistency.
    """
    if not existing_articles:
        return 0

    scored_links = []
    new_countries = set(new_article.get("countries", []))
    new_topics    = set(new_article.get("topics", []))
    new_cat       = new_article.get("category", "")

    for art in existing_articles:
        art_id = art["id"]
        if art_id == new_id:
            continue

        score   = 0
        reasons = []

        if art.get("category") == new_cat:
            score += 15
            reasons.append(f"Shared theme ({new_cat})")

        matching_countries = new_countries.intersection(set(art.get("countries", [])))
        if matching_countries:
            score += len(matching_countries) * 20
            reasons.append(f"Shared country ({', '.join(list(matching_countries)[:2])})")

        matching_topics = new_topics.intersection(set(art.get("topics", [])))
        if matching_topics:
            score += len(matching_topics) * 25
            reasons.append(f"Overlapping topics ({', '.join(list(matching_topics)[:2])})")

        if score > 0:
            scored_links.append({
                "to_id": art_id,
                "title": art["title"],
                "score": score,
                "reason": " · ".join(reasons) or "Connected strategic analysis"
            })

    scored_links.sort(key=lambda x: x["score"], reverse=True)
    top_links = scored_links[:3]

    connections_created = 0
    for link in top_links:
        strength = min(100, int(link["score"]))
        for forward, reverse in [
            (new_id, link["to_id"]),
            (link["to_id"], new_id),
        ]:
            r = requests.post(
                f"{SUPABASE_URL}/rest/v1/article_connections",
                headers=PUB_HEADERS,
                json={
                    "from_article": forward,
                    "to_article":   reverse,
                    "connection_strength": strength,
                    "connection_reason":  link["reason"],
                }
            )
            if r.status_code in (200, 201):
                connections_created += 1

    return connections_created // 2  # each link counted twice (fwd + rev)

def run_pipeline() -> None:
    print(f"\n{'='*60}")
    print(f"SignalAtlas Pipeline - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}")

    print("Step 1: Fetching intelligence from 4-Layer Discovery Pipeline...")
    raw_news_items = fetch_all_topics()

    if not raw_news_items:
        print("No news fetched. Exiting.")
        return

    published = load_published_topics()

    # Filter out already published news
    pending = [item for item in raw_news_items if item['title'] not in published]

    if not pending:
        print("All current news topics have already been published.")
        return

    print("Step 2: Scoring topics for geopolitical relevance...")
    scored_items = score_topics(pending)

    if not scored_items:
        print("No topics passed the minimum score threshold (>= 55).")
        return

    # Fetch existing articles ONCE for connection scoring
    print("Step 3: Loading existing article graph for connection scoring...")
    existing_articles = fetch_existing_articles()
    print(f"  → {len(existing_articles)} published articles in graph")

    print("Step 3.5: Fetching high-value evergreen articles for internal linking...")
    evergreen_articles = fetch_evergreen_articles(limit=3)
    evergreen_context = "\n".join([f"- [{a['title']}](/research/{a['slug']})" for a in evergreen_articles])

    targets = scored_items[:ARTICLES_PER_RUN]
    print(f"\nStep 4: Generating {len(targets)} high-value article(s)...\n")

    success = 0
    for i, item in enumerate(targets):
        topic   = item['title']
        score   = item.get('topic_score', 0)
        context = (
            f"Source: {item['source']}\n"
            f"URL: {item['url']}\n"
            f"Date: {item['publishedAt']}\n"
            f"Summary: {item['description']}\n"
            f"Relevance Score: {score}/100"
        )

        print(f"[{i+1}/{len(targets)}] (Score {score}/100) {topic[:60]}...")

        # Strict duplicate check before generation
        if find_recent_duplicate(topic):
            print("  - Skipping: Duplicate event cluster detected in recent articles.\n")
            continue

        full_context = context
        if evergreen_context:
            full_context += f"\n\nEVERGREEN ARTICLES TO LINK TO:\n{evergreen_context}"

        article = generate_article(topic, context=full_context)
        if not article:
            print("  - Generation failed, skipping\n")
            continue

        article_id = publish_article(article)
        if article_id:
            save_published_topic(topic)
            success += 1
            print(f"  ✓ Live at /research/{article['slug']}")

            # Build internal connections immediately after publishing
            links = calculate_and_insert_connections(article_id, article, existing_articles)
            print(f"  ✓ {links} bidirectional graph links established\n")

            # Add to local graph so subsequent articles in this run can link to it
            existing_articles.append({
                "id":       article_id,
                "slug":     article["slug"],
                "title":    article["title"],
                "category": article.get("category", ""),
                "countries": article.get("countries", []),
                "topics":    article.get("topics", []),
            })
        else:
            print("  - Publish failed\n")

        if i < len(targets) - 1:
            print(f"  Waiting {DELAY_BETWEEN}s before next article...")
            time.sleep(DELAY_BETWEEN)

    print(f"\n{'='*60}")
    print(f"Pipeline complete: {success}/{len(targets)} articles published")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    run_pipeline()
