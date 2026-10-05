import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileMenu from './MobileMenu';
import TaskModal from '../tasks/TaskModal';
import ConfirmDialog from '../common/ConfirmDialog';
import { useTasks } from '../../hooks/useTasks';

export default function Layout() {
  const {
    tasks,
    categories,
    theme,
    toggleTheme,
    addTask,
    updateTask,
    deleteTask,
    resetToSampleData,
    generate100DemoTasks,
  } = useTasks();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  // Global triggers
  const handleOpenNewTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeletePrompt = (task) => {
    setDeletingTask(task);
  };

  const handleTaskSubmit = (taskData) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingTask) {
      deleteTask(deletingTask.id);
      setDeletingTask(null);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-dark-900 transition-colors">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">
        <Sidebar
          tasks={tasks}
          categories={categories}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenNewTaskModal={handleOpenNewTask}
          onResetSampleData={resetToSampleData}
          onGenerateBulkTasks={generate100DemoTasks}
        />
      </div>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        tasks={tasks}
        categories={categories}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenNewTaskModal={handleOpenNewTask}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenNewTaskModal={handleOpenNewTask}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet
              context={{
                onOpenNewTask: handleOpenNewTask,
                onEditTask: handleEditTask,
                onDeleteTask: handleDeletePrompt,
              }}
            />
          </div>
        </main>
      </div>

      {/* Global Task Creation/Editing Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        initialTask={editingTask}
        categories={categories}
        onSubmit={handleTaskSubmit}
      />

      {/* Global Confirm Task Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Task?"
        message={`Are you sure you want to delete "${deletingTask?.title}"?`}
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}
