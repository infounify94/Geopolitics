import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About SignalAtlas — Global Geopolitical Intelligence Platform',
  description: 'SignalAtlas is a data-driven geopolitical intelligence platform tracking conflicts, sanctions, power networks, and strategic trends across 195 nations with evidence-based, confidence-scored analysis.',
};

const PILLARS = [
  { icon: '🎯', title: 'Evidence-Based Analysis', desc: 'Every claim is sourced. Every article carries a confidence level (High/Medium/Low) and evidence rating (Strong/Moderate/Limited). We cite primary sources — treaty texts, UN resolutions, trade data — not just media reports.' },
  { icon: '🌐', title: '195-Nation Coverage', desc: 'Our intelligence grid spans every country, with deep profiles on 35+ major powers. Country risk scores, military rankings, and influence metrics are updated as situations evolve.' },
  { icon: '🔬', title: '17-Angle Analysis Framework', desc: 'Each article is analysed across 17 geopolitical dimensions: historical precedent, economic leverage, military calculus, proxy networks, media narrative, India implications, who benefits, and future scenarios.' },
  { icon: '🇮🇳', title: 'India Lens', desc: 'Every major global event is analysed for its specific implications for India — across economy, security, diplomacy, trade, and strategic positioning. This is a unique analytical layer not found in Western-centric intelligence publications.' },
  { icon: '⚡', title: 'Advanced Geopolitical Modeling', desc: 'Our analytical grid monitors 100+ global intelligence databases, official registries, and open-source data repositories daily. We analyze strategic risk signals and compile research briefs using a custom quantitative framework.' },
  { icon: '📊', title: 'Conflict Intelligence', desc: 'Live tracking of 18+ active conflicts with severity scores, days-active counters, and map visualisation. Linked to relevant analysis — so every marker on the map leads to research.' },
];

const COVERAGE_STATS = [
  { num: '195', label: 'Nations Monitored' },
  { num: '18+', label: 'Active Conflicts Tracked' },
  { num: '850+', label: 'Risk Briefings' },
  { num: '10', label: 'Intelligence Themes' },
  { num: '17', label: 'Analytical Angles' },
  { num: '5-Stage', label: 'Verification Process' },
];

export default function AboutPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://signalatlas.com';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SignalAtlas',
    url: siteUrl,
    description: 'Global geopolitical intelligence platform. Data-driven analysis of conflicts, sanctions, power networks, and strategic trends.',
    sameAs: [],
    foundingDate: '2024',
    knowsAbout: ['Geopolitics', 'Conflict Analysis', 'Sanctions', 'Strategic Intelligence', 'India Foreign Policy'],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Nav />

      {/* Header */}
      <div style={{ background: 'var(--navy)', padding: '3rem 2rem 2.5rem', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '.5rem' }}>About SignalAtlas</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, color: 'var(--white)', letterSpacing: '-.02em', marginBottom: '.75rem' }}>
            Intelligence Platform for a Complex World
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.55)', maxWidth: 680, lineHeight: 1.8 }}>
            SignalAtlas is a data-driven geopolitical intelligence platform that tracks conflicts, sanctions, power networks, and strategic trends across 195 nations. We produce evidence-based analysis — with confidence scoring, multi-angle frameworks, and a dedicated India Lens — at the speed of a newsroom and the depth of a think tank.
          </p>
          {/* Stats row */}
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,.1)', flexWrap: 'wrap' }}>
            {COVERAGE_STATS.map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--amber)' }}>{s.num}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'rgba(255,255,255,.4)', letterSpacing: '.08em', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>

        {/* Mission */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderLeft: '4px solid var(--amber)', borderRadius: 'var(--radius)', padding: '1.5rem 2rem', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '.75rem' }}>Our Mission</div>
          <p style={{ fontSize: 16, color: 'var(--ink)', lineHeight: 1.8, fontFamily: 'var(--serif)', fontStyle: 'italic' }}>
            "To make geopolitical intelligence accessible, transparent, and actionable — moving beyond Western-centric narratives to deliver evidence-based analysis that captures the true complexity of international power dynamics."
          </p>
        </div>

        {/* What makes us different */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '1.25rem' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.12em', textTransform: 'uppercase' }}>01 — Our Approach</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--navy)' }}>What Makes SignalAtlas Different</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {PILLARS.map(p => (
              <div key={p.title} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
                <div style={{ fontSize: 28, marginBottom: '.75rem' }}>{p.icon}</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '.5rem' }}>{p.title}</div>
                <p style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.7 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How the methodology works */}
        <div style={{ background: 'var(--navy)', borderRadius: 'var(--radius)', padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>02 — Sourcing & Verification</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--white)', marginBottom: '1.25rem' }}>The SignalAtlas Verification Methodology</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {[
              ['Stage 1', 'OSINT Scanning', 'Comprehensive scanning of 10K+ national news, custom feeds, and academic publications for structural risk signals.'],
              ['Stage 2', 'Primary Registries', 'Direct data ingestion from multilateral registries: UN, IMF, World Bank, WTO, and official regional ministries.'],
              ['Stage 3', 'Risk Modeling', 'Structured evaluation of diplomatic friction parameters, military capabilities, and macro-economic factors.'],
              ['Stage 4', 'Strategic Framework', 'Comprehensive intelligence drafting across our unique 17-angle regional and thematic risk matrix.'],
              ['Verification', 'Editorial Board', 'Rigorous verification auditing, source validation, and regional impact overlay (including India Lens).'],
              ['Registry', 'Archival Integrity', 'Continuous archival integration ensuring database audit trails and chronological timeline compliance.'],
            ].map(([step, title, desc]) => (
              <div key={step} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 'var(--radius)', padding: '1rem' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--amber)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>{step}</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '.95rem', fontWeight: 700, color: 'var(--white)', marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.45)', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Methodology note */}
        <div style={{ background: 'var(--off)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>03 — Transparency & Methodology</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontWeight: 700, color: 'var(--navy)', marginBottom: '.5rem' }}>Confidence Levels</div>
              {[['High', '#22C55E', 'Multiple primary sources. Verified through cross-referencing.'],
                ['Medium', '#F59E0B', 'Sourced from reliable secondary reporting. Some uncertainty.'],
                ['Low', '#E24B4A', 'Limited sources or evolving situation. Treat as preliminary.']].map(([l, c, d]) => (
                <div key={l} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 1, background: `${c}22`, color: c, flexShrink: 0, marginTop: 2 }}>{l}</span>
                  <span style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.5 }}>{d}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontWeight: 700, color: 'var(--navy)', marginBottom: '.5rem' }}>What We Are Not</div>
              <ul style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.9, paddingLeft: 16 }}>
                <li>Not a news outlet — we analyse, not report</li>
                <li>Not government-affiliated or politically aligned</li>
                <li>Not Western-centric — we cover Global South perspectives</li>
                <li>Not opinion journalism — claims require evidence</li>
                <li>Not predictive — scenarios are probabilistic, not forecasts</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
