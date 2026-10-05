import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle = null,
  icon: Icon,
  colorScheme = 'blue',
  onClick = null,
}) {
  const schemes = {
    blue: {
      bg: 'bg-blue-50/70 dark:bg-blue-950/20',
      border: 'border-blue-100 dark:border-blue-900/30',
      text: 'text-blue-600 dark:text-blue-400',
      glow: 'group-hover:border-blue-300 dark:group-hover:border-blue-700',
    },
    emerald: {
      bg: 'bg-emerald-50/70 dark:bg-emerald-950/20',
      border: 'border-emerald-100 dark:border-emerald-900/30',
      text: 'text-emerald-600 dark:text-emerald-400',
      glow: 'group-hover:border-emerald-300 dark:group-hover:border-emerald-700',
    },
    amber: {
      bg: 'bg-amber-50/70 dark:bg-amber-950/20',
      border: 'border-amber-100 dark:border-amber-900/30',
      text: 'text-amber-600 dark:text-amber-400',
      glow: 'group-hover:border-amber-300 dark:group-hover:border-amber-700',
    },
    rose: {
      bg: 'bg-rose-50/70 dark:bg-rose-950/20',
      border: 'border-rose-100 dark:border-rose-900/30',
      text: 'text-rose-600 dark:text-rose-400',
      glow: 'group-hover:border-rose-300 dark:group-hover:border-rose-700',
    },
  };

  const current = schemes[colorScheme] || schemes.blue;

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white dark:bg-dark-800 border ${current.border} ${current.glow} rounded-2xl p-5 shadow-subtle hover:shadow-card transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${current.bg} ${current.text} transition-transform group-hover:scale-105 duration-200`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {value}
        </span>
        {subtitle && (
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
