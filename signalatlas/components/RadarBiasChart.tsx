'use client';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, Legend, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  western: number;
  eastern: number;
  globalSouth: number;
}

export default function RadarBiasChart({ data }: { data: ChartData }) {
  // Use the passed data to offset base patterns
  const mediaRadar = [
    { axis: "Conflict Coverage", BBC: data.western + 5, RT: data.eastern - 10, AlJazeera: data.globalSouth + 35 },
    { axis: "Economic Impact", BBC: data.western - 35, RT: data.eastern + 8, AlJazeera: data.globalSouth + 25 },
    { axis: "Civilian Stories", BBC: data.western - 20, RT: data.eastern - 30, AlJazeera: data.globalSouth + 40 },
    { axis: "Govt Narrative", BBC: data.western - 10, RT: data.eastern + 15, AlJazeera: data.globalSouth + 15 },
    { axis: "Aid Coverage", BBC: data.western - 25, RT: data.eastern - 35, AlJazeera: data.globalSouth + 42 },
    { axis: "Historical Context", BBC: data.western - 40, RT: data.eastern - 5, AlJazeera: data.globalSouth + 30 },
  ];
  
  // Ensure values stay between 0-100
  const normalizedRadar = mediaRadar.map(item => ({
    axis: item.axis,
    BBC: Math.max(0, Math.min(100, item.BBC)),
    RT: Math.max(0, Math.min(100, item.RT)),
    AlJazeera: Math.max(0, Math.min(100, item.AlJazeera)),
  }));

  return (
    <div className="card" style={{ marginBottom: 40 }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>Media Coverage Bias Tracker</h3>
        <span className="badge badge-blue">RADAR</span>
      </div>
      <div style={{ padding: "20px 24px" }}>
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart data={normalizedRadar} cx="50%" cy="50%" outerRadius={100}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: "#6b7280" }} />
            <Radar name="Western (BBC/CNN)" dataKey="BBC" stroke="var(--blue)" fill="var(--blue)" fillOpacity={0.15} strokeWidth={2} />
            <Radar name="Eastern (RT/CGTN)" dataKey="RT" stroke="var(--red)" fill="var(--red)" fillOpacity={0.15} strokeWidth={2} />
            <Radar name="Global South (AJ)" dataKey="AlJazeera" stroke="var(--teal)" fill="var(--teal)" fillOpacity={0.15} strokeWidth={2} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Tooltip content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 6, padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink2)", marginBottom: 6 }}>{label}</div>
                  {payload.map((p, i) => (
                    <div key={i} style={{ fontSize: 11, color: p.color, marginBottom: 2 }}>
                      {p.name}: <strong>{p.value}</strong>
                    </div>
                  ))}
                </div>
              );
            }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
