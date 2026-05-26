import os
import requests
import json
import feedparser
from datetime import datetime

GNEWS_API_KEY = os.environ.get("GNEWS_API_KEY", "6b4185e72e364da457bb56cbaa7e22a5")
NEWS_API_KEY = os.environ.get("NEWS_API_KEY", "")

RSS_FEEDS = [
    # International news
    "http://feeds.bbci.co.uk/news/world/rss.xml",              # BBC World
    "https://www.aljazeera.com/xml/rss/all.xml",               # Al Jazeera
    "https://rss.scmp.com/rss/5",                              # South China Morning Post
    "https://timesofindia.indiatimes.com/rss.cms",             # Times of India
    "https://thewire.in/feed",                                  # The Wire India
    "https://scroll.in/feed",                                  # Scroll.in India
    "https://www.thehindu.com/news/international/?service=rss", # The Hindu
    # Multilateral institutions
    "https://www.imf.org/en/News/Rss",                         # IMF news
    "https://news.un.org/feed/subscribe/en/news/all/rss.xml",  # UN News
    "https://www.worldbank.org/en/news/rss",                   # World Bank
    # Science / Medical / Technology
    "https://www.who.int/feeds/entity/news/en/rss.xml",        # WHO
    "https://feeds.nature.com/news/rss/most-read",             # Nature News
    "https://www.sciencedaily.com/rss/top/science.xml",        # Science Daily
    # Finance / Economy
    "https://feeds.bloomberg.com/markets/news.rss",            # Bloomberg Markets
    "https://www.ft.com/?format=rss",                          # Financial Times
]

def fetch_gnews_topics() -> list[dict]:
    """Layer 1: Fetch top geopolitical news from GNews API across all strategic domains."""
    if not GNEWS_API_KEY:
        return []

    # Broad query covering all domains: geopolitics, economics, health, surveillance, environment
    query = (
        'geopolitics OR sanctions OR "proxy war" OR "economic warfare" OR "trade war" '
        'OR "debt trap" OR "IMF" OR "World Bank" OR "military aid" OR "arms deal" '
        'OR "clinical trial" OR "pharmaceutical" OR "bioweapon" OR "pandemic" '
        'OR surveillance OR "data breach" OR "intelligence agency" '
        'OR "rare earth" OR "semiconductor" OR "supply chain" '
        'OR "carbon credit" OR "geoengineering" OR "water rights" '
        'OR "media bias" OR "disinformation" OR "propaganda"'
    )
    url = "https://gnews.io/api/v4/search"
    params = {
        "q":      query,
        "lang":   "en",
        "max":    10,
        "apikey": GNEWS_API_KEY,
        "sortby": "publishedAt"
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        topics = []
        for article in data.get("articles", []):
            topics.append({
                "title": article.get("title"),
                "description": article.get("description"),
                "source": f"GNews: {article.get('source', {}).get('name')}",
                "url": article.get("url"),
                "publishedAt": article.get("publishedAt"),
            })
        return topics
    except Exception as e:
        print(f"Error fetching from GNews: {e}")
        return []

def fetch_newsapi_topics() -> list[dict]:
    """Layer 1b: Fetch from NewsAPI.org if key is present."""
    if not NEWS_API_KEY:
        print("NEWS_API_KEY not found, skipping NewsAPI.")
        return []
        
    url = "https://newsapi.org/v2/top-headlines"
    params = {
        "category": "world", # Using 'general' or 'world' depending on newsapi support, typically they use 'general' or 'politics' but top-headlines supports category
        "q": "geopolitics",
        "apiKey": NEWS_API_KEY,
        "pageSize": 10
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        topics = []
        for article in data.get("articles", []):
            topics.append({
                "title": article.get("title"),
                "description": article.get("description"),
                "source": f"NewsAPI: {article.get('source', {}).get('name')}",
                "url": article.get("url"),
                "publishedAt": article.get("publishedAt"),
            })
        return topics
    except Exception as e:
        print(f"Error fetching from NewsAPI: {e}")
        return []

def fetch_rss_topics() -> list[dict]:
    """Layer 2: Scrape RSS feeds."""
    topics = []
    
    for feed_url in RSS_FEEDS:
        try:
            feed = feedparser.parse(feed_url)
            # Take top 3 from each feed to prevent overload
            for entry in feed.entries[:3]:
                title = getattr(entry, "title", "")
                desc = getattr(entry, "summary", getattr(entry, "description", ""))

                # Broader keyword filter to match all domains we cover
                keywords = [
                    "war", "sanction", "trade", "military", "election", "strike", "treaty",
                    "imf", "protest", "coup", "pharmaceutical", "clinical trial", "surveillance",
                    "debt", "nuclear", "intelligence", "pipeline", "mineral",
                    "carbon", "bioweapon", "pandemic", "outbreak", "semiconductor",
                ]
                if not any(k in title.lower() or k in desc.lower() for k in keywords):
                    continue
                    
                topics.append({
                    "title": title,
                    "description": desc[:500], # truncate long descriptions
                    "source": f"RSS: {feed.feed.get('title', feed_url)}",
                    "url": getattr(entry, "link", ""),
                    "publishedAt": getattr(entry, "published", datetime.now().isoformat()),
                })
        except Exception as e:
            print(f"Error fetching RSS feed {feed_url}: {e}")
            
    return topics

def fetch_wikipedia_recent_changes() -> list[dict]:
    """Layer 4: Wikipedia Recent Changes API for geopolitical spikes."""
    url = "https://en.wikipedia.org/w/api.php"
    params = {
        "action": "query",
        "list": "recentchanges",
        "rcprop": "title|comment|timestamp",
        "rclimit": 100,
        "format": "json"
    }
    
    try:
        headers = {'User-Agent': 'SignalAtlasBot/1.0 (contact@signalatlas.com)'}
        response = requests.get(url, params=params, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()

        # Look for heavy edits on strategic topic pages
        geo_keywords = [
            "War", "Crisis", "Conflict", "Protest", "Sanctions", "Coup", "Elections",
            "Pandemic", "Outbreak", "Treaty", "Missile", "Nuclear", "Intelligence",
            "Surveillance", "Pharmaceutical", "Climate", "Drought", "Debt", "IMF",
        ]

        topics = []
        for rc in data.get("query", {}).get("recentchanges", []):
            title = rc.get("title", "")
            if any(k in title for k in geo_keywords):
                topics.append({
                    "title": f"Wiki Update: {title}",
                    "description": f"Recent Wikipedia edit spike on page '{title}'. Comment: {rc.get('comment', '')}",
                    "source": "Wikipedia Recent Changes",
                    "url": f"https://en.wikipedia.org/wiki/{title.replace(' ', '_')}",
                    "publishedAt": rc.get("timestamp", datetime.now().isoformat()),
                })

        # Take up to 5 unique wiki topics
        unique_wiki = {t["title"]: t for t in topics}.values()
        return list(unique_wiki)[:5]

    except Exception as e:
        print(f"Error fetching Wikipedia RC: {e}")
        return []

def fetch_all_topics() -> list[dict]:
    """Execute the full 4-Layer Discovery Pipeline (skipping Reddit if no credentials)."""
    print("Layer 1: Fetching GNews...")
    gnews = fetch_gnews_topics()
    
    print("Layer 1: Fetching NewsAPI...")
    newsapi = fetch_newsapi_topics()
    
    print("Layer 2: Fetching RSS Feeds...")
    rss = fetch_rss_topics()
    
    print("Layer 4: Fetching Wikipedia Recent Changes...")
    wiki = fetch_wikipedia_recent_changes()
    
    all_topics = gnews + newsapi + rss + wiki
    
    # Deduplicate by URL
    seen_urls = set()
    unique_topics = []
    
    for t in all_topics:
        url = t.get("url")
        if url and url not in seen_urls:
            seen_urls.add(url)
            unique_topics.append(t)
            
    print(f"Total unique raw topics discovered: {len(unique_topics)}")
    return unique_topics

if __name__ == "__main__":
    topics = fetch_all_topics()
    print(f"\nSample of discovered topics:")
    for t in topics[:5]:
        print(f"- [{t['source']}] {t['title']}")
