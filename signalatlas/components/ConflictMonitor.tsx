'use client';
import { useRouter } from 'next/navigation';
import type { Conflict } from '@/lib/types';

interface Props { conflicts: Conflict[]; }

const ALERT_CLASS: Record<string, string> = {
  CRITICAL: 'badge badge-red',
  HIGH:     'badge badge-amber',
  ACTIVE:   'badge badge-amber',
  WATCH:    'badge badge-green',
  RESOLVED: 'badge badge-neutral',
};

const ALERT_COLOR: Record<string, string> = {
  CRITICAL: 'var(--red)',
  HIGH:     'var(--amber)',
  ACTIVE:   'var(--amber)',
  WATCH:    'var(--green)',
};

const FALLBACK: Conflict[] = [
  { id: '1', name: 'Gaza–Israel',    region: 'Middle East', start_date: '2023-10-07', days_active: 596,  intensity: 9.5, alert_level: 'CRITICAL', status: 'active', description: null },
  { id: '2', name: 'Russia–Ukraine', region: 'Europe',      start_date: '2022-02-24', days_active: 1184, intensity: 9.2, alert_level: 'CRITICAL', status: 'active', description: null },
  { id: '3', name: 'Sudan',          region: 'Africa',       start_date: '2023-04-15', days_active: 398,  intensity: 8.1, alert_level: 'HIGH',     status: 'active', description: null },
  { id: '4', name: 'Myanmar Junta',  region: 'Asia',         start_date: '2021-02-01', days_active: 1180, intensity: 7.8, alert_level: 'HIGH',     status: 'active', description: null },
];

export default function ConflictMonitor({ conflicts }: Props) {
  const router = useRouter();
  const list = conflicts.length > 0 ? conflicts : FALLBACK;

  return (
    <div className="card card-pad fade" style={{ animationDelay: '0.1s' }}>
      <div className="sec-head">
        <div className="sec-bar" style={{ background: 'var(--red)' }} />
        <div className="sec-title">Conflict Monitor</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {list.map((c) => {
          const days = c.days_active ?? Math.floor((Date.now() - new Date(c.start_date).getTime()) / 86400000);
          const alertColor = ALERT_COLOR[c.alert_level ?? 'ACTIVE'] ?? 'var(--amber)';
          return (
            <div 
              key={c.id} 
              className="conflict-item lift" 
              onClick={() => router.push('/conflicts')}
              style={{ 
                padding: '16px', 
                background: 'var(--bg)', 
                borderRadius: 8, 
                borderLeft: `4px solid ${alertColor}`,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontWeight: 800, color: 'var(--ink)' }}>{c.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: alertColor, animation: c.alert_level === 'CRITICAL' ? 'pulse 1.5s infinite' : 'none' }} />
                  <span className={ALERT_CLASS[c.alert_level ?? 'ACTIVE']}>
                    {c.alert_level}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ fontSize: 13, color: 'var(--ink3)' }}>
                  {c.region} · Day {days.toLocaleString()}
                </div>
                <div style={{ fontSize: 16, fontFamily: 'var(--mono)', color: alertColor, fontWeight: 800 }}>
                  {c.intensity}/10
                </div>
              </div>

              {/* Graphic intensity visual */}
              <div style={{ marginTop: 12, height: 4, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${(c.intensity ?? 0) * 10}%`, 
                  background: alertColor,
                  transition: 'width 1s ease-out'
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
