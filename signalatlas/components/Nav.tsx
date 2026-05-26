'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import Ticker from './Ticker';
import { supabase } from '@/lib/supabase';

const PERSPECTIVES = [
  { label: 'India Lens',      sub: 'South Asia strategic analysis',    href: '/topics/india-lens'      },
  { label: 'Asia Outlook',    sub: 'China, Japan, ASEAN dynamics',     href: '/topics/asia'            },
  { label: 'Energy & Trade',  sub: 'Oil, LNG, supply chains',          href: '/topics/energy-trade'    },
  { label: 'Power Networks',  sub: 'Influence mapping & state capture', href: '/topics/power-networks'  },
  { label: 'Sanctions Intel', sub: 'Economic warfare & enforcement',    href: '/topics/sanctions'       },
  { label: 'Arms & Security', sub: 'Defence transfers & doctrines',     href: '/topics/arms-trade'      },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [perspOpen, setPerspOpen] = useState(false);
  const perspRef = useRef<HTMLDivElement>(null);
  const [tickerItems, setTickerItems] = useState<any[]>([]);

  useEffect(() => {
    async function loadTicker() {
      try {
        const { data } = await supabase
          .from('ticker_items')
          .select('*')
          .eq('active', true)
          .order('priority');
        if (data && data.length > 0) {
          setTickerItems(data);
        }
      } catch (err) {
        console.warn('Failed to fetch live ticker items:', err);
      }
    }
    loadTicker();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (perspRef.current && !perspRef.current.contains(e.target as Node)) {
        setPerspOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <Ticker items={tickerItems} />
      <nav className="nav">
      <div className="nav-inner">
        {/* Logo */}
        <Link href="/" className="logo">
          <div className="logo-mark">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width={32} height={32}>
              <rect x="1" y="1" width="30" height="30" rx="2" stroke="#0B1628" strokeWidth="1.5"/>
              <circle cx="16" cy="16" r="10" stroke="#0B1628" strokeWidth="1" strokeDasharray="2 2"/>
              <circle cx="16" cy="16" r="5" stroke="#C8760A" strokeWidth="1.5"/>
              <circle cx="16" cy="16" r="2" fill="#C8760A"/>
              <line x1="16" y1="1" x2="16" y2="31" stroke="#0B1628" strokeWidth=".5" opacity=".3"/>
              <line x1="1" y1="16" x2="31" y2="16" stroke="#0B1628" strokeWidth=".5" opacity=".3"/>
            </svg>
          </div>
          <div>
            <div className="logo-text">SignalAtlas</div>
            <div className="logo-sub">Global Intelligence Platform</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="nav-links">
          <Link href="/conflicts" className="nav-link">Conflicts</Link>
          <Link href="/countries" className="nav-link">Countries</Link>
          <Link href="/topics"    className="nav-link">Topics</Link>
          <Link href="/research"  className="nav-link">Research</Link>

          {/* Perspectives dropdown */}
          <div ref={perspRef} style={{ position: 'relative' }}>
            <button
              className="nav-link"
              onClick={() => setPerspOpen(!perspOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
            >
              Perspectives
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transition: 'transform .2s', transform: perspOpen ? 'rotate(180deg)' : 'none' }}>
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            {perspOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 12px)', left: '50%', transform: 'translateX(-50%)',
                background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '4px',
                boxShadow: '0 8px 32px rgba(11,22,40,.12)', minWidth: 260, zIndex: 200,
              }}>
                <div style={{ padding: '8px 0' }}>
                  {PERSPECTIVES.map(p => (
                    <Link
                      key={p.label}
                      href={p.href}
                      onClick={() => setPerspOpen(false)}
                      style={{ display: 'block', padding: '10px 16px', transition: 'background .12s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--off)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--navy)', marginBottom: 2 }}>{p.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink3)' }}>{p.sub}</div>
                    </Link>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid var(--border)', padding: '8px 16px' }}>
                  <Link href="/topics" onClick={() => setPerspOpen(false)} style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--amber)', letterSpacing: '.06em' }}>
                    View all topics ↗
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="nav-live">
            <div className="nav-live-dot" />
            LIVE
          </div>
          <Link href="#subscribe" className="nav-link nav-cta">Subscribe →</Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ display: 'flex', flexDirection: 'column', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
          aria-label="Toggle menu"
        >
          <div style={{ width: 24, height: 2, background: 'var(--ink)', transition: '0.3s', transform: mobileOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
          <div style={{ width: 24, height: 2, background: 'var(--ink)', transition: '0.3s', opacity: mobileOpen ? 0 : 1 }} />
          <div style={{ width: 24, height: 2, background: 'var(--ink)', transition: '0.3s', transform: mobileOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '20px 2rem', display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 99 }}>
          {[
            ['Conflicts',    '/conflicts'],
            ['Countries',    '/countries'],
            ['Topics',       '/topics'],
            ['Research',     '/research'],
            ['India Lens',   '/topics/india-lens'],
            ['Asia Outlook', '/topics/asia'],
            ['Energy & Trade','/topics/energy-trade'],
          ].map(([label, href]) => (
            <Link key={label} href={href} onClick={() => setMobileOpen(false)} style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink2)', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              {label}
            </Link>
          ))}
          <Link href="#subscribe" onClick={() => setMobileOpen(false)} style={{ fontSize: 14, fontWeight: 600, color: 'var(--amber)', padding: '10px 0', fontFamily: 'var(--mono)', letterSpacing: '.04em' }}>
            Subscribe →
          </Link>
        </div>
      )}
    </nav>
    </>
  );
}
