import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const FONTS = "https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap";

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #1c1c1e;
    --ink2: #3a3a3c;
    --ink3: #636366;
    --ink4: #aeaeb2;
    --bg: #f5f4f0;
    --bg2: #eeedea;
    --bg3: #e4e3df;
    --white: #fafaf8;
    --red: #b91c1c;
    --red2: #fee2e2;
    --amber: #92400e;
    --amber2: #fef3c7;
    --blue: #1e3a5f;
    --blue2: #dbeafe;
    --green: #14532d;
    --green2: #dcfce7;
    --border: #d4d3cf;
    --serif: 'Libre Baskerville', Georgia, serif;
    --sans: 'IBM Plex Sans', sans-serif;
    --mono: 'IBM Plex Mono', monospace;
  }
  body { background: var(--bg); font-family: var(--sans); color: var(--ink); }
  @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
  @keyframes tickIn { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
  .fade { animation: fadeUp 0.5s ease both; }
  .lift { transition: box-shadow 0.2s, transform 0.2s; cursor: pointer; }
  .lift:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.09); transform: translateY(-1px); }

  /* ── Nav ── */
  .nav { background: var(--white); border-bottom: 1px solid var(--border); position: sticky; top:0; z-index:100; }
  .nav-inner { max-width: 1100px; margin: 0 auto; padding: 0 20px; display:flex; align-items:center; justify-content:space-between; height:52px; }
  .logo { display:flex; align-items:center; gap:8px; }
  .logo-mark { width:3px; height:28px; background: var(--red); border-radius:2px; }
  .logo-text { font-family:var(--serif); font-size:20px; color:var(--ink); letter-spacing:-0.02em; }
  .logo-text span { color:var(--red); font-style:italic; }
  .nav-links { display:flex; gap:2px; }
  .nav-link { font-size:12px; color:var(--ink3); padding:5px 10px; border-radius:4px; cursor:pointer; transition:all 0.15s; font-weight:500; }
  .nav-link:hover { background:var(--bg2); color:var(--ink); }
  .nav-right { display:flex; align-items:center; gap:10px; }
  .live-dot { display:flex; align-items:center; gap:6px; font-size:10px; font-family:var(--mono); color:var(--red); letter-spacing:0.08em; }
  .live-circle { width:6px; height:6px; border-radius:50%; background:var(--red); animation:pulse 1.6s ease-in-out infinite; }
  .btn-sub { font-size:11px; font-weight:600; padding:5px 14px; background:var(--ink); color:#fff; border-radius:4px; cursor:pointer; transition:background 0.15s; }
  .btn-sub:hover { background:var(--ink2); }
  .nav-time { font-size:10px; font-family:var(--mono); color:var(--ink4); }

  /* ── Ticker ── */
  .ticker { background:var(--blue); border-bottom:1px solid var(--border); }
  .ticker-inner { max-width:1100px; margin:0 auto; padding:7px 20px; display:flex; align-items:center; gap:12px; }
  .ticker-label { font-size:9px; font-weight:600; letter-spacing:0.18em; color:#fff; background:var(--red); padding:2px 8px; border-radius:2px; white-space:nowrap; font-family:var(--sans); }
  .ticker-text { font-size:12px; color:#bfdbfe; font-family:var(--sans); animation:tickIn 0.4s ease; }

  /* ── Main ── */
  .main { max-width:1100px; margin:0 auto; padding:28px 20px; }

  /* ── Signal Strip ── */
  .signal-strip { display:grid; grid-template-columns:repeat(5,1fr); gap:1px; background:var(--border); border:1px solid var(--border); border-radius:8px; overflow:hidden; margin-bottom:28px; }
  .signal-cell { background:var(--white); padding:14px 16px; }
  .signal-val { font-family:var(--serif); font-size:24px; font-weight:700; line-height:1; }
  .signal-label { font-size:10px; color:var(--ink3); margin-top:5px; font-weight:500; letter-spacing:0.04em; }
  .signal-delta { font-size:10px; font-family:var(--mono); margin-top:3px; }
  .delta-up { color:var(--green); }
  .delta-down { color:var(--red); }

  /* ── Layout grid ── */
  .grid-main { display:grid; grid-template-columns:1fr 300px; gap:24px; margin-bottom:28px; }
  .grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:28px; }

  /* ── Cards ── */
  .card { background:var(--white); border:1px solid var(--border); border-radius:8px; }
  .card-pad { padding:20px; }

  /* ── Article cards ── */
  .art-hero { padding:24px; }
  .art-hero .cat { display:inline-flex; align-items:center; gap:5px; font-size:10px; font-weight:600; letter-spacing:0.1em; padding:3px 9px; border-radius:3px; margin-bottom:12px; }
  .art-hero h2 { font-family:var(--serif); font-size:22px; line-height:1.38; color:var(--ink); margin-bottom:10px; }
  .art-hero .summary { font-size:13px; line-height:1.7; color:var(--ink2); margin-bottom:14px; }
  .art-meta { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
  .art-meta span { font-size:11px; color:var(--ink4); font-family:var(--mono); }
  .art-meta .dot { color:var(--border); }

  /* Inline data row */
  .data-row { display:flex; gap:6px; flex-wrap:wrap; margin:12px 0; padding:10px 12px; background:var(--bg); border-radius:5px; border-left:3px solid var(--blue); }
  .data-chip { font-size:11px; font-family:var(--mono); color:var(--blue); font-weight:500; }
  .data-chip span { color:var(--ink4); margin-right:3px; }

  /* Quick facts */
  .qfacts { display:flex; flex-direction:column; gap:0; }
  .qfact { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid var(--bg2); }
  .qfact:last-child { border-bottom:none; }
  .qfact-label { font-size:11px; color:var(--ink3); font-weight:500; }
  .qfact-val { font-size:12px; font-weight:600; font-family:var(--mono); color:var(--ink); }

  /* Confidence badge */
  .conf-row { display:flex; gap:6px; margin-top:10px; flex-wrap:wrap; }
  .badge { font-size:9px; font-weight:600; letter-spacing:0.08em; padding:3px 8px; border-radius:3px; font-family:var(--sans); }
  .badge-green { background:var(--green2); color:var(--green); }
  .badge-blue { background:var(--blue2); color:var(--blue); }
  .badge-amber { background:var(--amber2); color:var(--amber); }
  .badge-red { background:var(--red2); color:var(--red); }
  .badge-neutral { background:var(--bg2); color:var(--ink3); border:1px solid var(--border); }

  /* ── Section head ── */
  .sec-head { display:flex; align-items:center; gap:10px; margin-bottom:16px; }
  .sec-bar { width:3px; height:16px; border-radius:2px; background:var(--ink); }
  .sec-title { font-size:10px; font-weight:600; letter-spacing:0.14em; color:var(--ink3); text-transform:uppercase; font-family:var(--sans); }

  /* ── Conflict tracker ── */
  .conflict-item { padding:11px 0; border-bottom:1px solid var(--bg2); }
  .conflict-item:last-child { border-bottom:none; }
  .conflict-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; }
  .conflict-name { font-size:13px; font-weight:600; color:var(--ink); }
  .conflict-day { font-size:10px; font-family:var(--mono); color:var(--ink4); }
  .conflict-meta { display:flex; justify-content:space-between; align-items:center; margin-bottom:7px; }
  .conflict-region { font-size:10px; color:var(--ink4); }
  .intensity-bar { height:3px; background:var(--bg2); border-radius:2px; }
  .intensity-fill { height:100%; border-radius:2px; transition:width 1s ease; }

  /* ── Spark chart ── */
  .spark-row { display:flex; align-items:center; gap:8px; padding:6px 0; border-bottom:1px solid var(--bg2); }
  .spark-row:last-child { border-bottom:none; }
  .spark-label { font-size:11px; color:var(--ink2); font-weight:500; flex:1; }
  .spark-val { font-size:11px; font-family:var(--mono); font-weight:600; color:var(--ink); width:32px; text-align:right; }

  /* ── Country grid ── */
  .country-row { display:flex; align-items:center; gap:12px; padding:11px 0; border-bottom:1px solid var(--bg2); }
  .country-row:last-child { border-bottom:none; }
  .country-flag { font-size:20px; width:28px; text-align:center; }
  .country-info { flex:1; }
  .country-name { font-size:13px; font-weight:600; color:var(--ink); margin-bottom:2px; }
  .country-status { font-size:11px; color:var(--ink4); line-height:1.4; }
  .country-right { display:flex; flex-direction:column; align-items:flex-end; gap:4px; }
  .country-count { font-size:10px; font-family:var(--mono); color:var(--ink4); }

  /* ── Mini topic tags ── */
  .topic-strip { display:flex; gap:6px; flex-wrap:wrap; padding:16px 20px; background:var(--white); border:1px solid var(--border); border-radius:8px; border-left:4px solid var(--blue); margin-bottom:28px; }
  .topic-tag { font-size:11px; padding:4px 12px; border-radius:20px; background:var(--bg); border:1px solid var(--border); color:var(--ink2); cursor:pointer; transition:all 0.15s; font-weight:500; }
  .topic-tag:hover { background:var(--ink); color:#fff; border-color:var(--ink); }

  /* ── Timeline ── */
  .tl { position:relative; padding-left:24px; }
  .tl::before { content:''; position:absolute; left:6px; top:0; bottom:0; width:1px; background:var(--border); }
  .tl-item { position:relative; margin-bottom:16px; }
  .tl-dot { position:absolute; left:-21px; top:4px; width:10px; height:10px; border-radius:50%; border:2px solid var(--white); }
  .tl-year { font-size:10px; font-family:var(--mono); font-weight:600; margin-bottom:2px; }
  .tl-event { font-size:12px; font-weight:600; color:var(--ink); line-height:1.4; }
  .tl-pattern { font-size:10px; color:var(--ink4); margin-top:2px; }

  /* ── Relationship SVG ── */
  .graph-wrap { background:var(--bg); border-radius:6px; padding:16px; }

  /* ── Footer ── */
  .footer { border-top:2px solid var(--ink); margin-top:40px; padding-top:24px; padding-bottom:40px; }
  .footer-grid { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:32px; margin-bottom:24px; }
  .footer-logo { font-family:var(--serif); font-size:18px; color:var(--ink); margin-bottom:8px; }
  .footer-desc { font-size:12px; color:var(--ink3); line-height:1.7; }
  .footer-head { font-size:9px; font-weight:600; letter-spacing:0.18em; color:var(--ink); text-transform:uppercase; margin-bottom:10px; }
  .footer-link { font-size:12px; color:var(--ink3); margin-bottom:7px; cursor:pointer; transition:color 0.15s; }
  .footer-link:hover { color:var(--red); }
  .footer-bottom { display:flex; justify-content:space-between; font-size:11px; color:var(--ink4); padding-top:16px; border-top:1px solid var(--border); }

  /* ── Inline mini chart ── */
  .mini-chart { height:56px; margin:10px -2px 0; }

  /* ── Mobile ── */
  @media (max-width: 768px) {
    .nav-links { display:none; }
    .nav-time { display:none; }
    .signal-strip { grid-template-columns:repeat(3,1fr); }
    .signal-strip .signal-cell:nth-child(n+4) { display:none; }
    .grid-main { grid-template-columns:1fr; }
    .grid-3 { grid-template-columns:1fr; }
    .footer-grid { grid-template-columns:1fr 1fr; gap:20px; }
    .topic-strip { padding:12px 14px; }
    .main { padding:20px 14px; }
    .art-hero { padding:18px; }
    .art-hero h2 { font-size:19px; }
  }
  @media (max-width: 480px) {
    .signal-strip { grid-template-columns:repeat(2,1fr); }
    .signal-strip .signal-cell:nth-child(n+3) { display:none; }
    .footer-grid { grid-template-columns:1fr; }
    .logo-text { font-size:17px; }
  }
`;

/* ── Data ──────────────────────────────────────────────────────── */
const TICKER_ITEMS = [
  "Sudan ceasefire talks collapse — Day 398 of civil war",
  "India gold reserves rise for third consecutive month — RBI confirms",
  "Pakistan IMF loan #23 approved — identical conditions to loan #11 (2013)",
  "Red Sea disruption adds avg $340 per container for Indian importers",
  "14 nations match political protest blueprint — new pattern report",
];

const SIGNALS = [
  { val: "1,247", label: "Research Articles", delta: "+12 this week", up: true, color: "var(--blue)" },
  { val: "6",     label: "Active Conflicts",  delta: "+1 escalated", up: false, color: "var(--red)" },
  { val: "87",    label: "Countries Tracked", delta: "updated daily", up: null, color: "var(--ink)" },
  { val: "52",    label: "Patterns Found",    delta: "+3 this month", up: true, color: "var(--green)" },
  { val: "$847B", label: "Arms Trade 2024",   delta: "+14% YoY", up: false, color: "var(--amber)" },
];

const FEATURED_ARTICLES = [
  {
    cat: "POWER NETWORKS", catColor: "var(--red)", catBg: "var(--red2)",
    title: "The Political Protest Blueprint: 14 Countries, One Pattern",
    summary: "From Kyiv to Caracas, the same funding networks surface in documented records. We traced every instance since 2000 using NGO filings, parliamentary records, and leaked donor data.",
    dataPoints: [
      { k: "Countries matched", v: "14" },
      { k: "NGO overlaps found", v: "34" },
      { k: "Pattern accuracy", v: "71%" },
      { k: "Time span", v: "2000–2025" },
    ],
    confidence: "High", evidence: "Strong",
    sources: ["Reuters", "UN", "OpenSecrets", "FARA"],
    sourceCount: 8,
    readTime: "14 min", date: "May 23",
    impact: 9.4,
    sparkData: [
      { m: "J", v: 12 }, { m: "F", v: 18 }, { m: "M", v: 14 },
      { m: "A", v: 28 }, { m: "M", v: 24 }, { m: "J", v: 38 },
      { m: "J", v: 45 }, { m: "A", v: 52 },
    ],
  },
  {
    cat: "ECONOMIC WARFARE", catColor: "var(--amber)", catBg: "var(--amber2)",
    title: "IMF Loan Trap: How 40 Nations Lost Policy Sovereignty",
    summary: "Pakistan's 23rd IMF loan follows an identical pattern to Argentina 2001 and Sri Lanka 2022. The conditions, sequence, and outcomes are statistically indistinguishable.",
    dataPoints: [
      { k: "Nations studied", v: "40" },
      { k: "Avg loans before default", v: "11.3" },
      { k: "Austerity unrest correlation", v: "78%" },
      { k: "Currency drop avg", v: "−34%" },
    ],
    confidence: "High", evidence: "Strong",
    sources: ["IMF", "World Bank", "Reuters", "FT"],
    sourceCount: 11,
    readTime: "18 min", date: "May 22",
    impact: 9.1,
  },
  {
    cat: "INDIA LENS", catColor: "var(--green)", catBg: "var(--green2)",
    title: "India's Dollar–Yuan Silence Is Strategic, Not Neutral",
    summary: "India increased gold reserves three months running. Rupee trade agreements now cover 18 nations. This is not fence-sitting — it is optionality management.",
    dataPoints: [
      { k: "Gold reserve increase", v: "+3 months" },
      { k: "Rupee trade partners", v: "18" },
      { k: "USD dependency change", v: "−8%" },
      { k: "BRICS trade share", v: "+12%" },
    ],
    confidence: "Medium", evidence: "Moderate",
    sources: ["RBI", "MEA", "Bloomberg", "Mint"],
    sourceCount: 6,
    readTime: "12 min", date: "May 21",
    impact: 8.9,
  },
];

const CONFLICTS = [
  { name: "Gaza–Israel",   region: "Middle East", days: 596,  intensity: 9.5, alert: "CRITICAL", color: "var(--red)" },
  { name: "Russia–Ukraine",region: "Europe",      days: 1184, intensity: 9.2, alert: "CRITICAL", color: "var(--red)" },
  { name: "Sudan",         region: "Africa",       days: 398,  intensity: 8.1, alert: "ACTIVE",   color: "var(--amber)" },
  { name: "Myanmar Junta", region: "Asia",         days: 1180, intensity: 7.8, alert: "ACTIVE",   color: "var(--amber)" },
];

const COUNTRIES = [
  { flag: "🇺🇸", name: "United States", status: "Trade wars + election cycle active", alert: "HIGH",     n: 234 },
  { flag: "🇨🇳", name: "China",          status: "Taiwan + BRI debt diplomacy",        alert: "HIGH",     n: 198 },
  { flag: "🇷🇺", name: "Russia",         status: "Ukraine war + 267 active sanctions", alert: "CRITICAL", n: 187 },
  { flag: "🇮🇳", name: "India",          status: "Strategic realignment underway",     alert: "WATCH",    n: 156 },
  { flag: "🇵🇰", name: "Pakistan",       status: "IMF loan #23 + economic crisis",     alert: "HIGH",     n: 98  },
];

const RECENT = [
  { cat: "MEDIA",    title: "Who Funds the 'Independent' Fact-Checkers?",         time: "2h",  conf: "High",   impact: 7.9 },
  { cat: "AFRICA",   title: "Sudan's Gold War: The Hidden Motive",                 time: "5h",  conf: "Medium", impact: 8.2 },
  { cat: "SANCTIONS",title: "How Russia Bypassed SWIFT — 18-Month Blueprint",      time: "8h",  conf: "High",   impact: 8.5 },
  { cat: "INDIA",    title: "Red Sea Disruption: India's Shipping Cost Data",      time: "11h", conf: "High",   impact: 8.0 },
  { cat: "ARMS",     title: "$847B Weapons Transferred in 2024 — Full Map",        time: "1d",  conf: "High",   impact: 9.0 },
  { cat: "NETWORKS", title: "NGO Funding Trails in South Asia — Documented",       time: "1d",  conf: "Medium", impact: 7.8 },
];

const TL = [
  { year: "2019", event: "Hong Kong Protests",     pattern: "Protest Pattern",        color: "#6b21a8" },
  { year: "2020", event: "Belarus Uprising",        pattern: "Protest Pattern",        color: "#6b21a8" },
  { year: "2021", event: "Myanmar Coup",            pattern: "Regime Change",          color: "var(--red)" },
  { year: "2022", event: "Ukraine War Begins",      pattern: "Proxy War",              color: "var(--red)" },
  { year: "2023", event: "Niger Coup",              pattern: "Anti-West Wave",         color: "var(--amber)" },
  { year: "2024", event: "Venezuela Crisis",        pattern: "Protest Pattern",        color: "#6b21a8" },
  { year: "2025", event: "Haiti State Collapse",    pattern: "State Failure",          color: "var(--red)" },
];

const GRAPH_NODES = [
  { id: 0, label: ["Russia", "Sanctions"], x: 100, y: 90,  r: 36, color: "#b91c1c" },
  { id: 1, label: ["Oil",    "Trade"],     x: 250, y: 60,  r: 30, color: "#92400e" },
  { id: 2, label: ["India",  "Imports"],  x: 380, y: 95,  r: 27, color: "#14532d" },
  { id: 3, label: ["USD",    "Pressure"], x: 215, y: 175, r: 25, color: "#1e3a5f" },
  { id: 4, label: ["Fuel",   "Prices"],   x: 340, y: 190, r: 22, color: "#92400e" },
  { id: 5, label: ["Inflation"],          x: 460, y: 160, r: 20, color: "#6b21a8" },
  { id: 6, label: ["BRICS",  "Talks"],    x: 95,  y: 195, r: 21, color: "#0d7490" },
];
const GRAPH_EDGES = [
  { s: 0, t: 1, w: 92 }, { s: 1, t: 2, w: 78 }, { s: 0, t: 3, w: 85 },
  { s: 2, t: 4, w: 67 }, { s: 4, t: 5, w: 61 }, { s: 3, t: 4, w: 55 },
  { s: 0, t: 6, w: 70 }, { s: 6, t: 3, w: 48 },
];

const ALERT_BADGE = {
  CRITICAL: "badge badge-red",
  HIGH:     "badge badge-amber",
  WATCH:    "badge badge-green",
  ACTIVE:   "badge badge-amber",
};

/* ── Relationship Graph ── */
function RelGraph() {
  const [hov, setHov] = useState(null);
  return (
    <div className="graph-wrap">
      <svg width="100%" viewBox="0 0 560 260" style={{ fontFamily: "var(--mono)" }}>
        {GRAPH_EDGES.map((e, i) => {
          const s = GRAPH_NODES[e.s], t = GRAPH_NODES[e.t];
          const active = hov === e.s || hov === e.t;
          return (
            <g key={i}>
              <line x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                stroke={active ? s.color : "#d4d3cf"}
                strokeWidth={active ? 2 : 1}
                strokeDasharray={active ? "0" : "4 3"}
                opacity={active ? 0.9 : 0.7} />
              {active && (
                <text x={(s.x + t.x) / 2} y={(s.y + t.y) / 2 - 5}
                  textAnchor="middle" fontSize={9}
                  fill={s.color} fontWeight={600}>{e.w}%</text>
              )}
            </g>
          );
        })}
        {GRAPH_NODES.map((n, i) => (
          <g key={i} style={{ cursor: "pointer" }}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}>
            <circle cx={n.x} cy={n.y}
              r={hov === i ? n.r + 4 : n.r}
              fill={hov === i ? n.color : "#fafaf8"}
              stroke={n.color}
              strokeWidth={hov === i ? 2 : 1.5}
              style={{ transition: "all 0.18s" }} />
            {n.label.map((w, wi) => (
              <text key={wi}
                x={n.x}
                y={n.y + (n.label.length === 1 ? 4 : wi === 0 ? -3 : 9)}
                textAnchor="middle"
                fontSize={hov === i ? 9.5 : 8.5}
                fill={hov === i ? "#fff" : n.color}
                fontWeight={600}
                style={{ pointerEvents: "none" }}>{w}</text>
            ))}
          </g>
        ))}
      </svg>
      <div style={{ fontSize: 10, color: "var(--ink4)", fontFamily: "var(--sans)", paddingTop: 4, textAlign: "center" }}>
        Hover any node to reveal connection strength
      </div>
    </div>
  );
}

/* ── Spark Line ── */
function Spark({ data, color }) {
  return (
    <div style={{ height: 48 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="10%" stopColor={color} stopOpacity={0.15} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={color} fill="url(#sg)" strokeWidth={1.5} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── Main ── */
export default function App() {
  const [tick, setTick] = useState(0);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTick(p => (p + 1) % TICKER_ITEMS.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <link rel="stylesheet" href={FONTS} />
      <style>{css}</style>

      {/* Nav */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="logo">
            <div className="logo-mark" />
            <div className="logo-text">Signal<span>Atlas</span></div>
          </div>
          <div className="nav-links">
            {["Conflicts", "Countries", "Topics", "Timeline", "Data"].map(l => (
              <div key={l} className="nav-link">{l}</div>
            ))}
          </div>
          <div className="nav-right">
            <div className="live-dot"><div className="live-circle" />LIVE</div>
            <div className="nav-time">{time.toUTCString().slice(0, 22)} UTC</div>
            <div className="btn-sub">Subscribe</div>
          </div>
        </div>
      </nav>

      {/* Ticker */}
      <div className="ticker">
        <div className="ticker-inner">
          <div className="ticker-label">INTEL</div>
          <div className="ticker-text" key={tick}>{TICKER_ITEMS[tick]}</div>
        </div>
      </div>

      <div className="main">

        {/* Signal Strip */}
        <div className="signal-strip fade" style={{ animationDelay: "0s" }}>
          {SIGNALS.map((s, i) => (
            <div key={i} className="signal-cell">
              <div className="signal-val" style={{ color: s.color }}>{s.val}</div>
              <div className="signal-label">{s.label}</div>
              <div className={`signal-delta ${s.up === true ? "delta-up" : s.up === false ? "delta-down" : ""}`}
                style={{ color: s.up === null ? "var(--ink4)" : undefined }}>
                {s.up === true ? "↑" : s.up === false ? "↓" : "·"} {s.delta}
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid-main">

          {/* Left — articles */}
          <div>
            <div className="sec-head">
              <div className="sec-bar" style={{ background: "var(--blue)" }} />
              <div className="sec-title">Featured Research</div>
            </div>

            {FEATURED_ARTICLES.map((a, i) => (
              <div key={i} className={`card lift fade`}
                style={{ marginBottom: 14, animationDelay: `${0.05 + i * 0.08}s`, borderTop: `3px solid ${a.catColor}` }}>
                <div className="art-hero">
                  <div className="cat" style={{ background: a.catBg, color: a.catColor }}>
                    {a.cat}
                  </div>
                  <h2>{a.title}</h2>
                  <p className="summary">{a.summary}</p>

                  {/* Inline data row — data woven into article, not separate */}
                  <div className="data-row">
                    {a.dataPoints.map((d, j) => (
                      <div key={j} className="data-chip">
                        <span>{d.k}:</span>{d.v}
                      </div>
                    ))}
                  </div>

                  {/* Spark chart if available */}
                  {a.sparkData && <Spark data={a.sparkData} color={a.catColor} />}

                  {/* Badges + meta */}
                  <div className="conf-row">
                    <span className="badge badge-green">✓ {a.confidence} Confidence</span>
                    <span className="badge badge-blue">◈ {a.evidence} Evidence</span>
                    <span className="badge badge-neutral">{a.sourceCount} sources</span>
                    {a.sources.slice(0, 2).map(s => (
                      <span key={s} className="badge badge-neutral">{s}</span>
                    ))}
                  </div>
                  <div className="art-meta" style={{ marginTop: 10 }}>
                    <span>{a.date}</span>
                    <span className="dot">·</span>
                    <span>{a.readTime} read</span>
                    <span className="dot">·</span>
                    <span style={{ fontFamily: "var(--serif)", color: "var(--red)", fontWeight: 700 }}>{a.impact} impact</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Conflict monitor */}
            <div className="card card-pad fade" style={{ animationDelay: "0.1s" }}>
              <div className="sec-head">
                <div className="sec-bar" style={{ background: "var(--red)" }} />
                <div className="sec-title">Conflict Monitor</div>
              </div>
              <div>
                {CONFLICTS.map((c, i) => (
                  <div key={i} className="conflict-item">
                    <div className="conflict-top">
                      <div className="conflict-name">{c.name}</div>
                      <span className={ALERT_BADGE[c.alert]}>{c.alert}</span>
                    </div>
                    <div className="conflict-meta">
                      <div className="conflict-region">{c.region} · Day {c.days.toLocaleString()}</div>
                      <div style={{ fontSize: 10, fontFamily: "var(--mono)", color: c.color, fontWeight: 600 }}>{c.intensity}/10</div>
                    </div>
                    <div className="intensity-bar">
                      <div className="intensity-fill" style={{ width: `${c.intensity * 10}%`, background: c.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Country watch */}
            <div className="card card-pad fade" style={{ animationDelay: "0.15s" }}>
              <div className="sec-head">
                <div className="sec-bar" style={{ background: "var(--blue)" }} />
                <div className="sec-title">Country Watch</div>
              </div>
              {COUNTRIES.map((c, i) => (
                <div key={i} className="country-row">
                  <div className="country-flag">{c.flag}</div>
                  <div className="country-info">
                    <div className="country-name">{c.name}</div>
                    <div className="country-status">{c.status}</div>
                  </div>
                  <div className="country-right">
                    <span className={ALERT_BADGE[c.alert]}>{c.alert}</span>
                    <span className="country-count">{c.n} art.</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Relationship graph */}
            <div className="card card-pad fade" style={{ animationDelay: "0.2s" }}>
              <div className="sec-head">
                <div className="sec-bar" style={{ background: "var(--amber)" }} />
                <div className="sec-title">Event Connection Map</div>
              </div>
              <RelGraph />
            </div>
          </div>
        </div>

        {/* Topic strip */}
        <div className="topic-strip fade" style={{ animationDelay: "0.2s" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "var(--blue)", letterSpacing: "0.12em", whiteSpace: "nowrap", marginRight: 4 }}>EXPLORE →</span>
          {["Power Networks", "Color Revolutions", "IMF Trap", "Arms Trade", "Proxy Wars",
            "Dollar Decline", "Media Bias", "India Lens", "Sanctions", "Resource Wars",
            "BRICS", "Regime Change"].map(t => (
            <div key={t} className="topic-tag">{t}</div>
          ))}
        </div>

        {/* Bottom grid */}
        <div className="grid-3">

          {/* Latest research */}
          <div className="card card-pad fade" style={{ animationDelay: "0.22s" }}>
            <div className="sec-head">
              <div className="sec-bar" style={{ background: "var(--ink)" }} />
              <div className="sec-title">Latest Published</div>
            </div>
            {RECENT.map((r, i) => (
              <div key={i} className="lift" style={{
                padding: "10px 0",
                borderBottom: i < RECENT.length - 1 ? "1px solid var(--bg2)" : "none",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span className="badge badge-neutral" style={{ fontSize: 9 }}>{r.cat}</span>
                  <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--ink4)" }}>{r.time} ago</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)", lineHeight: 1.45, marginBottom: 6 }}>{r.title}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className={`badge badge-${r.conf === "High" ? "green" : "amber"}`}>{r.conf}</span>
                  <span style={{ fontFamily: "var(--serif)", fontSize: 15, fontWeight: 700, color: r.impact >= 8.5 ? "var(--red)" : "var(--amber)" }}>{r.impact}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Global timeline */}
          <div className="card card-pad fade" style={{ animationDelay: "0.27s" }}>
            <div className="sec-head">
              <div className="sec-bar" style={{ background: "var(--purple, #6b21a8)" }} />
              <div className="sec-title">Global Event Timeline</div>
            </div>
            <div className="tl">
              {TL.map((e, i) => (
                <div key={i} className="tl-item">
                  <div className="tl-dot" style={{ background: e.color }} />
                  <div className="tl-year" style={{ color: e.color }}>{e.year}</div>
                  <div className="tl-event">{e.event}</div>
                  <div className="tl-pattern">Pattern: {e.pattern}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick facts / data */}
          <div className="card card-pad fade" style={{ animationDelay: "0.32s" }}>
            <div className="sec-head">
              <div className="sec-bar" style={{ background: "var(--green)" }} />
              <div className="sec-title">Key Data Points</div>
            </div>
            <div className="qfacts">
              {[
                { k: "Total active sanctions (Russia)", v: "267" },
                { k: "Global arms trade 2024", v: "$847B" },
                { k: "Countries under IMF program", v: "94" },
                { k: "NGO networks documented", v: "234" },
                { k: "Proxy war patterns matched", v: "14/14" },
                { k: "Media bias incidents tracked", v: "1,890" },
                { k: "India articles published", v: "156" },
                { k: "Conflict days logged (total)", v: "5,230" },
              ].map((f, i) => (
                <div key={i} className="qfact">
                  <div className="qfact-label">{f.k}</div>
                  <div className="qfact-val">{f.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">Signal<span style={{ color: "var(--red)", fontStyle: "italic" }}>Atlas</span></div>
              <div className="footer-desc">Global events explained through evidence, timelines, data, and India context. Independent research — not news, not opinion.</div>
            </div>
            {[
              { head: "Research",  links: ["Power Networks", "Trade Wars", "Sanctions", "Media Bias"] },
              { head: "Regions",   links: ["Middle East", "South Asia", "Africa", "Americas"] },
              { head: "Platform",  links: ["Methodology", "Data Sources", "Confidence System", "Subscribe"] },
            ].map(col => (
              <div key={col.head}>
                <div className="footer-head">{col.head}</div>
                {col.links.map(l => <div key={l} className="footer-link">{l}</div>)}
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <span>© 2026 SignalAtlas · All research based on publicly available sources</span>
            <span>Methodology · Privacy · Sources</span>
          </div>
        </div>
      </div>
    </>
  );
}
