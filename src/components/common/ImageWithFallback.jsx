/**
 * @file ImageWithFallback.jsx
 * High-definition e-commerce product image renderer:
 * - Clean neutral studio backdrop for transparent & cutout product photography
 * - Configurable fit mode ('contain' for product items, 'cover' for banners)
 * - Configurable padding to prevent tiny shrunken thumbnails
 * - Resilient fallback handling with referrerPolicy="no-referrer" for reliable CDN loading.
 */

import React, { useState } from 'react';
import { Package } from 'lucide-react';

export const ImageWithFallback = ({
  src,
  alt = 'Product image',
  className = '',
  aspectRatio = 'square',
  fit = 'contain',
  padding = 'p-1.5',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'wide'
      ? 'aspect-video'
      : aspectRatio === '4/3'
      ? 'aspect-[4/3]'
      : '';

  if (!src || hasError) {
    return (
      <div
        className={`${aspectClass} ${className} flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-850 text-slate-400 dark:text-slate-500 rounded-xl border border-slate-200/70 dark:border-slate-800 p-2 text-center select-none`}
        aria-label="Product image placeholder"
      >
        <div className="w-8 h-8 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-slate-500 flex items-center justify-center mb-1">
          <Package className="w-4 h-4 stroke-[1.75]" />
        </div>
        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 line-clamp-1 max-w-[90%]">
          {alt || 'Catalog Item'}
        </span>
      </div>
    );
  }

  const fitClass =
    fit === 'cover'
      ? 'w-full h-full object-cover'
      : `w-full h-full object-contain ${padding} transition-transform duration-300 ease-out group-hover:scale-105`;

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center ${aspectClass} ${className}`}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 animate-pulse flex items-center justify-center">
          <div className="w-5 h-5 rounded-full border-2 border-indigo-500/30 border-t-indigo-600 animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`${fitClass} transition-opacity duration-200 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
