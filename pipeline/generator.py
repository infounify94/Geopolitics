"""
SignalAtlas — Article Generator
Uses Grok API (xAI) with the mega-prompt to generate deep research articles.
"""
import os
import json
import re
import time
from datetime import datetime, timezone
from openai import OpenAI

# Groq API uses OpenAI-compatible SDK (gsk_ prefix = groq.com, not xAI)
client = OpenAI(
    api_key=os.environ.get("GROQ_API_KEY", ""),
    base_url="https://api.groq.com/openai/v1",
)

MEGA_PROMPT_PATH = os.path.join(os.path.dirname(__file__), "..", "mega-prompt.md")

def load_mega_prompt() -> str:
    with open(MEGA_PROMPT_PATH, "r", encoding="utf-8") as f:
        return f.read()

def slugify(text: str) -> str:
    """Convert title to URL slug."""
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'\s+', '-', text.strip())
    text = re.sub(r'-+', '-', text)
    return text[:80]

def estimate_read_time(content: str) -> int:
    """Estimate read time at 200 WPM."""
    words = len(content.split())
    return max(1, round(words / 200))

def generate_article(topic: str, context: str = "") -> dict | None:
    """
    Generate a full research article using Grok + master prompt.
    Returns structured article dict ready for Supabase.
    """
    mega_prompt = load_mega_prompt()

    system_prompt = f"""{mega_prompt}

---

## OUTPUT FORMAT REQUIREMENTS

You MUST output your ENTIRE response as a SINGLE valid JSON object matching the Supabase `articles` table schema. 
Do NOT output markdown text outside of the JSON block.

CRITICAL WRITING INSTRUCTIONS:
- Do NOT use robotic step-by-step headers like "Angle 1" or "Section 4: What Happened".
- Weave the 17-section structure naturally into human-readable, professional prose.
- Use fluid transitions. Think "Foreign Affairs meets Bloomberg Intelligence".
- Avoid repetitive phrases. Write like a seasoned geopolitical analyst.
- Format the actual article text using standard markdown and store it in the `body_mdx` field.

JSON SCHEMA EXPECTED:
{{
  "title": "Article headline",
  "slug": "url-friendly-slug-max-80-chars",
  "meta_desc": "155 char SEO description",
  "body_mdx": "The full markdown article text goes here, naturally incorporating all required angles WITHOUT robotic headers.",
  "quick_summary": ["bullet 1", "bullet 2", "bullet 3"],
  "category": "One of: POWER NETWORKS, ECONOMIC WARFARE, INDIA LENS, CONFLICTS, MEDIA BIAS, SANCTIONS, ARMS TRADE, GLOBAL SOUTH",
  "confidence": "High",
  "evidence": "Strong",
  "impact_score": 8.5,
  "topic_score": 85,
  "country_tags": ["Country1", "Country2"],
  "topic_tags": ["Topic1", "Topic2"],
  "event_type": "war | coup | sanctions | election | economic | protest | other",
  "pattern_name": "Name from Pattern Taxonomy",
  "sources": [
    {{"name": "Reuters", "url": "...", "used_for": "News Agency"}}
  ],
  "faq": [
    {{"q": "What is...?", "a": "..."}}
  ],
  "chart_data": {{
    "type": "radar",
    "description": "Media bias comparison"
  }},
  "read_time_mins": 14
}}
"""

    user_message = f"""Write a full research article about the following topic:

TOPIC: {topic}

ADDITIONAL CONTEXT:
{context if context else "Research this topic thoroughly using your training data."}

Remember to output ONLY valid JSON.
"""

    print(f"[{datetime.now().strftime('%H:%M:%S')}] Generating article: {topic[:60]}...")
    t0 = time.time()

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            max_tokens=6000,
            temperature=0.6,
            response_format={"type": "json_object"}
        )

        raw = response.choices[0].message.content
        elapsed = time.time() - t0
        print(f"  ✓ Generated in {elapsed:.1f}s")

        try:
            metadata = json.loads(raw)
        except json.JSONDecodeError as e:
            print(f"  ⚠ JSON parse error: {e} — using fallback")
            metadata = _fallback_metadata(topic, raw)

        article = {
            "slug":              metadata.get("slug") or slugify(metadata.get("title", topic)),
            "title":             metadata.get("title", topic),
            "meta_desc":         metadata.get("meta_desc", "")[:155],
            "body_mdx":          metadata.get("body_mdx", "No content generated."),
            "quick_summary":     metadata.get("quick_summary", [])[:3],
            "category":          metadata.get("category", "GENERAL"),
            "confidence":        metadata.get("confidence", "Medium"),
            "evidence":          metadata.get("evidence", "Moderate"),
            "impact_score":      float(metadata.get("impact_score", 7.0)),
            "topic_score":       int(metadata.get("topic_score", 65)),
            "country_tags":      metadata.get("country_tags", []),
            "topic_tags":        metadata.get("topic_tags", []),
            "event_type":        metadata.get("event_type", "other"),
            "pattern_name":      metadata.get("pattern_name", ""),
            "sources":           metadata.get("sources", []),
            "faq":               metadata.get("faq", []),
            "chart_data":        metadata.get("chart_data", {}),
            "read_time_mins":    metadata.get("read_time_mins") or estimate_read_time(metadata.get("body_mdx", "")),
            "status":            "published",
            "published_at":      datetime.now(timezone.utc).isoformat(),
        }

        return article

    except Exception as e:
        print(f"  FAILED: Generation failed: {e}")
        return None


def _fallback_metadata(topic: str, raw: str) -> dict:
    return {
        "title": topic,
        "slug": slugify(topic),
        "meta_desc": topic[:155],
        "body_mdx": raw,
        "quick_summary": [],
        "category": "GENERAL",
        "confidence": "Medium",
        "evidence": "Moderate",
        "impact_score": 7.0,
        "topic_score": 50,
        "country_tags": [],
        "topic_tags": [],
        "event_type": "other",
        "pattern_name": "",
        "sources": [],
        "faq": [],
        "chart_data": {},
        "read_time_mins": estimate_read_time(raw),
    }


def markdown_to_html(text: str) -> str:
    """Basic markdown → HTML conversion."""
    # Headers
    text = re.sub(r'^### (.+)$', r'<h3>\1</h3>', text, flags=re.MULTILINE)
    text = re.sub(r'^## (.+)$',  r'<h2>\1</h2>', text, flags=re.MULTILINE)
    text = re.sub(r'^# (.+)$',   r'<h2>\1</h2>', text, flags=re.MULTILINE)
    # Bold
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
    # Italic
    text = re.sub(r'\*(.+?)\*', r'<em>\1</em>', text)
    # Paragraphs
    paragraphs = text.split('\n\n')
    result = []
    for p in paragraphs:
        p = p.strip()
        if not p:
            continue
        if p.startswith('<h') or p.startswith('<blockquote'):
            result.append(p)
        else:
            result.append(f'<p>{p}</p>')
    return '\n'.join(result)


if __name__ == "__main__":
    # Test generation
    test_topic = "IMF Loan Trap: How Pakistan's 23rd IMF Loan Follows the Same Pattern as Argentina 2001"
    article = generate_article(test_topic)
    if article:
        print(f"\n✓ Article generated: {article['title']}")
        print(f"  Slug: {article['slug']}")
        print(f"  Category: {article['category']}")
        print(f"  Impact: {article['impact_score']}")
        print(f"  FAQ questions: {len(article['faq'])}")
        print(f"  Words: {article['word_count']}")
    else:
        print("✗ Generation failed")
