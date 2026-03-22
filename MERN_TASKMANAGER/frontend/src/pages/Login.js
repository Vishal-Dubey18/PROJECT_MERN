import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const [form,     setForm]     = useState({ email: '', password: '' });
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);   // { msg, type: 'wrong'|'unverified'|'locked' }
  const [attempts, setAttempts] = useState(0);
  const [shake,    setShake]    = useState(false);
  const [focused,  setFocused]  = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [btnState, setBtnState] = useState('idle'); // idle | loading | error
  const cardRef = useRef(null);

  /* ── inject keyframes once ──────────────────────────────── */
  useEffect(() => {
    const id = 'login-styles';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @keyframes slideDown {
        from { opacity:0; transform:translateY(-12px) scale(0.97); }
        to   { opacity:1; transform:translateY(0)     scale(1);    }
      }
      @keyframes loginShake {
        0%,100%{ transform:translateX(0); }
        15%    { transform:translateX(-7px); }
        30%    { transform:translateX(6px); }
        45%    { transform:translateX(-5px); }
        60%    { transform:translateX(4px); }
        75%    { transform:translateX(-2px); }
        90%    { transform:translateX(2px); }
      }
      @keyframes errorPulse {
        0%,100%{ box-shadow:0 0 0 0 rgba(239,68,68,0); }
        50%    { box-shadow:0 0 0 6px rgba(239,68,68,0.12); }
      }
      @keyframes iconBounce {
        0%,100%{ transform:scale(1) rotate(0deg); }
        25%    { transform:scale(1.3) rotate(-8deg); }
        50%    { transform:scale(0.9) rotate(4deg); }
        75%    { transform:scale(1.1) rotate(-2deg); }
      }
      @keyframes btnShake {
        0%,100%{ transform:translateX(0); }
        20%{ transform:translateX(-4px); }
        40%{ transform:translateX(4px); }
        60%{ transform:translateX(-3px); }
        80%{ transform:translateX(2px); }
      }
    `;
    document.head.appendChild(s);
  }, []);

  /* ── trigger shake ──────────────────────────────────────── */
  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(null);
    setBtnState('idle');
    setForm(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError({ msg: 'Please fill in both fields.', type: 'empty' });
      triggerShake();
      return;
    }
    setLoading(true);
    setBtnState('loading');
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 👋');
      navigate('/dashboard');
    } catch (err) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setLoading(false);
      setBtnState('error');
      triggerShake();

      // Clear password on wrong credentials
      setForm(p => ({ ...p, password: '' }));

      // Classify error
      if (err.requiresVerification) {
        setError({ msg: 'Your email is not verified. Check your inbox for the verification code.', type: 'unverified', email: err.email });
      } else if (newAttempts >= 3) {
        setError({ msg: "Still not matching — double-check your email and password.", type: 'locked' });
      } else {
        setError({ msg: 'Wrong email or password. Please try again.', type: 'wrong' });
      }

      // Reset button after 2s
      setTimeout(() => setBtnState('idle'), 2000);
    }
  };

  const dismissError = () => { setError(null); setBtnState('idle'); };

  /* ── dynamic styles ─────────────────────────────────────── */
  const hasError     = !!error;
  const cardBorder   = hasError ? 'rgba(239,68,68,0.4)' : 'rgba(79,142,247,0.15)';
  const shimmerColor = hasError ? 'rgba(239,68,68,0.5)' : 'rgba(79,142,247,0.45)';

  const inputSt = (name) => ({
    width: '100%', padding: '12px 16px',
    paddingRight: name === 'password' ? 48 : 16,
    background: focused === name ? 'rgba(79,142,247,0.06)' : 'rgba(255,255,255,0.03)',
    border: `1.5px solid ${hasError ? 'rgba(239,68,68,0.35)'
             : focused === name ? 'rgba(79,142,247,0.5)'
             : 'rgba(79,142,247,0.12)'}`,
    borderRadius: 12, color: '#eef2ff', fontSize: 15,
    fontFamily: 'var(--font)', outline: 'none',
    transition: 'all 220ms ease',
    boxShadow: focused === name
      ? hasError ? '0 0 0 4px rgba(239,68,68,0.1)' : '0 0 0 4px rgba(79,142,247,0.1)'
      : 'none',
  });

  /* ── error icon ─────────────────────────────────────────── */
  const errorIcon = error?.type === 'unverified' ? '📧'
                  : error?.type === 'locked'      ? '🤔'
                  : error?.type === 'empty'       ? '⚠️'
                  : '🚫';

  /* ── button content ─────────────────────────────────────── */
  const btnContent = () => {
    if (btnState === 'loading') return (
      <><div style={{ width:18,height:18,border:'2.5px solid rgba(255,255,255,0.3)',borderTop:'2.5px solid #fff',borderRadius:'50%',animation:'spin 0.6s linear infinite' }} />Signing in…</>
    );
    if (btnState === 'error') return (
      <span style={{ animation:'btnShake 0.4s ease' }}>🔄 Try again</span>
    );
    return 'Sign in →';
  };

  const btnStyle = {
    width: '100%', padding: 14, marginTop: 8,
    background: btnState === 'error'
      ? 'linear-gradient(135deg,#dc2626,#b91c1c)'
      : btnState === 'loading'
        ? 'rgba(79,142,247,0.5)'
        : 'linear-gradient(135deg,#4f8ef7 0%,#7c3aed 100%)',
    border: 'none', borderRadius: 12,
    color: '#fff', fontSize: 15, fontWeight: 700,
    fontFamily: 'var(--font)',
    cursor: loading ? 'not-allowed' : 'pointer',
    boxShadow: btnState === 'error'
      ? '0 4px 20px rgba(239,68,68,0.4)'
      : loading ? 'none' : '0 4px 24px rgba(79,142,247,0.4)',
    transition: 'all 300ms cubic-bezier(0.34,1.2,0.64,1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 20,
      position: 'relative', overflow: 'hidden',
    }}>
      <div className="auth-orb-1" />
      <div className="auth-orb-2" />
      <div className="auth-orb-3" />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

        {/* ── Logo / header ── */}
        <div className="anim-fade-up" style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 60, height: 60, margin: '0 auto 18px',
            background: 'linear-gradient(135deg,#4f8ef7,#7c3aed)',
            borderRadius: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, boxShadow: '0 12px 40px rgba(79,142,247,0.4)',
            animation: 'float 6s ease-in-out infinite',
          }}>✦</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: '#eef2ff' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginTop: 8 }}>
            Sign in to your{' '}
            <span style={{
              background: 'linear-gradient(135deg,#4f8ef7,#a78bfa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>TaskFlow</span>{' '}account
          </p>
        </div>

        {/* ── Card ── */}
        <div
          ref={cardRef}
          className="anim-fade-up anim-d2"
          style={{
            background: 'rgba(12,18,32,0.85)',
            backdropFilter: 'blur(20px)',
            border: `1.5px solid ${cardBorder}`,
            borderRadius: 24, padding: 32,
            boxShadow: hasError
              ? '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(239,68,68,0.1)'
              : '0 24px 80px rgba(0,0,0,0.5)',
            position: 'relative', overflow: 'hidden',
            animation: shake ? 'loginShake 0.5s ease' : 'none',
            transition: 'border-color 350ms ease, box-shadow 350ms ease',
          }}
        >
          {/* Shimmer line — changes colour on error */}
          <div style={{
            position: 'absolute', top: 0, left: '8%', right: '8%', height: 1,
            background: `linear-gradient(90deg,transparent,${shimmerColor},transparent)`,
            transition: 'background 400ms ease',
          }} />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* ── Error banner ── */}
            {error && (
              <div style={{
                padding: '13px 14px',
                background: 'rgba(239,68,68,0.08)',
                border: '1.5px solid rgba(239,68,68,0.3)',
                borderRadius: 11,
                display: 'flex', alignItems: 'flex-start', gap: 10,
                animation: 'slideDown 0.35s cubic-bezier(0.34,1.2,0.64,1) both, errorPulse 2s ease 0.4s 3',
              }}>
                <span style={{
                  fontSize: 18, flexShrink: 0, lineHeight: 1.3,
                  animation: 'iconBounce 0.5s ease 0.1s',
                  display: 'inline-block',
                }}>
                  {errorIcon}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13.5, color: '#fca5a5', lineHeight: 1.5, fontWeight: 500 }}>
                    {error.msg}
                  </p>
                  {/* Attempt 3+ — reset link inline */}
                  {error.type === 'locked' && (
                    <Link
                      to="/forgot-password"
                      style={{
                        display: 'inline-block', marginTop: 6,
                        fontSize: 13, color: '#4f8ef7', fontWeight: 600,
                        textDecoration: 'underline', textUnderlineOffset: 3,
                      }}
                    >
                      Reset my password →
                    </Link>
                  )}
                  {/* Unverified — go to verify page */}
                  {error.type === 'unverified' && (
                    <Link
                      to="/verify-email"
                      state={{ email: error.email }}
                      style={{
                        display: 'inline-block', marginTop: 6,
                        fontSize: 13, color: '#4f8ef7', fontWeight: 600,
                        textDecoration: 'underline', textUnderlineOffset: 3,
                      }}
                    >
                      Go to verification →
                    </Link>
                  )}
                </div>
                {/* Dismiss */}
                <button
                  type="button"
                  onClick={dismissError}
                  style={{
                    background: 'none', border: 'none', color: '#fca5a5',
                    fontSize: 18, lineHeight: 1, cursor: 'pointer',
                    padding: '0 2px', flexShrink: 0, opacity: 0.7,
                    transition: 'opacity 150ms',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
                >×</button>
              </div>
            )}

            {/* ── Email field ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Email address
              </label>
              <input
                name="email" type="email" value={form.email}
                onChange={handleChange} placeholder="you@example.com"
                autoComplete="email" style={inputSt('email')}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
              />
            </div>

            {/* ── Password field — with forgot link in label row ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  style={{ fontSize: 12, color: '#4f8ef7', fontWeight: 600, opacity: 0.8, transition: 'opacity 150ms' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0.8'}
                >
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  style={inputSt('password')}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{
                    position: 'absolute', right: 13, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    color: 'var(--text-muted)', fontSize: 16,
                    cursor: 'pointer', padding: 4, lineHeight: 1,
                    transition: 'color 150ms',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#4f8ef7'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={loading}
              style={btnStyle}
              onMouseEnter={e => {
                if (!loading && btnState !== 'error') {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(79,142,247,0.55)';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = btnState === 'error'
                  ? '0 4px 20px rgba(239,68,68,0.4)'
                  : loading ? 'none' : '0 4px 24px rgba(79,142,247,0.4)';
              }}
              onMouseDown={e => { if (!loading) e.currentTarget.style.transform = 'translateY(1px) scale(0.99)'; }}
            >
              {btnContent()}
            </button>
          </form>
        </div>

        {/* ── Register link ── */}
        <p className="anim-fade-up anim-d3" style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-muted)' }}>
          No account?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600, transition: 'color 150ms' }}>
            Create one free ↗
          </Link>
        </p>
      </div>
    </div>
  );
}
