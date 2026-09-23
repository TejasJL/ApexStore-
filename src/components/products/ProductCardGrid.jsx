/**
 * @file ProductCardGrid.jsx
 * Responsive card grid layout for mobile screens and grid view toggle.
 */

import React from 'react';
import { ImageWithFallback } from '../common/ImageWithFallback.jsx';
import { RatingStars } from '../common/RatingStars.jsx';
import { formatCurrency, formatCategory, getStockStatus } from '../../utils/formatters.js';
import { Edit2, Trash2, Eye } from 'lucide-react';

export const ProductCardGrid = ({
  products = [],
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => {
        const stockInfo = getStockStatus(product.stock);

        return (
          <div
            key={product.id}
            onClick={() => onViewProduct(product.id)}
            className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/15 hover:border-indigo-400/70 dark:hover:border-indigo-500/60 transition-all duration-200 cursor-pointer"
          >
            <div>
              {/* Product Thumbnail - Studio Square Frame with Contain */}
              <div className="relative mb-3 rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
                <ImageWithFallback
                  src={product.thumbnail || (product.images && product.images[0])}
                  alt={product.title}
                  aspectRatio="square"
                  fit="contain"
                  padding="p-3"
                />

                {/* Discount Badge */}
                {product.discountPercentage > 0 && (
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-bold font-mono tracking-tight shadow-md">
                    {Math.round(product.discountPercentage)}% OFF
                  </div>
                )}

                {/* Stock Indicator Dot */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs text-[10px] font-mono border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <span className={`w-2 h-2 rounded-full ${stockInfo.dotColor} animate-pulse`} />
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">
                    {product.stock} left
                  </span>
                </div>
              </div>

              {/* Title & Category */}
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {formatCategory(product.category)}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  ID #{product.id}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                {product.title}
              </h4>

              {product.brand && (
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                  <span>By</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {product.brand}
                  </span>
                </div>
              )}

              {/* Rating */}
              <div className="mt-2.5">
                <RatingStars rating={product.rating} size="xs" />
              </div>
            </div>

            {/* Bottom: Price and Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="font-mono text-base font-extrabold tabular-nums text-slate-900 dark:text-white">
                  {formatCurrency(product.price)}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Free Pan-India Delivery
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className="flex items-center gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => onViewProduct(product.id)}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors cursor-pointer"
                  title="View Details"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onEditProduct(product)}
                  className="p-1.5 text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/60 rounded-lg transition-colors cursor-pointer"
                  title="Edit Product"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteProduct(product)}
                  className="p-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors cursor-pointer"
                  title="Delete Product"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
