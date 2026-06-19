'use client';
import { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { CONFLICT_POINTS, TYPE_COLORS, TYPE_LABELS, getDaysActive } from '@/lib/conflictData';
import type { ConflictPoint } from '@/lib/conflictData';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';



const TYPE_CONFIG: Record<string, { color: string; label: string; border: string }> = {
  'active-war':        { color: TYPE_COLORS['active-war'],        label: TYPE_LABELS['active-war'],        border:'#FF6B6B' },
  'diplomatic-crisis': { color: TYPE_COLORS['diplomatic-crisis'], label: TYPE_LABELS['diplomatic-crisis'], border:'#FBBF24' },
  'sanctions':         { color: TYPE_COLORS['sanctions'],         label: TYPE_LABELS['sanctions'],         border:'#60A5FA' },
  'flashpoint':        { color: TYPE_COLORS['flashpoint'],        label: TYPE_LABELS['flashpoint'],        border:'#FBA849' },
  'resolved':          { color: TYPE_COLORS['resolved'],          label: TYPE_LABELS['resolved'],          border:'#9CA3AF' },
};

export default function ConflictMap({ filter = 'all' }: { filter?: string }) {
  const [selected, setSelected] = useState<ConflictPoint | null>(null);
  const [hovered, setHovered]   = useState<string | null>(null);
  const [loaded, setLoaded]     = useState(false);

  useEffect(() => { setLoaded(true); }, []);

  const points = filter === 'all' ? CONFLICT_POINTS : CONFLICT_POINTS.filter(c => c.type === filter);

  if (!loaded) {
    return (
      <div style={{ height:520, background:'var(--navy)', borderRadius:'var(--radius)', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,.4)', fontFamily:'var(--mono)', fontSize:12, letterSpacing:'.06em' }}>
        Loading conflict data...
      </div>
    );
  }

  return (
    <div style={{ position:'relative', background:'var(--navy)', borderRadius:'var(--radius)', overflow:'hidden', border:'1px solid rgba(255,255,255,.06)' }}>
      {/* Map */}
      <div style={{ height:520 }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale:130, center:[15, 20] }}
          style={{ width:'100%', height:'100%' }}
        >
          <ZoomableGroup zoom={1} center={[15, 20]}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map(geo => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#1A2B47"
                    stroke="#253652"
                    strokeWidth={0.5}
                    style={{ default:{outline:'none'}, hover:{fill:'#253652',outline:'none'}, pressed:{outline:'none'} }}
                  />
                ))
              }
            </Geographies>

            {points.map(conflict => {
              const cfg = TYPE_CONFIG[conflict.type] ?? TYPE_CONFIG['resolved'];
              const isSel = selected?.id === conflict.id;
              const isHov = hovered === conflict.id;
              const size  = conflict.alertLevel === 'CRITICAL' ? 10 : conflict.alertLevel === 'HIGH' ? 8 : 6;
              return (
                <Marker
                  key={conflict.id}
                  coordinates={[conflict.lng, conflict.lat]}
                  onClick={() => setSelected(isSel ? null : conflict)}
                  onMouseEnter={() => setHovered(conflict.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <circle
                    r={isSel || isHov ? size + 4 : size}
                    fill={cfg.color}
                    stroke={cfg.border}
                    strokeWidth={isSel ? 3 : 1.5}
                    opacity={isSel || isHov ? 1 : 0.85}
                    style={{ cursor:'pointer', transition:'all .2s' }}
                  />
                  {conflict.alertLevel === 'CRITICAL' && (
                    <circle r={size + 8} fill="none" stroke={cfg.color} strokeWidth={1} opacity={0.3}
                      style={{ animation:'pulseRing 2s ease-in-out infinite' }}
                    />
                  )}
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Selected panel */}
      {selected && (
        <div style={{ position:'absolute', top:16, right:16, width:300, background:'rgba(11,22,40,.97)', border:'1px solid rgba(255,255,255,.12)', borderRadius:'var(--radius)', padding:'1.25rem', backdropFilter:'blur(12px)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'.75rem' }}>
            <div>
              <div style={{ fontFamily:'var(--mono)', fontSize:9, color:TYPE_CONFIG[selected.type].color, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:3 }}>
                {TYPE_CONFIG[selected.type].label}
              </div>
              <div style={{ fontFamily:'var(--serif)', fontSize:'1rem', fontWeight:700, color:'var(--white)', lineHeight:1.3 }}>{selected.name}</div>
            </div>
            <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', color:'rgba(255,255,255,.4)', fontSize:20, cursor:'pointer', padding:0, lineHeight:1 }}>×</button>
          </div>

          <div style={{ display:'flex', gap:14, marginBottom:'.75rem' }}>
            {[['Region',selected.region],['Days',getDaysActive(selected.startDate).toLocaleString()],['Severity',`${selected.intensity}/10`]].map(([k,v]) => (
              <div key={k}>
                <div style={{ fontFamily:'var(--mono)', fontSize:8, color:'rgba(255,255,255,.35)', textTransform:'uppercase', letterSpacing:'.08em' }}>{k}</div>
                <div style={{ fontSize:11, marginTop:2, fontWeight: k === 'Severity' ? 700 : 400, fontFamily: k === 'Severity' ? 'var(--mono)' : 'var(--sans)', color: k === 'Severity' ? TYPE_CONFIG[selected.type].color : 'rgba(255,255,255,.75)' }}>{v}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize:12, color:'rgba(255,255,255,.55)', lineHeight:1.6, marginBottom:'.75rem' }}>{selected.summary}</p>

          {/* Severity bar */}
          <div style={{ height:2, background:'rgba(255,255,255,.1)', borderRadius:2, marginBottom:'.75rem', overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${selected.intensity * 10}%`, background:TYPE_CONFIG[selected.type].color }} />
          </div>

          {/* Alert badge */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontFamily:'var(--mono)', fontSize:8, fontWeight:600, padding:'2px 8px', borderRadius:1, background:`${TYPE_CONFIG[selected.type].color}22`, color:TYPE_CONFIG[selected.type].color, letterSpacing:'.08em' }}>
              {selected.alertLevel}
            </span>
            {selected.slug && (
              <a href={`/research/${selected.slug}`} style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--amber)', letterSpacing:'.04em', textDecoration:'none' }}>
                Read Analysis →
              </a>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{ position:'absolute', bottom:16, left:16, background:'rgba(11,22,40,.92)', border:'1px solid rgba(255,255,255,.08)', borderRadius:'var(--radius)', padding:'.75rem 1rem', backdropFilter:'blur(8px)' }}>
        <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
          {Object.entries(TYPE_CONFIG).filter(([k]) => k !== 'resolved').map(([key, cfg]) => (
            <div key={key} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:cfg.color, flexShrink:0 }} />
              <span style={{ fontSize:9, fontFamily:'var(--mono)', color:'rgba(255,255,255,.5)', letterSpacing:'.04em' }}>{cfg.label}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop:6, fontSize:9, fontFamily:'var(--mono)', color:'rgba(255,255,255,.25)' }}>Click any marker for details · Scroll to zoom</div>
      </div>
    </div>
  );
}
