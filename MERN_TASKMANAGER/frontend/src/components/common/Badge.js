import React from 'react';

const CONFIG = {
  pending: {
    bg: 'rgba(245,158,11,0.12)',
    color: '#f59e0b',
    border: 'rgba(245,158,11,0.3)',
    dot: '#f59e0b',
    label: 'Pending',
  },
  completed: {
    bg: 'rgba(16,185,129,0.12)',
    color: '#10b981',
    border: 'rgba(16,185,129,0.3)',
    dot: '#10b981',
    label: 'Completed',
  },
  high: {
    bg: 'rgba(239,68,68,0.12)',
    color: '#ef4444',
    border: 'rgba(239,68,68,0.3)',
    dot: '#ef4444',
    label: 'High',
  },
  medium: {
    bg: 'rgba(245,158,11,0.12)',
    color: '#f59e0b',
    border: 'rgba(245,158,11,0.3)',
    dot: '#f59e0b',
    label: 'Medium',
  },
  low: {
    bg: 'rgba(16,185,129,0.12)',
    color: '#10b981',
    border: 'rgba(16,185,129,0.3)',
    dot: '#10b981',
    label: 'Low',
  },
};

export default function Badge({ variant = 'pending', size = 'md' }) {
  const c = CONFIG[variant] || CONFIG.pending;
  const isSmall = size === 'sm';
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: isSmall ? 4 : 5,
        padding: isSmall ? '2px 8px' : '4px 10px',
        borderRadius: 'var(--radius-full)',
        fontSize: isSmall ? 11 : 12,
        fontWeight: 500,
        letterSpacing: '0.02em',
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: isSmall ? 5 : 6, height: isSmall ? 5 : 6,
          borderRadius: '50%', background: c.dot,
          flexShrink: 0,
        }}
      />
      {c.label}
    </span>
  );
}
