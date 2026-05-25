'use client';
import { useState } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { submitContact } from './actions';

export default function ContactPage() {
  const [status, setStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await submitContact(formData);
    
    if (result.error) {
      setStatus({ type: 'error', message: result.error });
    } else if (result.success) {
      setStatus({ type: 'success', message: result.message! });
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  }

  return (
    <>
      <Nav />
      <main className="main" style={{ padding: '80px 20px', maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 24, color: 'var(--ink)' }}>Contact Us</h1>
        
        <div className="card card-pad" style={{ padding: 40 }}>
          <p style={{ marginBottom: 30, color: 'var(--ink3)' }}>
            For inquiries regarding our intelligence reports, media requests, or general questions, please fill out the form below.
          </p>

          {status && (
            <div style={{
              padding: 16, 
              marginBottom: 24, 
              borderRadius: 6, 
              backgroundColor: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
              color: status.type === 'success' ? '#166534' : '#991b1b',
              border: `1px solid ${status.type === 'success' ? '#bbf7d0' : '#fecaca'}`
            }}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label htmlFor="name" style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: 'var(--ink2)' }}>Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                style={{ width: '100%', padding: '12px 16px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--sans)' }}
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: 'var(--ink2)' }}>Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                style={{ width: '100%', padding: '12px 16px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--sans)' }}
                placeholder="jane@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: 'var(--ink2)' }}>Message</label>
              <textarea 
                id="message" 
                name="message" 
                required 
                rows={5}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--sans)', resize: 'vertical' }}
                placeholder="How can we help you?"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-sub"
              style={{ padding: '14px 24px', alignSelf: 'flex-start', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
