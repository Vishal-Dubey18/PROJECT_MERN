import React from 'react';

export default function Input({
  label, name, type = 'text', value, onChange,
  placeholder, error, required, icon, multiline,
  rows = 3, style = {}, autoFocus,
}) {
  const inputStyle = {
    width: '100%',
    padding: icon ? '10px 12px 10px 38px' : '10px 14px',
    background: 'var(--bg-input)',
    border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'var(--border-default)'}`,
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    fontSize: 14,
    transition: 'border-color var(--transition-fast)',
    resize: 'vertical',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}{required && <span style={{ color: 'var(--accent-danger)', marginLeft: 3 }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)', pointerEvents: 'none', display: 'flex',
          }}>
            {icon}
          </span>
        )}
        {multiline ? (
          <textarea
            name={name} value={value} onChange={onChange}
            placeholder={placeholder} rows={rows}
            style={{ ...inputStyle, minHeight: 80 }}
          />
        ) : (
          <input
            name={name} type={type} value={value}
            onChange={onChange} placeholder={placeholder}
            required={required} autoFocus={autoFocus}
            style={inputStyle}
          />
        )}
      </div>
      {error && (
        <span style={{ fontSize: 12, color: 'var(--accent-danger)' }}>{error}</span>
      )}
    </div>
  );
}
