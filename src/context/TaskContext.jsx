import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { taskService } from '../services/taskService';
import { STATUS_FILTERS, SORT_OPTIONS, DEFAULT_CATEGORIES } from '../utils/constants';
import { calculateTaskStats, calculateProductivityStats, generateBulkTasks, getSampleTasks } from '../utils/taskUtils';
import { useToast } from './ToastContext';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const toast = useToast();

  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [theme, setTheme] = useState('light');
  const [isLoaded, setIsLoaded] = useState(false);

  // Filter & Search states
  const [filters, setFilters] = useState({
    search: '',
    status: STATUS_FILTERS.ALL,
    priority: 'all',
    category: 'all',
  });
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.NEWEST);

  // Initialize data on mount
  useEffect(() => {
    async function init() {
      try {
        const loadedTasks = await taskService.getTasks();
        const loadedCats = await taskService.getCategories();
        const initialTheme = taskService.getTheme();

        setTasks(loadedTasks);
        setCategories(loadedCats);
        setTheme(initialTheme);

        // Apply theme class to HTML element
        if (initialTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsLoaded(true);
      }
    }
    init();
  }, []);

  // Theme switcher
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const next = prevTheme === 'dark' ? 'light' : 'dark';
      taskService.saveTheme(next);
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  }, []);

  // Helper to persist tasks
  const persistTasks = useCallback((updatedTasks) => {
    setTasks(updatedTasks);
    taskService.saveTasks(updatedTasks);
  }, []);

  // Helper to persist categories
  const persistCategories = useCallback((updatedCats) => {
    setCategories(updatedCats);
    taskService.saveCategories(updatedCats);
  }, []);

  // Task Operations
  const addTask = useCallback(
    (taskData) => {
      try {
        const now = new Date().toISOString();
        const newTask = {
          id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          title: taskData.title.trim(),
          description: (taskData.description || '').trim(),
          completed: false,
          priority: taskData.priority || 'medium',
          category: taskData.category || 'personal',
          tags: Array.isArray(taskData.tags) ? taskData.tags : [],
          dueDate: taskData.dueDate || '',
          dueTime: taskData.dueTime || '',
          reminder: Boolean(taskData.reminder),
          createdAt: now,
          updatedAt: now,
        };

        const updated = [newTask, ...tasks];
        persistTasks(updated);
        toast.success('Task created successfully');
        return newTask;
      } catch (err) {
        console.error('Error adding task:', err);
        toast.error('Unable to create task');
        return null;
      }
    },
    [tasks, persistTasks, toast]
  );

  const updateTask = useCallback(
    (id, updates) => {
      try {
        const updated = tasks.map((task) => {
          if (task.id === id) {
            return {
              ...task,
              ...updates,
              updatedAt: new Date().toISOString(),
            };
          }
          return task;
        });

        persistTasks(updated);
        toast.success('Task updated');
        return true;
      } catch (err) {
        console.error('Error updating task:', err);
        toast.error('Unable to update task');
        return false;
      }
    },
    [tasks, persistTasks, toast]
  );

  const deleteTask = useCallback(
    (id) => {
      try {
        const updated = tasks.filter((t) => t.id !== id);
        persistTasks(updated);
        toast.success('Task deleted');
      } catch (err) {
        console.error('Error deleting task:', err);
        toast.error('Unable to delete task');
      }
    },
    [tasks, persistTasks, toast]
  );

  const toggleTask = useCallback(
    (id) => {
      try {
        let isNowCompleted = false;
        const updated = tasks.map((task) => {
          if (task.id === id) {
            isNowCompleted = !task.completed;
            return {
              ...task,
              completed: isNowCompleted,
              updatedAt: new Date().toISOString(),
            };
          }
          return task;
        });

        persistTasks(updated);

        if (isNowCompleted) {
          // Play celebratory confetti
          try {
            confetti({
              particleCount: 60,
              spread: 60,
              origin: { y: 0.8 },
              colors: ['#3553eb', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'],
            });
          } catch {
            // canvas confetti fallback
          }
          toast.success('Task completed');
        } else {
          toast.info('Task marked active');
        }
      } catch (err) {
        console.error('Error toggling task:', err);
        toast.error('Failed to update task state');
      }
    },
    [tasks, persistTasks, toast]
  );

  const restoreTask = useCallback(
    (id) => {
      const updated = tasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            completed: false,
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      });
      persistTasks(updated);
      toast.success('Task restored to active list');
    },
    [tasks, persistTasks, toast]
  );

  const clearCompleted = useCallback(() => {
    const completedCount = tasks.filter((t) => t.completed).length;
    if (completedCount === 0) return;

    const updated = tasks.filter((t) => !t.completed);
    persistTasks(updated);
    toast.success(`Cleared ${completedCount} completed task${completedCount > 1 ? 's' : ''}`);
  }, [tasks, persistTasks, toast]);

  // Category Operations
  const addCategory = useCallback(
    (categoryData) => {
      try {
        const id = (categoryData.name || '').toLowerCase().replace(/[^a-z0-9]/g, '-') || `cat-${Date.now()}`;
        
        // Prevent duplicate IDs
        if (categories.some((c) => c.id === id)) {
          toast.warning('A category with this name already exists');
          return null;
        }

        const newCategory = {
          id,
          name: categoryData.name.trim(),
          icon: categoryData.icon || 'Folder',
          color: categoryData.color || '#3b82f6',
          bgColor: categoryData.bgColor || 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        };

        const updated = [...categories, newCategory];
        persistCategories(updated);
        toast.success(`Category "${newCategory.name}" created`);
        return newCategory;
      } catch (err) {
        console.error('Error adding category:', err);
        toast.error('Failed to create category');
        return null;
      }
    },
    [categories, persistCategories, toast]
  );

  const updateCategory = useCallback(
    (id, updates) => {
      try {
        const updated = categories.map((cat) => {
          if (cat.id === id) {
            return { ...cat, ...updates };
          }
          return cat;
        });
        persistCategories(updated);
        toast.success('Category updated');
      } catch (err) {
        console.error('Error updating category:', err);
        toast.error('Failed to update category');
      }
    },
    [categories, persistCategories, toast]
  );

  const deleteCategory = useCallback(
    (id) => {
      try {
        // Prevent deleting default if desired, or reassign associated tasks
        const updatedCats = categories.filter((c) => c.id !== id);
        persistCategories(updatedCats);

        // Reassign affected tasks to 'personal' or first remaining category
        const fallbackCat = updatedCats[0]?.id || 'personal';
        const updatedTasks = tasks.map((t) => {
          if (t.category === id) {
            return { ...t, category: fallbackCat };
          }
          return t;
        });
        persistTasks(updatedTasks);
        toast.success('Category deleted');
      } catch (err) {
        console.error('Error deleting category:', err);
        toast.error('Failed to delete category');
      }
    },
    [categories, tasks, persistCategories, persistTasks, toast]
  );

  // Developer & Demo Utilities
  const resetToSampleData = useCallback(() => {
    const samples = getSampleTasks();
    persistTasks(samples);
    persistCategories(DEFAULT_CATEGORIES);
    toast.info('Reset to initial sample tasks');
  }, [persistTasks, persistCategories, toast]);

  const generate100DemoTasks = useCallback(() => {
    const bulk = generateBulkTasks(categories, 100);
    const updated = [...bulk, ...tasks];
    persistTasks(updated);
    toast.success('Generated 100 demo tasks for testing!');
  }, [categories, tasks, persistTasks, toast]);

  // Dynamic statistics
  const stats = useMemo(() => calculateTaskStats(tasks), [tasks]);
  const productivity = useMemo(() => calculateProductivityStats(tasks), [tasks]);

  // Search & Filter controls
  const setSearch = useCallback((search) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const setStatusFilter = useCallback((status) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const setPriorityFilter = useCallback((priority) => {
    setFilters((prev) => ({ ...prev, priority }));
  }, []);

  const setCategoryFilter = useCallback((category) => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      status: STATUS_FILTERS.ALL,
      priority: 'all',
      category: 'all',
    });
    setSortBy(SORT_OPTIONS.NEWEST);
  }, []);

  // Category lookup helper
  const getCategoryById = useCallback(
    (catId) => {
      return categories.find((c) => c.id === catId) || {
        id: catId,
        name: catId,
        color: '#64748b',
        bgColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        icon: 'Folder',
      };
    },
    [categories]
  );

  const value = {
    tasks,
    categories,
    theme,
    isLoaded,
    filters,
    sortBy,
    stats,
    productivity,
    // Operations
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    restoreTask,
    clearCompleted,
    addCategory,
    updateCategory,
    deleteCategory,
    resetToSampleData,
    generate100DemoTasks,
    toggleTheme,
    setSearch,
    setStatusFilter,
    setPriorityFilter,
    setCategoryFilter,
    setSortBy,
    resetFilters,
    getCategoryById,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
