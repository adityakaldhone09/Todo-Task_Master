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
      bg: 'bg-blue-50/80 dark:bg-blue-950/30',
      border: 'border-blue-100 dark:border-blue-900/30',
      text: 'text-blue-600 dark:text-blue-400',
      glow: 'hover:border-blue-300 dark:hover:border-blue-700 hover:glass-glow-brand',
      accent: 'from-blue-500/10 to-indigo-500/0',
    },
    emerald: {
      bg: 'bg-emerald-50/80 dark:bg-emerald-950/30',
      border: 'border-emerald-100 dark:border-emerald-900/30',
      text: 'text-emerald-600 dark:text-emerald-400',
      glow: 'hover:border-emerald-300 dark:hover:border-emerald-700 hover:glass-glow-emerald',
      accent: 'from-emerald-500/10 to-teal-500/0',
    },
    amber: {
      bg: 'bg-amber-50/80 dark:bg-amber-950/30',
      border: 'border-amber-100 dark:border-amber-900/30',
      text: 'text-amber-600 dark:text-amber-400',
      glow: 'hover:border-amber-300 dark:hover:border-amber-700 hover:glass-glow-amber',
      accent: 'from-amber-500/10 to-yellow-500/0',
    },
    rose: {
      bg: 'bg-rose-50/80 dark:bg-rose-950/30',
      border: 'border-rose-100 dark:border-rose-900/30',
      text: 'text-rose-600 dark:text-rose-400',
      glow: 'hover:border-rose-300 dark:hover:border-rose-700 hover:glass-glow-rose',
      accent: 'from-rose-500/10 to-pink-500/0',
    },
  };

  const current = schemes[colorScheme] || schemes.blue;

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white dark:bg-dark-800 border ${current.border} ${current.glow} rounded-2xl p-5 shadow-subtle hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Subtle ambient corner gradient glow */}
      <div
        className={`absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br ${current.accent} rounded-full blur-xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-300`}
      />

      <div className="relative z-10 flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${current.bg} ${current.text} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 shadow-xs`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="relative z-10 flex items-baseline justify-between">
        <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-transform duration-200 group-hover:scale-[1.02]">
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
