import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  X,
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Clock,
  CheckCircle2,
  FolderKanban,
  Sun,
  Moon,
  Plus,
} from 'lucide-react';

export default function MobileMenu({
  isOpen,
  onClose,
  tasks = [],
  categories = [],
  theme,
  onToggleTheme,
  onOpenNewTaskModal,
}) {
  if (!isOpen) return null;

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const todayCount = tasks.filter((t) => !t.completed && t.dueDate === new Date().toISOString().slice(0, 10)).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tasks', label: 'All Tasks', icon: CheckSquare, badge: pendingCount },
    { to: '/today', label: 'Today', icon: Calendar, badge: todayCount },
    { to: '/upcoming', label: 'Upcoming', icon: Clock },
    { to: '/completed', label: 'Completed', icon: CheckCircle2, badge: completedCount },
    { to: '/categories', label: 'Categories', icon: FolderKanban, badge: categories.length },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-white dark:bg-dark-850 shadow-2xl flex flex-col z-10 animate-fade-in">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-bold">
              <CheckSquare className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-slate-900 dark:text-white">
              TaskFlow
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-750"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* New Task Button */}
        <div className="p-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenNewTaskModal();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-800'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge !== null && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-dark-700 text-slate-600 dark:text-slate-300">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="pt-4">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 px-3 uppercase tracking-wider block mb-2">
              Categories
            </span>
            <div className="space-y-1">
              {categories.map((cat) => (
                <NavLink
                  key={cat.id}
                  to={`/tasks?category=${cat.id}`}
                  onClick={onClose}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-800"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
