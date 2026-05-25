import { Suspense } from 'react';
import Nav from '@/components/Nav';
import Ticker from '@/components/Ticker';
import ArticleCard from '@/components/ArticleCard';
import ConflictMonitor from '@/components/ConflictMonitor';
import CountryWatch from '@/components/CountryWatch';
import RelationshipGraph from '@/components/RelationshipGraph';
import LatestResearch from '@/components/LatestResearch';
import TopicStrip from '@/components/TopicStrip';
import Footer from '@/components/Footer';
import AnimatedCounters from '@/components/AnimatedCounters';
import RadarBiasChart from '@/components/RadarBiasChart';
import {
  getFeaturedArticles,
  getRecentArticles,
  getActiveConflicts,
  getTopCountries,
  getTickerItems,
  getDashboardStats,
  getLatestChartData,
  getGraphConnections,
} from '@/lib/queries';

export const revalidate = 3600; // Cloudflare Pages ISR support: 1 hour

// Static data for sidebar widgets until DB populates
const GLOBAL_TIMELINE = [
  { year: '2019', event: 'Hong Kong Protests',   pattern: 'Protest Pattern', color: 'var(--purple)' },
  { year: '2020', event: 'Belarus Uprising',      pattern: 'Protest Pattern', color: 'var(--purple)' },
  { year: '2021', event: 'Myanmar Coup',          pattern: 'Regime Change',   color: 'var(--red)' },
  { year: '2022', event: 'Ukraine War Begins',    pattern: 'Proxy War',       color: 'var(--red)' },
  { year: '2023', event: 'Niger Coup',            pattern: 'Anti-West Wave',  color: 'var(--amber)' },
  { year: '2024', event: 'Venezuela Crisis',      pattern: 'Protest Pattern', color: 'var(--purple)' },
  { year: '2025', event: 'Haiti State Collapse',  pattern: 'State Failure',   color: 'var(--red)' },
];

export default async function HomePage() {
  const [featured, recent, conflicts, countries, ticker, dashStats, radarData, graphData] = await Promise.all([
    getFeaturedArticles(3),
    getRecentArticles(6),
    getActiveConflicts(),
    getTopCountries(5),
    getTickerItems(),
    getDashboardStats(),
    getLatestChartData(),
    getGraphConnections(),
  ]);

  return (
    <>
      <Nav />
      <Ticker items={ticker} />

      <main className="main">
        {/* Animated Counters */}
        <AnimatedCounters stats={dashStats} />

        {/* Main 2-col grid */}
        <div className="grid-main">
          {/* Left — Featured Articles */}
          <div>
            <div className="sec-head">
              <div className="sec-num">01</div>
              <div className="sec-title">Featured Research</div>
            </div>

            {featured.length > 0 ? (
              featured.map((a, i) => <ArticleCard key={a.id} article={a} index={i} />)
            ) : (
              <div className="card card-pad fade" style={{ animationDelay: '0.05s' }}>
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)', marginBottom: 12 }}>
                    Research articles publishing soon
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--ink3)', lineHeight: 1.7, maxWidth: 400, margin: '0 auto 20px' }}>
                    The AI pipeline is being set up to auto-publish deep-research articles using the master prompt.
                  </p>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {['Power Networks', 'Economic Warfare', 'India Lens', 'Conflicts'].map(t => (
                      <span key={t} className="badge" style={{ background: 'var(--bg2)', color: 'var(--ink3)' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <ConflictMonitor conflicts={conflicts} />
            <CountryWatch countries={countries} />
            <RadarBiasChart data={radarData} />
          </div>
        </div>

        {/* Topic strip */}
        <TopicStrip />

        {/* Bottom 2-col grid */}
        <div className="grid-2">
          {/* Latest research */}
          <div>
            <div className="sec-head">
              <div className="sec-num">02</div>
              <div className="sec-title">Latest Updates</div>
            </div>
            <LatestResearch articles={recent} />
          </div>

          {/* Global timeline */}
          <div>
            <div className="sec-head">
              <div className="sec-num">03</div>
              <div className="sec-title">Global Event Timeline</div>
            </div>
            <div className="card card-pad fade" style={{ animationDelay: '0.27s' }}>
              <div className="tl">
                {GLOBAL_TIMELINE.map((e, i) => (
                  <div key={i} className="tl-item">
                    <div className="tl-dot" style={{ background: e.color }} />
                    <div className="tl-year" style={{ color: e.color }}>{e.year}</div>
                    <div className="tl-event">{e.event}</div>
                    <div className="tl-pattern">Pattern: {e.pattern}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Full width RelGraph */}
        <div className="sec-head">
          <div className="sec-num">04</div>
          <div className="sec-title">Pattern Intelligence Graph</div>
        </div>
        <RelationshipGraph nodes={graphData.nodes.length > 0 ? graphData.nodes as any : undefined} edges={graphData.edges.length > 0 ? graphData.edges : undefined} />

        <Footer />
      </main>
    </>
  );
}
