import os
import requests
import json
from datetime import datetime

# Provided by the user
GNEWS_API_KEY = os.environ.get("GNEWS_API_KEY", "6b4185e72e364da457bb56cbaa7e22a5")

def fetch_gnews_topics() -> list[dict]:
    """Fetch top geopolitical news from GNews API."""
    url = "https://gnews.io/api/v4/search"
    params = {
        "q": "geopolitics OR sanctions OR \"proxy war\" OR \"economic warfare\" OR \"trade war\"",
        "lang": "en",
        "max": 15,
        "apikey": GNEWS_API_KEY,
        "sortby": "publishedAt"
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        topics = []
        for article in data.get("articles", []):
            topics.append({
                "title": article.get("title"),
                "description": article.get("description"),
                "source": article.get("source", {}).get("name"),
                "url": article.get("url"),
                "publishedAt": article.get("publishedAt"),
            })
        return topics
    except Exception as e:
        print(f"Error fetching from GNews: {e}")
        return []

if __name__ == "__main__":
    print(f"Fetching topics from GNews...")
    topics = fetch_gnews_topics()
    for t in topics[:3]:
        print(f"- {t['title']} ({t['source']})")
