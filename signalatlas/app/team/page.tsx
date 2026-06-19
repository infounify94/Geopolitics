import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Team — SignalAtlas',
  description: 'Meet the team behind SignalAtlas.',
};

export default function TeamPage() {
  return (
    <>
      <Nav />
      <div style={{ background: 'var(--navy)', padding: '3rem 2rem 2.5rem', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '.5rem' }}>Our Team</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 700, color: 'var(--white)', letterSpacing: '-.02em', marginBottom: '.75rem' }}>
            The Analysts Behind SignalAtlas
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.55)', maxWidth: 620, lineHeight: 1.8 }}>
            Geopolitical intelligence requires human judgment. Meet the analysts responsible for structuring, verifying, and publishing our research.
          </p>
        </div>
      </div>

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>
        
        {/* Sathish's profile */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {/* Avatar column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '120px' }}>
            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&h=256&q=80" alt="Sathish - Lead Analyst" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--navy)' }} />
          </div>
          
          {/* Bio column */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '.25rem' }}>Sathish</h2>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--amber)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Founder & Lead Analyst</div>
            
            <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.8, marginBottom: '1rem' }}>
              Sathish leads editorial strategy and analytical frameworks at SignalAtlas. His research focuses on South Asian strategic dynamics, India's foreign policy, global sanctions networks, and multilateral trade flows.
            </p>
            <p style={{ fontSize: 14, color: 'var(--ink2)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              Before publishing any piece on SignalAtlas, Sathish personally oversees the Stage 5 Human Review process, ensuring that every claim is backed by a named primary or authoritative secondary source and that the India Lens is applied rigorously.
            </p>

            <div style={{ background: '#FEF9F0', borderLeft: '3px solid var(--amber)', padding: '1rem', borderRadius: '0 var(--radius) var(--radius) 0' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--navy)', letterSpacing: '.05em', fontWeight: 700, marginBottom: '.5rem' }}>AI ASSISTANCE DISCLOSURE</div>
              <p style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.6 }}>
                Sathish utilizes large language models to assist with open-source intelligence gathering, structuring complex data, and drafting initial briefs. However, the analytical conclusions, confidence scoring, and final factual verification are solely his responsibility.
              </p>
            </div>
          </div>
        </div>

        {/* Contact section */}
        <section style={{ background: 'var(--off)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem 2rem' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>Contact Us</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontWeight: 700, color: 'var(--navy)', marginBottom: '.25rem' }}>Research Enquiries</div>
              <a href="mailto:research@signalatlas.com" style={{ fontSize: 13, color: 'var(--amber)', textDecoration: 'none' }}>research@signalatlas.com</a>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontWeight: 700, color: 'var(--navy)', marginBottom: '.25rem' }}>Media & Press</div>
              <a href="mailto:media@signalatlas.com" style={{ fontSize: 13, color: 'var(--amber)', textDecoration: 'none' }}>media@signalatlas.com</a>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontWeight: 700, color: 'var(--navy)', marginBottom: '.25rem' }}>General Contact</div>
              <a href="mailto:contact@signalatlas.com" style={{ fontSize: 13, color: 'var(--amber)', textDecoration: 'none' }}>contact@signalatlas.com</a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
