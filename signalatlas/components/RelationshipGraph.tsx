'use client';
import { useState } from 'react';

interface GraphNode {
  id: number;
  label: string[];
  x: number;
  y: number;
  r: number;
  color: string;
}

interface GraphEdge {
  s: number;
  t: number;
  w: number;
}

interface Props {
  nodes?: GraphNode[];
  edges?: GraphEdge[];
}

const DEFAULT_NODES: GraphNode[] = [
  { id: 0, label: ['Russia', 'Sanctions'], x: 100, y: 90,  r: 36, color: '#b91c1c' },
  { id: 1, label: ['Oil', 'Trade'],        x: 250, y: 60,  r: 30, color: '#92400e' },
  { id: 2, label: ['India', 'Imports'],    x: 380, y: 95,  r: 27, color: '#14532d' },
  { id: 3, label: ['USD', 'Pressure'],     x: 215, y: 175, r: 25, color: '#1e3a5f' },
  { id: 4, label: ['Fuel', 'Prices'],      x: 340, y: 190, r: 22, color: '#92400e' },
  { id: 5, label: ['Inflation'],           x: 460, y: 160, r: 20, color: '#6b21a8' },
  { id: 6, label: ['BRICS', 'Talks'],      x: 95,  y: 195, r: 21, color: '#0d7490' },
];

const DEFAULT_EDGES: GraphEdge[] = [
  { s: 0, t: 1, w: 92 }, { s: 1, t: 2, w: 78 }, { s: 0, t: 3, w: 85 },
  { s: 2, t: 4, w: 67 }, { s: 4, t: 5, w: 61 }, { s: 3, t: 4, w: 55 },
  { s: 0, t: 6, w: 70 }, { s: 6, t: 3, w: 48 },
];

export default function RelationshipGraph({ nodes = DEFAULT_NODES, edges = DEFAULT_EDGES }: Props) {
  const [hov, setHov] = useState<number | null>(null);

  return (
    <div className="card card-pad fade" style={{ animationDelay: '0.2s' }}>
      <div className="sec-head">
        <div className="sec-bar" style={{ background: 'var(--amber)' }} />
        <div className="sec-title">Event Connection Map</div>
      </div>
      <div className="graph-wrap">
        <svg width="100%" viewBox="0 0 560 260" style={{ fontFamily: 'var(--mono)' }}>
          {edges.map((e, i) => {
            const s = nodes[e.s], t = nodes[e.t];
            if (!s || !t) return null;
            const active = hov === e.s || hov === e.t;
            return (
              <g key={i}>
                <line
                  x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                  stroke={active ? s.color : '#d4d3cf'}
                  strokeWidth={active ? 2 : 1}
                  strokeDasharray={active ? '0' : '4 3'}
                  opacity={active ? 0.9 : 0.7}
                />
                {active && (
                  <text
                    x={(s.x + t.x) / 2} y={(s.y + t.y) / 2 - 5}
                    textAnchor="middle" fontSize={9}
                    fill={s.color} fontWeight={600}
                  >
                    {e.w}%
                  </text>
                )}
              </g>
            );
          })}
          {nodes.map((n) => {
            const labelLines: string[] = Array.isArray(n.label) ? n.label : [String(n.label)];
            return (
            <g
              key={n.id}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHov(n.id)}
              onMouseLeave={() => setHov(null)}
            >
              <circle
                cx={n.x} cy={n.y}
                r={hov === n.id ? n.r + 4 : n.r}
                fill={hov === n.id ? n.color : '#fafaf8'}
                stroke={n.color}
                strokeWidth={hov === n.id ? 2 : 1.5}
                style={{ transition: 'all 0.18s' }}
              />
              {labelLines.map((w, wi) => (
                <text
                  key={wi}
                  x={n.x}
                  y={n.y + (labelLines.length === 1 ? 4 : wi === 0 ? -3 : 9)}
                  textAnchor="middle"
                  fontSize={hov === n.id ? 9.5 : 8.5}
                  fill={hov === n.id ? '#fff' : n.color}
                  fontWeight={600}
                  style={{ pointerEvents: 'none' }}
                >
                  {w}
                </text>
              ))}
            </g>
            );
          })}
        </svg>
        <div style={{ fontSize: 10, color: 'var(--ink4)', paddingTop: 4, textAlign: 'center' }}>
          Hover any node to reveal connection strength
        </div>
      </div>
    </div>
  );
}
