import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  PlusCircle,
  PackagePlus,
  Sparkles,
  ShieldCheck,
  Bell,
  FileText,
  User,
  ShieldAlert,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Logo from '../common/Logo';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) {
  const { potentialMatchesCount, unreadNotifsCount, pendingClaimsCount } = useData();
  const { user, isAdmin } = useAuth();

  const navItems = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Marketplace', to: '/items', icon: Compass },
    { name: 'Smart Matches', to: '/matches', icon: Sparkles, badge: potentialMatchesCount, badgeColor: 'bg-violet-500' },
    { name: 'Claims Tracker', to: '/claims', icon: ShieldCheck, badge: pendingClaimsCount, badgeColor: 'bg-amber-500' },
    { name: 'Notifications', to: '/notifications', icon: Bell, badge: unreadNotifsCount, badgeColor: 'bg-rose-500' },
    { name: 'My Reports', to: '/my-reports', icon: FileText },
    { name: 'Student Profile', to: '/profile', icon: User },
  ];

  const reportActions = [
    { name: 'Report Lost Item', to: '/report/lost', icon: PlusCircle, color: 'text-rose-500 dark:text-rose-400' },
    { name: 'Report Found Item', to: '/report/found', icon: PackagePlus, color: 'text-emerald-500 dark:text-emerald-400' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
          <Logo size="md" showText={!isCollapsed} />
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar collapse"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Quick Reporting Actions */}
          <div className="space-y-1">
            {!isCollapsed && (
              <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Action Center
              </span>
            )}
            <div className="pt-1 space-y-1">
              {reportActions.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`
                  }
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className={`w-5 h-5 shrink-0 ${item.color}`} />
                  {!isCollapsed && <span>{item.name}</span>}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Main Navigation */}
          <div className="space-y-1">
            {!isCollapsed && (
              <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Management
              </span>
            )}
            <nav className="pt-1 space-y-1" aria-label="Sidebar main">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                  title={isCollapsed ? item.name : undefined}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <item.icon className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                  </div>
                  {!isCollapsed && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full text-white ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isCollapsed && item.badge > 0 && (
                    <span
                      className={`absolute top-2 right-2 w-2 h-2 rounded-full ${item.badgeColor}`}
                    />
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Administration Section */}
          <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            {!isCollapsed && (
              <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Administration
              </span>
            )}
            <div className="pt-1 space-y-1">
              <NavLink
                to="/admin"
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/25'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-700 dark:hover:text-amber-400'
                  }`
                }
                title={isCollapsed ? 'Admin Review Portal' : undefined}
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 shrink-0 text-amber-500" />
                  {!isCollapsed && <span>Admin Desk</span>}
                </div>
                {!isCollapsed && (
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                    Staff
                  </span>
                )}
              </NavLink>
            </div>
          </div>
        </div>

        {/* Footer profile snippet */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <NavLink
            to="/profile"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
              alt={user?.name || "User Avatar"}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20 shrink-0"
            />
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user?.name || 'Aarav Sharma'}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {isAdmin ? 'Campus Admin' : user?.studentId || 'Verified Student'}
                </div>
              </div>
            )}
          </NavLink>
        </div>
      </aside>
    </>
  );
}
