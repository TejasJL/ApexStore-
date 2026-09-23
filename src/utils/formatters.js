/**
 * @file formatters.js
 * Utility formatting helpers for Indian Rupee currency (₹), numbers, categories, dates, and stock indicators.
 */

import { formatIndianRupee, formatIndianCompact, toIndianPrice } from './indianCatalog.js';

export { formatIndianCompact, toIndianPrice };

/**
 * Formats a numeric value into Indian Rupee currency format (₹XX,XXX)
 * Example: 1499 -> "₹1,499", 125000 -> "₹1,25,000"
 * @param {number} value
 * @returns {string}
 */
export const formatCurrency = (value) => {
  return formatIndianRupee(value);
};

/**
 * Transforms kebab-case or raw category slugs to title-cased readable text
 * @param {string} slug
 * @returns {string}
 */
export const formatCategory = (slug) => {
  if (!slug) return 'All Categories';
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Formats ISO date string into human readable date
 * @param {string} isoString
 * @returns {string}
 */
export const formatDate = (isoString) => {
  if (!isoString) return 'Recent';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return 'Recent';
  }
};

/**
 * Computes human readable label, color accents, and dot indicator for inventory levels
 * @param {number} stock
 * @returns {{ label: string; className: string; dotColor: string; status: 'out' | 'low' | 'in' }}
 */
export const getStockStatus = (stock) => {
  if (stock === undefined || stock === null || stock <= 0) {
    return {
      label: 'Out of Stock',
      className: 'text-rose-700 bg-rose-50/80 border-rose-200/80 dark:bg-rose-950/40 dark:border-rose-900/60 dark:text-rose-300',
      dotColor: 'bg-rose-500',
      status: 'out',
    };
  }

  if (stock <= 10) {
    return {
      label: `Low Stock (${stock})`,
      className: 'text-amber-700 bg-amber-50/80 border-amber-200/80 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-300',
      dotColor: 'bg-amber-500',
      status: 'low',
    };
  }

  return {
    label: `In Stock (${stock})`,
    className: 'text-emerald-700 bg-emerald-50/80 border-emerald-200/80 dark:bg-emerald-950/40 dark:border-emerald-900/60 dark:text-emerald-300',
    dotColor: 'bg-emerald-500',
    status: 'in',
  };
};
