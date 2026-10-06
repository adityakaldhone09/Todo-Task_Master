import React from 'react';
import { Search, ArrowUpDown, X, RotateCcw } from 'lucide-react';
import { STATUS_FILTERS, PRIORITIES, SORT_OPTIONS } from '../../utils/constants';

export default function TaskFilters({
  filters,
  sortBy,
  categories = [],
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onCategoryChange,
  onSortChange,
  onReset,
}) {
  const hasActiveFilters =
    filters.search ||
    filters.status !== STATUS_FILTERS.ALL ||
    filters.priority !== 'all' ||
    filters.category !== 'all' ||
    sortBy !== SORT_OPTIONS.NEWEST;

  return (
    <div className="space-y-3.5 bg-white dark:bg-dark-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-subtle">
      {/* Top Row: Real-time Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks by title, description, category, or #tags..."
          className="w-full pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-dark-900/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
            aria-label="Clear search query"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Middle Row: Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: STATUS_FILTERS.ALL, label: 'All' },
          { key: STATUS_FILTERS.ACTIVE, label: 'Active' },
          { key: STATUS_FILTERS.COMPLETED, label: 'Completed' },
          { key: STATUS_FILTERS.OVERDUE, label: 'Overdue' },
        ].map((tab) => {
          const isActive = filters.status === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onStatusChange(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-dark-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-dark-700'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Bottom Row: Priority, Category, Sorting dropdowns */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
        {/* Category Dropdown */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium hidden sm:inline">Category:</span>
          <select
            value={filters.category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-dark-900/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer capitalize"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Dropdown */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium hidden sm:inline">Priority:</span>
          <select
            value={filters.priority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-dark-900/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer capitalize"
          >
            <option value="all">All Priorities</option>
            {Object.values(PRIORITIES).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-1.5 ml-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-medium hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-dark-900/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
          >
            <option value={SORT_OPTIONS.NEWEST}>Newest First</option>
            <option value={SORT_OPTIONS.OLDEST}>Oldest First</option>
            <option value={SORT_OPTIONS.DUE_DATE}>Due Date</option>
            <option value={SORT_OPTIONS.PRIORITY}>Priority (Urgent first)</option>
            <option value={SORT_OPTIONS.ALPHABETICAL}>Alphabetical (A-Z)</option>
          </select>
        </div>

        {/* Reset button if active */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
            title="Reset filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
