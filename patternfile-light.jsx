import { useState, useEffect } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

/* ─── Google Fonts injected via style tag ─────────────────────────────────── */
const FONT_LINK = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Source+Serif+4:opsz,wght@8..60,300;8..60,400;8..60,600&family=DM+Sans:wght@300;400;500;600&display=swap";

/* ─── Data ────────────────────────────────────────────────────────────────── */
const CONFLICTS = [
  { name: "Gaza–Israel", region: "Middle East", days: 596, intensity: 9.5, tag: "CRITICAL" },
  { name: "Russia–Ukraine", region: "Europe",      days: 1184, intensity: 9.2, tag: "CRITICAL" },
  { name: "Sudan Civil War", region: "Africa",     days: 398,  intensity: 8.1, tag: "ACTIVE"   },
  { name: "Myanmar Junta",   region: "Asia",       days: 1180, intensity: 7.8, tag: "ACTIVE"   },
];

const FEATURED = [
  {
    id: 1,
    category: "DEEP STATE",
    title: "The Color Revolution Playbook: 14 Countries, One Script",
    excerpt: "From Kyiv to Caracas, the same NGO networks, the same social media surge, the same outcome. We mapped every instance since 2000 — and the pattern is unmistakable.",
    author: "PatternFile Research",
    date: "May 23, 2026",
    readTime: "14 min",
    impact: 9.4,
    countries: ["Ukraine", "Venezuela", "Georgia", "Belarus"],
    accent: "#c1121f",
  },
  {
    id: 2,
    category: "ECONOMIC WARFARE",
    title: "The IMF Loan Trap: How 40 Nations Lost Their Sovereignty",
    excerpt: "Pakistan, Sri Lanka, Ghana, Argentina — all followed the same path. We follow the money from Washington to local austerity riots.",
    author: "PatternFile Research",
    date: "May 22, 2026",
    readTime: "18 min",
    impact: 9.1,
    countries: ["Pakistan", "Sri Lanka", "Argentina"],
    accent: "#1d3557",
  },
  {
    id: 3,
    category: "INDIA ANGLE",
    title: "India's Strategic Silence on the Dollar–Yuan War Is Not Neutral",
    excerpt: "While the world watches India walk a tightrope between the US and China, the real story is what India is quietly building underneath.",
    author: "PatternFile Research",
    date: "May 21, 2026",
    readTime: "12 min",
    impact: 8.9,
    countries: ["India", "China", "USA"],
    accent: "#2d6a4f",
  },
];

const RECENT = [
  { cat: "MEDIA BIAS",    title: "Who Funds the 'Independent' Fact-Checkers?",            time: "2h ago",  impact: 7.9 },
  { cat: "AFRICA",        title: "Sudan's Gold War: The Resource Nobody Mentions",          time: "5h ago",  impact: 8.2 },
  { cat: "MIDDLE EAST",   title: "Gaza Reconstruction: War Profits Already Flowing",        time: "8h ago",  impact: 8.8 },
  { cat: "POWER",         title: "The NGO Funding Trail in South Asia — Documented",        time: "11h ago", impact: 8.0 },
  { cat: "SANCTIONS",     title: "How Russia Bypassed SWIFT: The 18-Month Blueprint",       time: "1d ago",  impact: 8.5 },
  { cat: "ARMS TRADE",    title: "Weapons to Both Sides: $847B in 2024 — The Full Map",     time: "1d ago",  impact: 9.0 },
];

const TOPICS = [
  { name: "Deep State",        count: 142, pct: 94, color: "#c1121f" },
  { name: "India Geopolitics", count: 112, pct: 91, color: "#2d6a4f" },
  { name: "Sanctions Wars",    count: 98,  pct: 88, color: "#1d3557" },
  { name: "Media Bias",        count: 87,  pct: 85, color: "#6a4c93" },
  { name: "Dollar Decline",    count: 76,  pct: 82, color: "#d4a017" },
  { name: "Color Revolutions", count: 65,  pct: 79, color: "#c1121f" },
];

const GROWTH = [
  { m: "Oct", a: 42 }, { m: "Nov", a: 67 }, { m: "Dec", a: 89 },
  { m: "Jan", a: 124 }, { m: "Feb", a: 156 }, { m: "Mar", a: 198 },
  { m: "Apr", a: 234 }, { m: "May", a: 267 },
];

const COUNTRIES = [
  { flag: "🇺🇸", name: "United States", status: "Trade Wars + Election Cycle",   alert: "HIGH",     articles: 234 },
  { flag: "🇨🇳", name: "China",          status: "Taiwan + BRI Debt Trap",         alert: "HIGH",     articles: 198 },
  { flag: "🇷🇺", name: "Russia",         status: "Ukraine War + Sanctions",        alert: "CRITICAL", articles: 187 },
  { flag: "🇮🇳", name: "India",          status: "Strategic Realignment",          alert: "WATCH",    articles: 156 },
  { flag: "🇮🇷", name: "Iran",           status: "Nuclear Deal + Proxy Networks",  alert: "HIGH",     articles: 134 },
  { flag: "🇵🇰", name: "Pakistan",       status: "Economic Collapse + IMF",        alert: "HIGH",     articles: 98  },
];

const ALERT_STYLE = {
  CRITICAL: { bg: "#fde8e8", color: "#c1121f", border: "#f5c6c6" },
  HIGH:     { bg: "#fff3e0", color: "#b45309", border: "#fcd9a0" },
  WATCH:    { bg: "#e8f4f0", color: "#2d6a4f", border: "#b7ddd1" },
};

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const Tag = ({ label, bg = "#f1f3f5", color = "#495057", border = "#dee2e6" }) => (
  <span style={{ fontSize: 10, fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
    letterSpacing: "0.12em", padding: "3px 10px", borderRadius: 3,
    background: bg, color, border: `1px solid ${border}` }}>
    {label}
  </span>
);

const ImpactRing = ({ value }) => {
  const col = value >= 9 ? "#c1121f" : value >= 8 ? "#b45309" : "#2d6a4f";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <div style={{ fontSize: 20, fontFamily: "'Playfair Display', serif", fontWeight: 900, color: col, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 8, letterSpacing: "0.15em", color: "#adb5bd", fontFamily: "'DM Sans', sans-serif" }}>IMPACT</div>
    </div>
  );
};

const Divider = ({ style }) => <div style={{ height: 1, background: "#e9ecef", ...style }} />;

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function App() {
  const [time, setTime] = useState(new Date());
  const [ticker, setTicker] = useState(0);
  const TICKERS = [
    "Sudan ceasefire talks collapse — Day 398 of civil war",
    "Russia expands Black Sea blockade — grain prices up 12%",
    "14 countries match identical Color Revolution pattern — new research",
    "India quietly increases gold reserves — third consecutive month",
    "Pakistan IMF loan #23 approved — same conditions, same outcome predicted",
  ];

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setTicker(p => (p + 1) % TICKERS.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: "#f8f5f0", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#212529" }}>
      <link rel="stylesheet" href={FONT_LINK} />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes tickIn { from{opacity:0;transform:translateX(10px)} to{opacity:1;transform:translateX(0)} }
        .card { background: #fff; border: 1px solid #e9ecef; border-radius: 6px; }
        .hover-lift { transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
        .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.10); }
        .link-red { color: #c1121f; text-decoration: none; cursor: pointer; }
        .link-red:hover { text-decoration: underline; }
        a { color: inherit; text-decoration: none; }
      `}</style>

      {/* ── TOP BAR ─────────────────────────────────────────────────────── */}
      <div style={{ background: "#1d2433", color: "#adb5bd", fontSize: 11,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "7px 40px", letterSpacing: "0.08em", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ display: "flex", gap: 24 }}>
          {["Research", "Countries", "Timeline", "Topics", "Patterns", "Data"].map(l => (
            <span key={l} style={{ cursor: "pointer", color: "#8a9bb5" }}
              onMouseEnter={e => e.target.style.color="#fff"}
              onMouseLeave={e => e.target.style.color="#8a9bb5"}>{l}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <span style={{ color: "#c1121f", fontWeight: 600 }}>
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%",
              background: "#c1121f", marginRight: 6, animation: "none" }} />
            LIVE
          </span>
          <span>{time.toUTCString().slice(0, 25)} UTC</span>
        </div>
      </div>

      {/* ── MASTHEAD ────────────────────────────────────────────────────── */}
      <div style={{ background: "#fff", borderBottom: "3px solid #1d2433", padding: "0 40px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            padding: "22px 0 18px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 5, height: 52, background: "#c1121f", borderRadius: 2 }} />
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 38,
                    fontWeight: 900, color: "#1d2433", lineHeight: 1, letterSpacing: "-0.02em" }}>
                    PatternFile
                  </div>
                  <div style={{ fontSize: 11, letterSpacing: "0.22em", color: "#6c757d",
                    marginTop: 5, fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase" }}>
                    Geopolitical Intelligence & Research
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ padding: "8px 20px", background: "#f8f9fa", border: "1px solid #dee2e6",
                borderRadius: 4, fontSize: 12, cursor: "pointer" }}>
                Search Archive
              </div>
              <div style={{ padding: "8px 20px", background: "#c1121f", color: "#fff",
                borderRadius: 4, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                Subscribe — Free
              </div>
            </div>
          </div>

          {/* Ticker */}
          <div style={{ display: "flex", alignItems: "center", gap: 14,
            borderTop: "1px solid #e9ecef", padding: "9px 0", overflow: "hidden" }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: "#fff",
              background: "#c1121f", padding: "3px 10px", borderRadius: 2, whiteSpace: "nowrap" }}>
              LATEST
            </span>
            <span style={{ fontSize: 12, color: "#495057", animation: "tickIn 0.5s ease" }} key={ticker}>
              {TICKERS[ticker]}
            </span>
          </div>
        </div>
      </div>

      {/* ── MAIN ────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "32px 40px" }}>

        {/* ── STAT STRIP ─────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 32 }}>
          {[
            { n: "6",      label: "Active Conflicts",    sub: "globally", color: "#c1121f" },
            { n: "87",     label: "Countries Tracked",   sub: "in archive", color: "#1d3557" },
            { n: "1,247",  label: "Research Articles",   sub: "published", color: "#2d6a4f" },
            { n: "52",     label: "Patterns Identified", sub: "recurring", color: "#6a4c93" },
            { n: "14,203", label: "Dots Connected",      sub: "cross-references", color: "#b45309" },
          ].map((s, i) => (
            <div key={i} className="card hover-lift" style={{
              padding: "18px 20px", borderTop: `3px solid ${s.color}`,
              animation: `fadeUp 0.4s ease ${i * 0.07}s both` }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28,
                fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#343a40",
                marginTop: 6, letterSpacing: "0.04em" }}>{s.label}</div>
              <div style={{ fontSize: 10, color: "#adb5bd", marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── FEATURED + SIDEBAR ──────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 28, marginBottom: 32 }}>

          {/* Featured Articles */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 3, height: 18, background: "#c1121f", borderRadius: 2 }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em",
                color: "#495057", textTransform: "uppercase" }}>Featured Research</span>
            </div>

            {/* Hero Article */}
            <div className="card hover-lift" style={{ marginBottom: 16, overflow: "hidden",
              animation: "fadeUp 0.5s ease 0.1s both" }}>
              {/* Accent stripe */}
              <div style={{ height: 4, background: `linear-gradient(90deg, ${FEATURED[0].accent}, ${FEATURED[0].accent}88)` }} />
              <div style={{ padding: "28px 32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1, paddingRight: 24 }}>
                    <div style={{ marginBottom: 12 }}>
                      <Tag label={FEATURED[0].category} bg="#fde8e8" color="#c1121f" border="#f5c6c6" />
                    </div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26,
                      fontWeight: 900, color: "#1d2433", lineHeight: 1.3,
                      marginBottom: 14, letterSpacing: "-0.01em" }}>
                      {FEATURED[0].title}
                    </h2>
                    <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 15,
                      color: "#495057", lineHeight: 1.75, marginBottom: 20 }}>
                      {FEATURED[0].excerpt}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, color: "#6c757d" }}>{FEATURED[0].date}</span>
                      <span style={{ color: "#dee2e6" }}>·</span>
                      <span style={{ fontSize: 11, color: "#6c757d" }}>{FEATURED[0].readTime} read</span>
                      <span style={{ color: "#dee2e6" }}>·</span>
                      {FEATURED[0].countries.map(c => (
                        <span key={c} style={{ fontSize: 10, color: "#adb5bd",
                          background: "#f8f9fa", padding: "2px 8px", borderRadius: 2,
                          border: "1px solid #dee2e6" }}>{c}</span>
                      ))}
                    </div>
                  </div>
                  <ImpactRing value={FEATURED[0].impact} />
                </div>
              </div>
            </div>

            {/* 2-col grid for next 2 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {FEATURED.slice(1).map((a, i) => (
                <div key={a.id} className="card hover-lift" style={{
                  overflow: "hidden", animation: `fadeUp 0.5s ease ${0.2 + i * 0.1}s both` }}>
                  <div style={{ height: 3, background: a.accent }} />
                  <div style={{ padding: "20px 22px" }}>
                    <Tag label={a.category}
                      bg={a.accent === "#1d3557" ? "#e8edf5" : "#e8f4f0"}
                      color={a.accent}
                      border={a.accent === "#1d3557" ? "#c5d3e8" : "#b7ddd1"} />
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17,
                      fontWeight: 700, color: "#1d2433", lineHeight: 1.4,
                      margin: "12px 0 10px" }}>{a.title}</h3>
                    <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13,
                      color: "#6c757d", lineHeight: 1.65, marginBottom: 14 }}>
                      {a.excerpt.slice(0, 100)}…
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 10, color: "#adb5bd" }}>{a.date} · {a.readTime}</span>
                      <ImpactRing value={a.impact} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Conflicts */}
            <div className="card" style={{ padding: 20, animation: "fadeUp 0.5s ease 0.15s both" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%",
                  background: "#c1121f", boxShadow: "0 0 0 3px #fde8e8" }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em",
                  color: "#495057", textTransform: "uppercase" }}>Live Conflict Tracker</span>
              </div>
              {CONFLICTS.map((c, i) => (
                <div key={i} style={{ padding: "10px 0",
                  borderBottom: i < CONFLICTS.length - 1 ? "1px solid #f1f3f5" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#212529" }}>{c.name}</span>
                    <Tag label={c.tag}
                      bg={c.tag === "CRITICAL" ? "#fde8e8" : "#fff3e0"}
                      color={c.tag === "CRITICAL" ? "#c1121f" : "#b45309"}
                      border={c.tag === "CRITICAL" ? "#f5c6c6" : "#fcd9a0"} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "#6c757d" }}>Day {c.days.toLocaleString()}</span>
                    <span style={{ fontSize: 11, color: "#6c757d" }}>Intensity {c.intensity}/10</span>
                  </div>
                  <div style={{ height: 3, background: "#f1f3f5", borderRadius: 2, marginTop: 7 }}>
                    <div style={{ height: "100%", borderRadius: 2,
                      width: `${(c.intensity / 10) * 100}%`,
                      background: c.tag === "CRITICAL" ? "#c1121f" : "#b45309" }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Topic Heat */}
            <div className="card" style={{ padding: 20, animation: "fadeUp 0.5s ease 0.2s both" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em",
                color: "#495057", textTransform: "uppercase", marginBottom: 16 }}>
                Topic Heat Index
              </div>
              {TOPICS.map((t, i) => (
                <div key={i} style={{ marginBottom: 11 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: "#343a40" }}>{t.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: t.color }}>{t.count}</span>
                  </div>
                  <div style={{ height: 4, background: "#f1f3f5", borderRadius: 2 }}>
                    <div style={{ height: "100%", borderRadius: 2,
                      width: `${t.pct}%`, background: t.color, opacity: 0.85 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Archive Growth mini-chart */}
            <div className="card" style={{ padding: 20, animation: "fadeUp 0.5s ease 0.25s both" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em",
                color: "#495057", textTransform: "uppercase", marginBottom: 14 }}>
                Archive Growth
              </div>
              <ResponsiveContainer width="100%" height={100}>
                <AreaChart data={GROWTH} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="10%" stopColor="#c1121f" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#c1121f" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="m" tick={{ fill: "#adb5bd", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#adb5bd", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #dee2e6",
                    borderRadius: 4, fontSize: 11 }} />
                  <Area type="monotone" dataKey="a" stroke="#c1121f" fill="url(#ag)" strokeWidth={2} name="Articles" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <Divider style={{ marginBottom: 32 }} />

        {/* ── LATEST RESEARCH + COUNTRIES ────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 28, marginBottom: 32 }}>

          {/* Latest */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 3, height: 18, background: "#1d3557", borderRadius: 2 }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em",
                color: "#495057", textTransform: "uppercase" }}>Latest Research</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {RECENT.map((r, i) => (
                <div key={i} className="card hover-lift" style={{
                  padding: "18px 20px",
                  animation: `fadeUp 0.4s ease ${i * 0.06}s both` }}>
                  <div style={{ marginBottom: 10 }}>
                    <Tag label={r.cat} />
                  </div>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 15,
                    fontWeight: 700, color: "#1d2433", lineHeight: 1.45,
                    marginBottom: 12 }}>{r.title}</h4>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 10, color: "#adb5bd" }}>{r.time}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 10, color: "#adb5bd" }}>Impact</span>
                      <span style={{ fontSize: 13, fontWeight: 700,
                        color: r.impact >= 8.5 ? "#c1121f" : "#b45309",
                        fontFamily: "'Playfair Display', serif" }}>{r.impact}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Countries */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 3, height: 18, background: "#2d6a4f", borderRadius: 2 }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em",
                color: "#495057", textTransform: "uppercase" }}>Country Watch</span>
            </div>
            <div className="card" style={{ overflow: "hidden" }}>
              {COUNTRIES.map((c, i) => {
                const as = ALERT_STYLE[c.alert] || ALERT_STYLE.WATCH;
                return (
                  <div key={i} className="hover-lift" style={{
                    padding: "14px 20px",
                    borderBottom: i < COUNTRIES.length - 1 ? "1px solid #f1f3f5" : "none",
                    cursor: "pointer", transition: "background 0.15s",
                    animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8f9fa"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 22 }}>{c.flag}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#212529" }}>{c.name}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 10, color: "#adb5bd" }}>{c.articles} articles</span>
                            <Tag label={c.alert} bg={as.bg} color={as.color} border={as.border} />
                          </div>
                        </div>
                        <div style={{ fontSize: 11, color: "#6c757d", marginTop: 3 }}>{c.status}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── SEO KEYWORD STRIP ───────────────────────────────────────── */}
        <div className="card" style={{ padding: "20px 28px", marginBottom: 32,
          borderLeft: "4px solid #1d3557" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em",
              color: "#1d3557", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              Explore by Topic →
            </span>
            {["Deep State", "Color Revolution", "IMF Debt Trap", "Arms Trade", "Proxy Wars",
              "Dollar Decline", "NGO Funding", "Media Bias", "India Geopolitics",
              "Sanction Warfare", "Regime Change", "Resource Wars"].map(k => (
              <span key={k} style={{ fontSize: 12, padding: "5px 14px",
                background: "#f1f3f5", border: "1px solid #dee2e6", borderRadius: 4,
                cursor: "pointer", color: "#495057", transition: "all 0.15s" }}
                onMouseEnter={e => { e.target.style.background="#1d3557"; e.target.style.color="#fff"; e.target.style.borderColor="#1d3557"; }}
                onMouseLeave={e => { e.target.style.background="#f1f3f5"; e.target.style.color="#495057"; e.target.style.borderColor="#dee2e6"; }}>
                {k}
              </span>
            ))}
          </div>
        </div>

        {/* ── FOOTER ──────────────────────────────────────────────────── */}
        <div style={{ borderTop: "2px solid #1d2433", paddingTop: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 32, marginBottom: 28 }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22,
                fontWeight: 900, color: "#1d2433", marginBottom: 10 }}>PatternFile</div>
              <p style={{ fontSize: 12, color: "#6c757d", lineHeight: 1.7, maxWidth: 280 }}>
                Independent geopolitical research platform. We connect dots mainstream media ignores — using public data, OSINT, and historical pattern analysis.
              </p>
            </div>
            {[
              { head: "Research", links: ["Deep State", "Economic Warfare", "Proxy Wars", "Media Bias"] },
              { head: "Regions",  links: ["Middle East", "South Asia", "Africa", "Americas"] },
              { head: "Platform", links: ["About", "Methodology", "Data Sources", "Subscribe"] },
            ].map(col => (
              <div key={col.head}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em",
                  color: "#343a40", textTransform: "uppercase", marginBottom: 12 }}>{col.head}</div>
                {col.links.map(l => (
                  <div key={l} style={{ fontSize: 12, color: "#6c757d", marginBottom: 8,
                    cursor: "pointer" }}
                    onMouseEnter={e => e.target.style.color="#c1121f"}
                    onMouseLeave={e => e.target.style.color="#6c757d"}>{l}</div>
                ))}
              </div>
            ))}
          </div>
          <Divider />
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 16,
            fontSize: 11, color: "#adb5bd" }}>
            <span>© 2026 PatternFile · All analysis based on publicly available sources</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </div>
    </div>
  );
}
