import React from 'react';

const styles = {
  fullscreen: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', background: 'var(--bg-primary)',
  },
  inline: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '40px 0',
  },
  spinner: {
    width: 32, height: 32,
    border: '2.5px solid rgba(79,142,247,0.2)',
    borderTop: '2.5px solid var(--accent-primary)',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  small: { width: 18, height: 18, borderWidth: 2 },
};

export default function Spinner({ fullscreen, small }) {
  const wrap = fullscreen ? styles.fullscreen : styles.inline;
  const spin = small ? { ...styles.spinner, ...styles.small } : styles.spinner;
  return (
    <div style={wrap}>
      <div style={spin} />
    </div>
  );
}
