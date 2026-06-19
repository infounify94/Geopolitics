export interface Article {
  id: string;
  slug: string;
  title: string;
  meta_description: string | null;
  content: string | null;
  summary_bullets: string[];
  category: string;
  confidence_level: 'High' | 'Medium' | 'Low' | null;
  evidence_level: 'Strong' | 'Moderate' | 'Limited' | null;
  impact_score: number | null;
  pattern_score: number | null;
  evergreen_score: number | null;
  sources: Source[];
  source_count: number;
  faq: FAQ[];
  read_time_mins: number | null;
  word_count: number | null;
  countries: string[];
  topics: string[];
  event_type: string | null;
  chart_suggestions: ChartSuggestion[];
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // Authorship & article type (Phase 3 additions)
  author_name: string | null;
  author_slug: string | null;
  article_type: 'analysis' | 'live_update' | 'explainer' | null;
}

export interface Source {
  name: string;
  url?: string;
  type?: string;
  used_for?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ChartSuggestion {
  type: string;
  description: string;
}

export interface Conflict {
  id: string;
  name: string;
  region: string | null;
  start_date: string;
  days_active?: number;
  intensity: number | null;
  alert_level: 'CRITICAL' | 'HIGH' | 'ACTIVE' | 'WATCH' | 'RESOLVED' | null;
  status: string;
  description: string | null;
}

export interface Country {
  id: string;
  name: string;
  flag_emoji: string | null;
  alert_level: 'CRITICAL' | 'HIGH' | 'ACTIVE' | 'WATCH' | null;
  status_line: string | null;
  article_count: number;
}

export interface ArticleConnection {
  id: string;
  from_article: string;
  to_article: string;
  connection_strength: number | null;
  connection_reason: string | null;
}

export interface TickerItem {
  id: string;
  text: string;
  active: boolean;
  priority: number;
}

export interface SignalStat {
  id: string;
  key: string;
  value: string;
  label: string;
  delta: string | null;
  trend: 'up' | 'down' | 'neutral' | null;
  color: string | null;
}

export const CATEGORY_COLORS: Record<string, { color: string; bg: string }> = {
  'POWER NETWORKS':   { color: '#b91c1c', bg: '#fee2e2' },
  'ECONOMIC WARFARE': { color: '#92400e', bg: '#fef3c7' },
  'INDIA LENS':       { color: '#14532d', bg: '#dcfce7' },
  'CONFLICTS':        { color: '#b91c1c', bg: '#fee2e2' },
  'MEDIA BIAS':       { color: '#1e3a5f', bg: '#dbeafe' },
  'SANCTIONS':        { color: '#6b21a8', bg: '#f3e8ff' },
  'ARMS TRADE':       { color: '#92400e', bg: '#fef3c7' },
  'GLOBAL SOUTH':     { color: '#14532d', bg: '#dcfce7' },
  'GENERAL':          { color: '#3a3a3c', bg: '#f5f4f0' },
};
