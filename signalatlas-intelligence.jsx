import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";

const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,300;1,600&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap";

/* ─── Data ────────────────────────────────────────────────────── */
const TICKERS = [
  "SUDAN · Ceasefire talks collapse — Day 398 of civil war",
  "INDIA · Gold reserves increase third consecutive month — RBI confirms",
  "PAKISTAN · IMF loan #23 approved — identical conditions to 2013",
  "RED SEA · Disruption adds avg $340/container for Indian importers",
  "PATTERN ALERT · 14 nations match political protest blueprint",
];

const SIGNALS = [
  { v: "1,247", l: "Research Articles",   d: "+12",  up: true,  c: "#c9a84c" },
  { v: "6",     l: "Active Conflicts",    d: "↑ 1",  up: false, c: "#e05252" },
  { v: "87",    l: "Nations Monitored",   d: "live",  up: null,  c: "#7eb8d4" },
  { v: "52",    l: "Patterns Identified", d: "+3",   up: true,  c: "#6dc48a" },
  { v: "$847B", l: "Arms Trade 2024",     d: "+14%", up: false, c: "#e07b52" },
];

const ARTICLES = [
  {
    id: "SA-2026-0523",
    clearance: "OPEN SOURCE",
    region: "GLOBAL",
    cat: "POWER NETWORKS",
    catC: "#e05252",
    title: "The Political Protest Blueprint: 14 Countries, One Pattern",
    body: "From Kyiv to Caracas, the same funding architecture surfaces in documented records. NGO filings, parliamentary records, and FARA disclosures reveal structural overlaps that strain coincidence.",
    data: [
      { k: "Countries matched", v: "14" },
      { k: "NGO overlaps", v: "34" },
      { k: "Pattern accuracy", v: "71%" },
      { k: "Span", v: "2000–2025" },
    ],
    conf: "HIGH", evid: "STRONG", src: 8,
    sources: ["Reuters", "UN", "OpenSecrets"],
    time: "14 MIN READ", date: "23 MAY 2026", impact: 9.4,
    spark: [12,18,14,28,24,38,45,52,48,61],
  },
  {
    id: "SA-2026-0522",
    clearance: "OPEN SOURCE",
    region: "MIDDLE EAST / SOUTH ASIA",
    cat: "ECONOMIC WARFARE",
    catC: "#c9a84c",
    title: "IMF Loan Dependency: 40 Nations, One Outcome",
    body: "Pakistan's 23rd IMF loan follows a statistically identical pattern to Argentina 2001 and Sri Lanka 2022. Conditions, sequencing, and civil outcomes are indistinguishable across cases.",
    data: [
      { k: "Nations studied", v: "40" },
      { k: "Avg loans to default", v: "11.3" },
      { k: "Unrest correlation", v: "78%" },
      { k: "Currency drop avg", v: "−34%" },
    ],
    conf: "HIGH", evid: "STRONG", src: 11,
    sources: ["IMF", "World Bank", "FT"],
    time: "18 MIN READ", date: "22 MAY 2026", impact: 9.1,
    spark: null,
  },
  {
    id: "SA-2026-0521",
    clearance: "OPEN SOURCE",
    region: "INDIA / ASIA-PACIFIC",
    cat: "INDIA LENS",
    catC: "#6dc48a",
    title: "India's Dollar–Yuan Position Is Strategic Ambiguity by Design",
    body: "Three consecutive months of gold reserve increases. Rupee trade agreements with 18 partners. This is not fence-sitting — it is calculated optionality in a bifurcating monetary order.",
    data: [
      { k: "Gold increase streak", v: "3 months" },
      { k: "Rupee trade partners", v: "18" },
      { k: "USD dependency Δ", v: "−8%" },
      { k: "BRICS trade share Δ", v: "+12%" },
    ],
    conf: "MEDIUM", evid: "MODERATE", src: 6,
    sources: ["RBI", "MEA", "Bloomberg"],
    time: "12 MIN READ", date: "21 MAY 2026", impact: 8.9,
    spark: null,
  },
];

const CONFLICTS = [
  { name: "Gaza – Israel",    region: "MIDDLE EAST", day: 596,  intensity: 9.5, tag: "CRITICAL" },
  { name: "Russia – Ukraine", region: "EUROPE",      day: 1184, intensity: 9.2, tag: "CRITICAL" },
  { name: "Sudan",            region: "AFRICA",       day: 398,  intensity: 8.1, tag: "ACTIVE"   },
  { name: "Myanmar Junta",   region: "ASIA",          day: 1180, intensity: 7.8, tag: "ACTIVE"   },
];

const COUNTRIES = [
  { flag: "🇺🇸", name: "United States", status: "Trade wars + election dynamics", alert: "HIGH",     n: 234 },
  { flag: "🇨🇳", name: "China",          status: "Taiwan + BRI debt diplomacy",    alert: "HIGH",     n: 198 },
  { flag: "🇷🇺", name: "Russia",         status: "Ukraine + 267 active sanctions", alert: "CRITICAL", n: 187 },
  { flag: "🇮🇳", name: "India",          status: "Strategic realignment phase",    alert: "WATCH",    n: 156 },
  { flag: "🇮🇷", name: "Iran",           status: "Nuclear + proxy network active", alert: "HIGH",     n: 134 },
  { flag: "🇵🇰", name: "Pakistan",       status: "IMF loan #23 + fiscal crisis",   alert: "HIGH",     n: 98  },
];

const RADAR_DATA = [
  { a: "Conflict",   BBC: 85, RT: 60, AJ: 75 },
  { a: "Economy",    BBC: 45, RT: 78, AJ: 65 },
  { a: "Civilians",  BBC: 60, RT: 40, AJ: 80 },
  { a: "Govt Angle", BBC: 70, RT: 85, AJ: 55 },
  { a: "Aid",        BBC: 55, RT: 35, AJ: 82 },
  { a: "History",    BBC: 40, RT: 65, AJ: 70 },
];

const GROWTH = [
  {m:"Oct",v:42},{m:"Nov",v:67},{m:"Dec",v:89},
  {m:"Jan",v:124},{m:"Feb",v:156},{m:"Mar",v:198},
  {m:"Apr",v:234},{m:"May",v:267},
];

const RECENT = [
  { cat: "MEDIA",     title: "Who Funds the 'Independent' Fact-Checkers?",       time: "2h",  conf: "HIGH",   impact: 7.9 },
  { cat: "AFRICA",    title: "Sudan's Gold War: The Hidden Economic Motive",      time: "5h",  conf: "MEDIUM", impact: 8.2 },
  { cat: "SANCTIONS", title: "How Russia Bypassed SWIFT — 18-Month Blueprint",   time: "8h",  conf: "HIGH",   impact: 8.5 },
  { cat: "INDIA",     title: "Red Sea: India's Shipping Cost Data Analysis",      time: "11h", conf: "HIGH",   impact: 8.0 },
  { cat: "ARMS",      title: "$847B Weapons Transferred in 2024 — The Full Map", time: "1d",  conf: "HIGH",   impact: 9.0 },
];

const GRAPH_N = [
  { label:["Russia","Sanctions"], x:100, y:95,  r:38, c:"#e05252" },
  { label:["Oil","Trade"],        x:255, y:62,  r:31, c:"#c9a84c" },
  { label:["India","Imports"],    x:385, y:100, r:28, c:"#6dc48a" },
  { label:["USD","Pressure"],     x:215, y:185, r:26, c:"#7eb8d4" },
  { label:["Fuel","Prices"],      x:345, y:200, r:23, c:"#c9a84c" },
  { label:["Inflation"],          x:460, y:168, r:21, c:"#b57bdc" },
  { label:["BRICS","Talks"],      x:98,  y:205, r:22, c:"#7eb8d4" },
];
const GRAPH_E = [
  {s:0,t:1,w:92},{s:1,t:2,w:78},{s:0,t:3,w:85},
  {s:2,t:4,w:67},{s:4,t:5,w:61},{s:3,t:4,w:55},
  {s:0,t:6,w:70},{s:6,t:3,w:48},{s:1,t:3,w:60},
];

/* ─── Helpers ─────────────────────────────────────────────────── */
function RelGraph() {
  const [hov, setHov] = useState(null);
  return (
    <svg width="100%" viewBox="0 0 530 275" style={{ display:"block" }}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {GRAPH_E.map((e,i)=>{
        const s=GRAPH_N[e.s],t=GRAPH_N[e.t];
        const active=hov===e.s||hov===e.t;
        return (
          <g key={i}>
            <line x1={s.x} y1={s.y} x2={t.x} y2={t.y}
              stroke={active?s.c:"rgba(255,255,255,0.12)"}
              strokeWidth={active?1.5:1}
              strokeDasharray={active?"none":"3 4"}/>
            {active&&(
              <text x={(s.x+t.x)/2} y={(s.y+t.y)/2-6}
                textAnchor="middle" fontSize={9}
                fill={s.c} fontFamily="'JetBrains Mono',monospace" fontWeight={500}>{e.w}%</text>
            )}
          </g>
        );
      })}
      {GRAPH_N.map((n,i)=>(
        <g key={i} style={{cursor:"pointer"}}
          onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
          <circle cx={n.x} cy={n.y} r={hov===i?n.r+5:n.r}
            fill={hov===i?n.c:"transparent"}
            stroke={n.c} strokeWidth={hov===i?0:1.5}
            style={{transition:"all 0.2s"}}
            filter={hov===i?"url(#glow)":"none"}/>
          <circle cx={n.x} cy={n.y} r={hov===i?n.r+5:n.r}
            fill={hov===i?`${n.c}22`:"transparent"}/>
          {n.label.map((w,wi)=>(
            <text key={wi} x={n.x}
              y={n.y+(n.label.length===1?4:wi===0?-4:9)}
              textAnchor="middle"
              fontSize={hov===i?9:8}
              fill={hov===i?"#fff":n.c}
              fontFamily="'JetBrains Mono',monospace"
              fontWeight={hov===i?500:400}
              style={{pointerEvents:"none"}}>{w}</text>
          ))}
        </g>
      ))}
    </svg>
  );
}

function SparkLine({ data, color }) {
  const d = data.map((v,i)=>({i,v}));
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={d} margin={{top:2,right:0,left:0,bottom:0}}>
        <defs>
          <linearGradient id={`sp${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="100%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v"
          stroke={color} strokeWidth={1.5}
          fill={`url(#sp${color.replace('#','')})`} dot={false}/>
      </AreaChart>
    </ResponsiveContainer>
  );
}

const CONF = {
  HIGH:   { bg:"rgba(109,196,138,0.12)", c:"#6dc48a", b:"rgba(109,196,138,0.3)" },
  MEDIUM: { bg:"rgba(201,168,76,0.12)",  c:"#c9a84c", b:"rgba(201,168,76,0.3)"  },
  LOW:    { bg:"rgba(224,82,82,0.12)",   c:"#e05252", b:"rgba(224,82,82,0.3)"   },
};
const ALERT_C = {
  CRITICAL: "#e05252", HIGH: "#c9a84c", WATCH: "#6dc48a", ACTIVE: "#c9a84c",
};

export default function App() {
  const [tick, setTick]     = useState(0);
  const [time, setTime]     = useState(new Date());
  const [loaded, setLoaded] = useState(false);
  const [hovArt, setHovArt] = useState(null);

  useEffect(()=>{ setTimeout(()=>setLoaded(true),100); },[]);
  useEffect(()=>{ const t=setInterval(()=>setTime(new Date()),1000); return()=>clearInterval(t); },[]);
  useEffect(()=>{ const t=setInterval(()=>setTick(p=>(p+1)%TICKERS.length),4500); return()=>clearInterval(t); },[]);

  return (
    <div style={{
      background:"#0c0e14",
      minHeight:"100vh",
      fontFamily:"'Syne',sans-serif",
      color:"#d4cfc5",
      overflowX:"hidden",
    }}>
      <link rel="stylesheet" href={FONTS}/>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}

        /* Grain overlay */
        body::before {
          content:'';
          position:fixed; inset:0; z-index:0; pointer-events:none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          opacity:0.028;
        }

        /* Grid background */
        .bg-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes scan   {
          0%   { transform:translateY(-100%); opacity:0; }
          10%  { opacity:1; }
          90%  { opacity:1; }
          100% { transform:translateY(100vh); opacity:0; }
        }
        @keyframes tickIn { from{opacity:0;transform:translateX(6px)} to{opacity:1;transform:translateX(0)} }
        @keyframes blink  { 0%,100%{opacity:1} 49%{opacity:1} 50%,99%{opacity:0} }

        .fade0{animation:fadeUp 0.6s ease 0.0s both;}
        .fade1{animation:fadeUp 0.6s ease 0.08s both;}
        .fade2{animation:fadeUp 0.6s ease 0.16s both;}
        .fade3{animation:fadeUp 0.6s ease 0.24s both;}
        .fade4{animation:fadeUp 0.6s ease 0.32s both;}
        .fade5{animation:fadeUp 0.6s ease 0.40s both;}
        .fade6{animation:fadeUp 0.6s ease 0.48s both;}

        .card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius:3px;
          backdrop-filter: blur(4px);
        }
        .card-hover {
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
          cursor:pointer;
        }
        .card-hover:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(201,168,76,0.3);
          transform: translateY(-1px);
        }

        .sec-label {
          font-size:9px; font-weight:700; letter-spacing:0.22em;
          color:rgba(255,255,255,0.3); text-transform:uppercase;
          font-family:'JetBrains Mono',monospace;
          display:flex; align-items:center; gap:8px;
          margin-bottom:16px;
        }
        .sec-label::before {
          content:''; display:block; width:20px; height:1px;
          background:rgba(255,255,255,0.2);
        }

        .mono { font-family:'JetBrains Mono',monospace; }
        .serif { font-family:'Cormorant Garamond',Georgia,serif; }

        /* Scanline effect on hero */
        .scanline {
          position:absolute; width:100%; height:2px;
          background:linear-gradient(transparent, rgba(201,168,76,0.08), transparent);
          animation:scan 8s linear infinite;
          pointer-events:none;
        }

        /* Blink cursor */
        .blink { animation:blink 1s step-end infinite; }

        /* Mobile */
        @media(max-width:900px){
          .grid-main { grid-template-columns:1fr !important; }
          .grid-3    { grid-template-columns:1fr !important; }
          .signal-grid { grid-template-columns:repeat(3,1fr) !important; }
          .hero-inner { padding:28px 20px !important; }
          .hero-h { font-size:clamp(28px,8vw,52px) !important; }
          .nav-links { display:none !important; }
          .nav-time  { display:none !important; }
        }
        @media(max-width:540px){
          .signal-grid { grid-template-columns:repeat(2,1fr) !important; }
          .signal-grid .sig:nth-child(n+3) { display:none; }
          .main-pad { padding:16px 14px !important; }
          .footer-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      {/* ── TOP NAV ── */}
      <nav style={{
        position:"sticky", top:0, zIndex:200,
        background:"rgba(12,14,20,0.92)",
        borderBottom:"1px solid rgba(255,255,255,0.06)",
        backdropFilter:"blur(12px)",
      }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px",
          display:"flex", alignItems:"center", justifyContent:"space-between", height:50 }}>

          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <svg width="22" height="22" viewBox="0 0 22 22">
              <circle cx="11" cy="11" r="10" fill="none" stroke="#c9a84c" strokeWidth="1"/>
              <circle cx="11" cy="11" r="6"  fill="none" stroke="#c9a84c" strokeWidth="0.5" opacity="0.5"/>
              <circle cx="11" cy="11" r="2"  fill="#c9a84c"/>
              <line x1="11" y1="1" x2="11" y2="4"  stroke="#c9a84c" strokeWidth="1"/>
              <line x1="11" y1="18" x2="11" y2="21" stroke="#c9a84c" strokeWidth="1"/>
              <line x1="1" y1="11" x2="4"  y2="11" stroke="#c9a84c" strokeWidth="1"/>
              <line x1="18" y1="11" x2="21" y2="11" stroke="#c9a84c" strokeWidth="1"/>
            </svg>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:19,
              fontWeight:700, color:"#fff", letterSpacing:"0.04em" }}>
              Signal<span style={{color:"#c9a84c",fontStyle:"italic"}}>Atlas</span>
            </span>
            <span style={{ fontSize:8, fontFamily:"'JetBrains Mono',monospace",
              color:"rgba(201,168,76,0.5)", letterSpacing:"0.2em",
              borderLeft:"1px solid rgba(255,255,255,0.1)", paddingLeft:10 }}>
              INTELLIGENCE RESEARCH
            </span>
          </div>

          <div className="nav-links" style={{ display:"flex", gap:2 }}>
            {["Conflicts","Countries","Topics","Timelines","Data","Patterns"].map(l=>(
              <div key={l} style={{ fontSize:11, padding:"5px 12px", borderRadius:3,
                color:"rgba(255,255,255,0.4)", cursor:"pointer",
                fontWeight:600, letterSpacing:"0.06em",
                transition:"all 0.15s" }}
                onMouseEnter={e=>{e.target.style.color="#fff";e.target.style.background="rgba(255,255,255,0.06)";}}
                onMouseLeave={e=>{e.target.style.color="rgba(255,255,255,0.4)";e.target.style.background="transparent";}}>
                {l}
              </div>
            ))}
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div className="nav-time mono" style={{ fontSize:10, color:"rgba(255,255,255,0.25)",
              letterSpacing:"0.05em" }}>
              {time.toUTCString().slice(0,22)} UTC
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:5,
              padding:"4px 10px", border:"1px solid rgba(224,82,82,0.4)",
              borderRadius:2, background:"rgba(224,82,82,0.07)" }}>
              <div style={{ width:5, height:5, borderRadius:"50%",
                background:"#e05252", animation:"pulse 1.4s ease-in-out infinite" }}/>
              <span className="mono" style={{ fontSize:9, color:"#e05252",
                letterSpacing:"0.15em" }}>LIVE</span>
            </div>
            <div style={{ padding:"5px 16px", background:"#c9a84c",
              borderRadius:2, fontSize:11, cursor:"pointer",
              color:"#0c0e14", fontWeight:700, letterSpacing:"0.06em" }}>
              SUBSCRIBE
            </div>
          </div>
        </div>
      </nav>

      {/* ── INTEL TICKER ── */}
      <div style={{ background:"rgba(201,168,76,0.06)",
        borderBottom:"1px solid rgba(201,168,76,0.15)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"7px 24px",
          display:"flex", alignItems:"center", gap:14 }}>
          <span className="mono" style={{ fontSize:8, fontWeight:500,
            letterSpacing:"0.2em", color:"#c9a84c",
            border:"1px solid rgba(201,168,76,0.4)", padding:"2px 8px",
            borderRadius:1, whiteSpace:"nowrap" }}>INTEL FEED</span>
          <span key={tick} style={{ fontSize:11, color:"rgba(212,207,197,0.7)",
            animation:"tickIn 0.4s ease",
            fontFamily:"'Syne',sans-serif" }}>{TICKERS[tick]}</span>
          <span className="blink mono" style={{ fontSize:11,
            color:"rgba(201,168,76,0.6)", marginLeft:"auto" }}>█</span>
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="bg-grid" style={{ position:"relative", overflow:"hidden",
        borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div className="scanline"/>

        {/* Background radial glow */}
        <div style={{ position:"absolute", top:"50%", left:"50%",
          transform:"translate(-50%,-50%)",
          width:800, height:400,
          background:"radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 70%)",
          pointerEvents:"none" }}/>

        <div className="hero-inner fade0" style={{
          maxWidth:1200, margin:"0 auto", padding:"48px 24px 40px" }}>

          {/* Classification bar */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
            <div style={{ height:1, flex:1, background:"rgba(201,168,76,0.2)" }}/>
            <span className="mono" style={{ fontSize:9, letterSpacing:"0.3em",
              color:"rgba(201,168,76,0.5)" }}>OPEN SOURCE INTELLIGENCE · SIGNALATLAS.COM</span>
            <div style={{ height:1, flex:1, background:"rgba(201,168,76,0.2)" }}/>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }}>
            <div>
              <div style={{ marginBottom:14, display:"flex", gap:8 }}>
                <span className="mono" style={{ fontSize:9, letterSpacing:"0.18em",
                  color:"#e05252", border:"1px solid rgba(224,82,82,0.35)",
                  padding:"3px 9px", borderRadius:1 }}>6 ACTIVE CONFLICTS</span>
                <span className="mono" style={{ fontSize:9, letterSpacing:"0.18em",
                  color:"#c9a84c", border:"1px solid rgba(201,168,76,0.35)",
                  padding:"3px 9px", borderRadius:1 }}>87 NATIONS MONITORED</span>
              </div>

              <h1 className="hero-h serif" style={{
                fontSize:"clamp(32px,4.5vw,56px)",
                fontWeight:700, lineHeight:1.18,
                color:"#fff", letterSpacing:"-0.01em",
                marginBottom:18,
              }}>
                Where Events Connect.<br/>
                <span style={{ color:"#c9a84c", fontStyle:"italic" }}>
                  Patterns Emerge.
                </span>
              </h1>

              <p style={{ fontSize:14, lineHeight:1.75, color:"rgba(212,207,197,0.65)",
                marginBottom:24, maxWidth:480, fontFamily:"'Cormorant Garamond',serif",
                fontWeight:300, fontSize:17 }}>
                Independent geopolitical research. Evidence-based. Data-verified.
                India-contextualised. Every article connects what mainstream analysis leaves unconnected.
              </p>

              <div style={{ display:"flex", gap:10 }}>
                <div style={{ padding:"9px 22px", background:"#c9a84c",
                  color:"#0c0e14", fontWeight:700, borderRadius:2,
                  fontSize:12, cursor:"pointer", letterSpacing:"0.06em" }}>
                  BROWSE RESEARCH
                </div>
                <div style={{ padding:"9px 22px",
                  border:"1px solid rgba(255,255,255,0.15)",
                  color:"rgba(255,255,255,0.6)", borderRadius:2,
                  fontSize:12, cursor:"pointer", letterSpacing:"0.06em",
                  transition:"all 0.15s" }}
                  onMouseEnter={e=>{e.target.style.borderColor="rgba(201,168,76,0.4)";e.target.style.color="#c9a84c";}}
                  onMouseLeave={e=>{e.target.style.borderColor="rgba(255,255,255,0.15)";e.target.style.color="rgba(255,255,255,0.6)";}}>
                  METHODOLOGY
                </div>
              </div>
            </div>

            {/* Hero right — world dot map */}
            <div style={{ position:"relative" }}>
              <svg viewBox="0 0 520 280" width="100%" style={{ opacity:0.85 }}>
                {/* Grid lines */}
                {[0,1,2,3,4,5].map(i=>(
                  <line key={`h${i}`} x1={0} y1={i*56} x2={520} y2={i*56}
                    stroke="rgba(255,255,255,0.04)" strokeWidth={1}/>
                ))}
                {[0,1,2,3,4,5,6,7,8,9,10].map(i=>(
                  <line key={`v${i}`} x1={i*52} y1={0} x2={i*52} y2={280}
                    stroke="rgba(255,255,255,0.04)" strokeWidth={1}/>
                ))}

                {/* Subtle continent outlines as dot clusters */}
                {/* North America */}
                {[[90,60],[100,70],[110,80],[105,90],[95,100],[120,75],[130,80],[125,95]].map(([x,y],i)=>(
                  <circle key={`na${i}`} cx={x} cy={y} r={2}
                    fill="rgba(255,255,255,0.12)"/>
                ))}
                {/* Europe */}
                {[[240,55],[250,60],[260,65],[255,55],[245,65],[265,58],[270,65]].map(([x,y],i)=>(
                  <circle key={`eu${i}`} cx={x} cy={y} r={2}
                    fill="rgba(255,255,255,0.12)"/>
                ))}
                {/* Asia */}
                {[[330,60],[345,65],[360,70],[350,80],[365,85],[380,75],[370,60],[340,75],[385,65]].map(([x,y],i)=>(
                  <circle key={`as${i}`} cx={x} cy={y} r={2}
                    fill="rgba(255,255,255,0.12)"/>
                ))}
                {/* Africa */}
                {[[255,110],[265,120],[260,130],[270,140],[255,145],[245,130],[250,115],[265,138]].map(([x,y],i)=>(
                  <circle key={`af${i}`} cx={x} cy={y} r={2}
                    fill="rgba(255,255,255,0.12)"/>
                ))}

                {/* Hotspot pulses */}
                {[
                  {x:280,y:110,c:"#e05252",l:"GAZA",s:8},
                  {x:310,y:72,c:"#e05252",l:"UKRAINE",s:7},
                  {x:262,y:128,c:"#c9a84c",l:"SUDAN",s:6},
                  {x:370,y:92,c:"#c9a84c",l:"MYANMAR",s:5},
                  {x:350,y:100,c:"#6dc48a",l:"INDIA",s:6},
                  {x:105,y:155,c:"#c9a84c",l:"VENEZUELA",s:5},
                ].map((p,i)=>(
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r={p.s+6}
                      fill="none" stroke={p.c} strokeWidth={1} opacity={0.3}/>
                    <circle cx={p.x} cy={p.y} r={p.s+12}
                      fill="none" stroke={p.c} strokeWidth={0.5} opacity={0.15}/>
                    <circle cx={p.x} cy={p.y} r={p.s}
                      fill={p.c} opacity={0.9}/>
                    <text x={p.x} y={p.y-p.s-6} textAnchor="middle"
                      fontSize={8} fill={p.c} fontFamily="'JetBrains Mono',monospace"
                      fontWeight={500} letterSpacing="0.1em">{p.l}</text>
                  </g>
                ))}

                {/* Connection lines between hotspots */}
                {[
                  [280,110,310,72],[280,110,262,128],[310,72,350,100]
                ].map(([x1,y1,x2,y2],i)=>(
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="rgba(201,168,76,0.2)" strokeWidth={1}
                    strokeDasharray="3 4"/>
                ))}

                {/* Corner brackets */}
                {[
                  [[0,0],[20,0],[0,20]], [[500,0],[520,0],[520,20]],
                  [[0,260],[0,280],[20,280]], [[500,280],[520,280],[520,260]]
                ].map((pts,i)=>(
                  <polyline key={i} points={pts.map(p=>p.join(",")).join(" ")}
                    fill="none" stroke="rgba(201,168,76,0.4)" strokeWidth={1.5}/>
                ))}
              </svg>

              {/* Coordinate overlay */}
              <div className="mono" style={{ position:"absolute", bottom:8, left:12,
                fontSize:9, color:"rgba(201,168,76,0.4)", letterSpacing:"0.1em" }}>
                28.6°N 77.2°E · INDIA FOCUS
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SIGNAL STRIP ── */}
      <div style={{ background:"rgba(255,255,255,0.02)",
        borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div className="signal-grid fade1" style={{
          maxWidth:1200, margin:"0 auto",
          display:"grid", gridTemplateColumns:"repeat(5,1fr)",
          gap:0 }}>
          {SIGNALS.map((s,i)=>(
            <div key={i} className="sig" style={{
              padding:"16px 20px",
              borderRight: i<4 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <div className="mono" style={{ fontSize:22, fontWeight:500,
                color:s.c, lineHeight:1, letterSpacing:"-0.02em" }}>{s.v}</div>
              <div style={{ fontSize:10, color:"rgba(212,207,197,0.5)",
                marginTop:5, fontWeight:600, letterSpacing:"0.06em" }}>{s.l}</div>
              <div className="mono" style={{ fontSize:9, marginTop:3,
                color: s.up===true ? "#6dc48a" : s.up===false ? "#e05252" : "rgba(255,255,255,0.25)" }}>
                {s.up===true?"↑":s.up===false?"↓":"·"} {s.d}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="main-pad" style={{ maxWidth:1200, margin:"0 auto", padding:"28px 24px" }}>

        {/* ── MAIN GRID ── */}
        <div className="grid-main fade2" style={{
          display:"grid", gridTemplateColumns:"1fr 298px",
          gap:20, marginBottom:20 }}>

          {/* LEFT — Articles */}
          <div>
            <div className="sec-label">Featured Research</div>
            {ARTICLES.map((a,i)=>(
              <div key={i} className={`card card-hover fade${i+2}`}
                style={{ marginBottom:14,
                  borderLeft:`3px solid ${a.catC}`,
                  borderTop: i===0 ? `1px solid rgba(255,255,255,0.1)` : undefined }}
                onMouseEnter={()=>setHovArt(i)}
                onMouseLeave={()=>setHovArt(null)}>
                <div style={{ padding:"20px 22px" }}>

                  {/* Document header */}
                  <div style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"center", marginBottom:12,
                    paddingBottom:10, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display:"flex", gap:8 }}>
                      <span className="mono" style={{ fontSize:9, letterSpacing:"0.15em",
                        color:"rgba(255,255,255,0.25)" }}>REF: {a.id}</span>
                      <span style={{ color:"rgba(255,255,255,0.1)" }}>·</span>
                      <span className="mono" style={{ fontSize:9, letterSpacing:"0.12em",
                        color:"rgba(255,255,255,0.25)" }}>{a.region}</span>
                    </div>
                    <span className="mono" style={{ fontSize:9, letterSpacing:"0.15em",
                      padding:"2px 8px", borderRadius:1,
                      background:"rgba(255,255,255,0.04)",
                      border:"1px solid rgba(255,255,255,0.08)",
                      color:"rgba(255,255,255,0.3)" }}>{a.clearance}</span>
                  </div>

                  {/* Category + Title */}
                  <div style={{ display:"flex", gap:8, marginBottom:10, alignItems:"center" }}>
                    <span className="mono" style={{ fontSize:9, fontWeight:500,
                      letterSpacing:"0.14em", color:a.catC }}>{a.cat}</span>
                  </div>

                  <h2 className="serif" style={{ fontSize:i===0?22:19, fontWeight:600,
                    color:"#fff", lineHeight:1.35, marginBottom:10,
                    letterSpacing:"-0.01em" }}>{a.title}</h2>

                  <p style={{ fontSize:13, lineHeight:1.72,
                    color:"rgba(212,207,197,0.6)", marginBottom:14,
                    fontFamily:"'Cormorant Garamond',serif", fontSize:16,
                    fontWeight:300 }}>{a.body}</p>

                  {/* Inline data — woven in, not a chart */}
                  <div style={{ display:"flex", gap:0, marginBottom:14,
                    background:"rgba(255,255,255,0.03)",
                    border:"1px solid rgba(255,255,255,0.07)",
                    borderLeft:`2px solid ${a.catC}`, borderRadius:2 }}>
                    {a.data.map((d,j)=>(
                      <div key={j} style={{ flex:1, padding:"10px 14px",
                        borderRight: j<a.data.length-1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                        <div className="mono" style={{ fontSize:15, fontWeight:500,
                          color:"#fff", lineHeight:1 }}>{d.v}</div>
                        <div style={{ fontSize:9, color:"rgba(212,207,197,0.4)",
                          marginTop:4, letterSpacing:"0.06em",
                          fontWeight:600 }}>{d.k.toUpperCase()}</div>
                      </div>
                    ))}
                  </div>

                  {/* Sparkline on hero only */}
                  {a.spark && (
                    <div style={{ marginBottom:12 }}>
                      <SparkLine data={a.spark} color={a.catC}/>
                    </div>
                  )}

                  {/* Badges row */}
                  <div style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"center", flexWrap:"wrap", gap:8 }}>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      <span className="mono" style={{ fontSize:9, padding:"3px 9px",
                        border:`1px solid ${CONF[a.conf].b}`,
                        background:CONF[a.conf].bg, color:CONF[a.conf].c,
                        borderRadius:1, letterSpacing:"0.1em" }}>
                        ✓ {a.conf} CONFIDENCE
                      </span>
                      <span className="mono" style={{ fontSize:9, padding:"3px 9px",
                        border:"1px solid rgba(255,255,255,0.1)",
                        background:"rgba(255,255,255,0.04)",
                        color:"rgba(255,255,255,0.4)",
                        borderRadius:1, letterSpacing:"0.1em" }}>
                        ◈ {a.evid} EVIDENCE
                      </span>
                      <span className="mono" style={{ fontSize:9, padding:"3px 9px",
                        border:"1px solid rgba(255,255,255,0.08)",
                        color:"rgba(255,255,255,0.3)",
                        borderRadius:1, letterSpacing:"0.1em" }}>
                        {a.src} SOURCES
                      </span>
                    </div>
                    <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                      <span className="mono" style={{ fontSize:9,
                        color:"rgba(255,255,255,0.25)" }}>{a.date}</span>
                      <span className="mono" style={{ fontSize:9,
                        color:"rgba(255,255,255,0.25)" }}>{a.time}</span>
                      <span className="serif" style={{ fontSize:18, fontWeight:700,
                        color: a.impact>=9?"#e05252":a.impact>=8.5?"#c9a84c":"#7eb8d4" }}>
                        {a.impact}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

            {/* Conflict tracker */}
            <div className="card fade3" style={{ padding:"18px 16px" }}>
              <div className="sec-label" style={{ marginBottom:14 }}>
                <span style={{ width:5, height:5, borderRadius:"50%",
                  background:"#e05252", animation:"pulse 1.4s infinite",
                  display:"inline-block", marginLeft:4 }}/>
                Conflict Monitor
              </div>
              {CONFLICTS.map((c,i)=>(
                <div key={i} style={{ paddingBottom:12, marginBottom:12,
                  borderBottom: i<CONFLICTS.length-1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <div style={{ display:"flex", justifyContent:"space-between",
                    marginBottom:5 }}>
                    <span style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.85)" }}>{c.name}</span>
                    <span className="mono" style={{ fontSize:8, padding:"2px 7px",
                      color:ALERT_C[c.tag],
                      border:`1px solid ${ALERT_C[c.tag]}55`,
                      background:`${ALERT_C[c.tag]}11`,
                      letterSpacing:"0.12em", borderRadius:1 }}>{c.tag}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
                    <span className="mono" style={{ fontSize:9,
                      color:"rgba(255,255,255,0.3)" }}>{c.region} · DAY {c.day.toLocaleString()}</span>
                    <span className="mono" style={{ fontSize:9,
                      color:ALERT_C[c.tag] }}>{c.intensity}/10</span>
                  </div>
                  <div style={{ height:2, background:"rgba(255,255,255,0.07)", borderRadius:1 }}>
                    <div style={{ height:"100%", width:`${c.intensity*10}%`,
                      background:ALERT_C[c.tag], borderRadius:1,
                      boxShadow:`0 0 6px ${ALERT_C[c.tag]}60` }}/>
                  </div>
                </div>
              ))}
            </div>

            {/* Country Watch */}
            <div className="card fade4" style={{ padding:"18px 16px" }}>
              <div className="sec-label">Country Watch</div>
              {COUNTRIES.map((c,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10,
                  padding:"9px 0",
                  borderBottom: i<COUNTRIES.length-1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  cursor:"pointer", transition:"opacity 0.15s" }}
                  onMouseEnter={e=>e.currentTarget.style.opacity="0.8"}
                  onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                  <span style={{ fontSize:18 }}>{c.flag}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:600,
                      color:"rgba(255,255,255,0.85)", marginBottom:2 }}>{c.name}</div>
                    <div className="mono" style={{ fontSize:9,
                      color:"rgba(255,255,255,0.28)", lineHeight:1.4 }}>{c.status}</div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column",
                    alignItems:"flex-end", gap:4 }}>
                    <span className="mono" style={{ fontSize:8, padding:"2px 6px",
                      color:ALERT_C[c.alert] || "#c9a84c",
                      border:`1px solid ${(ALERT_C[c.alert]||"#c9a84c")}44`,
                      borderRadius:1, letterSpacing:"0.1em" }}>{c.alert}</span>
                    <span className="mono" style={{ fontSize:9,
                      color:"rgba(255,255,255,0.2)" }}>{c.n}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Archive growth mini chart */}
            <div className="card fade5" style={{ padding:"18px 16px" }}>
              <div className="sec-label">Archive Growth</div>
              <ResponsiveContainer width="100%" height={80}>
                <AreaChart data={GROWTH} margin={{top:0,right:0,left:-30,bottom:0}}>
                  <defs>
                    <linearGradient id="arcg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#c9a84c" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="m" tick={{fontSize:9,fill:"rgba(255,255,255,0.25)",fontFamily:"'JetBrains Mono',monospace"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:9,fill:"rgba(255,255,255,0.25)"}} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{background:"#1a1d26",border:"1px solid rgba(255,255,255,0.1)",borderRadius:3,fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:"#c9a84c"}}/>
                  <Area type="monotone" dataKey="v" stroke="#c9a84c" fill="url(#arcg)" strokeWidth={1.5} dot={false} name="Articles"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── RELATIONSHIP GRAPH ── */}
        <div className="card fade4" style={{ padding:"22px 22px", marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:6 }}>
            <div className="sec-label" style={{ marginBottom:0 }}>
              Event Connection Map — Russia Sanctions Chain
            </div>
            <span className="mono" style={{ fontSize:9, color:"rgba(201,168,76,0.5)",
              letterSpacing:"0.12em" }}>HOVER NODES TO REVEAL</span>
          </div>
          <p style={{ fontSize:12, color:"rgba(255,255,255,0.25)", marginBottom:14,
            fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:14 }}>
            How one sanctions package cascades through global trade, monetary systems, and inflation
          </p>
          <RelGraph/>
        </div>

        {/* ── BOTTOM GRID ── */}
        <div className="grid-3 fade5" style={{
          display:"grid", gridTemplateColumns:"repeat(3,1fr)",
          gap:16, marginBottom:20 }}>

          {/* Latest research */}
          <div className="card" style={{ padding:"18px 18px" }}>
            <div className="sec-label">Latest Published</div>
            {RECENT.map((r,i)=>(
              <div key={i} className="card-hover" style={{
                padding:"10px 10px", marginBottom:6, borderRadius:2,
                borderLeft:`2px solid ${CONF[r.conf]?.c||"#c9a84c"}44` }}>
                <div style={{ display:"flex", justifyContent:"space-between",
                  marginBottom:5 }}>
                  <span className="mono" style={{ fontSize:8, letterSpacing:"0.12em",
                    color:"rgba(255,255,255,0.3)" }}>{r.cat}</span>
                  <span className="mono" style={{ fontSize:8,
                    color:"rgba(255,255,255,0.2)" }}>{r.time} ago</span>
                </div>
                <div style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.8)",
                  lineHeight:1.45, marginBottom:6 }}>{r.title}</div>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span className="mono" style={{ fontSize:8,
                    color:CONF[r.conf]?.c||"#c9a84c",
                    letterSpacing:"0.1em" }}>{r.conf}</span>
                  <span className="serif" style={{ fontSize:15, fontWeight:700,
                    color:r.impact>=8.5?"#e05252":"#c9a84c" }}>{r.impact}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Radar — media bias */}
          <div className="card" style={{ padding:"18px 18px" }}>
            <div className="sec-label">Media Coverage Analysis</div>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={RADAR_DATA} cx="50%" cy="50%" outerRadius={80}>
                <PolarGrid stroke="rgba(255,255,255,0.07)"/>
                <PolarAngleAxis dataKey="a"
                  tick={{fontSize:9,fill:"rgba(255,255,255,0.35)",fontFamily:"'JetBrains Mono',monospace"}}/>
                <Radar name="BBC" dataKey="BBC" stroke="#7eb8d4" fill="#7eb8d4" fillOpacity={0.1} strokeWidth={1.5}/>
                <Radar name="RT" dataKey="RT" stroke="#e05252" fill="#e05252" fillOpacity={0.1} strokeWidth={1.5}/>
                <Radar name="Al Jazeera" dataKey="AJ" stroke="#6dc48a" fill="#6dc48a" fillOpacity={0.1} strokeWidth={1.5}/>
                <Tooltip contentStyle={{background:"#1a1d26",border:"1px solid rgba(255,255,255,0.1)",fontSize:11,fontFamily:"'JetBrains Mono',monospace"}}/>
              </RadarChart>
            </ResponsiveContainer>
            <div style={{ display:"flex", gap:14, justifyContent:"center", marginTop:4 }}>
              {[["BBC","#7eb8d4"],["RT","#e05252"],["Al Jazeera","#6dc48a"]].map(([n,c])=>(
                <div key={n} style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <div style={{ width:8, height:1.5, background:c }}/>
                  <span className="mono" style={{ fontSize:9, color:"rgba(255,255,255,0.35)" }}>{n}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key data */}
          <div className="card" style={{ padding:"18px 18px" }}>
            <div className="sec-label">Key Intelligence Data</div>
            {[
              { k:"Active Russia sanctions",     v:"267",    c:"#e05252" },
              { k:"Global arms trade 2024",       v:"$847B",  c:"#c9a84c" },
              { k:"Nations under IMF program",    v:"94",     c:"#c9a84c" },
              { k:"NGO networks documented",      v:"234",    c:"#7eb8d4" },
              { k:"Proxy war patterns matched",   v:"14/14",  c:"#e05252" },
              { k:"Media bias incidents tracked", v:"1,890",  c:"#7eb8d4" },
              { k:"India articles published",     v:"156",    c:"#6dc48a" },
              { k:"Conflict days logged",         v:"5,230",  c:"#c9a84c" },
            ].map((f,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between",
                padding:"8px 0",
                borderBottom: i<7 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.4)",
                  fontWeight:500 }}>{f.k}</span>
                <span className="mono" style={{ fontSize:12, fontWeight:500, color:f.c }}>{f.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── TOPIC EXPLORER ── */}
        <div className="fade6" style={{ marginBottom:32,
          borderTop:"1px solid rgba(255,255,255,0.06)",
          borderBottom:"1px solid rgba(255,255,255,0.06)",
          padding:"16px 0" }}>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
            <span className="mono" style={{ fontSize:9, letterSpacing:"0.2em",
              color:"rgba(201,168,76,0.5)", marginRight:6 }}>EXPLORE →</span>
            {["Power Networks","Color Revolutions","IMF Trap","Arms Trade",
              "Proxy Wars","Dollar Decline","Media Bias","India Lens",
              "Sanctions","Resource Wars","BRICS","Regime Change",
              "Protest Patterns","Deep State History"].map(t=>(
              <div key={t} className="mono" style={{
                fontSize:10, padding:"5px 12px", letterSpacing:"0.06em",
                border:"1px solid rgba(255,255,255,0.08)",
                borderRadius:2, color:"rgba(255,255,255,0.4)",
                cursor:"pointer", transition:"all 0.15s",
                background:"rgba(255,255,255,0.02)" }}
                onMouseEnter={e=>{e.target.style.borderColor="rgba(201,168,76,0.4)";e.target.style.color="#c9a84c";e.target.style.background="rgba(201,168,76,0.06)";}}
                onMouseLeave={e=>{e.target.style.borderColor="rgba(255,255,255,0.08)";e.target.style.color="rgba(255,255,255,0.4)";e.target.style.background="rgba(255,255,255,0.02)";}}>
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:28 }}>
          <div className="footer-grid" style={{
            display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr",
            gap:32, marginBottom:24 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                <div style={{ width:2, height:20, background:"#c9a84c" }}/>
                <span className="serif" style={{ fontSize:18, fontWeight:700, color:"#fff" }}>
                  Signal<span style={{color:"#c9a84c",fontStyle:"italic"}}>Atlas</span>
                </span>
              </div>
              <p style={{ fontSize:12, color:"rgba(255,255,255,0.3)",
                lineHeight:1.75, maxWidth:280,
                fontFamily:"'Cormorant Garamond',serif", fontSize:14, fontWeight:300 }}>
                Global events explained through evidence, timelines, data, and India context.
                Independent research — not news, not opinion.
              </p>
              <div style={{ marginTop:14 }}>
                <span className="mono" style={{ fontSize:9, padding:"3px 10px",
                  border:"1px solid rgba(201,168,76,0.3)", color:"rgba(201,168,76,0.6)",
                  letterSpacing:"0.12em", borderRadius:1 }}>ALL ANALYSIS FROM PUBLIC SOURCES</span>
              </div>
            </div>
            {[
              { h:"Research",  l:["Power Networks","Trade Wars","Sanctions","Media Bias"] },
              { h:"Regions",   l:["Middle East","South Asia","Africa","Americas"] },
              { h:"Platform",  l:["Methodology","Data Sources","Confidence System","Subscribe"] },
            ].map(col=>(
              <div key={col.h}>
                <div className="mono" style={{ fontSize:9, fontWeight:600,
                  letterSpacing:"0.2em", color:"rgba(255,255,255,0.3)",
                  textTransform:"uppercase", marginBottom:12 }}>{col.h}</div>
                {col.l.map(l=>(
                  <div key={l} style={{ fontSize:12, color:"rgba(255,255,255,0.3)",
                    marginBottom:8, cursor:"pointer",
                    fontFamily:"'Cormorant Garamond',serif", fontWeight:300,
                    transition:"color 0.15s" }}
                    onMouseEnter={e=>e.target.style.color="#c9a84c"}
                    onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.3)"}>{l}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)",
            paddingTop:16, display:"flex", justifyContent:"space-between" }}>
            <span className="mono" style={{ fontSize:9,
              color:"rgba(255,255,255,0.2)", letterSpacing:"0.06em" }}>
              © 2026 SIGNALATLAS · ALL RESEARCH BASED ON PUBLICLY AVAILABLE SOURCES
            </span>
            <span className="mono" style={{ fontSize:9,
              color:"rgba(255,255,255,0.2)", letterSpacing:"0.06em" }}>
              METHODOLOGY · PRIVACY · SOURCES
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
