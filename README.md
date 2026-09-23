# ApexStore — Product Admin Dashboard

A production-grade, responsive product catalog and inventory management dashboard built with **React 19**, **Tailwind CSS v4**, and **Axios**, powered by the free [DummyJSON REST API](https://dummyjson.com).

---

## ⚡ Quick Start & Setup Steps

Follow these simple steps to run the application locally:

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/product-admin-dashboard.git
cd product-admin-dashboard

# 2. Install dependencies
npm install

# 3. Start the local development server (runs on port 3000)
npm run dev

# 4. Run codebase verification and production build
npm run lint
npm run build

# 5. Preview production build locally
npm run preview
```

### 🔐 Test Credentials (DummyJSON Auth)
- **Username**: `emilys`
- **Password**: `emilyspass`
- **1-Click Autofill**: Quick-fill demo account buttons are provided directly on the login screen for instant evaluation.

---

## 📦 Finished Deliverables & Compliance Checklist

All assignment specifications and rules are implemented from first principles (zero third-party query, table, or pagination libraries):

- [x] **1. Authentication & Session Management**
  - [x] Protected routes preventing unauthorized access to product views.
  - [x] Authentic API login via `POST https://dummyjson.com/auth/login`.
  - [x] Visual error banners displaying DummyJSON validation failures for incorrect credentials.
  - [x] Dedicated session purge and logout button in top navigation bar.
  - [x] Automatic session recovery and state hydration on refresh.

- [x] **2. Centralized Networking & Axios Interceptors**
  - [x] Single shared Axios configuration file (`src/api/axios.js`).
  - [x] Request interceptor automatically attaching `Authorization: Bearer <token>` to every outgoing request.
  - [x] Response interceptor standardizing error codes, broadcasting session expiration on `401 Unauthorized`, and handling network timeouts.
  - [x] Request cancellation handling (`axios.isCancel`) filtering out aborted requests from user error toasts.

- [x] **3. Product Presentation & Responsive Layout**
  - [x] Desktop high-density data table displaying Image, Title, Category, Price, Rating, and Stock.
  - [x] Mobile card grid layout automatically activated on smaller screens (`sm:hidden`).
  - [x] Zero-dependency spotlight carousel highlighting low-stock items and top-rated products.

- [x] **4. Custom First-Principles Pagination**
  - [x] Real API pagination using `limit` and `skip` query parameters (`skip = (page - 1) * limit`).
  - [x] Dynamic page numbers with ellipsis windowing (e.g. `1 ... 4 5 6 ... 20`).
  - [x] Previous and Next navigation buttons with boundary disabled states.
  - [x] Page size selector supporting `10`, `20`, and `50` rows per page.
  - [x] Exact specification text label: e.g. **`Showing 21–40 of 194`**.

- [x] **5. Debounced Search & Query Synchronization**
  - [x] Search endpoint integration (`/products/search?q=`).
  - [x] Custom `useDebounce` hook (350ms delay) preventing premature API calls while typing.
  - [x] Automatic pagination reset to Page 1 on any search query modification.
  - [x] Quick keyboard shortcut (`/` key) to focus search input.

- [x] **6. Category Filtering & Multi-Column Sorting**
  - [x] Dynamic category fetching from `/products/categories`.
  - [x] Column sorting by `price`, `rating`, or `title` with ascending/descending toggle.

- [x] **7. Full Product Details View (`/products/[id]`)**
  - [x] Dedicated route view with interactive image gallery, specifications, price breakdown, and customer reviews.
  - [x] Dedicated "Product Not Found" (404) screen for invalid or deleted IDs with a 1-click return to catalog.

- [x] **8. Product Management (Add, Edit & Delete)**
  - [x] Add/Edit modal with multi-field client-side validation (Title length ≥ 3, Price > 0, Stock ≥ 0, Category required).
  - [x] Accessible confirmation dialog (`ConfirmModal.jsx`) before deleting any product.
  - [x] Protection against multiple rapid clicks on Save and Login buttons.

- [x] **9. Complete State Feedback**
  - [x] Skeleton loaders for tables and cards during data fetching.
  - [x] Empty state screen with recovery actions when no items match filters.
  - [x] Error state screen with a 1-click `Retry` button on network failure.

- [x] **10. Defensive URL State Management**
  - [x] All parameters (`page`, `limit`, `q`, `category`, `sortBy`, `order`, `delay`) synchronized bidirectionally with browser URL.
  - [x] Corrupted URL values (e.g. `?page=abc`) safely clamped to defaults without breaking the page.
  - [x] Out-of-bounds page requests (e.g. `?page=999`) safely handled with clear recovery feedback.

---

## 🏛️ Technical Solutions to Assignment Challenges

### 1. Dual-Shield Race Condition Immunity on Fast Typing
**Problem**: When a user types rapidly (e.g. typing "p" followed by "phone"), earlier network requests with slower latency could resolve after later requests, overwriting fresh results with stale data.  
**Solution**: We implemented a two-tier defense mechanism in [`useProducts.js`](file:///c:/Users/Public/Nextgenesis%20Assignment/src/hooks/useProducts.js):
1. **Network Abort**: An `AbortController` signal is bound to every Axios request. As soon as the search query or filters change, `abortController.abort()` cancels in-flight HTTP requests.
2. **Monotonic Sequence Counter (`requestIdRef`)**: An incrementing counter tracks the latest issued request ID. When a response resolves, the hook checks `if (currentRequestId !== requestIdRef.current) return;`. Even if the browser network cache delays cancellation, outdated responses are safely discarded.
3. **Interactive Latency Tester**: A toggle button in the header injects `&delay=2000` into DummyJSON requests to visually verify race condition resilience.

### 2. Category Filter & Search Conflict Resolution
**Problem**: The DummyJSON API does not support combining `/products/search?q=...` and `/products/category/...` in a single query; the API ignores the category parameter when searching.  
**Solution**: When both search and category are active, the application queries `/products/search?q=...` for candidate products and executes category filtering on the client. An explanatory `<CategorySearchAlert />` banner transparently informs the user of this hybrid behavior and provides 1-click shortcuts to isolate search or category.

### 3. Add, Edit, and Delete Persistence Overlay
**Problem**: DummyJSON is a mock API and does not persist changes to its database on `POST`, `PUT`, or `DELETE`.  
**Solution**: We execute real Axios calls to DummyJSON's mutation endpoints to verify HTTP status codes. On success, [`ProductMutationContext.jsx`](file:///c:/Users/Public/Nextgenesis%20Assignment/src/context/ProductMutationContext.jsx) records the operation into a `sessionStorage` overlay. Newly created products prepend to Page 1, updates reflect immediately in catalog and detail views, and deleted IDs are filtered out dynamically across all pagination and search operations.

### 4. Where AI Assisted in Development
In accordance with assignment transparency guidelines, AI was utilized as an engineering accelerator in the following areas:
- **Pagination Boundary Edge Cases**: AI assisted in formalizing the mathematical windowing algorithm for pagination bounds and ellipsis generation (`totalPages`, `skip`, `Math.min(skip + limit, total)`), ensuring zero-based indexing bugs were eliminated.
- **Race Condition Architectural Design**: AI helped validate the dual-shield pattern combining standard DOM `AbortController` cancellation with a React `useRef` monotonic sequence counter to guarantee out-of-order response rejection.
- **Accessible UI Scaffolding**: AI accelerated the creation of accessible modal dialogues (Escape key listeners, focus management, backdrop clicks) and responsive Tailwind CSS layout switching between desktop tables and mobile cards.
- **Edge-Case Brainstorming**: AI assisted in cataloging edge cases such as malformed query strings (`?page=abc`, `?page=999`, negative limits), rapid duplicate submissions, and SPA route reloading on static hosting providers.

---

## 🚀 Deployment (Vercel & Netlify)

This repository includes pre-configured SPA routing rules:
- **Vercel**: Configured via [`vercel.json`](file:///c:/Users/Public/Nextgenesis%20Assignment/vercel.json) rewrite rules to route all subpaths (e.g. `/products/1`) to `/index.html`.
- **Netlify**: Configured via [`public/_redirects`](file:///c:/Users/Public/Nextgenesis%20Assignment/public/_redirects) (`/* /index.html 200`).

To deploy:
1. Import this repository into Vercel or Netlify.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.

---

## 🛠️ Verification & Quality Gates

- **Linter**: `npm run lint` — **0 errors, 0 warnings**.
- **Production Build**: `npm run build` — **Built in < 900ms**.
