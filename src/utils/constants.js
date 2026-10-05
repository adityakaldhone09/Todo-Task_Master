export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const PRIORITY_CONFIG = {
  [PRIORITIES.LOW]: {
    label: 'Low',
    color: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-100 dark:bg-slate-800/80',
    border: 'border-slate-200 dark:border-slate-700',
    badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    dot: 'bg-slate-400',
    weight: 1,
  },
  [PRIORITIES.MEDIUM]: {
    label: 'Medium',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-200 dark:border-blue-900/50',
    badge: 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    dot: 'bg-blue-500',
    weight: 2,
  },
  [PRIORITIES.HIGH]: {
    label: 'High',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-900/50',
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    dot: 'bg-amber-500',
    weight: 3,
  },
  [PRIORITIES.URGENT]: {
    label: 'Urgent',
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-200 dark:border-rose-900/50',
    badge: 'bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    dot: 'bg-rose-500',
    weight: 4,
  },
};

export const STATUS_FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  OVERDUE: 'overdue',
};

export const SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  DUE_DATE: 'dueDate',
  PRIORITY: 'priority',
  ALPHABETICAL: 'alphabetical',
};

export const DEFAULT_CATEGORIES = [
  {
    id: 'work',
    name: 'Work',
    icon: 'Briefcase',
    color: '#3b82f6', // blue
    bgColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
  {
    id: 'college',
    name: 'College',
    icon: 'GraduationCap',
    color: '#8b5cf6', // purple
    bgColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  },
  {
    id: 'personal',
    name: 'Personal',
    icon: 'User',
    color: '#10b981', // emerald
    bgColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: 'FolderKanban',
    color: '#f59e0b', // amber
    bgColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: 'ShoppingBag',
    color: '#ec4899', // pink
    bgColor: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
  },
];

export const CATEGORY_ICONS = [
  'Briefcase',
  'GraduationCap',
  'User',
  'FolderKanban',
  'ShoppingBag',
  'Code',
  'BookOpen',
  'HeartPulse',
  'Home',
  'Coffee',
  'Sparkles',
  'Layers',
];

export const CATEGORY_COLORS = [
  { name: 'Blue', hex: '#3b82f6', bgClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  { name: 'Purple', hex: '#8b5cf6', bgClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
  { name: 'Emerald', hex: '#10b981', bgClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  { name: 'Amber', hex: '#f59e0b', bgClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  { name: 'Pink', hex: '#ec4899', bgClass: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20' },
  { name: 'Indigo', hex: '#6366f1', bgClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' },
  { name: 'Cyan', hex: '#06b6d4', bgClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20' },
  { name: 'Rose', hex: '#f43f5e', bgClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
];

export const STORAGE_KEYS = {
  TASKS: 'taskflow_tasks_v1',
  CATEGORIES: 'taskflow_categories_v1',
  THEME: 'taskflow_theme_v1',
};
