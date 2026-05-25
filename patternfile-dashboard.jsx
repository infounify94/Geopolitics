import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from "recharts";

// ── Seed data ──────────────────────────────────────────────────────────────────
const ACTIVE_CONFLICTS = [
  { id: 1, name: "Russia–Ukraine", region: "Europe", intensity: 9.2, days: 1184, casualties: "700K+", phase: "Active War", color: "#e63946", trend: "escalating" },
  { id: 2, name: "Gaza–Israel", region: "Middle East", intensity: 9.5, days: 596, casualties: "42K+", phase: "Active War", color: "#e63946", trend: "escalating" },
  { id: 3, name: "Sudan Civil War", region: "Africa", intensity: 8.1, days: 398, casualties: "150K+", phase: "Active", color: "#f4a261", trend: "stable" },
  { id: 4, name: "Haiti Crisis", region: "Americas", intensity: 7.2, days: 210, casualties: "5K+", phase: "Escalating", color: "#f4a261", trend: "escalating" },
  { id: 5, name: "Myanmar Junta", region: "Asia", intensity: 7.8, days: 1180, casualties: "50K+", phase: "Active", color: "#f4a261", trend: "stable" },
  { id: 6, name: "Sahel Instability", region: "Africa", intensity: 7.0, days: 890, casualties: "30K+", phase: "Ongoing", color: "#ffd166", trend: "declining" },
];

const TOPIC_HEAT = [
  { topic: "Deep State", articles: 142, heat: 94, category: "Power" },
  { topic: "Sanctions Wars", articles: 98, heat: 88, category: "Economic" },
  { topic: "Media Bias", articles: 87, heat: 85, category: "Narrative" },
  { topic: "Dollar Decline", articles: 76, heat: 82, category: "Economic" },
  { topic: "Color Revolutions", articles: 65, heat: 79, category: "Political" },
  { topic: "Arms Trade", articles: 54, heat: 74, category: "Military" },
  { topic: "NGO Networks", articles: 48, heat: 71, category: "Power" },
  { topic: "India Geopolitics", articles: 112, heat: 91, category: "India" },
];

const COUNTRY_WATCH = [
  { country: "USA", flag: "🇺🇸", articles: 234, alert: "high", status: "Election Cycle + Trade Wars" },
  { country: "China", flag: "🇨🇳", articles: 198, alert: "high", status: "Taiwan Tensions + BRI Debt" },
  { country: "Russia", flag: "🇷🇺", articles: 187, alert: "critical", status: "Ukraine War + Sanctions" },
  { country: "India", flag: "🇮🇳", articles: 156, alert: "medium", status: "Strategic Realignment" },
  { country: "Iran", flag: "🇮🇷", articles: 134, alert: "high", status: "Nuclear + Proxy Networks" },
  { country: "Israel", flag: "🇮🇱", articles: 129, alert: "critical", status: "Gaza + Regional War" },
  { country: "Pakistan", flag: "🇵🇰", articles: 98, alert: "high", status: "Economic Collapse" },
  { country: "Venezuela", flag: "🇻🇪", articles: 67, alert: "medium", status: "Opposition Funding" },
];

const TIMELINE_EVENTS = [
  { year: "2019", event: "Hong Kong Protests", type: "Political", country: "China", pattern: "Color Revolution" },
  { year: "2020", event: "Belarus Uprising", type: "Political", country: "Belarus", pattern: "Color Revolution" },
  { year: "2021", event: "Myanmar Coup", type: "Military", country: "Myanmar", pattern: "Regime Change" },
  { year: "2022", event: "Ukraine War Begins", type: "War", country: "Ukraine", pattern: "Proxy War" },
  { year: "2023", event: "Niger Coup", type: "Military", country: "Niger", pattern: "Anti-France Wave" },
  { year: "2023", event: "Gaza War", type: "War", country: "Palestine", pattern: "Occupation" },
  { year: "2024", event: "Venezuela Election Crisis", type: "Political", country: "Venezuela", pattern: "Color Revolution" },
  { year: "2025", event: "Haiti State Collapse", type: "Political", country: "Haiti", pattern: "Regime Change" },
];

const RESEARCH_STATS = [
  { month: "Oct", articles: 42, events: 8 },
  { month: "Nov", articles: 67, events: 12 },
  { month: "Dec", articles: 89, events: 15 },
  { month: "Jan", articles: 124, events: 19 },
  { month: "Feb", articles: 156, events: 23 },
  { month: "Mar", articles: 198, events: 31 },
  { month: "Apr", articles: 234, events: 38 },
  { month: "May", articles: 267, events: 42 },
];

const PATTERN_MATCHES = [
  { name: "Color Revolution Template", matches: 14, countries: ["Ukraine", "Belarus", "Venezuela", "Hong Kong", "Georgia"] },
  { name: "IMF Loan → Austerity → Unrest", matches: 9, countries: ["Argentina", "Pakistan", "Sri Lanka", "Egypt", "Ghana"] },
  { name: "Regime Change via NGO Network", matches: 11, countries: ["Libya", "Syria", "Iraq", "Cuba", "Iran"] },
  { name: "Media Blackout on Conflict", matches: 18, countries: ["Yemen", "DRC", "Ethiopia", "Sudan", "Myanmar"] },
];

const TICKER_ITEMS = [
  "🔴 LIVE: Sudan ceasefire talks collapse — Day 398 of civil war",
  "⚡ Russia expands Black Sea blockade — grain prices surge 12%",
  "📊 New research: 14 countries show identical color revolution pattern",
  "🇮🇳 India angle: How the Dollar-Yuan standoff affects INR",
  "🔍 Deep dive: Who funds the 'independent' fact-checkers?",
  "⚠️ Pattern alert: Pakistan follows IMF loan → austerity → protests script",
  "🗺️ Arms trade map updated: $847B weapons transferred in 2024",
  "💰 Follow the money: Gaza reconstruction contracts already awarded",
];

const CATEGORY_COLORS = {
  Power: "#e63946", Economic: "#f4a261", Narrative: "#2a9d8f",
  Political: "#8338ec", Military: "#fb8500", India: "#06d6a0",
};

const ALERT_COLORS = { critical: "#e63946", high: "#f4a261", medium: "#ffd166", low: "#2a9d8f" };

// ── Helpers ────────────────────────────────────────────────────────────────────
const Dot = ({ color, pulse }) => (
  <span style={{
    display: "inline-block", width: 8, height: 8, borderRadius: "50%",
    background: color, marginRight: 6, flexShrink: 0,
    boxShadow: pulse ? `0 0 0 3px ${color}30` : "none",
    animation: pulse ? "pulseGlow 1.8s ease-in-out infinite" : "none",
  }} />
);

const ImpactBar = ({ value, max = 10, color = "#e63946" }) => (
  <div style={{ height: 4, background: "#1a1f2e", borderRadius: 2, overflow: "hidden", width: "100%" }}>
    <div style={{ height: "100%", width: `${(value / max) * 100}%`, background: color, borderRadius: 2, transition: "width 1s ease" }} />
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
export default function App() {
  const [tickerPos, setTickerPos] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [activeRegion, setActiveRegion] = useState("All");
  const tickerRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerPos(p => (p + 1) % TICKER_ITEMS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const regions = ["All", "Europe", "Middle East", "Africa", "Asia", "Americas"];
  const filteredConflicts = activeRegion === "All" ? ACTIVE_CONFLICTS : ACTIVE_CONFLICTS.filter(c => c.region === activeRegion);

  return (
    <div style={{
      background: "#070b12",
      minHeight: "100vh",
      fontFamily: "'Courier New', 'IBM Plex Mono', monospace",
      color: "#c8d3e0",
      overflowX: "hidden",
    }}>
      <style>{`
        @keyframes pulseGlow { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.4)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes ticker { 0%{opacity:0;transform:translateY(8px)} 10%{opacity:1;transform:translateY(0)} 90%{opacity:1} 100%{opacity:0} }
        @keyframes borderPulse { 0%,100%{border-color:#e6394620} 50%{border-color:#e6394660} }
        .card { background:#0d1320; border:1px solid #1a2030; border-radius:8px; transition:border-color 0.2s; }
        .card:hover { border-color:#2a3545; }
        .conflict-row:hover { background:#1a2030 !important; cursor:pointer; }
        .country-row:hover { background:#111827 !important; cursor:pointer; }
        .grid-main { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; }
        .grid-wide { display:grid; grid-template-columns:2fr 1fr; gap:16px; }
        @media(max-width:900px){.grid-main{grid-template-columns:1fr;}.grid-wide{grid-template-columns:1fr;}}
      `}</style>

      {/* ── TOP NAV ── */}
      <div style={{ background: "#050810", borderBottom: "1px solid #1a2030", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 52 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 24, background: "#e63946" }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>PATTERN</span>
            <span style={{ fontSize: 15, fontWeight: 400, color: "#e63946", letterSpacing: 1 }}>FILE</span>
          </div>
          <div style={{ width: 1, height: 20, background: "#1a2030" }} />
          <span style={{ fontSize: 10, color: "#4a5568", letterSpacing: 2 }}>INTELLIGENCE RESEARCH PLATFORM</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {["Research", "Countries", "Topics", "Timeline", "Connections", "Data"].map(item => (
            <span key={item} style={{ fontSize: 11, color: "#4a6080", letterSpacing: 1, cursor: "pointer" }}
              onMouseEnter={e => e.target.style.color = "#e63946"}
              onMouseLeave={e => e.target.style.color = "#4a6080"}>{item}</span>
          ))}
          <div style={{ padding: "4px 14px", background: "#e6394615", border: "1px solid #e6394640", borderRadius: 3, fontSize: 11, color: "#e63946", letterSpacing: 1 }}>
            <Dot color="#e63946" pulse />LIVE
          </div>
          <div style={{ fontSize: 11, color: "#4a6080", fontVariantNumeric: "tabular-nums" }}>
            {currentTime.toUTCString().slice(0, 25)} UTC
          </div>
        </div>
      </div>

      {/* ── TICKER ── */}
      <div style={{ background: "#0a0e18", borderBottom: "1px solid #e6394625", padding: "9px 28px", display: "flex", alignItems: "center", gap: 16, overflow: "hidden" }}>
        <span style={{ fontSize: 9, color: "#e63946", letterSpacing: 3, whiteSpace: "nowrap", borderRight: "1px solid #e6394640", paddingRight: 16 }}>INTEL FEED</span>
        <span style={{ fontSize: 12, color: "#8a9ab5", animation: "ticker 4s ease-in-out infinite", key: tickerPos }}>
          {TICKER_ITEMS[tickerPos]}
        </span>
      </div>

      {/* ── HERO STATS ── */}
      <div style={{ padding: "20px 28px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Active Conflicts", value: "6", sub: "globally monitored", icon: "⚔️", color: "#e63946", alert: true },
            { label: "Countries Tracked", value: "87", sub: "in database", icon: "🌍", color: "#f4a261", alert: false },
            { label: "Research Articles", value: "1,247", sub: "published", icon: "📄", color: "#2a9d8f", alert: false },
            { label: "Patterns Identified", value: "52", sub: "recurring playbooks", icon: "🔍", color: "#8338ec", alert: false },
            { label: "Events Archived", value: "3,891", sub: "since 2015", icon: "🗄️", color: "#06d6a0", alert: false },
            { label: "Dots Connected", value: "14,203", sub: "cross-references", icon: "🔗", color: "#fb8500", alert: false },
          ].map((s, i) => (
            <div key={i} className="card" style={{
              padding: "16px 18px",
              borderTop: `3px solid ${s.color}`,
              animation: `fadeInUp 0.5s ease ${i * 0.07}s both`,
              ...(s.alert ? { animation: `fadeInUp 0.5s ease ${i * 0.07}s both, borderPulse 2s ease-in-out infinite` } : {}),
            }}>
              <div style={{ fontSize: 18, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "#fff", letterSpacing: 1, marginTop: 4, textTransform: "uppercase" }}>{s.label}</div>
              <div style={{ fontSize: 10, color: "#4a5568", marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── ROW 2: Conflicts + Research Graph ── */}
        <div className="grid-wide" style={{ marginBottom: 16 }}>

          {/* Active Conflicts */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Dot color="#e63946" pulse />
                <span style={{ fontSize: 11, color: "#fff", letterSpacing: 2, textTransform: "uppercase" }}>Active Conflict Monitor</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {regions.map(r => (
                  <button key={r} onClick={() => setActiveRegion(r)} style={{
                    fontSize: 9, padding: "3px 8px", borderRadius: 2, cursor: "pointer", letterSpacing: 1,
                    background: activeRegion === r ? "#e63946" : "transparent",
                    color: activeRegion === r ? "#fff" : "#4a6080",
                    border: `1px solid ${activeRegion === r ? "#e63946" : "#1a2030"}`,
                  }}>{r.toUpperCase()}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {filteredConflicts.map((c, i) => (
                <div key={c.id} className="conflict-row" onClick={() => setSelectedConflict(selectedConflict?.id === c.id ? null : c)}
                  style={{
                    padding: "12px 14px", borderRadius: 6, background: selectedConflict?.id === c.id ? "#1a2030" : "#0a0e18",
                    border: `1px solid ${selectedConflict?.id === c.id ? c.color + "60" : "#1a2030"}`,
                    animation: `fadeInUp 0.4s ease ${i * 0.05}s both`,
                  }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>{c.name}</span>
                    <span style={{ fontSize: 9, padding: "2px 7px", background: c.color + "20", color: c.color, borderRadius: 2, letterSpacing: 1 }}>
                      {c.trend === "escalating" ? "↑" : c.trend === "declining" ? "↓" : "→"} {c.phase.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 10, color: "#4a6080" }}>Day {c.days.toLocaleString()}</span>
                    <span style={{ fontSize: 10, color: "#8a9ab5" }}>{c.casualties} casualties</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 9, color: "#4a5568" }}>INTENSITY</span>
                    <div style={{ flex: 1 }}><ImpactBar value={c.intensity} color={c.color} /></div>
                    <span style={{ fontSize: 10, color: c.color }}>{c.intensity}</span>
                  </div>
                  {selectedConflict?.id === c.id && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #1a2030" }}>
                      <div style={{ fontSize: 10, color: "#4a6080" }}>📍 Region: {c.region}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Research Growth */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "#fff", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Research Archive Growth</div>
              <div style={{ fontSize: 10, color: "#4a5568" }}>Articles published + Events documented</div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={RESEARCH_STATS}>
                <defs>
                  <linearGradient id="artGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e63946" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#e63946" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="evtGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2a9d8f" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2a9d8f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: "#4a5568", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#4a5568", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0d1320", border: "1px solid #1a2030", borderRadius: 4, fontSize: 11 }} />
                <Area type="monotone" dataKey="articles" stroke="#e63946" fill="url(#artGrad)" strokeWidth={2} name="Articles" />
                <Area type="monotone" dataKey="events" stroke="#2a9d8f" fill="url(#evtGrad)" strokeWidth={2} name="Events" />
              </AreaChart>
            </ResponsiveContainer>

            {/* Pattern Matches */}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #1a2030" }}>
              <div style={{ fontSize: 10, color: "#8338ec", letterSpacing: 2, marginBottom: 10 }}>🔁 RECURRING PATTERNS DETECTED</div>
              {PATTERN_MATCHES.map((p, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: "#c8d3e0" }}>{p.name}</span>
                    <span style={{ fontSize: 10, color: "#8338ec", fontWeight: 700 }}>{p.matches} matches</span>
                  </div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {p.countries.slice(0, 4).map(c => (
                      <span key={c} style={{ fontSize: 9, padding: "1px 6px", background: "#8338ec15", color: "#8a7abf", borderRadius: 2 }}>{c}</span>
                    ))}
                    {p.countries.length > 4 && <span style={{ fontSize: 9, color: "#4a5568" }}>+{p.countries.length - 4}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ROW 3: Topic Heat + Country Watch + Timeline ── */}
        <div className="grid-main" style={{ marginBottom: 16 }}>

          {/* Topic Heat Map */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 11, color: "#fff", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
              🌡️ Topic Heat Index
            </div>
            {TOPIC_HEAT.map((t, i) => (
              <div key={i} style={{ marginBottom: 12, animation: `fadeInUp 0.4s ease ${i * 0.05}s both` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 9, padding: "2px 7px", background: (CATEGORY_COLORS[t.category] || "#888") + "20", color: CATEGORY_COLORS[t.category] || "#888", borderRadius: 2 }}>{t.category.toUpperCase()}</span>
                    <span style={{ fontSize: 12, color: "#c8d3e0" }}>{t.topic}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, color: "#4a5568" }}>{t.articles} articles</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: t.heat > 89 ? "#e63946" : t.heat > 79 ? "#f4a261" : "#ffd166" }}>{t.heat}</span>
                  </div>
                </div>
                <ImpactBar value={t.heat} max={100} color={t.heat > 89 ? "#e63946" : t.heat > 79 ? "#f4a261" : "#ffd166"} />
              </div>
            ))}
          </div>

          {/* Country Watch */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 11, color: "#fff", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
              🗺️ Country Watch
            </div>
            {COUNTRY_WATCH.map((c, i) => (
              <div key={i} className="country-row" style={{
                padding: "10px 10px", borderRadius: 4, marginBottom: 4,
                border: "1px solid transparent", animation: `fadeInUp 0.4s ease ${i * 0.05}s both`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{c.flag}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>{c.country}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 9, color: "#4a5568" }}>{c.articles} articles</span>
                        <span style={{ fontSize: 9, padding: "1px 7px", background: ALERT_COLORS[c.alert] + "20", color: ALERT_COLORS[c.alert], borderRadius: 2, letterSpacing: 1 }}>
                          {c.alert.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: "#4a6080", marginTop: 2 }}>{c.status}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Event Timeline */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 11, color: "#fff", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
              📅 Global Event Timeline
            </div>
            <div style={{ position: "relative", paddingLeft: 24 }}>
              <div style={{ position: "absolute", left: 7, top: 0, bottom: 0, width: 1, background: "#1a2030" }} />
              {TIMELINE_EVENTS.map((e, i) => (
                <div key={i} style={{ position: "relative", marginBottom: 14, animation: `fadeInUp 0.4s ease ${i * 0.06}s both` }}>
                  <div style={{
                    position: "absolute", left: -20, top: 3, width: 8, height: 8, borderRadius: "50%",
                    background: e.type === "War" ? "#e63946" : e.type === "Military" ? "#f4a261" : "#8338ec",
                    border: "2px solid #070b12",
                  }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 10, color: "#e63946", fontWeight: 700 }}>{e.year}</span>
                    <span style={{ fontSize: 9, padding: "1px 6px", background: "#1a2030", color: "#4a6080", borderRadius: 2 }}>{e.type}</span>
                    <span style={{ fontSize: 9, color: "#4a5568" }}>{e.country}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#c8d3e0" }}>{e.event}</div>
                  <div style={{ fontSize: 9, color: "#8338ec", marginTop: 2 }}>Pattern: {e.pattern}</div>
                </div>
              ))}
              <div style={{ paddingLeft: 4 }}>
                <div style={{ fontSize: 10, color: "#4a5568", fontStyle: "italic" }}>← Scroll to see full archive (3,891 events)</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 4: Topic Bar Chart + Recent Research Entries ── */}
        <div className="grid-wide" style={{ marginBottom: 28 }}>
          {/* Articles by Topic Chart */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 11, color: "#fff", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
              📊 Research Coverage by Topic
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={TOPIC_HEAT} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" tick={{ fill: "#4a5568", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="topic" tick={{ fill: "#8a9ab5", fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
                <Tooltip contentStyle={{ background: "#0d1320", border: "1px solid #1a2030", fontSize: 11 }} />
                <Bar dataKey="articles" radius={[0, 3, 3, 0]} name="Articles">
                  {TOPIC_HEAT.map((entry, i) => (
                    <Cell key={i} fill={CATEGORY_COLORS[entry.category] || "#e63946"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Research Queue */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 11, color: "#fff", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
              🔴 Latest Research Published
            </div>
            {[
              { title: "Sudan War: The Gold Mine Nobody Talks About", time: "2h ago", tag: "Africa", score: 8.7, color: "#e63946" },
              { title: "IMF Loan Trap: Pakistan Follows the Script", time: "5h ago", tag: "Economic", score: 8.2, color: "#f4a261" },
              { title: "Who Owns the 'Independent' Fact Checkers?", time: "8h ago", tag: "Narrative", score: 7.9, color: "#2a9d8f" },
              { title: "Dollar vs Yuan: India's Strategic Silence", time: "12h ago", tag: "India", score: 9.1, color: "#06d6a0" },
              { title: "The Color Revolution Playbook — 2025 Edition", time: "1d ago", tag: "Pattern", score: 9.4, color: "#8338ec" },
              { title: "Gaza Reconstruction: War Profits Already Flowing", time: "1d ago", tag: "Middle East", score: 8.8, color: "#fb8500" },
            ].map((r, i) => (
              <div key={i} style={{
                padding: "10px 0", borderBottom: "1px solid #0d1320",
                animation: `fadeInUp 0.4s ease ${i * 0.06}s both`,
                cursor: "pointer",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: "#c8d3e0", lineHeight: 1.4, marginBottom: 5 }}>{r.title}</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 9, padding: "1px 7px", background: r.color + "20", color: r.color, borderRadius: 2 }}>{r.tag}</span>
                      <span style={{ fontSize: 9, color: "#4a5568" }}>{r.time}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 16, color: r.color, fontWeight: 700 }}>{r.score}</div>
                    <div style={{ fontSize: 8, color: "#4a5568" }}>IMPACT</div>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 12, padding: "8px 0", textAlign: "center" }}>
              <span style={{ fontSize: 10, color: "#e63946", letterSpacing: 2, cursor: "pointer" }}>VIEW ALL RESEARCH →</span>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ borderTop: "1px solid #1a2030", paddingTop: 16, paddingBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 10, color: "#2a3545" }}>© PatternFile Intelligence Research Platform • All analysis based on publicly available sources</div>
          <div style={{ display: "flex", gap: 16 }}>
            {["Sources", "Methodology", "API", "About"].map(l => (
              <span key={l} style={{ fontSize: 10, color: "#2a3545", cursor: "pointer" }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
