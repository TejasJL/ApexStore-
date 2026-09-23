/**
 * @file ProductTable.jsx
 * High-density desktop data table view adhering strictly to:
 * - 36px–44px compact row heights
 * - Tabular figures font-mono on all currency, ratings, and quantities
 * - Interactive sort headers with active indicators
 * - Zero-pill metadata styling
 * - Smooth row actions for details, editing, and deletion.
 */

import React from 'react';
import { ImageWithFallback } from '../common/ImageWithFallback.jsx';
import { RatingStars } from '../common/RatingStars.jsx';
import { formatCurrency, formatCategory, getStockStatus } from '../../utils/formatters.js';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Eye,
  ExternalLink,
} from 'lucide-react';

export const ProductTable = ({
  products = [],
  sortBy = '',
  order = 'asc',
  onSortChange,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
}) => {
  const renderSortIndicator = (field) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-400" />;
    }
    return order === 'desc' ? (
      <ArrowDown className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
    ) : (
      <ArrowUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none">
              <th scope="col" className="py-3 px-4 w-16 text-center">
                Image
              </th>

              {/* Title Column - Sortable */}
              <th scope="col" className="py-3 px-4">
                <button
                  type="button"
                  onClick={() => onSortChange('title')}
                  className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors group cursor-pointer"
                >
                  <span>Title & Brand</span>
                  {renderSortIndicator('title')}
                </button>
              </th>

              {/* Category Column */}
              <th scope="col" className="py-3 px-4 hidden sm:table-cell">
                Category
              </th>

              {/* Price Column - Sortable */}
              <th scope="col" className="py-3 px-4 text-right">
                <button
                  type="button"
                  onClick={() => onSortChange('price')}
                  className="flex items-center justify-end gap-1.5 ml-auto hover:text-slate-900 dark:hover:text-white transition-colors group cursor-pointer"
                >
                  <span>Price (₹)</span>
                  {renderSortIndicator('price')}
                </button>
              </th>

              {/* Rating Column - Sortable */}
              <th scope="col" className="py-3 px-4 hidden md:table-cell">
                <button
                  type="button"
                  onClick={() => onSortChange('rating')}
                  className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors group cursor-pointer"
                >
                  <span>Rating</span>
                  {renderSortIndicator('rating')}
                </button>
              </th>

              {/* Stock Status Column */}
              <th scope="col" className="py-3 px-4 hidden lg:table-cell">
                Inventory
              </th>

              {/* Actions Column */}
              <th scope="col" className="py-3 px-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {products.map((product) => {
              const stockInfo = getStockStatus(product.stock);

              return (
                <tr
                  key={product.id}
                  onClick={() => onViewProduct(product.id)}
                  className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  {/* Thumbnail */}
                  <td className="py-2.5 px-4 w-20" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onViewProduct(product.id)}
                      className="block w-14 h-14 shrink-0 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer shadow-2xs hover:border-indigo-400 dark:hover:border-indigo-500 transition-all hover:scale-105"
                      title={`View ${product.title}`}
                    >
                      <ImageWithFallback
                        src={product.thumbnail || (product.images && product.images[0])}
                        alt={product.title}
                        aspectRatio="square"
                        fit="contain"
                        padding="p-1"
                      />
                    </button>
                  </td>

                  {/* Title & Brand */}
                  <td className="py-2.5 px-4 max-w-xs sm:max-w-sm">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                      <span>{product.title}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity text-slate-400" />
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5 flex items-center gap-2">
                      <span className="font-mono text-slate-500">#{product.id}</span>
                      {product.brand && (
                        <>
                          <span>·</span>
                          <span>{product.brand}</span>
                        </>
                      )}
                      {product.discountPercentage > 0 && (
                        <>
                          <span>·</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                            -{Math.round(product.discountPercentage)}% OFF
                          </span>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-2.5 px-4 hidden sm:table-cell">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">
                      {formatCategory(product.category)}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-2.5 px-4 text-right">
                    <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                      {formatCurrency(product.price)}
                    </span>
                  </td>

                  {/* Rating */}
                  <td className="py-2.5 px-4 hidden md:table-cell">
                    <RatingStars rating={product.rating} size="xs" />
                  </td>

                  {/* Stock Inventory (Zero-Pill Discipline) */}
                  <td className="py-2.5 px-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${stockInfo.dotColor}`} />
                      <span className="font-mono tabular-nums text-xs text-slate-700 dark:text-slate-300">
                        {product.stock} units
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td
                    className="py-2.5 px-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onViewProduct(product.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="View Product Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditProduct(product)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteProduct(product)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
