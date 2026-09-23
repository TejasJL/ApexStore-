/**
 * @file ProductDetailsPage.jsx
 * Product detail view for route /products/:id.
 * Features:
 * - Multi-image gallery with high-resolution image switcher
 * - Detailed price breakdown with calculated discount savings
 * - Full specifications & inventory status
 * - Customer reviews with 5-star ratings, dates, and reviewer avatars
 * - 404 error recovery state for invalid/deleted IDs
 * - In-place Edit and Delete actions.
 */

import React, { useState, useEffect } from 'react';
import { productsApi } from '../../api/products.api.js';
import { useProductMutations } from '../../context/ProductMutationContext.jsx';
import { ImageWithFallback } from '../common/ImageWithFallback.jsx';
import { RatingStars } from '../common/RatingStars.jsx';
import {
  formatCurrency,
  formatCategory,
  formatDate,
  getStockStatus,
} from '../../utils/formatters.js';
import { indianizeProduct, indianizeReview } from '../../utils/indianCatalog.js';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Tag,
  Package,
  MapPin,
} from 'lucide-react';

export const ProductDetailsPage = ({
  productId,
  onBack,
  onEdit,
  onDelete,
}) => {
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    applyMutationsToSingle,
    getLocallyCreatedProduct,
    isProductDeleted,
  } = useProductMutations();

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      setIsLoading(true);
      setError(null);

      // 1. Check if product was deleted locally
      if (isProductDeleted(productId)) {
        if (isMounted) {
          setError('This product was deleted from the catalog.');
          setIsLoading(false);
        }
        return;
      }

      // 2. Check if product was created locally
      const localProduct = getLocallyCreatedProduct(productId);
      if (localProduct) {
        if (isMounted) {
          const merged = applyMutationsToSingle(localProduct);
          setProduct(merged);
          setSelectedImage(
            merged.thumbnail || (merged.images && merged.images[0]) || ''
          );
          setIsLoading(false);
        }
        return;
      }

      // 3. Fetch from API
      try {
        const fetched = await productsApi.getProductById(productId);
        if (isMounted) {
          const enriched = indianizeProduct(fetched);
          const enrichedReviews = (enriched.reviews || []).map((r, idx) =>
            indianizeReview(r, idx)
          );
          const merged = applyMutationsToSingle({
            ...enriched,
            reviews: enrichedReviews,
          });

          if (!merged) {
            setError('This product has been removed from the catalog.');
          } else {
            setProduct(merged);
            setSelectedImage(
              merged.thumbnail || (merged.images && merged.images[0]) || ''
            );
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.status === 404
              ? `Product #${productId} does not exist in the DummyJSON catalog.`
              : err.message || 'Failed to load product details.'
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [productId, applyMutationsToSingle, getLocallyCreatedProduct, isProductDeleted]);

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="grid grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-6 space-y-4">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // 404 / Error State
  if (error || !product) {
    return (
      <div className="p-12 text-center rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 max-w-xl mx-auto my-12">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Product Not Found
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed font-mono">
          {error || `Product #${productId} is not available.`}
        </p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Product Catalog
        </button>
      </div>
    );
  }

  const stockInfo = getStockStatus(product.stock);
  const images =
    product.images && product.images.length > 0
      ? product.images
      : product.thumbnail
      ? [product.thumbnail]
      : [];

  // Calculate original price before discount
  const originalPrice =
    product.discountPercentage > 0
      ? product.price / (1 - product.discountPercentage / 100)
      : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>Edit Product</span>
          </button>

          <button
            type="button"
            onClick={() => onDelete(product)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery on Left, Specs on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Active Image Showcase */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex items-center justify-center min-h-[380px]">
            <ImageWithFallback
              src={selectedImage || product.thumbnail}
              alt={product.title}
              aspectRatio="square"
              fit="contain"
              padding="p-4"
              className="w-full max-h-[440px]"
            />

            {product.discountPercentage > 0 && (
              <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold font-mono shadow-md">
                -{Math.round(product.discountPercentage)}% OFF
              </div>
            )}
          </div>

          {/* Clickable Image Thumbnails Gallery */}
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2.5">
              {images.map((imgUrl, idx) => {
                const isSelected = selectedImage === imgUrl;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`rounded-xl overflow-hidden border p-1 bg-white dark:bg-slate-900 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-500/40 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-400'
                    }`}
                  >
                    <ImageWithFallback
                      src={imgUrl}
                      alt={`${product.title} preview ${idx + 1}`}
                      aspectRatio="square"
                      fit="contain"
                      padding="p-1"
                      className="rounded-lg"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Information, Pricing, Stock & Assurance */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            {/* Category & SKU Bar */}
            <div className="flex items-center gap-2 mb-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                {formatCategory(product.category)}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500">ID #{product.id}</span>
              {product.sku && (
                <>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">SKU: {product.sku}</span>
                </>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {product.title}
            </h1>

            {product.brand && (
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                Manufactured by <span className="text-indigo-600 dark:text-indigo-400">{product.brand}</span>
              </p>
            )}

            {/* Rating Stars Bar */}
            <div className="mt-3 flex items-center gap-3">
              <RatingStars rating={product.rating} size="sm" />
              {product.reviews && (
                <span className="text-xs text-slate-400">
                  based on {product.reviews.length} verified review{product.reviews.length === 1 ? '' : 's'}
                </span>
              )}
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
                {formatCurrency(product.price)}
              </span>

              {originalPrice && (
                <span className="text-sm font-mono text-slate-400 line-through tabular-nums">
                  {formatCurrency(originalPrice)}
                </span>
              )}

              {product.discountPercentage > 0 && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                  Save {Math.round(product.discountPercentage)}%
                </span>
              )}
            </div>

            {/* Inventory Status Bar (Zero-Pill Discipline) */}
            <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${stockInfo.dotColor}`} />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {stockInfo.label}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                {product.availabilityStatus || `${product.stock} units available`}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Overview & Specifications
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Product Specifications Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {product.dimensions && (
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
                <div className="text-[10px] uppercase font-mono text-slate-400 mb-1">Dimensions</div>
                <div className="font-mono text-slate-700 dark:text-slate-300">
                  {product.dimensions.width} &times; {product.dimensions.height} &times; {product.dimensions.depth} cm
                </div>
              </div>
            )}

            {product.weight !== undefined && (
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
                <div className="text-[10px] uppercase font-mono text-slate-400 mb-1">Weight</div>
                <div className="font-mono text-slate-700 dark:text-slate-300">
                  {product.weight} kg
                </div>
              </div>
            )}

            {product.minimumOrderQuantity && (
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
                <div className="text-[10px] uppercase font-mono text-slate-400 mb-1">Min Order</div>
                <div className="font-mono text-slate-700 dark:text-slate-300">
                  {product.minimumOrderQuantity} units
                </div>
              </div>
            )}
          </div>

          {/* Assurances (Warranty, Shipping, Return Policy) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  {product.warrantyInformation || '1-Year Warranty'}
                </div>
                <div className="text-[10px] text-slate-400">Authentic guarantee</div>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <Truck className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  {product.shippingInformation || 'Standard Shipping'}
                </div>
                <div className="text-[10px] text-slate-400">Fast fulfillment</div>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <RotateCcw className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  {product.returnPolicy || '30-Day Returns'}
                </div>
                <div className="text-[10px] text-slate-400">Hassle-free return</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Customer Feedback & Reviews
            </h2>
            <p className="text-xs text-slate-400">
              Real verified user testimonials and quality ratings from DummyJSON
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Overall:</span>
            <RatingStars rating={product.rating} size="sm" />
          </div>
        </div>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.reviews.map((rev, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <RatingStars rating={rev.rating} size="xs" showScore={false} />
                    <span className="text-[10px] font-mono text-slate-400">
                      {formatDate(rev.date)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                      {rev.reviewerName}
                    </span>
                    {rev.reviewerLocation && (
                      <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                        <MapPin className="w-2.5 h-2.5 text-slate-400" />
                        {rev.reviewerLocation}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                    Verified Buyer
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            No customer reviews currently logged for this item.
          </div>
        )}
      </div>
    </div>
  );
};
