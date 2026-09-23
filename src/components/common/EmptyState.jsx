/**
 * @file EmptyState.jsx
 * Visual empty state component with reset filters and create actions.
 */

import React from 'react';
import { PackageSearch, Plus, RotateCcw } from 'lucide-react';

export const EmptyState = ({
  title = 'No products found',
  description = 'No catalog records match your active search terms or category filters.',
  onReset,
  onCreate,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 my-6">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 ring-8 ring-indigo-50/50 dark:ring-indigo-950/30">
        <PackageSearch className="w-7 h-7 stroke-[1.75]" />
      </div>

      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onReset && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear Active Filters
          </button>
        )}
        {onCreate && (
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Product
          </button>
        )}
      </div>
    </div>
  );
};
