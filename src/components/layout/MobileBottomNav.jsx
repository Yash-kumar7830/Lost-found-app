import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Compass, PlusCircle, Sparkles, User } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function MobileBottomNav() {
  const { potentialMatchesCount } = useData();

  const links = [
    { name: 'Home', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Explore', to: '/items', icon: Compass },
    { name: 'Report', to: '/report/lost', icon: PlusCircle, isPrimary: true },
    { name: 'Matches', to: '/matches', icon: Sparkles, badge: potentialMatchesCount },
    { name: 'Profile', to: '/profile', icon: User },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-2 py-1.5 shadow-lg"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[11px] font-medium transition-colors ${
                link.isPrimary
                  ? 'text-white'
                  : isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`
            }
          >
            {link.isPrimary ? (
              <div className="w-10 h-10 -mt-5 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/30 text-white">
                <link.icon className="w-5 h-5" />
              </div>
            ) : (
              <>
                <link.icon className="w-5 h-5 shrink-0" />
                <span className="mt-0.5">{link.name}</span>
                {link.badge > 0 && (
                  <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-violet-500 ring-2 ring-white dark:ring-slate-900" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
