import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/tasks/TaskCard';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { CheckCircle2, Trash2 } from 'lucide-react';

export default function Completed() {
  const { tasks, toggleTask, restoreTask, clearCompleted, getCategoryById } = useTasks();
  const { onEditTask, onDeleteTask } = useOutletContext();
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const completedTasks = tasks
    .filter((t) => t.completed)
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            <span>Completed Tasks</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review all accomplished tasks. You can restore them to active or remove them permanently.
          </p>
        </div>

        {completedTasks.length > 0 && (
          <button
            type="button"
            onClick={() => setIsClearModalOpen(true)}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Completed ({completedTasks.length})</span>
          </button>
        )}
      </div>

      {completedTasks.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No completed tasks yet"
          description="Complete items by clicking the checkbox on any task card."
          actionLabel="View All Tasks"
          onAction={() => window.location.assign('/tasks')}
        />
      ) : (
        <div className="space-y-2.5">
          {completedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              category={getCategoryById(task.category)}
              onToggle={toggleTask}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onRestore={restoreTask}
            />
          ))}
        </div>
      )}

      {/* Confirmation Dialog for Clearing All Completed */}
      <ConfirmDialog
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={clearCompleted}
        title="Clear All Completed Tasks?"
        message={`Are you sure you want to permanently clear ${completedTasks.length} completed task${completedTasks.length > 1 ? 's' : ''}?`}
        confirmText="Clear All"
        isDestructive={true}
      />
    </div>
  );
}
