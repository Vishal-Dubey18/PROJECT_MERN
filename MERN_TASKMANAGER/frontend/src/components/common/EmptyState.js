import React from 'react';
import Button from './Button';

export default function EmptyState({ title, description, action, onAction }) {
  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '64px 24px', gap: 16,
        textAlign: 'center',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 72, height: 72,
          borderRadius: 'var(--radius-xl)',
          background: 'rgba(79,142,247,0.08)',
          border: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, marginBottom: 4,
        }}
      >
        📋
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)' }}>
        {title}
      </h3>
      {description && (
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 320 }}>
          {description}
        </p>
      )}
      {action && onAction && (
        <Button onClick={onAction} style={{ marginTop: 8 }}>
          {action}
        </Button>
      )}
    </div>
  );
}
