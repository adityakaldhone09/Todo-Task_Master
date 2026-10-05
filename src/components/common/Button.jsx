import React from 'react';

const VARIANTS = {
  primary: 'bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white shadow-sm hover:shadow focus-visible:ring-brand-500',
  secondary: 'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 dark:bg-dark-800 dark:hover:bg-dark-700 dark:active:bg-dark-600 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 focus-visible:ring-slate-400',
  outline: 'bg-transparent hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 focus-visible:ring-brand-500',
  ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-dark-800/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus-visible:ring-slate-400',
  danger: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-sm focus-visible:ring-rose-500',
};

const SIZES = {
  sm: 'px-2.5 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-3.5 py-2 text-sm rounded-xl gap-2',
  lg: 'px-4.5 py-2.5 text-base rounded-xl gap-2.5',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon = null,
  rightIcon = null,
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      
      <span>{children}</span>
      
      {!loading && rightIcon && (
        <span className="shrink-0">{rightIcon}</span>
      )}
    </button>
  );
}
