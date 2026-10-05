import React from 'react';
import TaskCard from './TaskCard';
import EmptyState from '../common/EmptyState';

export default function TaskList({
  tasks = [],
  getCategoryById,
  onToggle,
  onEdit,
  onDelete,
  onRestore,
  emptyTitle = 'No tasks found',
  emptyDescription = 'Try adjusting your search or filters, or create a new task.',
  emptyActionLabel = 'Create Task',
  onEmptyAction = null,
}) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div className="space-y-2.5">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          category={getCategoryById ? getCategoryById(task.category) : null}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onRestore={onRestore}
        />
      ))}
    </div>
  );
}
