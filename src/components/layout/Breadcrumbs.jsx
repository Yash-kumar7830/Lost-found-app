import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNameMap = {
  dashboard: 'Dashboard',
  items: 'Marketplace',
  report: 'Report Item',
  lost: 'Report Lost',
  found: 'Report Found',
  matches: 'Smart Matches',
  claims: 'Claims Tracker',
  notifications: 'Notifications',
  'my-reports': 'My Reports',
  profile: 'Student Profile',
  admin: 'Admin Desk',
};

export default function Breadcrumbs({ customTitle }) {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0 || location.pathname === '/') return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex items-center text-xs text-slate-500 dark:text-slate-400">
      <Link
        to="/dashboard"
        className="flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <Home className="w-3.5 h-3.5 mr-1" />
        <span>Home</span>
      </Link>

      {pathnames.map((segment, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const name =
          isLast && customTitle
            ? customTitle
            : routeNameMap[segment] || segment.replace(/-/g, ' ');

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-300 dark:text-slate-600 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[200px] sm:max-w-xs">
                {name}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors capitalize"
              >
                {name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
