import React, { useState } from 'react';
import { format, isToday, isTomorrow, isPast, differenceInDays } from 'date-fns';

// ── Status config ──────────────────────────────────────────────
const STATUS = {
  pending:   { bg: 'rgba(245,158,11,0.1)',  color: '#f59e0b', border: 'rgba(245,158,11,0.3)',  dot: '#f59e0b',  label: 'Pending' },
  completed: { bg: 'rgba(16,185,129,0.1)',  color: '#10b981', border: 'rgba(16,185,129,0.3)',  dot: '#10b981',  label: 'Done' },
};

// ── Priority config ────────────────────────────────────────────
const PRIORITY = {
  high:   { bg: 'rgba(239,68,68,0.1)',   color: '#ef4444', border: 'rgba(239,68,68,0.3)',   label: 'High',   icon: '🔥' },
  medium: { bg: 'rgba(245,158,11,0.1)',  color: '#f59e0b', border: 'rgba(245,158,11,0.3)',  label: 'Medium', icon: '⚡' },
  low:    { bg: 'rgba(16,185,129,0.1)',  color: '#10b981', border: 'rgba(16,185,129,0.3)',  label: 'Low',    icon: '🌿' },
};

// ── Smart due date display ────────────────────────────────────
function DueDateBadge({ dueDate, isCompleted }) {
  if (!dueDate) return null;
  const date  = new Date(dueDate);
  const past  = isPast(date) && !isToday(date);
  const today = isToday(date);
  const tmrw  = isTomorrow(date);
  const days  = differenceInDays(date, new Date());

  let label, color, bg, border;

  if (isCompleted) {
    label = format(date, 'MMM d');
    color = '#8b9cc8'; bg = 'rgba(139,156,200,0.08)'; border = 'rgba(139,156,200,0.2)';
  } else if (past) {
    label = `Overdue · ${format(date, 'MMM d')}`;
    color = '#ef4444'; bg = 'rgba(239,68,68,0.1)'; border = 'rgba(239,68,68,0.3)';
  } else if (today) {
    label = 'Due today';
    color = '#f59e0b'; bg = 'rgba(245,158,11,0.1)'; border = 'rgba(245,158,11,0.3)';
  } else if (tmrw) {
    label = 'Due tomorrow';
    color = '#f59e0b'; bg = 'rgba(245,158,11,0.08)'; border = 'rgba(245,158,11,0.2)';
  } else if (days <= 7) {
    label = `Due in ${days}d`;
    color = '#4f8ef7'; bg = 'rgba(79,142,247,0.08)'; border = 'rgba(79,142,247,0.2)';
  } else {
    label = format(date, 'MMM d, yyyy');
    color = '#8b9cc8'; bg = 'rgba(139,156,200,0.08)'; border = 'rgba(139,156,200,0.2)';
  }

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 99,
      fontSize: 11, fontWeight: 600,
      background: bg, color, border: `1px solid ${border}`,
      whiteSpace: 'nowrap',
    }}>
      📅 {label}
    </span>
  );
}

// ── Pill badge ────────────────────────────────────────────────
function Pill({ cfg, small }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: small ? '2px 8px' : '3px 10px',
      borderRadius: 99, fontSize: small ? 11 : 12, fontWeight: 600,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      whiteSpace: 'nowrap',
    }}>
      {cfg.dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />}
      {cfg.icon && <span style={{ fontSize: 11 }}>{cfg.icon}</span>}
      {cfg.label}
    </span>
  );
}

// ── Icon button ───────────────────────────────────────────────
function IconBtn({ onClick, disabled, loading, color, bg, hoverBg, title, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 34, height: 34,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hov ? hoverBg : bg,
        border: `1px solid ${color}30`,
        borderRadius: 9,
        color,
        fontSize: 14, fontFamily: 'var(--font)',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        transition: 'all 180ms ease',
        transform: hov && !disabled ? 'scale(1.06)' : 'scale(1)',
        opacity: disabled || loading ? 0.6 : 1,
        flexShrink: 0,
      }}
    >
      {loading
        ? <div style={{ width: 13, height: 13, border: '1.5px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
        : children
      }
    </button>
  );
}

// ══════════════════════════════════════════════════════════════
export default function TaskCard({ task, onEdit, onDelete, onToggle, index = 0 }) {
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [hovered,  setHovered]  = useState(false);

  const isCompleted = task.status === 'completed';
  const sCfg = STATUS[task.status]    || STATUS.pending;
  const pCfg = PRIORITY[task.priority] || PRIORITY.medium;
  const delayClass = `anim-d${Math.min((index % 6) + 1, 6)}`;

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    setDeleting(true);
    try { await onDelete(task._id); } finally { setDeleting(false); }
  };

  const handleToggle = async () => {
    setToggling(true);
    try { await onToggle(task); } finally { setToggling(false); }
  };

  return (
    <div
      className={`anim-fade-up ${delayClass}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(16,22,42,0.97)' : 'rgba(12,18,32,0.82)',
        backdropFilter: 'blur(14px)',
        border: `1px solid ${isCompleted
          ? `rgba(16,185,129,${hovered ? 0.35 : 0.14})`
          : `rgba(79,142,247,${hovered ? 0.32 : 0.1})`}`,
        borderRadius: 18,
        padding: '20px 22px',
        display: 'flex', flexDirection: 'column', gap: 14,
        transition: 'all 260ms cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered
          ? isCompleted
            ? '0 12px 40px rgba(16,185,129,0.12)'
            : '0 12px 40px rgba(79,142,247,0.12)'
          : '0 2px 12px rgba(0,0,0,0.28)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Accent strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2.5,
        background: isCompleted
          ? 'linear-gradient(90deg,#10b981,#059669)'
          : `linear-gradient(90deg,transparent 20%,${pCfg.color}80 50%,transparent 80%)`,
        opacity: isCompleted ? 1 : hovered ? 1 : 0,
        transition: 'opacity 260ms',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <h3 style={{
          fontSize: 15, fontWeight: 700, lineHeight: 1.45,
          color: isCompleted ? 'var(--text-muted)' : '#eef2ff',
          textDecoration: isCompleted ? 'line-through' : 'none',
          flex: 1, transition: 'color 260ms',
        }}>
          {task.title}
        </h3>
        <Pill cfg={sCfg} />
      </div>

      {/* Description */}
      {task.description && (
        <p style={{
          fontSize: 13.5, color: isCompleted ? 'var(--text-muted)' : 'var(--text-secondary)',
          lineHeight: 1.65,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {task.description}
        </p>
      )}

      {/* Meta badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
        <Pill cfg={pCfg} small />
        <DueDateBadge dueDate={task.dueDate} isCompleted={isCompleted} />
        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>
          {format(new Date(task.createdAt || Date.now()), 'MMM d')}
        </span>
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        paddingTop: 12,
        borderTop: '1px solid rgba(79,142,247,0.08)',
        opacity: hovered ? 1 : 0.75, transition: 'opacity 260ms',
      }}>
        {/* Toggle complete */}
        <button
          onClick={handleToggle}
          disabled={toggling}
          style={{
            flex: 1, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            background: isCompleted ? 'rgba(245,158,11,0.08)' : 'rgba(16,185,129,0.08)',
            border: `1px solid ${isCompleted ? 'rgba(245,158,11,0.25)' : 'rgba(16,185,129,0.25)'}`,
            borderRadius: 9,
            color: isCompleted ? '#f59e0b' : '#10b981',
            fontSize: 13, fontWeight: 600, fontFamily: 'var(--font)',
            cursor: toggling ? 'not-allowed' : 'pointer',
            transition: 'all 180ms ease',
          }}
          onMouseEnter={e => { if (!toggling) { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.background = isCompleted ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)'; }}}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.background = isCompleted ? 'rgba(245,158,11,0.08)' : 'rgba(16,185,129,0.08)'; }}
        >
          {toggling
            ? <div style={{ width: 13, height: 13, border: '1.5px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
            : isCompleted ? <><span>↩</span> Undo</> : <><span>✓</span> Complete</>
          }
        </button>

        {/* Edit */}
        <IconBtn
          onClick={() => onEdit(task)}
          color="#4f8ef7"
          bg="rgba(79,142,247,0.06)"
          hoverBg="rgba(79,142,247,0.16)"
          title="Edit task"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </IconBtn>

        {/* Delete */}
        <IconBtn
          onClick={handleDelete}
          disabled={deleting}
          loading={deleting}
          color="#ef4444"
          bg="rgba(239,68,68,0.06)"
          hoverBg="rgba(239,68,68,0.16)"
          title="Delete task"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </IconBtn>
      </div>
    </div>
  );
}
