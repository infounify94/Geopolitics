// SERVER COMPONENT — fully SSR'd for Google indexing
// Interactive form is isolated in ContactForm (client component)
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { submitContact } from './actions';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact SignalAtlas — Geopolitical Intelligence Platform',
  description: 'Contact the SignalAtlas team for intelligence report inquiries, media requests, research collaboration, or general questions about our geopolitical analysis platform.',
};

export default function ContactPage() {
  return (
    <>
      <Nav />

      {/* Dark navy header — matches other pages, fully server-rendered */}
      <div style={{ background: 'var(--navy)', padding: '3rem 2rem 2.5rem', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '.5rem' }}>
            Contact
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, color: 'var(--white)', letterSpacing: '-.02em', marginBottom: '.75rem' }}>
            Get in Touch
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.55)', maxWidth: 500, lineHeight: 1.7 }}>
            For intelligence report inquiries, media requests, research collaboration, or general questions.
          </p>
        </div>
      </div>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2rem', alignItems: 'start' }}>

          {/* Form — client component handles interactivity */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Send a Message
            </div>
            <ContactForm submitAction={submitContact} />
          </div>

          {/* Contact info sidebar — pure static HTML, crawled by Google */}
          <div>
            <div style={{ background: 'var(--navy)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1rem' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>Contact Details</div>
              {[
                ['📰', 'Press & Media', 'media@signalatlas.com'],
                ['🔬', 'Research', 'research@signalatlas.com'],
                ['🤝', 'General', 'hello@signalatlas.com'],
              ].map(([icon, label, email]) => (
                <div key={label} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span>{icon}</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'rgba(255,255,255,.5)', letterSpacing: '.06em', textTransform: 'uppercase' }}>{label}</span>
                  </div>
                  <a href={`mailto:${email}`} style={{ fontSize: 12, color: 'var(--amber)', textDecoration: 'none', fontFamily: 'var(--mono)' }}>{email}</a>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--off)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '.75rem' }}>Response Time</div>
              <p style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.7 }}>
                We respond to all inquiries within <strong>24–48 hours</strong> on business days. For urgent media requests, please mention URGENT in the subject line.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
