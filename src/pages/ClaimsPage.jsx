import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import ClaimCard from '../components/claims/ClaimCard';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { ShieldCheck, Plus, Clock, CheckCircle2, AlertTriangle, Compass } from 'lucide-react';

export default function ClaimsPage() {
  const { claims } = useData();
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredClaims = claims.filter((claim) => {
    if (statusFilter === 'all') return true;
    return claim.status === statusFilter;
  });

  const pendingCount = claims.filter((c) => c.status === 'pending').length;
  const approvedCount = claims.filter((c) => c.status === 'approved').length;
  const rejectedCount = claims.filter((c) => c.status === 'rejected').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Claims & Ownership Tracker
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor review stages, responses, and security desk pickup clearances.
          </p>
        </div>

        <Link to="/items?type=found">
          <Button variant="primary" size="md" icon={Compass}>
            Browse Found Items to Claim
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit text-xs font-bold">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl transition-all ${
            statusFilter === 'all'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          All Claims ({claims.length})
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-3.5 py-1.5 rounded-xl transition-all ${
            statusFilter === 'pending'
              ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Under Review ({pendingCount})
        </button>
        <button
          onClick={() => setStatusFilter('approved')}
          className={`px-3.5 py-1.5 rounded-xl transition-all ${
            statusFilter === 'approved'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Approved ({approvedCount})
        </button>
        <button
          onClick={() => setStatusFilter('rejected')}
          className={`px-3.5 py-1.5 rounded-xl transition-all ${
            statusFilter === 'rejected'
              ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Rejected ({rejectedCount})
        </button>
      </div>

      {/* Claims List */}
      {filteredClaims.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No claims matching this filter"
          description="You haven't submitted any ownership claims under this status category."
          actionLabel="Browse Found Items"
          onAction={() => window.location.assign('/items?type=found')}
        />
      ) : (
        <div className="space-y-6">
          {filteredClaims.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      )}
    </div>
  );
}
