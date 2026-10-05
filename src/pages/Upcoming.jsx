import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/tasks/TaskCard';
import EmptyState from '../components/common/EmptyState';
import { getTodayDateString, getTomorrowDateString, getRelativeDateLabel } from '../utils/dateUtils';
import { Clock, Calendar } from 'lucide-react';

export default function Upcoming() {
  const { tasks, toggleTask, getCategoryById } = useTasks();
  const { onOpenNewTask, onEditTask, onDeleteTask } = useOutletContext();

  const todayStr = getTodayDateString();

  // Group pending upcoming tasks strictly after today by date
  const groupedTasks = useMemo(() => {
    const upcoming = tasks
      .filter((t) => !t.completed && t.dueDate && t.dueDate > todayStr)
      .sort((a, b) => {
        const dateComp = a.dueDate.localeCompare(b.dueDate);
        if (dateComp !== 0) return dateComp;
        return (a.dueTime || '').localeCompare(b.dueTime || '');
      });

    const groups = {};
    upcoming.forEach((task) => {
      if (!groups[task.dueDate]) {
        groups[task.dueDate] = [];
      }
      groups[task.dueDate].push(task);
    });

    return groups;
  }, [tasks, todayStr]);

  const dates = Object.keys(groupedTasks);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Upcoming Tasks</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tasks scheduled for tomorrow and beyond, grouped chronologically.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewTask}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          + Add Upcoming Task
        </button>
      </div>

      {dates.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No upcoming tasks"
          description="You don't have any tasks scheduled for future dates. Plan your week ahead!"
          actionLabel="Schedule Future Task"
          onAction={onOpenNewTask}
        />
      ) : (
        <div className="space-y-8">
          {dates.map((dateStr) => {
            const dateTasks = groupedTasks[dateStr];
            const label = getRelativeDateLabel(dateStr);

            return (
              <div key={dateStr} className="space-y-3">
                {/* Date Header with Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {label}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-dark-750 text-slate-500 dark:text-slate-400 font-semibold">
                      {dateTasks.length}
                    </span>
                  </div>
                  <div className="flex-1 h-[1px] bg-slate-200 dark:bg-dark-800" />
                  <span className="text-[11px] text-slate-400 font-medium">
                    {dateStr}
                  </span>
                </div>

                {/* Tasks under this date */}
                <div className="space-y-2.5">
                  {dateTasks.map((task) => (
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
            );
          })}
        </div>
      )}
    </div>
  );
}
