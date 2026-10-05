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

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center gap-3 px-4 py-3 bg-white/95 dark:bg-dark-800/95 backdrop-blur-md rounded-xl shadow-lg border ${borders[type]} text-slate-800 dark:text-slate-100 text-sm font-medium animate-slide-down transition-all duration-200 pointer-events-auto min-w-[280px] max-w-md`}
    >
      {icons[type] || icons.success}
      <span className="flex-1">{message}</span>
      <button
        onClick={() => onDismiss(id)}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-700/60 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
