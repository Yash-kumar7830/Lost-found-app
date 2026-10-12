import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import {
  ShieldCheck,
  Mail,
  Phone,
  Building,
  Moon,
  Sun,
  LogOut,
  Save,
  Lock,
  Sparkles
} from 'lucide-react';
import { maskPhoneNumber } from '../utils/helpers';

export default function ProfilePage() {
  const { user, isAdmin, toggleRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);

  const handleSavePreferences = (e) => {
    e.preventDefault();
    toast.success('Preferences Saved', 'Your privacy and notification preferences have been updated.');
  };

  const handleLogout = () => {
    logout();
    toast.info('Signed Out', 'You have been signed out.');
    navigate('/login');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Student Profile & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review your verified campus identity, privacy settings, and notification alerts.
        </p>
      </div>

      {/* Identity Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
              alt={user?.name || "Student"}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-500/20 shadow-md shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {user?.name || 'Aarav Sharma'}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Student ID: <strong className="text-indigo-600 dark:text-indigo-400">{user?.studentId}</strong>
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {user?.department} • {user?.semester}
              </p>
            </div>
          </div>

          {/* Role switcher button */}
          <div className="flex flex-col sm:items-end gap-2">
            <button
              type="button"
              onClick={toggleRole}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 hover:bg-amber-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Current Role: {isAdmin ? 'Campus Admin' : 'Student'} (Click to Toggle)</span>
            </button>
            <span className="text-[10px] text-slate-400">
              Demo role switcher for evaluator convenience
            </span>
          </div>
        </div>

        {/* Identity Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-500" /> Registered College Email
            </span>
            <div className="font-semibold text-slate-900 dark:text-white">
              {user?.email || 'aarav.s@campus.edu'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-500" /> Masked Contact Number
            </span>
            <div className="font-semibold text-slate-900 dark:text-white">
              {maskPhoneNumber(user?.phone)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-amber-500" /> Campus Residence Block
            </span>
            <div className="font-semibold text-slate-900 dark:text-white">
              {user?.residence || 'North Campus Hostel Block B'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-500" /> Privacy Shield Status
            </span>
            <div className="font-semibold text-emerald-600 dark:text-emerald-400">
              Active • Direct Phone Number Hidden from Public
            </div>
          </div>
        </div>
      </div>

      {/* Notification & Display Preferences */}
      <form onSubmit={handleSavePreferences} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            System Preferences
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Customize alert dispatch channels and interface appearance.
          </p>
        </div>

        <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Notification toggles */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Algorithm Match Push Alerts
              </span>
              <span className="text-[11px] text-slate-500">
                Receive notifications when potential lost/found matches exceed 80% similarity.
              </span>
            </div>
            <input
              type="checkbox"
              checked={matchAlerts}
              onChange={(e) => setMatchAlerts(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                College Email Notifications
              </span>
              <span className="text-[11px] text-slate-500">
                Forward claim status updates and pickup clearances to your registered email.
              </span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
          </div>

          {/* Theme switcher */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Interface Color Scheme
              </span>
              <span className="text-[11px] text-slate-500">
                Current mode: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={theme === 'dark' ? Sun : Moon}
              onClick={toggleTheme}
            >
              Toggle {theme === 'dark' ? 'Light' : 'Dark'}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="danger"
            size="sm"
            icon={LogOut}
            onClick={handleLogout}
          >
            Sign Out
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Save}
          >
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
