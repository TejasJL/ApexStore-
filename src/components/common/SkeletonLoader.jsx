/**
 * @file SkeletonLoader.jsx
 * Geometry-accurate skeleton placeholders matching data tables and cards (geometry delta <= 2px).
 */

import React from 'react';

export const TableRowSkeleton = ({ rows = 10 }) => {
  return (
    <>
      {[...Array(rows)].map((_, i) => (
        <tr
          key={i}
          className="border-b border-slate-100 dark:border-slate-800/80 animate-pulse"
        >
          {/* Thumbnail */}
          <td className="py-3 px-4 w-16">
            <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-800" />
          </td>
          {/* Title & Brand */}
          <td className="py-3 px-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-1.5" />
            <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-1/3" />
          </td>
          {/* Category */}
          <td className="py-3 px-4 hidden sm:table-cell">
            <div className="h-5 bg-slate-100 dark:bg-slate-800/70 rounded w-20" />
          </td>
          {/* Price */}
          <td className="py-3 px-4 text-right">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-14 ml-auto" />
          </td>
          {/* Rating */}
          <td className="py-3 px-4 hidden md:table-cell">
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-24" />
          </td>
          {/* Stock */}
          <td className="py-3 px-4 hidden lg:table-cell">
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-20" />
          </td>
          {/* Actions */}
          <td className="py-3 px-4 text-right">
            <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-20 ml-auto" />
          </td>
        </tr>
      ))}
    </>
  );
};

export const CardGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 animate-pulse"
        >
          <div className="aspect-[4/3] rounded-lg bg-slate-200 dark:bg-slate-800 mb-3" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2" />
          <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-1/2 mb-4" />
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-16" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-12" />
          </div>
        </div>
      ))}
    </div>
  );
};
