# SIGNALATLAS — MASTER PROJECT PROMPT
# Paste this entire file into Antigravity as your project context.
# This covers: Mission, Content Strategy, Article Writing Rules,
# Topic Discovery, Scraping Pipeline, APIs, and SEO Architecture.

---

## PART 1 — WHO WE ARE AND WHY WE EXIST

### The Motto
> "Global events don't happen in isolation. Every war, every economic crisis,
> every protest movement is connected to something before it, something beside it,
> and something that benefits from it. SignalAtlas finds those connections."

### What We Are
SignalAtlas is an independent geopolitical research platform.
We are NOT:
- A news site (we don't break news)
- An opinion blog (we don't editorialize without evidence)
- A conspiracy site (we don't publish claims without public documentation)
- A partisan outlet (we don't serve any government or ideology)

We ARE:
- A research archive that connects historical patterns to current events
- A data journalism platform that makes complex geopolitics readable
- An India-lens platform that contextualises global events for Indian readers
- A source confidence platform — every claim carries a confidence and evidence rating

### What We Tell Our Readers
We tell readers three things mainstream media never tells them together:

1. WHAT HAPPENED — clearly, with a timeline, with named actors
2. WHY IT HAPPENED — the economic, strategic, or political forces behind it
3. WHO BENEFITS — follow the money, follow the power, follow the pattern

Our readers should finish every article feeling:
- "I understand this event now, not just what happened but why"
- "I see how this connects to things I've read before"
- "I never saw this angle covered anywhere else"
- "I need to share this"

### Our Core Promise to Readers
Every article on SignalAtlas is:
- Based entirely on publicly available sources (named and linked)
- Rated for confidence level (High / Medium / Low)
- Rated for evidence strength (Strong / Moderate / Weak)
- Connected to at least 3 related events in our archive
- Written to age well — researched pieces, not daily reactions

---

## PART 2 — HOW WE PICK ARTICLE TOPICS

### Topic Discovery Pipeline (Automated — runs every 6 hours via GitHub Actions)

#### Layer 1 — Breaking Event Detection
These APIs and scrapers identify what is happening RIGHT NOW:

```
APIS (free tiers):
├── NewsAPI.org          → 100 requests/day free
│   Endpoint: https://newsapi.org/v2/top-headlines
│   Query params: country=us,in | category=politics,world | q=[keyword]
│   Use for: Surface trending geopolitical events globally
│
├── GNews API            → 100 requests/day free
│   Endpoint: https://gnews.io/api/v4/search
│   Use for: Regional news including India, Middle East, Africa
│
├── GDELT Project        → Completely free, no API key needed
│   Endpoint: https://api.gdeltproject.org/api/v2/doc/doc
│   Use for: Global event database updated every 15 minutes
│   Best source for conflict escalation, protest events, diplomatic shifts
│
└── Google Trends        → Free via pytrends Python library
    Use for: What topics are spiking in search volume
    Install: pip install pytrends
    Focus on: India, USA, UK, Germany, Brazil searches
```

#### Layer 2 — RSS Feed Scraper (Python feedparser)
Scrape these sources every 6 hours for full article titles and summaries:

```python
RSS_FEEDS = [
    # International — multiple perspectives
    "http://feeds.bbci.co.uk/news/world/rss.xml",           # BBC World
    "https://feeds.reuters.com/reuters/worldNews",           # Reuters
    "https://www.aljazeera.com/xml/rss/all.xml",            # Al Jazeera
    "https://rss.scmp.com/rss/5",                           # South China Morning Post
    "https://timesofindia.indiatimes.com/rss.cms",          # Times of India
    "https://thewire.in/feed",                               # The Wire India
    "https://scroll.in/feed",                               # Scroll.in India
    "https://www.thehindu.com/news/international/?service=rss", # The Hindu

    # Specialist sources
    "https://www.sipri.org/rss/news",                       # Arms trade (SIPRI)
    "https://www.imf.org/en/News/Rss",                      # IMF news
    "https://news.un.org/feed/subscribe/en/news/all/rss.xml", # UN News
    "https://www.worldbank.org/en/news/rss",                # World Bank
]
```

#### Layer 3 — Reddit Signal Detection
```python
# Use PRAW (Python Reddit API Wrapper)
# pip install praw
SUBREDDITS = [
    "r/geopolitics",      # 1.2M members — academic geo-politics discussion
    "r/worldnews",        # 30M members — breaking global news
    "r/india",            # India perspective
    "r/Economics",        # Economic warfare, sanctions
    "r/NeutralPolitics",  # Balanced political analysis
]
# Track: posts with 500+ upvotes in last 24h = trending research topic
```

#### Layer 4 — Wikipedia Recent Changes (Free API)
```
Endpoint: https://en.wikipedia.org/w/api.php?action=query&list=recentchanges
Use for: When a Wikipedia page about a country/conflict gets heavy edits,
         something significant is happening there.
```

---

## PART 3 — TOPIC SCORING SYSTEM

Before any article is written, the AI pipeline scores each discovered topic:

```python
TOPIC_SCORE = {
    "global_impact":    0-30,  # How many countries affected
    "india_relevance":  0-25,  # Direct India connection score
    "pattern_match":    0-20,  # Does this match a known historical pattern
    "search_volume":    0-15,  # Google Trends spike score
    "source_depth":     0-10,  # How many quality sources available
}
# Total: 0-100
# Publish threshold: score >= 55
# Priority publish: score >= 80
```

Only topics scoring above 55 proceed to the AI writer.
This ensures quality and prevents irrelevant content.

---

## PART 4 — THE ARTICLE WRITING SYSTEM

### Who Our AI Writer Is
The AI writes as a senior geopolitical research analyst with 25 years of experience
across war zones, financial intelligence, and international relations.
Tone: Confident. Analytical. Evidence-first. Never sensational.
Style: Think Foreign Affairs magazine meets Bloomberg Intelligence brief.

### Mandatory Article Structure (Every Article Must Follow This)

```
═══════════════════════════════════════════════════════
SECTION 1: DOCUMENT HEADER (metadata, not shown to reader)
═══════════════════════════════════════════════════════
- Article ID (auto-generated: SA-YYYY-MMDD-NNN)
- Region tags (max 3 countries/regions)
- Topic tags (max 5)
- Event type: War | Sanctions | Politics | Economic | Military | Protest
- Confidence level: High | Medium | Low
- Evidence strength: Strong | Moderate | Weak
- Impact score: 1-10
- Sources used: [] (list all, minimum 3)
- Related articles: [] (from our archive)

═══════════════════════════════════════════════════════
SECTION 2: HEADLINE
═══════════════════════════════════════════════════════
Rules:
- State the finding, not just the event
- Bad:  "Protests Break Out in Country X"
- Good: "Country X Protests Follow 14-Nation Pattern Tied to Same NGO Network"
- Max 90 characters
- No question headlines
- No clickbait ("You Won't Believe...")
- Must contain the primary keyword naturally

═══════════════════════════════════════════════════════
SECTION 3: QUICK SUMMARY (3-5 bullet points)
═══════════════════════════════════════════════════════
- Each bullet = one standalone finding
- Written so someone reading only this understands the core story
- This section gets pulled by Google AI Overviews — write for that
- Example:
  → 14 countries show identical protest blueprint tied to same 6 NGOs
  → FARA filings show $340M in foreign funding to involved organisations
  → Pattern accuracy rate: 71% across tracked cases since 2000
  → India recorded 3 similar foreign-funded campaigns (2012, 2016, 2021)

═══════════════════════════════════════════════════════
SECTION 4: WHAT HAPPENED
═══════════════════════════════════════════════════════
- State events clearly: who, what, when, where
- Use specific dates, named actors, documented facts
- No vague language like "some say" or "reportedly"
- If uncertain: "According to [source], ..." or "Available evidence suggests..."
- 150-250 words

═══════════════════════════════════════════════════════
SECTION 5: TIMELINE
═══════════════════════════════════════════════════════
Format:
[DATE] → [EVENT] → [Source]
[DATE] → [EVENT] → [Source]
Minimum 5 timeline entries
Maximum 12 entries
Cover: buildup, trigger, escalation, current status

═══════════════════════════════════════════════════════
SECTION 6: KEY ACTORS
═══════════════════════════════════════════════════════
List: Name | Role | Their interest in this event | Public record basis
Include: governments, organisations, corporations, individuals (public figures only)
Do NOT: name private individuals without documented public role

═══════════════════════════════════════════════════════
SECTION 7: FOLLOW THE MONEY
═══════════════════════════════════════════════════════
- Who financially benefits from this event?
- Trace funding trails from public documents
- Name specific corporations, funds, or governments with documented interest
- Use: corporate filings, government budgets, IMF/World Bank data, SIPRI
- Suggest a chart: [CHART: Bar chart showing defence spending of involved nations]

═══════════════════════════════════════════════════════
SECTION 8: GLOBAL POWER IMPACT
═══════════════════════════════════════════════════════
How does this event shift global balance for each major actor:
- United States: [impact]
- China: [impact]
- Russia: [impact]
- European Union: [impact]
- BRICS: [impact]
What is the 6-month strategic implication?

═══════════════════════════════════════════════════════
SECTION 9: INDIA LENS (MANDATORY IN EVERY ARTICLE)
═══════════════════════════════════════════════════════
Even if the event has no obvious India connection, find it.
Cover:
- Strategic: Does this shift India's geopolitical position?
- Economic: Trade routes, oil prices, export/import impact
- Diplomatic: What should India's response be and why?
- Opportunity: Is there a strategic opportunity for India here?
- Diaspora: Any Indian community directly affected?
Suggest a data point: [DATA: India's trade with affected country: $X billion]

═══════════════════════════════════════════════════════
SECTION 10: DATA VISUALISATION SUGGESTIONS
═══════════════════════════════════════════════════════
Specify exactly what chart the developer should build:
[CHART_TYPE: area_chart | TITLE: X | X_AXIS: Y | DATA_SOURCE: Z]
[CHART_TYPE: bar_chart   | TITLE: X | METRIC: Y | COUNTRIES: Z]
[CHART_TYPE: timeline    | TITLE: X | EVENTS: from Section 5]
[CHART_TYPE: radar       | TITLE: Media Coverage Comparison | OUTLETS: BBC,RT,AJ]
Minimum 1 chart suggestion per article.
Maximum 3 chart suggestions per article.

═══════════════════════════════════════════════════════
SECTION 11: MEDIA COVERAGE COMPARISON
═══════════════════════════════════════════════════════
How did each outlet frame this story differently:
- Western mainstream (BBC/CNN/NYT angle): [summary]
- Eastern/alternative (RT/CGTN/Al Jazeera angle): [summary]
- Indian media angle: [summary]
- What ALL of them avoided saying: [the gap]
- What questions nobody is publicly asking: [your contribution]

═══════════════════════════════════════════════════════
SECTION 12: HISTORICAL PARALLELS
═══════════════════════════════════════════════════════
Find minimum 2, maximum 4 historical parallels:
- [Year + Country + Event]: How it matches current situation
- Pattern name (from our taxonomy below)
- Outcome of historical case
- What that suggests for current trajectory

PATTERN TAXONOMY (use these exact names for database consistency):
- "Political Protest Blueprint" (replaces "Color Revolution")
- "IMF Dependency Cycle"
- "Proxy Conflict Architecture"
- "Sanctions Economic Warfare"
- "Media Narrative Engineering"
- "Resource Extraction Conflict"
- "Regime Transition Template"
- "Strategic Debt Diplomacy"

═══════════════════════════════════════════════════════
SECTION 13: CONNECTED EVENTS (from our archive)
═══════════════════════════════════════════════════════
List 3-5 articles already in the SignalAtlas archive that connect:
[Article ID] → [Title] → [How it connects]
If archive is empty at launch, suggest future articles to create:
[FUTURE_ARTICLE: title suggestion for related research]

═══════════════════════════════════════════════════════
SECTION 14: WHAT HAPPENS NEXT
═══════════════════════════════════════════════════════
Three scenarios based on historical pattern:
SCENARIO A (Most likely — X% based on pattern): [prediction]
SCENARIO B (Best case): [prediction]
SCENARIO C (Escalation case): [prediction]
Watch signals: What specific events in next 30/90 days would confirm each scenario?

═══════════════════════════════════════════════════════
SECTION 15: FAQ (minimum 4 questions — critical for SEO)
═══════════════════════════════════════════════════════
Q: Why is [event] happening now?
A: [2-3 sentence direct answer]

Q: How does [event] affect India?
A: [2-3 sentence direct answer]

Q: Who benefits from [event]?
A: [2-3 sentence direct answer]

Q: What happens next with [event]?
A: [2-3 sentence direct answer]
[Add more questions relevant to the specific topic]

═══════════════════════════════════════════════════════
SECTION 16: SOURCES
═══════════════════════════════════════════════════════
List every source used:
[Source name] | [URL or reference] | [What it was used for]
Minimum 4 sources. Maximum unlimited.
Priority sources: UN, World Bank, IMF, SIPRI, Reuters, AP, government filings
Avoid: Anonymous sources, unverifiable blogs, single-source claims

═══════════════════════════════════════════════════════
SECTION 17: CONFIDENCE DECLARATION
═══════════════════════════════════════════════════════
Overall Confidence: High | Medium | Low
Overall Evidence:   Strong | Moderate | Weak
Reasoning: [One sentence explaining the rating]
What would upgrade this to stronger evidence: [specific missing data]
```

---

## PART 5 — WRITING STYLE RULES

### Tone
- Authoritative without being arrogant
- Analytical without being cold
- Critical of power without being conspiratorial
- Direct — state the finding in the first paragraph

### Language Rules
- Short paragraphs — max 4 sentences
- One idea per paragraph
- Use active voice: "The US imposed sanctions" not "Sanctions were imposed"
- Subheadings every 250-300 words
- Bold only the single most important finding in each section
- Never use: "It is important to note", "Needless to say", "In conclusion"
- Always use: "According to [source]", "Public records show", "Data from [source] indicates"

### What to NEVER write
- Fabricated quotes — if no documented quote exists, do not invent one
- Unverified statistics — every number needs a source
- Personal attacks on private individuals
- Content that could incite violence against any group
- Definitive claims about classified information
- Headlines designed purely for emotional manipulation

### Credibility Phrases (use these, they protect AdSense approval)
- "According to publicly available records..."
- "Data from [source] shows..."
- "The pattern suggests, though not conclusively..."
- "Analysts who have studied similar cases note..."
- "Public filings indicate..."
- "Available evidence points to..."

### Reading Level
- Target: Grade 10-12 level
- Accessible to an educated non-expert
- Explain acronyms on first use
- Define geopolitical terms in context

---

## PART 6 — SEO ARCHITECTURE

### URL Structure (always follow this)
```
/research/[topic-slug]/[article-slug]
Examples:
/research/sanctions/russia-swift-bypass-blueprint-2024
/research/india/india-dollar-yuan-strategic-ambiguity
/research/protest-patterns/political-protest-blueprint-14-countries
```

No dates in URLs — articles are evergreen, dates make them look stale.

### Title Tag Format
```
[Primary Keyword]: [Finding or angle] | SignalAtlas
Example:
"IMF Loan Trap: How 40 Nations Lost Policy Sovereignty | SignalAtlas"
Max 60 characters before the pipe.
```

### Meta Description Format
```
[What happened] + [Why it matters] + [India angle if applicable]. Research-based analysis with data.
Example:
"Pakistan's 23rd IMF loan follows an identical pattern to 8 prior cases.
We traced the conditions, outcomes, and who benefits. India implications inside."
Max 155 characters.
```

### Internal Linking Rules
- Every article links to minimum 3 other SignalAtlas articles
- Use descriptive anchor text: "the IMF dependency cycle in Pakistan" not "click here"
- Link to:
  1. The most relevant topic pillar page
  2. A historical parallel article
  3. The relevant country page

### FAQ Schema (add to every article page)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why is [event] happening?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[answer from Section 15]"
      }
    }
  ]
}
```

---

## PART 7 — TECH STACK TO BUILD

```
Frontend:     Next.js 14 (App Router + ISR)
Hosting:      Cloudflare Pages (free plan)
Database:     Supabase (PostgreSQL — free tier)
AI Writer:    OpenRouter API (Llama 3.3 70B — free tier)
Fallback AI:  Groq API (fast, free tier)
Automation:   GitHub Actions (cron every 6 hours)
Search:       Supabase full-text search (built-in, free)
Analytics:    Plausible (or Cloudflare Web Analytics — free)
Charts:       Recharts + D3.js (in-article)
Domain:       SignalAtlas.com (custom, ~₹800/year)
```

### ISR Configuration for Cloudflare Pages
```javascript
// revalidate = 3600 means page rebuilds every hour automatically
// No manual deploy needed when new articles are published
export const revalidate = 3600;
```

### GitHub Actions Cron Schedule
```yaml
# Runs every 6 hours automatically
schedule:
  - cron: '0 */6 * * *'
# Steps:
# 1. Python scraper fetches topics from APIs + RSS
# 2. Scores each topic (threshold: 55/100)
# 3. OpenRouter writes articles for top 3 scored topics
# 4. Saves to Supabase
# 5. Triggers Cloudflare Pages ISR rebuild
# New articles are live within 10 minutes — zero manual work
```

---

## PART 8 — SUPABASE DATABASE SCHEMA

```sql
-- Articles table
CREATE TABLE articles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_id          TEXT UNIQUE,          -- SA-2026-0523-001
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  meta_desc       TEXT,
  body_mdx        TEXT,                 -- Full article in MDX format
  quick_summary   TEXT[],               -- Array of bullet points
  country_tags    TEXT[],               -- ["India", "USA", "China"]
  topic_tags      TEXT[],
  event_type      TEXT,
  pattern_name    TEXT,                 -- From pattern taxonomy
  confidence      TEXT,                 -- High/Medium/Low
  evidence        TEXT,                 -- Strong/Moderate/Weak
  impact_score    DECIMAL(3,1),         -- 1.0 to 10.0
  sources         JSONB,                -- [{name, url, used_for}]
  chart_data      JSONB,                -- Auto-generated chart configs
  related_ids     UUID[],               -- Links to other articles
  faq             JSONB,                -- [{q, a}]
  published_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  topic_score     INTEGER,              -- 0-100 from scoring system
  read_time_mins  INTEGER
);

-- Events archive (historical database — grows over time)
CREATE TABLE events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  start_date      DATE,
  end_date        DATE,
  countries       TEXT[],
  event_type      TEXT,
  pattern_name    TEXT,
  outcome         TEXT,
  impact_score    DECIMAL(3,1),
  linked_articles UUID[]
);

-- Countries table
CREATE TABLE countries (
  code            TEXT PRIMARY KEY,     -- "IN", "US", "RU"
  name            TEXT NOT NULL,
  flag_emoji      TEXT,
  alert_level     TEXT,                 -- Critical/High/Watch/Monitor
  status_summary  TEXT,
  article_count   INTEGER DEFAULT 0,
  last_updated    TIMESTAMPTZ
);

-- Patterns table (the core differentiator)
CREATE TABLE patterns (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT UNIQUE NOT NULL, -- From taxonomy
  description     TEXT,
  match_count     INTEGER DEFAULT 0,    -- How many times detected
  countries       TEXT[],               -- Countries where seen
  accuracy_pct    INTEGER,              -- How often pattern predicts outcome
  linked_articles UUID[]
);
```

---

## PART 9 — PYTHON PIPELINE CODE STRUCTURE

```
/pipeline
  ├── scraper.py        → Fetches from RSS + APIs
  ├── scorer.py         → Scores topics 0-100
  ├── writer.py         → Calls OpenRouter with mega prompt
  ├── publisher.py      → Saves to Supabase
  ├── charts.py         → Generates chart config JSON
  └── main.py           → Orchestrates all steps
```

### writer.py — OpenRouter call structure
```python
import requests

def write_article(topic_data):
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}"},
        json={
            "model": "meta-llama/llama-3.3-70b-instruct:free",
            "messages": [
                {
                    "role": "system",
                    "content": MEGA_PROMPT  # The full prompt from Part 4
                },
                {
                    "role": "user",
                    "content": f"""
                    Write a full SignalAtlas research article on this topic:
                    
                    EVENT: {topic_data['title']}
                    REGION: {topic_data['region']}
                    SOURCES FOUND: {topic_data['sources']}
                    TOPIC SCORE: {topic_data['score']}
                    INDIA CONNECTION: {topic_data['india_angle']}
                    
                    Follow the complete 17-section article structure exactly.
                    Output valid JSON matching the Supabase schema.
                    """
                }
            ],
            "max_tokens": 4000,
        }
    )
    return response.json()
```

---

## PART 10 — WHAT TO BUILD IN ANTIGRAVITY (Week by Week)

### Week 1 — Foundation
```
Task: Build Next.js project structure
- /app/page.tsx           → Homepage (use signalatlas-intelligence.jsx as reference)
- /app/research/[slug]/page.tsx  → Article page template
- /app/country/[code]/page.tsx   → Country hub page
- /app/topic/[slug]/page.tsx     → Topic cluster page
- /components/ArticleCard.tsx    → Reusable article card
- /components/ConflictTracker.tsx
- /components/RelationshipGraph.tsx
- /components/ConfidenceBadge.tsx
- /components/DataStrip.tsx      → Inline data numbers
- /lib/supabase.ts               → Database client
```

### Week 2 — Pipeline
```
Task: Build Python automation
- pipeline/scraper.py    → RSS + API fetcher
- pipeline/scorer.py     → Topic scoring
- pipeline/writer.py     → OpenRouter article writer
- pipeline/publisher.py  → Supabase publisher
- .github/workflows/pipeline.yml → 6-hour cron
```

### Week 3 — SEO Layer
```
Task: SEO and schema
- sitemap.xml auto-generation
- robots.txt
- JSON-LD schema per article (Article + FAQPage + BreadcrumbList)
- Meta tags via Next.js generateMetadata()
- Open Graph images (auto-generated per article)
```

### Week 4 — Seed + Launch
```
Task: Content and launch
- Write 30 seed articles manually using the mega prompt
- Cover: 6 active conflicts, 5 country profiles, 8 topic deep-dives
- Verify all internal links work
- Submit sitemap to Google Search Console
- Launch
```

---

## REFERENCE — DESIGN FILES

The homepage UI is built and ready in:
signalatlas-intelligence.jsx

This file contains:
- Complete homepage design with dark intelligence theme
- World map SVG with pulsing conflict hotspots
- Signal strip with live stats
- Article cards with inline data strips
- Conflict monitor sidebar
- Country watch panel
- Relationship graph (hover-interactive)
- Media bias radar chart
- Topic explorer bar
- Full responsive mobile layout
- Gold (#c9a84c) + deep navy (#0c0e14) colour system
- Cormorant Garamond + Syne + JetBrains Mono typography

Use this as the visual reference for all page designs.
Maintain the same colour system, typography, and card patterns across all pages.

---

END OF SIGNALATLAS MASTER PROMPT
Version: 1.0 | Date: May 2026
