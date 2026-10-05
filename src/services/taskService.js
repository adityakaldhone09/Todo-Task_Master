/**
 * Task Service Layer
 * Abstracts data access (currently LocalStorage, easily swappable with REST/GraphQL API)
 */
import { STORAGE_KEYS, DEFAULT_CATEGORIES } from '../utils/constants';
import { getSampleTasks } from '../utils/taskUtils';

export const taskService = {
  /**
   * Fetch all tasks from persistent storage
   */
  async getTasks() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (!data) {
        // First run: seed with realistic sample tasks
        const initialTasks = getSampleTasks();
        this.saveTasks(initialTasks);
        return initialTasks;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) {
        console.warn('Malformed tasks data in LocalStorage, resetting to default');
        return getSampleTasks();
      }
      return parsed;
    } catch (error) {
      console.error('Failed to read tasks from storage:', error);
      return getSampleTasks();
    }
  },

  /**
   * Persist tasks to storage
   */
  async saveTasks(tasks) {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error('Failed to save tasks to storage:', error);
      return false;
    }
  },

  /**
   * Fetch categories from storage
   */
  async getCategories() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (!data) {
        this.saveCategories(DEFAULT_CATEGORIES);
        return DEFAULT_CATEGORIES;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return DEFAULT_CATEGORIES;
      }
      return parsed;
    } catch (error) {
      console.error('Failed to read categories from storage:', error);
      return DEFAULT_CATEGORIES;
    }
  },

  /**
   * Persist categories to storage
   */
  async saveCategories(categories) {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
      return true;
    } catch (error) {
      console.error('Failed to save categories to storage:', error);
      return false;
    }
  },

  /**
   * Fetch theme preference
   */
  getTheme() {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
      // Respect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  },

  /**
   * Persist theme preference
   */
  saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  },
};
