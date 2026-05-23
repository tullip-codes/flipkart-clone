<div align="center">

# 🛒 Flipkart Clone

### A production-quality, fullstack e-commerce platform inspired by Flipkart
Built as part of the **Scaler SDE Intern Fullstack Assignment**

[![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

[Live Demo](#) · [API Docs](#) · [Report Bug](#)

</div>

---

## 📌 Table of Contents

- [Live Demo](#-live-demo)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Folder Structure](#-folder-structure)
- [Database Design](#-database-design)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [Local Development Setup](#-local-development-setup)
- [Deployment](#-deployment)
- [Engineering Decisions](#-engineering-decisions)
- [Future Improvements](#-future-improvements)
- [Author](#-author)

---

## 🚀 Live Demo

| Service    | URL                                      |
|------------|------------------------------------------|
| Frontend   | [flipkart-clone.vercel.app](#)           |
| Backend API| [api.flipkart-clone.onrender.com](#)     |
| API Docs   | [/docs](#) (FastAPI Swagger UI)          |

### Demo Credentials

```
Email:    demo@flipkartclone.com
Password: Demo@1234
```

> A pre-seeded guest account with sample cart and order history is available for evaluation.

---

## 📸 Screenshots

### Homepage
![Homepage](./docs/homepage.png)

### Product Listing
![Product Listing](./docs/products.png)

### Product Detail Page
![Product Detail](./docs/product-detail.png)

### Shopping Cart
![Cart](./docs/cart.png)

### Checkout
![Checkout](./docs/checkout.png)

### Wishlist
![Wishlist](./docs/wishlist.png)

### Order History
![Order History](./docs/orders.png)

---

## ✨ Features

### Core Features

| Feature | Description |
|---|---|
| **Product Listing** | Grid layout with Flipkart-inspired product cards, pagination, and loading skeletons |
| **Search & Filter** | Real-time search by name, filter by category, sort by price/rating/discount |
| **Product Detail** | Image carousel, specifications table, stock status, rating display |
| **Shopping Cart** | Add/update/remove items, quantity controls, live subtotal calculation, delivery pricing |
| **Checkout Flow** | Address form with validation, payment method selection, order summary |
| **Order Placement** | Atomic cart-to-order conversion, unique order ID generation, cart auto-clear |
| **Order History** | Full order listing and per-order detail view with item snapshots |
| **Authentication** | JWT-based signup/login, protected routes, persistent sessions via localStorage |

### Bonus Features

| Feature | Description |
|---|---|
| **Wishlist** | Add/remove products, persisted per user |
| **Email Notifications** | Order confirmation emails via Resend API |
| **Responsive Design** | Full mobile, tablet, and desktop support using Tailwind responsive utilities |
| **Loading States** | Skeleton loaders and spinner states across all async operations |
| **Empty States** | Dedicated UI for empty cart, wishlist, and order history |

---

## 🛠 Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend Framework | Next.js 14 (App Router) | SSR/SSG for SEO, file-based routing, server components |
| Language | TypeScript | Type safety across frontend, reduces runtime bugs |
| Styling | Tailwind CSS v3.4.3 | Utility-first, no CSS bloat, responsive by default |
| Backend Framework | FastAPI | High performance, automatic OpenAPI docs, Pythonic |
| ORM | SQLAlchemy | Declarative models, relationship management, migration-ready |
| Database | PostgreSQL (Supabase) | Relational integrity, foreign keys, production-hosted |
| Auth | JWT (python-jose + bcrypt) | Stateless, scalable, standard for REST APIs |
| Email | Resend API | Developer-friendly transactional email service |
| Frontend Deploy | Vercel | Zero-config Next.js deployment, CDN-backed |
| Backend Deploy | Render / Railway | Managed Python hosting with auto-deploy from GitHub |

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                     │
│  Next.js 14 App Router · TypeScript · Tailwind CSS          │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │Components│  │  Hooks   │  │ Services │   │
│  │ /app     │  │/components│ │ useCart  │  │ api.ts   │   │
│  │ /products│  │  product/ │ │ useOrders│  │ authApi  │   │
│  │ /cart    │  │  cart/    │ │ useAuth  │  │          │   │
│  │ /checkout│  │  common/  │ └──────────┘  └────┬─────┘   │
│  │ /orders  │  └──────────┘                     │         │
│  └──────────┘                                   │ fetch()  │
└─────────────────────────────────────────────────┼─────────┘
                                                  │ HTTP/JSON
┌─────────────────────────────────────────────────┼─────────┐
│                   FastAPI Backend                │         │
│                                                 ▼         │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐    │
│  │  Routes  │→ │ Services │→ │  SQLAlchemy Models   │    │
│  │/products │  │ product_ │  │  User, Product       │    │
│  │/cart     │  │  service │  │  CartItem, Order     │    │
│  │/orders   │  │ cart_    │  │  OrderItem, Category │    │
│  │/auth     │  │  service │  │  WishlistItem        │    │
│  │/wishlist │  │ order_   │  └──────────┬───────────┘    │
│  └──────────┘  │  service │             │                 │
│                └──────────┘             │ SQLAlchemy ORM  │
└─────────────────────────────────────────┼─────────────────┘
                                          │
                              ┌───────────▼───────────┐
                              │  PostgreSQL (Supabase) │
                              │  Hosted · Managed      │
                              └───────────────────────┘
```

### Key Design Principles

- **Separation of concerns** — routes handle HTTP, services handle business logic, models handle data
- **Modular frontend** — each feature (cart, orders, products) has its own components, hooks, and API slice
- **Centralised API layer** — all `fetch` calls live in `services/api.ts`; no ad-hoc fetching in components
- **Immutable order history** — `OrderItem` snapshots `title` and `unit_price` at purchase time; price changes never corrupt history
- **Atomic order placement** — cart → order conversion and cart clear happen in a single DB transaction

---

## 📁 Folder Structure

```
flipkart-clone/
├── frontend/                        # Next.js 14 application
│   ├── app/                         # App Router pages
│   │   ├── auth/                    # Login & signup pages
│   │   ├── products/                # Product listing + [id] detail
│   │   ├── cart/                    # Cart page
│   │   ├── checkout/                # Checkout page
│   │   ├── orders/                  # Order history + [orderNumber] detail
│   │   ├── wishlist/                # Wishlist page
│   │   ├── layout.tsx               # Root layout with providers
│   │   └── page.tsx                 # Homepage
│   ├── components/                  # Reusable UI components
│   │   ├── common/                  # Button, Input, Loader, Pagination, etc.
│   │   ├── product/                 # ProductCard, ImageCarousel, ProductActions
│   │   ├── cart/                    # CartItemCard, CartSummaryPanel, EmptyCart
│   │   ├── layout/                  # MainLayout, HeroBanner, CategorySection
│   │   ├── navbar/                  # Navigation bar
│   │   └── footer/                  # Footer
│   ├── hooks/                       # Custom React hooks
│   │   ├── useCart.ts               # Cart state + mutations
│   │   └── useOrders.ts             # Order history fetching
│   ├── services/                    # API layer
│   │   ├── api.ts                   # Product, Cart, Order API calls
│   │   └── authApi.ts               # Auth API + token storage helpers
│   ├── types/                       # TypeScript interfaces
│   │   ├── product.ts
│   │   ├── auth.ts
│   │   └── order.ts
│   ├── utils/                       # Pure utility functions
│   │   ├── formatters.ts            # Price, date, stock formatting
│   │   └── order.ts                 # Order status labels/colors
│   └── context/
│       └── AuthContext.tsx          # Global auth state provider
│
├── backend/                         # FastAPI application
│   ├── app/
│   │   ├── database/                # DB connection, session, base
│   │   ├── models/                  # SQLAlchemy ORM models
│   │   │   ├── user.py
│   │   │   ├── product.py
│   │   │   ├── category.py
│   │   │   ├── cart.py
│   │   │   ├── order.py
│   │   │   └── wishlist.py
│   │   ├── schemas/                 # Pydantic request/response schemas
│   │   ├── routes/                  # FastAPI route handlers
│   │   ├── services/                # Business logic layer
│   │   ├── utils/                   # Auth utilities (JWT, hashing)
│   │   └── main.py                  # App factory + router registration
│   ├── scripts/
│   │   └── seed.py                  # Database seeding script
│   ├── .env                         # Environment variables
│   └── requirements.txt
│
└── docs/                            # Screenshots for README
```

---

## 🗄 Database Design

### Entity Relationship Summary

```
users ──────┬────── cart_items ────── products ────── categories
            │
            ├────── orders ─────────── order_items ── products
            │
            └────── wishlist_items ─── products
```

### Tables

| Table | Purpose | Key Columns |
|---|---|---|
| `users` | Registered accounts | `id`, `email`, `full_name`, `hashed_password`, `is_guest` |
| `categories` | Product categories | `id`, `name`, `slug`, `icon_url` |
| `products` | Product catalogue | `id`, `title`, `price`, `original_price`, `discount_percent`, `stock`, `category_id` |
| `cart_items` | Active user cart | `id`, `user_id`, `product_id`, `quantity` |
| `orders` | Placed orders | `id`, `order_number`, `user_id`, `grand_total`, `status`, `shipping_address` (JSON), `payment_method` |
| `order_items` | Per-order line items | `id`, `order_id`, `product_id`, `title`*, `unit_price`*, `quantity` |
| `wishlist_items` | Saved products | `id`, `user_id`, `product_id` |

> \* `title` and `unit_price` on `order_items` are **snapshotted at purchase time** — product price changes do not affect historical orders.

### Design Decisions

- **Shipping address as JSON column** on `orders` — avoids an extra `addresses` table for a simple struct; easy to extend later
- **Denormalised order items** — price and title copied at checkout; ensures immutable order history
- **Soft categorisation** — products have an optional `category_id`; uncategorised products still list correctly
- **`is_guest` flag on users** — allows seeding a default user without a password for demo purposes

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/v1/auth/signup` | Register new user, returns JWT | ❌ |
| POST | `/api/v1/auth/login` | Login, returns JWT | ❌ |
| GET | `/api/v1/auth/me` | Get current user profile | ✅ |

### Products

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/v1/products` | List products (search, filter, sort, paginate) | ❌ |
| GET | `/api/v1/products/{id}` | Get product detail | ❌ |
| GET | `/api/v1/products/featured` | Get featured products for homepage | ❌ |
| GET | `/api/v1/categories` | List all categories | ❌ |

### Cart

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/v1/cart` | Get cart with summary | ✅ |
| POST | `/api/v1/cart` | Add item (increments if exists) | ✅ |
| PATCH | `/api/v1/cart/{item_id}` | Update quantity | ✅ |
| DELETE | `/api/v1/cart/{item_id}` | Remove single item | ✅ |
| DELETE | `/api/v1/cart` | Clear entire cart | ✅ |

### Orders

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/v1/orders` | Place order from cart (atomically clears cart) | ✅ |
| GET | `/api/v1/orders` | Get user's order history | ✅ |
| GET | `/api/v1/orders/{order_number}` | Get single order detail | ✅ |

### Wishlist

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/v1/wishlist` | Get user's wishlist | ✅ |
| POST | `/api/v1/wishlist/{product_id}` | Add to wishlist | ✅ |
| DELETE | `/api/v1/wishlist/{product_id}` | Remove from wishlist | ✅ |

> Full interactive API documentation available at `/docs` (Swagger UI) and `/redoc` when the backend is running.

---

## 🔐 Environment Variables

### Backend — `backend/.env`

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/dbname

# JWT
JWT_SECRET_KEY=your-super-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxx
FROM_EMAIL=orders@yourdomain.com
```

### Frontend — `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## 💻 Local Development Setup

### Prerequisites

- Node.js ≥ 18
- Python ≥ 3.11
- PostgreSQL (or a Supabase project)

### 1. Clone the repository

```bash
git clone https://github.com/harshitaydavv/flipkart-clone.git
cd flipkart-clone
```

### 2. Backend setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET_KEY

# Seed the database with sample products and categories
python scripts/seed.py

# Start the development server
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`
Swagger docs at `http://localhost:8000/docs`

### 3. Frontend setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Start the development server
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## 🚢 Deployment

### Frontend → Vercel

1. Push repository to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com)
3. Set root directory to `frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL=<your-render-backend-url>/api/v1`
5. Deploy — Vercel auto-detects Next.js configuration

### Backend → Render

1. Create a new **Web Service** in [Render Dashboard](https://render.com)
2. Connect your GitHub repository
3. Set root directory to `backend`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add all environment variables from `backend/.env`

### Database → Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy the **Connection String** (Session Mode) from Project Settings → Database
3. Set it as `DATABASE_URL` in both local `.env` and Render environment variables
4. Tables are created automatically on first startup via `Base.metadata.create_all`

---

## 🧠 Engineering Decisions

| Decision | Rationale |
|---|---|
| **Next.js 14 over plain React** | App Router enables server components for SEO-critical pages (product listing, detail). Product pages are server-rendered for fast first paint and crawlability. |
| **FastAPI over Django/Express** | FastAPI's async-first design, automatic OpenAPI generation, and Pydantic validation made it the right fit for a clean REST API. Django was overkill for this scope. |
| **PostgreSQL over MongoDB** | The data is inherently relational — users have orders, orders have items, products have categories. RDBMS enforces integrity at the DB level, not the application layer. |
| **SQLAlchemy ORM** | Declarative models make relationships explicit and readable. `create_all` made local table management frictionless during development. |
| **Tailwind CSS** | Utility-first approach kept styling co-located with markup. No context switching between CSS files. Responsive utilities (`sm:`, `lg:`) made mobile-first layout straightforward. |
| **JWT in localStorage** | Acceptable for this scope. Token key is centralised (`TOKEN_KEY` constant) to avoid drift. In production, `httpOnly` cookies would be used. |
| **Modular service layer** | Business logic is separated from route handlers in every module. Routes handle HTTP concerns only; services are independently testable and reusable. |
| **Immutable OrderItems** | `unit_price` and `title` are snapshotted at checkout. This is standard e-commerce practice — price changes must never alter historical records. |
| **Atomic order placement** | Cart-to-order conversion and cart clearing happen in a single `db.flush()` + `db.commit()` transaction. Either everything succeeds or nothing does. |

---

## 🔭 Future Improvements

- **Alembic migrations** — replace `create_all` with proper schema versioning for production
- **Redis cart** — move cart to Redis for sub-millisecond reads; sync to DB on checkout
- **Product reviews** — ratings and review text per product, per user
- **Admin dashboard** — product management, order status updates, inventory tracking
- **Real payment gateway** — Razorpay or Stripe integration for actual payment processing
- **httpOnly cookie auth** — replace localStorage JWT with secure, httpOnly cookies
- **Image uploads** — Cloudinary or S3 integration for product image management
- **Search service** — Elasticsearch or Typesense for full-text product search at scale
- **Unit + integration tests** — pytest for backend services, Jest for frontend hooks

---

## 👩‍💻 Author

**Harshita Yadav**
B.Tech, IIIT Kota · SDE Intern Candidate

[![GitHub](https://img.shields.io/badge/GitHub-harshitaydavv-181717?style=flat-square&logo=github)](https://github.com/harshitaydavv)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Harshita_Yadav-0077B5?style=flat-square&logo=linkedin)](https://linkedin.com/in/harshitayadav)

---

<div align="center">

Built with 💙 for the **Scaler SDE Intern Fullstack Assignment**

*If you're evaluating this project — thank you for your time. I'm happy to walk through any part of the codebase.*

</div>