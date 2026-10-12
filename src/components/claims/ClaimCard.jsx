import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, ArrowRight, MapPin } from 'lucide-react';
import Badge from '../common/Badge';
import ClaimTimeline from './ClaimTimeline';
import { formatDateTime } from '../../utils/helpers';

export default function ClaimCard({ claim }) {
  const isApproved = claim.status === 'approved';
  const isRejected = claim.status === 'rejected';
  const isPending = claim.status === 'pending';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all overflow-hidden p-6 space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              #{claim.id}
            </span>
            <span className="text-xs text-slate-400">
              Submitted: {formatDateTime(claim.submittedAt)}
            </span>
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
            {claim.itemTitle}
          </h4>
        </div>

        <div>
          {isApproved && <Badge type="resolved" label="Claim Approved" size="md" />}
          {isRejected && <Badge type="lost" label="Claim Rejected" size="md" />}
          {isPending && <Badge type="claim_pending" label="Under Security Review" size="md" />}
        </div>
      </div>

      {/* Grid: Details & Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Claim Submission Details */}
        <div className="space-y-4 text-xs">
          <div>
            <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Location Found
            </span>
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
              <span>{claim.itemLocation}</span>
            </div>
          </div>

          <div>
            <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Your Identifying Evidence
            </span>
            <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
              {claim.identifyingDetails}
            </p>
          </div>

          {claim.adminNotes && (
            <div>
              <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Security Desk Notes
              </span>
              <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-indigo-900 dark:text-indigo-300 leading-relaxed">
                {claim.adminNotes}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Timeline */}
        <div className="bg-slate-50/50 dark:bg-slate-800/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <ClaimTimeline timeline={claim.timeline} />
        </div>
      </div>

      {/* Footer next steps & action */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="text-slate-500 dark:text-slate-400">
          {isApproved ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Ready for pickup at Central Security Office with Student ID.
            </span>
          ) : isPending ? (
            <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
              <Clock className="w-4 h-4" /> Verification usually completes within 12-24 hours.
            </span>
          ) : (
            <span className="text-rose-500 font-medium">
              If you feel this decision was in error, please visit the Security Helpdesk.
            </span>
          )}
        </div>

        <Link
          to={`/items/${claim.itemId}`}
          className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
        >
          <span>View Public Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
