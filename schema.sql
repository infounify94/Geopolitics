-- SignalAtlas Database Schema
-- Project: Geo Politics (klmzxnkgrhdfhilpevvu)

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- ─────────────────────────────────────────────
-- ARTICLES — Core content table
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS articles (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              text UNIQUE NOT NULL,
  title             text NOT NULL,
  meta_description  text,
  content           text,
  summary_bullets   jsonb DEFAULT '[]',
  category          text NOT NULL DEFAULT 'GENERAL',

  -- Confidence system
  confidence_level  text CHECK (confidence_level IN ('High','Medium','Low')),
  evidence_level    text CHECK (evidence_level IN ('Strong','Moderate','Limited')),
  impact_score      numeric(3,1) CHECK (impact_score BETWEEN 0 AND 10),
  pattern_score     integer CHECK (pattern_score BETWEEN 1 AND 10),
  evergreen_score   integer CHECK (evergreen_score BETWEEN 1 AND 10),

  -- Sources
  sources           jsonb DEFAULT '[]',
  source_count      integer DEFAULT 0,

  -- SEO
  faq               jsonb DEFAULT '[]',
  read_time_mins    integer,
  word_count        integer,

  -- Tagging
  countries         text[] DEFAULT '{}',
  topics            text[] DEFAULT '{}',
  event_type        text,
  chart_suggestions jsonb DEFAULT '[]',

  -- pgvector embedding
  embedding         vector(1536),

  -- Status
  status            text DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  published_at      timestamptz,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_countries ON articles USING gin(countries);
CREATE INDEX IF NOT EXISTS idx_articles_topics ON articles USING gin(topics);
CREATE INDEX IF NOT EXISTS idx_articles_impact ON articles(impact_score DESC);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_articles_fts ON articles
  USING gin(to_tsvector('english', coalesce(title,'') || ' ' || coalesce(meta_description,'') || ' ' || coalesce(content,'')));

-- ─────────────────────────────────────────────
-- CONFLICTS — Live conflict monitor
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS conflicts (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  region        text,
  start_date    date NOT NULL,
  intensity     numeric(3,1) CHECK (intensity BETWEEN 0 AND 10),
  alert_level   text CHECK (alert_level IN ('CRITICAL','HIGH','ACTIVE','WATCH','RESOLVED')),
  status        text DEFAULT 'active' CHECK (status IN ('active','frozen','resolved')),
  description   text,
  updated_at    timestamptz DEFAULT now(),
  created_at    timestamptz DEFAULT now()
);

-- Computed column via view
CREATE OR REPLACE VIEW conflicts_with_days AS
  SELECT *, (CURRENT_DATE - start_date)::integer AS days_active
  FROM conflicts;

-- ─────────────────────────────────────────────
-- COUNTRIES — Country watch panel
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS countries (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL UNIQUE,
  flag_emoji    text,
  alert_level   text CHECK (alert_level IN ('CRITICAL','HIGH','ACTIVE','WATCH')),
  status_line   text,
  article_count integer DEFAULT 0,
  updated_at    timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- ARTICLE CONNECTIONS — Relationship graph
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS article_connections (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_article        uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  to_article          uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  connection_strength integer CHECK (connection_strength BETWEEN 1 AND 100),
  connection_reason   text,
  created_at          timestamptz DEFAULT now(),
  UNIQUE(from_article, to_article)
);

CREATE INDEX IF NOT EXISTS idx_connections_from ON article_connections(from_article);
CREATE INDEX IF NOT EXISTS idx_connections_to ON article_connections(to_article);

-- ─────────────────────────────────────────────
-- TICKER ITEMS — Rotating news bar
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ticker_items (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text       text NOT NULL,
  active     boolean DEFAULT true,
  priority   integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- SUBSCRIBERS — Email list
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscribers (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text UNIQUE NOT NULL,
  active     boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- SIGNAL STATS — Dashboard top stats bar
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS signal_stats (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key        text UNIQUE NOT NULL,
  value      text NOT NULL,
  label      text NOT NULL,
  delta      text,
  trend      text CHECK (trend IN ('up','down','neutral')),
  color      text,
  updated_at timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- AUTO-UPDATE updated_at trigger
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_conflicts_updated_at
  BEFORE UPDATE ON conflicts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticker_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_stats ENABLE ROW LEVEL SECURITY;

-- Public read for published content
CREATE POLICY "Public read published articles" ON articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public read conflicts" ON conflicts
  FOR SELECT USING (true);

CREATE POLICY "Public read countries" ON countries
  FOR SELECT USING (true);

CREATE POLICY "Public read connections" ON article_connections
  FOR SELECT USING (true);

CREATE POLICY "Public read ticker" ON ticker_items
  FOR SELECT USING (active = true);

CREATE POLICY "Public read signal stats" ON signal_stats
  FOR SELECT USING (true);

-- Subscribe insert (anon can insert email)
CREATE POLICY "Anyone can subscribe" ON subscribers
  FOR INSERT WITH CHECK (true);

-- Service role full access (for pipeline)
CREATE POLICY "Service role full access articles" ON articles
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ─────────────────────────────────────────────
-- SEED DATA — Initial conflicts
-- ─────────────────────────────────────────────
INSERT INTO conflicts (name, region, start_date, intensity, alert_level, status, description) VALUES
  ('Gaza–Israel', 'Middle East', '2023-10-07', 9.5, 'CRITICAL', 'active', 'Ongoing military conflict following Oct 7 attacks'),
  ('Russia–Ukraine', 'Europe', '2022-02-24', 9.2, 'CRITICAL', 'active', 'Full-scale Russian invasion of Ukraine'),
  ('Sudan Civil War', 'Africa', '2023-04-15', 8.1, 'HIGH', 'active', 'RSF vs SAF conflict across Sudan'),
  ('Myanmar Junta', 'Asia', '2021-02-01', 7.8, 'HIGH', 'active', 'Military junta vs resistance forces')
ON CONFLICT DO NOTHING;

-- Seed countries
INSERT INTO countries (name, flag_emoji, alert_level, status_line, article_count) VALUES
  ('United States', '🇺🇸', 'HIGH',     'Trade wars + election cycle active', 0),
  ('China',         '🇨🇳', 'HIGH',     'Taiwan + BRI debt diplomacy',        0),
  ('Russia',        '🇷🇺', 'CRITICAL', 'Ukraine war + 267 active sanctions', 0),
  ('India',         '🇮🇳', 'WATCH',    'Strategic realignment underway',     0),
  ('Pakistan',      '🇵🇰', 'HIGH',     'IMF loan #23 + economic crisis',     0),
  ('Israel',        '🇮🇱', 'CRITICAL', 'Gaza conflict ongoing',              0),
  ('Iran',          '🇮🇷', 'HIGH',     'Nuclear talks + regional proxy wars',0),
  ('Ukraine',       '🇺🇦', 'CRITICAL', 'Active war — day 1184+',             0)
ON CONFLICT DO NOTHING;

-- Seed signal stats
INSERT INTO signal_stats (key, value, label, delta, trend, color) VALUES
  ('articles',   '0',    'Research Articles', '+0 this week',     'neutral', '#1e3a5f'),
  ('conflicts',  '4',    'Active Conflicts',  'updated live',     'neutral', '#b91c1c'),
  ('countries',  '87',   'Countries Tracked', 'updated daily',    'neutral', '#1c1c1e'),
  ('patterns',   '0',    'Patterns Found',    '+0 this month',    'neutral', '#14532d'),
  ('arms_trade', '$847B','Arms Trade 2024',   '+14% YoY',         'down',    '#92400e')
ON CONFLICT DO NOTHING;

-- Seed ticker items
INSERT INTO ticker_items (text, priority) VALUES
  ('Sudan ceasefire talks collapse — Day 398 of civil war', 1),
  ('India gold reserves rise for third consecutive month — RBI confirms', 2),
  ('Pakistan IMF loan #23 approved — identical conditions to loan #11 (2013)', 3),
  ('Red Sea disruption adds avg $340 per container for Indian importers', 4),
  ('14 nations match political protest blueprint — new pattern report', 5)
ON CONFLICT DO NOTHING;
