/**
 * @file RatingStars.jsx
 * Accessible rating star visualization with exact tabular decimal score.
 */

import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({
  rating = 0,
  max = 5,
  size = 'sm',
  showScore = true,
  count,
}) => {
  const normalized = Math.min(Math.max(Number(rating) || 0, 0), max);

  const starSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const starClass = starSizes[size] || starSizes.sm;

  return (
    <div className="inline-flex items-center gap-1.5" aria-label={`Rating: ${normalized.toFixed(1)} out of 5 stars`}>
      <div className="flex items-center gap-0.5">
        {[...Array(max)].map((_, i) => {
          const filled = i < Math.floor(normalized);
          const half = !filled && i < normalized;

          return (
            <div key={i} className="relative">
              <Star
                className={`${starClass} ${
                  filled
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-300 dark:text-slate-700'
                }`}
              />
              {half && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${(normalized - i) * 100}%` }}
                >
                  <Star className={`${starClass} text-amber-400 fill-amber-400`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showScore && (
        <span className="font-mono text-xs font-semibold tabular-nums text-slate-700 dark:text-slate-300">
          {normalized.toFixed(2)}
        </span>
      )}

      {count !== undefined && (
        <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">
          ({count})
        </span>
      )}
    </div>
  );
};
