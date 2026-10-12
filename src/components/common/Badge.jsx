import React from 'react';
import { Sparkles, ShieldCheck, CheckCircle2, Clock, AlertTriangle, HelpCircle, PackageCheck } from 'lucide-react';

export default function Badge({
  type = 'default',
  label,
  children,
  size = 'md',
  className = '',
  icon = true,
}) {
  const displayLabel = label || children;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  let colorClasses = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  let IconComponent = null;

  switch (type) {
    case 'lost':
      colorClasses = 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/80 dark:border-rose-900/60 font-semibold';
      IconComponent = HelpCircle;
      break;
    case 'found':
      colorClasses = 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-900/60 font-semibold';
      IconComponent = PackageCheck;
      break;
    case 'potential_match':
      colorClasses = 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border-violet-200/80 dark:border-violet-900/60 font-semibold';
      IconComponent = Sparkles;
      break;
    case 'claim_pending':
      colorClasses = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/80 dark:border-amber-900/60 font-semibold';
      IconComponent = Clock;
      break;
    case 'resolved':
      colorClasses = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-900/60 font-semibold';
      IconComponent = CheckCircle2;
      break;
    case 'verified':
      colorClasses = 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-medium';
      IconComponent = ShieldCheck;
      break;
    case 'category':
      colorClasses = 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-200/80 dark:border-slate-700/80 font-medium';
      break;
    default:
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-xs transition-colors ${sizeClasses[size]} ${colorClasses} ${className}`}
    >
      {icon && IconComponent && <IconComponent className="w-3.5 h-3.5 shrink-0" />}
      <span>{displayLabel}</span>
    </span>
  );
}
