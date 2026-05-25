import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Cell
} from "recharts";

const FONTS = "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,600&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";

/* ── Data ─────────────────────────────────────────────────────────────────── */
const STATS = [
  { n: "1,247", label: "Research Articles",   color: "#1a3a5c" },
  { n: "87",    label: "Countries Tracked",   color: "#7c3d12" },
  { n: "52",    label: "Patterns Identified", color: "#1e4d3b" },
  { n: "6",     label: "Active Conflicts",    color: "#7c1d1d" },
  { n: "14.2K", label: "Dots Connected",      color: "#3b1a6b" },
];

const FEATURED = [
  {
    cat: "POWER NETWORKS", catColor: "#7c1d1d", catBg: "#fef2f2",
    title: "The Political Protest Pattern: 14 Countries, One Blueprint",
    summary: ["Same NGO networks appear across 6 continents", "Funding trails traced to identifiable foundations", "Outcome prediction accuracy: 71% across tracked cases"],
    confidence: "High", evidence: "Strong",
    sources: ["Reuters", "UN", "SIPRI", "OpenSecrets"],
    countries: ["Ukraine", "Venezuela", "Georgia", "Belarus"],
    time: "14 min", date: "May 23, 2026", impact: 9.4,
  },
  {
    cat: "ECONOMIC WARFARE", catColor: "#7c3d12", catBg: "#fff7ed",
    title: "IMF Loan Dependency: The 40-Nation Sovereignty Study",
    summary: ["Pakistan's 23rd IMF loan follows identical prior pattern", "Austerity conditions correlate with civil unrest in 78% of cases", "Local currency devaluation precedes each loan by avg. 14 months"],
    confidence: "High", evidence: "Strong",
    sources: ["IMF", "World Bank", "Reuters", "FT"],
    countries: ["Pakistan", "Sri Lanka", "Argentina", "Ghana"],
    time: "18 min", date: "May 22, 2026", impact: 9.1,
  },
  {
    cat: "INDIA LENS", catColor: "#1e4d3b", catBg: "#f0fdf4",
    title: "India's Dollar–Yuan Position Is Not Neutral — It's Strategic",
    summary: ["India increased gold reserves 3 consecutive months", "Rupee trade agreements now cover 18 partner nations", "Strategic ambiguity protects optionality, not indecision"],
    confidence: "Medium", evidence: "Moderate",
    sources: ["RBI", "MEA", "Bloomberg", "Mint"],
    countries: ["India", "China", "USA", "BRICS"],
    time: "12 min", date: "May 21, 2026", impact: 8.9,
  },
];

const CONFLICTS = [
  { name: "Gaza–Israel",   region: "Middle East", days: 596,  intensity: 9.5, status: "CRITICAL", color: "#dc2626" },
  { name: "Russia–Ukraine",region: "Europe",      days: 1184, intensity: 9.2, status: "CRITICAL", color: "#dc2626" },
  { name: "Sudan",         region: "Africa",       days: 398,  intensity: 8.1, status: "ACTIVE",   color: "#d97706" },
  { name: "Myanmar",       region: "Asia",         days: 1180, intensity: 7.8, status: "ACTIVE",   color: "#d97706" },
];

const RECENT = [
  { cat: "MEDIA NARRATIVES", title: "Who Funds the 'Independent' Fact-Checkers?",            time: "2h",  conf: "High",   impact: 7.9, src: 6 },
  { cat: "AFRICA",           title: "Sudan's Gold Reserves: The War's Hidden Motive",         time: "5h",  conf: "Medium", impact: 8.2, src: 4 },
  { cat: "SANCTIONS",        title: "How Russia Bypassed SWIFT — The 18-Month Blueprint",     time: "8h",  conf: "High",   impact: 8.5, src: 8 },
  { cat: "INDIA LENS",       title: "Red Sea Disruption: India's Shipping Cost Surge",        time: "11h", conf: "High",   impact: 8.0, src: 5 },
  { cat: "ARMS TRADE",       title: "$847B in Weapons Transferred in 2024 — Full Map",        time: "1d",  conf: "High",   impact: 9.0, src: 7 },
  { cat: "POWER NETWORKS",   title: "NGO Funding Trails in South Asia — Documented",          time: "1d",  conf: "Medium", impact: 7.8, src: 4 },
];

const GRAPH_NODES = [
  { id: "Russia Sanctions",  x: 80,  y: 80,  r: 38, color: "#dc2626" },
  { id: "Oil Trade",         x: 220, y: 60,  r: 32, color: "#d97706" },
  { id: "India Imports",     x: 340, y: 100, r: 28, color: "#1e4d3b" },
  { id: "USD Pressure",      x: 180, y: 170, r: 26, color: "#1a3a5c" },
  { id: "Fuel Prices",       x: 300, y: 185, r: 24, color: "#7c3d12" },
  { id: "Inflation",         x: 410, y: 155, r: 20, color: "#6b21a8" },
  { id: "BRICS Talks",       x: 90,  y: 195, r: 22, color: "#3b1a6b" },
];
const GRAPH_EDGES = [
  { s: 0, t: 1, w: 92 }, { s: 1, t: 2, w: 78 }, { s: 0, t: 3, w: 85 },
  { s: 2, t: 4, w: 67 }, { s: 4, t: 5, w: 61 }, { s: 3, t: 4, w: 55 },
  { s: 0, t: 6, w: 70 }, { s: 6, t: 3, w: 48 }, { s: 1, t: 3, w: 60 },
];

const GROWTH = [
  { m: "Oct", v: 42 }, { m: "Nov", v: 67 }, { m: "Dec", v: 89 },
  { m: "Jan", v: 124 }, { m: "Feb", v: 156 }, { m: "Mar", v: 198 },
  { m: "Apr", v: 234 }, { m: "May", v: 267 },
];

const TOPICS = [
  { name: "Power Networks",   n: 142, pct: 94, color: "#7c1d1d" },
  { name: "India Lens",       n: 112, pct: 91, color: "#1e4d3b" },
  { name: "Sanctions",        n: 98,  pct: 88, color: "#1a3a5c" },
  { name: "Media Narratives", n: 87,  pct: 85, color: "#6b21a8" },
  { name: "Trade Wars",       n: 76,  pct: 82, color: "#7c3d12" },
  { name: "Protest Patterns", n: 65,  pct: 79, color: "#1e4d3b" },
];

const TICKER = [
  "Sudan ceasefire talks collapse — Day 398 of civil war continues",
  "India gold reserves increase for third consecutive month — RBI data",
  "14 countries match political protest blueprint — new SignalAtlas pattern report",
  "Pakistan IMF loan #23 approved — same conditions as loan #11 in 2013",
  "Red Sea disruption adds $340 average per container for Indian importers",
];

const CONF_COLOR = { High: { bg: "#f0fdf4", color: "#1e4d3b", border: "#bbf7d0" }, Medium: { bg: "#fffbeb", color: "#7c3d12", border: "#fde68a" }, Low: { bg: "#fef2f2", color: "#7c1d1d", border: "#fecaca" } };
const EVID_COLOR = { Strong: "#1e4d3b", Moderate: "#7c3d12", Weak: "#7c1d1d" };

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const Tag = ({ label, bg = "#f3f4f6", color = "#374151", border = "#e5e7eb", small }) => (
  <span style={{ fontSize: small ? 9 : 10, fontFamily: "'Instrument Sans',sans-serif", fontWeight: 600,
    letterSpacing: "0.1em", padding: small ? "2px 7px" : "3px 10px",
    borderRadius: 3, background: bg, color, border: `1px solid ${border}` }}>{label}</span>
);

const ConfBadge = ({ conf, evid }) => (
  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
    <Tag label={`✓ ${conf} Confidence`} {...CONF_COLOR[conf]} small />
    <Tag label={`◈ ${evid} Evidence`}
      bg="#f8f8f8" color={EVID_COLOR[evid]} border="#e5e7eb" small />
  </div>
);

const SourcePill = ({ sources }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", color: "#9ca3af", letterSpacing: "0.1em" }}>SOURCES</span>
    {sources.slice(0, 3).map(s => (
      <span key={s} style={{ fontSize: 9, padding: "1px 7px", background: "#f3f4f6",
        border: "1px solid #e5e7eb", borderRadius: 2, color: "#6b7280",
        fontFamily: "'Instrument Sans',sans-serif" }}>{s}</span>
    ))}
    {sources.length > 3 && <span style={{ fontSize: 9, color: "#9ca3af" }}>+{sources.length - 3}</span>}
  </div>
);

const ImpactBadge = ({ v }) => {
  const c = v >= 9 ? "#7c1d1d" : v >= 8 ? "#7c3d12" : "#1a3a5c";
  return (
    <div style={{ textAlign: "center", padding: "8px 14px", background: "#fafafa",
      border: "1px solid #e5e7eb", borderRadius: 4 }}>
      <div style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 900, color: c, lineHeight: 1 }}>{v}</div>
      <div style={{ fontSize: 8, letterSpacing: "0.15em", color: "#9ca3af",
        fontFamily: "'Instrument Sans',sans-serif", marginTop: 2 }}>IMPACT</div>
    </div>
  );
};

const SectionHead = ({ label, color = "#1a3a5c" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
    <div style={{ width: 3, height: 18, background: color, borderRadius: 2 }} />
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
      color: "#6b7280", textTransform: "uppercase",
      fontFamily: "'Instrument Sans',sans-serif" }}>{label}</span>
  </div>
);

/* ── Relationship Graph (pure SVG) ──────────────────────────────────────── */
const RelGraph = () => {
  const [hovered, setHovered] = useState(null);
  return (
    <svg width="100%" viewBox="0 0 500 260" style={{ fontFamily: "'Instrument Sans',sans-serif" }}>
      {GRAPH_EDGES.map((e, i) => {
        const s = GRAPH_NODES[e.s], t = GRAPH_NODES[e.t];
        const active = hovered === e.s || hovered === e.t;
        return (
          <g key={i}>
            <line x1={s.x} y1={s.y} x2={t.x} y2={t.y}
              stroke={active ? "#1a3a5c" : "#e5e7eb"}
              strokeWidth={active ? 2 : 1} opacity={active ? 0.9 : 0.6} />
            {active && (
              <text x={(s.x + t.x) / 2} y={(s.y + t.y) / 2 - 4}
                fontSize={8} fill="#9ca3af" textAnchor="middle">{e.w}%</text>
            )}
          </g>
        );
      })}
      {GRAPH_NODES.map((n, i) => (
        <g key={i} style={{ cursor: "pointer" }}
          onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
          <circle cx={n.x} cy={n.y} r={n.r + (hovered === i ? 4 : 0)}
            fill={hovered === i ? n.color : n.color + "18"}
            stroke={n.color} strokeWidth={hovered === i ? 2 : 1}
            style={{ transition: "all 0.2s" }} />
          <text x={n.x} y={n.y + 3} textAnchor="middle" fontSize={hovered === i ? 9 : 8}
            fill={hovered === i ? "#fff" : n.color} fontWeight={600}
            style={{ pointerEvents: "none" }}>
            {n.id.split(" ").map((w, wi) => (
              <tspan key={wi} x={n.x} dy={wi === 0 ? (n.id.includes(" ") ? -5 : 0) : 11}>{w}</tspan>
            ))}
          </text>
        </g>
      ))}
    </svg>
  );
};

/* ── Main ─────────────────────────────────────────────────────────────── */
export default function App() {
  const [tick, setTick] = useState(0);
  const [time, setTime] = useState(new Date());
  const [tab, setTab] = useState("featured");

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { const t = setInterval(() => setTick(p => (p + 1) % TICKER.length), 4500); return () => clearInterval(t); }, []);

  return (
    <div style={{ background: "#fafaf8", minHeight: "100vh", color: "#111827" }}>
      <link rel="stylesheet" href={FONTS} />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes tickSlide{from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:translateX(0)}}
        .card{background:#fff;border:1px solid #e5e7eb;border-radius:6px;}
        .lift{transition:transform 0.18s,box-shadow 0.18s;cursor:pointer;}
        .lift:hover{transform:translateY(-2px);box-shadow:0 6px 24px rgba(0,0,0,0.08);}
        .row-hover:hover{background:#f9fafb;cursor:pointer;}
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 54,
        position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 4, height: 28, background: "#1a3a5c", borderRadius: 2 }} />
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 900,
              color: "#1a3a5c", letterSpacing: "-0.02em" }}>Signal</span>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 300,
              color: "#7c1d1d", letterSpacing: "-0.02em" }}>Atlas</span>
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            {["Conflicts","Countries","Topics","Timelines","Data Center","Maps"].map(l => (
              <span key={l} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 4,
                color: "#6b7280", cursor: "pointer", fontFamily: "'Instrument Sans',sans-serif",
                fontWeight: 500, transition: "all 0.15s" }}
                onMouseEnter={e => { e.target.style.background="#f3f4f6"; e.target.style.color="#111827"; }}
                onMouseLeave={e => { e.target.style.background="transparent"; e.target.style.color="#6b7280"; }}>{l}</span>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace",
            color: "#9ca3af", letterSpacing: "0.05em" }}>
            {time.toUTCString().slice(0, 22)} UTC
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px",
            background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#dc2626",
              boxShadow: "0 0 0 2px #fee2e2" }} />
            <span style={{ fontSize: 10, color: "#7c1d1d", fontWeight: 700,
              letterSpacing: "0.1em", fontFamily: "'Instrument Sans',sans-serif" }}>LIVE</span>
          </div>
          <div style={{ padding: "6px 16px", background: "#1a3a5c", color: "#fff",
            borderRadius: 4, fontSize: 12, cursor: "pointer",
            fontFamily: "'Instrument Sans',sans-serif", fontWeight: 600 }}>Subscribe</div>
        </div>
      </nav>

      {/* ── TICKER ──────────────────────────────────────────────────── */}
      <div style={{ background: "#1a3a5c", padding: "8px 40px",
        display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em",
          color: "#fff", background: "#7c1d1d", padding: "2px 10px",
          borderRadius: 2, whiteSpace: "nowrap",
          fontFamily: "'Instrument Sans',sans-serif" }}>INTEL FEED</span>
        <span key={tick} style={{ fontSize: 12, color: "#bfdbfe",
          animation: "tickSlide 0.5s ease",
          fontFamily: "'Instrument Sans',sans-serif" }}>{TICKER[tick]}</span>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 40px" }}>

        {/* ── STATS ───────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 28 }}>
          {STATS.map((s, i) => (
            <div key={i} className="card lift" style={{
              padding: "16px 18px", borderTop: `3px solid ${s.color}`,
              animation: `fadeUp 0.4s ease ${i * 0.06}s both` }}>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 26,
                fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 11, color: "#374151", fontWeight: 600,
                marginTop: 5, fontFamily: "'Instrument Sans',sans-serif" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── MAIN GRID ───────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, marginBottom: 24 }}>

          {/* Left — Featured */}
          <div>
            {/* Tabs */}
            <div style={{ display: "flex", gap: 2, marginBottom: 20, borderBottom: "1px solid #e5e7eb", paddingBottom: 0 }}>
              {[["featured","Featured Research"],["india","India Lens"],["patterns","Patterns"]].map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)} style={{
                  fontSize: 11, fontFamily: "'Instrument Sans',sans-serif", fontWeight: 600,
                  letterSpacing: "0.08em", padding: "8px 16px", border: "none",
                  background: "transparent", cursor: "pointer",
                  color: tab === id ? "#1a3a5c" : "#9ca3af",
                  borderBottom: `2px solid ${tab === id ? "#1a3a5c" : "transparent"}`,
                  marginBottom: -1, transition: "all 0.15s",
                  textTransform: "uppercase" }}>{label}</button>
              ))}
            </div>

            {/* Hero card */}
            <div className="card lift" style={{ marginBottom: 14, overflow: "hidden",
              animation: "fadeUp 0.5s ease 0.1s both" }}>
              <div style={{ height: 3, background: `linear-gradient(90deg, ${FEATURED[0].catColor}, ${FEATURED[0].catColor}55)` }} />
              <div style={{ padding: "24px 28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                      <Tag label={FEATURED[0].cat} bg={FEATURED[0].catBg} color={FEATURED[0].catColor} border={FEATURED[0].catColor + "40"} />
                    </div>
                    <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700,
                      color: "#111827", lineHeight: 1.35, marginBottom: 14 }}>
                      {FEATURED[0].title}
                    </h2>
                    {/* Quick Summary */}
                    <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb",
                      borderLeft: "3px solid #1a3a5c", borderRadius: 4,
                      padding: "12px 16px", marginBottom: 14 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em",
                        color: "#9ca3af", marginBottom: 8,
                        fontFamily: "'Instrument Sans',sans-serif" }}>QUICK SUMMARY</div>
                      {FEATURED[0].summary.map((s, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                          <span style={{ color: "#1a3a5c", fontSize: 11 }}>→</span>
                          <span style={{ fontSize: 12, color: "#374151", lineHeight: 1.5,
                            fontFamily: "'Instrument Sans',sans-serif" }}>{s}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <ConfBadge conf={FEATURED[0].confidence} evid={FEATURED[0].evidence} />
                      <SourcePill sources={FEATURED[0].sources} />
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: "#9ca3af",
                          fontFamily: "'Instrument Sans',sans-serif" }}>{FEATURED[0].date}</span>
                        <span style={{ color: "#e5e7eb" }}>·</span>
                        <span style={{ fontSize: 11, color: "#9ca3af" }}>{FEATURED[0].time} read</span>
                        <span style={{ color: "#e5e7eb" }}>·</span>
                        {FEATURED[0].countries.slice(0,3).map(c => (
                          <Tag key={c} label={c} small />
                        ))}
                      </div>
                    </div>
                  </div>
                  <ImpactBadge v={FEATURED[0].impact} />
                </div>
              </div>
            </div>

            {/* 2-col */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {FEATURED.slice(1).map((a, i) => (
                <div key={i} className="card lift" style={{ overflow: "hidden",
                  animation: `fadeUp 0.5s ease ${0.2 + i * 0.08}s both` }}>
                  <div style={{ height: 2, background: a.catColor }} />
                  <div style={{ padding: "18px 20px" }}>
                    <Tag label={a.cat} bg={a.catBg} color={a.catColor} border={a.catColor + "40"} />
                    <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700,
                      color: "#111827", lineHeight: 1.4, margin: "10px 0 10px" }}>{a.title}</h3>
                    <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb",
                      borderLeft: `2px solid ${a.catColor}`, borderRadius: 3,
                      padding: "8px 12px", marginBottom: 10 }}>
                      {a.summary.slice(0, 2).map((s, i) => (
                        <div key={i} style={{ fontSize: 11, color: "#6b7280",
                          lineHeight: 1.5, fontFamily: "'Instrument Sans',sans-serif",
                          marginBottom: i === 0 ? 3 : 0 }}>→ {s}</div>
                      ))}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                      <ConfBadge conf={a.confidence} evid={a.evidence} />
                      <SourcePill sources={a.sources} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 10, color: "#9ca3af",
                          fontFamily: "'Instrument Sans',sans-serif" }}>{a.date} · {a.time}</span>
                        <ImpactBadge v={a.impact} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Conflict tracker */}
            <div className="card" style={{ padding: 18, animation: "fadeUp 0.5s ease 0.12s both" }}>
              <SectionHead label="Live Conflict Monitor" color="#7c1d1d" />
              {CONFLICTS.map((c, i) => (
                <div key={i} style={{ paddingBottom: 12, marginBottom: 12,
                  borderBottom: i < CONFLICTS.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#111827",
                      fontFamily: "'Instrument Sans',sans-serif" }}>{c.name}</span>
                    <Tag label={c.status} bg={c.status === "CRITICAL" ? "#fef2f2" : "#fffbeb"}
                      color={c.color} border={c.color + "40"} small />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                    <span style={{ fontSize: 10, color: "#9ca3af",
                      fontFamily: "'Instrument Sans',sans-serif" }}>Day {c.days.toLocaleString()} · {c.region}</span>
                    <span style={{ fontSize: 10, color: "#9ca3af" }}>{c.intensity}/10</span>
                  </div>
                  <div style={{ height: 3, background: "#f3f4f6", borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${c.intensity * 10}%`,
                      background: c.color, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Topic heat */}
            <div className="card" style={{ padding: 18, animation: "fadeUp 0.5s ease 0.18s both" }}>
              <SectionHead label="Topic Heat Index" color="#6b21a8" />
              {TOPICS.map((t, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: "#374151",
                      fontFamily: "'Instrument Sans',sans-serif" }}>{t.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: t.color,
                      fontFamily: "'JetBrains Mono',monospace" }}>{t.n}</span>
                  </div>
                  <div style={{ height: 3, background: "#f3f4f6", borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${t.pct}%`,
                      background: t.color, borderRadius: 2, opacity: 0.8 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Archive growth */}
            <div className="card" style={{ padding: 18, animation: "fadeUp 0.5s ease 0.22s both" }}>
              <SectionHead label="Archive Growth" color="#1a3a5c" />
              <ResponsiveContainer width="100%" height={90}>
                <AreaChart data={GROWTH} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a3a5c" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#1a3a5c" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="m" tick={{ fill: "#9ca3af", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb",
                    borderRadius: 4, fontSize: 11 }} />
                  <Area type="monotone" dataKey="v" stroke="#1a3a5c" fill="url(#ga)" strokeWidth={2} name="Articles" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── RELATIONSHIP GRAPH ─────────────────────────────────── */}
        <div className="card" style={{ padding: 24, marginBottom: 24,
          animation: "fadeUp 0.5s ease 0.25s both" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <SectionHead label="Event Relationship Graph — Russia Sanctions Chain" color="#1a3a5c" />
              <p style={{ fontSize: 12, color: "#6b7280", marginTop: -10, marginBottom: 0,
                fontFamily: "'Instrument Sans',sans-serif" }}>
                Hover any node to see connection strength. Click to open full research.
              </p>
            </div>
            <Tag label="INTERACTIVE" bg="#eff6ff" color="#1a3a5c" border="#bfdbfe" />
          </div>
          <RelGraph />
        </div>

        {/* ── LATEST RESEARCH ───────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <SectionHead label="Latest Research Published" color="#1a3a5c" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {RECENT.map((r, i) => (
              <div key={i} className="card lift" style={{
                padding: "16px 18px",
                animation: `fadeUp 0.4s ease ${i * 0.05}s both` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <Tag label={r.cat} small />
                  <span style={{ fontSize: 9, color: "#9ca3af",
                    fontFamily: "'Instrument Sans',sans-serif" }}>{r.time} ago</span>
                </div>
                <h4 style={{ fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 700,
                  color: "#111827", lineHeight: 1.45, marginBottom: 10 }}>{r.title}</h4>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Tag label={`✓ ${r.conf}`}
                      {...CONF_COLOR[r.conf]} small />
                    <span style={{ fontSize: 9, padding: "2px 7px", background: "#f3f4f6",
                      border: "1px solid #e5e7eb", borderRadius: 3, color: "#6b7280",
                      fontFamily: "'Instrument Sans',sans-serif" }}>{r.src} src</span>
                  </div>
                  <span style={{ fontFamily: "'Fraunces',serif", fontSize: 16,
                    fontWeight: 900, color: r.impact >= 8.5 ? "#7c1d1d" : "#7c3d12" }}>{r.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TOPIC EXPLORER ────────────────────────────────────── */}
        <div className="card" style={{ padding: "18px 24px", marginBottom: 28,
          borderLeft: "4px solid #1a3a5c" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
              color: "#1a3a5c", textTransform: "uppercase", whiteSpace: "nowrap",
              fontFamily: "'Instrument Sans',sans-serif" }}>Explore Topics →</span>
            {["Power Networks","Color Revolutions","IMF Debt Trap","Arms Trade","Proxy Wars",
              "Dollar Decline","Media Narratives","India Geopolitics","Sanction Warfare",
              "Resource Wars","Trade Wars","BRICS Strategy"].map(k => (
              <span key={k} style={{ fontSize: 11, padding: "4px 12px",
                background: "#f3f4f6", border: "1px solid #e5e7eb",
                borderRadius: 4, cursor: "pointer", color: "#374151",
                fontFamily: "'Instrument Sans',sans-serif", transition: "all 0.15s" }}
                onMouseEnter={e => { e.target.style.background="#1a3a5c"; e.target.style.color="#fff"; e.target.style.borderColor="#1a3a5c"; }}
                onMouseLeave={e => { e.target.style.background="#f3f4f6"; e.target.style.color="#374151"; e.target.style.borderColor="#e5e7eb"; }}>
                {k}
              </span>
            ))}
          </div>
        </div>

        {/* ── FOOTER ────────────────────────────────────────────── */}
        <div style={{ borderTop: "2px solid #1a3a5c", paddingTop: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 32, marginBottom: 24 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 3, height: 22, background: "#1a3a5c", borderRadius: 2 }} />
                <span style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 900, color: "#1a3a5c" }}>Signal</span>
                <span style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 300, color: "#7c1d1d" }}>Atlas</span>
              </div>
              <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.7, maxWidth: 280,
                fontFamily: "'Instrument Sans',sans-serif" }}>
                Global events explained through evidence, timelines, data, and India context. Independent research — not news, not opinion.
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <Tag label="All analysis from public sources" bg="#f0f9ff" color="#1a3a5c" border="#bae6fd" />
              </div>
            </div>
            {[
              { head: "Research",  links: ["Power Networks","Trade Wars","Sanctions","Media Narratives"] },
              { head: "Regions",   links: ["Middle East","South Asia","Africa","Americas","Europe"] },
              { head: "Platform",  links: ["Methodology","Data Sources","Confidence System","Subscribe"] },
            ].map(col => (
              <div key={col.head}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
                  color: "#374151", textTransform: "uppercase",
                  fontFamily: "'Instrument Sans',sans-serif", marginBottom: 12 }}>{col.head}</div>
                {col.links.map(l => (
                  <div key={l} style={{ fontSize: 12, color: "#6b7280", marginBottom: 7,
                    cursor: "pointer", fontFamily: "'Instrument Sans',sans-serif",
                    transition: "color 0.15s" }}
                    onMouseEnter={e => e.target.style.color="#1a3a5c"}
                    onMouseLeave={e => e.target.style.color="#6b7280"}>{l}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 16,
            display: "flex", justifyContent: "space-between",
            fontSize: 11, color: "#9ca3af",
            fontFamily: "'Instrument Sans',sans-serif" }}>
            <span>© 2026 SignalAtlas · All research based on publicly available sources</span>
            <span>Methodology · Privacy · Sources</span>
          </div>
        </div>
      </div>
    </div>
  );
}
