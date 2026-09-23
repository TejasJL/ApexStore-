/**
 * @file ProductMutationContext.jsx
 * Simulates real persistence overlay for DummyJSON API.
 * 
 * ARCHITECTURAL DECISION:
 * DummyJSON is a static mock backend that does not commit POST/PUT/DELETE operations.
 * To provide an authentic, production-grade user experience where newly created products,
 * edited details, and deleted rows remain visible across pagination, search, details,
 * and page reloads, this context manages a local mutation overlay saved in sessionStorage.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const MUTATION_STORAGE_KEY = 'apex_product_mutations_v1';

const ProductMutationContext = createContext(null);

export const ProductMutationProvider = ({ children }) => {
  // Local overlay state
  const [createdProducts, setCreatedProducts] = useState(() => {
    try {
      const stored = sessionStorage.getItem(MUTATION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.created || [];
      }
    } catch (e) {
      console.error('Error reading mutations from sessionStorage:', e);
    }
    return [];
  });

  const [updatedProducts, setUpdatedProducts] = useState(() => {
    try {
      const stored = sessionStorage.getItem(MUTATION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.updated || {};
      }
    } catch (e) {
      console.error('Error reading mutations from sessionStorage:', e);
    }
    return {};
  });

  const [deletedProductIds, setDeletedProductIds] = useState(() => {
    try {
      const stored = sessionStorage.getItem(MUTATION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.deleted || [];
      }
    } catch (e) {
      console.error('Error reading mutations from sessionStorage:', e);
    }
    return [];
  });

  // Persist mutations to sessionStorage on modification
  useEffect(() => {
    try {
      sessionStorage.setItem(
        MUTATION_STORAGE_KEY,
        JSON.stringify({
          created: createdProducts,
          updated: updatedProducts,
          deleted: deletedProductIds,
        })
      );
    } catch (e) {
      console.error('Failed to sync mutations to sessionStorage:', e);
    }
  }, [createdProducts, updatedProducts, deletedProductIds]);

  /**
   * Register a newly created product
   */
  const addCreatedProduct = useCallback((product) => {
    setCreatedProducts((prev) => [product, ...prev.filter((p) => p.id !== product.id)]);
  }, []);

  /**
   * Register an updated product
   */
  const addUpdatedProduct = useCallback((product) => {
    // If it was locally created, update in createdProducts list
    setCreatedProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, ...product } : p))
    );

    // Also record in updatedProducts dictionary
    setUpdatedProducts((prev) => ({
      ...prev,
      [product.id]: {
        ...(prev[product.id] || {}),
        ...product,
      },
    }));
  }, []);

  /**
   * Register a deleted product
   */
  const addDeletedProductId = useCallback((id) => {
    const numericId = Number(id);
    // Remove from local created products
    setCreatedProducts((prev) => prev.filter((p) => Number(p.id) !== numericId));
    // Remove from updated map
    setUpdatedProducts((prev) => {
      const next = { ...prev };
      delete next[numericId];
      return next;
    });
    // Add to deleted IDs set
    setDeletedProductIds((prev) => (prev.includes(numericId) ? prev : [...prev, numericId]));
  }, []);

  /**
   * Clears all simulated mutations
   */
  const resetMutations = useCallback(() => {
    setCreatedProducts([]);
    setUpdatedProducts({});
    setDeletedProductIds([]);
    try {
      sessionStorage.removeItem(MUTATION_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  }, []);

  /**
   * Merges server-fetched products with the local mutation overlay.
   * - Filters out deleted products.
   * - Applies updated field values.
   * - Injects newly created products at the top (if page === 1).
   */
  const applyMutationsToList = useCallback(
    (apiProducts, currentPage = 1) => {
      // 1. Filter out deleted products
      const filtered = apiProducts.filter(
        (product) => !deletedProductIds.includes(Number(product.id))
      );

      // 2. Apply updates
      const updated = filtered.map((product) => {
        const patch = updatedProducts[product.id];
        return patch ? { ...product, ...patch } : product;
      });

      // 3. Prepend newly created products if on first page
      if (currentPage === 1 && createdProducts.length > 0) {
        // Exclude any if already present
        const existingIds = new Set(updated.map((p) => p.id));
        const toPrepend = createdProducts.filter((p) => !existingIds.has(p.id));
        return [...toPrepend, ...updated];
      }

      return updated;
    },
    [createdProducts, updatedProducts, deletedProductIds]
  );

  /**
   * Merges a single product detail with local mutation overlay.
   * Returns null if the product was marked as deleted.
   */
  const applyMutationsToSingle = useCallback(
    (product) => {
      if (!product) return null;
      if (deletedProductIds.includes(Number(product.id))) {
        return null; // Product marked deleted locally
      }

      const patch = updatedProducts[product.id];
      if (patch) {
        return { ...product, ...patch };
      }

      // Check if it exists in locally created list
      const locallyCreated = createdProducts.find((p) => Number(p.id) === Number(product.id));
      if (locallyCreated) {
        return { ...product, ...locallyCreated };
      }

      return product;
    },
    [createdProducts, updatedProducts, deletedProductIds]
  );

  /**
   * Find product if it was created locally (useful when API returns 404 for newly added products)
   */
  const getLocallyCreatedProduct = useCallback(
    (id) => {
      return createdProducts.find((p) => String(p.id) === String(id)) || null;
    },
    [createdProducts]
  );

  const isProductDeleted = useCallback(
    (id) => {
      return deletedProductIds.includes(Number(id));
    },
    [deletedProductIds]
  );

  return (
    <ProductMutationContext.Provider
      value={{
        createdProducts,
        updatedProducts,
        deletedProductIds,
        addCreatedProduct,
        addUpdatedProduct,
        addDeletedProductId,
        resetMutations,
        applyMutationsToList,
        applyMutationsToSingle,
        getLocallyCreatedProduct,
        isProductDeleted,
        totalMutationsCount:
          createdProducts.length + Object.keys(updatedProducts).length + deletedProductIds.length,
      }}
    >
      {children}
    </ProductMutationContext.Provider>
  );
};

export const useProductMutations = () => {
  const context = useContext(ProductMutationContext);
  if (!context) {
    throw new Error('useProductMutations must be used within ProductMutationProvider');
  }
  return context;
};
