import React, { useState } from 'react';
import { Plus, Calendar, Flag, Sparkles } from 'lucide-react';
import { PRIORITIES } from '../../utils/constants';
import { getTodayDateString } from '../../utils/dateUtils';

export default function QuickAddTask({ onAdd, categories = [] }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState(PRIORITIES.MEDIUM);
  const [category, setCategory] = useState(categories[0]?.id || 'personal');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    onAdd({
      title: cleanTitle,
      description: '',
      priority,
      category,
      dueDate: getTodayDateString(),
      dueTime: '',
      tags: [],
      reminder: false,
    });

    setTitle('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative bg-white dark:bg-dark-800 border rounded-2xl shadow-subtle p-2.5 sm:p-3 transition-all duration-200 ${
        isFocused
          ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-card'
          : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Quick add a task... (Press Enter to save)"
          className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
        />

        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Category Select */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="hidden sm:block text-xs font-medium bg-slate-100 dark:bg-dark-700/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Quick Priority Select */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="hidden sm:block text-xs font-medium bg-slate-100 dark:bg-dark-700/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer capitalize"
          >
            {Object.values(PRIORITIES).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={!title.trim()}
            className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </form>
  );
}
