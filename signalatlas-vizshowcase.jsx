import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, ScatterChart, Scatter, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, Treemap, FunnelChart, Funnel, LabelList,
} from "recharts";

const FONTS = "https://fonts.googleapis.com/css2?family=Fraunces:wght@700;900&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";

/* ── Palette ── */
const P = {
  navy: "#1a3a5c", red: "#c1121f", amber: "#b45309",
  green: "#1e4d3b", purple: "#6b21a8", teal: "#0d7490",
  slate: "#374151", light: "#f8f7f4",
};
const COLORS = [P.navy, P.red, P.amber, P.green, P.purple, P.teal];

/* ── Sample Datasets ── */
const armsData = [
  { country: "USA", value: 238, share: 42 },
  { country: "Russia", value: 97, share: 17 },
  { country: "France", value: 56, share: 10 },
  { country: "China", value: 51, share: 9 },
  { country: "Germany", value: 34, share: 6 },
  { country: "Others", value: 91, share: 16 },
];

const sanctionsTimeline = [
  { year: "2018", Russia: 42, Iran: 89, Venezuela: 23, China: 5 },
  { year: "2019", Russia: 58, Iran: 112, Venezuela: 67, China: 12 },
  { year: "2020", Russia: 63, Iran: 145, Venezuela: 89, China: 28 },
  { year: "2021", Russia: 71, Iran: 167, Venezuela: 94, China: 45 },
  { year: "2022", Russia: 198, Iran: 178, Venezuela: 98, China: 67 },
  { year: "2023", Russia: 234, Iran: 189, Venezuela: 103, China: 89 },
  { year: "2024", Russia: 267, Iran: 201, Venezuela: 108, China: 112 },
];

const mediaRadar = [
  { axis: "Conflict Coverage", BBC: 85, RT: 60, AlJazeera: 75 },
  { axis: "Economic Impact", BBC: 45, RT: 78, AlJazeera: 65 },
  { axis: "Civilian Stories", BBC: 60, RT: 40, AlJazeera: 80 },
  { axis: "Govt Narrative", BBC: 70, RT: 85, AlJazeera: 55 },
  { axis: "Aid Coverage", BBC: 55, RT: 35, AlJazeera: 82 },
  { axis: "Historical Context", BBC: 40, RT: 65, AlJazeera: 70 },
];

const gdpShock = [
  { m: "Jan", before: 4.2, after: 4.1 },
  { m: "Feb", before: 4.3, after: 3.8 },
  { m: "Mar", before: 4.1, after: 2.9, event: "Sanctions" },
  { m: "Apr", before: 4.4, after: 1.2 },
  { m: "May", before: 4.2, after: -0.8 },
  { m: "Jun", before: 4.3, after: -2.1 },
  { m: "Jul", before: 4.5, after: -1.4 },
  { m: "Aug", before: 4.4, after: 0.3 },
];

const conflictScatter = [
  { x: 45, y: 78, z: 120, name: "Ukraine" },
  { x: 82, y: 92, z: 200, name: "Gaza" },
  { x: 34, y: 45, z: 80, name: "Sudan" },
  { x: 56, y: 67, z: 95, name: "Myanmar" },
  { x: 23, y: 34, z: 50, name: "Haiti" },
  { x: 67, y: 55, z: 110, name: "Sahel" },
];

const fundingFlow = [
  { name: "Stage 1: Foundation Grant", value: 100, fill: P.navy },
  { name: "Stage 2: Local NGO", value: 80, fill: P.teal },
  { name: "Stage 3: Media Org", value: 60, fill: P.amber },
  { name: "Stage 4: Protest Network", value: 40, fill: P.red },
];

const treemapData = [
  { name: "USA", size: 238, color: P.navy },
  { name: "Russia", size: 97, color: P.red },
  { name: "France", size: 56, color: P.amber },
  { name: "China", size: 51, color: P.green },
  { name: "Germany", size: 34, color: P.purple },
  { name: "UK", size: 28, color: P.teal },
  { name: "Israel", size: 22, color: "#7c1d1d" },
  { name: "Italy", size: 18, color: "#0f4c75" },
];

const heatmapData = {
  rows: ["India", "China", "Russia", "USA", "EU", "Africa"],
  cols: ["Oil", "Arms", "Food", "Finance", "Tech"],
  values: [
    [78, 45, 89, 34, 56],
    [92, 67, 45, 78, 89],
    [56, 89, 67, 45, 23],
    [34, 78, 56, 92, 95],
    [67, 34, 78, 89, 87],
    [45, 23, 92, 34, 28],
  ],
};

const graphNodes = [
  { id: 0, label: "Russia\nSanctions", x: 120, y: 100, r: 42, color: P.red },
  { id: 1, label: "Oil\nTrade",        x: 280, y: 70,  r: 35, color: P.amber },
  { id: 2, label: "India\nImports",   x: 420, y: 110, r: 30, color: P.green },
  { id: 3, label: "USD\nPressure",    x: 240, y: 200, r: 28, color: P.navy },
  { id: 4, label: "Fuel\nPrices",     x: 370, y: 215, r: 25, color: "#7c3d12" },
  { id: 5, label: "Inflation",        x: 490, y: 175, r: 22, color: P.purple },
  { id: 6, label: "BRICS\nTalks",     x: 120, y: 215, r: 24, color: P.teal },
];
const graphEdges = [
  { s: 0, t: 1, w: 92 }, { s: 1, t: 2, w: 78 }, { s: 0, t: 3, w: 85 },
  { s: 2, t: 4, w: 67 }, { s: 4, t: 5, w: 61 }, { s: 3, t: 4, w: 55 },
  { s: 0, t: 6, w: 70 }, { s: 6, t: 3, w: 48 }, { s: 1, t: 3, w: 60 },
];

/* ── Helpers ── */
const SectionHead = ({ num, title, desc }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: P.navy,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 700, color: "#fff",
        fontFamily: "'JetBrains Mono',monospace" }}>{num}</div>
      <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 900,
        color: P.navy, margin: 0 }}>{title}</h2>
    </div>
    <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 0 44px",
      fontFamily: "'Instrument Sans',sans-serif", lineHeight: 1.6 }}>{desc}</p>
  </div>
);

const Card = ({ children, style }) => (
  <div style={{ background: "#fff", border: "1px solid #e5e7eb",
    borderRadius: 8, padding: 20, ...style }}>{children}</div>
);

const ChartTitle = ({ label, tag }) => (
  <div style={{ display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: 14 }}>
    <span style={{ fontSize: 12, fontWeight: 700, color: P.slate,
      fontFamily: "'Instrument Sans',sans-serif", letterSpacing: "0.05em" }}>{label}</span>
    {tag && <span style={{ fontSize: 9, padding: "2px 8px", background: "#eff6ff",
      color: P.navy, border: "1px solid #bfdbfe", borderRadius: 3,
      fontFamily: "'JetBrains Mono',monospace" }}>{tag}</span>}
  </div>
);

const CustomTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 6,
      padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      fontFamily: "'Instrument Sans',sans-serif" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: P.slate, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 11, color: p.color, marginBottom: 2 }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

/* ── Relationship Graph ── */
const RelGraph = () => {
  const [hov, setHov] = useState(null);
  return (
    <svg width="100%" viewBox="0 0 620 300" style={{ fontFamily: "'Instrument Sans',sans-serif" }}>
      {graphEdges.map((e, i) => {
        const s = graphNodes[e.s], t = graphNodes[e.t];
        const active = hov === e.s || hov === e.t;
        const mx = (s.x + t.x) / 2, my = (s.y + t.y) / 2;
        return (
          <g key={i}>
            <line x1={s.x} y1={s.y} x2={t.x} y2={t.y}
              stroke={active ? P.navy : "#d1d5db"}
              strokeWidth={active ? 2.5 : 1.5}
              strokeDasharray={active ? "none" : "4 3"}
              opacity={active ? 1 : 0.5} />
            {active && (
              <g>
                <rect x={mx - 16} y={my - 9} width={32} height={16}
                  rx={3} fill="#fff" stroke={P.navy} strokeWidth={1} />
                <text x={mx} y={my + 4} textAnchor="middle"
                  fontSize={9} fill={P.navy} fontWeight={600}>{e.w}%</text>
              </g>
            )}
          </g>
        );
      })}
      {graphNodes.map((n, i) => (
        <g key={i} style={{ cursor: "pointer" }}
          onMouseEnter={() => setHov(i)}
          onMouseLeave={() => setHov(null)}>
          <circle cx={n.x} cy={n.y} r={hov === i ? n.r + 5 : n.r}
            fill={hov === i ? n.color : "#fff"}
            stroke={n.color} strokeWidth={hov === i ? 2.5 : 1.5}
            style={{ transition: "all 0.2s", filter: hov === i ? `drop-shadow(0 0 8px ${n.color}60)` : "none" }} />
          {n.label.split("\n").map((word, wi) => (
            <text key={wi} x={n.x} y={n.y + (wi === 0 ? (n.label.includes("\n") ? -5 : 4) : 9)}
              textAnchor="middle" fontSize={hov === i ? 10 : 9}
              fill={hov === i ? "#fff" : n.color}
              fontWeight={700} style={{ pointerEvents: "none" }}>{word}</text>
          ))}
        </g>
      ))}
    </svg>
  );
};

/* ── Heat Map ── */
const HeatMap = () => {
  const [hov, setHov] = useState(null);
  const max = Math.max(...heatmapData.values.flat());
  const getColor = (v) => {
    const t = v / max;
    if (t > 0.8) return { bg: "#7c1d1d", text: "#fff" };
    if (t > 0.6) return { bg: "#c1121f", text: "#fff" };
    if (t > 0.4) return { bg: "#f87171", text: "#fff" };
    if (t > 0.2) return { bg: "#fca5a5", text: "#374151" };
    return { bg: "#fee2e2", text: "#374151" };
  };
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", width: "100%", fontFamily: "'JetBrains Mono',monospace" }}>
        <thead>
          <tr>
            <th style={{ padding: "6px 10px", fontSize: 10, color: "#9ca3af", textAlign: "left", fontWeight: 500 }}>Country</th>
            {heatmapData.cols.map(c => (
              <th key={c} style={{ padding: "6px 10px", fontSize: 10, color: "#9ca3af", fontWeight: 600, textAlign: "center" }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {heatmapData.rows.map((row, ri) => (
            <tr key={ri}>
              <td style={{ padding: "6px 10px", fontSize: 11, fontWeight: 700, color: P.slate,
                fontFamily: "'Instrument Sans',sans-serif" }}>{row}</td>
              {heatmapData.values[ri].map((v, ci) => {
                const { bg, text } = getColor(v);
                const isHov = hov?.r === ri && hov?.c === ci;
                return (
                  <td key={ci}
                    onMouseEnter={() => setHov({ r: ri, c: ci, v })}
                    onMouseLeave={() => setHov(null)}
                    style={{ padding: "6px 10px", textAlign: "center",
                      background: bg, color: text,
                      fontSize: 12, fontWeight: 600,
                      border: isHov ? `2px solid ${P.navy}` : "2px solid #fff",
                      cursor: "pointer",
                      transform: isHov ? "scale(1.05)" : "scale(1)",
                      transition: "all 0.15s", position: "relative",
                      borderRadius: 4 }}>
                    {v}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {hov && (
        <div style={{ marginTop: 8, fontSize: 11, color: "#6b7280",
          fontFamily: "'Instrument Sans',sans-serif" }}>
          📍 {heatmapData.rows[hov.r]} → {heatmapData.cols[hov.c]}: <strong style={{ color: P.navy }}>{hov.v} interactions</strong>
        </div>
      )}
    </div>
  );
};

/* ── Animated Counter ── */
const Counter = ({ target, label, color, prefix = "", suffix = "" }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = target / 60;
        const t = setInterval(() => {
          start += step;
          if (start >= target) { setVal(target); clearInterval(t); }
          else setVal(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return (
    <div ref={ref} style={{ textAlign: "center", padding: "20px 16px",
      background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8,
      borderTop: `3px solid ${color}` }}>
      <div style={{ fontFamily: "'Fraunces',serif", fontSize: 36,
        fontWeight: 900, color, lineHeight: 1 }}>
        {prefix}{val.toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize: 11, color: "#6b7280", marginTop: 6,
        fontFamily: "'Instrument Sans',sans-serif" }}>{label}</div>
    </div>
  );
};

/* ── Progress Bars Animated ── */
const ProgressBar = ({ label, value, max = 100, color }) => {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setTimeout(() => setWidth((value / max) * 100), 100);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, max]);
  return (
    <div ref={ref} style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: P.slate, fontFamily: "'Instrument Sans',sans-serif" }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: "'JetBrains Mono',monospace" }}>{value}%</span>
      </div>
      <div style={{ height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${width}%`, background: color,
          borderRadius: 3, transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
    </div>
  );
};

/* ── Timeline ── */
const Timeline = () => {
  const events = [
    { year: "2019", event: "Hong Kong Protests", type: "Political", pattern: "Protest Pattern", color: P.purple },
    { year: "2020", event: "Belarus Uprising", type: "Political", pattern: "Protest Pattern", color: P.purple },
    { year: "2021", event: "Myanmar Coup", type: "Military", pattern: "Regime Change", color: P.red },
    { year: "2022", event: "Ukraine War Begins", type: "War", pattern: "Proxy War", color: "#7c1d1d" },
    { year: "2023", event: "Niger Coup", type: "Military", pattern: "Anti-West Wave", color: P.amber },
    { year: "2024", event: "Venezuela Crisis", type: "Political", pattern: "Protest Pattern", color: P.purple },
    { year: "2025", event: "Haiti Collapse", type: "Conflict", pattern: "State Failure", color: P.red },
  ];
  return (
    <div style={{ position: "relative", paddingLeft: 32 }}>
      <div style={{ position: "absolute", left: 12, top: 0, bottom: 0,
        width: 2, background: "linear-gradient(to bottom, #e5e7eb, #1a3a5c, #e5e7eb)" }} />
      {events.map((e, i) => (
        <div key={i} style={{ position: "relative", marginBottom: 18,
          animation: `fadeUp 0.4s ease ${i * 0.06}s both` }}>
          <div style={{ position: "absolute", left: -26, top: 4, width: 12, height: 12,
            borderRadius: "50%", background: e.color,
            border: "2px solid #fff", boxShadow: `0 0 0 2px ${e.color}40` }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11,
              fontWeight: 700, color: e.color }}>{e.year}</span>
            <span style={{ fontSize: 9, padding: "2px 7px", background: e.color + "15",
              color: e.color, borderRadius: 2, fontWeight: 600,
              fontFamily: "'Instrument Sans',sans-serif" }}>{e.type}</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: P.slate,
            fontFamily: "'Fraunces',serif" }}>{e.event}</div>
          <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2,
            fontFamily: "'Instrument Sans',sans-serif" }}>Pattern: {e.pattern}</div>
        </div>
      ))}
    </div>
  );
};

/* ── Sankey-style Flow ── */
const FlowDiagram = () => {
  const flows = [
    { from: "Foundation (USA)", to: "Regional NGO", amount: "$42M", color: P.navy },
    { from: "Regional NGO", to: "Media Network", amount: "$18M", color: P.teal },
    { from: "Regional NGO", to: "Legal Org", amount: "$12M", color: P.teal },
    { from: "Media Network", to: "Protest Org", amount: "$8M", color: P.amber },
    { from: "Legal Org", to: "Protest Org", amount: "$5M", color: P.amber },
  ];
  const nodes = [
    { id: "Foundation (USA)", x: 20, y: 80, w: 140, h: 36, color: P.navy },
    { id: "Regional NGO", x: 220, y: 80, w: 120, h: 36, color: P.teal },
    { id: "Media Network", x: 410, y: 40, w: 120, h: 36, color: P.amber },
    { id: "Legal Org", x: 410, y: 120, w: 120, h: 36, color: P.amber },
    { id: "Protest Org", x: 590, y: 80, w: 110, h: 36, color: P.red },
  ];
  const arrows = [
    { x1: 160, y1: 98, x2: 220, y2: 98, label: "$42M" },
    { x1: 340, y1: 98, x2: 410, y2: 58, label: "$18M" },
    { x1: 340, y1: 98, x2: 410, y2: 138, label: "$12M" },
    { x1: 530, y1: 58, x2: 590, y2: 90, label: "$8M" },
    { x1: 530, y1: 138, x2: 590, y2: 106, label: "$5M" },
  ];
  return (
    <svg width="100%" viewBox="0 0 740 200" style={{ fontFamily: "'Instrument Sans',sans-serif" }}>
      <defs>
        <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={P.navy} />
        </marker>
      </defs>
      {arrows.map((a, i) => (
        <g key={i}>
          <line x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
            stroke={P.navy} strokeWidth={2} opacity={0.4}
            markerEnd="url(#arr)" />
          <text x={(a.x1 + a.x2) / 2} y={Math.min(a.y1, a.y2) - 5}
            textAnchor="middle" fontSize={9} fill={P.amber} fontWeight={700}>{a.label}</text>
        </g>
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <rect x={n.x} y={n.y - 18} width={n.w} height={n.h}
            rx={5} fill={n.color} opacity={0.9} />
          <text x={n.x + n.w / 2} y={n.y + 3} textAnchor="middle"
            fontSize={10} fill="#fff" fontWeight={600}>{n.id}</text>
        </g>
      ))}
    </svg>
  );
};

/* ── World Map Dot Grid ── */
const DotMap = () => {
  const hotspots = [
    { x: "52%", y: "35%", label: "Ukraine", color: P.red, size: 16 },
    { x: "58%", y: "50%", label: "Gaza", color: P.red, size: 14 },
    { x: "55%", y: "60%", label: "Sudan", color: P.amber, size: 12 },
    { x: "75%", y: "45%", label: "Myanmar", color: P.amber, size: 11 },
    { x: "72%", y: "38%", label: "China", color: P.navy, size: 10 },
    { x: "68%", y: "40%", label: "India", color: P.green, size: 10 },
    { x: "28%", y: "60%", label: "Venezuela", color: P.purple, size: 10 },
    { x: "25%", y: "65%", label: "Haiti", color: P.amber, size: 9 },
  ];
  return (
    <div style={{ position: "relative", background: "#f0f4f8",
      borderRadius: 8, overflow: "hidden", padding: 0 }}>
      <div style={{ height: 220, position: "relative",
        background: "linear-gradient(135deg, #dbeafe 0%, #e0f2fe 50%, #dcfce7 100%)" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.08,
          backgroundImage: "radial-gradient(circle, #1a3a5c 1px, transparent 1px)",
          backgroundSize: "18px 18px" }} />
        {hotspots.map((h, i) => (
          <div key={i} style={{ position: "absolute", left: h.x, top: h.y,
            transform: "translate(-50%,-50%)" }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: h.size, height: h.size, borderRadius: "50%",
                background: h.color, border: "2px solid #fff",
                boxShadow: `0 0 0 4px ${h.color}30`,
                animation: "pulse 2s ease-in-out infinite" }} />
              <div style={{ position: "absolute", top: -22, left: "50%",
                transform: "translateX(-50%)", whiteSpace: "nowrap",
                fontSize: 9, fontWeight: 700, color: h.color,
                background: "#fff", padding: "1px 5px", borderRadius: 3,
                border: `1px solid ${h.color}40`,
                fontFamily: "'Instrument Sans',sans-serif" }}>{h.label}</div>
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", bottom: 10, right: 12,
          display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[{ l: "Critical", c: P.red }, { l: "Active", c: P.amber },
            { l: "Watch", c: P.navy }, { l: "Strategic", c: P.green }].map(({ l, c }) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 4,
              background: "#ffffffcc", padding: "2px 8px", borderRadius: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />
              <span style={{ fontSize: 9, color: P.slate,
                fontFamily: "'Instrument Sans',sans-serif" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Comparison Table ── */
const CompareTable = () => {
  const rows = [
    { metric: "Sanctions Count", USA: 267, EU: 198, UK: 145, Other: 67 },
    { metric: "GDP Impact (%)", USA: -2.1, EU: -3.4, UK: -1.8, Other: -5.2 },
    { metric: "Trade Decline (%)", USA: -18, EU: -24, UK: -15, Other: -31 },
    { metric: "Energy Cost Rise", USA: "+34%", EU: "+89%", UK: "+56%", Other: "+112%" },
  ];
  return (
    <table style={{ width: "100%", borderCollapse: "collapse",
      fontFamily: "'Instrument Sans',sans-serif" }}>
      <thead>
        <tr style={{ background: P.navy }}>
          {["Metric", "USA", "EU", "UK", "Others"].map(h => (
            <th key={h} style={{ padding: "10px 14px", fontSize: 11, color: "#fff",
              fontWeight: 600, textAlign: h === "Metric" ? "left" : "center",
              letterSpacing: "0.05em" }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? "#f8f9fa" : "#fff" }}>
            <td style={{ padding: "10px 14px", fontSize: 12, fontWeight: 600, color: P.slate }}>{r.metric}</td>
            {[r.USA, r.EU, r.UK, r.Other].map((v, j) => (
              <td key={j} style={{ padding: "10px 14px", textAlign: "center",
                fontSize: 12, fontWeight: 700,
                color: typeof v === "number" && v < 0 ? P.red : P.navy,
                fontFamily: "'JetBrains Mono',monospace" }}>{v}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

/* ── Main ── */
export default function App() {
  const [activeViz, setActiveViz] = useState(null);
  const vizList = [
    "Area Charts", "Bar Charts", "Pie/Donut", "Line Charts",
    "Radar Chart", "Scatter Plot", "Treemap", "Heat Map",
    "Relationship Graph", "Animated Counters", "Timeline",
    "Flow Diagram", "Dot Map", "Funnel Chart", "Data Table",
    "Progress Bars",
  ];

  return (
    <div style={{ background: P.light, minHeight: "100vh", color: "#111827" }}>
      <link rel="stylesheet" href={FONTS} />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{box-shadow:0 0 0 4px rgba(193,18,31,0.2)}50%{box-shadow:0 0 0 8px rgba(193,18,31,0.05)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .lift:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,0.08);}
        .lift{transition:all 0.2s;cursor:pointer;}
      `}</style>

      {/* Nav */}
      <div style={{ background: P.navy, padding: "14px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 3, height: 24, background: P.red, borderRadius: 2 }} />
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 20,
            fontWeight: 900, color: "#fff" }}>Signal</span>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 20,
            fontWeight: 300, color: "#93c5fd" }}>Atlas</span>
          <span style={{ fontSize: 10, color: "#64748b", marginLeft: 8,
            fontFamily: "'Instrument Sans',sans-serif" }}>// Data Visualization Showcase</span>
        </div>
        <div style={{ fontSize: 11, color: "#64748b",
          fontFamily: "'JetBrains Mono',monospace" }}>16 chart types · all interactive</div>
      </div>

      {/* Index */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb",
        padding: "12px 40px", display: "flex", gap: 6, flexWrap: "wrap" }}>
        {vizList.map((v, i) => (
          <span key={i} style={{ fontSize: 10, padding: "3px 10px",
            background: "#f3f4f6", border: "1px solid #e5e7eb",
            borderRadius: 3, color: "#374151", cursor: "pointer",
            fontFamily: "'Instrument Sans',sans-serif", fontWeight: 500,
            transition: "all 0.15s" }}
            onMouseEnter={e => { e.target.style.background = P.navy; e.target.style.color = "#fff"; }}
            onMouseLeave={e => { e.target.style.background = "#f3f4f6"; e.target.style.color = "#374151"; }}>
            {v}
          </span>
        ))}
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 40px" }}>

        {/* 1 — Animated Counters */}
        <SectionHead num="01" title="Animated Counters"
          desc="Numbers that count up when scrolled into view. Great for key stats sections." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 40 }}>
          <Counter target={1247} label="Research Articles" color={P.navy} />
          <Counter target={87} label="Countries Tracked" color={P.teal} />
          <Counter target={52} label="Patterns Found" color={P.purple} />
          <Counter target={847} label="Arms Trade ($B)" color={P.red} prefix="$" />
          <Counter target={96} label="Sanctions Hit Rate %" color={P.amber} suffix="%" />
        </div>

        {/* 2 — Area Charts */}
        <SectionHead num="02" title="Area Charts"
          desc="Show trends over time. Gradient fill adds depth. Compare 'before' vs 'after' an event." />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 40 }}>
          <Card>
            <ChartTitle label="Sanctions Count by Country (2018–2024)" tag="STACKED AREA" />
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={sanctionsTimeline}>
                <defs>
                  {[["r", P.red], ["n", P.navy], ["a", P.amber], ["g", P.green]].map(([id, c]) => (
                    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={c} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={c} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} />
                <Tooltip content={<CustomTip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="Russia" stroke={P.red} fill="url(#r)" strokeWidth={2} />
                <Area type="monotone" dataKey="Iran" stroke={P.navy} fill="url(#n)" strokeWidth={2} />
                <Area type="monotone" dataKey="Venezuela" stroke={P.amber} fill="url(#a)" strokeWidth={2} />
                <Area type="monotone" dataKey="China" stroke={P.green} fill="url(#g)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <ChartTitle label="GDP Growth: Before vs After Sanctions" tag="BEFORE/AFTER" />
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={gdpShock}>
                <defs>
                  <linearGradient id="b" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={P.green} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={P.green} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="a2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={P.red} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={P.red} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="m" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} />
                <Tooltip content={<CustomTip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="before" name="No Sanctions" stroke={P.green} fill="url(#b)" strokeWidth={2} strokeDasharray="5 3" />
                <Area type="monotone" dataKey="after" name="After Sanctions" stroke={P.red} fill="url(#a2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* 3 — Bar Charts */}
        <SectionHead num="03" title="Bar Charts"
          desc="Compare values across categories. Horizontal bars work great for country rankings." />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 40 }}>
          <Card>
            <ChartTitle label="Global Arms Exports by Country ($B)" tag="VERTICAL BAR" />
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={armsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="country" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} />
                <Tooltip content={<CustomTip />} />
                <Bar dataKey="value" name="Arms ($B)" radius={[4, 4, 0, 0]}>
                  {armsData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <ChartTitle label="Arms Export Market Share" tag="HORIZONTAL BAR" />
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={armsData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} />
                <YAxis type="category" dataKey="country" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} width={65} />
                <Tooltip content={<CustomTip />} />
                <Bar dataKey="share" name="Share %" radius={[0, 4, 4, 0]}>
                  {armsData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* 4 — Pie & Donut */}
        <SectionHead num="04" title="Pie & Donut Charts"
          desc="Show proportions. Donut chart with center stat looks premium and editorial." />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 40 }}>
          <Card>
            <ChartTitle label="Global Arms Export Share" tag="DONUT CHART" />
            <div style={{ position: "relative" }}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={armsData} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                    dataKey="value" paddingAngle={3}>
                    {armsData.map((_, i) => <Cell key={i} fill={COLORS[i]} stroke="none" />)}
                  </Pie>
                  <Tooltip content={<CustomTip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -60%)", textAlign: "center", pointerEvents: "none" }}>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 22,
                  fontWeight: 900, color: P.navy }}>$564B</div>
                <div style={{ fontSize: 9, color: "#9ca3af",
                  fontFamily: "'Instrument Sans',sans-serif" }}>Total 2024</div>
              </div>
            </div>
          </Card>
          <Card>
            <ChartTitle label="Media Coverage Distribution" tag="PIE CHART" />
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={[
                  { name: "Conflict", value: 42 },
                  { name: "Economic", value: 28 },
                  { name: "Civilian", value: 18 },
                  { name: "Political", value: 12 },
                ]} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                  {[P.red, P.navy, P.teal, P.amber].map((c, i) => <Cell key={i} fill={c} />)}
                </Pie>
                <Tooltip content={<CustomTip />} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* 5 — Radar */}
        <SectionHead num="05" title="Radar / Spider Chart"
          desc="Perfect for media bias comparison — shows how 3 outlets cover the same story differently." />
        <Card style={{ marginBottom: 40 }}>
          <ChartTitle label="Media Coverage Bias: BBC vs RT vs Al Jazeera" tag="RADAR CHART" />
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={mediaRadar} cx="50%" cy="50%" outerRadius={100}>
              <PolarGrid stroke="#f3f4f6" />
              <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: "#6b7280" }} />
              <Radar name="BBC" dataKey="BBC" stroke={P.red} fill={P.red} fillOpacity={0.15} strokeWidth={2} />
              <Radar name="RT" dataKey="RT" stroke={P.navy} fill={P.navy} fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Al Jazeera" dataKey="AlJazeera" stroke={P.teal} fill={P.teal} fillOpacity={0.15} strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip content={<CustomTip />} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* 6 — Scatter */}
        <SectionHead num="06" title="Scatter / Bubble Chart"
          desc="Plot conflicts by intensity vs media attention vs casualty count (bubble size)." />
        <Card style={{ marginBottom: 40 }}>
          <ChartTitle label="Conflict: Media Attention vs Humanitarian Impact" tag="BUBBLE CHART" />
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="x" name="Media Coverage" type="number"
                tick={{ fontSize: 10, fill: "#9ca3af" }} label={{ value: "Media Attention →", position: "bottom", fontSize: 10, fill: "#9ca3af" }} />
              <YAxis dataKey="y" name="Humanitarian Score" type="number"
                tick={{ fontSize: 10, fill: "#9ca3af" }} label={{ value: "Humanitarian Impact →", angle: -90, position: "left", fontSize: 10, fill: "#9ca3af" }} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div style={{ background: "#fff", border: "1px solid #e5e7eb",
                    padding: "8px 12px", borderRadius: 6, fontSize: 11,
                    fontFamily: "'Instrument Sans',sans-serif" }}>
                    <strong>{d.name}</strong><br />
                    Media: {d.x} · Impact: {d.y} · Scale: {d.z}
                  </div>
                );
              }} />
              <Scatter name="Conflicts" data={conflictScatter} fill={P.red}>
                {conflictScatter.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </Card>

        {/* 7 — Treemap */}
        <SectionHead num="07" title="Treemap"
          desc="Show proportional data where size = magnitude. Great for arms trade, GDP, population." />
        <Card style={{ marginBottom: 40 }}>
          <ChartTitle label="Global Arms Exporters — Area = Export Volume" tag="TREEMAP" />
          <ResponsiveContainer width="100%" height={200}>
            <Treemap data={treemapData} dataKey="size" aspectRatio={4 / 3}
              content={({ x, y, width, height, name, size, color }) => (
                <g>
                  <rect x={x + 1} y={y + 1} width={width - 2} height={height - 2}
                    fill={color} rx={4} opacity={0.85} />
                  {width > 40 && height > 30 && (
                    <>
                      <text x={x + width / 2} y={y + height / 2 - 5}
                        textAnchor="middle" fontSize={11} fill="#fff" fontWeight={700}>{name}</text>
                      <text x={x + width / 2} y={y + height / 2 + 10}
                        textAnchor="middle" fontSize={10} fill="#ffffffcc">${size}B</text>
                    </>
                  )}
                </g>
              )} />
          </ResponsiveContainer>
        </Card>

        {/* 8 — Heat Map */}
        <SectionHead num="08" title="Heat Map"
          desc="Country × Topic matrix. Color intensity shows relationship strength. Hover for detail." />
        <Card style={{ marginBottom: 40 }}>
          <ChartTitle label="Country–Sector Interdependency Matrix" tag="HEAT MAP · HOVER" />
          <HeatMap />
        </Card>

        {/* 9 — Relationship Graph */}
        <SectionHead num="09" title="Relationship Graph (Node-Edge)"
          desc="The most shareable visual on the site. Shows how events connect. Hover nodes for strength." />
        <Card style={{ marginBottom: 40 }}>
          <ChartTitle label="Russia Sanctions → Global Chain Reaction" tag="INTERACTIVE GRAPH" />
          <RelGraph />
        </Card>

        {/* 10 — Funnel */}
        <SectionHead num="10" title="Funnel Chart"
          desc="Show how funding or influence flows and diminishes through stages." />
        <Card style={{ marginBottom: 40 }}>
          <ChartTitle label="NGO Funding Funnel: Foundation to Ground Level" tag="FUNNEL" />
          <ResponsiveContainer width="100%" height={180}>
            <FunnelChart>
              <Tooltip content={<CustomTip />} />
              <Funnel dataKey="value" data={fundingFlow} isAnimationActive>
                <LabelList position="right" fill="#374151" fontSize={11}
                  fontFamily="'Instrument Sans',sans-serif"
                  content={({ name, value }) => `${name}: $${value}M`} />
                {fundingFlow.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </Card>

        {/* 11 — Flow Diagram */}
        <SectionHead num="11" title="Flow / Sankey Diagram"
          desc="Trace money trails visually. Who funds → who receives → what happens." />
        <Card style={{ marginBottom: 40 }}>
          <ChartTitle label="Follow the Money: Foundation to Protest Network" tag="FLOW DIAGRAM" />
          <FlowDiagram />
        </Card>

        {/* 12 — Dot Map */}
        <SectionHead num="12" title="World Map with Hotspots"
          desc="Interactive world map showing conflict zones, alert levels, and active coverage." />
        <Card style={{ marginBottom: 40, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px 12px" }}>
            <ChartTitle label="Global Conflict & Alert Monitor" tag="DOT MAP" />
          </div>
          <DotMap />
        </Card>

        {/* 13 — Timeline */}
        <SectionHead num="13" title="Event Timeline"
          desc="Chronological view of events with pattern tags. Visually connects history to present." />
        <Card style={{ marginBottom: 40 }}>
          <ChartTitle label="Global Political Protest Events — Pattern Analysis" tag="TIMELINE" />
          <Timeline />
        </Card>

        {/* 14 — Animated Progress Bars */}
        <SectionHead num="14" title="Animated Progress Bars"
          desc="Scroll-triggered animation. Great for confidence scores, topic heat, media bias." />
        <Card style={{ marginBottom: 40 }}>
          <ChartTitle label="Media Bias Coverage Index by Outlet" tag="ANIMATED BARS" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              {[
                { label: "BBC — Conflict Coverage", value: 85, color: P.red },
                { label: "BBC — Economic Impact", value: 45, color: P.red },
                { label: "BBC — Civilian Stories", value: 60, color: P.red },
              ].map((b, i) => <ProgressBar key={i} {...b} />)}
            </div>
            <div>
              {[
                { label: "Al Jazeera — Conflict Coverage", value: 75, color: P.teal },
                { label: "Al Jazeera — Civilian Stories", value: 80, color: P.teal },
                { label: "Al Jazeera — Aid Coverage", value: 82, color: P.teal },
              ].map((b, i) => <ProgressBar key={i} {...b} />)}
            </div>
          </div>
        </Card>

        {/* 15 — Data Table */}
        <SectionHead num="15" title="Comparison Data Table"
          desc="Clean structured data. Color-coded values — red for negative, navy for positive." />
        <Card style={{ marginBottom: 40, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px 0" }}>
            <ChartTitle label="Sanctions Impact: Who Actually Pays the Price?" tag="DATA TABLE" />
          </div>
          <CompareTable />
        </Card>

        {/* 16 — Line Chart */}
        <SectionHead num="16" title="Multi-Line Chart"
          desc="Track multiple variables over time. Clean, precise, ideal for economic indicators." />
        <Card style={{ marginBottom: 40 }}>
          <ChartTitle label="Sanctions Escalation: 4-Country Comparison" tag="MULTI-LINE" />
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={sanctionsTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} />
              <Tooltip content={<CustomTip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {[["Russia", P.red], ["Iran", P.navy], ["Venezuela", P.amber], ["China", P.green]].map(([k, c]) => (
                <Line key={k} type="monotone" dataKey={k} stroke={c}
                  strokeWidth={2.5} dot={{ r: 3, fill: c }} activeDot={{ r: 5 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Summary */}
        <div style={{ background: P.navy, borderRadius: 8, padding: "24px 28px", color: "#fff" }}>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 22,
            fontWeight: 900, marginBottom: 12 }}>All 16 Visualization Types — Summary</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {[
              ["📈", "Area Charts", "Trends over time"],
              ["📊", "Bar Charts", "Rankings & comparisons"],
              ["🥧", "Pie / Donut", "Proportions & shares"],
              ["📉", "Line Charts", "Multi-variable trends"],
              ["🕸️", "Radar Chart", "Multi-axis comparison"],
              ["🔵", "Bubble Chart", "3D data in 2D"],
              ["🗂️", "Treemap", "Proportional areas"],
              ["🌡️", "Heat Map", "Matrix relationships"],
              ["🕸️", "Node Graph", "Event connections"],
              ["🔽", "Funnel", "Stage-by-stage flow"],
              ["➡️", "Flow Diagram", "Money/influence trail"],
              ["🗺️", "Dot Map", "Geographic hotspots"],
              ["📅", "Timeline", "Chronological events"],
              ["⬛", "Progress Bars", "Scores & indices"],
              ["📋", "Data Tables", "Structured comparison"],
              ["🔢", "Counters", "Animated key stats"],
            ].map(([icon, name, desc]) => (
              <div key={name} style={{ background: "rgba(255,255,255,0.07)",
                borderRadius: 6, padding: "10px 12px" }}>
                <div style={{ fontSize: 14, marginBottom: 4 }}>{icon} <span style={{ fontWeight: 700, fontSize: 12 }}>{name}</span></div>
                <div style={{ fontSize: 10, color: "#93c5fd",
                  fontFamily: "'Instrument Sans',sans-serif" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
