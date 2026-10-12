import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, Lock, HelpCircle, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ClaimModal({ isOpen, onClose, item }) {
  const { user } = useAuth();
  const { submitClaim } = useData();
  const toast = useToast();

  const [identifyingDetails, setIdentifyingDetails] = useState('');
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedClaim, setSubmittedClaim] = useState(null);

  if (!item) return null;

  const verificationQuestions = item.verificationQuestions || [
    { id: 'q1', question: 'Describe any specific sticker, scratch, or unique mark on the item.', hint: 'Physical markings' },
    { id: 'q2', question: 'What was inside or attached to the item when lost?', hint: 'Internal contents or keychain' },
  ];

  const handleAnswerChange = (qId, val) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identifyingDetails.trim()) {
      toast.error('Details Required', 'Please provide identifying characteristics to substantiate your claim.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const claimPayload = {
        itemId: item.id,
        itemTitle: item.title,
        itemCategory: item.category,
        itemLocation: item.location,
        claimant: {
          name: user?.name || 'Aarav Sharma',
          studentId: user?.studentId || 'STU-2024-8842',
          email: user?.email || 'aarav.s@campus.edu',
          phone: user?.phone || '+91 98765 43842',
        },
        identifyingDetails: identifyingDetails.trim(),
        answers: verificationQuestions.map((q) => ({
          questionId: q.id,
          question: q.question,
          answer: answers[q.id] || 'Not specified',
        })),
      };

      const created = submitClaim(claimPayload);
      setIsSubmitting(false);
      setSubmittedClaim(created);

      // Trigger celebratory confetti
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });

      toast.success('Claim Filed', `Ownership claim #${created.id} submitted for verification.`);
    }, 1000);
  };

  const handleClose = () => {
    setSubmittedClaim(null);
    setIdentifyingDetails('');
    setAnswers({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={submittedClaim ? 'Claim Submitted Successfully' : `Claim Item: ${item.title}`}
      maxWidth="max-w-2xl"
    >
      {submittedClaim ? (
        <div className="text-center py-6 space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white">
              Claim ID: <span className="font-mono text-indigo-600 dark:text-indigo-400">{submittedClaim.id}</span>
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
              Your claim and verification answers have been forwarded to the campus security desk. You can track evaluation updates under the Claims tab.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
            <div className="font-bold text-slate-800 dark:text-slate-200">Next Steps:</div>
            <p className="text-slate-600 dark:text-slate-400">
              1. Security staff will review your answers against the finder's confidential record.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              2. When approved, bring your student RFID card to the Central Admin Desk for pickup.
            </p>
          </div>

          <Button variant="primary" size="md" onClick={handleClose} className="w-full">
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Privacy & Security Banner */}
          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60 flex items-start gap-3 text-xs text-indigo-900 dark:text-indigo-300">
            <Lock className="w-5 h-5 shrink-0 text-indigo-600 dark:text-indigo-400 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-semibold block">Confidential Verification Process</strong>
              <p className="leading-relaxed">
                To prevent fraudulent claims, your responses are validated strictly against the finder's private records. Expected answers are never shown publicly.
              </p>
            </div>
          </div>

          {/* Item Quick Overview */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <img
              src={item.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'}
              alt={item.title}
              className="w-14 h-14 rounded-lg object-cover shrink-0"
            />
            <div className="min-w-0 flex-1 text-xs">
              <div className="font-bold text-slate-900 dark:text-white truncate">{item.title}</div>
              <div className="text-slate-500 dark:text-slate-400">Found at: {item.location}</div>
              <div className="text-slate-500 dark:text-slate-400">Category: {item.category}</div>
            </div>
          </div>

          {/* Identifying Proof Textarea */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Unique Identifying Characteristics <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={identifyingDetails}
              onChange={(e) => setIdentifyingDetails(e.target.value)}
              placeholder="State distinctive marks, serial numbers, passcode, wallpaper, or specific items inside..."
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
            />
            <p className="text-[11px] text-slate-500">
              Provide specific evidence that proves this item belongs to you.
            </p>
          </div>

          {/* Finder Verification Questions */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
              <HelpCircle className="w-4 h-4 text-violet-500" />
              <span>Finder's Verification Questions</span>
            </div>

            {verificationQuestions.map((q, idx) => (
              <div key={q.id} className="space-y-1 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Question {idx + 1}: {q.question}
                </label>
                <input
                  type="text"
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  placeholder={`Your answer... ${q.hint ? `(${q.hint})` : ''}`}
                  className="w-full mt-1.5 px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                />
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="md" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={ShieldCheck}
              isLoading={isSubmitting}
            >
              Submit Ownership Claim
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
