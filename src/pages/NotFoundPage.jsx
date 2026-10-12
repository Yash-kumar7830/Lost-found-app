import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { Compass, Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      {/* Visual illustration icon */}
      <div className="relative">
        <div className="w-24 h-24 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-lg">
          <Compass className="w-12 h-12 animate-spin-slow" />
        </div>
        <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-rose-500 text-white font-black text-xs shadow-md">
          404
        </div>
      </div>

      <div className="max-w-md space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          This Page Seems Lost
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          We searched all campus lecture halls, dorms, and security kiosks, but couldn't find the URL you requested.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="outline"
          size="md"
          icon={ArrowLeft}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
        <Link to="/dashboard">
          <Button variant="primary" size="md" icon={Home}>
            Student Dashboard
          </Button>
        </Link>
        <Link to="/items">
          <Button variant="secondary" size="md" icon={Search}>
            Browse Marketplace
          </Button>
        </Link>
      </div>
    </div>
  );
}
