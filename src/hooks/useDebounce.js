/**
 * @file useDebounce.js
 * Debounce hook to prevent excessive API invocations during rapid typing.
 */

import { useState, useEffect } from 'react';

/**
 * Custom hook that returns a debounced version of any input value.
 * @param {any} value
 * @param {number} delay
 * @returns {any}
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
