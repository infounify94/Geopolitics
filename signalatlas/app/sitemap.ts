import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { COUNTRIES } from './countries/page';

export const runtime = 'edge';
export const revalidate = 3600;

const BASE_ROUTES: MetadataRoute.Sitemap = [
  { url: '/', changeFrequency: 'hourly', priority: 1 },
  { url: '/research', changeFrequency: 'hourly', priority: 0.95 },
  { url: '/conflicts', changeFrequency: 'hourly', priority: 0.95 },
  { url: '/countries', changeFrequency: 'daily', priority: 0.9 },
  { url: '/topics', changeFrequency: 'daily', priority: 0.9 },
  { url: '/about', changeFrequency: 'monthly', priority: 0.7 },
  { url: '/team', changeFrequency: 'monthly', priority: 0.7 },
  { url: '/methodology', changeFrequency: 'monthly', priority: 0.8 },
  { url: '/sources', changeFrequency: 'monthly', priority: 0.75 },
  { url: '/confidence', changeFrequency: 'monthly', priority: 0.75 },
  { url: '/contact', changeFrequency: 'monthly', priority: 0.5 },
  // Topic pages
  { url: '/topics/power-networks', changeFrequency: 'daily', priority: 0.85 },
  { url: '/topics/economic-warfare', changeFrequency: 'daily', priority: 0.85 },
  { url: '/topics/sanctions', changeFrequency: 'daily', priority: 0.85 },
  { url: '/topics/conflicts', changeFrequency: 'daily', priority: 0.85 },
  { url: '/topics/arms-trade', changeFrequency: 'daily', priority: 0.8 },
  { url: '/topics/india-lens', changeFrequency: 'daily', priority: 0.85 },
  { url: '/topics/global-south', changeFrequency: 'daily', priority: 0.8 },
  { url: '/topics/media-bias', changeFrequency: 'weekly', priority: 0.75 },
  { url: '/topics/asia', changeFrequency: 'daily', priority: 0.85 },
  { url: '/topics/energy-trade', changeFrequency: 'daily', priority: 0.85 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://signalatlas.com';

  // Fetch published articles
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  const articleEntries: MetadataRoute.Sitemap = (articles || []).map((article) => ({
    url: `${baseUrl}/research/${article.slug}`,
    lastModified: new Date(article.published_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Generate dynamic country profile entries
  const countryEntries: MetadataRoute.Sitemap = COUNTRIES.map((c) => ({
    url: `${baseUrl}/countries/${c.code.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [
    ...BASE_ROUTES.map(r => ({ ...r, url: `${baseUrl}${r.url}`, lastModified: new Date() })),
    ...articleEntries,
    ...countryEntries,
  ];
}


