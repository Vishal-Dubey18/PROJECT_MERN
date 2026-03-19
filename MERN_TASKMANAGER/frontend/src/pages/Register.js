import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form,    setForm]    = useState({ name:'', email:'', password:'', confirm:'' });
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
    if (!form.name.trim())              e.name     = 'Name required';
    if (!form.email.trim())             e.email    = 'Email required';
    if (form.password.length < 6)       e.password = 'Min 6 characters';
    if (form.password !== form.confirm) e.confirm  = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome 🎉');
      navigate('/dashboard');
    } catch (err) {
      setErrors({ global: err.message });
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = (name) => ({
    width: '100%',
    padding: '12px 16px',
    paddingRight: name === 'password' ? '48px' : '16px',
    background: focused === name ? 'rgba(79,142,247,0.06)' : 'rgba(255,255,255,0.03)',
    border: `1.5px solid ${errors[name] ? 'rgba(239,68,68,0.4)' : focused === name ? 'rgba(79,142,247,0.5)' : 'rgba(79,142,247,0.12)'}`,
    borderRadius: '12px',
    color: '#eef2ff',
    fontSize: '15px',
    fontFamily: 'var(--font)',
    transition: 'all 220ms cubic-bezier(0.4,0,0.2,1)',
    boxShadow: focused === name ? '0 0 0 4px rgba(79,142,247,0.1)' : 'none',
  });

  const fields = [
    { name:'name',    label:'Full name',       type:'text',     placeholder:'John Doe',       ac:'name' },
    { name:'email',   label:'Email address',   type:'email',    placeholder:'you@example.com', ac:'email' },
    { name:'password',label:'Password',        type:'password', placeholder:'Min 6 characters',ac:'new-password', showToggle:true },
    { name:'confirm', label:'Confirm password',type:'password', placeholder:'Repeat password', ac:'new-password' },
  ];

  return (
    <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',position:'relative',overflow:'hidden' }}>
      <div className="auth-orb-1" />
      <div className="auth-orb-2" />
      <div className="auth-orb-3" />

      <div style={{ width:'100%',maxWidth:420,position:'relative',zIndex:1 }}>
        <div className="anim-fade-up" style={{ textAlign:'center',marginBottom:36 }}>
          <div style={{
            width:60,height:60,margin:'0 auto 20px',
            background:'linear-gradient(135deg,#4f8ef7,#7c3aed)',
            borderRadius:'18px',
            display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:24,boxShadow:'0 12px 40px rgba(79,142,247,0.4)',
            animation:'float 6s ease-in-out infinite',
          }}>✦</div>
          <h1 style={{ fontSize:28,fontWeight:800,letterSpacing:'-0.03em' }}>Create account</h1>
          <p style={{ fontSize:15,color:'var(--text-secondary)',marginTop:8 }}>
            Start managing tasks like a pro
          </p>
        </div>

        <div className="anim-fade-up anim-d2" style={{
          background:'rgba(12,18,32,0.8)',
          backdropFilter:'blur(20px)',
          border:'1px solid rgba(79,142,247,0.14)',
          borderRadius:'24px',
          padding:'32px',
          boxShadow:'0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
          position:'relative',overflow:'hidden',
        }}>
          <div style={{ position:'absolute',top:0,left:'10%',right:'10%',height:'1px',background:'linear-gradient(90deg,transparent,rgba(79,142,247,0.4),transparent)' }} />

          <form onSubmit={handleSubmit} style={{ display:'flex',flexDirection:'column',gap:16 }}>
            {errors.global && (
              <div className="anim-scale-in" style={{ padding:'12px 16px',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:'10px',color:'#fca5a5',fontSize:'13.5px',display:'flex',alignItems:'center',gap:8 }}>
                <span>⚠</span> {errors.global}
              </div>
            )}

            {fields.map(f => (
              <div key={f.name} style={{ display:'flex',flexDirection:'column',gap:6 }}>
                <label style={{ fontSize:13,fontWeight:600,color:'var(--text-secondary)',letterSpacing:'0.03em',textTransform:'uppercase' }}>
                  {f.label}
                </label>
                <div style={{ position:'relative' }}>
                  <input
                    name={f.name}
                    type={f.name === 'password' && showPw ? 'text' : f.type}
                    value={form[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    autoComplete={f.ac}
                    style={fieldStyle(f.name)}
                    onFocus={() => setFocused(f.name)}
                    onBlur={() => setFocused('')}
                  />
                  {f.showToggle && (
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      style={{ position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)',fontSize:16,padding:4,lineHeight:1 }}>
                      {showPw ? '🙈' : '👁'}
                    </button>
                  )}
                </div>
                {errors[f.name] && <span style={{ fontSize:12,color:'#fca5a5',marginTop:2 }}>{errors[f.name]}</span>}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              style={{
                width:'100%',padding:'14px',marginTop:8,
                background:loading?'rgba(79,142,247,0.4)':'linear-gradient(135deg,#4f8ef7 0%,#7c3aed 100%)',
                border:'none',borderRadius:'12px',color:'#fff',
                fontSize:'15px',fontWeight:700,fontFamily:'var(--font)',
                cursor:loading?'not-allowed':'pointer',
                boxShadow:loading?'none':'0 4px 24px rgba(79,142,247,0.4)',
                transition:'all 220ms cubic-bezier(0.4,0,0.2,1)',
                display:'flex',alignItems:'center',justifyContent:'center',gap:8,
              }}
              onMouseEnter={e => { if(!loading){e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow='0 8px 32px rgba(79,142,247,0.5)';}}}
              onMouseLeave={e => { e.currentTarget.style.transform='';e.currentTarget.style.boxShadow=loading?'none':'0 4px 24px rgba(79,142,247,0.4)'; }}
              onMouseDown={e => { if(!loading)e.currentTarget.style.transform='translateY(1px) scale(0.99)'; }}
            >
              {loading ? (
                <><div style={{ width:18,height:18,border:'2.5px solid rgba(255,255,255,0.3)',borderTop:'2.5px solid #fff',borderRadius:'50%',animation:'spin 0.6s linear infinite' }} />Creating…</>
              ) : 'Create account →'}
            </button>
          </form>
        </div>

        <p className="anim-fade-up anim-d3" style={{ textAlign:'center',marginTop:24,fontSize:14,color:'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'var(--accent)',fontWeight:600 }}>Sign in ↗</Link>
        </p>
      </div>
    </div>
  );
}
