'use client';
import { getDaysActive } from '@/lib/conflictData';
import type { TickerItem } from '@/lib/types';

interface Props {
  items: TickerItem[];
}

// Conflict start dates for dynamic day computation — single source of truth
const CONFLICT_STARTS: { text: string; startDate: string; level: 'critical' | 'high' | 'medium' }[] = [
  { text: 'Gaza–Israel War',        startDate: '2023-10-07', level: 'critical' },
  { text: 'Russia–Ukraine War',     startDate: '2022-02-24', level: 'critical' },
  { text: 'Sudan Civil War',        startDate: '2023-04-15', level: 'high' },
  { text: 'US–Iran Tensions',       startDate: '2024-01-01', level: 'high' },
  { text: 'Strait of Hormuz',       startDate: '2023-11-19', level: 'high' },
];

export default function Ticker({ items }: Props) {
  // Dynamic fallback: compute day counts at render time — never stale
  const fallbackItems = CONFLICT_STARTS.map(c => ({
    text: `${c.text} — Day ${getDaysActive(c.startDate).toLocaleString()}`,
    level: c.level,
  }));

  const tickerItems = items.length > 0
    ? items.map(i => ({ text: i.text, level: 'medium' as const }))
    : fallbackItems;

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
