import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/* ── Particle canvas background ─────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      o: Math.random() * 0.4 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79,142,247,${p.o})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      // Draw connecting lines
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(79,142,247,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
}

/* ── Animated typewriter headline ───────────────────────────── */
const PHRASES = ['Organize your work.', 'Hit every deadline.', 'Focus on what matters.', 'Ship faster, every day.'];
function TypeWriter() {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const full = PHRASES[idx];
    const speed = deleting ? 35 : 65;
    const timer = setTimeout(() => {
      if (!deleting && text === full) { setTimeout(() => setDeleting(true), 1800); return; }
      if (deleting && text === '') { setDeleting(false); setIdx(i => (i + 1) % PHRASES.length); return; }
      setText(prev => deleting ? prev.slice(0, -1) : full.slice(0, prev.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [text, deleting, idx]);
  return (
    <span style={{ color: '#4f8ef7' }}>
      {text}
      <span style={{ borderRight: '2px solid #4f8ef7', marginLeft: 2, animation: 'blink 1s step-end infinite' }}>
        &nbsp;
      </span>
    </span>
  );
}

/* ── Feature card ────────────────────────────────────────────── */
function FeatureCard({ icon, title, desc, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`anim-fade-up anim-d${delay}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(15,22,40,0.95)' : 'rgba(12,18,32,0.7)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${hovered ? 'rgba(79,142,247,0.35)' : 'rgba(79,142,247,0.1)'}`,
        borderRadius: 20,
        padding: '32px 28px',
        transition: 'all 280ms cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-6px)' : 'none',
        boxShadow: hovered ? '0 20px 60px rgba(79,142,247,0.15)' : 'none',
        position: 'relative', overflow: 'hidden',
        cursor: 'default',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg,transparent,rgba(79,142,247,0.6),transparent)',
        opacity: hovered ? 1 : 0, transition: 'opacity 280ms',
      }} />
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: 'rgba(79,142,247,0.1)',
        border: '1px solid rgba(79,142,247,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24, marginBottom: 18,
        transition: 'transform 280ms cubic-bezier(0.34,1.56,0.64,1)',
        transform: hovered ? 'scale(1.12) rotate(-5deg)' : 'scale(1)',
      }}>{icon}</div>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: '#eef2ff', marginBottom: 10, letterSpacing: '-0.02em' }}>{title}</h3>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</p>
    </div>
  );
}

/* ── Floating task card preview ──────────────────────────────── */
function FloatingTaskCard({ title, priority, status, delay, x, y }) {
  const colors = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
  const statusColors = { pending: '#f59e0b', completed: '#10b981' };
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      background: 'rgba(12,18,32,0.85)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(79,142,247,0.15)',
      borderRadius: 14, padding: '14px 18px',
      minWidth: 200,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      animation: `float ${3 + delay}s ease-in-out infinite ${delay * 0.5}s`,
      zIndex: 1,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#eef2ff' }}>{title}</span>
        <span style={{
          fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
          background: `${statusColors[status]}18`, color: statusColors[status],
          border: `1px solid ${statusColors[status]}30`,
        }}>{status}</span>
      </div>
      <span style={{
        fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
        background: `${colors[priority]}18`, color: colors[priority],
        border: `1px solid ${colors[priority]}30`,
      }}>● {priority} priority</span>
    </div>
  );
}

/* ── Stat counter ────────────────────────────────────────────── */
function StatCounter({ value, label, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      let start = 0;
      const end = parseInt(value);
      const step = end / 60;
      const timer = setInterval(() => {
        start += step;
        if (start >= end) { setCount(end); clearInterval(timer); }
        else setCount(Math.floor(start));
      }, 16);
      obs.disconnect();
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);
  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 42, fontWeight: 800, letterSpacing: '-0.03em', color: '#eef2ff', lineHeight: 1 }}>
        {count.toLocaleString()}{suffix}
      </p>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 6 }}>{label}</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN LANDING PAGE
══════════════════════════════════════════════════════════════ */
export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const FEATURES = [
    { icon: '⚡', title: 'Lightning fast', desc: 'Create, update, and organize tasks in seconds. No friction, no clutter — just pure productivity.', delay: 1 },
    { icon: '🔥', title: 'Priority system', desc: 'Tag tasks as High, Medium, or Low priority. Always know what to work on next.', delay: 2 },
    { icon: '🔍', title: 'Smart search', desc: 'Find any task instantly with real-time search and status filters. Never lose track of work.', delay: 3 },
    { icon: '📅', title: 'Due date tracking', desc: 'Set deadlines and get reminded before tasks slip. Stay ahead of every commitment.', delay: 4 },
    { icon: '📧', title: 'Email reminders', desc: 'Get automatic email alerts for due dates and weekly summaries delivered to your inbox.', delay: 5 },
    { icon: '🔒', title: 'Secure by default', desc: 'JWT auth, bcrypt hashing, rate limiting, and input validation keep your data protected.', delay: 6 },
  ];

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes heroGlow { 0%,100%{opacity:0.5} 50%{opacity:1} }
        .scroll-reveal { opacity:0; transform:translateY(30px); transition:opacity 0.6s ease, transform 0.6s ease; }
        .scroll-reveal.visible { opacity:1; transform:translateY(0); }
      `}</style>

      <ParticleCanvas />

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(5,8,16,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(79,142,247,0.1)' : 'none',
        transition: 'all 300ms ease',
        padding: '0 40px', height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, background: 'linear-gradient(135deg,#4f8ef7,#7c3aed)',
            borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, boxShadow: '0 4px 16px rgba(79,142,247,0.4)',
          }}>✦</div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.03em' }}>
            Task<span style={{ background: 'linear-gradient(135deg,#4f8ef7,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Flow</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/login" style={{
            padding: '8px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600,
            color: 'var(--text-secondary)',
            border: '1px solid rgba(79,142,247,0.15)',
            background: 'transparent',
            transition: 'all 200ms ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#eef2ff'; e.currentTarget.style.borderColor = 'rgba(79,142,247,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'rgba(79,142,247,0.15)'; }}
          >Sign in</Link>
          <Link to="/register" style={{
            padding: '8px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700,
            background: 'linear-gradient(135deg,#4f8ef7,#7c3aed)',
            color: '#fff', border: 'none',
            boxShadow: '0 4px 16px rgba(79,142,247,0.35)',
            transition: 'all 200ms ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(79,142,247,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,142,247,0.35)'; }}
          >Get started free</Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 40px 80px', position: 'relative', zIndex: 1 }}>
        {/* Floating task cards */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <FloatingTaskCard title="Design landing page" priority="high" status="pending" delay={0} x="5%" y="20%" />
          <FloatingTaskCard title="Write unit tests" priority="medium" status="completed" delay={1} x="72%" y="15%" />
          <FloatingTaskCard title="Deploy to production" priority="high" status="pending" delay={2} x="78%" y="65%" />
          <FloatingTaskCard title="Review pull request" priority="low" status="completed" delay={0.5} x="3%" y="68%" />
        </div>

        <div style={{ maxWidth: 760, textAlign: 'center', position: 'relative' }}>
          {/* Badge */}
          <div className="anim-fade-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 99,
            background: 'rgba(79,142,247,0.1)',
            border: '1px solid rgba(79,142,247,0.25)',
            fontSize: 13, fontWeight: 600, color: '#4f8ef7',
            marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4f8ef7', animation: 'heroGlow 2s ease infinite' }} />
            Free forever — no credit card required
          </div>

          {/* Headline */}
          <h1 className="anim-fade-up anim-d1" style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: 24 }}>
            The task manager that<br />
            <TypeWriter />
          </h1>

          {/* Subheadline */}
          <p className="anim-fade-up anim-d2" style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 40px' }}>
            TaskFlow helps you manage tasks with priorities, due dates, smart search, and email reminders — all in a beautiful, distraction-free interface.
          </p>

          {/* CTA buttons */}
          <div className="anim-fade-up anim-d3" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              padding: '14px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700,
              background: 'linear-gradient(135deg,#4f8ef7,#7c3aed)',
              color: '#fff', border: 'none',
              boxShadow: '0 8px 32px rgba(79,142,247,0.4)',
              transition: 'all 250ms cubic-bezier(0.34,1.2,0.64,1)',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(79,142,247,0.55)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 32px rgba(79,142,247,0.4)'; }}
            >
              Start for free ✦
            </Link>
            <Link to="/login" style={{
              padding: '14px 32px', borderRadius: 12, fontSize: 16, fontWeight: 600,
              background: 'rgba(255,255,255,0.05)',
              color: '#eef2ff',
              border: '1px solid rgba(255,255,255,0.12)',
              transition: 'all 200ms ease',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            >
              Sign in →
            </Link>
          </div>

          {/* Social proof */}
          <div className="anim-fade-up anim-d4" style={{ marginTop: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
            {['⚡ Instant setup', '🔒 Secure & private', '📱 Works on mobile', '🆓 Always free'].map(item => (
              <span key={item} style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section style={{ padding: '80px 40px', position: 'relative', zIndex: 1 }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          background: 'rgba(12,18,32,0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(79,142,247,0.12)',
          borderRadius: 24, padding: '48px 40px',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
          gap: 32,
        }}>
          <StatCounter value="10000" label="Tasks completed" suffix="+" />
          <StatCounter value="500" label="Active users" suffix="+" />
          <StatCounter value="99" label="Uptime %" suffix="%" />
          <StatCounter value="100" label="Free forever" suffix="%" />
        </div>
      </section>

      {/* ── Features Section ── */}
      <section style={{ padding: '80px 40px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{
              display: 'inline-block', padding: '5px 16px', borderRadius: 99,
              background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.2)',
              fontSize: 12, fontWeight: 600, color: '#4f8ef7', marginBottom: 16, letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>Everything you need</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
              Built for real productivity
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto' }}>
              Every feature is designed to reduce friction and help you focus on the work that matters.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
            {FEATURES.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section style={{ padding: '100px 40px', position: 'relative', zIndex: 1 }}>
        <div style={{
          maxWidth: 700, margin: '0 auto', textAlign: 'center',
          background: 'linear-gradient(135deg,rgba(79,142,247,0.08),rgba(124,58,237,0.08))',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(79,142,247,0.18)',
          borderRadius: 28, padding: '64px 48px',
          boxShadow: '0 40px 120px rgba(79,142,247,0.08)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(79,142,247,0.5),transparent)' }} />
          <div style={{ fontSize: 48, marginBottom: 20 }}>✦</div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
            Ready to get things done?
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 36, lineHeight: 1.7 }}>
            Join thousands of people using TaskFlow to stay organized, hit deadlines, and achieve more every day.
          </p>
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '15px 36px', borderRadius: 12, fontSize: 16, fontWeight: 700,
            background: 'linear-gradient(135deg,#4f8ef7,#7c3aed)',
            color: '#fff', border: 'none',
            boxShadow: '0 8px 32px rgba(79,142,247,0.4)',
            transition: 'all 250ms cubic-bezier(0.34,1.2,0.64,1)',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(79,142,247,0.55)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 32px rgba(79,142,247,0.4)'; }}
          >
            Create free account ✦
          </Link>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 16 }}>No credit card. No limits. Free forever.</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid rgba(79,142,247,0.08)',
        padding: '32px 40px',
        position: 'relative', zIndex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, background: 'linear-gradient(135deg,#4f8ef7,#7c3aed)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>✦</div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Task<span style={{ color: '#4f8ef7' }}>Flow</span></span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Built with ❤️ using the MERN Stack · © {new Date().getFullYear()} TaskFlow
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
