import React from 'react';

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
      <div className="w-full h-48 skeleton-shimmer" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <div className="w-20 h-5 rounded-full skeleton-shimmer" />
          <div className="w-16 h-4 rounded-full skeleton-shimmer" />
        </div>
        <div className="w-4/5 h-6 rounded-lg skeleton-shimmer" />
        <div className="w-full h-10 rounded-lg skeleton-shimmer" />
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="w-24 h-4 rounded-md skeleton-shimmer" />
          <div className="w-20 h-8 rounded-xl skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function MetricSkeleton() {
  return (
    <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between">
      <div className="space-y-2">
        <div className="w-24 h-4 rounded-md skeleton-shimmer" />
        <div className="w-16 h-8 rounded-lg skeleton-shimmer" />
      </div>
      <div className="w-12 h-12 rounded-2xl skeleton-shimmer" />
    </div>
  );
}

export default function SkeletonLoader({ type = 'card', count = 3 }) {
  const skeletons = Array.from({ length: count });

  if (type === 'metric') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {skeletons.map((_, i) => (
          <MetricSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skeletons.map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
