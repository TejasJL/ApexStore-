/**
 * @file ProductFormModal.jsx
 * Validated modal dialog for adding new products and editing existing products.
 * Features:
 * - Real-time live product preview card
 * - Field-level validation (title >= 3 chars, price > 0, stock >= 0, category required)
 * - Image preset buttons for quick demo entry
 * - Double-click and spam protection on submit.
 */

import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { ImageWithFallback } from '../common/ImageWithFallback.jsx';
import { formatCurrency, formatCategory } from '../../utils/formatters.js';

import boatImg from '../../assets/images/product_boat_headphones_1790158616537.jpg';
import prestigeImg from '../../assets/images/product_prestige_cookware_1790158633689.jpg';
import fabindiaImg from '../../assets/images/product_fabindia_silk_1790158646904.jpg';
import tataTeaImg from '../../assets/images/product_tata_tea_1790162571551.jpg';

// Convenient Indian product presets for 1-click filling
const INDIAN_PRESETS = [
  {
    title: 'boAt Rockerz 550 Over-Ear Wireless Headphones',
    brand: 'boAt',
    category: 'mobile-accessories',
    price: '1999',
    stock: '25',
    discountPercentage: '15',
    thumbnail: boatImg,
    description: 'Dynamic 50mm drivers, physical noise isolation, up to 20 hours playback time, and ergonomic ear cushions.',
  },
  {
    title: 'Prestige Deluxe Alpha Stainless Steel Pressure Cooker (5L)',
    brand: 'Prestige',
    category: 'kitchen-accessories',
    price: '2890',
    stock: '20',
    discountPercentage: '10',
    thumbnail: prestigeImg,
    description: 'Alpha base suitable for induction and gas cooktops. Durable 304 food-grade stainless steel with pressure indicator.',
  },
  {
    title: 'FabIndia Handcrafted Chanderi Silk Kurta',
    brand: 'FabIndia',
    category: 'mens-shirts',
    price: '2990',
    stock: '15',
    discountPercentage: '12',
    thumbnail: fabindiaImg,
    description: 'Authentic Indian artisan handloom silk crafted in Madhya Pradesh. Breathable, festive elegance.',
  },
  {
    title: 'Tata Tea Gold Royal Assam & Darjeeling Tea (500g)',
    brand: 'Tata Consumer',
    category: 'groceries',
    price: '485',
    stock: '60',
    discountPercentage: '5',
    thumbnail: tataTeaImg,
    description: 'Exquisite blend of rich Assam CTC teas with 15% gently rolled long Darjeeling orthodox leaves for aroma.',
  },
];

const SAMPLE_IMAGE_PRESETS = [
  { label: 'boAt Audio', url: boatImg },
  { label: 'Prestige Cooker', url: prestigeImg },
  { label: 'FabIndia Silk', url: fabindiaImg },
  { label: 'Tata Tea', url: tataTeaImg },
];

export const ProductFormModal = ({
  isOpen,
  mode = 'create',
  initialProduct = null,
  categories = [],
  onSubmit,
  onClose,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    category: '',
    price: '',
    stock: '',
    discountPercentage: '',
    description: '',
    thumbnail: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialProduct) {
        setFormData({
          title: initialProduct.title || '',
          brand: initialProduct.brand || '',
          category: initialProduct.category || '',
          price: initialProduct.price !== undefined ? String(initialProduct.price) : '',
          stock: initialProduct.stock !== undefined ? String(initialProduct.stock) : '',
          discountPercentage:
            initialProduct.discountPercentage !== undefined
              ? String(initialProduct.discountPercentage)
              : '',
          description: initialProduct.description || '',
          thumbnail: initialProduct.thumbnail || (initialProduct.images && initialProduct.images[0]) || '',
        });
      } else {
        const defaultPreset = INDIAN_PRESETS[0];
        setFormData({
          title: defaultPreset.title,
          brand: defaultPreset.brand,
          category: defaultPreset.category,
          price: defaultPreset.price,
          stock: defaultPreset.stock,
          discountPercentage: defaultPreset.discountPercentage,
          description: defaultPreset.description,
          thumbnail: defaultPreset.thumbnail,
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, initialProduct, categories]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim() || formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long.';
    }

    const numPrice = parseFloat(formData.price);
    if (!formData.price || isNaN(numPrice) || numPrice <= 0) {
      newErrors.price = 'Price must be a valid number greater than 0.';
    }

    const numStock = parseInt(formData.stock, 10);
    if (formData.stock === '' || isNaN(numStock) || numStock < 0) {
      newErrors.stock = 'Stock must be 0 or a positive whole number.';
    }

    if (!formData.category) {
      newErrors.category = 'Please choose a category.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    const payload = {
      title: formData.title.trim(),
      brand: formData.brand.trim() || 'ApexStore Brand',
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : 0,
      description: formData.description.trim() || 'No description provided.',
      thumbnail: formData.thumbnail.trim() || SAMPLE_IMAGE_PRESETS[0],
      images: [formData.thumbnail.trim() || SAMPLE_IMAGE_PRESETS[0]],
      rating: initialProduct?.rating || 4.5,
      currency: 'INR',
      _isIndianized: true,
    };

    await onSubmit(payload);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div className="relative w-full max-w-3xl my-8 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              {mode === 'create' ? <Plus className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            </div>
            <div>
              <h3 id="product-modal-title" className="text-sm font-bold text-slate-900 dark:text-white">
                {mode === 'create' ? 'Add New Product to Catalog' : `Edit Product #${initialProduct?.id}`}
              </h3>
              <p className="text-[11px] text-slate-400">
                {mode === 'create'
                  ? 'Posts to /products/add and commits to local mutation overlay'
                  : 'Puts to /products/:id and synchronizes across views'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body with Two-Column Form & Live Preview */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 max-h-[75vh] overflow-y-auto">
            {/* Left: Input Fields */}
            <div className="md:col-span-7 space-y-4">
              {/* 1-Click Indian Catalog Presets */}
              <div className="p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  Quick Fill Indian Templates:
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {INDIAN_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setFormData({
                          title: preset.title,
                          brand: preset.brand,
                          category: preset.category,
                          price: preset.price,
                          stock: preset.stock,
                          discountPercentage: preset.discountPercentage,
                          description: preset.description,
                          thumbnail: preset.thumbnail,
                        });
                        setErrors({});
                      }}
                      className="text-left px-2 py-1.5 rounded-lg border border-indigo-200/60 dark:border-indigo-800/60 bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer"
                    >
                      <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                        {preset.brand}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        ₹{Number(preset.price).toLocaleString('en-IN')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Product Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Prestige Deluxe Cooker / boAt Headphones"
                  className={`w-full px-3 py-2 text-xs rounded-xl border bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 ${
                    errors.title
                      ? 'border-rose-300 focus:ring-rose-400'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500/40'
                  }`}
                />
                {errors.title && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.title}</p>
                )}
              </div>

              {/* Brand & Category Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Tata, boAt, FabIndia, Prestige"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name || formatCategory(c.slug)}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.category}</p>
                  )}
                </div>
              </div>

              {/* Price, Stock & Discount Row */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1999"
                    className={`w-full px-3 py-2 text-xs rounded-xl border bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono ${
                      errors.price
                        ? 'border-rose-300 focus:ring-rose-400'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500/40'
                    }`}
                  />
                  {errors.price && (
                    <p className="text-[10px] text-rose-500 mt-0.5">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Stock Units <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="25"
                    className={`w-full px-3 py-2 text-xs rounded-xl border bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono ${
                      errors.stock
                        ? 'border-rose-300 focus:ring-rose-400'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500/40'
                    }`}
                  />
                  {errors.stock && (
                    <p className="text-[10px] text-rose-500 mt-0.5">{errors.stock}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Discount %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    step="1"
                    value={formData.discountPercentage}
                    onChange={(e) =>
                      setFormData({ ...formData, discountPercentage: e.target.value })
                    }
                    placeholder="10"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
              </div>

              {/* Thumbnail URL & Presets */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Thumbnail Image URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <ImageIcon className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="url"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="https://cdn.dummyjson.com/...png"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                {/* Preset Chips */}
                <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-500" /> Presets:
                  </span>
                  {SAMPLE_IMAGE_PRESETS.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormData({ ...formData, thumbnail: preset.url })}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 font-mono cursor-pointer transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter detailed product description, specifications, and warranty info..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
                />
              </div>
            </div>

            {/* Right: Real-time Live Product Preview */}
            <div className="md:col-span-5 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <span>Live Product Preview</span>
                  <span className="text-[10px] font-mono text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 px-1.5 py-0.5 rounded">
                    Real-time
                  </span>
                </div>

                {/* Preview Card */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-xs">
                  <div className="rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 mb-2.5">
                    <ImageWithFallback
                      src={formData.thumbnail}
                      alt={formData.title || 'Product'}
                      aspectRatio="wide"
                    />
                  </div>

                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {formatCategory(formData.category) || 'Category'}
                  </div>

                  <div className="font-bold text-xs text-slate-900 dark:text-white truncate mt-0.5">
                    {formData.title || 'Product Title Goes Here'}
                  </div>

                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {formData.brand ? `by ${formData.brand}` : 'ApexStore Catalog'}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="font-mono font-bold text-sm text-slate-900 dark:text-white tabular-nums">
                      {formatCurrency(parseFloat(formData.price) || 0)}
                    </div>

                    <div className="text-[11px] font-mono text-slate-500">
                      {formData.stock || 0} in stock
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                  Changes made in this modal immediately reflect in the table, grid, and details views via the sessionStorage mutation overlay.
                </p>
              </div>

              {/* Action Buttons inside footer */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-3 py-2 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : mode === 'create' ? (
                    <Plus className="w-3.5 h-3.5" />
                  ) : (
                    <Edit2 className="w-3.5 h-3.5" />
                  )}
                  {isSubmitting
                    ? 'Saving...'
                    : mode === 'create'
                    ? 'Add Product'
                    : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
