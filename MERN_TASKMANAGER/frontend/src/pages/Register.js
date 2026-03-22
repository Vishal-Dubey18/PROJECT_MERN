import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});
  const [focused, setFocused] = useState('');
  const [showPw,  setShowPw]  = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors(p => ({ ...p, [name]: '', global: '' }));
    setForm(p => ({ ...p, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())              e.name     = 'Name is required';
    if (!form.email.trim())             e.email    = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (form.password.length < 6)       e.password = 'Minimum 6 characters';
    else if (!/\d/.test(form.password)) e.password = 'Must contain at least one number';
    if (form.password !== form.confirm) e.confirm  = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await authAPI.register({ name: form.name, email: form.email, password: form.password });
      // Store email for verify page
      sessionStorage.setItem('tf_verify_email', form.email);
      toast.success('Code sent to your email!');
      navigate('/verify-email', { state: { email: form.email } });
    } catch (err) {
      setErrors({ global: err.message });
    } finally { setLoading(false); }
  };

  const inputSt = (name) => ({
    width: '100%', padding: '12px 16px',
    paddingRight: name === 'password' ? 48 : 16,
    background: focused === name ? 'rgba(79,142,247,0.06)' : 'rgba(255,255,255,0.03)',
    border: `1.5px solid ${errors[name] ? 'rgba(239,68,68,0.45)' : focused === name ? 'rgba(79,142,247,0.5)' : 'rgba(79,142,247,0.12)'}`,
    borderRadius: 12, color: '#eef2ff', fontSize: 15, fontFamily: 'var(--font)',
    transition: 'all 220ms ease',
    boxShadow: focused === name ? '0 0 0 4px rgba(79,142,247,0.1)' : 'none',
    outline: 'none',
  });

  const labelSt = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative', overflow: 'hidden' }}>
      <div className="auth-orb-1" /><div className="auth-orb-2" /><div className="auth-orb-3" />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        <div className="anim-fade-up" style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 60, height: 60, margin: '0 auto 18px', background: 'linear-gradient(135deg,#4f8ef7,#7c3aed)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '0 12px 40px rgba(79,142,247,0.4)', animation: 'float 6s ease-in-out infinite' }}>✦</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em' }}>Create account</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 8 }}>Start managing tasks like a pro</p>
        </div>

        <div className="anim-fade-up anim-d2" style={{ background: 'rgba(12,18,32,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(79,142,247,0.15)', borderRadius: 24, padding: 32, boxShadow: '0 24px 80px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(79,142,247,0.4),transparent)' }} />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {errors.global && (
              <div className="anim-scale-in" style={{ padding: '11px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, color: '#fca5a5', fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>⚠</span>{errors.global}
              </div>
            )}

            {[
              { name: 'name',     label: 'Full name',       type: 'text',     placeholder: 'Vishal Dubey',       ac: 'name' },
              { name: 'email',    label: 'Email address',   type: 'email',    placeholder: 'you@example.com',    ac: 'email' },
              { name: 'password', label: 'Password',        type: 'password', placeholder: 'Min 6 chars + number', ac: 'new-password', toggle: true },
              { name: 'confirm',  label: 'Confirm password', type: 'password', placeholder: 'Repeat password',   ac: 'new-password' },
            ].map(f => (
              <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <label style={labelSt}>{f.label}</label>
                <div style={{ position: 'relative' }}>
                  <input
                    name={f.name}
                    type={f.name === 'password' && showPw ? 'text' : f.type}
                    value={form[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    autoComplete={f.ac}
                    style={inputSt(f.name)}
                    onFocus={() => setFocused(f.name)}
                    onBlur={() => setFocused('')}
                  />
                  {f.toggle && (
                    <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 16, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                      {showPw ? '🙈' : '👁'}
                    </button>
                  )}
                </div>
                {errors[f.name] && <span style={{ fontSize: 12, color: '#fca5a5' }}>{errors[f.name]}</span>}
              </div>
            ))}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: 14, marginTop: 6,
              background: loading ? 'rgba(79,142,247,0.4)' : 'linear-gradient(135deg,#4f8ef7,#7c3aed)',
              border: 'none', borderRadius: 12, color: '#fff',
              fontSize: 15, fontWeight: 700, fontFamily: 'var(--font)',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 24px rgba(79,142,247,0.4)',
              transition: 'all 220ms ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {loading
                ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />Creating account…</>
                : 'Create account →'
              }
            </button>
          </form>
        </div>

        <p className="anim-fade-up anim-d3" style={{ textAlign: 'center', marginTop: 22, fontSize: 14, color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in ↗</Link>
        </p>
      </div>
    </div>
  );
}
