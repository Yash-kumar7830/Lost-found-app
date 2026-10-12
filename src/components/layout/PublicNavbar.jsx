import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, ArrowRight, ShieldCheck } from 'lucide-react';
import Logo from '../common/Logo';
import Button from '../common/Button';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function PublicNavbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Browse Items', to: '/items' },
    { name: 'How It Works', to: '/#how-it-works' },
    { name: 'Smart Matching', to: '/matches' },
    { name: 'Campus Safety', to: '/#safety' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <Logo size="md" />

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Public navigation">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA & Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>

          {isAuthenticated ? (
            <Button
              variant="gradient"
              size="md"
              onClick={() => navigate('/dashboard')}
              icon={ArrowRight}
              iconPosition="right"
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="md"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
              <Button
                variant="gradient"
                size="md"
                onClick={() => navigate('/login')}
                icon={ShieldCheck}
              >
                Verify Student ID
              </Button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 py-1"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
            <Button
              variant="outline"
              size="md"
              className="w-full"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/login');
              }}
            >
              Sign In
            </Button>
            <Button
              variant="gradient"
              size="md"
              className="w-full"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/dashboard');
              }}
            >
              Open Dashboard
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
