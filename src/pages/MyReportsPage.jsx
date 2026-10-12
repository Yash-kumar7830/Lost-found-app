import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import {
  FileText,
  Trash2,
  CheckCircle2,
  Eye,
  Calendar,
  MapPin,
  Sparkles
} from 'lucide-react';
import { formatDate } from '../utils/helpers';

export default function MyReportsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { items, deleteItem, resolveItem } = useData();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'lost');
  const [withdrawTargetId, setWithdrawTargetId] = useState(null);

  // Filter items reported by current user or mock student items
  const myItems = items.filter(
    (item) => item.reportedBy?.isCurrentUser || item.id === 'REP-2026-1043'
  );

  const displayedItems = myItems.filter((item) => {
    if (activeTab === 'lost') return item.type === 'lost' && item.status !== 'resolved';
    if (activeTab === 'found') return item.type === 'found' && item.status !== 'resolved';
    if (activeTab === 'resolved') return item.status === 'resolved';
    return true;
  });

  const handleWithdrawConfirm = () => {
    if (withdrawTargetId) {
      deleteItem(withdrawTargetId);
      toast.success('Report Withdrawn', `Report #${withdrawTargetId} has been removed.`);
      setWithdrawTargetId(null);
    }
  };

  const handleMarkResolved = (itemId) => {
    resolveItem(itemId);
    toast.success('Report Resolved', `Item #${itemId} marked as reunited with owner.`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              My Campus Reports
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal lost declarations and turned-in possession records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/report/found')}
          >
            + Turn in Found
          </Button>
          <Button
            variant="gradient"
            size="md"
            onClick={() => navigate('/report/lost')}
          >
            + Report Lost
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit text-xs font-bold">
        <button
          onClick={() => setActiveTab('lost')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'lost'
              ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          My Lost Items ({myItems.filter((i) => i.type === 'lost' && i.status !== 'resolved').length})
        </button>
        <button
          onClick={() => setActiveTab('found')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'found'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          My Found Items ({myItems.filter((i) => i.type === 'found' && i.status !== 'resolved').length})
        </button>
        <button
          onClick={() => setActiveTab('resolved')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'resolved'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Resolved Cases ({myItems.filter((i) => i.status === 'resolved').length})
        </button>
      </div>

      {/* Items List */}
      {displayedItems.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={`No ${activeTab} reports logged`}
          description="You currently don't have any registered reports under this category."
          actionLabel="Create a New Report"
          onAction={() => navigate(activeTab === 'found' ? '/report/found' : '/report/lost')}
        />
      ) : (
        <div className="space-y-4">
          {displayedItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4 min-w-0 flex-1">
                <img
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80'}
                  alt={item.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0"
                />

                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      #{item.id}
                    </span>
                    <Badge type={item.type} size="sm" />
                    <Badge type={item.status} size="sm" />
                    {item.status === 'potential_match' && (
                      <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Match Suggested
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/items/${item.id}`}
                    className="block text-base font-bold text-slate-900 dark:text-white hover:text-indigo-600 line-clamp-1"
                  >
                    {item.title}
                  </Link>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(item.date)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 w-full sm:w-auto justify-end">
                <Link to={`/items/${item.id}`}>
                  <Button variant="outline" size="sm" icon={Eye}>
                    View
                  </Button>
                </Link>

                {item.status !== 'resolved' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={CheckCircle2}
                    onClick={() => handleMarkResolved(item.id)}
                    className="text-emerald-700 dark:text-emerald-300"
                  >
                    Reunited
                  </Button>
                )}

                <button
                  type="button"
                  onClick={() => setWithdrawTargetId(item.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Withdraw report"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Withdraw Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!withdrawTargetId}
        onClose={() => setWithdrawTargetId(null)}
        onConfirm={handleWithdrawConfirm}
        title="Withdraw Item Report?"
        message="Are you sure you want to withdraw this campus report? It will be removed from the public marketplace and matching feed."
        confirmLabel="Withdraw Report"
        isDestructive={true}
      />
    </div>
  );
}
