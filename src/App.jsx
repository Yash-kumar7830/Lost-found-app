import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { DataProvider } from './context/DataContext';

import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ItemsPage from './pages/ItemsPage';
import ItemDetailsPage from './pages/ItemDetailsPage';
import ReportItemPage from './pages/ReportItemPage';
import MatchesPage from './pages/MatchesPage';
import ClaimsPage from './pages/ClaimsPage';
import NotificationsPage from './pages/NotificationsPage';
import MyReportsPage from './pages/MyReportsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <DataProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Landing Pages */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<LandingPage />} />
                </Route>

                {/* Authentication Page */}
                <Route path="/login" element={<LoginPage />} />

                {/* Authenticated Student Portal Routes */}
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/items" element={<ItemsPage />} />
                  <Route path="/items/:id" element={<ItemDetailsPage />} />
                  <Route path="/report/lost" element={<ReportItemPage />} />
                  <Route path="/report/found" element={<ReportItemPage />} />
                  <Route path="/matches" element={<MatchesPage />} />
                  <Route path="/claims" element={<ClaimsPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/my-reports" element={<MyReportsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  {/* Catch-all 404 Route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </DataProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
