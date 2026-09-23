/**
 * @file ProductFiltersBar.jsx
 * Control toolbar for search, category filtering, column sorting, view switcher, and adding products.
 */

import React, { useRef, useEffect } from 'react';
import {
  Search,
  X,
  Filter,
  ArrowUpDown,
  Plus,
  LayoutGrid,
  List,
  RotateCcw,
} from 'lucide-react';
import { formatCategory } from '../../utils/formatters.js';

export const ProductFiltersBar = ({
  searchInput,
  onSearchChange,
  category,
  onCategoryChange,
  categories = [],
  sortBy,
  onSortByChange,
  order,
  onOrderToggle,
  limit,
  onLimitChange,
  viewMode = 'table',
  onViewModeChange,
  onOpenCreateModal,
  onResetFilters,
  hasActiveFilters,
  totalResults = 0,
}) => {
  const searchInputRef = useRef(null);

  // Keyboard shortcut: Press '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="space-y-3 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left Side: Search Bar & Category Dropdown */}
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Input with Debounce & Shortcut badge */}
          <div className="relative flex-1 min-w-[240px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchInput}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products by title, brand, category, or SKU..."
              className="w-full pl-9 pr-14 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all font-mono"
            />
            {searchInput ? (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                  /
                </kbd>
              </div>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="relative min-w-[170px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Filter className="w-3.5 h-3.5" />
            </div>
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full pl-8 pr-8 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name || formatCategory(cat.slug)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Side: Sorting, Limit, View Switcher & Create Action */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sort By Dropdown */}
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="py-2 pl-3 pr-2 text-xs bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              aria-label="Sort products by column"
            >
              <option value="">Default Order</option>
              <option value="price">Price (₹)</option>
              <option value="rating">Rating</option>
              <option value="title">Title</option>
            </select>

            {sortBy && (
              <button
                type="button"
                onClick={onOrderToggle}
                className="px-2.5 py-2 border-l border-slate-200 dark:border-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                title={`Sort ${order === 'desc' ? 'Descending' : 'Ascending'}`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Rows Per Page Selector (Assignment rule: 10, 20, 50) */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-[11px] text-slate-400 pl-1">Rows:</span>
            {[10, 20, 50].map((num) => (
              <button
                key={num}
                onClick={() => onLimitChange(num)}
                className={`px-2 py-1 text-xs rounded-lg font-mono tabular-nums transition-colors cursor-pointer ${
                  limit === num
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {/* View Switcher: Table vs Grid */}
          <div className="hidden sm:flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5">
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
              title="Table View (High density)"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Reset Filters Shortcut Button */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="p-2 text-slate-400 hover:text-rose-500 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Primary Action: Add Product */}
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-95 shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Product</span>
          </button>
        </div>
      </div>
    </div>
  );
};
