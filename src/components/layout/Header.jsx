import React, { useMemo } from 'react';
import { Menu, Plus, Sun, Moon, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Header({
  onToggleMobileMenu,
  onOpenNewTaskModal,
  theme,
  onToggleTheme,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine current page title
  const pageTitles = {
    '/': 'Dashboard',
    '/tasks': 'All Tasks',
    '/today': 'Today',
    '/upcoming': 'Upcoming',
    '/completed': 'Completed',
    '/categories': 'Categories',
  };

  const title = pageTitles[location.pathname] || 'Productivity';

  // Format today's date for header
  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  return (
    <header className="h-16 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        {/* Mobile menu hamburger */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
            {title}
          </h2>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            {todayFormatted}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Search Shortcut */}
        <button
          type="button"
          onClick={() => navigate('/tasks')}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-800 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition-all cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span>Search tasks...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-white dark:bg-dark-700 border border-slate-200 dark:border-slate-600 rounded text-slate-400">
            /
          </kbd>
        </button>

        {/* Theme toggle (Mobile visible) */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors cursor-pointer"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* New Task CTA */}
        <button
          type="button"
          onClick={onOpenNewTaskModal}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
