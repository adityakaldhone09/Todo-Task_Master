import { PRIORITIES, PRIORITY_CONFIG, STATUS_FILTERS, SORT_OPTIONS } from './constants.js';
import { isOverdue, getTodayDateString, getTomorrowDateString, getPast7Days } from './dateUtils.js';

/**
 * Filter tasks based on search query, status, priority, and category
 */
export function filterTasks(tasks = [], filters = {}) {
  const { search = '', status = STATUS_FILTERS.ALL, priority = 'all', category = 'all' } = filters;
  const cleanSearch = search.trim().toLowerCase();

  return tasks.filter((task) => {
    // 1. Status Filter
    if (status === STATUS_FILTERS.ACTIVE && task.completed) return false;
    if (status === STATUS_FILTERS.COMPLETED && !task.completed) return false;
    if (status === STATUS_FILTERS.OVERDUE && (!isOverdue(task.dueDate, task.dueTime, task.completed) || task.completed)) return false;

    // 2. Priority Filter
    if (priority !== 'all' && task.priority !== priority) return false;

    // 3. Category Filter
    if (category !== 'all' && task.category !== category) return false;

    // 4. Search Query Filter across: Title, Description, Category, Tags
    if (cleanSearch) {
      const matchTitle = (task.title || '').toLowerCase().includes(cleanSearch);
      const matchDesc = (task.description || '').toLowerCase().includes(cleanSearch);
      const matchCategory = (task.category || '').toLowerCase().includes(cleanSearch);
      const matchTags = Array.isArray(task.tags) && task.tags.some(tag => tag.toLowerCase().includes(cleanSearch));
      
      if (!matchTitle && !matchDesc && !matchCategory && !matchTags) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort tasks
 */
export function sortTasks(tasks = [], sortBy = SORT_OPTIONS.NEWEST) {
  const sorted = [...tasks];

  switch (sortBy) {
    case SORT_OPTIONS.NEWEST:
      return sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    case SORT_OPTIONS.OLDEST:
      return sorted.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));

    case SORT_OPTIONS.DUE_DATE:
      return sorted.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        const dateDiff = a.dueDate.localeCompare(b.dueDate);
        if (dateDiff !== 0) return dateDiff;
        return (a.dueTime || '').localeCompare(b.dueTime || '');
      });

    case SORT_OPTIONS.PRIORITY:
      return sorted.sort((a, b) => {
        const weightA = PRIORITY_CONFIG[a.priority]?.weight || 0;
        const weightB = PRIORITY_CONFIG[b.priority]?.weight || 0;
        return weightB - weightA; // Urgent -> High -> Medium -> Low
      });

    case SORT_OPTIONS.ALPHABETICAL:
      return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));

    default:
      return sorted;
  }
}

/**
 * Calculate dynamic Dashboard statistics
 */
export function calculateTaskStats(tasks = []) {
  const total = tasks.length;
  let completed = 0;
  let pending = 0;
  let overdue = 0;

  tasks.forEach((task) => {
    if (task.completed) {
      completed++;
    } else {
      pending++;
      if (isOverdue(task.dueDate, task.dueTime, task.completed)) {
        overdue++;
      }
    }
  });

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    pending,
    overdue,
    completionRate,
  };
}

/**
 * Calculate Productivity Overview stats (Streak, Today, This Week, 7-Day Chart)
 */
export function calculateProductivityStats(tasks = []) {
  const todayStr = getTodayDateString();
  const past7Days = getPast7Days(); // array of { dateStr, dayName, isToday }

  // Completed today count
  const completedToday = tasks.filter((t) => {
    if (!t.completed || !t.updatedAt) return false;
    return t.updatedAt.startsWith(todayStr);
  }).length;

  // Completed this week count (within last 7 days)
  const last7DaysSet = new Set(past7Days.map(d => d.dateStr));
  const completedThisWeek = tasks.filter((t) => {
    if (!t.completed || !t.updatedAt) return false;
    const taskDate = t.updatedAt.slice(0, 10);
    return last7DaysSet.has(taskDate);
  }).length;

  // Weekly activity breakdown
  const weeklyActivity = past7Days.map((day) => {
    // tasks due or completed on this day
    const dayTasks = tasks.filter((t) => {
      const taskDate = (t.completed ? t.updatedAt : t.dueDate || t.createdAt)?.slice(0, 10);
      return taskDate === day.dateStr;
    });

    const dayCompleted = tasks.filter((t) => {
      return t.completed && t.updatedAt && t.updatedAt.startsWith(day.dateStr);
    }).length;

    const totalForDay = Math.max(dayTasks.length, dayCompleted, 1);
    const percentage = dayCompleted > 0 ? Math.min(100, Math.round((dayCompleted / totalForDay) * 100)) : 0;

    return {
      day: day.dayName,
      date: day.dateStr,
      isToday: day.isToday,
      completed: dayCompleted,
      total: totalForDay,
      percentage: dayCompleted === 0 && dayTasks.length === 0 ? 0 : Math.max(percentage, dayCompleted > 0 ? 25 : 0),
    };
  });

  // Calculate consecutive days streak
  let streak = 0;
  for (let i = past7Days.length - 1; i >= 0; i--) {
    const day = past7Days[i];
    const hasCompletion = tasks.some(
      t => t.completed && t.updatedAt && t.updatedAt.startsWith(day.dateStr)
    );
    if (hasCompletion) {
      streak++;
    } else if (i === past7Days.length - 1) {
      // If today has 0 completions yet, check yesterday before breaking streak
      continue;
    } else {
      break;
    }
  }

  return {
    completedToday,
    completedThisWeek,
    streak: Math.max(streak, completedToday > 0 ? 1 : 0),
    weeklyActivity,
  };
}

/**
 * Realistic initial sample tasks for first load
 */
export function getSampleTasks() {
  const todayStr = getTodayDateString();
  const tomorrowStr = getTomorrowDateString();

  // Create date 2 days from now
  const dateIn2Days = new Date();
  dateIn2Days.setDate(dateIn2Days.getDate() + 2);
  const in2DaysStr = dateIn2Days.toISOString().slice(0, 10);

  // Create date 5 days from now
  const dateIn5Days = new Date();
  dateIn5Days.setDate(dateIn5Days.getDate() + 5);
  const in5DaysStr = dateIn5Days.toISOString().slice(0, 10);

  // Past date for overdue demo
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 1);
  const pastDateStr = pastDate.toISOString().slice(0, 10);

  const nowISO = new Date().toISOString();

  return [
    {
      id: 'task-sample-1',
      title: 'Complete React Assignment',
      description: 'Finish frontend implementation with clean architecture and responsive UI',
      completed: false,
      priority: PRIORITIES.HIGH,
      category: 'college',
      tags: ['react', 'college', 'important'],
      dueDate: todayStr,
      dueTime: '18:00',
      reminder: true,
      createdAt: nowISO,
      updatedAt: nowISO,
    },
    {
      id: 'task-sample-2',
      title: 'Review Cybersecurity Notes',
      description: 'Go through Chapter 4 & 5 encryption algorithms and authentication protocols',
      completed: false,
      priority: PRIORITIES.MEDIUM,
      category: 'college',
      tags: ['cybersecurity', 'notes', 'study'],
      dueDate: tomorrowStr,
      dueTime: '11:00',
      reminder: false,
      createdAt: nowISO,
      updatedAt: nowISO,
    },
    {
      id: 'task-sample-3',
      title: 'Build Portfolio Website',
      description: 'Implement dark mode, interactive projects carousel, and contact form',
      completed: false,
      priority: PRIORITIES.HIGH,
      category: 'projects',
      tags: ['portfolio', 'project', 'showcase'],
      dueDate: in5DaysStr,
      dueTime: '20:00',
      reminder: true,
      createdAt: nowISO,
      updatedAt: nowISO,
    },
    {
      id: 'task-sample-4',
      title: 'Submit quarterly budget proposal',
      description: 'Align figures with finance leads and prepare summary slides',
      completed: false,
      priority: PRIORITIES.URGENT,
      category: 'work',
      tags: ['finance', 'urgent', 'work'],
      dueDate: pastDateStr,
      dueTime: '17:00',
      reminder: false,
      createdAt: nowISO,
      updatedAt: nowISO,
    },
    {
      id: 'task-sample-5',
      title: 'Weekly grocery restock',
      description: 'Fresh vegetables, almond milk, coffee beans, and protein bars',
      completed: false,
      priority: PRIORITIES.LOW,
      category: 'shopping',
      tags: ['groceries', 'household'],
      dueDate: in2DaysStr,
      dueTime: '15:30',
      reminder: false,
      createdAt: nowISO,
      updatedAt: nowISO,
    },
    {
      id: 'task-sample-6',
      title: 'Refactor state management in dashboard',
      description: 'Migrated custom hooks to unified context provider with local persistence',
      completed: true,
      priority: PRIORITIES.MEDIUM,
      category: 'projects',
      tags: ['code', 'refactor'],
      dueDate: todayStr,
      dueTime: '12:00',
      reminder: false,
      createdAt: nowISO,
      updatedAt: nowISO,
    },
    {
      id: 'task-sample-7',
      title: '30-minute evening running session',
      description: 'Maintain cardio routine in local park, target 5 km',
      completed: true,
      priority: PRIORITIES.LOW,
      category: 'personal',
      tags: ['health', 'fitness'],
      dueDate: todayStr,
      dueTime: '07:30',
      reminder: false,
      createdAt: nowISO,
      updatedAt: nowISO,
    },
  ];
}

/**
 * Generate 100+ tasks for stress-testing and verifying responsiveness
 */
export function generateBulkTasks(categories = [], count = 100) {
  const priorities = [PRIORITIES.LOW, PRIORITIES.MEDIUM, PRIORITIES.HIGH, PRIORITIES.URGENT];
  const catIds = categories.length > 0 ? categories.map(c => c.id) : ['work', 'college', 'personal', 'projects', 'shopping'];
  const sampleTitles = [
    'Prepare quarterly roadmap review',
    'Debug hydration mismatch in SSR component',
    'Write unit tests for authentication service',
    'Review PR #142 for database indexing',
    'Setup CI/CD pipeline on GitHub Actions',
    'Design landing page hero section in Figma',
    'Sync with product marketing on launch timeline',
    'Update API documentation for v2 endpoints',
    'Fix responsive layout issues on mobile Safari',
    'Order ergonomic office chair and desk lamp',
    'Conduct 1-on-1 performance review',
    'Refactor legacy CSS to utility classes',
    'Optimize web vitals LCP and CLS scores',
    'Back up customer database snapshots',
    'Read documentation on React Server Actions',
  ];

  const now = new Date();
  const generated = [];

  for (let i = 1; i <= count; i++) {
    const isCompleted = Math.random() < 0.45;
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const category = catIds[Math.floor(Math.random() * catIds.length)];
    const titleBase = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
    
    // Day offset between -10 and +14 days
    const dayOffset = Math.floor(Math.random() * 25) - 10;
    const taskDate = new Date(now);
    taskDate.setDate(now.getDate() + dayOffset);
    const dueDateStr = taskDate.toISOString().slice(0, 10);

    const createdAt = new Date(now.getTime() - Math.floor(Math.random() * 14 * 86400000)).toISOString();
    const updatedAt = isCompleted 
      ? new Date(now.getTime() - Math.floor(Math.random() * 5 * 86400000)).toISOString()
      : createdAt;

    generated.push({
      id: `task-bulk-${i}-${Date.now().toString(36)}`,
      title: `${titleBase} #${i}`,
      description: `Detailed description for batch item #${i}. Ensures smooth performance and zero lag with 100+ tasks.`,
      completed: isCompleted,
      priority,
      category,
      tags: ['bulk-test', category, priority],
      dueDate: dueDateStr,
      dueTime: `${String(Math.floor(Math.random() * 12) + 9).padStart(2, '0')}:00`,
      reminder: Math.random() > 0.7,
      createdAt,
      updatedAt,
    });
  }

  return generated;
}
