import { createServerClient, supabase } from './supabase';
import type { Article, Conflict, Country, SignalStat, TickerItem } from './types';

// ─── Articles ─────────────────────────────────────────────────

export async function getFeaturedArticles(limit = 3): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('impact_score', { ascending: false })
    .limit(limit);
  if (error) { console.error('getFeaturedArticles:', error); return []; }
  return (data as Article[]) ?? [];
}

export async function getRecentArticles(limit = 6): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('id, slug, title, category, confidence_level, impact_score, published_at, countries, topics')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit);
  if (error) { console.error('getRecentArticles:', error); return []; }
  return (data as Article[]) ?? [];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  if (error) { console.error('getArticleBySlug:', error); return null; }
  return data as Article;
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('slug')
    .eq('status', 'published');
  if (error) { console.error('getAllPublishedSlugs:', error); return []; }
  return data?.map((r: { slug: string }) => r.slug) ?? [];
}

export async function getRelatedArticles(
  articleId: string,
  limit = 3
): Promise<Article[]> {
  const { data, error } = await supabase
    .from('article_connections')
    .select('to_article, connection_strength, connection_reason, articles!to_article(id, slug, title, category, impact_score, confidence_level, published_at)')
    .eq('from_article', articleId)
    .order('connection_strength', { ascending: false })
    .limit(limit);
  if (error) { console.error('getRelatedArticles:', error); return []; }
  return (data as any)?.map((d: any) => d.articles).filter(Boolean) ?? [];
}

export async function searchArticles(query: string, limit = 10): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('id, slug, title, category, confidence_level, impact_score, published_at')
    .eq('status', 'published')
    .textSearch('title', query, { type: 'websearch' })
    .limit(limit);
  if (error) { console.error('searchArticles:', error); return []; }
  return (data as Article[]) ?? [];
}

// ─── Conflicts ────────────────────────────────────────────────

export async function getActiveConflicts(): Promise<Conflict[]> {
  const { data, error } = await supabase
    .from('conflicts_with_days')
    .select('*')
    .neq('status', 'resolved')
    .order('intensity', { ascending: false });
  if (error) { console.error('getActiveConflicts:', error); return []; }
  return (data as Conflict[]) ?? [];
}

// ─── Countries ────────────────────────────────────────────────

export async function getTopCountries(limit = 8): Promise<Country[]> {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .order('article_count', { ascending: false })
    .limit(limit);
  if (error) { console.error('getTopCountries:', error); return []; }
  return (data as Country[]) ?? [];
}

// ─── Signal Stats ─────────────────────────────────────────────

export async function getSignalStats(): Promise<SignalStat[]> {
  const { data, error } = await supabase
    .from('signal_stats')
    .select('*')
    .order('key');
  if (error) { console.error('getSignalStats:', error); return []; }
  return (data as SignalStat[]) ?? [];
}

// ─── Ticker ───────────────────────────────────────────────────

export async function getTickerItems(): Promise<TickerItem[]> {
  const { data, error } = await supabase
    .from('ticker_items')
    .select('*')
    .eq('active', true)
    .order('priority');
  if (error) { console.error('getTickerItems:', error); return []; }
  return (data as TickerItem[]) ?? [];
}

// ─── Subscribe ────────────────────────────────────────────────

export async function subscribeEmail(email: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('subscribers')
    .insert({ email });
  if (error) {
    if (error.code === '23505') return { success: false, error: 'Already subscribed!' };
    return { success: false, error: 'Something went wrong.' };
  }
  return { success: true };
}

// ─── Article count ────────────────────────────────────────────

export async function getPublishedArticleCount(): Promise<number> {
  const { count, error } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');
  if (error) return 0;
  return count ?? 0;
}

// ─── Dynamic Charts Data ──────────────────────────────────────

export async function getDashboardStats() {
  // Try to get actual stats from DB, or fallback to sensible defaults based on data
  const { count: articleCount } = await supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published');
  const { count: countryCount } = await supabase.from('countries').select('*', { count: 'exact', head: true });
  const { count: patternCount } = await supabase.from('patterns').select('*', { count: 'exact', head: true });

  return {
    articles: articleCount || 1,
    countries: countryCount || 1,
    patterns: patternCount || 1,
    accuracy: 89 // Placeholder as accuracy requires complex historical validation
  };
}

export async function getLatestChartData() {
  const { data, error } = await supabase
    .from('articles')
    .select('chart_data')
    .eq('status', 'published')
    .not('chart_data', 'is', null)
    .order('published_at', { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) {
    return {
      western: 80,
      eastern: 70,
      globalSouth: 40,
    };
  }
  
  // Extract chart data from the JSON column if it matches radar schema
  const cd = data[0].chart_data as any;
  return {
    western: cd?.western || 80,
    eastern: cd?.eastern || 70,
    globalSouth: cd?.globalSouth || 40,
  };
}

export async function getGraphConnections() {
  // Fetch recent articles to build a relation graph
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, category')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(5);
    
  if (error || !data || data.length === 0) return { nodes: [], edges: [] };
  
  const colors = ['#b91c1c', '#92400e', '#14532d', '#1e3a5f', '#6b21a8'];
  const coords = [
    { x: 100, y: 90, r: 36 },
    { x: 250, y: 60, r: 30 },
    { x: 380, y: 95, r: 27 },
    { x: 215, y: 175, r: 25 },
    { x: 340, y: 190, r: 22 },
  ];

  const nodes = data.map((a, i) => {
    // Break the title into two parts safely
    const words = a.title.split(' ');
    const firstLine = words.slice(0, 2).join(' ');
    const secondLine = words.slice(2, 4).join(' ') + (words.length > 4 ? '...' : '');

    return {
      id: i, // Use index for edge connection
      dbId: a.id,
      label: [firstLine, secondLine],
      category: a.category,
      x: coords[i]?.x || 200,
      y: coords[i]?.y || 100,
      r: coords[i]?.r || 20,
      color: colors[i % colors.length]
    };
  });
  
  const edges: any[] = [];
  // For visual appeal, create a star or random connections between recent nodes
  for (let i = 1; i < nodes.length; i++) {
    edges.push({
      s: 0,
      t: i,
      w: Math.floor(Math.random() * 50) + 50
    });
  }
  
  return { nodes, edges };
}
