'use client';
import { useState, useEffect } from 'react';
import type { TickerItem } from '@/lib/types';

interface Props { items: TickerItem[]; }

const FALLBACK = [
  'SignalAtlas — Geopolitics research intelligence launching soon',
  'Evidence-based research with confidence scoring on every article',
  'India Lens: every global event analyzed for India impact',
];

export default function Ticker({ items }: Props) {
  const texts = items.length > 0 ? items.map(i => i.text) : FALLBACK;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(p => (p + 1) % texts.length), 4500);
    return () => clearInterval(t);
  }, [texts.length]);

  return (
    <div className="ticker">
      <div className="ticker-inner">
        <div className="ticker-label">INTEL</div>
        <div className="ticker-text" key={tick}>{texts[tick]}</div>
      </div>
    </div>
  );
}
