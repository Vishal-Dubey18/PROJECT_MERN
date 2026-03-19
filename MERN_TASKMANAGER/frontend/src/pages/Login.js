import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [focused, setFocused] = useState('');
  const [showPw,  setShowPw]  = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError('');
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 👋');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = (name) => ({
    width: '100%',
    padding: '13px 16px',
    paddingRight: name === 'password' ? '48px' : '16px',
    background: focused === name ? 'rgba(79,142,247,0.06)' : 'rgba(255,255,255,0.03)',
    border: `1.5px solid ${focused === name ? 'rgba(79,142,247,0.5)' : 'rgba(79,142,247,0.12)'}`,
    borderRadius: '12px',
    color: '#eef2ff',
    fontSize: '15px',
    fontFamily: 'var(--font)',
    transition: 'all 220ms cubic-bezier(0.4,0,0.2,1)',
    boxShadow: focused === name ? '0 0 0 4px rgba(79,142,247,0.1), inset 0 1px 2px rgba(0,0,0,0.2)' : 'inset 0 1px 2px rgba(0,0,0,0.2)',
  });

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden',
    }}>
      <div className="auth-orb-1" />
      <div className="auth-orb-2" />
      <div className="auth-orb-3" />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div className="anim-fade-up" style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 60, height: 60, margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #4f8ef7, #7c3aed)',
            borderRadius: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, boxShadow: '0 12px 40px rgba(79,142,247,0.4), 0 0 0 1px rgba(79,142,247,0.2)',
            animation: 'float 6s ease-in-out infinite',
          }}>✦</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: '#eef2ff' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginTop: 8 }}>
            Sign in to your <span className="gradient-text">TaskFlow</span> account
          </p>
        </div>

        {/* Card */}
        <div className="anim-fade-up anim-d2" style={{
          background: 'rgba(12,18,32,0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(79,142,247,0.14)',
          borderRadius: '24px',
          padding: '36px 32px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Card shimmer line */}
          <div style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(79,142,247,0.4), transparent)',
          }} />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {error && (
              <div className="anim-scale-in" style={{
                padding: '12px 16px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: '10px',
                color: '#fca5a5',
                fontSize: '13.5px',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span>⚠</span> {error}
              </div>
            )}

            {/* Email field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                Email address
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                style={fieldStyle('email')}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
              />
            </div>

            {/* Password field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  style={fieldStyle('password')}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--text-muted)', fontSize: 16, padding: 4, lineHeight: 1,
                    transition: 'color var(--t-fast)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                marginTop: 4,
                background: loading
                  ? 'rgba(79,142,247,0.4)'
                  : 'linear-gradient(135deg, #4f8ef7 0%, #7c3aed 100%)',
                backgroundSize: '200% auto',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 700,
                fontFamily: 'var(--font)',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 24px rgba(79,142,247,0.4)',
                transition: 'all 220ms cubic-bezier(0.4,0,0.2,1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
              onMouseEnter={e => { if(!loading) { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 8px 32px rgba(79,142,247,0.5)'; }}}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 24px rgba(79,142,247,0.4)'; }}
              onMouseDown={e => { if(!loading) e.currentTarget.style.transform='translateY(1px) scale(0.99)'; }}
              onMouseUp={e => { e.currentTarget.style.transform='translateY(-1px)'; }}
            >
              {loading ? (
                <>
                  <div style={{ width:18,height:18,border:'2.5px solid rgba(255,255,255,0.3)',borderTop:'2.5px solid #fff',borderRadius:'50%',animation:'spin 0.6s linear infinite' }} />
                  Signing in…
                </>
              ) : 'Sign in →'}
            </button>

            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <Link to="/forgot-password" style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Forgot password?
              </Link>
            </div>
          </form>
        </div>

        <p className="anim-fade-up anim-d3" style={{ textAlign:'center',marginTop:24,fontSize:14,color:'var(--text-muted)' }}>
          No account?{' '}
          <Link to="/register" style={{ color:'var(--accent)',fontWeight:600,transition:'color var(--t-fast)' }}>
            Create one free ↗
          </Link>
        </p>
      </div>
    </div>
  );
}
