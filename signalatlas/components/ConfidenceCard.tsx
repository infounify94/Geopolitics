import type { Article, Source } from '@/lib/types';

interface Props { article: Article; }

const CONFIDENCE_WIDTH: Record<string, string> = { High: '90%', Medium: '60%', Low: '30%' };
const EVIDENCE_WIDTH: Record<string, string>   = { Strong: '90%', Moderate: '60%', Limited: '30%' };
const CONFIDENCE_COLOR: Record<string, string> = { High: 'var(--green)', Medium: 'var(--amber)', Low: 'var(--red)' };

export default function ConfidenceCard({ article }: Props) {
  const { confidence_level, evidence_level, source_count, sources, impact_score, pattern_score } = article;
  const conf = confidence_level ?? 'Medium';
  const evid = evidence_level ?? 'Moderate';

  return (
    <div className="confidence-card">
      <h3>Research Confidence Card</h3>
      <p style={{ fontSize: 12, color: 'var(--ink4)', marginBottom: 16 }}>
        How we rate the reliability of this research
      </p>

      {/* Confidence meter */}
      <div className="conf-meter">
        <div className="conf-meter-label">CONFIDENCE LEVEL · {conf.toUpperCase()}</div>
        <div className="conf-bar">
          <div
            className="conf-fill"
            style={{ width: CONFIDENCE_WIDTH[conf] ?? '60%', background: CONFIDENCE_COLOR[conf] ?? 'var(--amber)' }}
          />
        </div>
      </div>

      {/* Evidence meter */}
      <div className="conf-meter">
        <div className="conf-meter-label">EVIDENCE QUALITY · {evid.toUpperCase()}</div>
        <div className="conf-bar">
          <div
            className="conf-fill"
            style={{ width: EVIDENCE_WIDTH[evid] ?? '60%', background: 'var(--blue)' }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 12, margin: '14px 0', flexWrap: 'wrap' }}>
        {source_count > 0 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 20, color: 'var(--blue)' }}>{source_count}</div>
            <div style={{ fontSize: 10, color: 'var(--ink4)' }}>Sources Used</div>
          </div>
        )}
        {impact_score && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: 20, color: impact_score >= 8 ? 'var(--red)' : 'var(--amber)' }}>{impact_score}</div>
            <div style={{ fontSize: 10, color: 'var(--ink4)' }}>Impact Score</div>
          </div>
        )}
        {pattern_score && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 20, color: 'var(--purple)' }}>{pattern_score}/10</div>
            <div style={{ fontSize: 10, color: 'var(--ink4)' }}>Pattern Match</div>
          </div>
        )}
      </div>

      {/* Source list */}
      {sources && (sources as Source[]).length > 0 && (
        <div className="source-list">
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--ink3)', marginBottom: 8 }}>SOURCES REFERENCED</div>
          {(sources as Source[]).map((s, i) => (
            <div key={i} className="source-item">
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--blue)', flexShrink: 0 }} />
              <span style={{ fontWeight: 500 }}>{s.name}</span>
              {s.type && <span style={{ color: 'var(--ink4)', fontSize: 11 }}>{s.type}</span>}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 14, fontSize: 11, color: 'var(--ink4)', lineHeight: 1.6 }}>
        All factual claims are attributed to publicly available sources. Opinion is clearly framed as analysis.
      </div>
    </div>
  );
}
