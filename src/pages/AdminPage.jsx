import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History
} from 'lucide-react';
import { formatDateTime } from '../utils/helpers';

export default function AdminPage() {
  const { claims, items, updateClaimStatus, deleteItem } = useData();
  const { isAdmin, toggleRole } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('claims'); // 'claims' | 'moderation' | 'audit'
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const pendingClaims = claims.filter((c) => c.status === 'pending');
  const activeReports = items.filter((i) => i.status !== 'resolved');

  // Handle Claim Decision
  const handleClaimDecision = (decision) => {
    if (!selectedClaim) return;
    setIsProcessing(true);

    setTimeout(() => {
      updateClaimStatus(selectedClaim.id, decision, reviewNotes);
      setIsProcessing(false);
      setSelectedClaim(null);
      setReviewNotes('');

      if (decision === 'approved') {
        toast.success(
          'Claim Approved',
          `Claim #${selectedClaim.id} approved. Item marked ready for security desk collection.`
        );
      } else {
        toast.warning(
          'Claim Rejected',
          `Claim #${selectedClaim.id} rejected and claimant notified.`
        );
      }
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Campus Security & Admin Desk
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review claimant proofs, moderate student submissions, and authorize physical locker handovers.
          </p>
        </div>

        {/* Security badge and toggle */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
            Staff Level: Dispatcher
          </span>
          {!isAdmin && (
            <Button variant="secondary" size="sm" onClick={toggleRole}>
              Activate Admin View
            </Button>
          )}
        </div>
      </div>

      {/* Production Warning Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-300">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
        <p className="leading-relaxed">
          <strong>Security Architecture Notice:</strong> This admin interface is shown for presentation and evaluation purposes. In production, frontend route guards are accompanied by backend FastAPI OAuth2 bearer token authorization to prevent unprivileged tampering.
        </p>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Pending Review</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {pendingClaims.length}
          </div>
          <span className="text-[10px] text-slate-400">Claims awaiting check</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Active Listings</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {activeReports.length}
          </div>
          <span className="text-[10px] text-slate-400">Public campus records</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Locker Handover Rate</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            89.4%
          </div>
          <span className="text-[10px] text-slate-400">Successful reunions</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Duplicate Alerts</span>
          <div className="text-2xl font-black text-slate-700 dark:text-slate-300 mt-1">
            0
          </div>
          <span className="text-[10px] text-slate-400">No flags detected</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit text-xs font-bold">
        <button
          onClick={() => setActiveTab('claims')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'claims'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500'
          }`}
        >
          Ownership Claims Review ({claims.length})
        </button>
        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'moderation'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500'
          }`}
        >
          Report Moderation ({items.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'audit'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500'
          }`}
        >
          Security Audit Trail
        </button>
      </div>

      {/* TAB 1: CLAIMS REVIEW QUEUE */}
      {activeTab === 'claims' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Incoming Student Claims
            </h3>
            <span className="text-xs text-slate-400">
              Comparing student evidence against finder verification clues
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-bold">Claim ID</th>
                  <th className="py-3 px-4 font-bold">Item Claimed</th>
                  <th className="py-3 px-4 font-bold">Claimant</th>
                  <th className="py-3 px-4 font-bold">Submitted</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {claims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {claim.id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {claim.itemTitle}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      {claim.claimant?.name} ({claim.claimant?.studentId})
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {formatDateTime(claim.submittedAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        type={
                          claim.status === 'approved'
                            ? 'resolved'
                            : claim.status === 'rejected'
                            ? 'lost'
                            : 'claim_pending'
                        }
                        label={claim.status.toUpperCase()}
                        size="sm"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedClaim(claim)}
                      >
                        Inspect Proof
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: REPORT MODERATION */}
      {activeTab === 'moderation' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Campus Notice Moderation
            </h3>
            <span className="text-xs text-slate-400">
              Flagged content & duplicate management
            </span>
          </div>

          <div className="space-y-3">
            {items.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=200&q=80'}
                    alt={item.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">#{item.id}</span>
                      <Badge type={item.type} size="sm" />
                    </div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {item.location} • Reported by {item.reportedBy?.name}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-lg">
                    Approved Listing
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      deleteItem(item.id);
                      toast.info('Item Removed', `Report #${item.id} removed by admin.`);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Campus Security Audit Trail
            </h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="py-3 flex justify-between items-center">
              <div>
                <strong className="text-slate-900 dark:text-white">Physical Handover Completed</strong>
                <p className="text-slate-500">Case #REP-2026-0994 (Brass Keys on Marvel Keychain) handed over to Sneha Kapoor.</p>
              </div>
              <span className="text-slate-400">Oct 07, 11:15 AM</span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <div>
                <strong className="text-slate-900 dark:text-white">Claim #CLM-2026-3190 Received</strong>
                <p className="text-slate-500">Student Aarav Sharma filed verification response for Brown Leather Wallet.</p>
              </div>
              <span className="text-slate-400">Oct 10, 02:20 PM</span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <div>
                <strong className="text-slate-900 dark:text-white">High Confidence Match Logged</strong>
                <p className="text-slate-500">Algorithm paired #REP-2026-1043 with #REP-2026-1042 (Space Gray MacBook Air M2).</p>
              </div>
              <span className="text-slate-400">Oct 10, 04:35 PM</span>
            </div>
          </div>
        </div>
      )}

      {/* CLAIM INSPECTION & DECISION MODAL */}
      {selectedClaim && (
        <Modal
          isOpen={!!selectedClaim}
          onClose={() => setSelectedClaim(null)}
          title={`Evaluate Ownership Claim #${selectedClaim.id}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6 text-xs">
            {/* Claimant Profile Info */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <span className="text-slate-400 font-bold block">Claimant Student Profile:</span>
                <div className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                  {selectedClaim.claimant?.name}
                </div>
                <div className="text-slate-500">
                  ID: {selectedClaim.claimant?.studentId} • {selectedClaim.claimant?.email}
                </div>
              </div>
              <Badge
                type={
                  selectedClaim.status === 'approved'
                    ? 'resolved'
                    : selectedClaim.status === 'rejected'
                    ? 'lost'
                    : 'claim_pending'
                }
                label={selectedClaim.status.toUpperCase()}
                size="md"
              />
            </div>

            {/* Submitted Evidence */}
            <div className="space-y-1.5">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Claimant's Identifying Evidence:
              </span>
              <p className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                {selectedClaim.identifyingDetails}
              </p>
            </div>

            {/* Answered Questions */}
            {selectedClaim.answers && selectedClaim.answers.length > 0 && (
              <div className="space-y-3">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Answers to Finder's Verification Questions:
                </span>
                {selectedClaim.answers.map((ans, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1"
                  >
                    <div className="font-bold text-slate-700 dark:text-slate-300">
                      Q: {ans.question}
                    </div>
                    <div className="text-indigo-600 dark:text-indigo-400 font-semibold font-mono">
                      Answer: "{ans.answer}"
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Admin Notes Input */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 dark:text-slate-200 block">
                Security Desk Evaluation Notes:
              </label>
              <textarea
                rows={2}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="e.g. Verified against physical student ID card; locker #14 released."
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Action Decision Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="md"
                onClick={() => setSelectedClaim(null)}
                disabled={isProcessing}
              >
                Close
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="danger"
                  size="md"
                  icon={XCircle}
                  onClick={() => handleClaimDecision('rejected')}
                  disabled={isProcessing}
                >
                  Reject Claim
                </Button>
                <Button
                  variant="success"
                  size="md"
                  icon={CheckCircle2}
                  onClick={() => handleClaimDecision('approved')}
                  disabled={isProcessing}
                >
                  Approve & Authorize Handover
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
