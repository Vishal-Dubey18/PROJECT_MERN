import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

import toast from 'react-hot-toast';

export default function VerifyEmail({ email: propEmail }) {
  const navigate  = useNavigate();
  // auth context available if needed
  const [email]   = useState(propEmail || sessionStorage.getItem('tf_verify_email') || '');
  const [otp,     setOtp]     = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputs = useRef([]);

  // Countdown for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // If no email, redirect
  useEffect(() => {
    if (!email) navigate('/register');
  }, [email, navigate]);

  const handleOtpChange = (idx, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(''));
      inputs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { toast.error('Enter all 6 digits'); return; }
    setLoading(true);
    try {
      const { data } = await authAPI.verifyEmail({ email, otp: code });
      localStorage.setItem('tf_token', data.token);
      localStorage.setItem('tf_user',  JSON.stringify(data.user));
      sessionStorage.removeItem('tf_verify_email');
      toast.success('Email verified! Welcome 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authAPI.resendOTP({ email });
      toast.success('New code sent!');
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } catch (err) {
      toast.error(err.message);
    } finally { setResending(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative', overflow: 'hidden' }}>
      <div className="auth-orb-1" /><div className="auth-orb-2" />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        <div className="anim-fade-up" style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 68, height: 68, margin: '0 auto 20px', background: 'linear-gradient(135deg,#4f8ef7,#7c3aed)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, boxShadow: '0 12px 40px rgba(79,142,247,0.4)', animation: 'float 5s ease-in-out infinite' }}>
            ✉️
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em' }}>Check your email</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 10, lineHeight: 1.6 }}>
            We sent a 6-digit code to<br/>
            <strong style={{ color: '#4f8ef7' }}>{email}</strong>
          </p>
        </div>

        <div className="anim-fade-up anim-d2" style={{ background: 'rgba(12,18,32,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(79,142,247,0.15)', borderRadius: 24, padding: '32px', boxShadow: '0 24px 80px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(79,142,247,0.5),transparent)' }} />

          <form onSubmit={handleSubmit}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14 }}>Verification code</p>

            {/* OTP boxes */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 28 }} onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => inputs.current[i] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  style={{
                    width: 52, height: 60,
                    textAlign: 'center',
                    fontSize: 24, fontWeight: 700,
                    background: digit ? 'rgba(79,142,247,0.1)' : 'rgba(255,255,255,0.03)',
                    border: `2px solid ${digit ? 'rgba(79,142,247,0.5)' : 'rgba(79,142,247,0.12)'}`,
                    borderRadius: 12,
                    color: '#eef2ff',
                    fontFamily: 'var(--font)',
                    transition: 'all 200ms ease',
                    boxShadow: digit ? '0 0 0 4px rgba(79,142,247,0.1)' : 'none',
                    outline: 'none',
                  }}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || otp.join('').length < 6}
              style={{
                width: '100%', padding: 14,
                background: otp.join('').length < 6 ? 'rgba(79,142,247,0.3)' : 'linear-gradient(135deg,#4f8ef7,#7c3aed)',
                border: 'none', borderRadius: 12, color: '#fff',
                fontSize: 15, fontWeight: 700, fontFamily: 'var(--font)',
                cursor: otp.join('').length < 6 ? 'not-allowed' : 'pointer',
                boxShadow: otp.join('').length === 6 ? '0 4px 24px rgba(79,142,247,0.4)' : 'none',
                transition: 'all 250ms ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {loading
                ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />Verifying…</>
                : 'Verify email →'
              }
            </button>

            {/* Resend */}
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              {countdown > 0 ? (
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  Resend code in <span style={{ color: '#4f8ef7', fontWeight: 600 }}>{countdown}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  style={{ background: 'none', border: 'none', fontSize: 13, color: '#4f8ef7', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}
                >
                  {resending ? 'Sending…' : "Didn't receive it? Resend →"}
                </button>
              )}
            </div>
          </form>
        </div>

        <p className="anim-fade-up anim-d3" style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          Wrong email? <a href="/register" style={{ color: '#4f8ef7', fontWeight: 600 }}>Start over</a>
        </p>
      </div>
    </div>
  );
}
