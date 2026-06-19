"""
SignalAtlas — Supabase Publisher
Inserts generated articles into Supabase and triggers ISR revalidation.
"""
import os
import json
import requests
from datetime import datetime

SUPABASE_URL = "https://klmzxnkgrhdfhilpevvu.supabase.co"
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_SERVICE_KEY:
    raise ValueError("Missing SUPABASE_SERVICE_ROLE_KEY environment variable. Cannot publish to Supabase.")
NEXT_SITE_URL = os.environ.get("NEXT_PUBLIC_SITE_URL", "http://localhost:3000")

HEADERS = {
    "apikey": SUPABASE_SERVICE_KEY,
    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}


def slug_exists(slug: str) -> bool:
    """Check if article with this slug already exists."""
    r = requests.get(
        f"{SUPABASE_URL}/rest/v1/articles",
        headers=HEADERS,
        params={"slug": f"eq.{slug}", "select": "id"},
    )
    return len(r.json()) > 0


def find_recent_duplicate(title: str) -> bool:
    """Check if we recently published an article with a highly similar title."""
    r = requests.get(
        f"{SUPABASE_URL}/rest/v1/articles",
        headers=HEADERS,
        params={"select": "title", "order": "published_at.desc", "limit": "50"},
    )
    if r.status_code != 200:
        return False
    
    recent_titles = [a.get("title", "").lower() for a in r.json()]
    new_tokens = set([w for w in title.lower().replace('-', ' ').split() if len(w) > 3])
    
    for old_title in recent_titles:
        old_tokens = set([w for w in old_title.replace('-', ' ').split() if len(w) > 3])
        if len(new_tokens) == 0:
            continue
        overlap = len(new_tokens.intersection(old_tokens)) / len(new_tokens)
        if overlap >= 0.6:  # 60% overlap in significant words
            print(f"  ⚠ Duplicate detected. High overlap with: '{old_title}'")
            return True
    return False

def fetch_evergreen_articles(limit=3) -> list:
    """Fetch recent high evergreen score articles for internal linking."""
    r = requests.get(
        f"{SUPABASE_URL}/rest/v1/articles",
        headers=HEADERS,
        params={"select": "title,slug,evergreen_score", "order": "evergreen_score.desc,published_at.desc", "limit": str(limit), "status": "eq.published"},
    )
    if r.status_code == 200:
        return r.json()
    return []


def publish_article(article: dict) -> str | None:
    """
    Insert article into Supabase.
    Returns the article ID on success, None on failure.
    """
    slug = article["slug"]

    # Check for duplicate
    if slug_exists(slug):
        print(f"  ⚠ Article already exists: {slug}")
        return None

    # Insert
    r = requests.post(
        f"{SUPABASE_URL}/rest/v1/articles",
        headers=HEADERS,
        json=article,
    )

    if r.status_code in (200, 201):
        data = r.json()
        article_id = data[0]["id"] if isinstance(data, list) else data.get("id")
        print(f"  ✓ Published: {article['title'][:60]}")
        print(f"    ID: {article_id}")
        print(f"    Slug: {slug}")

        return article_id
    else:
        print(f"  ✗ Publish failed ({r.status_code}): {r.text[:200]}")
        return None

if __name__ == "__main__":
    # Test with a dummy article
    test_article = {
        "slug": "test-article-pipeline-check",
        "title": "Pipeline Test — SignalAtlas",
        "meta_description": "Testing the pipeline",
        "content": "## Test content\n\nTest",
        "summary_bullets": ["Test bullet 1", "Test bullet 2"],
        "category": "GENERAL",
        "confidence_level": "Medium",
        "evidence_level": "Moderate",
        "impact_score": 5.0,
        "pattern_score": 5,
        "evergreen_score": 5,
        "countries": ["India"],
        "topics": ["Test"],
        "event_type": "other",
        "sources": [],
        "source_count": 0,
        "faq": [],
        "chart_suggestions": [],
        "read_time_mins": 1,
        "word_count": 4,
        "status": "draft",
        "published_at": datetime.utcnow().isoformat(),
    }
    result = publish_article(test_article)
    print(f"Test result: {result}")
