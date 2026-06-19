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
    api_key=os.environ.get("GROQ_API_KEY") or "dummy_key",
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
- Write a LONG, deeply researched article. Minimum 1000 words of actual article content.
- Do NOT use robotic step-by-step headers like "Angle 1" or "Section 4: What Happened".
- You have 17 analytical angles (from the master prompt) — weave them NATURALLY into flowing prose.
- Use fluid transitions. Think "Foreign Affairs magazine meets Bloomberg Intelligence brief".
- Vary your structure by story type: a coup article reads differently from a sanctions article.
- Start strong: the first paragraph must hook the reader with the core finding.
- Use specific numbers, named actors, documented events — not vague generalities.
- CRITICAL: Every section heading MUST be unique. NEVER repeat the same heading or near-identical phrasing.
- Use subheadings that reveal the finding, not just label the section.
  BAD: "The Economic Impact" → GOOD: "How a $40B Trade Route Died Quietly"
  BAD: "What Happened Next" → GOOD: "The 48-Hour Window That Changed the Calculus"
- Bold the single most important finding per section.
- You must insert at least 2 internal markdown links to the provided EVERGREEN ARTICLES within your body text, using format: [Title](/research/slug).
- CRITICAL: Every bullet point and list item MUST include a 1-2 sentence explanation after the label.
  BAD: "• India" → GOOD: "• India — As a major importer dependent on this corridor, New Delhi faces a 12% cost increase in energy imports if the route is disrupted."
  BAD: "• Sanctions tightened" → GOOD: "• Sanctions tightened — The US Treasury designated 14 additional entities in February 2024, cutting off access to dollar clearing for all affiliated firms."
- Avoid repetitive phrases. Avoid weak hedges like "some say" or "it is reported".
- Never start two consecutive paragraphs with the same word.
- Format the actual article text using standard markdown in the `content` field.
- For summary_bullets: each bullet must be a STANDALONE FINDING with a complete sentence — not a label.
  BAD: "Geopolitical significance" → GOOD: "The route carries $3.4 trillion in annual trade, making any disruption immediately felt in European energy markets."

JSON SCHEMA EXPECTED:
{{
  "title": "Article headline — state the finding, not just the event",
  "slug": "url-friendly-slug-max-80-chars",
  "meta_description": "155 char SEO description including India angle if relevant",
  "content": "The full markdown article — minimum 1000 words — flowing prose with unique section headers, bold findings, timeline if relevant, India angle, who-benefits section, and 3 future scenarios. NO robotic numbering. NO duplicate headings. Every list item must have a 1-2 sentence explanation.",
  "summary_bullets": ["Complete standalone finding sentence 1", "Complete standalone finding sentence 2", "Complete standalone finding sentence 3", "Complete standalone finding sentence 4"],
  "category": "One of: POWER NETWORKS, ECONOMIC WARFARE, INDIA LENS, CONFLICTS, MEDIA BIAS, SANCTIONS, ARMS TRADE, GLOBAL SOUTH",
  "confidence_level": "High | Medium | Low",
  "evidence_level": "Strong | Moderate | Limited",
  "impact_score": 8.5,
  "pattern_score": 8,
  "evergreen_score": 7,
  "countries": ["Country1", "Country2"],
  "topics": ["Topic1", "Topic2"],
  "event_type": "war | coup | sanctions | election | economic | protest | diplomatic | other",
  "sources": [
    {{"name": "Reuters", "url": "https://...", "used_for": "Primary reporting"}}
  ],
  "faq": [
    {{"question": "Why is this happening now?", "answer": "2-3 sentence direct answer with specific facts."}},
    {{"question": "How does this affect India?", "answer": "2-3 sentence direct answer with trade/security/diplomacy angle."}},
    {{"question": "Who benefits from this?", "answer": "2-3 sentence direct answer naming specific actors."}},
    {{"question": "What happens next?", "answer": "2-3 sentence direct answer with timeline and conditions."}}
  ],
  "chart_suggestions": [
    {{"type": "bar", "description": "Defence spending comparison of involved nations 2020-2026"}}
  ],
  "read_time_mins": 10
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
            max_tokens=8000,
            temperature=0.65,
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

        # STRICT QUALITY GATE: 3+ SOURCES REQUIRED
        sources = metadata.get("sources", [])
        if len(sources) < 3:
            print(f"  FAILED: Quality Gate Rejected. Only {len(sources)} sources cited, minimum 3 required.")
            return None

        article = {
            "slug":              metadata.get("slug") or slugify(metadata.get("title", topic)),
            "title":             metadata.get("title", topic),
            "meta_description":  metadata.get("meta_description", "")[:155],
            "content":           metadata.get("content", "No content generated."),
            "summary_bullets":   metadata.get("summary_bullets", [])[:3],
            "category":          metadata.get("category", "GENERAL"),
            "confidence_level":  metadata.get("confidence_level", "Medium"),
            "evidence_level":    metadata.get("evidence_level", "Moderate"),
            "impact_score":      float(metadata.get("impact_score", 7.0)),
            "pattern_score":     int(metadata.get("pattern_score", 5)),
            "evergreen_score":   int(metadata.get("evergreen_score", 5)),
            "countries":         metadata.get("countries", []),
            "topics":            metadata.get("topics", []),
            "event_type":        metadata.get("event_type", "other"),
            "sources":           metadata.get("sources", []),
            "source_count":      len(metadata.get("sources", [])),
            "faq":               metadata.get("faq", []),
            "chart_suggestions": metadata.get("chart_suggestions", []),
            "read_time_mins":    metadata.get("read_time_mins") or estimate_read_time(metadata.get("content", "")),
            "word_count":        len(metadata.get("content", "").split()),
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
        "meta_description": topic[:155],
        "content": raw,
        "summary_bullets": [],
        "category": "GENERAL",
        "confidence_level": "Medium",
        "evidence_level": "Moderate",
        "impact_score": 7.0,
        "pattern_score": 5,
        "evergreen_score": 5,
        "countries": [],
        "topics": [],
        "event_type": "other",
        "sources": [],
        "faq": [],
        "chart_suggestions": [],
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
