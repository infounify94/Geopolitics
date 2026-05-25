'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Nav() {
  const [time, setTime] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const update = () => setTime(new Date().toUTCString().slice(0, 22) + ' UTC');
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="logo">
          <div className="logo-mark" />
          <div className="logo-text">Signal<span>Atlas</span></div>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links">
          {['Conflicts', 'Countries', 'Topics', 'Research', 'About'].map(l => (
            <Link key={l} href={`/${l.toLowerCase()}`} className="nav-link">{l}</Link>
          ))}
        </div>

        <div className="nav-right">
          <div className="live-dot" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: 'var(--red)', letterSpacing: '0.04em' }}>
            <div className="live-circle" style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--red)' }} />
            LIVE
          </div>
          <div className="nav-time" style={{ display: 'none' }}>{time}</div>
          <button className="btn-sub" style={{ display: 'none' }}>Subscribe</button>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 4, 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              padding: 8,
              zIndex: 100
            }}
          >
            <div style={{ width: 24, height: 2, background: 'var(--ink)', transition: '0.3s', transform: mobileOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
            <div style={{ width: 24, height: 2, background: 'var(--ink)', transition: '0.3s', opacity: mobileOpen ? 0 : 1 }} />
            <div style={{ width: 24, height: 2, background: 'var(--ink)', transition: '0.3s', transform: mobileOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {mobileOpen && (
        <div style={{
          position: 'absolute',
          top: 60,
          left: 0,
          right: 0,
          background: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          zIndex: 99
        }}>
          {['Conflicts', 'Countries', 'Topics', 'Research', 'About', 'Contact'].map(l => (
            <Link 
              key={l} 
              href={`/${l.toLowerCase()}`} 
              onClick={() => setMobileOpen(false)}
              style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink2)', padding: '8px 0', borderBottom: '1px solid var(--bg2)' }}
            >
              {l}
            </Link>
          ))}
          <div style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 8 }}>{time}</div>
        </div>
      )}
    </nav>
  );
}
