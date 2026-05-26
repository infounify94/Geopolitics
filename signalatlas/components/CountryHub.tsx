'use client';
import { useState, useMemo } from 'react';
import type { Country } from '@/app/countries/page';

interface Props { countries: Country[] }

const REGIONS   = ['All Regions', 'Asia', 'Europe', 'Middle East', 'Americas', 'Africa', 'Oceania'];
const MILITARY  = ['All', 'Superpower', 'Major Power', 'Regional', 'Limited', 'None'];
const ECONOMIES = ['All', 'Advanced', 'Emerging', 'Developing'];
const RISK_BANDS = ['All Risk', 'Low (0-30)', 'Medium (31-60)', 'High (61-80)', 'Critical (81+)'];

function riskColor(score: number) {
  return score >= 81 ? '#E24B4A' : score >= 61 ? '#E8931A' : score >= 31 ? '#F59E0B' : '#22C55E';
}

function RiskBar({ score }: { score: number }) {
  const color = riskColor(score);
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--ink3)', letterSpacing: '.08em', textTransform: 'uppercase' }}>Risk</span>
        <span style={{ fontSize: 10, fontFamily: 'var(--mono)', fontWeight: 600, color }}>{score}/100</span>
      </div>
      <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 2 }} />
      </div>
    </div>
  );
}

function InfluenceOrbs({ score }: { score: number }) {
  const filled = Math.round(score / 20);
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i <= filled ? 'var(--amber)' : 'var(--border)' }} />
      ))}
      <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--ink3)', marginLeft: 4 }}>{score}</span>
    </div>
  );
}

export default function CountryHub({ countries }: Props) {
  const [search, setSearch]   = useState('');
  const [region, setRegion]   = useState('All Regions');
  const [military, setMilitary] = useState('All');
  const [economy, setEconomy] = useState('All');
  const [risk, setRisk]       = useState('All Risk');
  const [sort, setSort]       = useState<'influence' | 'risk' | 'military'>('influence');

  const filtered = useMemo(() => {
    return countries.filter(c => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (region !== 'All Regions' && c.region !== region) return false;
      if (military !== 'All' && c.militaryStrength !== military) return false;
      if (economy !== 'All' && c.economy !== economy) return false;
      if (risk === 'Low (0-30)'    && c.riskScore > 30)  return false;
      if (risk === 'Medium (31-60)' && (c.riskScore < 31 || c.riskScore > 60)) return false;
      if (risk === 'High (61-80)'  && (c.riskScore < 61 || c.riskScore > 80)) return false;
      if (risk === 'Critical (81+)' && c.riskScore < 81) return false;
      return true;
    }).sort((a, b) => {
      if (sort === 'influence') return b.influenceScore - a.influenceScore;
      if (sort === 'risk')      return b.riskScore - a.riskScore;
      return a.militaryRank - b.militaryRank;
    });
  }, [countries, search, region, military, economy, risk, sort]);

  const sel: React.CSSProperties = {
    fontSize: 12, fontFamily: 'var(--mono)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '7px 10px', background: 'var(--white)',
    color: 'var(--ink)', cursor: 'pointer', outline: 'none',
  };

  return (
    <main style={{ maxWidth: 1240, margin: '0 auto', padding: '2rem' }}>

      {/* Filter bar */}
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <input
          type="search"
          placeholder="Search countries..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...sel, flex: '1 1 180px', minWidth: 140 }}
          aria-label="Search countries"
        />
        {([['Region', REGIONS, region, setRegion], ['Military', MILITARY, military, setMilitary], ['Economy', ECONOMIES, economy, setEconomy], ['Risk', RISK_BANDS, risk, setRisk]] as [string, string[], string, (v: string) => void][]).map(([label, opts, val, setter]) => (
          <select key={label} value={val} onChange={e => setter(e.target.value)} style={sel} aria-label={label}>
            {opts.map(o => <option key={o}>{o}</option>)}
          </select>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          {(['influence', 'risk', 'military'] as const).map(s => (
            <button key={s} onClick={() => setSort(s)}
              style={{ fontSize: 10, fontFamily: 'var(--mono)', padding: '6px 10px', borderRadius: 2, border: `1px solid ${sort === s ? 'var(--amber)' : 'var(--border)'}`, background: sort === s ? 'var(--amber)' : 'var(--white)', color: sort === s ? 'var(--white)' : 'var(--ink3)', cursor: 'pointer', letterSpacing: '.04em', textTransform: 'uppercase' }}>
              {s === 'military' ? 'Military' : s === 'risk' ? 'Risk ↓' : 'Influence ↓'}
            </button>
          ))}
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', letterSpacing: '.04em', flexShrink: 0 }}>
          {filtered.length} nations
        </div>
      </div>

      {/* Country grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {filtered.map(c => {
          const rc = riskColor(c.riskScore);
          const riskLabel = c.riskScore >= 81 ? 'CRITICAL' : c.riskScore >= 61 ? 'HIGH' : c.riskScore >= 31 ? 'MED' : 'LOW';
          return (
            <a
              key={c.code}
              href={`/countries/${c.code.toLowerCase()}`}
              style={{ display: 'block', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.1rem', textDecoration: 'none', transition: 'box-shadow .15s, transform .15s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 4px 16px rgba(11,22,40,.1)'; el.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = 'none'; el.style.transform = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 28 }}>{c.flag}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: '.95rem', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.2 }}>{c.name}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', letterSpacing: '.06em', textTransform: 'uppercase' }}>{c.region} · #{c.militaryRank} military</div>
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 1, background: `${rc}22`, color: rc, letterSpacing: '.08em', flexShrink: 0 }}>
                  {riskLabel}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', marginBottom: '.6rem' }}>
                {([['GDP', c.gdp], ['Population', c.population], ['Alliance', c.alliance], ['Economy', c.economy]] as [string, string][]).map(([k, v]) => (
                  <div key={k}>
                    <span style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{k}: </span>
                    <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--ink)', fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--ink3)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 3 }}>Global Influence</div>
                <InfluenceOrbs score={c.influenceScore} />
              </div>
              <RiskBar score={c.riskScore} />
            </a>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginTop: 12 }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>🔍</div>
          <div style={{ fontFamily: 'var(--serif)', fontWeight: 700, color: 'var(--navy)' }}>No countries match your filters</div>
          <button onClick={() => { setSearch(''); setRegion('All Regions'); setMilitary('All'); setEconomy('All'); setRisk('All Risk'); }}
            style={{ marginTop: 12, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--amber)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Reset all filters
          </button>
        </div>
      )}
    </main>
  );
}
