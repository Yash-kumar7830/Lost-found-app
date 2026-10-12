import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import {
  Bell,
  CheckCheck,
  Sparkles,
  ShieldCheck,
  Package,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { formatDate } from '../utils/helpers';

export default function NotificationsPage() {
  const {
    notifications,
    unreadNotifsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useData();
  const toast = useToast();
  const navigate = useNavigate();

  const [filterType, setFilterType] = useState('all');

  const filteredNotifs = notifications.filter((n) => {
    if (filterType === 'unread') return !n.read;
    if (filterType === 'matches') return n.type === 'match';
    if (filterType === 'claims') return n.type === 'claim';
    return true;
  });

  const handleMarkAll = () => {
    markAllNotificationsAsRead();
    toast.success('All Marked as Read', 'All notifications marked as read.');
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'match':
        return <Sparkles className="w-5 h-5 text-violet-500" />;
      case 'claim':
        return <ShieldCheck className="w-5 h-5 text-amber-500" />;
      case 'resolved':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      default:
        return <Package className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Bell className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Notifications & Alerts
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time updates regarding item reports, algorithm matches, and security reviews.
          </p>
        </div>

        {unreadNotifsCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            icon={CheckCheck}
            onClick={handleMarkAll}
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit text-xs font-bold">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            filterType === 'all'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilterType('unread')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            filterType === 'unread'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-500'
          }`}
        >
          Unread ({unreadNotifsCount})
        </button>
        <button
          onClick={() => setFilterType('matches')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            filterType === 'matches'
              ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs'
              : 'text-slate-500'
          }`}
        >
          Matches
        </button>
        <button
          onClick={() => setFilterType('claims')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            filterType === 'claims'
              ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
              : 'text-slate-500'
          }`}
        >
          Claims
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifs.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications to show"
          description="You are completely caught up! New match alerts and claim updates will appear here."
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                if (!notif.read) markNotificationAsRead(notif.id);
              }}
              className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                !notif.read
                  ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/60 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  {getNotifIcon(notif.type)}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {notif.title}
                    </h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-[11px] text-slate-400 block pt-1">
                    {formatDate(notif.timestamp)}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {notif.link && (
                <Button
                  variant={!notif.read ? 'primary' : 'outline'}
                  size="sm"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={(e) => {
                    e.stopPropagation();
                    markNotificationAsRead(notif.id);
                    navigate(notif.link);
                  }}
                  className="shrink-0 w-full sm:w-auto"
                >
                  {notif.actionLabel || 'Inspect'}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
