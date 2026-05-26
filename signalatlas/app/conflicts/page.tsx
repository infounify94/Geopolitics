import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ConflictMap from '@/components/ConflictMap';
import { CONFLICT_POINTS, TYPE_COLORS, TYPE_LABELS } from '@/lib/conflictData';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Global Conflict Monitor — Live War & Crisis Tracker | SignalAtlas',
  description: 'Real-time tracking of active wars, diplomatic crises, sanctions regimes, and strategic flashpoints across 195 nations. Evidence-based conflict intelligence with severity scoring.',
  keywords: ['global conflict tracker', 'war map', 'geopolitical crisis tracker', 'active conflicts 2025', 'conflict monitor', 'live war tracker', 'geopolitical flashpoints', 'sanctions tracker'],
  openGraph: {
    title: 'Global Conflict Monitor — SignalAtlas',
    description: 'Live tracking of wars, diplomatic crises, and sanctions across 195 nations.',
    type: 'website',
  },
};




export default function ConflictsPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://signalatlas.com';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Global Conflict Monitor — SignalAtlas',
    description: 'Real-time tracking of active wars, diplomatic crises, and strategic flashpoints across 195 nations.',
    url: `${siteUrl}/conflicts`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: CONFLICT_POINTS.slice(0, 5).map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        description: c.summary,
      })),
    },
  };

  const stats = [
    { num: `${CONFLICT_POINTS.filter(c => c.type === 'active-war').length}`, label: 'Active Wars Tracked' },
    { num: `${CONFLICT_POINTS.filter(c => c.alertLevel === 'CRITICAL').length}`, label: 'Critical Conflicts' },
    { num: '195', label: 'Nations Monitored' },
    { num: 'Live', label: 'Continuous Updates' },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Nav />

      {/* Dark header */}
      <div style={{ background:'var(--navy)', padding:'3rem 2rem 2.5rem', borderBottom:'1px solid rgba(255,255,255,.08)' }}>
        <div style={{ maxWidth:1240, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'.5rem' }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:'#E24B4A', animation:'pulseDot 1.2s ease-in-out infinite' }} />
            <div style={{ fontFamily:'var(--mono)', fontSize:10, color:'rgba(255,255,255,.5)', letterSpacing:'.12em', textTransform:'uppercase' }}>Live Monitoring</div>
          </div>
          <h1 style={{ fontFamily:'var(--serif)', fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, color:'var(--white)', letterSpacing:'-.02em', marginBottom:'.75rem' }}>
            Global Conflict Monitor
          </h1>
          <p style={{ fontSize:15, color:'rgba(255,255,255,.55)', maxWidth:600, lineHeight:1.7 }}>
            Real-time tracking of active wars, diplomatic crises, sanctions regimes, and strategic flashpoints.
            Confidence-scored, evidence-based geopolitical intelligence.
          </p>
          <div style={{ display:'flex', gap:'2rem', marginTop:'1.5rem', paddingTop:'1.5rem', borderTop:'1px solid rgba(255,255,255,.1)', flexWrap:'wrap' }}>
            {stats.map(s => (
              <div key={s.label}>
                <div style={{ fontFamily:'var(--serif)', fontSize:'1.6rem', fontWeight:700, color:'var(--amber)' }}>{s.num}</div>
                <div style={{ fontFamily:'var(--mono)', fontSize:9, color:'rgba(255,255,255,.4)', letterSpacing:'.08em', textTransform:'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main style={{ maxWidth:1240, margin:'0 auto', padding:'2rem' }}>

        {/* Interactive Map Section */}
        <div style={{ marginBottom:'2.5rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem', paddingBottom:'1rem', borderBottom:'1px solid var(--border)' }}>
            <div>
              <div style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--amber)', letterSpacing:'.12em', textTransform:'uppercase' }}>01 — Live Map</div>
              <div style={{ fontFamily:'var(--serif)', fontSize:'1.4rem', fontWeight:700, color:'var(--navy)' }}>Interactive Conflict Intelligence Map</div>
            </div>
            <div style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--ink3)' }}>Click any marker for details</div>
          </div>
          <ConflictMap />
        </div>

        {/* Type filter legend */}
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:'1.5rem' }}>
          {Object.entries(TYPE_LABELS).map(([type, label]) => (
            <div key={type} style={{ display:'flex', alignItems:'center', gap:6, background:'var(--white)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'5px 12px' }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:TYPE_COLORS[type], flexShrink:0 }} />
              <span style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--ink2)', letterSpacing:'.04em' }}>
                {label} ({CONFLICT_POINTS.filter(c => c.type === type).length})
              </span>
            </div>
          ))}
        </div>

        {/* All Conflicts Grid */}
        <div style={{ marginBottom:'2rem' }}>
          <div style={{ paddingBottom:'1rem', borderBottom:'1px solid var(--border)', marginBottom:'1.25rem' }}>
            <div style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--amber)', letterSpacing:'.12em', textTransform:'uppercase' }}>02 — Conflict Database</div>
            <div style={{ fontFamily:'var(--serif)', fontSize:'1.4rem', fontWeight:700, color:'var(--navy)' }}>All Active Conflicts & Flashpoints</div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:12 }}>
            {CONFLICT_POINTS.map(c => {
              const color = TYPE_COLORS[c.type] ?? '#6B7280';
              const label = TYPE_LABELS[c.type] ?? c.type;
              const alertBg    = c.alertLevel === 'CRITICAL' ? 'var(--red-light)' : c.alertLevel === 'HIGH' ? 'var(--amber-light)' : 'var(--off)';
              const alertColor = c.alertLevel === 'CRITICAL' ? 'var(--red)' : c.alertLevel === 'HIGH' ? 'var(--amber)' : 'var(--ink3)';

              return (
                <div key={c.id} style={{ background:'var(--white)', border:'1px solid var(--border)', borderTop:`2px solid ${color}`, borderRadius:'var(--radius)', padding:'1.25rem', position:'relative' }}>
                  {/* Type + alert */}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'.5rem' }}>
                    <div>
                      <div style={{ fontFamily:'var(--mono)', fontSize:9, color, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:3 }}>{label}</div>
                      <div style={{ fontFamily:'var(--serif)', fontSize:'1rem', fontWeight:700, color:'var(--navy)', lineHeight:1.3 }}>{c.name}</div>
                    </div>
                    <span style={{ fontFamily:'var(--mono)', fontSize:8, fontWeight:600, padding:'2px 7px', borderRadius:1, background:alertBg, color:alertColor, letterSpacing:'.08em', flexShrink:0 }}>{c.alertLevel}</span>
                  </div>

                  {/* Stats row */}
                  <div style={{ display:'flex', gap:16, marginBottom:'.6rem' }}>
                    {[['Region',c.region],['Day',c.daysActive.toLocaleString()],['Severity',`${c.intensity}/10`]].map(([k,v]) => (
                      <div key={k}>
                        <div style={{ fontSize:9, fontFamily:'var(--mono)', color:'var(--ink3)', letterSpacing:'.06em', textTransform:'uppercase', marginBottom:2 }}>{k}</div>
                        <div style={{ fontSize:11, fontWeight: k === 'Severity' ? 700 : 600, color: k === 'Severity' ? color : 'var(--ink)', fontFamily:'var(--mono)' }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  <p style={{ fontSize:12, color:'var(--ink2)', lineHeight:1.6, marginBottom:'.6rem' }}>{c.summary}</p>

                  {/* Severity bar */}
                  <div style={{ height:2, background:'var(--border)', borderRadius:2, overflow:'hidden', marginBottom: c.slug ? '.75rem' : 0 }}>
                    <div style={{ height:'100%', width:`${c.intensity * 10}%`, background:color, borderRadius:2 }} />
                  </div>

                  {c.slug && (
                    <a href={`/research/${c.slug}`} style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--amber)', letterSpacing:'.06em', textDecoration:'none' }}>
                      Read SignalAtlas Analysis →
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
