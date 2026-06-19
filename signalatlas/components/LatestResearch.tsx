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
            {/* Editorial Standards */}
            <div className="sidebar-card">
              <div className="sc-title">Editorial Standards</div>
              {[
                { icon: '📎', label: '3+ Sources', desc: 'Every claim requires minimum 3 named, linkable sources' },
                { icon: '🔬', label: 'Confidence Scoring', desc: 'High / Medium / Low — based on source quality and count' },
                { icon: '🇮🇳', label: 'India Lens', desc: 'Every article analysed for India strategic implications' },
                { icon: '📅', label: 'Timestamped Updates', desc: 'Breaking events updated in-place, not republished' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--navy)', fontFamily: 'var(--mono)', letterSpacing: '.04em' }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink3)', lineHeight: 1.5, marginTop: 2 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
              <a href="/methodology" style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.06em', textDecoration: 'none', display: 'block', marginTop: 4 }}>Read full methodology →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
