import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopNavbar from '../components/layout/TopNavbar';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Show clean loading state while restoring session to prevent route flashing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-9 h-9 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Verifying campus security session...
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if unauthenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col overflow-x-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 min-w-0 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Sticky Top Navbar */}
        <TopNavbar onMenuClick={() => setIsMobileOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Bar */}
      <MobileBottomNav />
    </div>
  );
}

