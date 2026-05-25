import Link from 'next/link';
import type { Article } from '@/lib/types';
import { CATEGORY_COLORS } from '@/lib/types';

interface Props {
  article: Article;
  index?: number;
  showSummary?: boolean;
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

export default function ArticleCard({ article, index = 0, showSummary = true }: Props) {
  const cat = CATEGORY_COLORS[article.category] ?? CATEGORY_COLORS['GENERAL'];
  const bullets = article.summary_bullets ?? [];
  const dataPoints = article.sources?.slice(0, 4) ?? [];

  return (
    <Link href={`/research/${article.slug}`}>
      <div
        className="card lift fade"
        style={{
          marginBottom: 14,
          animationDelay: `${0.05 + index * 0.08}s`,
          borderTop: `3px solid ${cat.color}`,
        }}
      >
        <div className="art-hero">
          {/* Category */}
          <div className="cat" style={{ background: cat.bg, color: cat.color }}>
            {article.category}
          </div>

          {/* Title */}
          <h2>{article.title}</h2>

          {/* Meta description / summary */}
          {showSummary && article.meta_description && (
            <p className="summary">{article.meta_description}</p>
          )}

          {/* Quick Summary bullets — #1 SEO feature */}
          {bullets.length > 0 && (
            <div className="quick-summary">
              <div className="quick-summary-label">QUICK BRIEF</div>
              <ul>
                {bullets.slice(0, 3).map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Confidence + Evidence badges */}
          {(article.confidence_level || article.evidence_level) && (
            <div className="conf-row">
              {article.confidence_level && (
                <span className={`badge badge-${article.confidence_level === 'High' ? 'green' : article.confidence_level === 'Medium' ? 'amber' : 'red'}`}>
                  ✓ {article.confidence_level} Confidence
                </span>
              )}
              {article.evidence_level && (
                <span className="badge badge-blue">
                  ◈ {article.evidence_level} Evidence
                </span>
              )}
              {article.source_count > 0 && (
                <span className="badge badge-neutral">{article.source_count} sources</span>
              )}
              {(article.sources as Array<{ name: string }>)?.slice(0, 2).map((s) => (
                <span key={s.name} className="badge badge-neutral">{s.name}</span>
              ))}
            </div>
          )}

          {/* Meta row */}
          <div className="art-meta" style={{ marginTop: 10 }}>
            <span>{timeAgo(article.published_at)}</span>
            {article.read_time_mins && (
              <>
                <span className="dot">·</span>
                <span>{article.read_time_mins} min read</span>
              </>
            )}
            {article.impact_score && (
              <>
                <span className="dot">·</span>
                <span style={{ fontFamily: 'var(--serif)', color: article.impact_score >= 8.5 ? 'var(--red)' : 'var(--amber)', fontWeight: 700, fontSize: 13 }}>
                  {article.impact_score} impact
                </span>
              </>
            )}
            {article.countries?.length > 0 && (
              <>
                <span className="dot">·</span>
                <span>{article.countries.slice(0, 2).join(', ')}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
