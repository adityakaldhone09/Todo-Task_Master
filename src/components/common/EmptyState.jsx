import React from 'react';
import { CheckCircle2, Plus } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  icon: Icon = CheckCircle2,
  title = 'No tasks yet',
  description = 'Create your first task and start getting things done.',
  actionLabel = 'Create Task',
  onAction = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4 ring-8 ring-brand-50/50 dark:ring-brand-950/20 shadow-sm animate-fade-in">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {onAction && (
        <Button
          onClick={onAction}
          leftIcon={<Plus className="w-4 h-4" />}
          variant="primary"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
