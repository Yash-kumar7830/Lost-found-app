import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import { ShieldCheck, PhoneCall, Mail, MapPin } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Security */}
          <div className="md:col-span-1 space-y-4">
            <Logo size="md" />
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              FindIt is the official campus lost and found item management system. Student-verified, privacy-conscious, and powered by smart recovery matching.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Campus Security Certified Network</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/items" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Browse Found Items
                </Link>
              </li>
              <li>
                <Link to="/report/lost" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Report a Lost Item
                </Link>
              </li>
              <li>
                <Link to="/report/found" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Turn in a Found Item
                </Link>
              </li>
              <li>
                <Link to="/matches" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Smart Match Engine
                </Link>
              </li>
              <li>
                <Link to="/claims" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Track Ownership Claims
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Campus Support & Security Desk */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Security Help Desks
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>Central Security Office: Admin Tower, Ground Floor</span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>24/7 Security Hotline: +91 011-2940-8000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-violet-500 shrink-0" />
                <span>lostandfound@campus.edu</span>
              </li>
              <li className="text-[11px] text-slate-500 pt-1">
                Locker Handover Hours: Mon – Sat, 9:00 AM – 6:30 PM
              </li>
            </ul>
          </div>

          {/* Col 4: Demo Notice */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
            <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 mb-2">
              Demonstration Platform
            </h4>
            <p className="text-[11px] text-indigo-800/80 dark:text-indigo-300/80 leading-relaxed">
              This web application represents a full-featured campus prototype ready for FastAPI integration. Displayed student metrics and cases are simulated sample data for testing.
            </p>
            <div className="mt-3">
              <Link
                to="/admin"
                className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                Access Admin Portal →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FindIt Campus Recovery System. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with precision for campus communities</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
