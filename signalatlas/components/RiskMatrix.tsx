'use client';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from 'recharts';

interface Props {
  impact: number | null;
  pattern: number | null;
  evergreen: number | null;
}

export default function RiskMatrix({ impact, pattern, evergreen }: Props) {
  if (!impact && !pattern && !evergreen) return null;

  const data = [
    { subject: 'Immediate Impact', A: impact || 0, fullMark: 10 },
    { subject: 'Pattern Severity', A: pattern || 0, fullMark: 10 },
    { subject: 'Long-term Strategic', A: evergreen || 0, fullMark: 10 },
  ];

  return (
    <div style={{ background: '#FEF9F0', border: '1px solid #FDDCB0', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '2.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ flex: 1, minWidth: '250px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '.5rem' }}>Analytical Scoring</div>
        <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '.75rem' }}>Geopolitical Risk Matrix</h3>
        <p style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.7, marginBottom: '1rem' }}>
          This event has been algorithmically scored against our 17-angle strategic framework. High scores indicate significant deviation from historical baselines.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 700, color: impact && impact >= 8 ? 'var(--red)' : 'var(--navy)' }}>{impact || '-'}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', letterSpacing: '.05em', textTransform: 'uppercase' }}>Impact</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 700, color: pattern && pattern >= 8 ? 'var(--red)' : 'var(--navy)' }}>{pattern || '-'}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', letterSpacing: '.05em', textTransform: 'uppercase' }}>Pattern</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 700, color: evergreen && evergreen >= 8 ? 'var(--red)' : 'var(--navy)' }}>{evergreen || '-'}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', letterSpacing: '.05em', textTransform: 'uppercase' }}>Strategic</div>
          </div>
        </div>
      </div>
      <div style={{ width: '220px', height: '220px', flexShrink: 0, margin: '0 auto' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#FDDCB0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--ink3)', fontSize: 10, fontFamily: 'var(--mono)' }} />
            <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
            <Radar name="Score" dataKey="A" stroke="var(--amber)" fill="var(--amber)" fillOpacity={0.3} />
            <Tooltip 
              contentStyle={{ background: 'var(--navy)', border: 'none', borderRadius: '3px', color: 'var(--white)', fontSize: '12px' }}
              itemStyle={{ color: 'var(--amber)' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
