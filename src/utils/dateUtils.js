/**
 * Date Utility Functions
 */

export function getTodayDateString() {
  const today = new Date();
  return formatDateToISO(today);
}

export function getTomorrowDateString() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDateToISO(tomorrow);
}

export function formatDateToISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  // Parse YYYY-MM-DD
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return new Date(dateStr);
  return new Date(year, month - 1, day);
}

export function isToday(dateStr) {
  if (!dateStr) return false;
  return dateStr === getTodayDateString();
}

export function isTomorrow(dateStr) {
  if (!dateStr) return false;
  return dateStr === getTomorrowDateString();
}

export function isPast(dateStr) {
  if (!dateStr) return false;
  return dateStr < getTodayDateString();
}

/**
 * Checks if a task is overdue (dueDate is in the past or today with expired dueTime)
 */
export function isOverdue(dueDate, dueTime = null, completed = false) {
  if (completed || !dueDate) return false;
  
  const todayStr = getTodayDateString();
  if (dueDate < todayStr) return true;
  
  if (dueDate === todayStr && dueTime) {
    const now = new Date();
    const [hours, minutes] = dueTime.split(':').map(Number);
    const dueDateTime = new Date();
    dueDateTime.setHours(hours, minutes, 0, 0);
    return now > dueDateTime;
  }
  
  return false;
}

export function getRelativeDateLabel(dateStr) {
  if (!dateStr) return 'No due date';
  if (isToday(dateStr)) return 'Today';
  if (isTomorrow(dateStr)) return 'Tomorrow';
  
  const today = parseLocalDate(getTodayDateString());
  const target = parseLocalDate(dateStr);
  if (!today || !target) return dateStr;
  
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === -1) return 'Yesterday';
  if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
  if (diffDays > 1 && diffDays <= 6) {
    return target.toLocaleDateString('en-US', { weekday: 'short' });
  }

  // Format as "Oct 8" or "Oct 8, 2027" if different year
  const isCurrentYear = target.getFullYear() === today.getFullYear();
  return target.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(isCurrentYear ? {} : { year: 'numeric' }),
  });
}

export function formatTime(timeStr) {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function formatDateTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Returns past 7 days starting from 6 days ago up to today
 */
export function getPast7Days() {
  const days = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDateToISO(d);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    days.push({
      dateStr,
      dayName,
      isToday: i === 0,
    });
  }
  return days;
}
