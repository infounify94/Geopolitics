"""
SignalAtlas ??? Main Pipeline Runner
Generates and publishes 3 articles per day using Grok + mega-prompt.
Run manually: python scheduler.py
Run as cron: 0 1,7,13 * * * cd /path/to/pipeline && python scheduler.py
"""
import os
import sys
import time
import json
from datetime import datetime

# Add parent dir to path
sys.path.insert(0, os.path.dirname(__file__))

from generator import generate_article
from publisher import publish_article
from scraper import fetch_gnews_topics

ARTICLES_PER_RUN = int(os.environ.get("ARTICLES_PER_RUN", "3"))
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

def run_pipeline() -> None:
    print(f"\n{'='*60}")
    print(f"SignalAtlas Pipeline - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}")

    print("Fetching latest geopolitical news from GNews...")
    news_items = fetch_gnews_topics()
    
    if not news_items:
        print("No news fetched. Exiting.")
        return

    published = load_published_topics()
    
    # Filter out already published news (using title as the unique topic identifier)
    pending = [item for item in news_items if item['title'] not in published]

    if not pending:
        print("All current news topics have already been published.")
        return

    targets = pending[:ARTICLES_PER_RUN]
    print(f"Generating {len(targets)} article(s)...\n")

    success = 0
    for i, item in enumerate(targets):
        topic = item['title']
        context = f"Source: {item['source']}\nURL: {item['url']}\nDate: {item['publishedAt']}\nSummary: {item['description']}"
        
        print(f"[{i+1}/{len(targets)}] {topic[:70]}")

        # Generate using context
        article = generate_article(topic, context=context)
        if not article:
            print("  - Generation failed, skipping\n")
            continue

        # Publish
        article_id = publish_article(article)
        if article_id:
            save_published_topic(topic)
            success += 1
            print(f"  - Live at /research/{article['slug']}\n")
        else:
            print("  - Publish failed\n")

        # Rate limit
        if i < len(targets) - 1:
            print(f"  Waiting {DELAY_BETWEEN}s before next article...")
            time.sleep(DELAY_BETWEEN)

    print(f"\n{'='*60}")
    print(f"Pipeline complete: {success}/{len(targets)} articles published")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    run_pipeline()

