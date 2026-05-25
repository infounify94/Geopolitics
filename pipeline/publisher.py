"""
SignalAtlas — Supabase Publisher
Inserts generated articles into Supabase and triggers ISR revalidation.
"""
import os
import json
import requests
from datetime import datetime

SUPABASE_URL = "https://klmzxnkgrhdfhilpevvu.supabase.co"
SUPABASE_SERVICE_KEY = os.environ.get(
    "SUPABASE_SERVICE_ROLE_KEY",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsbXp4bmtncmhkZmhpbHBldnZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTY4NDc5NiwiZXhwIjoyMDk1MjYwNzk2fQ.-IhO6NVVVeGFeaU242seLwEp8JkotetYhdRk_jnF-E8"
)
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
