import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/* ── Particle canvas ─────────────────────────────────────────── */
function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx    = canvas.getContext('2d');
    let id;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      dx: (Math.random() - 0.5) * 0.28,
      dy: (Math.random() - 0.5) * 0.28,
      o: Math.random() * 0.35 + 0.08,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79,142,247,${p.o})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(79,142,247,${0.07 * (1 - d / 110)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }));
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
}

/* ── Typewriter ──────────────────────────────────────────────── */
const PHRASES = [
  'organize your work.',
  'hit every deadline.',
  'focus on what matters.',
  'get more done, every day.',
];
function Typewriter() {
  const [idx,      setIdx]      = useState(0);
  const [text,     setText]     = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full  = PHRASES[idx];
    const speed = deleting ? 32 : 62;
    const timer = setTimeout(() => {
      if (!deleting && text === full) { setTimeout(() => setDeleting(true), 1900); return; }
      if (deleting && text === '')    { setDeleting(false); setIdx(i => (i + 1) % PHRASES.length); return; }
      setText(prev => deleting ? prev.slice(0, -1) : full.slice(0, prev.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [text, deleting, idx]);

  return (
    <span>
      <span style={{
        background: 'linear-gradient(135deg,#4f8ef7,#a78bfa 50%,#7c3aed)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        animation: 'gradientShift 4s ease infinite',
      }}>{text}</span>
      <span style={{ borderRight: '2.5px solid #4f8ef7', marginLeft: 2, animation: 'blink 1s step-end infinite' }}>&nbsp;</span>
    </span>
  );
}

/* ── Feature card ─────────────────────────────────────────────── */
function FeatureCard({ icon, title, description, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className={`anim-fade-up anim-d${delay}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'rgba(16,22,40,0.97)' : 'rgba(12,18,32,0.72)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${hov ? 'rgba(79,142,247,0.38)' : 'rgba(79,142,247,0.1)'}`,
        borderRadius: 20, padding: '32px 28px',
        transition: 'all 280ms cubic-bezier(0.4,0,0.2,1)',
        transform: hov ? 'translateY(-6px)' : 'none',
        boxShadow: hov ? '0 20px 60px rgba(79,142,247,0.14)' : 'none',
        position: 'relative', overflow: 'hidden', cursor: 'default',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg,transparent,rgba(79,142,247,0.6),transparent)',
        opacity: hov ? 1 : 0, transition: 'opacity 280ms',
      }} />
      <div style={{
        width: 50, height: 50, borderRadius: 14,
        background: 'rgba(79,142,247,0.1)',
        border: '1px solid rgba(79,142,247,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, marginBottom: 18,
        transition: 'transform 300ms cubic-bezier(0.34,1.56,0.64,1)',
        transform: hov ? 'scale(1.12) rotate(-5deg)' : 'scale(1)',
      }}>{icon}</div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#eef2ff', marginBottom: 10, letterSpacing: '-0.01em' }}>
        {title}
      </h3>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
        {description}
      </p>
    </div>
  );
}

/* ── Floating task card preview ──────────────────────────────── */
function FloatingCard({ title, priority, status, x, y, delay }) {
  const pc = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
  const sc = { pending: '#f59e0b', completed: '#10b981' };
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      background: 'rgba(12,18,32,0.88)',
      backdropFilter: 'blur(14px)',
      border: '1px solid rgba(79,142,247,0.14)',
      borderRadius: 14, padding: '13px 17px', minWidth: 190,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      animation: `float ${3.5 + delay}s ease-in-out infinite ${delay * 0.6}s`,
      zIndex: 1, pointerEvents: 'none',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#eef2ff' }}>{title}</span>
        <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: `${sc[status]}15`, color: sc[status], border: `1px solid ${sc[status]}30` }}>
          {status}
        </span>
      </div>
      <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: `${pc[priority]}12`, color: pc[priority], border: `1px solid ${pc[priority]}28` }}>
        ● {priority} priority
      </span>
    </div>
  );
}

/* ── Stat counter ─────────────────────────────────────────────── */
function StatCounter({ end, label, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      let n = 0;
      const step = end / 60;
      const t = setInterval(() => {
        n += step;
        if (n >= end) { setCount(end); clearInterval(t); }
        else setCount(Math.floor(n));
      }, 16);
      obs.disconnect();
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', color: '#eef2ff', lineHeight: 1 }}>
        {count.toLocaleString()}{suffix}
      </p>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 6 }}>{label}</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function Landing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const id = 'landing-styles';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`;
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const FEATURES = [
    { icon: '⚡', title: 'Lightning fast',    description: 'Create, update, and organize tasks in seconds. No friction, no clutter — just pure productivity.',     delay: 1 },
    { icon: '🔥', title: 'Priority system',   description: 'Tag every task as high, medium, or low priority. Always know what to work on next.',                   delay: 2 },
    { icon: '🔍', title: 'Smart search',      description: 'Find any task instantly with real-time search and status filters. Nothing ever gets lost.',              delay: 3 },
    { icon: '📅', title: 'Due date tracking', description: 'Set deadlines and get reminded before tasks slip. Stay ahead of every commitment you make.',             delay: 4 },
    { icon: '📧', title: 'Email reminders',   description: 'Automatic email alerts for due dates and weekly summaries delivered straight to your inbox.',            delay: 5 },
    { icon: '🔒', title: 'Secure by default', description: 'JWT auth, bcrypt hashing, rate limiting, and input validation keep your data safe.',                    delay: 6 },
  ];

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <ParticleCanvas />

      {/* ── Navigation ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(5,8,16,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(79,142,247,0.1)' : 'none',
        transition: 'all 300ms ease',
        padding: '0 clamp(20px,5vw,48px)', height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg,#4f8ef7,#7c3aed)',
            borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, boxShadow: '0 4px 16px rgba(79,142,247,0.4)', flexShrink: 0,
          }}>✦</div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.03em', color: '#eef2ff' }}>
            Task<span style={{ background: 'linear-gradient(135deg,#4f8ef7,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Flow</span>
          </span>
        </div>

        {/* Nav actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link to="/login" style={{
            padding: '8px 18px', borderRadius: 10, fontSize: 14, fontWeight: 600,
            color: 'var(--text-secondary)',
            border: '1px solid rgba(79,142,247,0.15)',
            transition: 'all 180ms ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#eef2ff'; e.currentTarget.style.borderColor = 'rgba(79,142,247,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'rgba(79,142,247,0.15)'; }}
          >Sign in</Link>
          <Link to="/register" style={{
            padding: '8px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700,
            background: 'linear-gradient(135deg,#4f8ef7,#7c3aed)',
            color: '#fff',
            boxShadow: '0 4px 16px rgba(79,142,247,0.35)',
            transition: 'all 200ms cubic-bezier(0.34,1.2,0.64,1)',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(79,142,247,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,142,247,0.35)'; }}
          >Get started free</Link>
        </div>
      </nav>

      {/* ── Hero section ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(100px,15vh,140px) clamp(20px,5vw,48px) 80px',
        position: 'relative', zIndex: 1,
      }}>
        {/* Floating task cards */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <FloatingCard title="Design landing page"  priority="high"   status="pending"   x="4%"  y="22%" delay={0}   />
          <FloatingCard title="Write unit tests"     priority="medium" status="completed" x="70%" y="16%" delay={1}   />
          <FloatingCard title="Deploy to production" priority="high"   status="pending"   x="74%" y="65%" delay={2}   />
          <FloatingCard title="Review pull request"  priority="low"    status="completed" x="2%"  y="68%" delay={0.5} />
        </div>

        <div style={{ maxWidth: 760, textAlign: 'center', position: 'relative' }}>
          {/* Badge */}
          <div className="anim-fade-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 99,
            background: 'rgba(79,142,247,0.08)',
            border: '1px solid rgba(79,142,247,0.22)',
            fontSize: 13, fontWeight: 600, color: '#4f8ef7',
            marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4f8ef7', animation: 'errorPulse 2s ease infinite' }} />
            Free forever — no credit card needed
          </div>

          {/* Headline — sentence case, proper casing */}
          <h1 className="anim-fade-up anim-d1" style={{
            fontSize: 'clamp(34px,6vw,66px)',
            fontWeight: 800, lineHeight: 1.1,
            letterSpacing: '-0.04em', marginBottom: 22,
            color: '#eef2ff',
          }}>
            The best way to<br />
            <Typewriter />
          </h1>

          {/* Sub-headline */}
          <p className="anim-fade-up anim-d2" style={{
            fontSize: 'clamp(15px,2vw,18px)',
            color: 'var(--text-secondary)',
            lineHeight: 1.7, maxWidth: 520,
            margin: '0 auto 40px',
          }}>
            TaskFlow helps you manage tasks with priorities, due dates, smart search,
            and email reminders — all in a beautiful, distraction-free interface.
          </p>

          {/* CTA buttons */}
          <div className="anim-fade-up anim-d3" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              padding: 'clamp(12px,2vh,15px) clamp(24px,3vw,34px)',
              borderRadius: 12, fontSize: 'clamp(14px,1.5vw,16px)', fontWeight: 700,
              background: 'linear-gradient(135deg,#4f8ef7,#7c3aed)',
              color: '#fff',
              boxShadow: '0 8px 32px rgba(79,142,247,0.4)',
              transition: 'all 260ms cubic-bezier(0.34,1.2,0.64,1)',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 14px 44px rgba(79,142,247,0.55)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 32px rgba(79,142,247,0.4)'; }}
            >
              Start for free ✦
            </Link>
            <Link to="/login" style={{
              padding: 'clamp(12px,2vh,15px) clamp(24px,3vw,34px)',
              borderRadius: 12, fontSize: 'clamp(14px,1.5vw,16px)', fontWeight: 600,
              background: 'rgba(255,255,255,0.05)',
              color: '#eef2ff',
              border: '1px solid rgba(255,255,255,0.12)',
              transition: 'all 200ms ease',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              Sign in →
            </Link>
          </div>

          {/* Trust badges */}
          <div className="anim-fade-up anim-d4" style={{
            marginTop: 44,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 'clamp(14px,3vw,28px)', flexWrap: 'wrap',
          }}>
            {[
              '⚡ Instant setup',
              '🔒 Secure & private',
              '📱 Works on mobile',
              '🆓 Always free',
            ].map(item => (
              <span key={item} style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats section ── */}
      <section style={{ padding: 'clamp(48px,8vh,80px) clamp(20px,5vw,48px)', position: 'relative', zIndex: 1 }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          background: 'rgba(12,18,32,0.72)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(79,142,247,0.12)',
          borderRadius: 24, padding: 'clamp(32px,5vw,48px) 40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))',
          gap: 32,
        }}>
          <StatCounter end={10000} label="Tasks completed"  suffix="+" />
          <StatCounter end={500}   label="Active users"     suffix="+" />
          <StatCounter end={99}    label="Uptime %"         suffix="%" />
          <StatCounter end={100}   label="Free forever"     suffix="%" />
        </div>
      </section>

      {/* ── Features section ── */}
      <section style={{ padding: 'clamp(48px,8vh,80px) clamp(20px,5vw,48px)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Section heading */}
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              display: 'inline-block', padding: '5px 16px', borderRadius: 99,
              background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.2)',
              fontSize: 11, fontWeight: 700, color: '#4f8ef7',
              marginBottom: 16, letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              Everything you need
            </div>
            <h2 style={{
              fontSize: 'clamp(26px,4vw,42px)',
              fontWeight: 800, letterSpacing: '-0.03em',
              marginBottom: 14, color: '#eef2ff',
            }}>
              Built for real productivity
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 460, margin: '0 auto', lineHeight: 1.7 }}>
              Every feature is designed to reduce friction and help you focus on the work that matters most.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 18 }}>
            {FEATURES.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── How it works section ── */}
      <section style={{ padding: 'clamp(48px,8vh,80px) clamp(20px,5vw,48px)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 48, color: '#eef2ff' }}>
            Up and running in 3 steps
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 24 }}>
            {[
              { step: '01', icon: '✦', title: 'Create your account', desc: 'Sign up free in under 30 seconds. No credit card, no setup fee.' },
              { step: '02', icon: '📝', title: 'Add your first task', desc: 'Create tasks with priorities, due dates, and descriptions.' },
              { step: '03', icon: '✅', title: 'Stay on track', desc: 'Get email reminders, filter your tasks, and mark them done.' },
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(12,18,32,0.7)',
                border: '1px solid rgba(79,142,247,0.1)',
                borderRadius: 18, padding: '32px 24px',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg,#4f8ef7,#7c3aed)',
                  borderRadius: 8, padding: '4px 12px',
                  fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: '0.08em',
                }}>{item.step}</div>
                <div style={{ fontSize: 32, marginBottom: 16, marginTop: 8 }}>{item.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#eef2ff', marginBottom: 10 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA section ── */}
      <section style={{ padding: 'clamp(64px,10vh,100px) clamp(20px,5vw,48px)', position: 'relative', zIndex: 1 }}>
        <div style={{
          maxWidth: 680, margin: '0 auto', textAlign: 'center',
          background: 'linear-gradient(135deg,rgba(79,142,247,0.08),rgba(124,58,237,0.08))',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(79,142,247,0.18)',
          borderRadius: 28, padding: 'clamp(40px,6vh,64px) clamp(24px,5vw,48px)',
          boxShadow: '0 40px 120px rgba(79,142,247,0.07)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(79,142,247,0.5),transparent)' }} />
          <div style={{ fontSize: 44, marginBottom: 18 }}>✦</div>
          <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 14, color: '#eef2ff' }}>
            Ready to get things done?
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 36, lineHeight: 1.7 }}>
            Join thousands of people using TaskFlow to stay organized, hit deadlines, and achieve more every single day.
          </p>
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '15px 36px', borderRadius: 12,
            fontSize: 16, fontWeight: 700,
            background: 'linear-gradient(135deg,#4f8ef7,#7c3aed)',
            color: '#fff',
            boxShadow: '0 8px 32px rgba(79,142,247,0.4)',
            transition: 'all 260ms cubic-bezier(0.34,1.2,0.64,1)',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(79,142,247,0.55)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 32px rgba(79,142,247,0.4)'; }}
          >
            Create free account ✦
          </Link>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 16 }}>
            No credit card. No limits. Free forever.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid rgba(79,142,247,0.08)',
        padding: 'clamp(20px,3vh,32px) clamp(20px,5vw,48px)',
        position: 'relative', zIndex: 1,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, background: 'linear-gradient(135deg,#4f8ef7,#7c3aed)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>✦</div>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#eef2ff' }}>
            Task<span style={{ color: '#4f8ef7' }}>Flow</span>
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Built with ❤️ using the MERN stack · © {new Date().getFullYear()} TaskFlow
        </p>
        <div style={{ display: 'flex', gap: 20 }}>
          {[['Sign in', '/login'], ['Register', '/register']].map(([label, to]) => (
            <Link key={to} to={to} style={{ fontSize: 13, color: 'var(--text-muted)', transition: 'color 150ms' }}
              onMouseEnter={e => e.currentTarget.style.color = '#4f8ef7'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >{label}</Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
