/**
 * @file App.jsx
 * Main Application Root Controller in Pure JavaScript.
 * Coordinates authentication gates, URL bidirectional state, catalog views,
 * pagination, search/filtering, and modal operations.
 */

import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './context/ToastContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import {
  ProductMutationProvider,
  useProductMutations,
} from './context/ProductMutationContext.jsx';
import { useUrlState } from './hooks/useUrlState.js';
import { useDebounce } from './hooks/useDebounce.js';
import { useProducts } from './hooks/useProducts.js';
import { productsApi } from './api/products.api.js';

// Layout & Common Components
import { MainLayout } from './components/layout/MainLayout.jsx';
import { LoginPage } from './components/auth/LoginPage.jsx';
import { CatalogStatsBar } from './components/products/CatalogStatsBar.jsx';
import { ProductSpotlightCarousel } from './components/products/ProductSpotlightCarousel.jsx';
import { ProductFiltersBar } from './components/products/ProductFiltersBar.jsx';
import { CategorySearchAlert } from './components/products/CategorySearchAlert.jsx';
import { ProductTable } from './components/products/ProductTable.jsx';
import { ProductCardGrid } from './components/products/ProductCardGrid.jsx';
import { ProductPagination } from './components/products/ProductPagination.jsx';
import { ProductDetailsPage } from './components/products/ProductDetailsPage.jsx';
import { ProductFormModal } from './components/products/ProductFormModal.jsx';
import { ConfirmModal } from './components/common/ConfirmModal.jsx';
import { ArchitectureModal } from './components/docs/ArchitectureModal.jsx';
import {
  TableRowSkeleton,
  CardGridSkeleton,
} from './components/common/SkeletonLoader.jsx';
import { EmptyState } from './components/common/EmptyState.jsx';
import { ErrorState } from './components/common/ErrorState.jsx';

/**
 * Inner Dashboard Controller
 */
function Dashboard() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { urlState, updateUrlState, navigateToProduct, navigateToCatalog } = useUrlState();
  const { success: toastSuccess, error: toastError } = useToast();

  const {
    addCreatedProduct,
    addUpdatedProduct,
    addDeletedProductId,
    totalMutationsCount,
  } = useProductMutations();

  // Search input with debounce
  const [searchInput, setSearchInput] = useState(urlState.q);
  const debouncedSearch = useDebounce(searchInput, 350);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedProductForEdit, setSelectedProductForEdit] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isDocsOpen, setIsDocsOpen] = useState(false);

  // Sync debounced search to URL and reset to page 1 on query change
  useEffect(() => {
    if (debouncedSearch !== urlState.q) {
      updateUrlState({ q: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch, urlState.q, updateUrlState]);

  // Sync URL search to local input if navigated back/forward
  useEffect(() => {
    setSearchInput(urlState.q);
  }, [urlState.q]);

  // Product data hook
  const {
    products,
    total,
    categories,
    isLoading: isProductsLoading,
    error: productsError,
    refetch,
  } = useProducts({
    page: urlState.page,
    limit: urlState.limit,
    searchQuery: urlState.q,
    category: urlState.category,
    sortBy: urlState.sortBy,
    order: urlState.order,
    delay: urlState.delay,
  });

  // Filter handlers
  const handleCategoryChange = (newCategory) => {
    updateUrlState({ category: newCategory, page: 1 });
  };

  const handleSortByChange = (field) => {
    updateUrlState({
      sortBy: field,
      order: field === urlState.sortBy && urlState.order === 'asc' ? 'desc' : 'asc',
      page: 1,
    });
  };

  const handleOrderToggle = () => {
    updateUrlState({
      order: urlState.order === 'asc' ? 'desc' : 'asc',
      page: 1,
    });
  };

  const handleLimitChange = (newLimit) => {
    updateUrlState({ limit: newLimit, page: 1 });
  };

  const handlePageChange = (newPage) => {
    updateUrlState({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    updateUrlState({
      q: '',
      category: 'all',
      sortBy: '',
      order: 'asc',
      page: 1,
    });
  };

  const handleToggleDelay = () => {
    const nextDelay = urlState.delay > 0 ? 0 : 2000;
    updateUrlState({ delay: nextDelay });
  };

  // Create Product Handlers
  const handleOpenCreateModal = () => {
    setFormMode('create');
    setSelectedProductForEdit(null);
    setIsFormModalOpen(true);
  };

  // Edit Product Handlers
  const handleOpenEditModal = (product) => {
    setFormMode('edit');
    setSelectedProductForEdit(product);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (values) => {
    setIsSubmittingForm(true);
    try {
      if (formMode === 'create') {
        const created = await productsApi.createProduct(values);
        const newProduct = {
          ...values,
          id: created.id || Date.now(),
        };
        addCreatedProduct(newProduct);
        toastSuccess('Product Added', `"${newProduct.title}" was added to the catalog.`);
      } else {
        await productsApi.updateProduct(selectedProductForEdit.id, values);
        const updated = {
          ...selectedProductForEdit,
          ...values,
        };
        addUpdatedProduct(updated);
        toastSuccess('Product Updated', `Changes to "${updated.title}" were saved.`);
      }
      setIsFormModalOpen(false);
    } catch (err) {
      toastError('Operation Failed', err.message || 'Could not save product.');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Delete Product Handlers
  const handleOpenDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await productsApi.deleteProduct(productToDelete.id);
      addDeletedProductId(productToDelete.id);
      toastSuccess('Product Deleted', `"${productToDelete.title}" was removed.`);

      // If we are currently on the details page of the deleted product, return to catalog
      if (urlState.productId === String(productToDelete.id)) {
        navigateToCatalog();
      }

      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err) {
      toastError('Delete Failed', err.message || 'Could not delete product.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Auth gate check
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-slate-500">Initializing ApexStore...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const hasActiveFilters = Boolean(
    urlState.q || (urlState.category && urlState.category !== 'all') || urlState.sortBy || urlState.page > 1
  );

  return (
    <MainLayout
      currentProductId={urlState.productId}
      onOpenDocs={() => setIsDocsOpen(true)}
      onResetToCatalog={navigateToCatalog}
      mutationsCount={totalMutationsCount}
    >
      {/* Route 1: Single Product Details View */}
      {urlState.productId ? (
        <ProductDetailsPage
          productId={urlState.productId}
          onBack={navigateToCatalog}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
        />
      ) : (
        /* Route 2: Catalog Management Dashboard */
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Top KPI Metrics Bar */}
          <CatalogStatsBar
            totalProducts={total}
            categoriesCount={categories.length}
            currentProducts={products}
            activeDelay={urlState.delay}
            onToggleDelay={handleToggleDelay}
          />

          {/* Zero-Dependency Pure React Spotlight Carousel */}
          {!isProductsLoading && !productsError && products.length > 0 && !hasActiveFilters && (
            <ProductSpotlightCarousel
              products={products}
              onSelectProduct={(id) => navigateToProduct(id)}
            />
          )}

          {/* DummyJSON limitation notice when search + category are combined */}
          <CategorySearchAlert
            searchQuery={urlState.q}
            category={urlState.category}
            onClearCategory={() => updateUrlState({ category: 'all', page: 1 })}
            onClearSearch={() => {
              setSearchInput('');
              updateUrlState({ q: '', page: 1 });
            }}
          />

          {/* Controls: Search, Categories, Sort, Rows, View Mode */}
          <ProductFiltersBar
            searchInput={searchInput}
            onSearchChange={setSearchInput}
            category={urlState.category}
            onCategoryChange={handleCategoryChange}
            categories={categories}
            sortBy={urlState.sortBy}
            onSortByChange={handleSortByChange}
            order={urlState.order}
            onOrderToggle={handleOrderToggle}
            limit={urlState.limit}
            onLimitChange={handleLimitChange}
            viewMode={urlState.view}
            onViewModeChange={(mode) => updateUrlState({ view: mode })}
            onOpenCreateModal={handleOpenCreateModal}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
            totalResults={total}
          />

          {/* Main Data Presentation Area */}
          {productsError ? (
            <ErrorState
              title="Catalog Retrieval Error"
              message={productsError}
              onRetry={refetch}
            />
          ) : isProductsLoading ? (
            urlState.view === 'grid' ? (
              <CardGridSkeleton count={urlState.limit} />
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    <TableRowSkeleton rows={urlState.limit} />
                  </tbody>
                </table>
              </div>
            )
          ) : products.length === 0 ? (
            <EmptyState
              title={urlState.page > 1 && total > 0 ? `Page ${urlState.page} Out of Range` : "No Products Found"}
              description={
                urlState.page > 1 && total > 0
                  ? `Page ${urlState.page} contains no products (${total} products total across ${Math.max(1, Math.ceil(total / urlState.limit))} pages). Return to Page 1 to view your catalog.`
                  : hasActiveFilters
                  ? 'No products matched your search or category filter. Try clearing filters.'
                  : 'Your catalog is currently empty.'
              }
              onReset={hasActiveFilters ? handleResetFilters : undefined}
              onCreate={handleOpenCreateModal}
            />
          ) : (
            <>
              {/* Desktop Table View */}
              {urlState.view === 'table' ? (
                <>
                  <div className="hidden sm:block">
                    <ProductTable
                      products={products}
                      sortBy={urlState.sortBy}
                      order={urlState.order}
                      onSortChange={handleSortByChange}
                      onViewProduct={navigateToProduct}
                      onEditProduct={handleOpenEditModal}
                      onDeleteProduct={handleOpenDeleteModal}
                    />
                  </div>
                  {/* Automatic mobile card fallback for small screens */}
                  <div className="block sm:hidden">
                    <ProductCardGrid
                      products={products}
                      onViewProduct={navigateToProduct}
                      onEditProduct={handleOpenEditModal}
                      onDeleteProduct={handleOpenDeleteModal}
                    />
                  </div>
                </>
              ) : (
                /* Grid Showcase View */
                <ProductCardGrid
                  products={products}
                  onViewProduct={navigateToProduct}
                  onEditProduct={handleOpenEditModal}
                  onDeleteProduct={handleOpenDeleteModal}
                />
              )}

              {/* Custom Scratch-Built Pagination */}
              <ProductPagination
                page={urlState.page}
                limit={urlState.limit}
                total={total}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
              />
            </>
          )}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        mode={formMode}
        initialProduct={selectedProductForEdit}
        categories={categories}
        onSubmit={handleFormSubmit}
        onClose={() => setIsFormModalOpen(false)}
        isSubmitting={isSubmittingForm}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Product"
        message="Are you sure you want to delete this product? It will be removed from your catalog and mutation overlay."
        itemName={productToDelete?.title}
        confirmLabel="Confirm Delete"
        isSubmitting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsDeleteModalOpen(false)}
      />

      {/* Architecture & Assignment Transparency Modal */}
      <ArchitectureModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
        activeDelay={urlState.delay}
        onToggleDelay={handleToggleDelay}
      />
    </MainLayout>
  );
}

/**
 * Root Application Entry with Provider Wrappers
 */
export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ProductMutationProvider>
          <Dashboard />
        </ProductMutationProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
