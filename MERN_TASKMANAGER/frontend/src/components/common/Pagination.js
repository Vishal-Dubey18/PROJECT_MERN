import React from 'react';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const btnStyle = (active) => ({
    width: 34, height: 34,
    borderRadius: 'var(--radius-md)',
    border: `1px solid ${active ? 'var(--accent-primary)' : 'var(--border-default)'}`,
    background: active ? 'rgba(79,142,247,0.15)' : 'transparent',
    color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
    fontSize: 13, fontWeight: active ? 600 : 400,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all var(--transition-fast)',
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 32 }}>
      <button
        style={btnStyle(false)}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        ‹
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
        .reduce((acc, p, idx, arr) => {
          if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…');
          acc.push(p);
          return acc;
        }, [])
        .map((p, i) =>
          p === '…' ? (
            <span key={`dots-${i}`} style={{ color: 'var(--text-muted)', fontSize: 13, padding: '0 4px' }}>
              …
            </span>
          ) : (
            <button key={p} style={btnStyle(p === page)} onClick={() => onPageChange(p)}>
              {p}
            </button>
          )
        )}

      <button
        style={btnStyle(false)}
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        ›
      </button>
    </div>
  );
}
