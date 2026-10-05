import React, { useState } from 'react';
import { PriorityBadge, CategoryBadge, TagBadge } from '../common/Badge';
import { getRelativeDateLabel, formatTime, isOverdue } from '../../utils/dateUtils';
import { getCategoryIcon } from '../../utils/categoryIcons';
import {
  Calendar,
  Clock,
  Edit2,
  Trash2,
  Check,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export default function TaskCard({
  task,
  category = null,
  onToggle,
  onEdit,
  onDelete,
  onRestore = null,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const overdue = isOverdue(task.dueDate, task.dueTime, task.completed);
  const dateLabel = getRelativeDateLabel(task.dueDate);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex flex-col sm:flex-row sm:items-start justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
        task.completed
          ? 'bg-slate-50/70 dark:bg-dark-850/40 border-slate-200/60 dark:border-slate-800/60 opacity-80'
          : overdue
          ? 'bg-rose-50/20 dark:bg-rose-950/10 border-rose-200/60 dark:border-rose-900/40 shadow-subtle hover:shadow-card hover:border-rose-300 dark:hover:border-rose-800'
          : 'bg-white dark:bg-dark-800 border-slate-200/80 dark:border-slate-800 shadow-subtle hover:shadow-card hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        {/* Custom Animated Checkbox */}
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
              : overdue
              ? 'border-rose-400 dark:border-rose-600 hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30'
              : 'border-slate-300 dark:border-slate-600 hover:border-brand-500 hover:bg-brand-50/40 dark:hover:bg-brand-950/30'
          }`}
          aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Task Details */}
        <div className="space-y-1.5 flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className={`text-sm font-semibold transition-all duration-150 break-words ${
                task.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-800 dark:text-slate-100'
              }`}
            >
              {task.title}
            </h4>

            {overdue && !task.completed && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-100/70 dark:bg-rose-950/50 px-2 py-0.5 rounded-full">
                <AlertTriangle className="w-3 h-3" />
                Overdue
              </span>
            )}
          </div>

          {task.description && (
            <p
              className={`text-xs leading-relaxed break-words line-clamp-2 ${
                task.completed
                  ? 'text-slate-400 dark:text-slate-600 line-through'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Badges row: Priority, Category, Due Date, Tags */}
          <div className="flex items-center flex-wrap gap-2 pt-1 text-xs">
            <PriorityBadge priority={task.priority} />

            {category && (
              <CategoryBadge
                category={category}
                icon={getCategoryIcon(category.icon, 'w-3 h-3')}
              />
            )}

            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${
                  task.completed
                    ? 'text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-dark-850'
                    : overdue
                    ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30'
                    : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-dark-700/60'
                }`}
              >
                <Calendar className="w-3 h-3 shrink-0" />
                <span>{dateLabel}</span>
                {task.dueTime && (
                  <>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <Clock className="w-3 h-3 shrink-0" />
                    <span>{formatTime(task.dueTime)}</span>
                  </>
                )}
              </span>
            )}

            {Array.isArray(task.tags) &&
              task.tags.map((tag) => <TagBadge key={tag} tag={tag} />)}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 mt-3 sm:mt-0 self-end sm:self-center shrink-0">
        {onRestore && task.completed && (
          <button
            type="button"
            onClick={() => onRestore(task.id)}
            className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-dark-700/60 rounded-lg transition-colors cursor-pointer"
            title="Restore task"
            aria-label="Restore task"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-700/60 rounded-lg transition-colors cursor-pointer"
            title="Edit task"
            aria-label="Edit task"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
