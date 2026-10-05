import React, { useMemo, useEffect } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskList from '../components/tasks/TaskList';
import { filterTasks, sortTasks } from '../utils/taskUtils';

export default function Tasks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { onOpenNewTask, onEditTask, onDeleteTask } = useOutletContext();

  const {
    tasks,
    categories,
    filters,
    sortBy,
    toggleTask,
    restoreTask,
    getCategoryById,
    setSearch,
    setStatusFilter,
    setPriorityFilter,
    setCategoryFilter,
    setSortBy,
    resetFilters,
  } = useTasks();

  // Read initial category from URL if present (e.g. /tasks?category=projects)
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setCategoryFilter(catParam);
    }
  }, [searchParams, setCategoryFilter]);

  // Filtered and sorted tasks
  const processedTasks = useMemo(() => {
    const filtered = filterTasks(tasks, filters);
    return sortTasks(filtered, sortBy);
  }, [tasks, filters, sortBy]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            All Tasks
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage, filter, and organize your entire productivity backlog.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Showing <strong className="text-slate-900 dark:text-white">{processedTasks.length}</strong> of{' '}
          {tasks.length} tasks
        </div>
      </div>

      {/* Filter and Search Bar */}
      <TaskFilters
        filters={filters}
        sortBy={sortBy}
        categories={categories}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
        onCategoryChange={(val) => {
          setCategoryFilter(val);
          if (val === 'all') {
            searchParams.delete('category');
          } else {
            searchParams.set('category', val);
          }
          setSearchParams(searchParams);
        }}
        onSortChange={setSortBy}
        onReset={() => {
          resetFilters();
          setSearchParams({});
        }}
      />

      {/* Tasks List */}
      <TaskList
        tasks={processedTasks}
        getCategoryById={getCategoryById}
        onToggle={toggleTask}
        onEdit={onEditTask}
        onDelete={onDeleteTask}
        onRestore={restoreTask}
        emptyTitle="No tasks match your criteria"
        emptyDescription="We couldn't find any tasks matching your active search or filters."
        emptyActionLabel="Create New Task"
        onEmptyAction={onOpenNewTask}
      />
    </div>
  );
}
