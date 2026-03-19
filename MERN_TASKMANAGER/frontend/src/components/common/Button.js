import React from 'react';
import Spinner from './Spinner';

export default function Button({
  children, onClick, type = 'button',
  variant = 'primary', size = 'md',
  loading = false, disabled = false,
  fullWidth = false, style = {},
}) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, fontFamily: 'var(--font-sans)', fontWeight: 500, letterSpacing: '0.01em',
    border: '1px solid transparent', cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: 'all var(--transition-fast)',
    borderRadius: 'var(--radius-md)',
    width: fullWidth ? '100%' : undefined,
    whiteSpace: 'nowrap',
  };

  const sizes = {
    sm: { padding: '7px 14px', fontSize: 13 },
    md: { padding: '10px 20px', fontSize: 14 },
    lg: { padding: '13px 28px', fontSize: 15 },
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #4f8ef7 0%, #7c3aed 100%)',
      color: '#fff',
      boxShadow: '0 4px 16px rgba(79,142,247,0.3)',
    },
    secondary: {
      background: 'rgba(79,142,247,0.08)',
      color: 'var(--accent-primary)',
      borderColor: 'rgba(79,142,247,0.2)',
    },
    danger: {
      background: 'rgba(239,68,68,0.1)',
      color: '#ef4444',
      borderColor: 'rgba(239,68,68,0.2)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
    >
      {loading ? <Spinner small /> : children}
    </button>
  );
}
