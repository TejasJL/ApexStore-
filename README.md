# ApexStore — Product Admin Dashboard

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Axios](https://img.shields.io/badge/Axios-1.20-5A29E4?logo=axios&logoColor=white)](https://axios-http.com/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A production-grade, highly responsive product catalog and inventory management admin dashboard built from first principles using **React 19**, **Tailwind CSS v4**, and **Axios**, powered by the free [DummyJSON REST API](https://dummyjson.com).

Designed and engineered with strict adherence to zero-third-party query/table/pagination library constraints, resilient dual-shield race condition immunity, bidirectional URL state synchronization, and an authentic session persistence overlay.

---

## 🔗 Submission Links

- **GitHub Repository**: [https://github.com/TejasJL/ApexStore-.git](https://github.com/TejasJL/ApexStore-.git)
- **Live Demo Deployment**: [apexstore-phi.vercel.app](apexstore-phi.vercel.app)
- **API Documentation**: [DummyJSON Docs](https://dummyjson.com/docs)

---

## 📑 Required Assignment Reflection

### 1. Key Architectural Choices & Rationale
- **Centralized Axios Architecture (`src/api/axios.js`)**: Rather than scattering raw fetch or Axios calls across UI components, a single shared Axios instance was created. It attaches the user's Bearer JWT authentication token to every outgoing request via a request interceptor, standardizes error responses, automatically handles 401 session expirations, and gracefully filters out aborted requests.
- **Pure First-Principles Implementation (Zero Third-Party Query/Table Libraries)**: In strict compliance with the assignment rules forbidding React Query, SWR, TanStack Table, or pagination packages, all data synchronization, cache revalidation, debounce timers, table sorting, and pagination logic were authored directly using React 19 core hooks (`useState`, `useEffect`, `useRef`, `useCallback`, `useTransition`) and Context API.
- **Hybrid Resolution for Category + Search Conflict**: DummyJSON does not support simultaneous search (`/products/search?q=`) and category filtering (`/products/category/:category`). When both criteria are active, our engine retrieves candidate items matching the search query and applies client-side category filtering and sorting. An in-app alert banner (`CategorySearchAlert`) transparently communicates this behavior to the user.
- **Session Mutation Overlay (`ProductMutationContext.jsx`)**: Because DummyJSON is a read-only mock API that does not persist `POST`, `PUT`, or `DELETE` operations, a local `sessionStorage` mutation overlay was architected. Real HTTP requests are executed to verify status codes, and successful changes are seamlessly overlaid on top of API responses. Newly added items appear at the top of Page 1, updates reflect instantaneously across catalog and detail views, and deleted items are filtered out across all views.
- **Bidirectional URL State Persistence**: All catalog parameters (`page`, `limit`, `q`, `category`, `sortBy`, `order`, `delay`) and routes (`/products/:id`) synchronize with the browser address bar via the History API. Bookmarking, refreshing, or sharing links restores the exact view, and corrupted or out-of-range parameters (`?page=abc`, `?page=999`) are defensively handled without crashing the page.

### 2. Technical Challenge Faced & Resolution
- **Challenge**: **Out-of-Order Race Conditions During Rapid Search Typing**.  
  When typing quickly into a search field (e.g. typing "p" followed by "phone"), multiple asynchronous HTTP requests are dispatched in rapid succession. If the earlier request (for "p") experiences higher network latency than the later request (for "phone"), the older response can resolve last and overwrite newer results with stale data.
- **Resolution**: We engineered a **Dual-Shield Defense System**:
  1. **Network Abort Controller**: An `AbortController` signal is bound to every Axios request. On every new keystroke or filter change, any pending in-flight request is immediately canceled via `abortController.abort()`.
  2. **Monotonic Sequence Counter (`requestIdRef`)**: To guard against edge cases where network caches or transport delays deliver aborted payloads, a monotonic counter tracks each issued request. When an asynchronous response resolves, the hook checks `if (currentRequestId !== requestIdRef.current) return;`. Stale responses are safely discarded.
  3. **Simulated Delay Testing**: A dedicated header toggle allows injecting `&delay=2000` into DummyJSON requests to verify in real time that typing quickly never results in stale data overwriting fresh results.

### 3. Where AI Assisted in Development
In accordance with assignment transparency guidelines, AI was utilized as an engineering pair-programming assistant for:
- **Pagination Boundary Mathematics**: Assisting in formalizing zero-defect mathematical formulas for dynamic pagination windowing, ellipsis placement, and defensive bounds clamping (`startItem = total === 0 ? 0 : Math.min(skip + 1, total)`).
- **Architectural Validation of Race Condition Immunity**: Validating the dual-shield pattern combining standard DOM `AbortController` cancellation with React's `useRef` sequence counter to eliminate edge-case timing vulnerabilities.
- **Accessible UI Scaffolding**: Accelerating boilerplate for WCAG-compliant modal dialogues (focus trapping, Escape key listeners, backdrop dismissal) and responsive Tailwind CSS layout switching between desktop tables and mobile card grids.
- **Edge-Case Brainstorming**: Identifying critical edge cases such as malformed query strings (`?page=abc`, `?page=999`), rapid multi-click submission prevention, and Single-Page Application (SPA) route reloading on static hosts.

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher (v22+ recommended)
- **npm**: v9.0.0 or higher

### Installation & Execution

```bash
# 1. Clone the repository
git clone https://github.com/TejasJL/ApexStore-.git


# 2. Install project dependencies
npm install

# 3. Start local development server (runs on port 3000)
npm run dev

# 4. Verify code quality & production build
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

## 📦 Requirements & Compliance Matrix

| Assignment Requirement | Implementation Detail | Status |
| :--- | :--- | :---: |
| **Authentication Page** | Validates against `POST /auth/login`. Displays error alert on bad credentials. Blocks unauthenticated access. Includes dedicated Sign Out action. | ✅ Complete |
| **Product List Display** | Shows Image, Title, Category, Price, Rating, and Stock. Uses high-density table on desktop and responsive cards on mobile. | ✅ Complete |
| **First-Principles Pagination** | Loads data page-by-page via `limit` and `skip`. Displays page numbers, Prev/Next, page sizes (10, 20, 50), and exact label: `Showing 21–40 of 194`. | ✅ Complete |
| **Debounced Search Engine** | Integrates `/products/search?q=`. Implements 350ms input debounce. Automatically resets pagination to Page 1 on query changes. | ✅ Complete |
| **Category Filtering & Sorting** | Fetches categories from `/products/categories`. Supports multi-column sorting by Price, Rating, or Title with asc/desc direction toggle. | ✅ Complete |
| **Product Details View** | Deep-linked at `/products/:id` with interactive multi-image switcher, full technical specs, and customer reviews. Shows dedicated 404 screen for wrong IDs. | ✅ Complete |
| **Add, Edit & Delete** | Validated form modal (title ≥ 3 chars, price > 0, stock ≥ 0, category required). Accessible delete confirmation popup dialog. | ✅ Complete |
| **Complete UI States** | Shimmer skeleton loaders during data fetch, clean empty state when no items match filters, and error state banner with a 1-click `Retry` button. | ✅ Complete |
| **Shared Axios Setup** | Single central client (`src/api/axios.js`). Injects Bearer token into headers. Handles errors and 401 unauthorization globally. | ✅ Complete |
| **URL State Synchronization** | Keeps page, search, filter, and sort values in URL search parameters. Supports browser Back/Forward navigation and refresh preservation. | ✅ Complete |
| **Zero Third-Party Query/Table** | No React Query, SWR, TanStack Table, or pagination libraries. 100% custom-crafted hooks and components. | ✅ Complete |
| **Clean Architecture** | Zero API calls inside UI code. All endpoints isolated in `src/api/`. Decoupled modular components. | ✅ Complete |
| **Race Condition Immunity** | Old search results never overwrite new ones under erratic network latency. Built-in `&delay=2000` toggle for live verification. | ✅ Complete |
| **Wrong URL Values Resilience** | Corrupted parameters like `?page=abc` default safely to 1. `?page=999` displays informative out-of-range feedback with a 1-click Return to Page 1 button. | ✅ Complete |
| **Rapid Submission Throttling** | Submit and Login buttons are disabled with submission locks during in-flight requests, preventing duplicate API dispatches. | ✅ Complete |

---

## 📁 Project Architecture & Directory Layout

```
├── public/
│   └── _redirects                                # Netlify SPA rewrite configuration (/* /index.html 200)
├── src/
│   ├── api/
│   │   ├── axios.js                              # Shared Axios client with Bearer token & error interceptors
│   │   ├── auth.api.js                           # Authentication API module (POST /auth/login, GET /auth/me)
│   │   └── products.api.js                       # Products catalog CRUD, search, category & delay endpoints
│   ├── assets/
│   │   └── images/                               # Curated sample product imagery
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginPage.jsx                     # Authentication screen with 1-click credentials autofill
│   │   ├── common/
│   │   │   ├── ConfirmModal.jsx                  # Accessible delete confirmation dialog
│   │   │   ├── EmptyState.jsx                    # No results empty state with reset filter action
│   │   │   ├── ErrorState.jsx                    # Network error state with 1-click retry button
│   │   │   ├── ImageWithFallback.jsx             # Resilient image loader with skeleton shimmer & error fallback
│   │   │   ├── RatingStars.jsx                   # Fractional vector star rating component
│   │   │   └── SkeletonLoader.jsx                # Table row and card grid shimmer loaders
│   │   ├── docs/
│   │   │   └── ArchitectureModal.jsx             # In-app architecture transparency & compliance viewer
│   │   ├── layout/
│   │   │   ├── Header.jsx                        # Navigation header, user profile, theme toggle & Sign Out
│   │   │   └── MainLayout.jsx                    # Application layout wrapper
│   │   └── products/
│   │       ├── CatalogStatsBar.jsx               # Inventory KPI metrics bar & 2000ms delay simulator
│   │       ├── CategorySearchAlert.jsx           # Transparency notice for simultaneous search + category
│   │       ├── ProductCardGrid.jsx               # Responsive touch-friendly mobile card grid view
│   │       ├── ProductDetailsPage.jsx            # Deep-linked product detail view (/products/:id) with 404 recovery
│   │       ├── ProductFiltersBar.jsx             # Search input, category dropdown, sort options & view switcher
│   │       ├── ProductFormModal.jsx              # Add and Edit modal with live validation & live preview
│   │       ├── ProductPagination.jsx             # Custom pagination math, rows selector & ellipsis windowing
│   │       ├── ProductSpotlightCarousel.jsx      # Zero-dependency inventory spotlight carousel
│   │       └── ProductTable.jsx                  # High-density desktop data table with sort headers
│   ├── context/
│   │   ├── AuthContext.jsx                       # Global authentication state, session storage & logout mechanics
│   │   ├── ProductMutationContext.jsx            # SessionStorage mutation overlay (Add/Edit/Delete persistence)
│   │   └── ToastContext.jsx                      # Non-blocking alert toast notifications queue
│   ├── hooks/
│   │   ├── useDebounce.js                        # 350ms input debounce hook with cleanup
│   │   ├── useProducts.js                        # Dual-shield race condition engine & catalog data fetcher
│   │   └── useUrlState.js                        # Bidirectional URL search param synchronization hook
│   ├── utils/
│   │   ├── formatters.js                         # Currency, category name, date, and stock health formatters
│   │   ├── indianCatalog.js                      # Currency conversion helpers & preset templates
│   │   └── storage.js                            # Safe localStorage wrapper with try/catch guards
│   ├── App.jsx                                   # Root application coordinator & route renderer
│   ├── index.css                                 # Tailwind CSS v4 styling & dark theme definitions
│   └── main.jsx                                  # React 19 application mount point
├── .env.example                                  # Environment variable configuration template
├── .gitignore                                    # Production git exclusion patterns
├── index.html                                    # Application HTML entry point & typography preconnections
├── package.json                                  # Project manifest, clean dependencies & build scripts
├── tsconfig.json                                 # TypeScript compiler configuration & path aliases
├── vercel.json                                   # Vercel SPA route rewrite rules
└── vite.config.js                                # Vite bundler & Tailwind CSS v4 plugin pipeline
```

---
