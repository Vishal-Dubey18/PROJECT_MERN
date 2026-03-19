import React from 'react';

const STATUS_FILTERS = [
  { value:'',          label:'All',       icon:'✦' },
  { value:'pending',   label:'Pending',   icon:'⏳' },
  { value:'completed', label:'Completed', icon:'✅' },
];
const SORT_OPTIONS = [
  { value:'-createdAt', label:'Newest first' },
  { value:'createdAt',  label:'Oldest first' },
  { value:'-priority',  label:'High priority' },
  { value:'title',      label:'A → Z' },
];

export default function FilterBar({ search, onSearch, status, onStatus, sortBy, onSort }) {
  return (
    <div style={{ display:'flex',flexWrap:'wrap',gap:10,alignItems:'center',marginBottom:24 }}>
      {/* Search */}
      <div style={{ position:'relative',flex:'1 1 220px',minWidth:200 }}>
        <span style={{ position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)',fontSize:14,pointerEvents:'none' }}>
          🔍
        </span>
        <input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search tasks…"
          style={{
            width:'100%',
            padding:'10px 14px 10px 36px',
            background:'rgba(12,18,32,0.8)',
            backdropFilter:'blur(8px)',
            border:'1.5px solid rgba(79,142,247,0.12)',
            borderRadius:'12px',
            color:'#eef2ff',fontSize:14,fontFamily:'var(--font)',
            transition:'all 220ms cubic-bezier(0.4,0,0.2,1)',
          }}
          onFocus={e => { e.target.style.borderColor='rgba(79,142,247,0.45)'; e.target.style.boxShadow='0 0 0 4px rgba(79,142,247,0.1)'; }}
          onBlur={e  => { e.target.style.borderColor='rgba(79,142,247,0.12)'; e.target.style.boxShadow='none'; }}
        />
      </div>

      {/* Filter pills */}
      <div style={{ display:'flex',gap:6,background:'rgba(12,18,32,0.8)',backdropFilter:'blur(8px)',border:'1px solid rgba(79,142,247,0.1)',borderRadius:'12px',padding:'4px' }}>
        {STATUS_FILTERS.map(f => {
          const active = status === f.value;
          return (
            <button
              key={f.value}
              onClick={() => onStatus(f.value)}
              style={{
                padding:'7px 16px',
                borderRadius:'9px',
                border:'none',
                background: active ? 'linear-gradient(135deg,#4f8ef7,#7c3aed)' : 'transparent',
                color: active ? '#fff' : 'var(--text-secondary)',
                fontSize:13,fontWeight:active?700:500,fontFamily:'var(--font)',
                cursor:'pointer',
                transition:'all 220ms cubic-bezier(0.34,1.2,0.64,1)',
                boxShadow: active ? '0 2px 12px rgba(79,142,247,0.3)' : 'none',
                transform: active ? 'scale(1.02)' : 'scale(1)',
                whiteSpace:'nowrap',
                display:'flex',alignItems:'center',gap:5,
              }}
            >
              <span>{f.icon}</span> {f.label}
            </button>
          );
        })}
      </div>

      {/* Sort */}
      <select
        value={sortBy}
        onChange={e => onSort(e.target.value)}
        style={{
          padding:'10px 14px',
          background:'rgba(12,18,32,0.8)',
          backdropFilter:'blur(8px)',
          border:'1.5px solid rgba(79,142,247,0.12)',
          borderRadius:'12px',
          color:'var(--text-secondary)',
          fontSize:13,fontFamily:'var(--font)',cursor:'pointer',
          transition:'border-color var(--t-fast)',
        }}
        onFocus={e => e.target.style.borderColor='rgba(79,142,247,0.4)'}
        onBlur={e  => e.target.style.borderColor='rgba(79,142,247,0.12)'}
      >
        {SORT_OPTIONS.map(o => (
          <option key={o.value} value={o.value} style={{ background:'#0c1220' }}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
