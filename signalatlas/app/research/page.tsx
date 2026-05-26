import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import LatestResearch from '@/components/LatestResearch';
import { getRecentArticles } from '@/lib/queries';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Research Archive — All Geopolitical Intelligence Reports | SignalAtlas',
  description: 'Complete archive of SignalAtlas geopolitical intelligence reports — conflicts, sanctions, power networks, economic warfare, and India strategic analysis. Updated daily.',
  keywords: ['geopolitical research archive', 'conflict analysis reports', 'sanctions intelligence', 'power network research', 'India strategic analysis'],
};

export const revalidate = 300; // 5 minutes

const CATEGORIES = [
  { slug: 'POWER NETWORKS', label: 'Power Networks', color: '#E24B4A' },
  { slug: 'ECONOMIC WARFARE', label: 'Economic Warfare', color: '#E8931A' },
  { slug: 'INDIA LENS', label: 'India Lens', color: '#FF9933' },
  { slug: 'CONFLICTS', label: 'Conflicts', color: '#DC2626' },
  { slug: 'SANCTIONS', label: 'Sanctions', color: '#3B82F6' },
  { slug: 'ARMS TRADE', label: 'Arms Trade', color: '#7C3AED' },
  { slug: 'GLOBAL SOUTH', label: 'Global South', color: '#059669' },
  { slug: 'MEDIA BIAS', label: 'Media Bias', color: '#0891B2' },
];

export default async function ResearchPage() {
  const articles = await getRecentArticles(20);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://signalatlas.com';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Research Archive — SignalAtlas',
    description: 'All geopolitical intelligence reports and analysis.',
    url: `${siteUrl}/research`,
    numberOfItems: articles.length,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Nav />

      {/* Dark header matching other pages */}
      <div style={{ background: 'var(--navy)', padding: '3rem 2rem 2.5rem', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '.5rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E' }} />
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'rgba(255,255,255,.5)', letterSpacing: '.12em', textTransform: 'uppercase' }}>Research Archive</div>
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, color: 'var(--white)', letterSpacing: '-.02em', marginBottom: '.75rem' }}>
            Intelligence Database
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.55)', maxWidth: 600, lineHeight: 1.7 }}>
            Evidence-based geopolitical research across 10 intelligence themes. Confidence-scored, source-cited, updated daily from our AI-augmented pipeline.
          </p>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,.1)', flexWrap: 'wrap' }}>
            {[
              [String(articles.length > 0 ? articles.length + '+' : '—'), 'Articles Available'],
              ['Daily', 'New Research'],
              ['17', 'Analytical Angles'],
              ['195', 'Nations Covered'],
            ].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--amber)' }}>{n}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'rgba(255,255,255,.4)', letterSpacing: '.08em', textTransform: 'uppercase' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>

        {/* Category filter row */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <a href="/research" style={{ fontFamily: 'var(--mono)', fontSize: 10, padding: '5px 12px', borderRadius: 2, background: 'var(--navy)', color: 'var(--amber)', border: '1px solid var(--navy)', textDecoration: 'none', letterSpacing: '.04em', fontWeight: 600 }}>
            All
          </a>
          {CATEGORIES.map(c => (
            <a key={c.slug} href={`/research?cat=${encodeURIComponent(c.slug)}`}
              style={{ fontFamily: 'var(--mono)', fontSize: 10, padding: '5px 12px', borderRadius: 2, background: 'var(--white)', color: c.color, border: `1px solid ${c.color}44`, textDecoration: 'none', letterSpacing: '.04em' }}>
              {c.label}
            </a>
          ))}
        </div>

        {articles.length > 0 ? (
          <LatestResearch articles={articles} />
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            <div style={{ fontSize: 36, marginBottom: '1rem' }}>📡</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '.5rem' }}>Pipeline Initialising</div>
            <p style={{ color: 'var(--ink3)', fontSize: 14 }}>Articles are being generated. Check back shortly or run the pipeline manually.</p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
