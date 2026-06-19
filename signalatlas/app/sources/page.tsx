import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Sources — Primary References Used by SignalAtlas",
  description: "The primary databases, registries, news sources, and official publications that SignalAtlas draws on for geopolitical analysis.",
};

const SOURCE_CATEGORIES = [
  {
    label: "Multilateral & Official Data",
    sources: [
      { name: "United Nations (UN)", url: "https://www.un.org", desc: "Resolutions, reports, peacekeeping data, humanitarian statistics. Primary source for international law and official conflict records." },
      { name: "International Monetary Fund (IMF)", url: "https://www.imf.org", desc: "Economic data, country outlook reports, Article IV consultations, loan programme documentation." },
      { name: "World Bank Open Data", url: "https://data.worldbank.org", desc: "GDP, poverty, trade, infrastructure, and development indicators across 195 nations." },
      { name: "SIPRI (Stockholm International Peace Research Institute)", url: "https://sipri.org", desc: "Arms transfers, military expenditure, nuclear forces, and conflict data. Primary source for defence spending and weapons trade figures." },
      { name: "World Trade Organization (WTO)", url: "https://www.wto.org", desc: "Trade statistics, dispute settlement records, tariff schedules." },
      { name: "UN Comtrade", url: "https://comtradeplus.un.org", desc: "Global trade flows by commodity and country — used for Follow the Money analysis." },
    ],
  },
  {
    label: "News Wire & Breaking Coverage",
    sources: [
      { name: "Reuters", url: "https://reuters.com", desc: "Primary wire service. Used for factual event verification and attributed quotes from officials." },
      { name: "Associated Press (AP)", url: "https://apnews.com", desc: "Co-primary wire service. Used alongside Reuters to cross-verify breaking developments." },
      { name: "Al Jazeera English", url: "https://aljazeera.com", desc: "Used for Global South and Middle East coverage perspectives — checked against wire sources for factual claims." },
      { name: "BBC World Service", url: "https://bbc.com/news/world", desc: "Used for European and international event coverage." },
      { name: "The Hindu / Times of India", url: "https://thehindu.com", desc: "Primary Indian domestic news sources — used for India Lens angles and South Asia coverage." },
    ],
  },
  {
    label: "Specialist & Research Databases",
    sources: [
      { name: "GDELT Project", url: "https://gdeltproject.org", desc: "Global event database updated every 15 minutes. Used for automated event detection and conflict pattern analysis." },
      { name: "ACLED (Armed Conflict Location & Event Data)", url: "https://acleddata.com", desc: "Disaggregated conflict event data. Used for casualty estimates and conflict mapping." },
      { name: "Observatory of Economic Complexity (OEC)", url: "https://oec.world", desc: "Trade network visualisation and export/import dependency data." },
      { name: "US Treasury OFAC Sanctions Lists", url: "https://ofac.treasury.gov", desc: "Official US sanctions designations — primary source for sanctions articles." },
      { name: "European Council Sanctions Map", url: "https://www.sanctionsmap.eu", desc: "EU sanctions regimes — used alongside OFAC for comprehensive sanctions coverage." },
    ],
  },
];

export default function SourcesPage() {
  return (
    <>
      <Nav />
      <div style={{ background: "var(--navy)", padding: "3rem 2rem 2.5rem", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--amber)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: ".5rem" }}>Data Infrastructure</div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(2rem,4vw,2.8rem)", fontWeight: 700, color: "var(--white)", letterSpacing: "-.02em", marginBottom: ".75rem" }}>Our Data Sources</h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,.55)", maxWidth: 600, lineHeight: 1.8 }}>Every claim in a SignalAtlas article traces to a named, linkable source from one of these registries, databases, or publications. We do not publish statistics from sources we cannot name.</p>
        </div>
      </div>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "2.5rem 2rem 4rem" }}>
        {SOURCE_CATEGORIES.map(cat => (
          <section key={cat.label} style={{ marginBottom: "2.5rem" }}>
            <div style={{ paddingBottom: ".75rem", borderBottom: "1px solid var(--border)", marginBottom: "1.25rem" }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: "1.2rem", fontWeight: 700, color: "var(--navy)" }}>{cat.label}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
              {cat.sources.map(src => (
                <div key={src.name} style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1rem 1.25rem" }}>
                  <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--serif)", fontSize: ".95rem", fontWeight: 700, color: "var(--navy)", textDecoration: "none", display: "block", marginBottom: ".4rem" }}>
                    {src.name} ↗
                  </a>
                  <p style={{ fontSize: 12, color: "var(--ink2)", lineHeight: 1.65 }}>{src.desc}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div style={{ background: "var(--off)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem 2rem", marginTop: "1rem" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--amber)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: ".5rem" }}>Source Requests</div>
          <p style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.8 }}>
            If you believe a key data source is missing from our infrastructure, or if a source we cite has an error, contact us at <a href="mailto:research@signalatlas.com" style={{ color: "var(--amber)" }}>research@signalatlas.com</a>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
