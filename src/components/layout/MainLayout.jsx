/**
 * @file MainLayout.jsx
 * Application layout shell containing the top header and main responsive viewport.
 */

import React from 'react';
import { Header } from './Header.jsx';

export const MainLayout = ({
  children,
  currentProductId,
  onOpenDocs,
  onResetToCatalog,
  mutationsCount = 0,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      <Header
        currentProductId={currentProductId}
        onOpenDocs={onOpenDocs}
        onResetToCatalog={onResetToCatalog}
        mutationsCount={mutationsCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      <footer className="border-t border-slate-200/80 dark:border-slate-800 py-4 bg-white/50 dark:bg-slate-900/50 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">ApexStore</span>
            <span>·</span>
            <span>Product Management Admin</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>© {new Date().getFullYear()} All rights reserved</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
