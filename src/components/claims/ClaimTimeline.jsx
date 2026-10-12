import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function ClaimTimeline({ timeline = [] }) {
  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="space-y-4">
      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Review Timeline
      </h5>
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {timeline.map((step, idx) => {
          let dotColor = 'bg-slate-300 dark:bg-slate-700 text-slate-600';
          let textColor = 'text-slate-500 dark:text-slate-400';

          if (step.done) {
            dotColor = 'bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-950';
            textColor = 'text-slate-900 dark:text-white font-semibold';
          } else if (step.current) {
            dotColor = 'bg-amber-500 text-white ring-4 ring-amber-100 dark:ring-amber-950 animate-pulse';
            textColor = 'text-amber-700 dark:text-amber-300 font-semibold';
          } else if (step.failed) {
            dotColor = 'bg-rose-500 text-white ring-4 ring-rose-100 dark:ring-rose-950';
            textColor = 'text-rose-600 dark:text-rose-400 font-semibold';
          }

          return (
            <div key={idx} className="relative flex flex-col items-start gap-1">
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${dotColor}`}
              >
                {step.done ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : step.failed ? (
                  <AlertCircle className="w-3.5 h-3.5" />
                ) : (
                  <Clock className="w-3.5 h-3.5" />
                )}
              </div>
              <span className={`text-xs ${textColor}`}>{step.step}</span>
              <span className="text-[11px] text-slate-400">{step.timestamp}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
