'use client';
import type { TickerItem } from '@/lib/types';
import type { Conflict } from '@/lib/types';

interface Props {
  items: TickerItem[];
  conflicts?: Conflict[];
}

const FALLBACK_ITEMS = [
  { text: 'Gaza–Israel — Day 961 · Impact 9.5', level: 'critical' },
  { text: 'Russia–Ukraine — Day 1,551 · Active Frontlines', level: 'critical' },
  { text: 'Sudan Civil War — Ceasefire talks collapsed', level: 'high' },
  { text: 'US–Iran nuclear talks — Uranium enrichment gap remains', level: 'high' },
  { text: 'Apple India pivot — Supply chain shift accelerates', level: 'medium' },
  { text: 'Strait of Hormuz — Shipping disruptions escalating', level: 'high' },
  { text: 'Marco Rubio India visit — Tariffs & tech on agenda', level: 'medium' },
];

export default function Ticker({ items, conflicts }: Props) {
  const tickerItems = items.length > 0
    ? items.map(i => ({ text: i.text, level: 'medium' }))
    : FALLBACK_ITEMS;

  // Duplicate for seamless loop
  const doubled = [...tickerItems, ...tickerItems];

  return (
    <div className="ticker-wrap">
      <div className="ticker-inner">
        <div className="ticker-label">● LIVE INTEL</div>
        <div className="ticker-track">
          <div className="ticker-items">
            {doubled.map((item, i) => (
              <div key={i} className="ticker-item">
                <span className={`ticker-dot ${item.level}`} />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
