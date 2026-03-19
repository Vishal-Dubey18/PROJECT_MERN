import React from 'react';
import TaskCard from './TaskCard';
import SkeletonGrid from '../common/SkeletonGrid';
import EmptyState from '../common/EmptyState';

export default function TaskGrid({ tasks, loading, error, onEdit, onDelete, onToggle, onNew }) {
  if (loading) return <SkeletonGrid count={6} />;

  if (error) {
    return (
      <EmptyState
        title="Failed to load tasks"
        description={error}
        action="Retry"
        onAction={() => window.location.reload()}
      />
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks yet"
        description="Create your first task to get started. Stay organized and get things done."
        action="+ Create Task"
        onAction={onNew}
      />
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 16,
      }}
    >
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
