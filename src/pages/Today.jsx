import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/tasks/TaskCard';
import EmptyState from '../components/common/EmptyState';
import { isToday, isOverdue, getTodayDateString } from '../utils/dateUtils';
import { AlertTriangle, Calendar, CheckCircle2 } from 'lucide-react';

export default function Today() {
  const { tasks, toggleTask, restoreTask, getCategoryById } = useTasks();
  const { onOpenNewTask, onEditTask, onDeleteTask } = useOutletContext();

  const todayStr = getTodayDateString();

  // 1. Overdue: pending tasks whose due date is past or overdue today
  const overdueTasks = tasks.filter(
    (t) => !t.completed && isOverdue(t.dueDate, t.dueTime, t.completed)
  );

  // 2. Due Today: pending tasks with dueDate === todayStr and not yet overdue
  const dueTodayTasks = tasks.filter(
    (t) => !t.completed && t.dueDate === todayStr && !isOverdue(t.dueDate, t.dueTime, t.completed)
  );

  // 3. Completed Today: completed tasks completed or due today
  const completedTodayTasks = tasks.filter((t) => {
    if (!t.completed) return false;
    return (t.updatedAt && t.updatedAt.startsWith(todayStr)) || t.dueDate === todayStr;
  });

  const totalTodayTasks = overdueTasks.length + dueTodayTasks.length + completedTodayTasks.length;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            <span>Today's Focus</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Focus on what matters today. Tackle overdue items and finish scheduled goals.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewTask}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          + Add Task for Today
        </button>
      </div>

      {totalTodayTasks === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No tasks scheduled for today"
          description="Enjoy your free time, or create tasks for today to get a head start."
          actionLabel="Schedule Task for Today"
          onAction={onOpenNewTask}
        />
      ) : (
        <div className="space-y-8">
          {/* Section 1: Overdue */}
          {overdueTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-4 h-4" />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Overdue ({overdueTasks.length})
                </h3>
              </div>
              <div className="space-y-2.5">
                {overdueTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    category={getCategoryById(task.category)}
                    onToggle={toggleTask}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Due Today */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <Calendar className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Due Today ({dueTodayTasks.length})
              </h3>
            </div>
            {dueTodayTasks.length === 0 ? (
              <p className="text-xs text-slate-400 italic px-2 py-3 bg-slate-50 dark:bg-dark-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                No active tasks due today. Great work!
              </p>
            ) : (
              <div className="space-y-2.5">
                {dueTodayTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    category={getCategoryById(task.category)}
                    onToggle={toggleTask}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Completed Today */}
          {completedTodayTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Completed Today ({completedTodayTasks.length})
                </h3>
              </div>
              <div className="space-y-2.5">
                {completedTodayTasks.map((task) => (
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
