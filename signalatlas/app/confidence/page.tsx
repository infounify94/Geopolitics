import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confidence System — How SignalAtlas Rates Evidence Quality",
  description: "A plain-language explanation of SignalAtlas confidence scoring: what High, Medium, and Low confidence mean, how evidence strength is assessed, and what each rating tells you about an article.",
};

export default function ConfidencePage() {
  return (
    <>
      <Nav />
      <div style={{ background: "var(--navy)", padding: "3rem 2rem 2.5rem", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--amber)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: ".5rem" }}>Transparency System</div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(2rem,4vw,2.8rem)", fontWeight: 700, color: "var(--white)", letterSpacing: "-.02em", marginBottom: ".75rem" }}>The Confidence System</h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,.55)", maxWidth: 620, lineHeight: 1.8 }}>Every SignalAtlas article carries a confidence rating. Here is exactly what each rating means — and what it does not.</p>
        </div>
      </div>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "2.5rem 2rem 4rem" }}>

        <p style={{ fontSize: 15, color: "var(--ink2)", lineHeight: 1.9, marginBottom: "2rem" }}>
          Geopolitical analysis deals with incomplete information, fluid situations, and sources with their own perspectives. Rather than presenting all analysis with equal authority, SignalAtlas rates each article for the strength of its evidential basis. This lets readers calibrate how much weight to give different claims.
        </p>

        {[
          {
            level: "HIGH CONFIDENCE", color: "#22C55E", bg: "#F0FDF4", border: "#86EFAC",
            icon: "✓",
            whatItMeans: "The core claims in this article are backed by 3 or more independent, named, linkable sources. At least one is a primary document (official report, treaty text, government statement, or peer-reviewed data). Key statistics have been verified against the source they are attributed to.",
            whatItDoesntMean: "It does not mean the analysis is infallible, or that the scenario predictions are guaranteed. Geopolitics involves judgment, and reasonable analysts can disagree on interpretation of the same facts.",
            readersShould: "Trust the factual foundation. Apply independent judgment to the analytical conclusions.",
          },
          {
            level: "MEDIUM CONFIDENCE", color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A",
            icon: "◈",
            whatItMeans: "The core narrative is sourced, but some supporting claims rely on credible secondary reporting rather than primary documents. The situation may be evolving, or there may be conflicting accounts between sources. Uncertainty is noted in the article.",
            whatItDoesntMean: "It does not mean the article is speculative or unreliable. Most real-world geopolitical coverage operates in this range — primary documents often lag events by weeks.",
            readersShould: "Treat the article as a well-sourced working account. Check the sources block to see which specific claims have primary backing.",
          },
          {
            level: "LOW CONFIDENCE", color: "#EF4444", bg: "#FFF5F5", border: "#FECACA",
            icon: "⚠",
            whatItMeans: "This article covers a rapidly developing situation where confirmation is limited, or relies primarily on a single credible source. Published because the event itself is significant enough to warrant early coverage, but explicitly flagged as preliminary.",
            whatItDoesntMean: "It does not mean the article contains false information. It means the evidential basis has not yet met our standard for confident assertion.",
            readersShould: "Treat this as an early signal. The article will be updated as more sources confirm or correct the account.",
          },
        ].map(tier => (
          <div key={tier.level} style={{ background: tier.bg, border: `1px solid ${tier.border}`, borderRadius: "var(--radius)", padding: "1.75rem 2rem", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
              <span style={{ width: 32, height: 32, borderRadius: "50%", background: tier.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{tier.icon}</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 12, fontWeight: 700, color: tier.color, letterSpacing: ".08em" }}>{tier.level}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700, color: "var(--ink3)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>What this means</div>
                <p style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.75 }}>{tier.whatItMeans}</p>
              </div>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700, color: "var(--ink3)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>What it does not mean</div>
                <p style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.75 }}>{tier.whatItDoesntMean}</p>
              </div>
            </div>
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: `1px solid ${tier.border}` }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700, color: "var(--ink3)", letterSpacing: ".1em", textTransform: "uppercase", marginRight: 8 }}>How to read it:</span>
              <span style={{ fontSize: 13, color: "var(--ink2)" }}>{tier.readersShould}</span>
            </div>
          </div>
        ))}

        <section style={{ marginTop: "2.5rem" }}>
          <div style={{ paddingBottom: "1rem", borderBottom: "1px solid var(--border)", marginBottom: "1.5rem" }}>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.4rem", fontWeight: 700, color: "var(--navy)" }}>Evidence Strength (separate from Confidence Level)</h2>
          </div>
          <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.8, marginBottom: "1rem" }}>In addition to confidence, articles carry an evidence strength rating. This is a separate dimension:</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {[
              { level: "STRONG", color: "#3B82F6", desc: "Primary documents (official reports, treaty texts, government filings) directly confirm the claims." },
              { level: "MODERATE", color: "#F59E0B", desc: "Reliable secondary sources confirm the core account. Primary documents available but not directly cited." },
              { level: "LIMITED", color: "#EF4444", desc: "Available evidence is partial. Situation is developing, or sources have conflicting accounts on key details." },
            ].map(e => (
              <div key={e.level} style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1rem 1.25rem" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, color: e.color, letterSpacing: ".08em", marginBottom: ".5rem" }}>{e.level} EVIDENCE</div>
                <p style={{ fontSize: 12, color: "var(--ink2)", lineHeight: 1.65 }}>{e.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div style={{ background: "var(--off)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem 2rem", marginTop: "2rem" }}>
          <p style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.8 }}>
            Questions about how a specific article was rated? <a href="/contact" style={{ color: "var(--amber)" }}>Contact our research team</a> or read our <a href="/methodology" style={{ color: "var(--amber)" }}>full methodology</a>.
          </p>
        </div>

      </main>
      <Footer />
    </>
  );
}
