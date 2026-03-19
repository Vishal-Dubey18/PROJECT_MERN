import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const STEPS = { EMAIL: 'email', OTP: 'otp', DONE: 'done' };

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step,     setStep]     = useState(STEPS.EMAIL);
  const [email,    setEmail]    = useState('');
  const [otp,      setOtp]      = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [focused,  setFocused]  = useState('');
  const [showPw,   setShowPw]   = useState(false);

  const inputSt = (name) => ({
    width: '100%', padding: '12px 16px',
    background: focused === name ? 'rgba(79,142,247,0.06)' : 'rgba(255,255,255,0.03)',
    border: `1.5px solid ${focused === name ? 'rgba(79,142,247,0.5)' : 'rgba(79,142,247,0.12)'}`,
    borderRadius: 12, color: '#eef2ff', fontSize: 15, fontFamily: 'var(--font)',
    transition: 'all 220ms ease',
    boxShadow: focused === name ? '0 0 0 4px rgba(79,142,247,0.1)' : 'none',
  });

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      toast.success('Reset code sent to your email!');
      setStep(STEPS.OTP);
    } catch (err) {
      toast.error(err.message);
    } finally { setLoading(false); }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { toast.error('Passwords do not match'); return; }
    if (password.length < 6)  { toast.error('Password min 6 characters'); return; }
    setLoading(true);
    try {
      await authAPI.resetPassword({ email, otp, newPassword: password });
      toast.success('Password reset! Please log in.');
      setStep(STEPS.DONE);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.message);
    } finally { setLoading(false); }
  };

  const btnStyle = (loading) => ({
    width: '100%', padding: 14,
    background: loading ? 'rgba(79,142,247,0.4)' : 'linear-gradient(135deg,#4f8ef7,#7c3aed)',
    border: 'none', borderRadius: 12, color: '#fff',
    fontSize: 15, fontWeight: 700, fontFamily: 'var(--font)',
    cursor: loading ? 'not-allowed' : 'pointer',
    boxShadow: loading ? 'none' : '0 4px 24px rgba(79,142,247,0.4)',
    transition: 'all 220ms ease',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative', overflow: 'hidden' }}>
      <div className="auth-orb-1" /><div className="auth-orb-2" />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        <div className="anim-fade-up" style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 60, height: 60, margin: '0 auto 20px', background: 'linear-gradient(135deg,#4f8ef7,#7c3aed)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '0 12px 40px rgba(79,142,247,0.4)', animation: 'float 6s ease-in-out infinite' }}>
            {step === STEPS.DONE ? '✅' : '🔒'}
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em' }}>
            {step === STEPS.EMAIL ? 'Forgot password?' : step === STEPS.OTP ? 'Enter reset code' : 'Password reset!'}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 8 }}>
            {step === STEPS.EMAIL ? 'Enter your email and we\'ll send a 6-digit code'
             : step === STEPS.OTP ? `Code sent to ${email}`
             : 'You can now log in with your new password'}
          </p>
        </div>

        <div className="anim-fade-up anim-d2" style={{ background: 'rgba(12,18,32,0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(79,142,247,0.14)', borderRadius: 24, padding: '32px', boxShadow: '0 24px 80px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(79,142,247,0.4),transparent)' }} />

          {step === STEPS.EMAIL && (
            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoFocus style={inputSt('email')} onFocus={() => setFocused('email')} onBlur={() => setFocused('')} />
              </div>
              <button type="submit" disabled={loading} style={btnStyle(loading)}>
                {loading ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />Sending…</> : 'Send reset code →'}
              </button>
            </form>
          )}

          {step === STEPS.OTP && (
            <form onSubmit={handleResetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>6-digit code</label>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="123456" maxLength={6} style={{ ...inputSt('otp'), textAlign: 'center', fontSize: 24, fontWeight: 700, letterSpacing: 8 }} onFocus={() => setFocused('otp')} onBlur={() => setFocused('')} autoFocus />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>New password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 chars + number" style={{ ...inputSt('password'), paddingRight: 44 }} onFocus={() => setFocused('password')} onBlur={() => setFocused('')} />
                  <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 15 }}>{showPw ? '🙈' : '👁'}</button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Confirm password</label>
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" style={inputSt('confirm')} onFocus={() => setFocused('confirm')} onBlur={() => setFocused('')} />
              </div>
              <button type="submit" disabled={loading || otp.length < 6} style={btnStyle(loading)}>
                {loading ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />Resetting…</> : 'Reset password →'}
              </button>
              <button type="button" onClick={() => setStep(STEPS.EMAIL)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer', textAlign: 'center' }}>← Use different email</button>
            </form>
          )}

          {step === STEPS.DONE && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Redirecting to login…</p>
            </div>
          )}
        </div>

        <p className="anim-fade-up anim-d3" style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-muted)' }}>
          Remember it? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in ↗</Link>
        </p>
      </div>
    </div>
  );
}
