import type { SignalStat } from '@/lib/types';

interface Props { stats: SignalStat[]; articleCount: number; }

const FALLBACK: SignalStat[] = [
  { id: '1', key: 'articles',   value: '0',    label: 'Research Articles', delta: 'launching soon',  trend: 'neutral', color: '#1e3a5f' },
  { id: '2', key: 'conflicts',  value: '4',    label: 'Active Conflicts',  delta: 'updated live',   trend: 'neutral', color: '#b91c1c' },
  { id: '3', key: 'countries',  value: '87',   label: 'Countries Tracked', delta: 'updated daily',  trend: 'neutral', color: '#1c1c1e' },
  { id: '4', key: 'patterns',   value: '0',    label: 'Patterns Found',    delta: '+0 this month',  trend: 'neutral', color: '#14532d' },
  { id: '5', key: 'arms_trade', value: '$847B', label: 'Arms Trade 2024',  delta: '+14% YoY',       trend: 'down',    color: '#92400e' },
];

export default function SignalStrip({ stats, articleCount }: Props) {
  const display = stats.length > 0 ? stats : FALLBACK;

  // Inject live article count
  const withCount = display.map(s =>
    s.key === 'articles' ? { ...s, value: String(articleCount) } : s
  );

  return (
    <div className="signal-strip fade" style={{ animationDelay: '0s' }}>
      {withCount.map((s) => (
        <div key={s.key} className="signal-cell">
          <div className="signal-val" style={{ color: s.color ?? 'var(--ink)' }}>
            {s.value}
          </div>
          <div className="signal-label">{s.label}</div>
          <div className={`signal-delta delta-${s.trend ?? 'neutral'}`}>
            {s.trend === 'up' ? '↑' : s.trend === 'down' ? '↓' : '·'} {s.delta}
          </div>
        </div>
      ))}
    </div>
  );
}
