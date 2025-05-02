import React from 'react';
import API from '../api';
import { format, parseISO, isBefore } from 'date-fns';

const TaskList = ({ tasks, refresh }) => {
  const toggleStatus = async (taskId, currentStatus) => {
    try {
      await API.put(`/tasks/${taskId}`, {
        status: currentStatus === 'pending' ? 'completed' : 'pending'
      });
      refresh();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      refresh();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {tasks.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#64748b',
          fontSize: '14px'
        }}>
          No tasks found. Add your first task!
        </div>
      ) : (
        tasks.map((task) => {
          const isOverdue = isBefore(parseISO(task.dueDate), new Date()) && task.status === 'pending';
          
          return (
            <div key={task._id} style={{
              backgroundColor: task.status === 'completed' ? '#f0fdf4' : '#fff',
              borderRadius: '8px',
              padding: '16px',
              border: `1px solid ${isOverdue ? '#fca5a5' : '#e2e8f0'}`,
              transition: 'all 0.2s',
              opacity: task.status === 'completed' ? 0.8 : 1
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <button
                  onClick={() => toggleStatus(task._id, task.status)}
                  style={{
                    flexShrink: 0,
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: `2px solid ${task.status === 'completed' ? '#10b981' : '#d1d5db'}`,
                    backgroundColor: task.status === 'completed' ? '#10b981' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {task.status === 'completed' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </button>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: task.status === 'completed' ? '#6b7280' : '#1e293b',
                    margin: 0,
                    textDecoration: task.status === 'completed' ? 'line-through' : 'none'
                  }}>
                    {task.title}
                  </h3>
                  
                  {task.description && (
                    <p style={{
                      fontSize: '14px',
                      color: task.status === 'completed' ? '#9ca3af' : '#4b5563',
                      margin: '4px 0 0 0'
                    }}>
                      {task.description}
                    </p>
                  )}
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '8px',
                    fontSize: '13px',
                    color: isOverdue ? '#dc2626' : '#6b7280'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>
                      {format(parseISO(task.dueDate), 'MMM dd, yyyy')}
                      {task.dueTime && ` • ${task.dueTime}`}
                      {isOverdue && ' • Overdue'}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDelete(task._id)}
                  style={{
                    flexShrink: 0,
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#dc2626',
                    backgroundColor: '#fee2e2',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default TaskList;