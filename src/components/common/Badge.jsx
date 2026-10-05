import React from 'react';
import { PRIORITY_CONFIG } from '../../utils/constants';

export function PriorityBadge({ priority, className = '' }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.badge} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export function CategoryBadge({ category, icon = null, className = '' }) {
  if (!category) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${category.bgColor || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {category.name || category}
    </span>
  );
}

export function TagBadge({ tag, onRemove = null, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 ${className}`}
    >
      #{tag}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(tag);
          }}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-0.5"
          aria-label={`Remove tag ${tag}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
