import Link from 'next/link';
import type { Article } from '@/lib/types';

interface Props { article: Article; variant?: 'main' | 'card'; }

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

function catClass(cat: string): string {
  const map: Record<string, string> = {
    'POWER NETWORKS':   'cat-power',
    'ECONOMIC WARFARE': 'cat-economic',
    'INDIA LENS':       'cat-india',
    'CONFLICTS':        'cat-conflicts',
    'MEDIA BIAS':       'cat-media',
    'SANCTIONS':        'cat-sanctions',
    'ARMS TRADE':       'cat-arms',
    'GLOBAL SOUTH':     'cat-global',
    'GENERAL':          'cat-general',
  };
  return map[cat] ?? 'cat-general';
}

function confClass(level: string | null): string {
  if (level === 'High')   return 'conf-high';
  if (level === 'Medium') return 'conf-med';
  return 'conf-low';
}

function confColor(level: string | null): string {
  if (level === 'High')   return 'var(--green)';
  if (level === 'Medium') return 'var(--amber)';
  return 'var(--red)';
}

export default function ArticleCard({ article, variant = 'main' }: Props) {
  if (variant === 'card') {
    return (
      <Link href={`/research/${article.slug}`} className="fg-card">
        <span className={`cat-badge ${catClass(article.category)}`}>{article.category}</span>
        <h3 className="fg-headline">{article.title}</h3>
        <div className="fg-meta">
          <div className="fg-conf">
            <span className={`conf-dot ${confClass(article.confidence_level)}`} />
            <span style={{ fontSize: 10, color: confColor(article.confidence_level), fontWeight: 500 }}>{article.confidence_level}</span>
          </div>
          <span className="impact-badge">{article.impact_score}</span>
          {article.read_time_mins && <span style={{ fontSize: 11, color: 'var(--ink3)' }}>{article.read_time_mins} min</span>}
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/research/${article.slug}`} className="fg-main">
      <span className={`cat-badge ${catClass(article.category)}`}>{article.category}</span>
      <h2 className="fg-headline">{article.title}</h2>
      {article.meta_description && (
        <p className="fg-desc">{article.meta_description}</p>
      )}
      <div className="fg-meta">
        <div className="fg-conf">
          <span className={`conf-dot ${confClass(article.confidence_level)}`} />
          <span style={{ fontSize: 11, color: confColor(article.confidence_level), fontWeight: 500 }}>
            {article.confidence_level} Confidence
          </span>
        </div>
        <span className="impact-badge">Impact {article.impact_score}</span>
        {article.read_time_mins && <span>{article.read_time_mins} min read</span>}
        {article.countries?.length > 0 && (
          <><span>·</span><span>{article.countries.slice(0, 2).join(', ')}</span></>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ink3)' }}>{timeAgo(article.published_at)}</span>
      </div>
    </Link>
  );
}
