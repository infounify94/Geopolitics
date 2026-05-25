import Link from 'next/link';
import type { Article } from '@/lib/types';
import { CATEGORY_COLORS } from '@/lib/types';

interface Props { articles: Article[]; }

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export default function LatestResearch({ articles }: Props) {
  if (articles.length === 0) {
    return (
      <div className="card card-pad fade" style={{ animationDelay: '0.22s' }}>
        <div className="sec-head">
          <div className="sec-bar" style={{ background: 'var(--ink)' }} />
          <div className="sec-title">Latest Published</div>
        </div>
        <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--ink4)', fontSize: 12 }}>
          First articles coming soon...
        </div>
      </div>
    );
  }

  return (
    <div className="card card-pad fade" style={{ animationDelay: '0.22s' }}>
      <div className="sec-head">
        <div className="sec-bar" style={{ background: 'var(--ink)' }} />
        <div className="sec-title">Latest Published</div>
      </div>
      {articles.map((r, i) => {
        const cat = CATEGORY_COLORS[r.category] ?? CATEGORY_COLORS['GENERAL'];
        return (
          <Link key={r.id} href={`/research/${r.slug}`}>
            <div className="recent-item lift" style={{ borderBottom: i < articles.length - 1 ? '1px solid var(--bg2)' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span className="badge" style={{ background: cat.bg, color: cat.color, fontSize: 9 }}>
                  {r.category}
                </span>
                <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--ink4)' }}>
                  {timeAgo(r.published_at)} ago
                </span>
              </div>
              <div className="recent-title">{r.title}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge badge-${r.confidence_level === 'High' ? 'green' : r.confidence_level === 'Medium' ? 'amber' : 'neutral'}`}>
                  {r.confidence_level ?? 'Unrated'}
                </span>
                {r.impact_score && (
                  <span style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 700, color: r.impact_score >= 8.5 ? 'var(--red)' : 'var(--amber)' }}>
                    {r.impact_score}
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
