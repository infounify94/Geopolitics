'use client';
import { useState, useMemo } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const COUNTRIES = [
  { code:'US', name:'United States',    flag:'🇺🇸', region:'Americas',    gdp:'$27.4T',  population:'335M',  militaryRank:1,  influenceScore:98, riskScore:28, alliance:'NATO',        economy:'Advanced',   militaryStrength:'Superpower'  },
  { code:'CN', name:'China',            flag:'🇨🇳', region:'Asia',         gdp:'$17.8T',  population:'1.4B',  militaryRank:3,  influenceScore:95, riskScore:42, alliance:'SCO',         economy:'Advanced',   militaryStrength:'Major Power' },
  { code:'RU', name:'Russia',           flag:'🇷🇺', region:'Europe',       gdp:'$2.2T',   population:'143M',  militaryRank:2,  influenceScore:88, riskScore:78, alliance:'CSTO',        economy:'Emerging',   militaryStrength:'Major Power' },
  { code:'IN', name:'India',            flag:'🇮🇳', region:'Asia',         gdp:'$3.7T',   population:'1.44B', militaryRank:4,  influenceScore:82, riskScore:35, alliance:'QUAD',        economy:'Emerging',   militaryStrength:'Major Power' },
  { code:'GB', name:'United Kingdom',   flag:'🇬🇧', region:'Europe',       gdp:'$3.1T',   population:'68M',   militaryRank:8,  influenceScore:80, riskScore:22, alliance:'NATO',        economy:'Advanced',   militaryStrength:'Regional'   },
  { code:'FR', name:'France',           flag:'🇫🇷', region:'Europe',       gdp:'$2.9T',   population:'68M',   militaryRank:9,  influenceScore:78, riskScore:24, alliance:'NATO',        economy:'Advanced',   militaryStrength:'Regional'   },
  { code:'DE', name:'Germany',          flag:'🇩🇪', region:'Europe',       gdp:'$4.1T',   population:'83M',   militaryRank:16, influenceScore:76, riskScore:20, alliance:'NATO',        economy:'Advanced',   militaryStrength:'Regional'   },
  { code:'JP', name:'Japan',            flag:'🇯🇵', region:'Asia',         gdp:'$4.2T',   population:'124M',  militaryRank:8,  influenceScore:74, riskScore:22, alliance:'US-Japan',    economy:'Advanced',   militaryStrength:'Regional'   },
  { code:'IL', name:'Israel',           flag:'🇮🇱', region:'Middle East',  gdp:'$521B',   population:'9.8M',  militaryRank:18, influenceScore:65, riskScore:88, alliance:'US-ally',     economy:'Advanced',   militaryStrength:'Regional'   },
  { code:'IR', name:'Iran',             flag:'🇮🇷', region:'Middle East',  gdp:'$367B',   population:'88M',   militaryRank:17, influenceScore:60, riskScore:82, alliance:'Axis',        economy:'Emerging',   militaryStrength:'Regional'   },
  { code:'SA', name:'Saudi Arabia',     flag:'🇸🇦', region:'Middle East',  gdp:'$1.1T',   population:'36M',   militaryRank:25, influenceScore:68, riskScore:45, alliance:'Arab League', economy:'Advanced',   militaryStrength:'Regional'   },
  { code:'TR', name:'Turkey',           flag:'🇹🇷', region:'Middle East',  gdp:'$1.0T',   population:'86M',   militaryRank:11, influenceScore:62, riskScore:52, alliance:'NATO',        economy:'Emerging',   militaryStrength:'Regional'   },
  { code:'PK', name:'Pakistan',         flag:'🇵🇰', region:'Asia',         gdp:'$338B',   population:'231M',  militaryRank:9,  influenceScore:48, riskScore:76, alliance:'SCO',         economy:'Developing', militaryStrength:'Regional'   },
  { code:'UA', name:'Ukraine',          flag:'🇺🇦', region:'Europe',       gdp:'$160B',   population:'37M',   militaryRank:22, influenceScore:55, riskScore:95, alliance:'NATO-aspirant',economy:'Developing', militaryStrength:'Regional'   },
  { code:'BR', name:'Brazil',           flag:'🇧🇷', region:'Americas',    gdp:'$2.1T',   population:'215M',  militaryRank:12, influenceScore:66, riskScore:48, alliance:'BRICS',       economy:'Emerging',   militaryStrength:'Regional'   },
  { code:'ZA', name:'South Africa',     flag:'🇿🇦', region:'Africa',       gdp:'$399B',   population:'60M',   militaryRank:30, influenceScore:52, riskScore:55, alliance:'BRICS',       economy:'Emerging',   militaryStrength:'Limited'    },
  { code:'SD', name:'Sudan',            flag:'🇸🇩', region:'Africa',       gdp:'$36B',    population:'46M',   militaryRank:58, influenceScore:22, riskScore:96, alliance:'None',        economy:'Developing', militaryStrength:'Limited'    },
  { code:'MM', name:'Myanmar',          flag:'🇲🇲', region:'Asia',         gdp:'$65B',    population:'55M',   militaryRank:40, influenceScore:20, riskScore:90, alliance:'ASEAN',       economy:'Developing', militaryStrength:'Limited'    },
  { code:'KP', name:'North Korea',      flag:'🇰🇵', region:'Asia',         gdp:'$28B',    population:'26M',   militaryRank:30, influenceScore:35, riskScore:92, alliance:'Axis',        economy:'Developing', militaryStrength:'Regional'   },
  { code:'KR', name:'South Korea',      flag:'🇰🇷', region:'Asia',         gdp:'$1.7T',   population:'52M',   militaryRank:6,  influenceScore:65, riskScore:32, alliance:'US-ally',     economy:'Advanced',   militaryStrength:'Regional'   },
  { code:'AU', name:'Australia',        flag:'🇦🇺', region:'Oceania',      gdp:'$1.7T',   population:'26M',   militaryRank:19, influenceScore:62, riskScore:18, alliance:'AUKUS',       economy:'Advanced',   militaryStrength:'Regional'   },
  { code:'CA', name:'Canada',           flag:'🇨🇦', region:'Americas',    gdp:'$2.1T',   population:'40M',   militaryRank:23, influenceScore:60, riskScore:16, alliance:'NATO',        economy:'Advanced',   militaryStrength:'Regional'   },
  { code:'NG', name:'Nigeria',          flag:'🇳🇬', region:'Africa',       gdp:'$477B',   population:'220M',  militaryRank:35, influenceScore:42, riskScore:68, alliance:'AU',          economy:'Developing', militaryStrength:'Limited'    },
  { code:'EG', name:'Egypt',            flag:'🇪🇬', region:'Middle East',  gdp:'$378B',   population:'105M',  militaryRank:15, influenceScore:52, riskScore:62, alliance:'Arab League', economy:'Developing', militaryStrength:'Regional'   },
  { code:'ID', name:'Indonesia',        flag:'🇮🇩', region:'Asia',         gdp:'$1.3T',   population:'275M',  militaryRank:13, influenceScore:58, riskScore:38, alliance:'ASEAN',       economy:'Emerging',   militaryStrength:'Regional'   },
  { code:'MX', name:'Mexico',           flag:'🇲🇽', region:'Americas',    gdp:'$1.3T',   population:'130M',  militaryRank:34, influenceScore:50, riskScore:58, alliance:'US-ally',     economy:'Emerging',   militaryStrength:'Limited'    },
  { code:'AF', name:'Afghanistan',      flag:'🇦🇫', region:'Asia',         gdp:'$20B',    population:'40M',   militaryRank:60, influenceScore:15, riskScore:98, alliance:'None',        economy:'Developing', militaryStrength:'Limited'    },
  { code:'IQ', name:'Iraq',             flag:'🇮🇶', region:'Middle East',  gdp:'$264B',   population:'42M',   militaryRank:45, influenceScore:32, riskScore:80, alliance:'US-backed',   economy:'Developing', militaryStrength:'Limited'    },
  { code:'SY', name:'Syria',            flag:'🇸🇾', region:'Middle East',  gdp:'$21B',    population:'22M',   militaryRank:52, influenceScore:18, riskScore:95, alliance:'Russia-backed',economy:'Developing', militaryStrength:'Limited'    },
  { code:'YE', name:'Yemen',            flag:'🇾🇪', region:'Middle East',  gdp:'$20B',    population:'33M',   militaryRank:55, influenceScore:12, riskScore:97, alliance:'None',        economy:'Developing', militaryStrength:'Limited'    },
  { code:'VN', name:'Vietnam',          flag:'🇻🇳', region:'Asia',         gdp:'$450B',   population:'98M',   militaryRank:22, influenceScore:45, riskScore:30, alliance:'ASEAN',       economy:'Emerging',   militaryStrength:'Regional'   },
  { code:'ET', name:'Ethiopia',         flag:'🇪🇹', region:'Africa',       gdp:'$144B',   population:'125M',  militaryRank:42, influenceScore:35, riskScore:72, alliance:'AU',          economy:'Developing', militaryStrength:'Limited'    },
  { code:'PL', name:'Poland',           flag:'🇵🇱', region:'Europe',       gdp:'$843B',   population:'38M',   militaryRank:21, influenceScore:52, riskScore:30, alliance:'NATO',        economy:'Advanced',   militaryStrength:'Regional'   },
  { code:'SE', name:'Sweden',           flag:'🇸🇪', region:'Europe',       gdp:'$598B',   population:'10.5M', militaryRank:25, influenceScore:54, riskScore:16, alliance:'NATO',        economy:'Advanced',   militaryStrength:'Regional'   },
  { code:'PH', name:'Philippines',      flag:'🇵🇭', region:'Asia',         gdp:'$435B',   population:'115M',  militaryRank:38, influenceScore:40, riskScore:42, alliance:'US-ally',     economy:'Emerging',   militaryStrength:'Limited'    },
];

const REGIONS = ['All Regions','Asia','Europe','Middle East','Americas','Africa','Oceania'];
const MILITARY = ['All','Superpower','Major Power','Regional','Limited'];
const ECONOMY_TYPES = ['All','Advanced','Emerging','Developing'];
const RISK = ['All Risk','Low (0-30)','Medium (31-60)','High (61-80)','Critical (81+)'];
const ALLIANCES = ['All Alliances','NATO','SCO','BRICS','QUAD','ASEAN','AU','CSTO','US-ally','Axis','None'];

function RiskBar({ score }: { score: number }) {
  const color = score >= 81 ? '#E24B4A' : score >= 61 ? '#E8931A' : score >= 31 ? '#F59E0B' : '#22C55E';
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
        <span style={{ fontSize:9, fontFamily:'var(--mono)', color:'var(--ink3)', letterSpacing:'.08em', textTransform:'uppercase' }}>Risk Score</span>
        <span style={{ fontSize:10, fontFamily:'var(--mono)', fontWeight:600, color }}>{score}/100</span>
      </div>
      <div style={{ height:3, background:'var(--border)', borderRadius:2, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${score}%`, background:color, borderRadius:2 }} />
      </div>
    </div>
  );
}

function InfluenceOrbs({ score }: { score: number }) {
  const filled = Math.round(score / 20);
  return (
    <div style={{ display:'flex', gap:3, alignItems:'center' }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{ width:8, height:8, borderRadius:'50%', background: i <= filled ? 'var(--amber)' : 'var(--border)' }} />
      ))}
      <span style={{ fontSize:10, fontFamily:'var(--mono)', color:'var(--ink3)', marginLeft:4 }}>{score}</span>
    </div>
  );
}

export default function CountriesPage() {
  const [search, setSearch]   = useState('');
  const [region, setRegion]   = useState('All Regions');
  const [military, setMilitary] = useState('All');
  const [economy, setEconomy] = useState('All');
  const [risk, setRisk]       = useState('All Risk');
  const [alliance, setAlliance] = useState('All Alliances');
  const [sort, setSort]       = useState<'influence'|'risk'|'military'>('influence');

  const filtered = useMemo(() => {
    return COUNTRIES.filter(c => {
      const matchS = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase());
      const matchR = region === 'All Regions' || c.region === region;
      const matchM = military === 'All' || c.militaryStrength === military;
      const matchE = economy === 'All' || c.economy === economy;
      const matchA = alliance === 'All Alliances' || c.alliance.includes(alliance);
      let matchRisk = true;
      if (risk === 'Low (0-30)')     matchRisk = c.riskScore <= 30;
      if (risk === 'Medium (31-60)') matchRisk = c.riskScore >= 31 && c.riskScore <= 60;
      if (risk === 'High (61-80)')   matchRisk = c.riskScore >= 61 && c.riskScore <= 80;
      if (risk === 'Critical (81+)') matchRisk = c.riskScore >= 81;
      return matchS && matchR && matchM && matchE && matchA && matchRisk;
    }).sort((a, b) => {
      if (sort === 'influence') return b.influenceScore - a.influenceScore;
      if (sort === 'risk')      return b.riskScore - a.riskScore;
      if (sort === 'military')  return a.militaryRank - b.militaryRank;
      return 0;
    });
  }, [search, region, military, economy, risk, alliance, sort]);

  const selStyle = { fontSize:12, fontFamily:'var(--mono)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'7px 10px', background:'var(--white)', color:'var(--ink)', cursor:'pointer', outline:'none' };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context':'https://schema.org', '@type':'CollectionPage', name:'Country Intelligence Hub — SignalAtlas', description:'Geopolitical risk scores, military rankings, and economic profiles for 195 nations.', url:'https://signalatlas.com/countries' }) }} />

      <Nav />

      {/* Header */}
      <div style={{ background:'var(--navy)', padding:'3rem 2rem 2.5rem', borderBottom:'1px solid rgba(255,255,255,.08)' }}>
        <div style={{ maxWidth:1240, margin:'0 auto' }}>
          <div style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--amber)', letterSpacing:'.12em', textTransform:'uppercase', marginBottom:'.5rem' }}>Country Intelligence</div>
          <h1 style={{ fontFamily:'var(--serif)', fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, color:'var(--white)', letterSpacing:'-.02em', marginBottom:'.75rem' }}>Country Intelligence Hub</h1>
          <p style={{ fontSize:15, color:'rgba(255,255,255,.55)', maxWidth:560, lineHeight:1.7 }}>Geopolitical risk scores, military rankings, GDP data, and strategic profiles. Continuously updated.</p>
          <div style={{ display:'flex', gap:'2rem', marginTop:'1.5rem', paddingTop:'1.5rem', borderTop:'1px solid rgba(255,255,255,.1)', flexWrap:'wrap' }}>
            {[['195','Nations Tracked'],['6','Global Regions'],['12','Data Points/Country'],['Real-Time','Risk Scoring']].map(([n,l]) => (
              <div key={l}>
                <div style={{ fontFamily:'var(--serif)', fontSize:'1.6rem', fontWeight:700, color:'var(--amber)' }}>{n}</div>
                <div style={{ fontFamily:'var(--mono)', fontSize:9, color:'rgba(255,255,255,.4)', letterSpacing:'.08em', textTransform:'uppercase' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main style={{ maxWidth:1240, margin:'0 auto', padding:'2rem' }}>
        {/* Filters */}
        <div style={{ background:'var(--off)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1.25rem', marginBottom:'1.5rem' }}>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center', marginBottom:8 }}>
            <input
              type="text"
              placeholder="Search country or code..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex:'1', minWidth:200, fontSize:13, fontFamily:'var(--sans)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'8px 14px', outline:'none', background:'var(--white)', color:'var(--ink)' }}
            />
            <select value={region}   onChange={e => setRegion(e.target.value)}   style={selStyle}>{REGIONS.map(r => <option key={r}>{r}</option>)}</select>
            <select value={military} onChange={e => setMilitary(e.target.value)} style={selStyle}>{MILITARY.map(m => <option key={m}>{m === 'All' ? 'All Military' : m}</option>)}</select>
            <select value={economy}  onChange={e => setEconomy(e.target.value)}  style={selStyle}>{ECONOMY_TYPES.map(e => <option key={e}>{e === 'All' ? 'All Economies' : e}</option>)}</select>
            <select value={risk}     onChange={e => setRisk(e.target.value)}     style={selStyle}>{RISK.map(r => <option key={r}>{r}</option>)}</select>
            <select value={alliance} onChange={e => setAlliance(e.target.value)} style={selStyle}>{ALLIANCES.map(a => <option key={a}>{a}</option>)}</select>
            <select value={sort}     onChange={e => setSort(e.target.value as any)} style={selStyle}>
              <option value="influence">↓ Influence</option>
              <option value="risk">↓ Risk</option>
              <option value="military">↑ Military Rank</option>
            </select>
          </div>
          <div style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--ink3)' }}>{filtered.length} of {COUNTRIES.length} countries</div>
        </div>

        {/* Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12 }}>
          {filtered.map(c => {
            const riskColor = c.riskScore >= 81 ? '#E24B4A' : c.riskScore >= 61 ? '#E8931A' : c.riskScore >= 31 ? '#F59E0B' : '#22C55E';
            const riskLabel = c.riskScore >= 81 ? 'CRITICAL' : c.riskScore >= 61 ? 'HIGH' : c.riskScore >= 31 ? 'MEDIUM' : 'LOW';
            const riskBg    = c.riskScore >= 81 ? 'var(--red-light)' : c.riskScore >= 61 ? 'var(--amber-light)' : c.riskScore >= 31 ? '#FFFBEB' : 'var(--green-light)';
            return (
              <a
                key={c.code}
                href={`/countries/${c.code.toLowerCase()}`}
                style={{ display:'block', background:'var(--white)', border:'1px solid var(--border)', borderTop:`2px solid ${riskColor}`, borderRadius:'var(--radius)', padding:'1.25rem', textDecoration:'none', transition:'box-shadow .15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(11,22,40,.1)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = 'none'}
              >
                {/* Header */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'.75rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontSize:28 }}>{c.flag}</span>
                    <div>
                      <div style={{ fontFamily:'var(--serif)', fontSize:'1rem', fontWeight:700, color:'var(--navy)', lineHeight:1.2 }}>{c.name}</div>
                      <div style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--ink3)', letterSpacing:'.08em', textTransform:'uppercase' }}>{c.region}</div>
                    </div>
                  </div>
                  <span style={{ fontFamily:'var(--mono)', fontSize:8, fontWeight:600, padding:'2px 7px', borderRadius:1, background:riskBg, color:riskColor, letterSpacing:'.08em' }}>{riskLabel}</span>
                </div>

                {/* Stats */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:'.75rem' }}>
                  {([['GDP',c.gdp],['Population',c.population],['Mil. Rank',`#${c.militaryRank}`],['Alliance',c.alliance]] as [string,string][]).map(([k,v]) => (
                    <div key={k}>
                      <div style={{ fontSize:9, fontFamily:'var(--mono)', color:'var(--ink3)', letterSpacing:'.06em', textTransform:'uppercase', marginBottom:2 }}>{k}</div>
                      <div style={{ fontSize:11, fontWeight:600, color:'var(--ink)', fontFamily:'var(--mono)' }}>{v}</div>
                    </div>
                  ))}
                </div>

                {/* Influence */}
                <div style={{ marginBottom:6 }}>
                  <div style={{ fontSize:9, fontFamily:'var(--mono)', color:'var(--ink3)', letterSpacing:'.06em', textTransform:'uppercase', marginBottom:4 }}>Global Influence</div>
                  <InfluenceOrbs score={c.influenceScore} />
                </div>
                <RiskBar score={c.riskScore} />
              </a>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--ink3)', fontFamily:'var(--mono)', fontSize:13 }}>
            No countries match your filters. Try adjusting your search.
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
