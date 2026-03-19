import React, { useState } from 'react';
import { format } from 'date-fns';

const STATUS_CONFIG = {
  pending:   { bg:'rgba(245,158,11,0.1)',  color:'#f59e0b', border:'rgba(245,158,11,0.25)',  dot:'#f59e0b',  label:'Pending' },
  completed: { bg:'rgba(16,185,129,0.1)',  color:'#10b981', border:'rgba(16,185,129,0.25)',  dot:'#10b981',  label:'Completed' },
};
const PRIORITY_CONFIG = {
  high:   { bg:'rgba(239,68,68,0.1)',   color:'#ef4444', border:'rgba(239,68,68,0.25)',   label:'🔥 High' },
  medium: { bg:'rgba(245,158,11,0.1)', color:'#f59e0b', border:'rgba(245,158,11,0.25)', label:'⚡ Medium' },
  low:    { bg:'rgba(16,185,129,0.1)',  color:'#10b981', border:'rgba(16,185,129,0.25)',  label:'🌿 Low' },
};

function Pill({ cfg }) {
  return (
    <span style={{
      display:'inline-flex',alignItems:'center',gap:5,
      padding:'3px 10px',
      borderRadius:'var(--r-full)',
      fontSize:12,fontWeight:600,
      background:cfg.bg,color:cfg.color,
      border:`1px solid ${cfg.border}`,
      whiteSpace:'nowrap',
    }}>
      {cfg.dot && <span style={{ width:5,height:5,borderRadius:'50%',background:cfg.dot,flexShrink:0 }} />}
      {cfg.label}
    </span>
  );
}

export default function TaskCard({ task, onEdit, onDelete, onToggle, index = 0 }) {
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [hovered,  setHovered]  = useState(false);

  const isCompleted = task.status === 'completed';
  const sCfg = STATUS_CONFIG[task.status]   || STATUS_CONFIG.pending;
  const pCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setDeleting(true);
    try { await onDelete(task._id); } finally { setDeleting(false); }
  };

  const handleToggle = async () => {
    setToggling(true);
    try { await onToggle(task); } finally { setToggling(false); }
  };

  const delayClass = `anim-d${Math.min((index % 6) + 1, 6)}`;

  return (
    <div
      className={`anim-fade-up ${delayClass}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(15,22,40,0.95)' : 'rgba(12,18,32,0.8)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${isCompleted ? 'rgba(16,185,129,' + (hovered?'0.3':'0.12') + ')' : (hovered ? 'rgba(79,142,247,0.28)' : 'rgba(79,142,247,0.1)')}`,
        borderRadius: '18px',
        padding: '22px',
        display: 'flex', flexDirection: 'column', gap: 14,
        transition: 'all 250ms cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered
          ? isCompleted ? '0 12px 40px rgba(16,185,129,0.12)' : '0 12px 40px rgba(79,142,247,0.12)'
          : '0 2px 12px rgba(0,0,0,0.3)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Top accent strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2.5px',
        background: isCompleted
          ? 'linear-gradient(90deg, #10b981, #059669)'
          : 'linear-gradient(90deg, transparent 20%, rgba(79,142,247,0.6) 50%, transparent 80%)',
        opacity: hovered ? 1 : isCompleted ? 1 : 0,
        transition: 'opacity var(--t-base)',
      }} />

      {/* Header */}
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:10 }}>
        <h3 style={{
          fontSize: 15, fontWeight: 700,
          color: isCompleted ? 'var(--text-muted)' : '#eef2ff',
          textDecoration: isCompleted ? 'line-through' : 'none',
          lineHeight: 1.4, flex: 1,
          transition: 'color var(--t-base)',
        }}>
          {task.title}
        </h3>
        <Pill cfg={sCfg} />
      </div>

      {/* Description */}
      {task.description && (
        <p style={{
          fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {task.description}
        </p>
      )}

      {/* Meta */}
      <div style={{ display:'flex',alignItems:'center',gap:8,flexWrap:'wrap' }}>
        <Pill cfg={pCfg} />
        {task.dueDate && (
          <span style={{
            fontSize:12,color:'var(--text-muted)',
            display:'flex',alignItems:'center',gap:4,
            background:'rgba(255,255,255,0.04)',
            padding:'3px 9px',borderRadius:'var(--r-full)',
            border:'1px solid rgba(255,255,255,0.06)',
          }}>
            📅 {format(new Date(task.dueDate), 'MMM d, yyyy')}
          </span>
        )}
        <span style={{ fontSize:11,color:'var(--text-muted)',marginLeft:'auto' }}>
          {format(new Date(task.createdAt || Date.now()), 'MMM d')}
        </span>
      </div>

      {/* Actions */}
      <div style={{
        display:'flex',gap:8,paddingTop:12,
        borderTop:'1px solid rgba(79,142,247,0.08)',
        opacity: hovered ? 1 : 0.7,
        transition: 'opacity var(--t-base)',
      }}>
        {/* Toggle */}
        <button
          onClick={handleToggle}
          disabled={toggling}
          style={{
            flex:1,padding:'8px 14px',
            background: isCompleted ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
            border: `1px solid ${isCompleted ? 'rgba(245,158,11,0.25)' : 'rgba(16,185,129,0.25)'}`,
            borderRadius:'10px',
            color: isCompleted ? '#f59e0b' : '#10b981',
            fontSize:13,fontWeight:600,fontFamily:'var(--font)',
            cursor:toggling?'not-allowed':'pointer',
            transition:'all var(--t-fast)',
            display:'flex',alignItems:'center',justifyContent:'center',gap:6,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform='scale(1.02)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform=''; }}
        >
          {toggling
            ? <div style={{ width:14,height:14,border:'2px solid currentColor',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.6s linear infinite' }} />
            : isCompleted ? '↩ Undo' : '✓ Done'
          }
        </button>

        {/* Edit */}
        <button
          onClick={() => onEdit(task)}
          style={{
            padding:'8px 12px',
            background:'rgba(79,142,247,0.08)',
            border:'1px solid rgba(79,142,247,0.2)',
            borderRadius:'10px',
            color:'var(--accent)',
            fontSize:14,fontFamily:'var(--font)',
            cursor:'pointer',transition:'all var(--t-fast)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(79,142,247,0.15)'; e.currentTarget.style.transform='scale(1.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.background='rgba(79,142,247,0.08)'; e.currentTarget.style.transform=''; }}
        >
          ✏
        </button>

        {/* Delete */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{
            padding:'8px 12px',
            background:'rgba(239,68,68,0.08)',
            border:'1px solid rgba(239,68,68,0.2)',
            borderRadius:'10px',
            color:'#ef4444',fontSize:14,fontFamily:'var(--font)',
            cursor:deleting?'not-allowed':'pointer',
            transition:'all var(--t-fast)',
          }}
          onMouseEnter={e => { if(!deleting){e.currentTarget.style.background='rgba(239,68,68,0.18)'; e.currentTarget.style.transform='scale(1.05)'; }}}
          onMouseLeave={e => { e.currentTarget.style.background='rgba(239,68,68,0.08)'; e.currentTarget.style.transform=''; }}
        >
          {deleting
            ? <div style={{ width:14,height:14,border:'2px solid currentColor',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.6s linear infinite' }} />
            : '🗑'
          }
        </button>
      </div>
    </div>
  );
}
