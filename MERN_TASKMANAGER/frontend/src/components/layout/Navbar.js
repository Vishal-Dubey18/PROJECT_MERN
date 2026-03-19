import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onNewTask }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
    : '??';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const close = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 200,
      background: scrolled ? 'rgba(5,8,16,0.9)' : 'rgba(5,8,16,0.6)',
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${scrolled ? 'rgba(79,142,247,0.12)' : 'transparent'}`,
      transition: 'all 300ms cubic-bezier(0.4,0,0.2,1)',
    }}>
      <div style={{
        maxWidth: 1240, margin: '0 auto', padding: '0 28px',
        height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div style={{ display:'flex',alignItems:'center',gap:10 }}>
          <div style={{
            width:36,height:36,
            background:'linear-gradient(135deg,#4f8ef7,#7c3aed)',
            borderRadius:10,
            display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:17,
            boxShadow:'0 4px 16px rgba(79,142,247,0.35)',
            flexShrink:0,
          }}>✦</div>
          <span style={{ fontWeight:800,fontSize:18,letterSpacing:'-0.03em' }}>
            Task<span style={{
              background:'linear-gradient(135deg,#4f8ef7,#a78bfa)',
              WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
            }}>Flow</span>
          </span>
        </div>

        {/* Actions */}
        <div style={{ display:'flex',alignItems:'center',gap:12 }}>
          {/* New Task button */}
          <button
            onClick={onNewTask}
            style={{
              display:'flex',alignItems:'center',gap:7,
              padding:'9px 18px',
              background:'linear-gradient(135deg,#4f8ef7,#7c3aed)',
              border:'none',borderRadius:'10px',
              color:'#fff',fontSize:14,fontWeight:700,fontFamily:'var(--font)',
              cursor:'pointer',
              boxShadow:'0 4px 20px rgba(79,142,247,0.35)',
              transition:'all 220ms cubic-bezier(0.4,0,0.2,1)',
              position:'relative',overflow:'hidden',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(79,142,247,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 4px 20px rgba(79,142,247,0.35)'; }}
            onMouseDown={e => { e.currentTarget.style.transform='scale(0.97)'; }}
            onMouseUp={e => { e.currentTarget.style.transform='translateY(-1px)'; }}
          >
            <span style={{ fontSize:18,lineHeight:1 }}>+</span>
            New Task
          </button>

          {/* Avatar */}
          <div style={{ position:'relative' }} ref={menuRef}>
            <button
              onClick={() => setMenuOpen(v => !v)}
              style={{
                width:40,height:40,borderRadius:'50%',
                background:'linear-gradient(135deg,#4f8ef7,#7c3aed)',
                color:'#fff',fontSize:14,fontWeight:700,
                display:'flex',alignItems:'center',justifyContent:'center',
                border:`2px solid ${menuOpen ? 'rgba(79,142,247,0.6)' : 'rgba(79,142,247,0.25)'}`,
                boxShadow: menuOpen ? '0 0 0 4px rgba(79,142,247,0.15)' : 'none',
                transition:'all var(--t-base)',
                cursor:'pointer',
              }}
            >
              {initials}
            </button>

            {menuOpen && (
              <div className="anim-scale-in" style={{
                position:'absolute',top:'calc(100% + 10px)',right:0,
                minWidth:220,
                background:'rgba(10,16,28,0.95)',
                backdropFilter:'blur(20px)',
                border:'1px solid rgba(79,142,247,0.16)',
                borderRadius:'16px',
                boxShadow:'0 24px 64px rgba(0,0,0,0.6)',
                overflow:'hidden',
                zIndex:300,
              }}>
                <div style={{
                  padding:'16px 18px',
                  borderBottom:'1px solid rgba(79,142,247,0.08)',
                  background:'rgba(79,142,247,0.04)',
                }}>
                  <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                    <div style={{
                      width:34,height:34,borderRadius:'50%',
                      background:'linear-gradient(135deg,#4f8ef7,#7c3aed)',
                      display:'flex',alignItems:'center',justifyContent:'center',
                      color:'#fff',fontSize:12,fontWeight:700,flexShrink:0,
                    }}>{initials}</div>
                    <div>
                      <p style={{ fontSize:14,fontWeight:600,color:'#eef2ff' }}>{user?.name}</p>
                      <p style={{ fontSize:12,color:'var(--text-muted)',marginTop:1 }}>{user?.email}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => { setMenuOpen(false); logout(); }}
                  style={{
                    width:'100%',padding:'14px 18px',
                    textAlign:'left',fontSize:14,fontWeight:500,
                    color:'#fca5a5',fontFamily:'var(--font)',
                    cursor:'pointer',
                    transition:'background var(--t-fast)',
                    display:'flex',alignItems:'center',gap:10,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}
                >
                  <span style={{ fontSize:16 }}>↩</span> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
