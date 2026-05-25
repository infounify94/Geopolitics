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

# Topics queue - add more here as you think of them
TOPIC_QUEUE = [
    # India Lens
    "India's Strategic Silence on Dollar-Yuan Rivalry: Optionality or Fence-Sitting?",
    "How Red Sea Disruptions Are Costing Indian Importers $340 Per Container",
    "India's Gold Reserve Buildup: Three Consecutive Months - What RBI Isn't Saying",
    "Foreign Funding of Anti-India Protests: A Documented Pattern Since 2019",
    "India-China Border Tensions and the Supply Chain Reshuffling Nobody Talks About",

    # Economic Warfare
    "IMF Loan Trap: How 40 Nations Lost Policy Sovereignty in 15 Years",
    "SWIFT Bypass: How Russia Built an Alternative Payment Network in 18 Months",
    "Dollar Weaponization: When Sanctions Became America's Foreign Policy Default",
    "Who Profits from Sri Lanka's Debt Crisis: A Follow-the-Money Analysis",
    "The Petrodollar Compact: Why Its Fracture Matters More Than Oil Prices",

    # Power Networks
    "The Political Protest Blueprint: Same NGO Networks, 14 Countries, 25 Years",
    "Color Revolution Playbook: From Tbilisi 2003 to Today",
    "Fact-Checker Funding Trails: Who Pays the Arbiters of Truth?",
    "Media Ownership and Narrative Control: The Western Information Ecosystem",
    "How NGOs Became Tools of Geopolitical Influence",

    # Conflicts
    "Sudan's Gold War: The Hidden Resource Motive Behind the Civil Conflict",
    "Gaza Conflict: Arms Trade Winners and the $847B Weapons Economy",
    "Myanmar Coup: Who Benefits from Persistent Instability?",
    "Yemen: The World's Forgotten Proxy War and Its Sponsors",
    "Sahel Coups: Why West Africa Is Rejecting France and Turning East",
]

ARTICLES_PER_RUN = int(os.environ.get("ARTICLES_PER_RUN", "1"))
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

    published = load_published_topics()
    pending = [t for t in TOPIC_QUEUE if t not in published]

    if not pending:
        print("All topics published. Add more to TOPIC_QUEUE in scheduler.py")
        return

    targets = pending[:ARTICLES_PER_RUN]
    print(f"Generating {len(targets)} article(s)...\n")

    success = 0
    for i, topic in enumerate(targets):
        print(f"[{i+1}/{len(targets)}] {topic[:70]}")

        # Generate
        article = generate_article(topic)
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

