'use client';
import { useState } from 'react';
import type { Article, Source } from '@/lib/types';

interface Props { article: Article; }

// Thin SVG arc for circular gauges
function CircleGauge({
  value, max = 10, color, label, size = 72,
}: { value: number; max?: number; color: string; label: string; size?: number }) {
  const r = size / 2 - 7;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const dash = pct * circ;
  const gap = circ - dash;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={5} />
        {/* Fill */}
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth={5}
          strokeDasharray={`${dash} ${gap}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
        {/* Value text */}
        <text
          x={cx} y={cy + 1}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={size === 72 ? 14 : 11}
          fontWeight={700}
          fontFamily="var(--serif)"
          fill={color}
        >
          {value.toFixed(1)}
        </text>
      </svg>
      <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--ink4)', textAlign: 'center', maxWidth: size }}>
        {label}
      </div>
    </div>
  );
}

// Horizontal bar with animated fill
function BarMeter({
  label, value, color, subtitle,
}: { label: string; value: number; color: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--ink3)' }}>{label}</div>
        <div style={{ fontSize: 10, color, fontWeight: 700 }}>{subtitle}</div>
      </div>
      <div style={{
        height: 5, background: 'var(--bg2)', borderRadius: 99, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${value}%`, background: color,
          borderRadius: 99, transition: 'width 1.2s cubic-bezier(.22,1,.36,1)',
        }} />
      </div>
    </div>
  );
}

// Mini pentagon radar SVG for 3 scores
function RadarTriangle({ impact, pattern, evergreen }: { impact: number; pattern: number; evergreen: number }) {
  const cx = 70, cy = 70, r = 50;
  const angles = [-90, 30, 150]; // top, bottom-right, bottom-left

  function pt(angle: number, val: number) {
    const rad = (angle * Math.PI) / 180;
    const v = (val / 10) * r;
    return { x: cx + v * Math.cos(rad), y: cy + v * Math.sin(rad) };
  }

  const pts = [
    pt(angles[0], impact),
    pt(angles[1], pattern),
    pt(angles[2], evergreen),
  ];
  const poly = pts.map(p => `${p.x},${p.y}`).join(' ');

  const gridVals = [2, 4, 6, 8, 10];
  const labels = ['IMPACT', 'PATTERN', 'EVERGREEN'];
  const labelAngles = [-80, 40, 160];
  const labelDist = r + 14;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--ink4)', marginBottom: 6 }}>
        SIGNAL RADAR
      </div>
      <svg width={140} height={140} viewBox="0 0 140 140">
        {/* Grid rings */}
        {gridVals.map(v => {
          const gridPts = angles.map(a => pt(a, v));
          const gPoly = gridPts.map(p => `${p.x},${p.y}`).join(' ');
          return <polygon key={v} points={gPoly} fill="none" stroke="var(--border)" strokeWidth={0.5} />;
        })}
        {/* Axis lines */}
        {angles.map((a, i) => {
          const end = pt(a, 10);
          return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="var(--border)" strokeWidth={0.5} />;
        })}
        {/* Filled polygon */}
        <polygon
          points={poly}
          fill="var(--blue)"
          fillOpacity={0.15}
          stroke="var(--blue)"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {/* Dots */}
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill="var(--blue)" />
        ))}
        {/* Labels */}
        {labels.map((l, i) => {
          const rad = (labelAngles[i] * Math.PI) / 180;
          const lx = cx + labelDist * Math.cos(rad);
          const ly = cy + labelDist * Math.sin(rad);
          return (
            <text key={i} x={lx} y={ly}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={7} fontWeight={600}
              fontFamily="var(--mono)"
              fill="var(--ink4)"
              letterSpacing="0.06em"
            >{l}</text>
          );
        })}
      </svg>
    </div>
  );
}

const CONFIDENCE_MAP: Record<string, { pct: number; color: string }> = {
  High:   { pct: 90, color: 'var(--green)' },
  Medium: { pct: 58, color: 'var(--amber)' },
  Low:    { pct: 28, color: 'var(--red)' },
};

const EVIDENCE_MAP: Record<string, { pct: number; color: string }> = {
  Strong:   { pct: 90, color: 'var(--blue)' },
  Moderate: { pct: 58, color: 'var(--amber)' },
  Limited:  { pct: 28, color: 'var(--red)' },
};

export default function ConfidenceCard({ article }: Props) {
  const [expanded, setExpanded] = useState(false);
  const {
    confidence_level, evidence_level, source_count,
    sources, impact_score, pattern_score, evergreen_score,
  } = article;

  const conf = confidence_level ?? 'Medium';
  const evid = evidence_level ?? 'Moderate';
  const confMeta = CONFIDENCE_MAP[conf] ?? CONFIDENCE_MAP['Medium'];
  const evidMeta = EVIDENCE_MAP[evid] ?? EVIDENCE_MAP['Moderate'];

  const impact   = impact_score ?? 7;
  const pattern  = pattern_score ?? 5;
  const evergreen = evergreen_score ?? 5;

  return (
    <div style={{
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 18px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg2)',
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--ink3)' }}>
            RESEARCH CONFIDENCE CARD
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink4)', marginTop: 2 }}>
            How we rate the reliability of this analysis
          </div>
        </div>
        <div style={{
          padding: '4px 10px',
          background: confMeta.color,
          color: '#fff',
          borderRadius: 99,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.08em',
        }}>
          {conf.toUpperCase()} CONFIDENCE
        </div>
      </div>

      {/* Main metrics row */}
      <div style={{ padding: '20px 18px', display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>

        {/* Left: bar meters */}
        <div style={{ flex: '1 1 220px', minWidth: 200 }}>
          <BarMeter
            label="CONFIDENCE LEVEL"
            value={confMeta.pct}
            color={confMeta.color}
            subtitle={conf.toUpperCase()}
          />
          <BarMeter
            label="EVIDENCE QUALITY"
            value={evidMeta.pct}
            color={evidMeta.color}
            subtitle={evid.toUpperCase()}
          />

          {/* Circle gauges row */}
          <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
            <CircleGauge value={impact} color="var(--red)" label="IMPACT SCORE" size={72} />
            <CircleGauge value={pattern} color="var(--purple)" label="PATTERN MATCH" size={72} />
            <CircleGauge value={evergreen} color="var(--green)" label="EVERGREEN" size={72} />
          </div>
        </div>

        {/* Right: radar chart */}
        <div style={{ flexShrink: 0 }}>
          <RadarTriangle impact={impact} pattern={pattern} evergreen={evergreen} />
        </div>
      </div>

      {/* Source list — expandable */}
      {sources && (sources as Source[]).length > 0 && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '12px 18px' }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--ink3)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <span style={{ color: 'var(--blue)', fontSize: 12 }}>{expanded ? '▾' : '▸'}</span>
            {source_count} SOURCE{source_count !== 1 ? 'S' : ''} REFERENCED
          </button>

          {expanded && (
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {(sources as Source[]).map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 4,
                    background: 'var(--bg2)', border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 700, color: 'var(--blue)', flexShrink: 0,
                  }}>{i + 1}</div>
                  <div>
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noopener noreferrer"
                         style={{ fontSize: 12, fontWeight: 600, color: 'var(--blue)', textDecoration: 'none' }}>
                        {s.name} ↗
                      </a>
                    ) : (
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{s.name}</div>
                    )}
                    {s.type && <div style={{ fontSize: 10, color: 'var(--ink4)' }}>{s.type}</div>}
                    {(s as any).used_for && (
                      <div style={{ fontSize: 10, color: 'var(--ink4)' }}>Used for: {(s as any).used_for}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer disclaimer */}
      <div style={{
        padding: '10px 18px',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg2)',
        fontSize: 10,
        color: 'var(--ink4)',
        lineHeight: 1.6,
      }}>
        All factual claims are attributed to publicly available sources.
        Opinion is clearly framed as analysis, not fact.
      </div>
    </div>
  );
}
