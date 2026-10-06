import React, { useMemo } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import StatCard from '../components/dashboard/StatCard';
import ProductivityChart from '../components/dashboard/ProductivityChart';
import QuickAddTask from '../components/tasks/QuickAddTask';
import TaskList from '../components/tasks/TaskList';
import { isToday, isOverdue } from '../utils/dateUtils';
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Calendar,
} from 'lucide-react';

export default function Dashboard() {
  const {
    tasks,
    categories,
    stats,
    productivity,
    addTask,
    toggleTask,
    restoreTask,
    getCategoryById,
  } = useTasks();

  const { onOpenNewTask, onEditTask, onDeleteTask } = useOutletContext();

  // Filter tasks for sections
  const todayTasks = tasks.filter((t) => !t.completed && isToday(t.dueDate)).slice(0, 5);
  const upcomingTasks = tasks
    .filter((t) => !t.completed && t.dueDate && !isToday(t.dueDate) && !isOverdue(t.dueDate, t.dueTime, t.completed))
    .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''))
    .slice(0, 4);
  const recentlyCompleted = tasks
    .filter((t) => t.completed)
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
    .slice(0, 3);

  // Greeting based on time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  }, []);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 rounded-3xl p-6 sm:p-8 text-white shadow-card relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-white/95 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Productivity Dashboard</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {greeting}! Let's conquer today's goals.
          </h2>
          <p className="text-sm text-brand-100 max-w-xl">
            You have <strong className="text-white font-bold">{stats.pending} pending tasks</strong> and{' '}
            <strong className="text-white font-bold">{stats.overdue} overdue</strong> requiring attention.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <button
            type="button"
            onClick={onOpenNewTask}
            className="px-5 py-2.5 rounded-xl bg-white text-brand-700 hover:bg-brand-50 active:bg-slate-100 font-bold text-sm shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>+ Create Task</span>
          </button>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          subtitle="All tasks logged"
          icon={CheckSquare}
          colorScheme="blue"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          subtitle={`${stats.completionRate}% completion rate`}
          icon={CheckCircle2}
          colorScheme="emerald"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          subtitle="Awaiting completion"
          icon={Clock}
          colorScheme="amber"
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          subtitle="Needs immediate action"
          icon={AlertTriangle}
          colorScheme="rose"
        />
      </div>

      {/* Quick Task Creation Input */}
      <div>
        <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-1">
          Quick Capture
        </div>
        <QuickAddTask onAdd={addTask} categories={categories} />
      </div>

      {/* Productivity Overview Chart & Weekly Breakdown */}
      <ProductivityChart
        productivity={productivity}
        completionRate={stats.completionRate}
      />

      {/* Task Sections Grid: Today & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks Snapshot */}
        <div className="bg-white dark:bg-dark-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Today's Tasks
              </h3>
            </div>
            <Link
              to="/today"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>View all ({todayTasks.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <TaskList
            tasks={todayTasks}
            getCategoryById={getCategoryById}
            onToggle={toggleTask}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            emptyTitle="All clear for today!"
            emptyDescription="You have no pending tasks scheduled for today."
            emptyActionLabel="Schedule Task"
            onEmptyAction={onOpenNewTask}
          />
        </div>

        {/* Upcoming Tasks Snapshot */}
        <div className="bg-white dark:bg-dark-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Upcoming Focus
              </h3>
            </div>
            <Link
              to="/upcoming"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <TaskList
            tasks={upcomingTasks}
            getCategoryById={getCategoryById}
            onToggle={toggleTask}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            emptyTitle="No upcoming tasks"
            emptyDescription="Plan ahead by scheduling tasks for tomorrow and beyond."
            emptyActionLabel="Add Upcoming Task"
            onEmptyAction={onOpenNewTask}
          />
        </div>
      </div>

      {/* Recently Completed Snapshot */}
      {recentlyCompleted.length > 0 && (
        <div className="bg-white dark:bg-dark-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recently Completed
              </h3>
            </div>
            <Link
              to="/completed"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>View all completed ({stats.completed})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <TaskList
            tasks={recentlyCompleted}
            getCategoryById={getCategoryById}
            onToggle={toggleTask}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onRestore={restoreTask}
          />
        </div>
      )}
    </div>
  );
}
