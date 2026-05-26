'use client';
import { useState } from 'react';

interface ContactFormProps {
  submitAction: (formData: FormData) => Promise<{ success?: boolean; message?: string; error?: string }>;
}

export default function ContactForm({ submitAction }: ContactFormProps) {
  const [status, setStatus] = useState<{type: 'success' | 'error'; message: string} | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const formData = new FormData(e.currentTarget);
    const result = await submitAction(formData);
    if (result.error) {
      setStatus({ type: 'error', message: result.error });
    } else if (result.success) {
      setStatus({ type: 'success', message: result.message! });
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 6, border: '1px solid var(--border)',
    background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--sans)',
  };
  const labelStyle = { display: 'block' as const, marginBottom: 8, fontSize: 13, fontWeight: 600, color: 'var(--ink2)' };

  return (
    <>
      {status && (
        <div style={{
          padding: 16, marginBottom: 24, borderRadius: 6,
          backgroundColor: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
          color: status.type === 'success' ? '#166534' : '#991b1b',
          border: `1px solid ${status.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
        }}>
          {status.message}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label htmlFor="name" style={labelStyle}>Full Name</label>
          <input type="text" id="name" name="name" required style={inputStyle} placeholder="Jane Doe" />
        </div>
        <div>
          <label htmlFor="email" style={labelStyle}>Email Address</label>
          <input type="email" id="email" name="email" required style={inputStyle} placeholder="jane@example.com" />
        </div>
        <div>
          <label htmlFor="subject" style={labelStyle}>Subject</label>
          <select id="subject" name="subject" style={inputStyle}>
            <option>Intelligence Report Inquiry</option>
            <option>Media Request</option>
            <option>Research Collaboration</option>
            <option>General Question</option>
          </select>
        </div>
        <div>
          <label htmlFor="message" style={labelStyle}>Message</label>
          <textarea id="message" name="message" required rows={5} style={{ ...inputStyle, resize: 'vertical' }} placeholder="How can we help you?" />
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
    </>
  );
}
