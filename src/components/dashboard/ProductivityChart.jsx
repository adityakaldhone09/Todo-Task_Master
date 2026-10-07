import React from 'react';
import { Flame, CheckCircle, Trophy, TrendingUp } from 'lucide-react';

export default function ProductivityChart({ productivity, completionRate }) {
  const { completedToday, completedThisWeek, streak, weeklyActivity = [] } = productivity;

  return (
    <div className="bg-white dark:bg-dark-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-subtle space-y-6">
      {/* Header with Title and Streak */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Productivity Overview
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor your daily execution and task completion velocity.
          </p>
        </div>

        {/* Streak Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 text-amber-700 dark:text-amber-300 self-start sm:self-auto">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
          <span className="text-xs font-bold">
            {streak} Day{streak === 1 ? '' : 's'} Streak
          </span>
        </div>
      </div>

      {/* Metrics Row: 3 Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Completion Rate */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-900/60 border border-slate-100 dark:border-slate-800/80">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Completion Rate
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {completionRate}%
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              All tasks
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-dark-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-brand-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Completed Today */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-900/60 border border-slate-100 dark:border-slate-800/80">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Completed Today
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {completedToday}
            </span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Tasks checked off today
          </p>
        </div>

        {/* Completed This Week */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-900/60 border border-slate-100 dark:border-slate-800/80">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Completed This Week
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {completedThisWeek}
            </span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Last 7 days total
          </p>
        </div>
      </div>

      {/* Weekly Activity Bars */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Weekly Productivity Breakdown
          </span>
          <span className="text-xs text-slate-400">Past 7 Days</span>
        </div>

        <div className="space-y-1.5">
          {weeklyActivity.map((item) => (
            <div
              key={item.date}
              className="group/row flex items-center gap-3 text-xs px-2 py-1 rounded-xl hover:bg-slate-50 dark:hover:bg-dark-750/60 transition-all duration-200"
            >
              <span
                className={`w-9 font-semibold transition-colors ${
                  item.isToday
                    ? 'text-brand-600 dark:text-brand-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 group-hover/row:text-slate-700 dark:group-hover/row:text-slate-200'
                }`}
              >
                {item.day}
                {item.isToday && <span className="ml-0.5 text-[9px] animate-pulse">•</span>}
              </span>

              {/* Progress Bar Track */}
              <div className="flex-1 bg-slate-100 dark:bg-dark-900/80 rounded-full h-3 p-0.5 relative overflow-hidden border border-slate-200/50 dark:border-slate-800 transition-all duration-200 group-hover/row:h-3.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.isToday
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-500 shadow-glow-brand'
                      : 'bg-gradient-to-r from-slate-400 to-slate-500 dark:from-slate-600 dark:to-slate-500 group-hover/row:from-brand-500 group-hover/row:to-indigo-400'
                  }`}
                  style={{ width: `${Math.max(item.percentage, item.completed > 0 ? 10 : 0)}%` }}
                />
              </div>

              {/* Completion % Label */}
              <div className="w-16 text-right font-medium">
                {item.completed > 0 ? (
                  <span className="text-slate-700 dark:text-slate-200 group-hover/row:font-semibold">
                    {item.completed} done ({item.percentage}%)
                  </span>
                ) : (
                  <span className="text-slate-400 dark:text-slate-600">0 done</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
