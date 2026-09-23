/**
 * @file indianCatalog.js
 * High-performance Indian Retail & Commerce Localization Engine:
 * - Real-time Indian Rupee (₹) conversion & formatting with Lakh/Crore compact notation
 * - Authentic product data integrity (preserves 1:1 image-to-title parity with DummyJSON)
 * - Studio-grade local photography presets for 1-click Indian product creation
 * - Indian verified customer review enrichment (Metro cities & verified buyer badges)
 * - Indian enterprise executive user profile mapping for authentication
 */

import boatImg from '../assets/images/product_boat_headphones_1790158616537.jpg';
import prestigeImg from '../assets/images/product_prestige_cookware_1790158633689.jpg';
import fabindiaImg from '../assets/images/product_fabindia_silk_1790158646904.jpg';
import tataTeaImg from '../assets/images/product_tata_tea_1790162571551.jpg';

// Standard commercial INR conversion rate: 1 USD ~ ₹85 INR
export const INR_CONVERSION_RATE = 85;

/**
 * Converts a price into an authentic Indian Rupee (₹) price.
 * Standardizes to clean consumer pricing (e.g. ₹849, ₹4,249, ₹11,049).
 * If the product is already priced in INR, preserves it.
 * @param {number|string} rawPrice
 * @param {boolean} isAlreadyINR
 * @returns {number}
 */
export const toIndianPrice = (rawPrice, isAlreadyINR = false) => {
  if (rawPrice === undefined || rawPrice === null || isNaN(rawPrice)) {
    return 0;
  }
  const num = Number(rawPrice);
  if (isAlreadyINR) {
    return Math.round(num);
  }
  return Math.round(num * INR_CONVERSION_RATE);
};

/**
 * Formats an amount in Indian Rupees (₹) using en-IN locale numbering (lakhs & thousands)
 * Example: 1499 -> "₹1,499", 125000 -> "₹1,25,000", 11049 -> "₹11,049"
 * @param {number} amount
 * @returns {string}
 */
export const formatIndianRupee = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats large figures into Indian financial compact notation (Lakhs / Crores)
 * Example: 450000 -> "₹4.50 Lakh", 12000000 -> "₹1.20 Cr"
 * @param {number} amount
 * @returns {string}
 */
export const formatIndianCompact = (amount) => {
  if (!amount || isNaN(amount)) return '₹0';
  const val = Number(amount);
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  }
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(2)} Lakh`;
  }
  return formatIndianRupee(val);
};

/**
 * Enriches a catalog product with Indian commerce currency (INR)
 * while strictly preserving authentic product title, brand, description, and high-resolution images.
 * @param {object} product
 * @returns {object}
 */
export const indianizeProduct = (product) => {
  if (!product) return product;

  // If already converted or explicitly flagged as INR, return as-is
  if (product._isIndianized || product.currency === 'INR') {
    return product;
  }

  const inrPrice = toIndianPrice(product.price);

  return {
    ...product,
    price: inrPrice,
    currency: 'INR',
    _isIndianized: true,
  };
};

/**
 * Verified Indian customer reviewer profiles & metro delivery hubs
 */
export const INDIAN_REVIEWERS = [
  { name: 'Aarav Sharma', location: 'Bengaluru, Karnataka' },
  { name: 'Ananya Iyer', location: 'Chennai, Tamil Nadu' },
  { name: 'Rohan Verma', location: 'New Delhi, NCR' },
  { name: 'Pooja Mukherjee', location: 'Kolkata, West Bengal' },
  { name: 'Vikramaditya Singh', location: 'Jaipur, Rajasthan' },
  { name: 'Neha Patel', location: 'Ahmedabad, Gujarat' },
  { name: 'Aditya Nair', location: 'Kochi, Kerala' },
  { name: 'Sneha Kulkarni', location: 'Pune, Maharashtra' },
  { name: 'Karan Malhotra', location: 'Mumbai, Maharashtra' },
  { name: 'Meera Sen', location: 'Hyderabad, Telangana' },
  { name: 'Arjun Kapoor', location: 'Chandigarh' },
  { name: 'Divya Deshmukh', location: 'Nagpur, Maharashtra' },
];

/**
 * Maps a customer review to an authentic Indian verified buyer profile
 * @param {object} review
 * @param {number} index
 * @returns {object}
 */
export const indianizeReview = (review, index = 0) => {
  if (!review) return review;
  const reviewerMeta = INDIAN_REVIEWERS[index % INDIAN_REVIEWERS.length];
  return {
    ...review,
    reviewerName: review.reviewerName || reviewerMeta.name,
    reviewerLocation: review.reviewerLocation || reviewerMeta.location,
    isVerifiedBuyer: true,
  };
};

/**
 * Curated authentic Indian product presets for 1-click addition in ProductFormModal
 */
export const INDIAN_PRODUCT_PRESETS = [
  {
    title: 'boAt Rockerz 550 Over-Ear Wireless Bluetooth Headphones',
    brand: 'boAt',
    category: 'mobile-accessories',
    price: '1999',
    stock: '45',
    discountPercentage: '15',
    thumbnail: boatImg,
    description: '50mm dynamic drivers, physical noise isolation, up to 20 hours playback time, and ergonomic plush ear cushions.',
  },
  {
    title: 'Prestige Deluxe Alpha Stainless Steel Pressure Cooker (5L)',
    brand: 'Prestige',
    category: 'kitchen-accessories',
    price: '2890',
    stock: '30',
    discountPercentage: '10',
    thumbnail: prestigeImg,
    description: 'Alpha base suitable for induction and gas cooktops. Durable 304 food-grade stainless steel with pressure indicator.',
  },
  {
    title: 'FabIndia Handcrafted Chanderi Silk Kurta',
    brand: 'FabIndia',
    category: 'mens-shirts',
    price: '2990',
    stock: '25',
    discountPercentage: '12',
    thumbnail: fabindiaImg,
    description: 'Authentic Indian artisan handloom silk crafted in Madhya Pradesh. Breathable weave with regal festive finish.',
  },
  {
    title: 'Tata Tea Gold Royal Assam & Darjeeling Tea (500g)',
    brand: 'Tata Consumer',
    category: 'groceries',
    price: '485',
    stock: '80',
    discountPercentage: '5',
    thumbnail: tataTeaImg,
    description: 'Exquisite blend of rich Assam CTC teas with 15% gently rolled long Darjeeling orthodox leaves for aroma.',
  },
];

/**
 * Indian enterprise retail user accounts for 1-click authentication
 */
export const INDIAN_DEMO_USERS = [
  {
    username: 'emilys',
    password: 'emilyspass',
    displayName: 'Priya Sharma',
    role: 'Head of Inventory & Retail',
    location: 'Mumbai HQ',
  },
  {
    username: 'michaelw',
    password: 'michaelwpass',
    displayName: 'Aarav Mehta',
    role: 'Store Operations Lead',
    location: 'Bengaluru Tech Park',
  },
  {
    username: 'kristoc',
    password: 'kristocpass',
    displayName: 'Rohan Verma',
    role: 'Regional Merchandiser',
    location: 'Delhi NCR Hub',
  },
  {
    username: 'sophiab',
    password: 'sophiabpass',
    displayName: 'Ananya Iyer',
    role: 'Senior Catalog Analyst',
    location: 'Chennai Central',
  },
];

/**
 * Returns Indian executive profile matching the logged-in DummyJSON username
 * @param {string} username
 * @returns {object|null}
 */
export const getIndianProfile = (username) => {
  if (!username) return null;
  return INDIAN_DEMO_USERS.find((u) => u.username.toLowerCase() === username.toLowerCase()) || null;
};
