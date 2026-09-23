/**
 * @file ProductSpotlightCarousel.jsx
 * Zero-dependency, pure React & Tailwind CSS inventory spotlight carousel.
 * 
 * Key Features:
 * - Built completely from first-principles (no Swiper, Slick, or external carousel libraries).
 * - Smooth CSS transitions with automatic 5-second auto-rotation.
 * - Auto-pauses smoothly on hover (WCAG 2.1 Accessible Interaction).
 * - Next/Previous navigation buttons + interactive dot indicators.
 * - Collapsible toggle ("Hide/Show Spotlight") with persistent state.
 * - Highlights Top Rated, Low Stock Alerts, and Premium Catalog items.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Flame,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import { formatCurrency, formatCategory, getStockStatus } from '../../utils/formatters.js';
import { RatingStars } from '../common/RatingStars.jsx';
import { ImageWithFallback } from '../common/ImageWithFallback.jsx';

export const ProductSpotlightCarousel = ({ products = [], onSelectProduct }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('apex_spotlight_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  // Pick high-priority spotlight items from the current catalog
  const spotlightItems = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    
    // Sort and select 4 distinct interesting items (Low stock, highest rated, most expensive, latest)
    const sortedByRating = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    const sortedByStock = [...products].sort((a, b) => (a.stock || 0) - (b.stock || 0));
    const sortedByPrice = [...products].sort((a, b) => (b.price || 0) - (a.price || 0));

    const selected = [];
    const addedIds = new Set();

    const addIfUnique = (item, tag, tagColor, icon) => {
      if (item && !addedIds.has(item.id)) {
        addedIds.add(item.id);
        selected.push({ ...item, tag, tagColor, tagIcon: icon });
      }
    };

    if (sortedByRating[0]) addIfUnique(sortedByRating[0], 'Top Rated Choice', 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', Sparkles);
    if (sortedByStock[0] && sortedByStock[0].stock <= 15) addIfUnique(sortedByStock[0], 'Low Stock Alert', 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20', AlertTriangle);
    if (sortedByPrice[0]) addIfUnique(sortedByPrice[0], 'Premium Selection', 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20', TrendingUp);
    if (products[0]) addIfUnique(products[0], 'Featured Inventory', 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', Flame);

    return selected.slice(0, 4);
  }, [products]);

  const totalSlides = spotlightItems.length;

  const handleNext = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Automatic slide rotation every 5 seconds (paused on hover or when collapsed)
  useEffect(() => {
    if (isPaused || isCollapsed || totalSlides <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, isCollapsed, totalSlides, handleNext]);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('apex_spotlight_collapsed', String(next));
      } catch {
        // Storage safe fallback
      }
      return next;
    });
  };

  if (totalSlides === 0) return null;

  const currentItem = spotlightItems[currentIndex];
  if (!currentItem) return null;

  const TagIcon = currentItem.tagIcon || Sparkles;
  const stockInfo = getStockStatus(currentItem.stock);

  return (
    <div className="bg-gradient-to-r from-indigo-900/10 via-slate-900/5 to-purple-900/10 dark:from-indigo-950/40 dark:via-slate-900/60 dark:to-purple-950/40 border border-indigo-200/60 dark:border-indigo-900/50 rounded-2xl p-4 sm:p-5 transition-all shadow-sm">
      {/* Top Header Row with Title & Collapse Button */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              Catalog Spotlight
              <span className="text-[11px] font-medium font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                {currentIndex + 1} of {totalSlides}
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Collapse/Expand Toggle */}
          <button
            type="button"
            onClick={toggleCollapse}
            aria-label={isCollapsed ? 'Expand Spotlight Carousel' : 'Minimize Spotlight Carousel'}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-lg transition-colors cursor-pointer"
          >
            {isCollapsed ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Show Spotlight</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Minimize</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div
          className="relative overflow-hidden pt-1"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main Slide Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white/80 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-4 sm:p-5 transition-all">
            {/* Left: Product Thumbnail */}
            <div className="md:col-span-4 flex items-center justify-center">
              <div className="relative w-full max-w-[200px] aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 overflow-hidden flex items-center justify-center p-2 group shadow-sm">
                <ImageWithFallback
                  src={currentItem.thumbnail}
                  alt={currentItem.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                {/* Stock status overlay */}
                <div className="absolute top-2 left-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${stockInfo.badgeClass}`}>
                    {stockInfo.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Product Details & Metrics */}
            <div className="md:col-span-8 flex flex-col justify-between h-full space-y-3">
              <div>
                {/* Tag Badge + Category */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${currentItem.tagColor}`}>
                    <TagIcon className="w-3.5 h-3.5" />
                    {currentItem.tag}
                  </span>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    {formatCategory(currentItem.category)}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                  {currentItem.title}
                </h4>

                {/* Description snippet */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">
                  {currentItem.description || 'High-performance inventory product with certified vendor warranty and expedited shipping support.'}
                </p>
              </div>

              {/* Price, Rating & Action Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-600 dark:text-slate-400 block">
                      Admin Price
                    </span>
                    <span className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white">
                      {formatCurrency(currentItem.price)}
                    </span>
                  </div>

                  <div className="hidden sm:block h-7 w-px bg-slate-200 dark:bg-slate-700" />

                  <div className="hidden sm:block">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-600 dark:text-slate-400 block">
                      Rating
                    </span>
                    <RatingStars rating={currentItem.rating} size={14} />
                  </div>
                </div>

                {/* Direct Action Button */}
                <button
                  type="button"
                  onClick={() => onSelectProduct?.(currentItem.id)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  <span>Inspect Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Controls: Arrows + Dots */}
          <div className="flex items-center justify-between mt-3 pt-1">
            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {spotlightItems.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'w-6 bg-indigo-600 dark:bg-indigo-400'
                      : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                  }`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous Spotlight Slide"
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Spotlight Slide"
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
