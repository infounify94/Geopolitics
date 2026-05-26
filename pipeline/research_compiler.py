"""
SignalAtlas — Deep Research Compiler
Generates deep, evergreen research articles and dynamically calculates
bidirectional database connections for rich internal linking.
"""
import os
import sys
import json
import re
import time
import requests
from datetime import datetime, timezone

# Add parent dir to path
sys.path.insert(0, os.path.dirname(__file__))

from generator import generate_article, slugify
from publisher import publish_article, HEADERS as PUB_HEADERS, SUPABASE_URL

SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

EVERGREEN_IDEAS = [
    "Strait of Malacca: The Geopolitical Bottleneck Controlling China's Maritime Energy Lifeline",
    "Sovereign Debt Lever: How Multilateral Restructuring Reshapes National Resource Ownership in the Global South",
    "Dual-Use Dilemmas: Analyzing Pathogen Biosafety and Biotech Funding Networks",
    "Sovereign Infrastructure Capture: The Geopolitics of State-Owned Ports and Grid Ownership",
    "The Petrodollar Erosion: SWIFT Alternatives, BRICS Pay, and the Rise of Bilateral Trade Settlements",
    "Transboundary Water Hegemony: Mekong and Brahmaputra Megadams and the Future of Downstream Sovereignty",
    "The Semiconductor Decoupling: Rare Earth processing, ASML lithography bans, and high-tech trade blocks",
    "Lithium Triangle Arbitrage: How South American Nationalization Impacts the Western EV Supply Chain"
]

def fetch_existing_articles() -> list:
    """Fetch existing articles from Supabase to calculate links and prevent repeats."""
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
    Calculate country, topic, and category overlap between the new article and all others.
    Inserts top 3 strongest links bidirectionally into the article_connections table.
    """
    if not existing_articles:
        return 0

    scored_links = []
    new_countries = set(new_article.get("countries", []))
    new_topics = set(new_article.get("topics", []))
    new_cat = new_article.get("category", "")

    for art in existing_articles:
        art_id = art["id"]
        if art_id == new_id:
            continue

        score = 0
        reasons = []

        # Category overlap
        if art.get("category") == new_cat:
            score += 15
            reasons.append(f"Shared theme ({new_cat})")

        # Country overlap
        matching_countries = new_countries.intersection(set(art.get("countries", [])))
        if matching_countries:
            score += len(matching_countries) * 20
            reasons.append(f"Shared country coverage ({', '.join(list(matching_countries)[:2])})")

        # Topic overlap
        matching_topics = new_topics.intersection(set(art.get("topics", [])))
        if matching_topics:
            score += len(matching_topics) * 25
            reasons.append(f"Overlapping strategic keywords ({', '.join(list(matching_topics)[:2])})")

        if score > 0:
            scored_links.append({
                "to_id": art_id,
                "title": art["title"],
                "score": score,
                "reason": " · ".join(reasons) or "Connected strategic analysis"
            })

    # Sort by strongest score first
    scored_links.sort(key=lambda x: x["score"], reverse=True)
    top_links = scored_links[:3]  # Max 3 connections

    connections_created = 0
    for link in top_links:
        # Bidirectional insert: A -> B and B -> A
        strength = min(100, int(link["score"]))
        
        # 1. Forward direction
        conn_forward = {
            "from_article": new_id,
            "to_article": link["to_id"],
            "connection_strength": strength,
            "connection_reason": link["reason"]
        }
        r1 = requests.post(
            f"{SUPABASE_URL}/rest/v1/article_connections",
            headers=PUB_HEADERS,
            json=conn_forward
        )
        
        # 2. Reverse direction
        conn_reverse = {
            "from_article": link["to_id"],
            "to_article": new_id,
            "connection_strength": strength,
            "connection_reason": link["reason"]
        }
        r2 = requests.post(
            f"{SUPABASE_URL}/rest/v1/article_connections",
            headers=PUB_HEADERS,
            json=conn_reverse
        )
        
        if r1.status_code in (200, 201) or r2.status_code in (200, 201):
            connections_created += 1
            print(f"  ✓ Connected: \"{new_article['title'][:30]}\" ↔ \"{link['title'][:30]}\" (Strength: {strength})")

    return connections_created

def run_compiler(manual_topic: str = None) -> None:
    print(f"\n{'='*60}")
    print(f"SignalAtlas Deep Research Compiler - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}")

    existing = fetch_existing_articles()
    existing_slugs = {a["slug"] for a in existing}
    existing_titles = {a["title"] for a in existing}

    # Decide topic
    topic = ""
    if manual_topic and manual_topic.strip():
        topic = manual_topic.strip()
        print(f"Manual Research Triggered for topic: \"{topic}\"")
    else:
        # Pick one that isn't published yet
        available = [t for t in EVERGREEN_IDEAS if slugify(t) not in existing_slugs and t not in existing_titles]
        if not available:
            print("All default evergreen ideas are already published. Picking a random core topic...")
            # Pick a fallback random evergreen idea
            import random
            topic = random.choice(EVERGREEN_IDEAS)
        else:
            topic = available[0]
        print(f"Auto-selected evergreen topic from backlog: \"{topic}\"")

    # Double check slug
    target_slug = slugify(topic)
    if target_slug in existing_slugs:
        print(f"  ⚠ Research aborted: Slug \"{target_slug}\" is already published.")
        return

    # Generate
    print(f"Executing Deep 17-Angle Synthesis Compiler...")
    article = generate_article(topic, context="Ensure an extremely high standard of writing, strong citations, dynamic 3 scenarios, and detailed India Implications lens.")
    
    if not article:
        print("  ✗ Generation failed.")
        return

    # Publish
    print(f"Publishing to Supabase Database...")
    new_id = publish_article(article)

    if new_id:
        print(f"  ✓ Deep Briefing fully published with ID: {new_id}")
        
        # Calculate dynamic links
        print(f"Calculating dynamic internal links for Relationship Graph & Sidebar...")
        links_inserted = calculate_and_insert_connections(new_id, article, existing)
        print(f"  ✓ Graph calculation complete: {links_inserted} bidirectional links established.")
        
        # Cache local published topic
        from scheduler import save_published_topic
        save_published_topic(topic)
        
        print(f"\nLive at: /research/{article['slug']}")
    else:
        print("  ✗ Publishing failed.")

    print(f"{'='*60}\n")

if __name__ == "__main__":
    manual_input = sys.argv[1] if len(sys.argv) > 1 else None
    run_compiler(manual_input)
