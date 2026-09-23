/**
 * @file useUrlState.js
 * Synchronizes catalog filter parameters and navigation route with the browser URL.
 * Ensures complete bookmarkability and browser back/forward button parity without external router.
 */

import { useState, useEffect, useCallback, useTransition } from 'react';

/**
 * Parses URL search params and pathname into an application state object
 */
const parseUrlToState = () => {
  if (typeof window === 'undefined') {
    return {
      page: 1,
      limit: 10,
      q: '',
      category: 'all',
      sortBy: '',
      order: 'asc',
      productId: null,
      view: 'table',
      delay: 0,
    };
  }

  const params = new URLSearchParams(window.location.search);
  const pathname = window.location.pathname;

  // Check if pathname matches /products/:id or query param has productId
  const productMatch = pathname.match(/^\/products\/(\d+|[a-zA-Z0-9_-]+)$/);
  const queryProductId = params.get('productId') || params.get('product');
  const productId = productMatch ? productMatch[1] : (queryProductId || null);

  const page = Math.max(1, parseInt(params.get('page') || '1', 10) || 1);
  const limit = [10, 20, 50].includes(Number(params.get('limit')))
    ? Number(params.get('limit'))
    : 10;
  const q = params.get('q') || '';
  const category = params.get('category') || 'all';
  const sortBy = ['price', 'rating', 'title'].includes(params.get('sortBy') || '')
    ? params.get('sortBy')
    : '';
  const order = params.get('order') === 'desc' ? 'desc' : 'asc';
  const view = params.get('view') === 'grid' ? 'grid' : 'table';
  const delay = Math.max(0, parseInt(params.get('delay') || '0', 10) || 0);

  return {
    page,
    limit,
    q,
    category,
    sortBy,
    order,
    productId,
    view,
    delay,
  };
};

export const useUrlState = () => {
  const [, startTransition] = useTransition();
  const [urlState, setUrlState] = useState(parseUrlToState);

  // Sync internal state when user navigates using back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setUrlState(parseUrlToState());
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  /**
   * Updates state and pushes to browser history
   * @param {object} partial
   * @param {'push'|'replace'} mode
   */
  const updateUrlState = useCallback((partial, mode = 'push') => {
    startTransition(() => {
      setUrlState((prevState) => {
        const next = { ...prevState, ...partial };

        const params = new URLSearchParams();

        if (next.page > 1) params.set('page', next.page.toString());
        if (next.limit !== 10) params.set('limit', next.limit.toString());
        if (next.q && next.q.trim()) params.set('q', next.q.trim());
        if (next.category && next.category !== 'all') params.set('category', next.category);
        if (next.sortBy) params.set('sortBy', next.sortBy);
        if (next.sortBy && next.order === 'desc') params.set('order', 'desc');
        if (next.view && next.view !== 'table') params.set('view', next.view);
        if (next.delay > 0) params.set('delay', next.delay.toString());

        const queryStr = params.toString() ? `?${params.toString()}` : '';
        const targetPath = next.productId ? `/products/${next.productId}` : '/';
        const fullUrl = `${targetPath}${queryStr}`;

        if (mode === 'replace') {
          window.history.replaceState({}, '', fullUrl);
        } else {
          window.history.pushState({}, '', fullUrl);
        }

        return next;
      });
    });
  }, []);

  /**
   * Convenience helpers for navigation
   */
  const navigateToProduct = useCallback(
    (id) => {
      updateUrlState({ productId: String(id) }, 'push');
    },
    [updateUrlState]
  );

  const navigateToCatalog = useCallback(() => {
    updateUrlState({ productId: null }, 'push');
  }, [updateUrlState]);

  return {
    urlState,
    updateUrlState,
    navigateToProduct,
    navigateToCatalog,
  };
};
