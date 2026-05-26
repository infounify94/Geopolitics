import Nav from '@/components/Nav';
import Ticker from '@/components/Ticker';
import Hero from '@/components/Hero';
import ArticleCard from '@/components/ArticleCard';
import ConflictMonitor from '@/components/ConflictMonitor';
import TopicStrip from '@/components/TopicStrip';
import LatestResearch from '@/components/LatestResearch';
import IndiaBand from '@/components/IndiaBand';
import RelationshipGraph from '@/components/RelationshipGraph';
import SubscribeBand from '@/components/SubscribeBand';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  getFeaturedArticles,
  getRecentArticles,
  getActiveConflicts,
  getTickerItems,
  getDashboardStats,
  getGraphConnections,
} from '@/lib/queries';

export const revalidate = 300;

export default async function HomePage() {
  const [featured, recent, conflicts, ticker, dashStats, graphData] = await Promise.all([
    getFeaturedArticles(3),
    getRecentArticles(6),
    getActiveConflicts(),
    getTickerItems(),
    getDashboardStats(),
    getGraphConnections(),
  ]);

  return (
    <>
      <Ticker items={ticker} />
      <Nav />

      {/* ── HERO ── */}
      <Hero stats={dashStats} conflicts={conflicts} />

      {/* ── 01 FEATURED RESEARCH ── */}
      <div className="section">
        <div className="section-header reveal">
          <div>
            <div className="section-num">01 — Featured Research</div>
            <div className="section-title">Top Intelligence Reports</div>
          </div>
          <Link href="/research" className="section-link">All Research ↗</Link>
        </div>

        {featured.length > 0 ? (
          <div className="featured-grid reveal">
            {/* Main large card */}
            <ArticleCard article={featured[0]} variant="main" />
            {/* Side stack */}
            <div className="fg-side">
              {featured.slice(1).map(a => (
                <ArticleCard key={a.id} article={a} variant="card" />
              ))}
            </div>
          </div>
        ) : (
          <div className="reveal" style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--off)', border: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 700, color: 'var(--navy)', marginBottom: 12 }}>
              Research articles publishing soon
            </div>
            <p style={{ fontSize: 14, color: 'var(--ink3)', lineHeight: 1.7, maxWidth: 400, margin: '0 auto' }}>
              The AI pipeline is generating deep-research articles across Power Networks, Economic Warfare, India Lens, and Conflicts.
            </p>
          </div>
        )}
      </div>

      {/* ── 02 CONFLICT MONITOR (full-width dark) ── */}
      <ConflictMonitor conflicts={conflicts} />

      {/* ── 03 TOPIC RADAR ── */}
      <TopicStrip />

      {/* ── 04 LATEST FEED + SIDEBAR ── */}
      <LatestResearch articles={recent} />

      {/* ── INDIA LENS BAND ── */}
      <IndiaBand articles={recent} />

      {/* ── 05 PATTERN GRAPH ── */}
      <div className="pattern-bg">
        <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div className="section-header reveal">
            <div>
              <div className="section-num">05 — Pattern Intelligence</div>
              <div className="section-title">Event Connection Map</div>
            </div>
            <Link href="/research" className="section-link">Full Graph ↗</Link>
          </div>
          <div className="graph-container reveal">
            <RelationshipGraph
              nodes={graphData.nodes.length > 0 ? graphData.nodes as any : undefined}
              edges={graphData.edges.length > 0 ? graphData.edges : undefined}
            />
            <div className="graph-legend">
              {[
                { color: '#E24B4A', label: 'Critical Event'  },
                { color: '#C8760A', label: 'High Severity'   },
                { color: '#185FA5', label: 'Economic Link'   },
                { color: '#0B6E6E', label: 'Diplomatic Link' },
                { color: '#534AB7', label: 'India Angle'     },
              ].map(g => (
                <div key={g.label} className="gl-item">
                  <div className="gl-dot" style={{ background: g.color }} />
                  {g.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── SUBSCRIBE ── */}
      <SubscribeBand />

      {/* ── FOOTER ── */}
      <Footer />
    </>
  );
}
