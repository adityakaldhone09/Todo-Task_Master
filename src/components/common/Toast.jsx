import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ toast, onDismiss }) {
  const { id, type = 'success', message, duration = 3500 } = toast;

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/20 dark:border-emerald-500/30',
    error: 'border-rose-500/20 dark:border-rose-500/30',
    warning: 'border-amber-500/20 dark:border-amber-500/30',
    info: 'border-blue-500/20 dark:border-blue-500/30',
  };

  const progressColors = {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    warning: 'bg-amber-500',
    info: 'bg-brand-500',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`group relative flex items-center gap-3 px-4 pt-3.5 pb-4 bg-white/95 dark:bg-dark-800/95 backdrop-blur-md rounded-2xl shadow-card border ${borders[type]} text-slate-800 dark:text-slate-100 text-sm font-medium animate-pop-in transition-all duration-300 pointer-events-auto min-w-[280px] max-w-md overflow-hidden`}
    >
      <div className="shrink-0 transition-transform duration-200 group-hover:scale-110">
        {icons[type] || icons.success}
      </div>
      <span className="flex-1 leading-snug">{message}</span>
      <button
        type="button"
        onClick={() => onDismiss(id)}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-700/60 transition-all duration-200 hover:rotate-90 active:scale-90 cursor-pointer"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Dynamic Animated Duration Progress Bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100/60 dark:bg-dark-900/40 overflow-hidden">
          <div
            className={`h-full toast-progress-bar ${progressColors[type] || progressColors.success}`}
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      )}
    </div>
  );
}
