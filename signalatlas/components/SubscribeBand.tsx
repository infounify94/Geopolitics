'use client';
import { useState } from 'react';
import { subscribeEmail } from '@/lib/queries';

export default function SubscribeBand() {
  const [email, setEmail]   = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg]       = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    const res = await subscribeEmail(email);
    if (res.success) {
      setStatus('success');
      setMsg('You\'re in! First briefing arrives Friday.');
      setEmail('');
    } else {
      setStatus('error');
      setMsg(res.error ?? 'Something went wrong.');
    }
  };

  return (
    <div className="subscribe-band" id="subscribe">
      <div className="subscribe-inner">
        <div className="subscribe-eyebrow">Intelligence Briefing</div>
        <h2 className="subscribe-title">Stay Ahead of Every Signal</h2>
        <p className="subscribe-desc">
          Weekly deep-research digest — the 3 stories that actually matter, with India context,
          confidence scores, and pattern analysis. No noise.
        </p>

        {status === 'success' ? (
          <div style={{ background: 'rgba(26,107,60,.25)', border: '1px solid rgba(26,107,60,.4)', borderRadius: 'var(--radius)', padding: '14px 20px', color: '#6EE7A0', fontFamily: 'var(--mono)', fontSize: 13 }}>
            ✓ {msg}
          </div>
        ) : (
          <form className="subscribe-form" onSubmit={handleSubmit}>
            <input
              className="subscribe-input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={status === 'loading'}
              required
            />
            <button className="subscribe-btn" type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Subscribing...' : 'Subscribe →'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <div style={{ marginTop: 8, fontSize: 12, color: '#FF8A80', fontFamily: 'var(--mono)' }}>{msg}</div>
        )}

        <div className="subscribe-note">Free · Weekly · No spam · Unsubscribe anytime</div>
      </div>
    </div>
  );
}
