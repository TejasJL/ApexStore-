/**
 * @file CatalogStatsBar.jsx
 * High-density catalog KPI metrics banner providing live overview of
 * inventory capacity, stock health, category coverage, and race-condition delay status.
 */

import React from 'react';
import { Package, Layers, AlertCircle, IndianRupee, Zap } from 'lucide-react';
import { formatIndianCompact } from '../../utils/formatters.js';

export const CatalogStatsBar = ({
  totalProducts = 0,
  categoriesCount = 0,
  currentProducts = [],
  activeDelay = 0,
  onToggleDelay,
}) => {
  // Compute low stock items in current view
  const lowStockCount = currentProducts.filter(
    (p) => p.stock !== undefined && p.stock <= 10
  ).length;

  // Compute live inventory valuation in Indian Rupees (₹)
  const pageValuation = currentProducts.reduce(
    (acc, p) => acc + (Number(p.price) || 0) * (Number(p.stock) || 1),
    0
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
      {/* Metric 1: Total Catalog Items */}
      <div className="p-4 rounded-2xl border border-indigo-200/70 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50/60 via-white to-indigo-50/20 dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-900 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">Total Products</span>
          <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Package className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
          {totalProducts.toLocaleString('en-IN')}
        </div>
        <div className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80 font-medium mt-0.5">Active Catalog Items</div>
      </div>

      {/* Metric 2: Categories Coverage */}
      <div className="p-4 rounded-2xl border border-sky-200/70 dark:border-sky-900/50 bg-gradient-to-br from-sky-50/60 via-white to-sky-50/20 dark:from-sky-950/30 dark:via-slate-900 dark:to-slate-900 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">Categories</span>
          <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
          {categoriesCount || 24}
        </div>
        <div className="text-[10px] text-sky-600/80 dark:text-sky-400/80 font-medium mt-0.5">Active Departments</div>
      </div>

      {/* Metric 3: Low Stock Watchlist */}
      <div className="p-4 rounded-2xl border border-amber-200/70 dark:border-amber-900/50 bg-gradient-to-br from-amber-50/60 via-white to-amber-50/20 dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">Low Stock Watch</span>
          <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-black font-mono tabular-nums text-amber-600 dark:text-amber-400">
          {lowStockCount}
        </div>
        <div className="text-[10px] text-amber-700/80 dark:text-amber-300/80 font-medium mt-0.5">&le; 10 units in current view</div>
      </div>

      {/* Metric 4: Inventory Valuation (₹ INR) */}
      <div className="p-4 rounded-2xl border border-emerald-200/70 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50/60 via-white to-emerald-50/20 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Page Valuation</span>
          <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <IndianRupee className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-black font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
          {formatIndianCompact(pageValuation)}
        </div>
        <div className="text-[10px] text-emerald-700/80 dark:text-emerald-300/80 font-medium mt-0.5">Live stock worth (₹)</div>
      </div>

      {/* Metric 5: Interactive Race Condition Tester */}
      <div
        onClick={onToggleDelay}
        className={`col-span-2 lg:col-span-1 p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none group shadow-sm hover:shadow-md ${
          activeDelay > 0
            ? 'bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-orange-500/20 border-amber-400 dark:border-amber-600 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/50'
            : 'bg-gradient-to-br from-purple-50/60 via-white to-indigo-50/30 dark:from-purple-950/30 dark:via-slate-900 dark:to-slate-900 border-purple-200/70 dark:border-purple-900/50 hover:border-purple-400 dark:hover:border-purple-600'
        }`}
        title="Toggle simulated 2000ms network delay to test race condition resilience during search"
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">Race Shield</span>
          <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Zap
              className={`w-3.5 h-3.5 transition-colors ${
                activeDelay > 0 ? 'text-amber-500 fill-amber-500 animate-bounce' : 'text-purple-600 dark:text-purple-400'
              }`}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
            {activeDelay > 0 ? '2000ms' : '0ms'}
          </span>
          <span
            className={`text-[10px] px-2.5 py-0.5 rounded-lg font-mono font-bold shadow-2xs ${
              activeDelay > 0
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                : 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300'
            }`}
          >
            {activeDelay > 0 ? 'DELAY ON' : 'SIM DELAY'}
          </span>
        </div>
        <div className="text-[10px] text-purple-600/80 dark:text-purple-400/80 font-medium mt-0.5">
          {activeDelay > 0 ? 'AbortController active' : 'Click to test 2s delay'}
        </div>
      </div>
    </div>
  );
};
