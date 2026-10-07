import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../utils/constants';
import { getCategoryIcon } from '../utils/categoryIcons';
import { FolderKanban, Plus, Edit2, Trash2, Check, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Categories() {
  const { categories, tasks, addCategory, updateCategory, deleteCategory } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Briefcase');
  const [selectedColor, setSelectedColor] = useState(CATEGORY_COLORS[0]);
  const [error, setError] = useState('');

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setIcon('Briefcase');
    setSelectedColor(CATEGORY_COLORS[0]);
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setIcon(cat.icon || 'Folder');
    const matchedColor = CATEGORY_COLORS.find((c) => c.hex === cat.color) || CATEGORY_COLORS[0];
    setSelectedColor(matchedColor);
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError('Category name cannot be empty.');
      return;
    }

    if (cleanName.length > 30) {
      setError('Category name must be under 30 characters.');
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: cleanName,
        icon,
        color: selectedColor.hex,
        bgColor: selectedColor.bgClass,
      });
    } else {
      addCategory({
        name: cleanName,
        icon,
        color: selectedColor.hex,
        bgColor: selectedColor.bgClass,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            <span>Manage Categories</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Segment your tasks into custom workspaces with distinct icons and colors.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const catTasks = tasks.filter((t) => t.category === cat.id);
          const pendingCount = catTasks.filter((t) => !t.completed).length;
          const completedCount = catTasks.filter((t) => t.completed).length;

          return (
            <div
              key={cat.id}
              className="group relative bg-white dark:bg-dark-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-subtle hover:shadow-card-hover hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                    style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                  >
                    {getCategoryIcon(cat.icon, 'w-5 h-5')}
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-700/60 rounded-lg transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer"
                      title="Edit category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingCategory(cat)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize">
                  {cat.name}
                </h3>

                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    <strong className="text-slate-800 dark:text-slate-200 font-semibold">{pendingCount}</strong> pending
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">{completedCount}</strong> completed
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <Link
                  to={`/tasks?category=${cat.id}`}
                  className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  View Tasks →
                </Link>

                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="cat-name" className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
              Category Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="cat-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Health & Fitness"
              maxLength={30}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-dark-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              autoFocus
            />
            {error && (
              <p className="flex items-center gap-1.5 mt-1.5 text-xs text-rose-500 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
              Icon
            </label>
            <div className="grid grid-cols-6 gap-2 p-2 bg-slate-50 dark:bg-dark-900/60 border border-slate-200/80 dark:border-slate-800 rounded-xl max-h-36 overflow-y-auto">
              {CATEGORY_ICONS.map((iconName) => {
                const isSelected = icon === iconName;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setIcon(iconName)}
                    className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-brand-600 text-white shadow-xs scale-105'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-dark-750'
                    }`}
                  >
                    {getCategoryIcon(iconName, 'w-4 h-4')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
              Color Accent
            </label>
            <div className="flex flex-wrap items-center gap-2.5">
              {CATEGORY_COLORS.map((col) => {
                const isSelected = selectedColor.hex === col.hex;
                return (
                  <button
                    key={col.hex}
                    type="button"
                    onClick={() => setSelectedColor(col)}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-125 active:scale-90 cursor-pointer relative shadow-xs"
                    style={{ backgroundColor: col.hex }}
                    aria-label={`Select ${col.name} color`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3] animate-pop-in" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Category Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingCategory)}
        onClose={() => setDeletingCategory(null)}
        onConfirm={() => {
          if (deletingCategory) {
            deleteCategory(deletingCategory.id);
            setDeletingCategory(null);
          }
        }}
        title="Delete Category?"
        message={`Are you sure you want to delete category "${deletingCategory?.name}"? Any associated tasks will be safely reassigned to your default category.`}
        confirmText="Delete Category"
        isDestructive={true}
      />
    </div>
  );
}
