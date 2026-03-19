import React, { useState } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await API.post('/auth/login', form);
      login(res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    backgroundColor: '#f8fafc',
    transition: 'all 0.2s',
    outline: 'none',
    boxSizing: 'border-box',
    height: '44px', 
    marginBottom: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#4a5568',
    marginBottom: '8px'
  };

  const inputContainerStyle = {
    marginBottom: '20px' // Consistent spacing between form groups
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'url("https://source.unsplash.com/random/1920x1080") no-repeat center center fixed',
      backgroundSize: 'cover',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
        padding: '40px',
        margin: '20px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#2d3748',
            marginBottom: '8px'
          }}>Welcome Back</h2>
          <p style={{
            fontSize: '14px',
            color: '#718096',
            margin: 0
          }}>Login with your username or email</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg style={{ flexShrink: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={inputContainerStyle}>
            <label style={labelStyle}>Username or Email</label>
            <input
              type="text"
              value={form.identifier}
              onChange={(e) => setForm({ ...form, identifier: e.target.value })}
              required
              style={inputStyle}
              placeholder="Enter username or email"
              autoComplete="username"
            />
          </div>

          <div style={inputContainerStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              style={inputStyle}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#fff',
              backgroundColor: '#4f46e5',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: loading ? 0.8 : 1,
              height: '44px',
              userSelect: 'none'
            }}
            onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = '#4338ca')}
            onMouseLeave={e => !loading && (e.currentTarget.style.backgroundColor = '#4f46e5')}
          >
            {loading ? (
              <>
                <svg style={{ animation: 'spin 1s linear infinite' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
                Logging in...
              </>
            ) : 'Login'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '14px',
          color: '#64748b'
        }}>
          Don't have an account?{' '}
          <Link to="/register" style={{
            color: '#4f46e5',
            fontWeight: '600',
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
          >
            Sign up
          </Link>
        </div>

      {/* Inline spinner animation keyframes */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
      </div>
    </div>
  );
};

export default Login;