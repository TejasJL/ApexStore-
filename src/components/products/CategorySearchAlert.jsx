/**
 * @file CategorySearchAlert.jsx
 * Explanatory banner displayed when both a search query and a category filter are active.
 * Transparently explains the hybrid client-side filtering mechanism to solve DummyJSON's limitation.
 */

import React from 'react';
import { Info, X } from 'lucide-react';
import { formatCategory } from '../../utils/formatters.js';

export const CategorySearchAlert = ({
  searchQuery,
  category,
  onClearCategory,
  onClearSearch,
}) => {
  if (!searchQuery || !category || category === 'all') return null;

  return (
    <div className="mb-4 p-3.5 rounded-xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/70 dark:bg-sky-950/30 text-sky-900 dark:text-sky-200 text-xs animate-in fade-in duration-200">
      <div className="flex items-start gap-2.5">
        <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-semibold mb-0.5">
            Hybrid Filtering Active: &ldquo;{searchQuery}&rdquo; in {formatCategory(category)}
          </div>
          <p className="text-[11px] text-sky-800/80 dark:text-sky-300/80 leading-relaxed">
            DummyJSON API separates search (<code className="font-mono">/products/search</code>) and category endpoints (<code className="font-mono">/products/category</code>). ApexStore seamlessly queries search results and applies an in-memory category filter with local mutations so you get instant, accurate results.
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onClearCategory}
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-800 text-[10px] font-medium hover:bg-sky-50 text-sky-700 dark:text-sky-300 transition-colors cursor-pointer"
            title="Search all categories instead"
          >
            All Categories
          </button>
          <button
            onClick={onClearSearch}
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-800 text-[10px] font-medium hover:bg-sky-50 text-sky-700 dark:text-sky-300 transition-colors cursor-pointer"
            title="Clear search keyword"
          >
            Clear Search
          </button>
        </div>
      </div>
    </div>
  );
};
