import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";

const COLORS = ["#e63946", "#f4a261", "#2a9d8f", "#457b9d", "#8338ec", "#fb8500"];

const competitors = [
  { name: "ZeroHedge", monthly: 48310000, domain: "zerohedge.com", age: "2009", niche: "Finance + Geopolitics", monetization: "Ads + Subscriptions", rank: 3750 },
  { name: "The Intercept", monthly: 2100000, domain: "theintercept.com", age: "2014", niche: "Investigative", monetization: "Donations", rank: 18000 },
  { name: "The Cradle", monthly: 864000, domain: "thecradle.co", age: "2021", niche: "Middle East Focus", monetization: "Ads", rank: 42000 },
  { name: "Naked Capitalism", monthly: 802000, domain: "nakedcapitalism.com", age: "2006", niche: "Finance + Politics", monetization: "Donations + Ads", rank: 45000 },
  { name: "The Grayzone", monthly: 195000, domain: "thegrayzone.com", age: "2015", niche: "Anti-Establishment", monetization: "Donations", rank: 210000 },
  { name: "Antiwar.com", monthly: 568000, domain: "antiwar.com", age: "1995", niche: "Anti-War News", monetization: "Donations + Ads", rank: 58000 },
];

const trafficGrowthProjection = [
  { month: "Month 1", realistic: 800, optimistic: 2000 },
  { month: "Month 2", realistic: 2500, optimistic: 6000 },
  { month: "Month 3", realistic: 6000, optimistic: 15000 },
  { month: "Month 4", realistic: 12000, optimistic: 32000 },
  { month: "Month 5", realistic: 22000, optimistic: 58000 },
  { month: "Month 6", realistic: 40000, optimistic: 95000 },
  { month: "Month 9", realistic: 90000, optimistic: 220000 },
  { month: "Month 12", realistic: 200000, optimistic: 500000 },
];

const trafficSources = [
  { name: "Organic Search", value: 45 },
  { name: "Direct/Loyal", value: 28 },
  { name: "Social (X/Twitter)", value: 15 },
  { name: "Reddit/Forums", value: 8 },
  { name: "Referral", value: 4 },
];

const contentPillars = [
  { pillar: "Geopolitics", demand: 92, competition: 75, opportunity: 85 },
  { pillar: "Media Bias", demand: 78, competition: 55, opportunity: 88 },
  { pillar: "War Economy", demand: 85, competition: 70, opportunity: 80 },
  { pillar: "Deep State", demand: 88, competition: 60, opportunity: 90 },
  { pillar: "Data Journalism", demand: 70, competition: 40, opportunity: 95 },
  { pillar: "India Focus", demand: 80, competition: 35, opportunity: 97 },
];

const revenueModel = [
  { month: "M3", adsense: 0, sponsored: 0, newsletter: 0 },
  { month: "M4", adsense: 120, sponsored: 0, newsletter: 0 },
  { month: "M5", adsense: 280, sponsored: 200, newsletter: 0 },
  { month: "M6", adsense: 520, sponsored: 400, newsletter: 100 },
  { month: "M9", adsense: 1200, sponsored: 800, newsletter: 300 },
  { month: "M12", adsense: 2800, sponsored: 1500, newsletter: 700 },
];

const techStack = [
  { layer: "Hosting", choice: "Cloudflare Pages", reason: "Free, global CDN, fast", cost: "₹0" },
  { layer: "Framework", choice: "Next.js SSG", reason: "SEO-perfect static pages", cost: "₹0" },
  { layer: "CMS/DB", choice: "Supabase", reason: "Auto-store articles", cost: "₹0" },
  { layer: "AI Writer", choice: "OpenRouter (Llama)", reason: "Free tier articles", cost: "₹0" },
  { layer: "Domain", choice: "Custom .com", reason: "Authority & branding", cost: "₹800/yr" },
  { layer: "Charts", choice: "Recharts/D3.js", reason: "Data journalism visuals", cost: "₹0" },
  { layer: "Automation", choice: "GitHub Actions", reason: "Daily auto-publish", cost: "₹0" },
];

const visualFeatures = [
  { feature: "Live Conflict Map", desc: "Interactive world map showing active conflicts with death tolls, cause analysis", impact: "Very High" },
  { feature: "Media Bias Meter", desc: "Visual gauge showing how different outlets cover same story", impact: "Very High" },
  { feature: "Money Trail Charts", desc: "Sankey/flow charts showing who funds what movement/conflict", impact: "High" },
  { feature: "Timeline Comparisons", desc: "Side-by-side timelines: 'Same playbook, different country'", impact: "High" },
  { feature: "Trade/Sanction Data", desc: "Bar charts showing economic warfare impact on ordinary people", impact: "High" },
  { feature: "Election Influence Tracker", desc: "Graph of foreign money in elections across countries", impact: "Very High" },
  { feature: "Arms Trade Bubble Chart", desc: "Who sells weapons to whom — bubble size = $ value", impact: "Very High" },
];

const formatNum = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return n;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#0d1117", border: "1px solid #e63946", padding: "10px 14px", borderRadius: 6 }}>
        <p style={{ color: "#e63946", fontWeight: 700, marginBottom: 4 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontSize: 13 }}>{p.name}: {typeof p.value === "number" && p.value > 999 ? formatNum(p.value) : p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function App() {
  const [activeTab, setActiveTab] = useState("competitors");

  const tabs = [
    { id: "competitors", label: "🎯 Competitors" },
    { id: "traffic", label: "📈 Traffic" },
    { id: "revenue", label: "💰 Revenue" },
    { id: "content", label: "📊 Content" },
    { id: "tech", label: "⚙️ Tech Stack" },
    { id: "visuals", label: "🗺️ Visual Features" },
  ];

  return (
    <div style={{ background: "#080b10", minHeight: "100vh", fontFamily: "'Georgia', serif", color: "#e8e8e8" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0d1117 0%, #1a0a0a 100%)", borderBottom: "2px solid #e63946", padding: "28px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <div style={{ width: 10, height: 10, background: "#e63946", borderRadius: "50%", animation: "pulse 1.5s infinite" }} />
            <span style={{ color: "#e63946", fontSize: 11, letterSpacing: 3, fontFamily: "monospace", textTransform: "uppercase" }}>Intelligence Report</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", margin: "0 0 6px", letterSpacing: -0.5 }}>
            Geopolitical News Blog — Market Research
          </h1>
          <p style={{ color: "#888", fontSize: 14, margin: 0 }}>Competitor Traffic • Revenue Potential • Content Strategy • Tech Architecture</p>
        </div>
      </div>

      {/* Key Stats */}
      <div style={{ maxWidth: 1100, margin: "24px auto", padding: "0 32px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { label: "ZeroHedge Monthly", value: "48.3M", sub: "visits — the ceiling", color: "#e63946" },
          { label: "Realistic Year-1 Target", value: "200K", sub: "visits/month", color: "#2a9d8f" },
          { label: "AdSense RPM (Geo/Politics)", value: "$4–8", sub: "per 1000 visits (USD)", color: "#f4a261" },
          { label: "Year-1 Revenue Potential", value: "$500–2K", sub: "per month by M12", color: "#8338ec" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#0d1117", border: `1px solid ${s.color}30`, borderTop: `3px solid ${s.color}`, padding: "18px 20px", borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: "#666", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "flex", gap: 4, borderBottom: "1px solid #1e2530", marginBottom: 28, overflowX: "auto" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              background: activeTab === t.id ? "#e63946" : "transparent",
              color: activeTab === t.id ? "#fff" : "#888",
              border: "none", padding: "10px 18px", cursor: "pointer",
              fontSize: 13, fontWeight: 600, borderRadius: "6px 6px 0 0",
              whiteSpace: "nowrap", transition: "all 0.2s"
            }}>{t.label}</button>
          ))}
        </div>

        {/* COMPETITORS TAB */}
        {activeTab === "competitors" && (
          <div>
            <h2 style={{ color: "#fff", fontSize: 18, marginBottom: 20 }}>Monthly Traffic — Direct Competitors</h2>
            <div style={{ background: "#0d1117", border: "1px solid #1e2530", borderRadius: 10, padding: 24, marginBottom: 24 }}>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={competitors} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2530" />
                  <XAxis dataKey="name" tick={{ fill: "#888", fontSize: 12 }} />
                  <YAxis tickFormatter={formatNum} tick={{ fill: "#888", fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="monthly" name="Monthly Visits" radius={[4, 4, 0, 0]}>
                    {competitors.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Competitor Table */}
            <div style={{ background: "#0d1117", border: "1px solid #1e2530", borderRadius: 10, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#1a0a0a" }}>
                    {["Site", "Monthly Traffic", "Since", "Niche", "Revenue Model", "Global Rank"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: "#e63946", letterSpacing: 1, textTransform: "uppercase", borderBottom: "1px solid #2a1a1a" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {competitors.map((c, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #1e2530" }}>
                      <td style={{ padding: "14px 16px", fontWeight: 700, color: "#fff" }}>{c.name}</td>
                      <td style={{ padding: "14px 16px", color: COLORS[i], fontWeight: 700 }}>{formatNum(c.monthly)}</td>
                      <td style={{ padding: "14px 16px", color: "#888" }}>{c.age}</td>
                      <td style={{ padding: "14px 16px", color: "#ccc" }}>{c.niche}</td>
                      <td style={{ padding: "14px 16px", color: "#888" }}>{c.monetization}</td>
                      <td style={{ padding: "14px 16px", color: "#888" }}>#{c.rank.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 20, padding: 20, background: "#0d1117", border: "1px solid #2a9d8f30", borderLeft: "3px solid #2a9d8f", borderRadius: 8 }}>
              <div style={{ fontSize: 13, color: "#2a9d8f", fontWeight: 700, marginBottom: 8 }}>🎯 Key Insight</div>
              <p style={{ color: "#ccc", fontSize: 14, margin: 0, lineHeight: 1.7 }}>
                ZeroHedge is an outlier built over 16 years. <strong style={{ color: "#fff" }}>The Cradle</strong> launched in 2021 and already gets 864K/month — that's your realistic 2-year target. 
                <strong style={{ color: "#e63946" }}> The biggest gap: nobody covers India's geopolitical position + global narrative wars from an Indian data-journalism angle.</strong> That's your moat.
              </p>
            </div>
          </div>
        )}

        {/* TRAFFIC TAB */}
        {activeTab === "traffic" && (
          <div>
            <h2 style={{ color: "#fff", fontSize: 18, marginBottom: 6 }}>Your Traffic Projection — 12 Months</h2>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>Based on 2 articles/day, automated pipeline, active social promotion</p>
            <div style={{ background: "#0d1117", border: "1px solid #1e2530", borderRadius: 10, padding: 24, marginBottom: 24 }}>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={trafficGrowthProjection}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2530" />
                  <XAxis dataKey="month" tick={{ fill: "#888", fontSize: 11 }} />
                  <YAxis tickFormatter={formatNum} tick={{ fill: "#888", fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="realistic" name="Realistic" stroke="#2a9d8f" strokeWidth={3} dot={{ fill: "#2a9d8f", r: 5 }} />
                  <Line type="monotone" dataKey="optimistic" name="Optimistic (viral posts)" stroke="#e63946" strokeWidth={3} strokeDasharray="5 5" dot={{ fill: "#e63946", r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ background: "#0d1117", border: "1px solid #1e2530", borderRadius: 10, padding: 24 }}>
                <h3 style={{ color: "#fff", marginBottom: 16, fontSize: 15 }}>Traffic Source Mix (Year 1 Target)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={trafficSources} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${value}%`}>
                      {trafficSources.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: "#0d1117", border: "1px solid #1e2530", borderRadius: 10, padding: 24 }}>
                <h3 style={{ color: "#fff", marginBottom: 16, fontSize: 15 }}>Traffic Growth Levers</h3>
                {[
                  { action: "2 articles/day (AI automated)", impact: "High", color: "#2a9d8f" },
                  { action: "Twitter/X threads from each article", impact: "Very High", color: "#e63946" },
                  { action: "Reddit r/geopolitics posts", impact: "High", color: "#f4a261" },
                  { action: "Internal linking (topic clusters)", impact: "High", color: "#8338ec" },
                  { action: "1 viral data-visual per week", impact: "Very High", color: "#e63946" },
                  { action: "India-angle articles (untapped)", impact: "Highest", color: "#e63946" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1e2530" }}>
                    <span style={{ fontSize: 13, color: "#ccc" }}>{item.action}</span>
                    <span style={{ fontSize: 11, padding: "3px 10px", background: item.color + "20", color: item.color, borderRadius: 20, fontWeight: 700 }}>{item.impact}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* REVENUE TAB */}
        {activeTab === "revenue" && (
          <div>
            <h2 style={{ color: "#fff", fontSize: 18, marginBottom: 20 }}>Revenue Projection (USD/month)</h2>
            <div style={{ background: "#0d1117", border: "1px solid #1e2530", borderRadius: 10, padding: 24, marginBottom: 24 }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueModel}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2530" />
                  <XAxis dataKey="month" tick={{ fill: "#888", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#888", fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="adsense" name="AdSense" fill="#f4a261" radius={[3, 3, 0, 0]} stackId="a" />
                  <Bar dataKey="sponsored" name="Sponsored Content" fill="#2a9d8f" radius={[3, 3, 0, 0]} stackId="a" />
                  <Bar dataKey="newsletter" name="Newsletter/Premium" fill="#8338ec" radius={[3, 3, 0, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {[
                { phase: "Phase 1 (M1-M3)", title: "Content Building", desc: "0 revenue. Focus on 60+ articles, get indexed, build topic authority. Apply for AdSense at 30 posts.", color: "#888" },
                { phase: "Phase 2 (M4-M6)", title: "Monetization Start", desc: "AdSense live. $120–520/month. Geo/Politics RPM is $4–8 USD. One sponsored post = $100–300.", color: "#f4a261" },
                { phase: "Phase 3 (M7-M12)", title: "Scale & Diversify", desc: "Target $1,000–$3,000/month through AdSense + sponsored + Substack newsletter at $5/month.", color: "#2a9d8f" },
              ].map((p, i) => (
                <div key={i} style={{ background: "#0d1117", border: `1px solid ${p.color}40`, borderTop: `3px solid ${p.color}`, borderRadius: 8, padding: 20 }}>
                  <div style={{ fontSize: 10, color: p.color, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{p.phase}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{p.title}</div>
                  <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.6 }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTENT TAB */}
        {activeTab === "content" && (
          <div>
            <h2 style={{ color: "#fff", fontSize: 18, marginBottom: 6 }}>Content Pillar Opportunity Analysis</h2>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>Demand = search volume signal. Competition = existing content. Opportunity = your gap to exploit.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ background: "#0d1117", border: "1px solid #1e2530", borderRadius: 10, padding: 24 }}>
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={contentPillars}>
                    <PolarGrid stroke="#1e2530" />
                    <PolarAngleAxis dataKey="pillar" tick={{ fill: "#888", fontSize: 11 }} />
                    <Radar name="Demand" dataKey="demand" stroke="#e63946" fill="#e63946" fillOpacity={0.15} />
                    <Radar name="Opportunity" dataKey="opportunity" stroke="#2a9d8f" fill="#2a9d8f" fillOpacity={0.15} />
                    <Radar name="Competition" dataKey="competition" stroke="#f4a261" fill="#f4a261" fillOpacity={0.1} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: "#0d1117", border: "1px solid #1e2530", borderRadius: 10, padding: 24 }}>
                <h3 style={{ color: "#fff", marginBottom: 16, fontSize: 15 }}>Biggest Untapped Angles</h3>
                {[
                  { angle: "India's Narrative Wars", why: "No English site covers India geopolitics from Indian POV with data", score: 97 },
                  { angle: "Data Journalism Layer", why: "All competitors are text-only. Charts = viral shareability", score: 95 },
                  { angle: "Media Bias Tracking", why: "Show same event covered 3 ways — readers love the expose format", score: 92 },
                  { angle: "Money Trail Exposés", why: "Who funds protests, wars, NGOs — follow the $ with visuals", score: 90 },
                  { angle: "Deep State Pattern DB", why: "Build a searchable database of recurring playbooks", score: 88 },
                ].map((a, i) => (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 14, color: "#fff", fontWeight: 600 }}>{a.angle}</span>
                      <span style={{ fontSize: 13, color: "#e63946", fontWeight: 700 }}>{a.score}/100</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>{a.why}</div>
                    <div style={{ height: 4, background: "#1e2530", borderRadius: 2 }}>
                      <div style={{ height: "100%", width: `${a.score}%`, background: `linear-gradient(90deg, #e63946, #8338ec)`, borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TECH STACK TAB */}
        {activeTab === "tech" && (
          <div>
            <h2 style={{ color: "#fff", fontSize: 18, marginBottom: 8 }}>Recommended Tech Stack</h2>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>Your existing SchemeAtlas architecture — adapted for a news/analysis site with data visuals</p>
            <div style={{ background: "#0d1117", border: "1px solid #1e2530", borderRadius: 10, overflow: "hidden", marginBottom: 24 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#1a0a0a" }}>
                    {["Layer", "Tool", "Why", "Cost/Month"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: "#e63946", letterSpacing: 1, textTransform: "uppercase", borderBottom: "1px solid #2a1a1a" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {techStack.map((t, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #1e2530" }}>
                      <td style={{ padding: "14px 16px", color: "#888", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>{t.layer}</td>
                      <td style={{ padding: "14px 16px", color: "#fff", fontWeight: 700 }}>{t.choice}</td>
                      <td style={{ padding: "14px 16px", color: "#aaa", fontSize: 13 }}>{t.reason}</td>
                      <td style={{ padding: "14px 16px", color: t.cost === "₹0" ? "#2a9d8f" : "#f4a261", fontWeight: 700 }}>{t.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ padding: 20, background: "#0d1117", border: "1px solid #f4a26130", borderLeft: "3px solid #f4a261", borderRadius: 8, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: "#f4a261", marginBottom: 8 }}>📌 Blogspot vs Custom Domain?</div>
              <p style={{ color: "#ccc", fontSize: 14, margin: 0, lineHeight: 1.7 }}>
                <strong style={{ color: "#fff" }}>Skip Blogspot entirely.</strong> You already know Next.js + Cloudflare Pages. 
                Blogspot has zero SEO advantage for competitive keywords, no custom data visualizations, 
                and limited design control. A custom domain on your stack will rank faster, look more authoritative, 
                and support the data journalism features that make you different from every other geo-politics blog.
                <strong style={{ color: "#e63946" }}> Cost = ₹800/year for domain. Everything else is ₹0.</strong>
              </p>
            </div>
          </div>
        )}

        {/* VISUAL FEATURES TAB */}
        {activeTab === "visuals" && (
          <div>
            <h2 style={{ color: "#fff", fontSize: 18, marginBottom: 6 }}>Advanced Visual Features — What Makes You Different</h2>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>No competitor does data journalism at this level. This is your moat.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              {visualFeatures.map((f, i) => (
                <div key={i} style={{ background: "#0d1117", border: "1px solid #1e2530", borderRadius: 8, padding: 20, display: "flex", gap: 14 }}>
                  <div style={{ width: 8, minWidth: 8, background: f.impact === "Very High" ? "#e63946" : "#f4a261", borderRadius: 4, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 700, color: "#fff", marginBottom: 6 }}>{f.feature}</div>
                    <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.5, marginBottom: 8 }}>{f.desc}</div>
                    <span style={{ fontSize: 11, padding: "2px 10px", background: f.impact === "Very High" ? "#e6394620" : "#f4a26120", color: f.impact === "Very High" ? "#e63946" : "#f4a261", borderRadius: 20 }}>Impact: {f.impact}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: 20, background: "#0d1117", border: "1px solid #8338ec30", borderLeft: "3px solid #8338ec", borderRadius: 8 }}>
              <div style={{ fontWeight: 700, color: "#8338ec", marginBottom: 10 }}>🚀 The Differentiation Formula</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {[
                  { title: "AI Writes", desc: "OpenRouter pipeline generates the article analysis automatically" },
                  { title: "Data Visualizes", desc: "Every article has at least 1 chart, map, or infographic auto-generated" },
                  { title: "India Lens", desc: "Global events always filtered through India's perspective — unique angle no competitor has" },
                ].map((item, i) => (
                  <div key={i} style={{ textAlign: "center", padding: 16, background: "#0a0a12", borderRadius: 8 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 1100, margin: "32px auto 0", padding: "0 32px 40px", textAlign: "center", color: "#333", fontSize: 12 }}>
        Data sources: Similarweb, SEMrush, SimilarWeb competitor analysis • Generated May 2026
      </div>
    </div>
  );
}
