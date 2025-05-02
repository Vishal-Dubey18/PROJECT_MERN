import React, { useState } from 'react';
import API from '../api';

const TaskForm = ({ refresh }) => {
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    dueDate: '',
    dueTime: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.dueDate) return;
    
    setLoading(true);
    try {
      await API.post('/tasks', form);
      setForm({ title: '', description: '', dueDate: '', dueTime: '' });
      refresh();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: '#4a5568',
          marginBottom: '8px'
        }}>Task Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="What needs to be done?"
          required
          style={{
            width: '100%',
            padding: '10px 14px',
            fontSize: '14px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            backgroundColor: '#f8fafc',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: '#4a5568',
          marginBottom: '8px'
        }}>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Add details..."
          style={{
            width: '100%',
            padding: '10px 14px',
            fontSize: '14px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            backgroundColor: '#f8fafc',
            outline: 'none',
            boxSizing: 'border-box',
            minHeight: '80px',
            resize: 'vertical'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#4a5568',
            marginBottom: '8px'
          }}>Due Date *</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            required
            min={new Date().toISOString().split('T')[0]}
            style={{
              width: '100%',
              padding: '10px 14px',
              fontSize: '14px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              backgroundColor: '#f8fafc',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <div style={{ flex: 1 }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#4a5568',
            marginBottom: '8px'
          }}>Time (Optional)</label>
          <input
            type="time"
            value={form.dueTime}
            onChange={(e) => setForm({ ...form, dueTime: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 14px',
              fontSize: '14px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              backgroundColor: '#f8fafc',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: '600',
          color: '#fff',
          backgroundColor: '#4f46e5',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          opacity: loading ? 0.8 : 1
        }}
      >
        {loading ? (
          <>
            <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            Adding...
          </>
        ) : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm;