import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

export const runtime = 'edge';
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
}

const TOPIC_DETAILS: Record<string, {
  label: string;
  icon: string;
  color: string;
  bg: string;
  desc: string;
  keywords: string[];
}> = {
  'power-networks': {
    label: 'Power Networks',
    icon: '🕸️',
    color: '#E24B4A',
    bg: '#FEF2F2',
    desc: 'State capture, elite networks, shadow influence, and the hidden architecture of geopolitical power.',
    keywords: ['oligarchs', 'shadow state', 'deep state', 'lobbying', 'covert influence']
  },
  'color-revolutions': {
    label: 'Color Revolutions',
    icon: '🌸',
    color: '#EC4899',
    bg: '#FDF2F8',
    desc: 'Elite-driven public movements, intelligence-backed transitions, and strategic governance shifts.',
    keywords: ['regime transition', 'funding agencies', 'public protests', 'civil society']
  },
  'imf-trap': {
    label: 'IMF Trap',
    icon: '💸',
    color: '#DC2626',
    bg: '#FEF2F2',
    desc: 'Debt dependency, financial coercion, structural adjustments, and sovereign loan dependencies.',
    keywords: ['sovereign default', 'structural adjustment', 'debt relief', 'world bank']
  },
  'arms-trade': {
    label: 'Arms Trade',
    icon: '🛡️',
    color: '#7C3AED',
    bg: '#F5F3FF',
    desc: 'Defence transfers, military aid, arms embargoes, and the politics of weapons supply chains.',
    keywords: ['SIPRI', 'arms embargo', 'military aid', 'defence spending', 'F-35']
  },
  'proxy-wars': {
    label: 'Proxy Wars',
    icon: '🎭',
    color: '#B91C1C',
    bg: '#FEF2F2',
    desc: 'Indirect confrontations, regional proxy dynamics, intelligence support, and surrogate forces.',
    keywords: ['surrogate combat', 'covert operations', 'military support', 'geostrategic pivot']
  },
  'dollar-decline': {
    label: 'Dollar Decline',
    icon: '📉',
    color: '#92400E',
    bg: '#FEF3C7',
    desc: 'De-dollarisation, reserve currency erosion, alternative payment gateways, and asset freezes.',
    keywords: ['petrodollar', 'BRICS pay', 'gold reserves', 'SWIFT evasion']
  },
  'media-bias': {
    label: 'Media Bias',
    icon: '📡',
    color: '#0891B2',
    bg: '#ECFEFF',
    desc: 'Narrative warfare, propaganda analysis, disinformation campaigns, and media influence mapping.',
    keywords: ['propaganda', 'disinformation', 'narrative warfare', 'media ownership']
  },
  'india-lens': {
    label: 'India Lens',
    icon: '🇮🇳',
    color: '#FF9933',
    bg: '#FFF8F0',
    desc: "Strategic implications of every major global event for India's economy, security, and diplomacy.",
    keywords: ["India's strategic interests", 'India foreign policy', 'India economy', 'Modi diplomacy', 'QUAD']
  },
  'sanctions': {
    label: 'Sanctions Intel',
    icon: '🔒',
    color: '#3B82F6',
    bg: '#EFF6FF',
    desc: 'Tracking sanctions regimes, evasion networks, secondary sanctions, and enforcement patterns globally.',
    keywords: ['OFAC', 'SWIFT', 'asset freeze', 'oil price cap', 'sanctions evasion']
  },
  'resource-wars': {
    label: 'Resource Wars',
    icon: '💎',
    color: '#D97706',
    bg: '#FFFBEB',
    desc: 'Chokepoints, rare earth minerals, oil, LNG, and the struggle for critical resource dominance.',
    keywords: ['lithium', 'cobalt', 'semiconductors', 'strait of hormuz', 'opec']
  },
  'brics': {
    label: 'BRICS Expansion',
    icon: '🌍',
    color: '#059669',
    bg: '#ECFDF5',
    desc: 'Multipolarty, emerging economic alliances, reserve diversification, and alternative financial systems.',
    keywords: ['brics pay', 'multipolarity', 'de-dollarisation', 'new development bank']
  },
  'regime-change': {
    label: 'Regime Change',
    icon: '🔄',
    color: '#E24B4A',
    bg: '#FEF2F2',
    desc: 'Covert overthrows, state vulnerability, external interventions, and coup dynamics.',
    keywords: ['coups', 'intelligence backing', 'political instability', 'foreign policy shift']
  },
  'economic-warfare': {
    label: 'Economic Warfare',
    icon: '⚔️',
    color: '#E8931A',
    bg: '#FFF7ED',
    desc: 'Trade wars, currency manipulation, debt traps, resource weaponisation, and financial coercion.',
    keywords: ['trade war', 'currency war', 'debt trap', 'belt and road', 'petrodollar']
  },
  'conflicts': {
    label: 'Active Conflicts',
    icon: '🔴',
    color: '#DC2626',
    bg: '#FEF2F2',
    desc: 'Battlefield analysis, proxy wars, military operations, and escalation dynamics across 18+ active theatres.',
    keywords: ['Ukraine', 'Gaza', 'Sudan', 'proxy war', 'military operations']
  },
  'trade-wars': {
    label: 'Trade Wars',
    icon: '📈',
    color: '#D97706',
    bg: '#FFFBEB',
    desc: 'Tariff disputes, technology export bans, supply chain decoupling, and industrial policy disputes.',
    keywords: ['tariffs', 'export controls', 'decoupling', 'semiconductors', 'supply chain']
  },
  'asia': {
    label: 'Asia Outlook',
    icon: '🌏',
    color: '#0B6E6E',
    bg: '#F0FDFA',
    desc: 'China-ASEAN dynamics, Japan rearmament, Pacific power competition, and Indo-Pacific strategy.',
    keywords: ['China', 'ASEAN', 'Indo-Pacific', 'Japan', 'South Korea', 'Taiwan']
  },
  'energy-trade': {
    label: 'Energy & Trade',
    icon: '⚡',
    color: '#D97706',
    bg: '#FFFBEB',
    desc: 'Oil, LNG, rare earths, supply chain disruptions, chokepoints, and energy geopolitics.',
    keywords: ['LNG', 'oil price', 'rare earths', 'supply chain', 'Strait of Hormuz']
  },
  'middle-east': {
    label: 'Middle East',
    icon: '🕌',
    color: '#D97706',
    bg: '#FFFBEB',
    desc: 'Suez Canal security, regional escalation vectors, oil supply chains, and peace treaties.',
    keywords: ['Iran proxy network', 'Abraham Accords', 'Gaza stabilization', 'Suez Canal']
  },
  'south-asia': {
    label: 'South Asia',
    icon: '🏔️',
    color: '#FF9933',
    bg: '#FFF8F0',
    desc: 'LAC boundary dynamics, China-Pakistan Economic Corridor (CPEC), Indian Ocean security, and SAARC.',
    keywords: ['LAC boundary', 'CPEC', 'Indian Ocean', 'Kashmir', 'Sri Lanka debt']
  },
  'africa': {
    label: 'Africa Geopolitics',
    icon: '🦁',
    color: '#059669',
    bg: '#ECFDF5',
    desc: 'Sahel Coup Belt, Wagner deployment, critical minerals, and China-US infrastructure diplomacy.',
    keywords: ['Sahel Coup Belt', 'Wagner PMC', 'Democratic Republic of Congo minerals', 'Lobito Corridor']
  },
  'americas': {
    label: 'Americas Strategic',
    icon: '🦅',
    color: '#2563EB',
    bg: '#EFF6FF',
    desc: 'US southern border crisis, Venezuela-Guyana tensions, and decoupling from global supply lines.',
    keywords: ['Southern border', 'Essequibo dispute', 'Nearshoring', 'Monroe doctrine']
  },
  'europe': {
    label: 'Europe Pivot',
    icon: '🏰',
    color: '#3B82F6',
    bg: '#EFF6FF',
    desc: 'NATO rearmament, Schengen security, Ukraine long-term aid, and EU strategic autonomy.',
    keywords: ['NATO eastern flank', 'Zeitenwende', 'Nordic defense expansion', 'strategic autonomy']
  }
};

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = TOPIC_DETAILS[slug];
  if (!topic) return { title: 'Topic Not Found | SignalAtlas' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://signalatlas.com';

  return {
    title: `${topic.label} Geopolitical Briefings — Analysis & Risk | SignalAtlas`,
    description: topic.desc,
    keywords: [topic.label, ...topic.keywords, 'geopolitical intelligence', 'global risk analysis'],
    alternates: { canonical: `${siteUrl}/topics/${slug}` },
  };
}

export default async function TopicDetailPage({ params }: Props) {
  const { slug } = await params;
  const topic = TOPIC_DETAILS[slug];
  if (!topic) notFound();

  // Fetch articles from Supabase
  let articles: any[] = [];
  try {
    const { data } = await supabase
      .from('articles')
      .select('id, slug, title, category, confidence_level, impact_score, published_at, countries, topics, read_time_mins')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    // Filter in-memory to match category label or topics array (case-insensitive)
    articles = (data || []).filter((a: any) => {
      const catMatch = a.category?.toUpperCase() === topic.label.toUpperCase();
      const topicsMatch = a.topics?.some((t: string) => 
        t.toLowerCase() === slug.toLowerCase() || 
        t.toLowerCase() === topic.label.toLowerCase()
      );
      return catMatch || topicsMatch;
    });
  } catch (err) {
    console.error('Failed to fetch articles for topic:', err);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://signalatlas.com';

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Topics', item: `${siteUrl}/topics` },
      { '@type': 'ListItem', position: 3, name: topic.label, item: `${siteUrl}/topics/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Nav />

      {/* Header section with custom topic color border */}
      <div style={{ background: 'var(--navy)', padding: '3.5rem 2rem 2.5rem', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          
          {/* Breadcrumb links */}
          <nav style={{ display: 'flex', gap: 6, fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 20, fontFamily: 'var(--mono)' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,.4)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/topics" style={{ color: 'rgba(255,255,255,.4)', textDecoration: 'none' }}>Topics</Link>
            <span>/</span>
            <span style={{ color: topic.color }}>{topic.label}</span>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '.75rem' }}>
            <span style={{ fontSize: 36 }}>{topic.icon}</span>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: topic.color, letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600 }}>Geopolitical Theme</div>
              <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, color: 'var(--white)', letterSpacing: '-.02em' }}>
                {topic.label}
              </h1>
            </div>
          </div>

          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.55)', maxWidth: 650, lineHeight: 1.7, marginBottom: '1.5rem' }}>
            {topic.desc}
          </p>

          <div style={{ display: 'flex', gap: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,.1)', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--amber)' }}>{articles.length}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'rgba(255,255,255,.4)', letterSpacing: '.08em', textTransform: 'uppercase' }}>Matching Articles</div>
            </div>
            <div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {topic.keywords.map(k => (
                  <span key={k} style={{ fontSize: 9, fontFamily: 'var(--mono)', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 2 }}>
                    #{k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '3rem', alignItems: 'start' }}>
          
          {/* Feed list */}
          <div>
            <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.12em', textTransform: 'uppercase' }}>Theme Intel Feed</div>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--navy)', margin: 0 }}>Latest Briefings & Reports</h2>
            </div>

            {articles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--off)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                <div style={{ fontSize: 32, marginBottom: '1rem' }}>📡</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '.25rem' }}>No direct reports published yet</div>
                <p style={{ color: 'var(--ink3)', fontSize: 13, maxWidth: 360, margin: '0 auto 1.25rem', lineHeight: 1.5 }}>
                  Our intelligence pipeline generates briefings daily. Check back soon or browse other strategic analysis topics.
                </p>
                <Link href="/topics" style={{ fontSize: 11, fontFamily: 'var(--mono)', background: 'var(--navy)', color: 'var(--white)', padding: '6px 16px', borderRadius: 'var(--radius)', textDecoration: 'none', letterSpacing: '.04em' }}>
                  All Topics
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {articles.map((a) => {
                  const confColor = a.confidence_level === 'High' ? 'var(--green)'
                                  : a.confidence_level === 'Medium' ? 'var(--amber)' : 'var(--red)';
                  return (
                    <Link key={a.id} href={`/research/${a.slug}`} style={{ display: 'block', padding: '1.25rem 0', borderBottom: '1px solid var(--border)', textDecoration: 'none', transition: 'opacity 0.15s ease' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem' }}>
                        <div>
                          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: topic.color, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 6, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <span>{a.category}</span>
                            {a.countries?.slice(0, 1).map((c: string) => (
                              <span key={c} style={{ color: 'var(--ink3)' }}>· {c}</span>
                            ))}
                          </div>
                          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', lineHeight: 1.35, marginBottom: 8, fontFamily: 'var(--serif)' }}>
                            {a.title}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: 'var(--ink3)' }}>
                            {a.impact_score && (
                              <span style={{ color: 'var(--red)', fontWeight: 600, fontFamily: 'var(--mono)', fontSize: 10 }}>
                                ★ {a.impact_score} Impact
                              </span>
                            )}
                            <span>·</span>
                            <span style={{ color: confColor, fontWeight: 500 }}>
                              {a.confidence_level} Confidence
                            </span>
                            <span>·</span>
                            <span>{timeAgo(a.published_at)}</span>
                            {a.read_time_mins && (
                              <>
                                <span>·</span>
                                <span>{a.read_time_mins} min read</span>
                              </>
                            )}
                          </div>
                        </div>
                        <span style={{ fontSize: 18, color: 'var(--border2)' }}>→</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div style={{ background: 'var(--off)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.75rem' }}>Intelligence Coverage</h3>
              <p style={{ fontSize: 12.5, color: 'var(--ink2)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Each analytical theme operates across our full scope of 195 monitored nations, scoring risk vectors and mapping elite networks continuously.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['Methodology', 'Evidence-based tracking'],
                  ['Update Rate', 'Continuous / daily'],
                  ['Confidence scoring', 'Triple-validated'],
                  ['AEO Optimized', 'Crawlable HTML schema'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--border)', fontSize: 11.5 }}>
                    <span style={{ color: 'var(--ink3)', fontFamily: 'var(--mono)' }}>{k}</span>
                    <span style={{ color: 'var(--navy)', fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--navy)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 'var(--radius)', padding: '1.5rem', color: 'var(--white)' }}>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 700, color: 'var(--white)', marginBottom: '0.5rem' }}>All Intelligence Themes</h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Select another theme to review geopolitical indicators.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {Object.entries(TOPIC_DETAILS).slice(0, 8).map(([key, value]) => (
                  <Link key={key} href={`/topics/${key}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, textDecoration: 'none', color: key === slug ? 'var(--amber)' : 'rgba(255,255,255,.8)', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,.06)', transition: 'color 0.2s' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{value.icon}</span>
                      <span>{value.label}</span>
                    </span>
                    <span style={{ marginLeft: 'auto', fontSize: 10 }}>{key === slug ? 'Active' : '→'}</span>
                  </Link>
                ))}
              </div>
              <Link href="/topics" style={{ display: 'block', marginTop: '1rem', textAlign: 'center', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--amber)', textDecoration: 'none' }}>
                View all 10 topics ↗
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
