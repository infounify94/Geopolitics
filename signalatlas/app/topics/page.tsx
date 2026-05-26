import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Research Topics — Geopolitical Intelligence by Theme | SignalAtlas',
  description: 'Browse SignalAtlas intelligence by topic: Power Networks, Economic Warfare, Sanctions, Conflicts, Arms Trade, India Lens, Global South, and Media Bias.',
  keywords: ['geopolitical topics', 'power networks', 'economic warfare', 'sanctions analysis', 'arms trade', 'India geopolitics', 'global south'],
};

const TOPICS = [
  {
    slug: 'power-networks',
    label: 'Power Networks',
    icon: '🕸️',
    color: '#E24B4A',
    bg: '#FEF2F2',
    count: 24,
    desc: 'State capture, elite networks, shadow influence, and the hidden architecture of geopolitical power.',
    keywords: ['oligarchs', 'shadow state', 'deep state', 'lobbying', 'covert influence'],
  },
  {
    slug: 'economic-warfare',
    label: 'Economic Warfare',
    icon: '⚔️',
    color: '#E8931A',
    bg: '#FFF7ED',
    count: 31,
    desc: 'Trade wars, currency manipulation, debt traps, resource weaponisation, and financial coercion.',
    keywords: ['trade war', 'currency war', 'debt trap', 'belt and road', 'petrodollar'],
  },
  {
    slug: 'sanctions',
    label: 'Sanctions Intel',
    icon: '🔒',
    color: '#3B82F6',
    bg: '#EFF6FF',
    count: 18,
    desc: 'Tracking sanctions regimes, evasion networks, secondary sanctions, and enforcement patterns globally.',
    keywords: ['OFAC', 'SWIFT', 'asset freeze', 'oil price cap', 'sanctions evasion'],
  },
  {
    slug: 'conflicts',
    label: 'Active Conflicts',
    icon: '🔴',
    color: '#DC2626',
    bg: '#FEF2F2',
    count: 42,
    desc: 'Battlefield analysis, proxy wars, military operations, and escalation dynamics across 18+ active theatres.',
    keywords: ['Ukraine', 'Gaza', 'Sudan', 'proxy war', 'military operations'],
  },
  {
    slug: 'arms-trade',
    label: 'Arms & Security',
    icon: '🛡️',
    color: '#7C3AED',
    bg: '#F5F3FF',
    count: 16,
    desc: 'Defence transfers, military aid, arms embargoes, and the politics of weapons supply chains.',
    keywords: ['SIPRI', 'arms embargo', 'military aid', 'defence spending', 'F-35'],
  },
  {
    slug: 'india-lens',
    label: 'India Lens',
    icon: '🇮🇳',
    color: '#FF9933',
    bg: '#FFF8F0',
    count: 38,
    desc: "Strategic implications of every major global event for India's economy, security, and diplomacy.",
    keywords: ["India's strategic interests", 'India foreign policy', 'India economy', 'Modi diplomacy', 'QUAD'],
  },
  {
    slug: 'global-south',
    label: 'Global South',
    icon: '🌍',
    color: '#059669',
    bg: '#ECFDF5',
    count: 22,
    desc: 'BRICS, emerging economies, debt relief, non-alignment, and the geopolitics of development.',
    keywords: ['BRICS', 'non-alignment', 'debt relief', 'Africa', 'Latin America'],
  },
  {
    slug: 'media-bias',
    label: 'Media Bias',
    icon: '📡',
    color: '#0891B2',
    bg: '#ECFEFF',
    count: 11,
    desc: 'Narrative warfare, propaganda analysis, disinformation campaigns, and media influence mapping.',
    keywords: ['propaganda', 'disinformation', 'narrative warfare', 'RT', 'media ownership'],
  },
  {
    slug: 'asia',
    label: 'Asia Outlook',
    icon: '🌏',
    color: '#0B6E6E',
    bg: '#F0FDFA',
    count: 29,
    desc: 'China-ASEAN dynamics, Japan rearmament, Pacific power competition, and Indo-Pacific strategy.',
    keywords: ['China', 'ASEAN', 'Indo-Pacific', 'Japan', 'South Korea', 'Taiwan'],
  },
  {
    slug: 'energy-trade',
    label: 'Energy & Trade',
    icon: '⚡',
    color: '#D97706',
    bg: '#FFFBEB',
    count: 27,
    desc: 'Oil, LNG, rare earths, supply chain disruptions, chokepoints, and energy geopolitics.',
    keywords: ['LNG', 'oil price', 'rare earths', 'supply chain', 'Strait of Hormuz'],
  },
];

const ALL_KEYWORDS = ['geopolitics', 'war', 'sanctions', 'diplomacy', 'trade war', 'military', 'coup', 'elections',
  'NATO', 'BRICS', 'China', 'Russia', 'India', 'Middle East', 'Africa', 'proxy war', 'nuclear',
  'oil', 'LNG', 'rare earths', 'supply chain', 'IMF', 'World Bank', 'debt trap'];

export default function TopicsPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://signalatlas.com';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Geopolitical Intelligence Topics — SignalAtlas',
    description: 'Browse intelligence by theme: conflicts, sanctions, power networks, economic warfare, India lens, and more.',
    url: `${siteUrl}/topics`,
    hasPart: TOPICS.map(t => ({
      '@type': 'WebPage',
      name: t.label,
      url: `${siteUrl}/topics/${t.slug}`,
      description: t.desc,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Nav />

      {/* Header */}
      <div style={{ background: 'var(--navy)', padding: '3rem 2rem 2.5rem', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '.5rem' }}>
            Intelligence Taxonomy
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, color: 'var(--white)', letterSpacing: '-.02em', marginBottom: '.75rem' }}>
            Topics & Themes
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.55)', maxWidth: 560, lineHeight: 1.7 }}>
            Every SignalAtlas article is classified across 10 analytical themes. Browse by the intelligence domain that matters most to you.
          </p>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,.1)', flexWrap: 'wrap' }}>
            {[
              [`${TOPICS.reduce((s, t) => s + t.count, 0)}+`, 'Total Articles'],
              ['10', 'Intelligence Themes'],
              ['Daily', 'New Analysis'],
              ['195', 'Nations Covered'],
            ].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--amber)' }}>{n}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'rgba(255,255,255,.4)', letterSpacing: '.08em', textTransform: 'uppercase' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main style={{ maxWidth: 1240, margin: '0 auto', padding: '2rem' }}>

        {/* Topic grid */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '1.25rem' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.12em', textTransform: 'uppercase' }}>01 — Browse by Theme</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--navy)' }}>All Intelligence Themes</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {TOPICS.map(t => (
              <a
                key={t.slug}
                href={`/topics/${t.slug}`}
                style={{
                  display: 'block',
                  background: 'var(--white)',
                  border: '1px solid var(--border)',
                  borderTop: `3px solid ${t.color}`,
                  borderRadius: 'var(--radius)',
                  padding: '1.25rem',
                  textDecoration: 'none',
                  transition: 'box-shadow .15s, transform .15s',
                  position: 'relative',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(11,22,40,.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ fontSize: 24 }}>{t.icon}</div>
                    <div>
                      <div style={{ fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.2 }}>{t.label}</div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: t.color, letterSpacing: '.06em', textTransform: 'uppercase', marginTop: 2 }}>
                        {t.count} articles
                      </div>
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 18, color: 'var(--ink3)' }}>→</div>
                </div>

                <p style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.6, marginBottom: '.75rem' }}>{t.desc}</p>

                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {t.keywords.slice(0, 3).map(k => (
                    <span key={k} style={{ fontSize: 10, fontFamily: 'var(--mono)', background: t.bg, color: t.color, padding: '2px 7px', borderRadius: 2, letterSpacing: '.04em' }}>
                      {k}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Keyword cloud */}
        <div style={{ background: 'var(--off)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            02 — Keyword Intelligence Map
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ALL_KEYWORDS.map((k, i) => (
              <a
                key={k}
                href={`/research?q=${encodeURIComponent(k)}`}
                style={{
                  fontSize: i < 8 ? 14 : i < 16 ? 12 : 11,
                  fontWeight: i < 8 ? 600 : 400,
                  color: i < 6 ? 'var(--navy)' : i < 14 ? 'var(--ink2)' : 'var(--ink3)',
                  background: 'var(--white)',
                  border: '1px solid var(--border)',
                  borderRadius: 2,
                  padding: '4px 10px',
                  textDecoration: 'none',
                  fontFamily: 'var(--mono)',
                  letterSpacing: '.04em',
                  transition: 'border-color .15s, color .15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--amber)'; (e.currentTarget as HTMLElement).style.color = 'var(--amber)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = i < 6 ? 'var(--navy)' : i < 14 ? 'var(--ink2)' : 'var(--ink3)'; }}
              >
                {k}
              </a>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
