import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'md', to = '/', showText = true, className = '' }) {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const icon = (
    <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses[size]} rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25`}>
      {/* Custom combined SVG: Location pin + search magnifying glass */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5/8 h-5/8"
      >
        {/* Map pin perimeter */}
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        {/* Search aperture inside the pin */}
        <circle cx="12" cy="9" r="2.5" strokeWidth="2" />
        <path d="M13.8 10.8L15.5 12.5" strokeWidth="2" />
      </svg>
      {/* Subtle pulse badge ring */}
      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900" />
    </div>
  );

  const content = (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {icon}
      {showText && (
        <div className="flex flex-col text-left">
          <div className={`flex items-center gap-1.5 font-extrabold ${textSizes[size]}`}>
            <span className="text-slate-900 dark:text-white">Find</span>
            <span className="text-indigo-600 dark:text-indigo-400">It</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 -mt-1">
            Campus Lost & Found
          </span>
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
