/**
 * @file Header.jsx
 * Top bar contract implementation:
 * - Breadcrumbs / Context on the left
 * - Global status / search in the center
 * - Theme toggle, documentation modal trigger, and user profile on the right.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getIndianProfile } from '../../utils/indianCatalog.js';
import {
  Package,
  LogOut,
  Moon,
  Sun,
  BookOpen,
  ChevronRight,
  User,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';

export const Header = ({
  currentProductId,
  onOpenDocs,
  onResetToCatalog,
  mutationsCount = 0,
}) => {
  const { user, logout } = useAuth();
  const indianProfile = getIndianProfile(user?.username);
  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : (indianProfile?.displayName || user?.username || 'Catalog Administrator');
  const displayRole = user?.role || indianProfile?.role || 'Catalog Administrator';
  const displayLocation = indianProfile?.location || 'Admin Console';
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('apex_theme');
      if (saved) return saved === 'dark';
      return (
        document.documentElement.classList.contains('dark') ||
        window.matchMedia?.('(prefers-color-scheme: dark)').matches ||
        true // default to sleek dark dashboard
      );
    }
    return true;
  });

  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Apply dark class to html element reactively
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('apex_theme', next ? 'dark' : 'light');
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Zone: Breadcrumb / Workspace Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onResetToCatalog}
            className="flex items-center gap-2 text-left group focus:outline-none"
            aria-label="ApexStore Home"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:bg-indigo-700 transition-colors">
              <Package className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                ApexStore
              </span>
              <span className="block text-[10px] text-slate-400 font-mono">
                Product Admin Dashboard
              </span>
            </div>
          </button>

          {/* Breadcrumb Trail */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium ml-2 pl-3 border-l border-slate-200 dark:border-slate-800 truncate">
            <button
              onClick={onResetToCatalog}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${
                !currentProductId ? 'text-slate-900 dark:text-white font-semibold' : ''
              }`}
            >
              Inventory Catalog
            </button>

            {currentProductId && (
              <>
                <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <span className="text-slate-900 dark:text-white font-semibold truncate font-mono">
                  Product #{currentProductId}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right Zone: Controls & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Local Mutations Counter Badge */}
          {mutationsCount > 0 && (
            <div
              title={`${mutationsCount} local product mutation(s) active in session`}
              className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/60 font-mono"
            >
              <SlidersHorizontal className="w-3 h-3 text-amber-500" />
              <span>{mutationsCount} Session Overlays</span>
            </div>
          )}

          {/* Architecture / Assignment Docs Trigger */}
          <button
            onClick={onOpenDocs}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/60 dark:border-indigo-800/60 transition-colors cursor-pointer"
            title="View Assignment Architecture & Implementation Documentation"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Architecture & Docs</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle visual theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
              aria-expanded={isUserMenuOpen}
            >
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.firstName || 'User'}
                  className="w-7 h-7 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                  {user?.firstName?.charAt(0) || <User className="w-4 h-4" />}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                  {displayName}
                </div>
                <div className="text-[10px] text-slate-400 leading-tight font-mono">
                  {displayRole}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {displayName}
                  </div>
                  <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                    {displayRole} · {displayLocation}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                    @{user?.username || 'user'} · {user?.email || 'admin@apexstore.in'}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onOpenDocs();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-left transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  Documentation & Rules
                </button>

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-left transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
