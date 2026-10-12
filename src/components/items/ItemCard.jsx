import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Sparkles, ArrowRight, Tag } from 'lucide-react';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/helpers';

export default function ItemCard({
  item,
  viewMode = 'grid',
  onClaim,
}) {
  const isLost = item.type === 'lost';
  const isMatch = item.status === 'potential_match';
  const isResolved = item.status === 'resolved';

  const defaultImage = isLost
    ? 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'
    : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';

  const thumbnail = item.images && item.images.length > 0 ? item.images[0] : defaultImage;

  if (viewMode === 'list') {
    return (
      <div className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-xs hover:shadow-md transition-all duration-200 gap-4">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
            <img
              src={thumbnail}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute top-1.5 left-1.5">
              <Badge type={item.type} size="sm" />
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge type="category" label={item.category} size="sm" />
              {isMatch && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                  <Sparkles className="w-3 h-3 text-violet-500" />
                  {item.matchScore ? `${item.matchScore}% Match` : 'Potential Match'}
                </span>
              )}
              {isResolved && <Badge type="resolved" label="Returned / Closed" size="sm" />}
            </div>

            <Link
              to={`/items/${item.id}`}
              className="block text-base font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate"
            >
              {item.title}
            </Link>

            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
              {item.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                {item.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {formatDate(item.date)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
          {!isLost && !isResolved && onClaim && (
            <button
              onClick={() => onClaim(item)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
            >
              Claim Item
            </button>
          )}
          <Link
            to={`/items/${item.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // Grid Card View
  return (
    <div className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Thumbnail with overlay badges */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={thumbnail}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Type badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge type={item.type} size="md" />
        </div>

        {/* Potential Match Banner */}
        {isMatch && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-violet-600/90 text-white backdrop-blur-md shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{item.matchScore ? `${item.matchScore}% Match` : 'Match Found'}</span>
          </div>
        )}

        {/* Resolved Banner */}
        {isResolved && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-600 text-white shadow-md">
              Reunited with Owner
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 font-medium text-indigo-600 dark:text-indigo-400">
              <Tag className="w-3 h-3" />
              {item.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formatDate(item.date)}
            </span>
          </div>

          <Link
            to={`/items/${item.id}`}
            className="block text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1"
          >
            {item.title}
          </Link>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Footer with location & actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
            <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {!isLost && !isResolved && onClaim && (
              <button
                type="button"
                onClick={() => onClaim(item)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
              >
                Claim
              </button>
            )}
            <Link
              to={`/items/${item.id}`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              title="View item details"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
