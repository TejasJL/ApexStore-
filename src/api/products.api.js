/**
 * @file products.api.js
 * Dedicated API module for product catalog management using DummyJSON.
 * Supports abort signals for race-condition prevention, search, category filtering,
 * sorting, pagination, and simulated delay testing.
 */

import apiClient from './axios.js';

export const productsApi = {
  /**
   * Fetch paginated list of products with optional sort, search, or category filter.
   * @param {object} options
   * @returns {Promise<{ products: any[]; total: number; skip: number; limit: number }>}
   */
  async getProducts(options = {}) {
    const {
      limit = 10,
      skip = 0,
      q = '',
      category = '',
      sortBy,
      order,
      delay,
      signal,
    } = options;

    const params = {
      limit,
      skip,
    };

    if (sortBy) {
      params.sortBy = sortBy;
    }
    if (order) {
      params.order = order;
    }
    if (delay && delay > 0) {
      params.delay = delay;
    }

    // Determine target endpoint based on query conditions
    let endpoint = '/products';

    if (q && q.trim().length > 0) {
      // Search endpoint: /products/search?q=...
      endpoint = '/products/search';
      params.q = q.trim();
    } else if (category && category !== 'all') {
      // Category endpoint: /products/category/:category
      endpoint = `/products/category/${encodeURIComponent(category)}`;
    }

    const response = await apiClient.get(endpoint, {
      params,
      signal,
    });

    return response.data;
  },

  /**
   * Fetch all product categories
   * @returns {Promise<Array<{ slug: string; name: string; url?: string }>>}
   */
  async getCategories() {
    const response = await apiClient.get('/products/categories');

    // Normalize response: DummyJSON returns objects [{ slug, name, url }] or strings
    return response.data.map((cat) => {
      if (typeof cat === 'string') {
        const readable = cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        return { slug: cat, name: readable };
      }
      return {
        slug: cat.slug,
        name: cat.name || cat.slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        url: cat.url,
      };
    });
  },

  /**
   * Fetch single product by numeric or string ID
   * @param {number|string} id
   * @param {number} [delay]
   * @returns {Promise<any>}
   */
  async getProductById(id, delay) {
    const params = {};
    if (delay && delay > 0) {
      params.delay = delay;
    }

    const response = await apiClient.get(`/products/${id}`, { params });
    return response.data;
  },

  /**
   * Create a new product (POST /products/add)
   * @param {any} data
   * @returns {Promise<any>}
   */
  async createProduct(data) {
    const response = await apiClient.post('/products/add', data);
    return response.data;
  },

  /**
   * Update an existing product (PUT /products/:id)
   * @param {number} id
   * @param {any} data
   * @returns {Promise<any>}
   */
  async updateProduct(id, data) {
    const response = await apiClient.put(`/products/${id}`, data);
    return response.data;
  },

  /**
   * Delete a product (DELETE /products/:id)
   * @param {number} id
   * @returns {Promise<{ id: number; isDeleted: boolean; deletedOn?: string }>}
   */
  async deleteProduct(id) {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },
};
