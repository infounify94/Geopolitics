import Link from 'next/link';
import type { Article } from '@/lib/types';

interface Props { articles: Article[]; }

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

const BIAS_DATA = [
  { outlet: 'Reuters',    label: 'Neutral',      pct: 82, color: '#3B6D11' },
  { outlet: 'BBC',        label: 'Slight West',  pct: 71, color: '#1A5F9C' },
  { outlet: 'Al Jazeera', label: 'Gulf bias',    pct: 65, color: 'var(--amber)' },
  { outlet: 'NDTV',       label: 'India-first',  pct: 54, color: '#6B3AB7' },
];

const TIMELINE = [
  { year: '2022', title: 'Ukraine War Begins',    pattern: 'Proxy War'       },
  { year: '2023', title: 'Niger Coup',            pattern: 'Anti-West Wave'  },
  { year: '2024', title: 'Venezuela Crisis',      pattern: 'Protest Pattern' },
  { year: '2025', title: 'Haiti State Collapse',  pattern: 'State Failure'   },
];

export default function LatestResearch({ articles }: Props) {
  return (
    <div style={{ background: 'var(--off)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '3.5rem 0' }}>
      <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="section-header reveal">
          <div>
            <div className="section-num">04 — Latest Intelligence</div>
            <div className="section-title">Most Recent Published</div>
          </div>
          <Link href="/research" className="section-link">Full Feed ↗</Link>
        </div>

        <div className="feed-layout reveal">
          {/* Feed list */}
          <div className="feed-list">
            {articles.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--ink3)', fontSize: 14 }}>
                First articles publishing soon...
              </div>
            ) : (
              articles.slice(0, 6).map((a) => {
                const confColor = a.confidence_level === 'High' ? 'var(--green)'
                                : a.confidence_level === 'Medium' ? 'var(--amber)' : 'var(--red)';
                const confClass = a.confidence_level === 'High' ? 'conf-high'
                                : a.confidence_level === 'Medium' ? 'conf-med' : 'conf-low';
                return (
                  <Link key={a.id} href={`/research/${a.slug}`} className="feed-item">
                    <div>
                      <div className="fi-cat">{a.category}</div>
                      <div className="fi-title">{a.title}</div>
                      <div className="fi-meta">
                        {a.impact_score && <span className="fi-impact">{a.impact_score}</span>}
                        <span className={`conf-dot ${confClass}`} style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
                        <span style={{ fontSize: 10, color: confColor }}>{a.confidence_level}</span>
                        <span className="fi-time">{timeAgo(a.published_at)}{a.read_time_mins ? ` · ${a.read_time_mins} min` : ''}</span>
                      </div>
                    </div>
                    <div className="fi-countries">
                      {a.countries?.slice(0, 2).join(' · ')}
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Media bias tracker */}
            <div className="sidebar-card">
              <div className="sc-title">Media Coverage Bias Tracker</div>
              {BIAS_DATA.map((b) => (
                <div key={b.outlet} className="bias-bar-row">
                  <div className="bias-outlet">
                    <span>{b.outlet}</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)' }}>{b.label}</span>
                  </div>
                  <div className="bias-track">
                    <div className="bias-fill" style={{ width: `${b.pct}%`, background: b.color }} />
                  </div>
                  <div className="bias-label">Coverage: {b.pct}%</div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div className="sidebar-card">
              <div className="sc-title">Global Event Timeline</div>
              <div className="timeline-wrap">
                {TIMELINE.map((t) => (
                  <div key={t.year} className="tl-event">
                    <div className="tl-year">{t.year}</div>
                    <div className="tl-title">{t.title}</div>
                    <div className="tl-pattern">Pattern: {t.pattern}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
