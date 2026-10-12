import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ClaimModal from '../components/claims/ClaimModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import {
  Sparkles,
  ShieldCheck,
  X,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { formatDate, getSharedKeywords, calculateDemoSimilarity } from '../utils/helpers';
import { ITEM_CATEGORIES } from '../data/mockItems';

export default function MatchesPage() {
  const { items, dismissedMatches, dismissMatch } = useData();
  const toast = useToast();

  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [claimTargetItem, setClaimTargetItem] = useState(null);
  const [dismissTargetPair, setDismissTargetPair] = useState(null);

  // Generate match pairs from items
  const matchPairs = useMemo(() => {
    const pairs = [];
    const lostItems = items.filter((i) => i.type === 'lost' && i.status !== 'resolved');
    const foundItems = items.filter((i) => i.type === 'found' && i.status !== 'resolved');

    lostItems.forEach((lost) => {
      foundItems.forEach((found) => {
        const pairId = `${lost.id}-${found.id}`;
        if (dismissedMatches.includes(pairId)) return;

        // Check if explicit match or calculated score >= 75
        let score = lost.potentialMatchId === found.id ? (lost.matchScore || 96) : calculateDemoSimilarity(lost, found);

        if (score >= 70) {
          pairs.push({
            id: pairId,
            score,
            lost,
            found,
            sharedKeywords: getSharedKeywords(lost, found),
            reason:
              lost.potentialMatchId === found.id && lost.matchReason
                ? lost.matchReason
                : `Matched on category '${lost.category}', proximity around '${lost.location}', and shared textual description clues.`,
          });
        }
      });
    });

    return pairs.sort((a, b) => b.score - a.score);
  }, [items, dismissedMatches]);

  const filteredPairs = useMemo(() => {
    if (selectedCategory === 'All Items') return matchPairs;
    return matchPairs.filter(
      (p) => p.lost.category === selectedCategory || p.found.category === selectedCategory
    );
  }, [matchPairs, selectedCategory]);

  const handleDismissConfirm = () => {
    if (dismissTargetPair) {
      dismissMatch(dismissTargetPair.id);
      toast.info('Match Dismissed', 'Recommendation removed from your suggestions.');
      setDismissTargetPair(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Smart Matching Radar
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Algorithmic correlation engine comparing lost item declarations against turned-in belongings.
          </p>
        </div>

        {/* Category Pill Filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 shadow-xs"
          >
            {ITEM_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Demo Similarity Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 flex items-start gap-3 text-xs text-indigo-900 dark:text-indigo-300">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600 dark:text-indigo-400" />
        <p className="leading-relaxed">
          <strong>Illustrative Demo Score:</strong> Similarity metrics reflect client-side keyword and attribute alignment for demonstration purposes. They are not legal proof of ownership. Physical custody is transferred only after verification at the campus security kiosk.
        </p>
      </div>

      {/* Match Cards List */}
      {filteredPairs.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Active Match Recommendations
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            All current lost items and turn-ins have either been reviewed, claimed, or have insufficient attribute overlap.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPairs.map((pair) => (
            <div
              key={pair.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-6"
            >
              {/* Match Score & Recommendation Explanation Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex flex-col items-center justify-center shadow-md shrink-0">
                    <span className="text-sm font-black leading-none">{pair.score}%</span>
                    <span className="text-[9px] font-bold uppercase text-white/80">Match</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Algorithmic Suggestion
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                        Confidence {pair.score >= 90 ? 'High' : 'Moderate'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {pair.reason}
                    </p>
                  </div>
                </div>

                {/* Dismiss button */}
                <button
                  type="button"
                  onClick={() => setDismissTargetPair(pair)}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 self-start sm:self-center"
                >
                  <X className="w-3.5 h-3.5" />
                  Dismiss
                </button>
              </div>

              {/* Side-by-Side Comparison Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                {/* Visual Connector Dot */}
                <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-indigo-600 text-white items-center justify-center shadow-lg font-bold text-xs">
                  VS
                </div>

                {/* LEFT: Lost Report */}
                <div className="p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge type="lost" label="LOST REPORT" size="sm" />
                    <span className="text-xs font-mono text-slate-400">#{pair.lost.id}</span>
                  </div>

                  <div className="flex gap-3">
                    <img
                      src={pair.lost.images?.[0] || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80'}
                      alt={pair.lost.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        to={`/items/${pair.lost.id}`}
                        className="text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 line-clamp-1"
                      >
                        {pair.lost.title}
                      </Link>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">
                        {pair.lost.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-rose-200/40 dark:border-rose-900/40 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{pair.lost.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(pair.lost.date)}</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Found Report */}
                <div className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge type="found" label="FOUND REPORT" size="sm" />
                    <span className="text-xs font-mono text-slate-400">#{pair.found.id}</span>
                  </div>

                  <div className="flex gap-3">
                    <img
                      src={pair.found.images?.[0] || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80'}
                      alt={pair.found.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        to={`/items/${pair.found.id}`}
                        className="text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 line-clamp-1"
                      >
                        {pair.found.title}
                      </Link>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">
                        {pair.found.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-indigo-200/40 dark:border-indigo-900/40 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{pair.found.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(pair.found.date)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shared Keyword Highlights & Action Buttons Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Shared Keywords */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                  <span className="font-semibold">Shared Clues:</span>
                  {pair.sharedKeywords.length > 0 ? (
                    pair.sharedKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300 font-medium"
                      >
                        #{kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">Category & Location Proximity</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5">
                  <Link to={`/items/${pair.found.id}`}>
                    <Button variant="outline" size="sm">
                      Inspect Found Item
                    </Button>
                  </Link>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={ShieldCheck}
                    onClick={() => setClaimTargetItem(pair.found)}
                  >
                    Submit Ownership Claim
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Claim Modal Instance */}
      {claimTargetItem && (
        <ClaimModal
          isOpen={!!claimTargetItem}
          onClose={() => setClaimTargetItem(null)}
          item={claimTargetItem}
        />
      )}

      {/* Dismiss Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!dismissTargetPair}
        onClose={() => setDismissTargetPair(null)}
        onConfirm={handleDismissConfirm}
        title="Dismiss Match Suggestion?"
        message="This pair will no longer appear in your smart matching feed. You can still manually view both items in the Marketplace."
        confirmLabel="Dismiss Suggestion"
      />
    </div>
  );
}
