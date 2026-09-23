/**
 * @file useProducts.js
 * Core catalog data hook.
 * 
 * ARCHITECTURAL REQUIREMENTS:
 * 1. Race Condition Prevention:
 *    Uses both an AbortController to cancel previous ongoing in-flight requests AND
 *    a monotonic incrementing sequence ID (requestIdRef). Even if cancellation is ignored
 *    by the network or responses arrive out-of-order, only the latest issued request updates state.
 * 2. DummyJSON Limitation Handling:
 *    DummyJSON does not support simultaneous search + category filtering. When both are active,
 *    we query the search endpoint and filter by category on the client, while setting
 *    isCategorySearchHybrid to true so an alert banner communicates this transparently.
 * 3. Mutation Merging:
 *    Merges local additions, edits, and deletions from ProductMutationContext into fetched results.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { productsApi } from '../api/products.api.js';
import { useProductMutations } from '../context/ProductMutationContext.jsx';
import { indianizeProduct } from '../utils/indianCatalog.js';

export const useProducts = ({
  page = 1,
  limit = 10,
  searchQuery = '',
  category = 'all',
  sortBy = '',
  order = 'asc',
  delay = 0,
}) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingCategories, setIsFetchingCategories] = useState(true);
  const [error, setError] = useState(null);
  const [isCategorySearchHybrid, setIsCategorySearchHybrid] = useState(false);

  const { applyMutationsToList } = useProductMutations();

  // Race condition shields:
  const abortControllerRef = useRef(null);
  const requestIdRef = useRef(0);

  // Fetch categories list once on mount
  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        setIsFetchingCategories(true);
        const data = await productsApi.getCategories();
        if (isMounted) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Failed to load product categories:', err);
      } finally {
        if (isMounted) {
          setIsFetchingCategories(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Main products query function with race condition prevention
   */
  const fetchProducts = useCallback(async () => {
    // 1. Cancel previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // 2. Increment monotonic request identifier
    const currentRequestId = ++requestIdRef.current;

    setIsLoading(true);
    setError(null);

    const hasSearch = searchQuery.trim().length > 0;
    const hasCategory = category && category !== 'all';

    // Flag whether hybrid client-side filtering is active
    const isHybridMode = hasSearch && hasCategory;
    setIsCategorySearchHybrid(isHybridMode);

    try {
      if (isHybridMode) {
        // HYBRID MODE: DummyJSON cannot combine /products/search with /products/category
        let rawCandidates = [];
        try {
          const response = await productsApi.getProducts({
            limit: 100,
            skip: 0,
            q: searchQuery.trim(),
            delay,
            signal: abortController.signal,
          });
          rawCandidates = response.products || [];
        } catch (e) {
          rawCandidates = [];
        }

        // Guard against race condition: check if request is still latest
        if (currentRequestId !== requestIdRef.current) return;

        // Indianize products (currency conversion)
        let enriched = rawCandidates.map(indianizeProduct);

        // Filter by category
        let filtered = enriched.filter(
          (item) => item.category.toLowerCase() === category.toLowerCase()
        );

        // Filter by search query (matches Indian title or brand)
        const qTerm = searchQuery.trim().toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.title.toLowerCase().includes(qTerm) ||
            (item.brand && item.brand.toLowerCase().includes(qTerm)) ||
            (item.description && item.description.toLowerCase().includes(qTerm))
        );

        // Client-side sort if specified
        if (sortBy) {
          filtered = [...filtered].sort((a, b) => {
            const valA = a[sortBy];
            const valB = b[sortBy];
            if (typeof valA === 'string') {
              return order === 'desc'
                ? valB.localeCompare(valA)
                : valA.localeCompare(valB);
            }
            return order === 'desc' ? Number(valB) - Number(valA) : Number(valA) - Number(valB);
          });
        }

        // Apply local mutations (Add / Edit / Delete)
        const mutatedList = applyMutationsToList(filtered, page);

        // Paginate slice
        const startIndex = (page - 1) * limit;
        const pagedSlice = mutatedList.slice(startIndex, startIndex + limit);

        setProducts(pagedSlice);
        setTotal(mutatedList.length);
      } else if (hasSearch) {
        // SEARCH-ONLY MODE with Indian brand/title awareness
        let rawCandidates = [];
        try {
          const response = await productsApi.getProducts({
            limit: 100,
            skip: 0,
            q: searchQuery.trim(),
            delay,
            signal: abortController.signal,
          });
          rawCandidates = response.products || [];
        } catch (e) {
          rawCandidates = [];
        }

        if (currentRequestId !== requestIdRef.current) return;

        let enriched = rawCandidates.map(indianizeProduct);
        const qTerm = searchQuery.trim().toLowerCase();
        let filtered = enriched.filter(
          (item) =>
            item.title.toLowerCase().includes(qTerm) ||
            (item.brand && item.brand.toLowerCase().includes(qTerm)) ||
            item.category.toLowerCase().includes(qTerm) ||
            (item.description && item.description.toLowerCase().includes(qTerm))
        );

        if (sortBy) {
          filtered = [...filtered].sort((a, b) => {
            const valA = a[sortBy];
            const valB = b[sortBy];
            if (typeof valA === 'string') {
              return order === 'desc' ? valB.localeCompare(valA) : valA.localeCompare(valB);
            }
            return order === 'desc' ? Number(valB) - Number(valA) : Number(valA) - Number(valB);
          });
        }

        const mutatedList = applyMutationsToList(filtered, page);
        const startIndex = (page - 1) * limit;
        const pagedSlice = mutatedList.slice(startIndex, startIndex + limit);

        setProducts(pagedSlice);
        setTotal(mutatedList.length);
      } else {
        // STANDARD SERVER-SIDE MODE
        const skip = (page - 1) * limit;

        const response = await productsApi.getProducts({
          limit,
          skip,
          category: hasCategory ? category : undefined,
          sortBy: sortBy || undefined,
          order: sortBy ? order : undefined,
          delay,
          signal: abortController.signal,
        });

        // Guard against race condition
        if (currentRequestId !== requestIdRef.current) return;

        const enriched = response.products.map(indianizeProduct);
        // Apply local mutations (Add / Edit / Delete)
        const mutatedList = applyMutationsToList(enriched, page);

        setProducts(mutatedList);
        setTotal(response.total);
      }
    } catch (err) {
      // Do not treat aborted requests as errors
      if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED' || err?.message === 'canceled') {
        return;
      }

      // Check if this request is still the latest one
      if (currentRequestId === requestIdRef.current) {
        setError(err?.message || 'Failed to fetch products from catalog.');
        setProducts([]);
        setTotal(0);
      }
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [
    page,
    limit,
    searchQuery,
    category,
    sortBy,
    order,
    delay,
    applyMutationsToList,
  ]);

  // Re-fetch whenever query params change
  useEffect(() => {
    fetchProducts();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProducts]);

  return {
    products,
    total,
    categories,
    isLoading,
    isFetchingCategories,
    error,
    isCategorySearchHybrid,
    refetch: fetchProducts,
  };
};
