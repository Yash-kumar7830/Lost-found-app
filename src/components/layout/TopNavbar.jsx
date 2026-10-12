import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  Plus,
  Shield,
  User,
  LogOut,
  CheckCheck,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../utils/helpers';
import Button from '../common/Button';

export default function TopNavbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin, toggleRole, logout, isAuthenticated } = useAuth();
  const { notifications, unreadNotifsCount, markAllNotificationsAsRead, markNotificationAsRead } = useData();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Close popups on outside click or Escape key press
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowNotifications(false);
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/items?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleToggleNotifications = () => {
    setShowNotifications((prev) => {
      if (!prev) setShowProfileMenu(false);
      return !prev;
    });
  };

  const handleToggleProfile = () => {
    setShowProfileMenu((prev) => {
      if (!prev) setShowNotifications(false);
      return !prev;
    });
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Global search */}
        <div className="flex items-center gap-3 flex-1 min-w-0 max-w-lg">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full min-w-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lost & found items on campus..."
              className="w-full min-w-0 pl-10 pr-4 py-2 text-sm bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 placeholder-slate-400 dark:placeholder-slate-500 transition-all text-slate-900 dark:text-slate-100 truncate"
            />
          </form>
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Report Button - prevent shrinking/clipping */}
          <Link to="/report/lost" className="hidden sm:inline-flex shrink-0">
            <Button
              variant="gradient"
              size="sm"
              icon={Plus}
              className="whitespace-nowrap shrink-0"
            >
              Report Item
            </Button>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative shrink-0" ref={notifRef}>
            <button
              onClick={handleToggleNotifications}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] glass-dropdown rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 border border-slate-200/90 dark:border-slate-800">
                <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Notifications
                    </h3>
                    {unreadNotifsCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        {unreadNotifsCount} new
                      </span>
                    )}
                  </div>
                  {unreadNotifsCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.slice(0, 4).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.link) navigate(n.link);
                        setShowNotifications(false);
                      }}
                      className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
                        !n.read ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">
                          {n.title}
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {formatDate(n.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications yet
                    </div>
                  )}
                </div>

                <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 text-center">
                  <Link
                    to="/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                  >
                    View all notifications →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative shrink-0" ref={profileRef}>
            <button
              onClick={handleToggleProfile}
              className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              aria-label="User menu"
              aria-expanded={showProfileMenu}
            >
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
                alt={user?.name || "User Avatar"}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30 shrink-0"
              />
              <span className="hidden md:block text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                {user?.name?.split(' ')[0] || 'Student'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block shrink-0" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] glass-dropdown rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 border border-slate-200/90 dark:border-slate-800">
                <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {user?.name || 'Student User'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {user?.email || 'student@campus.edu'}
                  </div>
                  <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    <Shield className="w-3 h-3" />
                    {isAdmin ? 'Campus Admin Role' : 'Student Verified'}
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    Student Profile
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      toggleRole();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Switch Role (Demo Only)</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60">
                      {isAdmin ? 'To Student' : 'To Admin'}
                    </span>
                  </button>

                  {/* Admin link only visible to admin users */}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Shield className="w-4 h-4 text-slate-400" />
                      Admin Moderation
                    </Link>
                  )}
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                  {isAuthenticated ? (
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Sign In / Verify
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
