import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research Methodology — How SignalAtlas Sources and Verifies Analysis",
  description: "Our full research methodology: how confidence scores are assigned, what sourcing standards we apply, how AI assistance works, and what our 5-stage verification process entails.",
};

export default function MethodologyPage() {
  return (
    <>
      <Nav />
      <div style={{ background: "var(--navy)", padding: "3rem 2rem 2.5rem", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--amber)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: ".5rem" }}>Research Standards</div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(2rem,4vw,2.8rem)", fontWeight: 700, color: "var(--white)", letterSpacing: "-.02em", marginBottom: ".75rem" }}>Our Methodology</h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,.55)", maxWidth: 620, lineHeight: 1.8 }}>How we source, verify, confidence-score, and publish geopolitical analysis. Written plainly so readers can evaluate our work — not just trust our claims.</p>
        </div>
      </div>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "2.5rem 2rem 4rem" }}>

        {/* AI Disclosure */}
        <div style={{ background: "#FEF9F0", border: "1px solid #FDDCB0", borderLeft: "4px solid var(--amber)", borderRadius: "var(--radius)", padding: "1.5rem 2rem", marginBottom: "2.5rem" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--amber)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: ".5rem" }}>AI-Assisted Research — Full Disclosure</div>
          <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.8, marginBottom: ".75rem" }}>
            SignalAtlas uses AI language models to assist with drafting initial research briefs, extracting data from source documents, and structuring analysis. <strong>Every published article is reviewed, edited, and fact-checked by a human analyst before publication.</strong>
          </p>
          <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.8 }}>
            We believe transparency about AI assistance is a trust signal, not a weakness. Our human review step is where we verify that every cited statistic traces to a named, linkable source — and where AI-generated speculation is removed or clearly flagged.
          </p>
        </div>

        {/* Confidence System */}
        <section style={{ marginBottom: "2.5rem" }}>
          <div style={{ paddingBottom: "1rem", borderBottom: "1px solid var(--border)", marginBottom: "1.5rem" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--amber)", letterSpacing: ".12em", textTransform: "uppercase" }}>01 — Confidence Levels</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", fontWeight: 700, color: "var(--navy)", marginTop: ".25rem" }}>How Confidence Is Assigned</h2>
          </div>
          <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.8, marginBottom: "1.25rem" }}>
            Every article receives a confidence rating before publication. The rating reflects the number of independent sources, their quality, and whether key claims were cross-verified. Ratings are assigned by the reviewing analyst — not by the AI.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { level: "HIGH", color: "#22C55E", bg: "#F0FDF4", border: "#86EFAC", requirement: "Minimum 3 independent, named, linkable sources", definition: "All key claims — especially numeric statistics — are traced to a primary or authoritative secondary source. No significant factual contradictions between sources. At least one primary document (government filing, UN report, official statement, or peer-reviewed data) is among the sources.", examples: "UN reports, IMF/World Bank data, official government statements, SIPRI database, Reuters/AP wire dispatches, peer-reviewed academic papers." },
              { level: "MEDIUM", color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A", requirement: "Minimum 2 named sources; some claims sourced to reliable secondary reporting", definition: "Core narrative is sourced, but one or more supporting claims rely on credible secondary reporting (major news outlets) rather than primary documents. Situation may be evolving. Some uncertainty acknowledged explicitly in the article.", examples: "Established news outlets (BBC, Al Jazeera, Reuters), regional news with editorial standards, established think tank publications." },
              { level: "LOW", color: "#EF4444", bg: "#FFF5F5", border: "#FECACA", requirement: "Fewer than 2 named sources, or rapidly developing situation with limited confirmation", definition: "Published only when the event itself is significant enough to warrant early coverage. Explicitly flagged as preliminary. Treated as a signal to watch, not a verified account. Updated or upgraded as more sources become available.", examples: "Breaking news with limited confirmation, developing situations, single-source reports from credible outlets." },
            ].map(tier => (
              <div key={tier.level} style={{ background: tier.bg, border: `1px solid ${tier.border}`, borderRadius: "var(--radius)", padding: "1.25rem 1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: ".75rem" }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: tier.color, color: "#fff", letterSpacing: ".08em" }}>{tier.level}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink3)" }}>{tier.requirement}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.75, marginBottom: ".5rem" }}>{tier.definition}</p>
                <p style={{ fontSize: 12, color: "var(--ink3)", lineHeight: 1.6 }}><strong>Qualifying sources: </strong>{tier.examples}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5-Stage Process */}
        <section style={{ marginBottom: "2.5rem" }}>
          <div style={{ paddingBottom: "1rem", borderBottom: "1px solid var(--border)", marginBottom: "1.5rem" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--amber)", letterSpacing: ".12em", textTransform: "uppercase" }}>02 — Verification Process</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", fontWeight: 700, color: "var(--navy)", marginTop: ".25rem" }}>The 5-Stage Verification Process</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 12 }}>
            {[
              { stage: "01", title: "Source Collection", desc: "RSS feeds, news APIs, UN/IMF/World Bank official publications, GDELT event database, and government document repositories are scanned for the event." },
              { stage: "02", title: "Primary Registry Check", desc: "Where possible, key claims are verified against primary documents: UN resolutions, official ministry statements, treaty texts, or multilateral organization data." },
              { stage: "03", title: "Cross-Source Verification", desc: "Claims present in only one source are flagged. Factual claims (numbers, dates, attributions) must appear in at least one additional independent source to be stated as fact." },
              { stage: "04", title: "Human Review & Edit", desc: "A human analyst reviews the AI-drafted brief, checks source links, corrects errors, removes unsupported speculation, and assigns the confidence level." },
              { stage: "05", title: "Citation Linkage", desc: "Every cited statistic or claim is linked to a named source in the article or the Sources block. Anonymous sources and unverifiable claims are removed or explicitly flagged." },
            ].map(step => (
              <div key={step.stage} style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.25rem" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--amber)", letterSpacing: ".1em", marginBottom: ".5rem" }}>STAGE {step.stage}</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: "1rem", fontWeight: 700, color: "var(--navy)", marginBottom: ".5rem" }}>{step.title}</div>
                <p style={{ fontSize: 12, color: "var(--ink2)", lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Source Standards */}
        <section style={{ marginBottom: "2.5rem" }}>
          <div style={{ paddingBottom: "1rem", borderBottom: "1px solid var(--border)", marginBottom: "1.5rem" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--amber)", letterSpacing: ".12em", textTransform: "uppercase" }}>03 — Source Standards</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", fontWeight: 700, color: "var(--navy)", marginTop: ".25rem" }}>What Counts as a Qualifying Source</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div>
              <div style={{ fontFamily: "var(--serif)", fontWeight: 700, color: "var(--navy)", marginBottom: ".75rem", fontSize: "1rem" }}>✅ Qualifying Sources</div>
              <ul style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 2, paddingLeft: 16 }}>
                <li>UN reports, resolutions, and official statements</li>
                <li>IMF, World Bank, WTO publications and data</li>
                <li>SIPRI (arms trade and conflict data)</li>
                <li>Official government ministry statements</li>
                <li>Treaty texts and multilateral agreements</li>
                <li>Reuters, Associated Press wire reports</li>
                <li>Major international news outlets with editorial standards</li>
                <li>Peer-reviewed academic publications</li>
                <li>Official corporate filings (SEC, company reports)</li>
              </ul>
            </div>
            <div>
              <div style={{ fontFamily: "var(--serif)", fontWeight: 700, color: "var(--navy)", marginBottom: ".75rem", fontSize: "1rem" }}>❌ Non-Qualifying Sources</div>
              <ul style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 2, paddingLeft: 16 }}>
                <li>Anonymous or unattributed online claims</li>
                <li>Social media posts without official verification</li>
                <li>Blogs without named authors or editorial standards</li>
                <li>Content farms or AI-generated news aggregators</li>
                <li>Sources that cannot be independently accessed or verified</li>
                <li>Single-source claims on sensitive numeric data</li>
              </ul>
            </div>
          </div>
        </section>

        {/* India Lens */}
        <section style={{ marginBottom: "2.5rem" }}>
          <div style={{ paddingBottom: "1rem", borderBottom: "1px solid var(--border)", marginBottom: "1.5rem" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--amber)", letterSpacing: ".12em", textTransform: "uppercase" }}>04 — India Lens Standard</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", fontWeight: 700, color: "var(--navy)", marginTop: ".25rem" }}>How the India Lens Angle Is Determined</h2>
          </div>
          <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.8 }}>Every article published on SignalAtlas is reviewed for its specific implications for India — across economy, security, diplomacy, and trade. The India Lens section is included when a direct, traceable connection exists (trade route impact, diplomatic statement, policy response, diaspora effect). It is not included when the connection would be speculative. When included, the India angle is sourced to the same standard as the rest of the article.</p>
        </section>

        {/* Corrections */}
        <section style={{ background: "var(--off)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem 2rem" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--amber)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: ".5rem" }}>05 — Corrections Policy</div>
          <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.8, marginBottom: ".75rem" }}>If a factual error is identified in a published article, we correct it with a visible correction notice in the article body noting the original claim, the correction, and the date. We do not silently edit articles — changes are documented.</p>
          <a href="/contact" style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--amber)", letterSpacing: ".06em", textDecoration: "none" }}>Submit a correction → research@signalatlas.com</a>
        </section>

      </main>
      <Footer />
    </>
  );
}
