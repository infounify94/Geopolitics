'use client';
import { useState, useEffect, useRef } from 'react';

const Counter = ({ target, label, color, prefix = "", suffix = "" }: { target: number, label: string, color: string, prefix?: string, suffix?: string }) => {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = target / 60;
        const interval = setInterval(() => {
          start += step;
          if (start >= target) { 
            setVal(target); 
            clearInterval(interval); 
          } else {
            setVal(Math.floor(start));
          }
        }, 16);
      }
    }, { threshold: 0.5 });
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} style={{ textAlign: "center", padding: "20px 16px",
      background: "#fff", border: "1px solid var(--border)", borderRadius: "8px",
      borderTop: `3px solid ${color}` }}>
      <div style={{ fontSize: 32, fontWeight: 900, color, lineHeight: 1 }}>
        {prefix}{val.toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
    </div>
  );
};

export default function AnimatedCounters() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 40 }}>
      <Counter target={1247} label="Research Articles" color="var(--blue)" />
      <Counter target={87} label="Countries Tracked" color="var(--teal)" />
      <Counter target={52} label="Patterns Found" color="var(--purple)" />
      <Counter target={96} label="Prediction Accuracy" color="var(--amber)" suffix="%" />
    </div>
  );
}
