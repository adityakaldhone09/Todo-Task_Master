import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { TagBadge } from '../common/Badge';
import { PRIORITIES, PRIORITY_CONFIG } from '../../utils/constants';
import { getTodayDateString, getTomorrowDateString } from '../../utils/dateUtils';
import { getCategoryIcon } from '../../utils/categoryIcons';
import { Calendar, Clock, Bell, Tag, AlertCircle } from 'lucide-react';

export default function TaskModal({
  isOpen,
  onClose,
  initialTask = null,
  categories = [],
  onSubmit,
}) {
  const isEditing = Boolean(initialTask);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(PRIORITIES.MEDIUM);
  const [category, setCategory] = useState(categories[0]?.id || 'personal');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [reminder, setReminder] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  // Reset or populate form when modal opens or initialTask changes
  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setPriority(initialTask.priority || PRIORITIES.MEDIUM);
      setCategory(initialTask.category || categories[0]?.id || 'personal');
      setDueDate(initialTask.dueDate || '');
      setDueTime(initialTask.dueTime || '');
      setReminder(Boolean(initialTask.reminder));
      setTags(Array.isArray(initialTask.tags) ? initialTask.tags : []);
    } else {
      setTitle('');
      setDescription('');
      setPriority(PRIORITIES.MEDIUM);
      setCategory(categories[0]?.id || 'personal');
      setDueDate(getTodayDateString());
      setDueTime('');
      setReminder(false);
      setTags([]);
    }
    setTagInput('');
    setErrors({});
  }, [initialTask, isOpen, categories]);

  const validate = () => {
    const errs = {};
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      errs.title = 'Title cannot be empty.';
    } else if (trimmedTitle.length > 150) {
      errs.title = 'Maximum 150 characters.';
    }

    if (description && description.length > 500) {
      errs.description = 'Maximum 500 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const cleanTag = tagInput.trim().toLowerCase().replace(/^#/, '');
      if (cleanTag && !tags.includes(cleanTag)) {
        setTags([...tags, cleanTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate,
      dueTime,
      reminder,
      tags,
    });

    onClose();
  };

  const todayStr = getTodayDateString();
  const tomorrowStr = getTomorrowDateString();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
      description={isEditing ? 'Make changes to your task details.' : 'Organize and track your next to-do item.'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title Field */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="task-title" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-slate-400">
              {title.length}/150
            </span>
          </div>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Complete React project documentation"
            maxLength={150}
            className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-dark-900/60 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.title
                ? 'border-rose-400 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-700/80 focus:ring-brand-500/20 focus:border-brand-500'
            }`}
            autoFocus
          />
          {errors.title && (
            <p className="flex items-center gap-1.5 mt-1.5 text-xs text-rose-500 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.title}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="task-desc" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Description <span className="text-xs font-normal text-slate-400">(Optional)</span>
            </label>
            <span className="text-xs text-slate-400">
              {description.length}/500
            </span>
          </div>
          <textarea
            id="task-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add relevant notes, links, or implementation details..."
            rows={3}
            maxLength={500}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-dark-900/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none text-sm"
          />
          {errors.description && (
            <p className="flex items-center gap-1.5 mt-1.5 text-xs text-rose-500 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.description}
            </p>
          )}
        </div>

        {/* Priority & Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Priority */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
              Priority
            </label>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-dark-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800">
              {Object.values(PRIORITIES).map((pKey) => {
                const conf = PRIORITY_CONFIG[pKey];
                const isSelected = priority === pKey;
                return (
                  <button
                    key={pKey}
                    type="button"
                    onClick={() => setPriority(pKey)}
                    className={`py-1.5 px-1 rounded-lg text-xs font-semibold capitalize transition-all flex items-center justify-center gap-1 ${
                      isSelected
                        ? `${conf.bg} ${conf.color} shadow-xs ring-1 ${conf.border}`
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
                    {conf.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="task-cat" className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
              Category
            </label>
            <div className="relative">
              <select
                id="task-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-dark-900/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 capitalize appearance-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="dark:bg-dark-850">
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                ▾
              </div>
            </div>
          </div>
        </div>

        {/* Due Date & Due Time Section */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
            Due Date & Time
          </label>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <button
              type="button"
              onClick={() => setDueDate(todayStr)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                dueDate === todayStr
                  ? 'bg-brand-50 border-brand-500 text-brand-700 dark:bg-brand-950/60 dark:border-brand-400 dark:text-brand-300'
                  : 'bg-slate-50 dark:bg-dark-900/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setDueDate(tomorrowStr)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                dueDate === tomorrowStr
                  ? 'bg-brand-50 border-brand-500 text-brand-700 dark:bg-brand-950/60 dark:border-brand-400 dark:text-brand-300'
                  : 'bg-slate-50 dark:bg-dark-900/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              Tomorrow
            </button>
            {dueDate && (
              <button
                type="button"
                onClick={() => setDueDate('')}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-auto"
              >
                Clear date
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 dark:bg-dark-900/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                placeholder="Due time"
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 dark:bg-dark-900/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Reminder Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-dark-900/60 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <Bell className={`w-4 h-4 ${reminder ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`} />
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Set Reminder
              </p>
              <p className="text-[11px] text-slate-400">
                Send a notification alert before due time
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setReminder(!reminder)}
            className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
              reminder ? 'bg-brand-600' : 'bg-slate-300 dark:bg-dark-700'
            }`}
            role="switch"
            aria-checked={reminder}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                reminder ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Tags Field */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
            Tags
          </label>
          <div className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-slate-50 dark:bg-dark-900/60 border border-slate-200 dark:border-slate-700/80 rounded-xl focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all">
            <Tag className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tags (press Enter or comma)"
              className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {tags.map((tag) => (
                <TagBadge key={tag} tag={tag} onRemove={handleRemoveTag} />
              ))}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
