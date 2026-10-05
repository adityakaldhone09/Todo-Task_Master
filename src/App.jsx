import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { TaskProvider } from './context/TaskContext';
import Layout from './components/layout/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Today from './pages/Today';
import Upcoming from './pages/Upcoming';
import Completed from './pages/Completed';
import Categories from './pages/Categories';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <TaskProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="today" element={<Today />} />
              <Route path="upcoming" element={<Upcoming />} />
              <Route path="completed" element={<Completed />} />
              <Route path="categories" element={<Categories />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </TaskProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
