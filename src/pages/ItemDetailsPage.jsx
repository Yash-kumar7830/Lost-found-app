import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import ImageGallery from '../components/items/ImageGallery';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import ClaimModal from '../components/claims/ClaimModal';
import ItemCard from '../components/items/ItemCard';
import {
  MapPin,
  Calendar,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Share2,
  DollarSign
} from 'lucide-react';
import { formatDate } from '../utils/helpers';
import { useToast } from '../context/ToastContext';

export default function ItemDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items } = useData();
  const toast = useToast();

  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  const item = items.find((i) => i.id === id);

  if (!item) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Item Report Not Found
        </h2>
        <p className="text-xs text-slate-500">
          The requested campus lost & found record #{id} may have been withdrawn or resolved.
        </p>
        <Button variant="primary" size="md" onClick={() => navigate('/items')}>
          Return to Marketplace
        </Button>
      </div>
    );
  }

  const isLost = item.type === 'lost';
  const isFound = item.type === 'found';
  const isMatch = item.status === 'potential_match';
  const isResolved = item.status === 'resolved';

  // Find paired match item if present
  const matchedItem = item.potentialMatchId
    ? items.find((i) => i.id === item.potentialMatchId)
    : null;

  // Related items in the same category
  const relatedItems = items
    .filter((i) => i.id !== item.id && i.category === item.category)
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link Copied', 'Item URL copied to clipboard for campus sharing.');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Back button & Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Share2}
            onClick={handleShare}
          >
            Share Notice
          </Button>
          {isFound && !isResolved && (
            <Button
              variant="gradient"
              size="sm"
              icon={ShieldCheck}
              onClick={() => setIsClaimModalOpen(true)}
            >
              Claim This Item
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Gallery & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-5">
          <ImageGallery images={item.images} title={item.title} />

          {/* Location Map Preview Panel */}
          <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-500" />
                <span>Campus Location Coordinates</span>
              </span>
              <span className="text-slate-400 text-[10px]">Zone Map</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
              <div className="font-semibold text-slate-900 dark:text-white">
                {item.location}
              </div>
              {item.roomDetails && (
                <div className="text-slate-500 dark:text-slate-400">
                  Room/Desk: {item.roomDetails}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Information & Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header & Badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge type={item.type} size="md" />
              <Badge type="category" label={item.category} size="md" />
              <Badge type={item.status} size="md" />
              <span className="text-xs font-mono font-bold text-slate-400 ml-auto">
                #{item.id}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {item.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                Reported {formatDate(item.date)} {item.time ? `at ${item.time}` : ''}
              </span>
              {item.estimatedValue && (
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  Est. Value: {item.estimatedValue}
                </span>
              )}
            </div>
          </div>

          {/* Potential Match Highlight Alert */}
          {isMatch && matchedItem && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-violet-500/10 border border-violet-200 dark:border-violet-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-violet-700 dark:text-violet-300">
                  <Sparkles className="w-4 h-4 text-violet-600 animate-pulse" />
                  <span>High-Confidence Algorithm Match Detected!</span>
                </div>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-violet-600 text-white">
                  {item.matchScore || 94}% Similarity
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.matchReason || 'Matches category, device tags, and library location radius.'}
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-semibold text-slate-500">
                  Paired Report: #{matchedItem.id} ({matchedItem.title})
                </span>
                <Link
                  to={`/items/${matchedItem.id}`}
                  className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline"
                >
                  View Pair →
                </Link>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Detailed Description
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              {item.description}
            </p>
          </div>

          {/* Distinguishing Characteristics */}
          {item.distinguishingMarks && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Distinguishing Marks & Unique Notes
              </h3>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <p>{item.distinguishingMarks}</p>
              </div>
            </div>
          )}

          {/* Privacy-Preserving Reporter Information */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider">
                Reported By (Privacy-Preserved Profile)
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> Identity Verified
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-sm flex items-center justify-center shrink-0">
                {item.reportedBy?.name ? item.reportedBy.name.slice(0, 2).toUpperCase() : 'ST'}
              </div>
              <div className="text-xs min-w-0">
                <div className="font-bold text-slate-900 dark:text-white">
                  {item.reportedBy?.name || 'Verified Student'}
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  {item.reportedBy?.department} • Badge: {item.reportedBy?.idBadge}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <span>🔒 Student phone & email protected. Handover coordinated via Campus Security.</span>
            </div>
          </div>

          {/* Action Trigger Card */}
          <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {isFound
                  ? 'Is this your lost belonging?'
                  : 'Did you find an item matching this description?'}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {isFound
                  ? 'Answer ownership questions to initiate verification.'
                  : 'Report your turn-in at the security desk or contact campus dispatch.'}
              </p>
            </div>

            {isFound && !isResolved && (
              <Button
                variant="primary"
                size="md"
                icon={ShieldCheck}
                onClick={() => setIsClaimModalOpen(true)}
                className="w-full sm:w-auto"
              >
                Claim This Item
              </Button>
            )}

            {isLost && (
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate('/report/found')}
                className="w-full sm:w-auto"
              >
                I Found This Item
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Related Items Section */}
      {relatedItems.length > 0 && (
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Related {item.category} Reports
            </h3>
            <Link
              to={`/items?category=${encodeURIComponent(item.category)}`}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View category →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedItems.map((rItem) => (
              <ItemCard key={rItem.id} item={rItem} viewMode="grid" />
            ))}
          </div>
        </div>
      )}

      {/* Claim Modal Instance */}
      <ClaimModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        item={item}
      />
    </div>
  );
}
