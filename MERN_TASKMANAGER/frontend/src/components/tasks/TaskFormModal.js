import React, { useState, useEffect } from 'react';

const EMPTY = { title:'', description:'', status:'pending', priority:'medium', dueDate:'' };

export default function TaskFormModal({ isOpen, onClose, onSubmit, editTask }) {
  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title || '',
        description: editTask.description || '',
        status: editTask.status || 'pending',
        priority: editTask.priority || 'medium',
        dueDate: editTask.dueDate ? editTask.dueDate.slice(0,10) : '',
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [editTask, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setErrors({ title: 'Title is required' }); return; }
    setLoading(true);
    try {
      await onSubmit({ ...form, dueDate: form.dueDate || undefined });
      onClose();
    } catch { /* errors handled by hook */ }
    finally { setLoading(false); }
  };

  if (!isOpen) return null;

  const inputSt = (name) => ({
    width:'100%', padding:'11px 14px',
    background: focused===name ? 'rgba(79,142,247,0.06)' : 'rgba(255,255,255,0.03)',
    border:`1.5px solid ${errors[name]?'rgba(239,68,68,0.4)':focused===name?'rgba(79,142,247,0.5)':'rgba(79,142,247,0.12)'}`,
    borderRadius:'10px',
    color:'#eef2ff', fontSize:'14px', fontFamily:'var(--font)',
    resize:'vertical',
    transition:'all 220ms cubic-bezier(0.4,0,0.2,1)',
    boxShadow: focused===name ? '0 0 0 4px rgba(79,142,247,0.1)' : 'none',
  });

  const selectSt = {
    width:'100%', padding:'11px 14px',
    background:'rgba(255,255,255,0.03)',
    border:'1.5px solid rgba(79,142,247,0.12)',
    borderRadius:'10px',
    color:'#eef2ff', fontSize:'14px', fontFamily:'var(--font)',
    cursor:'pointer',
  };

  return (
    <div
      onClick={onClose}
      style={{
        position:'fixed',inset:0,zIndex:1000,
        background:'rgba(3,6,16,0.85)',
        backdropFilter:'blur(10px)',
        display:'flex',alignItems:'center',justifyContent:'center',
        padding:20,
        animation:'fadeIn 0.15s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="anim-scale-in"
        style={{
          width:'100%', maxWidth:520,
          background:'rgba(10,16,28,0.97)',
          backdropFilter:'blur(24px)',
          border:'1px solid rgba(79,142,247,0.18)',
          borderRadius:'24px',
          boxShadow:'0 40px 120px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)',
          overflow:'hidden',
          position:'relative',
        }}
      >
        {/* Top shimmer */}
        <div style={{ position:'absolute',top:0,left:'8%',right:'8%',height:'1px',background:'linear-gradient(90deg,transparent,rgba(79,142,247,0.5),transparent)' }} />

        {/* Header */}
        <div style={{
          display:'flex',alignItems:'center',justifyContent:'space-between',
          padding:'22px 26px',
          borderBottom:'1px solid rgba(79,142,247,0.08)',
        }}>
          <div>
            <h2 style={{ fontSize:18,fontWeight:800,color:'#eef2ff',letterSpacing:'-0.02em' }}>
              {editTask ? '✏ Edit Task' : '✦ New Task'}
            </h2>
            <p style={{ fontSize:12,color:'var(--text-muted)',marginTop:3 }}>
              {editTask ? 'Update the task details below' : 'Fill in the details for your new task'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width:34,height:34,borderRadius:'9px',
              display:'flex',alignItems:'center',justifyContent:'center',
              background:'rgba(255,255,255,0.04)',
              color:'var(--text-secondary)',
              border:'1px solid rgba(79,142,247,0.12)',
              fontSize:18,lineHeight:1,cursor:'pointer',
              transition:'all var(--t-fast)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.1)'; e.currentTarget.style.color='#ef4444'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='var(--text-secondary)'; }}
          >×</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding:'24px 26px',display:'flex',flexDirection:'column',gap:18 }}>
          {/* Title */}
          <div style={{ display:'flex',flexDirection:'column',gap:7 }}>
            <label style={{ fontSize:12,fontWeight:600,color:'var(--text-secondary)',letterSpacing:'0.06em',textTransform:'uppercase' }}>
              Title <span style={{ color:'#ef4444' }}>*</span>
            </label>
            <input
              name="title" value={form.title} onChange={handleChange}
              placeholder="What needs to be done?"
              autoFocus
              style={inputSt('title')}
              onFocus={() => setFocused('title')}
              onBlur={() => setFocused('')}
            />
            {errors.title && <span style={{ fontSize:12,color:'#fca5a5' }}>{errors.title}</span>}
          </div>

          {/* Description */}
          <div style={{ display:'flex',flexDirection:'column',gap:7 }}>
            <label style={{ fontSize:12,fontWeight:600,color:'var(--text-secondary)',letterSpacing:'0.06em',textTransform:'uppercase' }}>
              Description
            </label>
            <textarea
              name="description" value={form.description} onChange={handleChange}
              placeholder="Add more details… (optional)"
              rows={3}
              style={{ ...inputSt('description'), minHeight:80 }}
              onFocus={() => setFocused('description')}
              onBlur={() => setFocused('')}
            />
          </div>

          {/* Status + Priority */}
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
            <div style={{ display:'flex',flexDirection:'column',gap:7 }}>
              <label style={{ fontSize:12,fontWeight:600,color:'var(--text-secondary)',letterSpacing:'0.06em',textTransform:'uppercase' }}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} style={selectSt}>
                <option value="pending">⏳ Pending</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>
            <div style={{ display:'flex',flexDirection:'column',gap:7 }}>
              <label style={{ fontSize:12,fontWeight:600,color:'var(--text-secondary)',letterSpacing:'0.06em',textTransform:'uppercase' }}>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} style={selectSt}>
                <option value="high">🔥 High</option>
                <option value="medium">⚡ Medium</option>
                <option value="low">🌿 Low</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div style={{ display:'flex',flexDirection:'column',gap:7 }}>
            <label style={{ fontSize:12,fontWeight:600,color:'var(--text-secondary)',letterSpacing:'0.06em',textTransform:'uppercase' }}>Due Date</label>
            <input
              name="dueDate" type="date" value={form.dueDate} onChange={handleChange}
              style={{ ...inputSt('dueDate'), colorScheme:'dark' }}
              onFocus={() => setFocused('dueDate')}
              onBlur={() => setFocused('')}
            />
          </div>

          {/* Buttons */}
          <div style={{ display:'flex',gap:10,marginTop:4 }}>
            <button
              type="button" onClick={onClose}
              style={{
                flex:1,padding:'12px',
                background:'rgba(255,255,255,0.04)',
                border:'1px solid rgba(79,142,247,0.12)',
                borderRadius:'10px',
                color:'var(--text-secondary)',fontSize:14,fontWeight:600,fontFamily:'var(--font)',
                cursor:'pointer',transition:'all var(--t-fast)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}
            >Cancel</button>
            <button
              type="submit" disabled={loading}
              style={{
                flex:2,padding:'12px',
                background:loading?'rgba(79,142,247,0.4)':'linear-gradient(135deg,#4f8ef7,#7c3aed)',
                border:'none',borderRadius:'10px',
                color:'#fff',fontSize:14,fontWeight:700,fontFamily:'var(--font)',
                cursor:loading?'not-allowed':'pointer',
                boxShadow:loading?'none':'0 4px 20px rgba(79,142,247,0.35)',
                transition:'all var(--t-fast)',
                display:'flex',alignItems:'center',justifyContent:'center',gap:8,
              }}
              onMouseEnter={e => { if(!loading){e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow='0 8px 28px rgba(79,142,247,0.5)';} }}
              onMouseLeave={e => { e.currentTarget.style.transform='';e.currentTarget.style.boxShadow=loading?'none':'0 4px 20px rgba(79,142,247,0.35)'; }}
            >
              {loading
                ? <><div style={{ width:16,height:16,border:'2px solid rgba(255,255,255,0.4)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'spin 0.6s linear infinite' }} />Saving…</>
                : editTask ? '💾 Save Changes' : '✦ Create Task'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
