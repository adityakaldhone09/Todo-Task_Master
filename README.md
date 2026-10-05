# TaskFlow - Production-Ready React Task Management Suite

TaskFlow is a modern, responsive, production-ready To-Do & Productivity application built with React, Vite, Tailwind CSS, React Router, and Lucide React. Designed with a clean modular architecture, accessible design system, and full LocalStorage persistence with an abstracted service layer ready for REST/GraphQL APIs.

---

## Features

### 1. Productivity Dashboard (`/`)
- **Dynamic Metric Cards:** Total Tasks, Completed, Pending, and Overdue tasks with real-time recalculation.
- **Productivity Overview:** Daily execution streak counter, total completion rate progress ring, tasks finished today & this week, and a 7-day visual activity breakdown.
- **Quick Capture Bar:** Add tasks immediately with inline priority and category selector (press Enter to save).
- **Snapshot Sections:** Immediate glance at today's tasks, upcoming milestones, and recently completed tasks.

### 2. All Tasks & Real-time Management (`/tasks`)
- **Real-Time Instant Search:** Query tasks across Title, Description, Category, and `#tags`.
- **Multi-dimensional Filters:** Status (`All`, `Active`, `Completed`, `Overdue`), Priority (`Low`, `Medium`, `High`, `Urgent`), and dynamic Categories.
- **Rich Sorting:** Sort by `Newest First`, `Oldest First`, `Due Date`, `Priority (Urgent -> Low)`, and `Alphabetical (A-Z)`.
- **Task Cards:** Checkbox with celebratory confetti upon completion, overdue warning badges, relative date formatting (`Today`, `Tomorrow`, `Oct 8`), tag chips, edit, and delete triggers.

### 3. Today's Focus (`/today`)
- Automatically sections tasks into:
  - **Overdue:** Urgent items that passed their due date/time.
  - **Due Today:** Tasks scheduled specifically for the current day.
  - **Completed Today:** Items achieved today to celebrate daily wins.

### 4. Upcoming Timeline (`/upcoming`)
- Groups pending future tasks chronologically by date (`Tomorrow`, `Oct 8`, `Oct 10`, etc.) with divider headers and counts.

### 5. Completed Tasks & Archive (`/completed`)
- View all completed tasks.
- **Restore Task:** Move any task back into active status with one click.
- **Permanent Delete:** Individual task removal with confirmation.
- **Clear All Completed:** Destructive bulk action protected by reusable confirmation modal.

### 6. Category Management (`/categories`)
- Create and edit custom categories with custom icons (Lucide library), hex color badges, and dynamic task counters.
- Safe deletion with automatic task reassignment to fallback categories.

### 7. Task Creation & Edit Modal
- **Validation:** Title cannot be empty (max 150 chars); optional description (max 500 chars).
- **Priority Selector:** Low, Medium, High, Urgent with color indicators.
- **Category Selector:** Connected to dynamic category state.
- **Due Date & Time:** Quick presets (`Today`, `Tomorrow`, `Custom Date`), time picker, and reminder flag.
- **Tags Input:** Multi-tag chip system with Enter / comma addition and deletion.

### 8. UI/UX Design & Aesthetics
- **Dark Mode & Light Mode:** Seamless toggle with LocalStorage persistence and initial system preference detection.
- **Reusable Toast Notifications:** System feedback for create, update, complete, and delete actions.
- **Accessible Modals & Dialogs:** Escape key listener, backdrop blur, focus trap, and ARIA attributes.
- **Empty States:** Meaningful illustrations and call-to-action buttons for empty views.
- **Stress-tested Performance:** Built-in "+100 Tasks" test generator in the sidebar to verify 60fps performance with large backlogs.

---

## Architecture & Code Structure

```text
src/
├── components/
│   ├── common/
│   │   ├── Badge.jsx            # Priority, Category, and Tag badges
│   │   ├── Button.jsx           # Reusable button with variants & sizes
│   │   ├── ConfirmDialog.jsx    # Destructive action modal
│   │   ├── EmptyState.jsx       # Custom zero-data states
│   │   ├── Modal.jsx            # Accessible dialog wrapper
│   │   └── Toast.jsx            # Toast alert item
│   ├── dashboard/
│   │   ├── ProductivityChart.jsx# 7-day activity & streak tracker
│   │   └── StatCard.jsx         # Metric display cards
│   ├── layout/
│   │   ├── Header.jsx           # Top app header with search shortcut
│   │   ├── Layout.jsx           # Master responsive layout wrapper
│   │   ├── MobileMenu.jsx       # Slide-out drawer for mobile/tablet
│   │   └── Sidebar.jsx          # Desktop navigation & category list
│   └── tasks/
│       ├── QuickAddTask.jsx     # Inline one-click task bar
│       ├── TaskCard.jsx         # Interactive task item card
│       ├── TaskFilters.jsx      # Search, status tabs, dropdown filters
│       ├── TaskList.jsx         # Task list container
│       └── TaskModal.jsx        # Creation & editing modal
├── context/
│   ├── TaskContext.jsx          # Central state & data handlers
│   └── ToastContext.jsx         # Global notifications system
├── hooks/
│   └── useTasks.js              # Hook export
├── pages/
│   ├── Categories.jsx           # Category management page
│   ├── Completed.jsx            # Completed tasks & clear page
│   ├── Dashboard.jsx            # Main dashboard overview
│   ├── NotFound.jsx             # 404 fallback page
│   ├── Tasks.jsx                # All tasks view
│   ├── Today.jsx                # Today & overdue tasks
│   └── Upcoming.jsx             # Grouped upcoming view
├── services/
│   └── taskService.js           # Decoupled storage & API adapter
├── utils/
│   ├── categoryIcons.jsx        # Lucide icon mapper
│   ├── constants.js             # Priorities, filters, defaults
│   ├── dateUtils.js             # Date formatting & overdue logic
│   └── taskUtils.js             # Filter, sort, stats, demo data
├── App.jsx                      # App router & providers
├── index.css                    # Tailwind CSS directives & scrollbars
└── main.jsx                     # Entry point
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
The optimized bundle will be compiled into the `dist/` directory.

---

## Future Backend Compatibility
The application employs an isolated service layer (`src/services/taskService.js`). To connect to a REST API or GraphQL backend, simply replace the LocalStorage calls in `taskService.js` with `fetch` or `axios` queries without modifying any UI components.
