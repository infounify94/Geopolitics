'use client';
import Link from 'next/link';
import type { Conflict } from '@/lib/types';

interface Props { conflicts: Conflict[]; }

const FALLBACK: Conflict[] = [
  { id:'1', name:'Gaza–Israel War',   region:'Middle East', start_date:'2023-10-07', intensity:9.5, alert_level:'CRITICAL', status:'active', description:null },
  { id:'2', name:'Russia–Ukraine War',region:'Europe',      start_date:'2022-02-24', intensity:9.2, alert_level:'CRITICAL', status:'active', description:null },
  { id:'3', name:'Sudan Civil War',   region:'Africa',      start_date:'2023-04-15', intensity:8.1, alert_level:'HIGH',     status:'active', description:null },
  { id:'4', name:'Myanmar Junta',     region:'Asia',        start_date:'2021-02-01', intensity:7.8, alert_level:'HIGH',     status:'active', description:null },
];

export default function ConflictMonitor({ conflicts }: Props) {
  const list = (conflicts.length > 0 ? conflicts : FALLBACK).slice(0, 4);

  return (
    <div className="conflict-bg">
      <div className="conflict-section">
        <div className="section-header reveal">
          <div>
            <div className="section-num">02 — Conflict Monitor</div>
            <div className="section-title">Active Conflict Tracker</div>
          </div>
          <Link href="/conflicts" className="section-link">Full Monitor ↗</Link>
        </div>

        <div className="conflict-grid reveal">
          {list.map((c) => {
            const days = c.days_active ?? Math.floor((Date.now() - new Date(c.start_date).getTime()) / 86400000);
            const isCritical = c.alert_level === 'CRITICAL';
            const barColor   = isCritical ? '#FF4444' : 'var(--amber2)';
            const cardClass  = isCritical ? 'cmon-card cmon-critical' : 'cmon-card cmon-high';
            const badgeClass = isCritical ? 'cmon-badge critical' : 'cmon-badge high';
            const barWidth   = `${((c.intensity ?? 0) / 10) * 100}%`;

            return (
              <div key={c.id} className={cardClass}>
                <div className="cmon-region">{c.region}</div>
                <div className="cmon-name">{c.name}</div>
                <div className="cmon-status">
                  <span className={badgeClass}>{c.alert_level}</span>
                  <span className="cmon-day">Day {days.toLocaleString()}</span>
                </div>
                <div className="cmon-bar-wrap">
                  <div className="cmon-bar-track">
                    <div className="cmon-bar-fill" style={{ width: barWidth, background: barColor }} />
                  </div>
                  <div className="cmon-score">
                    <span>Severity</span>
                    <span>{c.intensity} / 10</span>
                  </div>
                </div>

                {/* Pulse SVG */}
                <svg className="cmon-pulse" viewBox="0 0 28 28">
                  {isCritical ? (
                    <>
                      <circle cx="14" cy="14" r="8" stroke={barColor} strokeWidth="1.5" fill="none"
                        style={{ animation: 'pulseRing 2s ease-in-out infinite' }} />
                      <circle cx="14" cy="14" r="4" fill={barColor} opacity=".9" />
                    </>
                  ) : (
                    <>
                      <circle cx="14" cy="14" r="8" stroke={barColor} strokeWidth="1.5" fill="none" opacity=".5" />
                      <circle cx="14" cy="14" r="4" fill={barColor} opacity=".8" />
                    </>
                  )}
                </svg>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
