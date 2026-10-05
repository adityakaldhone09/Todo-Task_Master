import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Clock,
  CheckCircle2,
  FolderKanban,
  Plus,
  Sun,
  Moon,
  Sparkles,
  Database,
  RotateCcw,
} from 'lucide-react';
import { getCategoryIcon } from '../../utils/categoryIcons';
import { isToday } from '../../utils/dateUtils';

export default function Sidebar({
  tasks = [],
  categories = [],
  theme,
  onToggleTheme,
  onOpenNewTaskModal,
  onResetSampleData,
  onGenerateBulkTasks,
}) {
  // Compute badge counts
  const pendingCount = tasks.filter((t) => !t.completed).length;
  const todayCount = tasks.filter((t) => !t.completed && isToday(t.dueDate)).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/tasks',
      label: 'All Tasks',
      icon: CheckSquare,
      badge: pendingCount,
    },
    {
      to: '/today',
      label: 'Today',
      icon: Calendar,
      badge: todayCount,
      badgeColor: 'bg-brand-500 text-white',
    },
    {
      to: '/upcoming',
      label: 'Upcoming',
      icon: Clock,
      badge: null,
    },
    {
      to: '/completed',
      label: 'Completed',
      icon: CheckCircle2,
      badge: completedCount,
      badgeColor: 'bg-slate-200 dark:bg-dark-700 text-slate-700 dark:text-slate-300',
    },
    {
      to: '/categories',
      label: 'Categories',
      icon: FolderKanban,
      badge: categories.length,
    },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-dark-850 border-r border-slate-200/80 dark:border-slate-800 flex flex-col h-full shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-sm">
            <CheckSquare className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
              TaskFlow
            </h1>
            <span className="text-[11px] text-slate-400 font-medium">
              Productivity Suite
            </span>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-750 transition-colors cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>
      </div>

      {/* Primary Action Button */}
      <div className="p-4">
        <button
          type="button"
          onClick={onOpenNewTaskModal}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-semibold shadow-sm hover:shadow transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Task</span>
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 px-3 py-1.5 uppercase tracking-wider">
          Views
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-800 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && item.badge !== undefined && (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-slate-100 dark:bg-dark-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        {/* Categories Section */}
        <div className="pt-4">
          <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <span>Categories</span>
            <NavLink
              to="/categories"
              className="text-brand-600 dark:text-brand-400 hover:underline capitalize"
            >
              Manage
            </NavLink>
          </div>

          <div className="space-y-0.5 mt-1">
            {categories.map((cat) => {
              const catTasksCount = tasks.filter((t) => t.category === cat.id && !t.completed).length;
              return (
                <NavLink
                  key={cat.id}
                  to={`/tasks?category=${cat.id}`}
                  className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {catTasksCount}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer Utilities (Data Controls for testing) */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <div className="flex items-center justify-between px-2 py-1">
          <button
            type="button"
            onClick={onResetSampleData}
            className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer"
            title="Reset data back to initial sample tasks"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="button"
            onClick={onGenerateBulkTasks}
            className="flex items-center gap-1.5 text-[11px] text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
            title="Generate 100 tasks to test performance"
          >
            <Sparkles className="w-3 h-3" />
            <span>+100 Tasks</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
