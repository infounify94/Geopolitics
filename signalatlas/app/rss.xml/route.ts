import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'edge';
export const revalidate = 3600;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://signalatlas.com';

  const { data: articles } = await supabase
    .from('articles')
    .select('title, slug, summary, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(20);

  const rssItems = (articles || []).map((article) => {
    return `
      <item>
        <title><![CDATA[${article.title}]]></title>
        <link>${baseUrl}/research/${article.slug}</link>
        <guid isPermaLink="true">${baseUrl}/research/${article.slug}</guid>
        <pubDate>${new Date(article.published_at).toUTCString()}</pubDate>
        <description><![CDATA[${article.summary}]]></description>
      </item>
    `;
  }).join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>SignalAtlas Intelligence</title>
    <link>${baseUrl}</link>
    <description>Deep research on global events - conflicts, power networks, economic warfare, and the India angle.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
