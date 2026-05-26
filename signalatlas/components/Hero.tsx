'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Conflict } from '@/lib/types';

interface Props {
  stats: { articles: number; countries: number; patterns: number; accuracy: number };
  conflicts: Conflict[];
}

function useCountUp(target: number, duration = 1800) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let startTime: number | null = null;
        const step = (ts: number) => {
          if (!startTime) startTime = ts;
          const progress = Math.min((ts - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setVal(Math.floor(ease * target));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);

  return { val, ref };
}

const CONFLICT_FALLBACK: Conflict[] = [
  { id:'1', name:'Gaza–Israel',    region:'Middle East', start_date:'2023-10-07', days_active:961,  intensity:9.5, alert_level:'CRITICAL', status:'active', description:null },
  { id:'2', name:'Russia–Ukraine', region:'Europe',      start_date:'2022-02-24', days_active:1551, intensity:9.2, alert_level:'CRITICAL', status:'active', description:null },
  { id:'3', name:'Sudan Civil War',region:'Africa',       start_date:'2023-04-15', days_active:1136, intensity:8.1, alert_level:'HIGH',     status:'active', description:null },
  { id:'4', name:'Myanmar Junta',  region:'Asia',         start_date:'2021-02-01', days_active:1939, intensity:7.8, alert_level:'HIGH',     status:'active', description:null },
];

export default function Hero({ stats, conflicts }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const a1 = useCountUp(stats.articles || 12, 1800);
  const a2 = useCountUp(stats.countries || 67, 1600);
  const a3 = useCountUp(stats.patterns || 38, 1400);

  // Animated dot-grid canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dots: { x:number; y:number; size:number; alpha:number; speed:number; phase:number }[] = [];
    let animId: number;
    let frame = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      dots = [];
      const cols = Math.floor(canvas.width  / 16);
      const rows = Math.floor(canvas.height / 16);
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          if (Math.random() < 0.35) {
            dots.push({
              x:     c * 16 + 8,
              y:     r * 16 + 8,
              size:  Math.random() * 1.8 + 0.6,
              alpha: Math.random() * 0.5 + 0.15,
              speed: Math.random() * 0.003 + 0.001,
              phase: Math.random() * Math.PI * 2,
            });
          }
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      for (const d of dots) {
        const a = d.alpha * (0.7 + 0.3 * Math.sin(frame * d.speed + d.phase));
        ctx.fillStyle = `rgba(11,22,40,${a})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  const list = conflicts.length > 0 ? conflicts : CONFLICT_FALLBACK;

  return (
    <div className="hero">
      {/* Animated background */}
      <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />

      <div className="hero-inner">
        {/* Eyebrow */}
        <div className="hero-eyebrow reveal">
          <div className="hero-eyebrow-line" />
          <div className="hero-eyebrow-text">Evidence-based · Confidence-scored · 195 Nations Tracked</div>
        </div>

        {/* Headline */}
        <h1 className="hero-headline reveal" style={{ animationDelay: '.1s' }}>
          Track the World.<br />
          Understand the <em>Signal.</em>
        </h1>

        {/* Subhead */}
        <p className="hero-sub reveal" style={{ animationDelay: '.2s' }}>
          Data-driven geopolitical analysis, conflict monitoring, and strategic insights — across 195 nations,
          50+ active conflict zones, and the economic corridors that shape our world.
        </p>

        {/* CTAs */}
        <div className="hero-actions reveal" style={{ animationDelay: '.3s' }}>
          <Link href="/research" className="btn-primary">Explore Research →</Link>
          <Link href="/conflicts" className="btn-ghost">View Conflict Monitor</Link>
        </div>

        {/* Stats */}
        <div className="hero-stats reveal" style={{ animationDelay: '.4s' }}>
          <div className="hstat" ref={a1.ref}>
            <div className="hstat-num">{a1.val}</div>
            <div className="hstat-label">Research Articles</div>
          </div>
          <div className="hero-divider" />
          <div className="hstat" ref={a2.ref}>
            <div className="hstat-num">{a2.val}</div>
            <div className="hstat-label">Countries Tracked</div>
          </div>
          <div className="hero-divider" />
          <div className="hstat" ref={a3.ref}>
            <div className="hstat-num">{a3.val}</div>
            <div className="hstat-label">Event Patterns Found</div>
          </div>
          <div className="hero-divider" />
          <div className="hstat">
            <div className="hstat-num">{stats.accuracy}%</div>
            <div className="hstat-label">Prediction Accuracy</div>
          </div>
        </div>
      </div>

      {/* Conflict pill strip */}
      <div className="hero-conflict-strip reveal" style={{ animationDelay: '.5s' }}>
        <div className="conflict-strip-inner">
          <div className="cs-label">Active Conflicts</div>
          {list.map((c) => {
            const days = c.days_active ?? Math.floor((Date.now() - new Date(c.start_date).getTime()) / 86400000);
            const level = c.alert_level === 'CRITICAL' ? 'critical' : 'high';
            return (
              <Link key={c.id} href="/conflicts" className="conflict-pill">
                <span className={`cp-dot ${level}`} />
                <span className="cp-name">{c.name}</span>
                <span className="cp-day">Day {days.toLocaleString()}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
