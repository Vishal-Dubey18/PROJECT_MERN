import React, { useEffect, useState } from 'react';

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (start === end) return;
    const duration = 600;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display}</span>;
}

function StatCard({ label, value, color, icon, delay, accent }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`anim-fade-up anim-d${delay}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: '1 1 0',
        minWidth: 130,
        background: hovered ? 'rgba(15,22,40,0.9)' : 'rgba(12,18,32,0.7)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${hovered ? accent + '40' : accent + '18'}`,
        borderRadius: '16px',
        padding: '18px 20px',
        display: 'flex', alignItems: 'center', gap: 14,
        transition: 'all 250ms cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? `0 8px 32px ${accent}20` : 'none',
        position: 'relative', overflow: 'hidden',
        cursor: 'default',
      }}
    >
      {/* Glow strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, transparent, ${accent}80, transparent)`,
        opacity: hovered ? 1 : 0,
        transition: 'opacity var(--t-base)',
      }} />

      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: `${accent}12`,
        border: `1px solid ${accent}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, flexShrink: 0,
        transition: 'transform var(--t-spring)',
        transform: hovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1)',
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 26, fontWeight: 800, color: '#eef2ff', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          <AnimatedNumber value={value} />
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3, fontWeight: 500 }}>
          {label}
        </p>
      </div>
    </div>
  );
}

export default function StatsBar({ tasks = [] }) {
  const total     = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending   = tasks.filter(t => t.status === 'pending').length;
  const high      = tasks.filter(t => t.priority === 'high').length;
  return (
    <div style={{ display:'flex',gap:12,flexWrap:'wrap',marginBottom:28 }}>
      <StatCard label="Total Tasks"   value={total}     color="#4f8ef7" accent="#4f8ef7" icon="📊" delay={1} />
      <StatCard label="Completed"     value={completed} color="#10b981" accent="#10b981" icon="✅" delay={2} />
      <StatCard label="Pending"       value={pending}   color="#f59e0b" accent="#f59e0b" icon="⏳" delay={3} />
      <StatCard label="High Priority" value={high}      color="#ef4444" accent="#ef4444" icon="🔥" delay={4} />
    </div>
  );
}
