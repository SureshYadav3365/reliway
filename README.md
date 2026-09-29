# ShopEase — Full-Stack E-Commerce Platform (Single Service)

> **"Everything You Need, All in One Place"**

ShopEase is a full-stack, enterprise-grade e-commerce application built as **ONE SINGLE PROJECT** deployable as **ONE SERVICE on Railway**.

It combines a **React + Vite** frontend and a **Node.js + Express + MongoDB** backend in a single root repository where Express serves the production-compiled React frontend alongside all REST APIs.

---

## 🏗️ Architecture: Single Root Project

```text
ecommerce/
├── frontend/
│   ├── src/                # React 18 + Vite frontend source code
│   │   ├── components/     # Reusable UI components (Navbar, Footer, ProductCard, Modals, etc.)
│   │   ├── pages/          # Customer & Admin views (Home, Shop, Cart, Checkout, Admin, etc.)
│   │   ├── layouts/        # MainLayout, AdminLayout
│   │   ├── services/       # Axios API services
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # Context API (AuthContext, CartContext, WishlistContext)
│   │   ├── utils/          # Client-side formatters and helpers
│   │   └── assets/         # Global styles and static assets
│   ├── public/             # Static public assets
│   ├── dist/               # Production build output
│   ├── .env                # Frontend environment configuration
│   ├── .env.example        # Frontend environment template
│   ├── index.html          # HTML entrypoint with modern Google typography
│   ├── package.json        # Frontend dependencies & scripts (Vite, React)
│   ├── package-lock.json   # Frontend locked dependencies
│   └── vite.config.js      # Vite configuration & API proxy
│
├── server/                 # Node.js + Express backend
│   ├── config/             # MongoDB Mongoose connection
│   ├── controllers/        # Auth, Product, Cart, Order, Admin, Coupon, Review controllers
│   ├── models/             # Mongoose Models (User, Product, Category, Cart, Order, etc.)
│   ├── routes/             # Express REST API routes (/api/*)
│   ├── middleware/         # Auth, Admin, Error handling, Multer file upload
│   ├── services/           # Business logic & payment gateway simulation
│   ├── utils/              # Database seeder (seed.js) & test suite (test_e2e.js)
│   └── server.js           # Main Express server: APIs, static frontend/dist serving, SPA fallback
│
├── .gitignore              # Git ignore rules (node_modules, dist, .env, etc.)
└── README.md               # Complete project documentation & deployment guide
```

---

## 🌟 Key Highlights & Features

### 🛒 Customer Storefront
* **Home Page**:
  * High-converting Hero Banner with direct CTAs and trust indicators.
  * Interactive Category Showcase across 7 departments.
  * Real-time trending products, best sellers, and new arrivals sections.
  * Promotional discount banners with one-click coupon copying.
  * Verified buyer customer reviews & rating distributions.
  * Responsive navigation with live search suggestion dropdown, cart & wishlist counters.
* **Shop & Product Catalog**:
  * Real-time text search across product name, category, brand, and SKU.
  * Multi-faceted filtering: Department Category, Brand, Price Range (Min/Max), Star Rating (4★+, 3★+), and In-Stock availability.
  * Sorting options: Newest Arrivals, Price Low-to-High, Price High-to-Low, Highest Rated, and Popularity.
  * Responsive pagination and empty state handling.
* **Product Details**:
  * Multiple product image gallery with thumbnail preview switcher.
  * Price with strikethrough original price, discount percentage badge, and savings calculation.
  * Real-time stock status (In stock, Low stock warning `< 10`, or Out of stock).
  * Specifications table & variant selectors (Size, Color, Storage, etc.).
  * Quantity increment/decrement selector with inventory boundary enforcement.
  * Add to Cart, Buy Now, and Wishlist toggle.
  * Verified buyer customer review submission & aggregate rating recalculation.
  * Related products carousel.
* **Shopping Cart**:
  * Active items with variant details, price, quantity controls, line total, and remove option.
  * **"Save for Later"** drawer with one-click return to active cart.
  * Dynamic shipping calculation (Free above ₹500, else ₹50).
  * 5% estimated tax breakdown.
  * Coupon code validation with instant discount preview (`WELCOME10`, `SAVE500`, `FESTIVE20`, `FLAT100`).
* **Multi-Step Checkout**:
  * **Step 1: Shipping Address** — Select from saved addresses or add a new shipping address.
  * **Step 2: Order Summary** — Complete order itemization and discount breakdown.
  * **Step 3: Payment** — Choose between Cash on Delivery (COD) or simulated 256-bit encrypted Online Gateway.
* **Order Tracking & Progression**:
  * Order Success confirmation with generated Order ID (`SE-XXXXXX`).
  * Visual progress stepper: **Pending ➔ Confirmed ➔ Processing ➔ Shipped ➔ Out for Delivery ➔ Delivered**.
  * Detailed status change audit trail with timestamps and delivery partner notes.
  * Customer cancellation option (for Pending or Confirmed orders with automatic inventory restocking).
* **Customer Profile**:
  * Profile management (Name, Phone number).
  * Address book management (Add, update, delete, default address toggle).
  * Password change form.
  * Direct access to order history and wishlist.

---

### 🛡️ Admin Panel (`/admin`)
* **Secure Access**: Protected routes with Admin role verification (`/admin/login`).
* **Interactive Dashboard**:
  * 8 KPI Stat Cards: Total Revenue, Today's Sales, Total Orders, Pending Orders, Total Customers, Total Products, Low Stock Alerts, and Gross Margin.
  * Interactive **Recharts** charts:
    * Revenue Trajectory area chart with date filtering (Today, 7 Days, 30 Days).
    * Category volume horizontal bar chart.
    * Top selling products table.
* **Product Management**: Full CRUD (Add, Edit, Delete, Stock Update, Category Link, Image URLs).
* **Category Management**: Add, edit, delete categories with active product safeguards.
* **Order Management**: Live order inspection, search by Order ID, and real-time status updates (Pending, Confirmed, Processing, Shipped, Out for Delivery, Delivered, Cancelled).
* **Customer Management**: View all customer accounts, total spent, order counts, and toggle account activation/suspension.
* **Inventory Management**: Real-time warehouse inventory monitoring, low-stock warning indicators, and quick stock updates.
* **Payment Management**: Complete transaction audit log with transaction hashes, gateway status, and timestamps.
* **Coupon Management**: Create, edit, and delete discount vouchers with minimum order value and discount caps.
* **Review Moderation**: Audit customer feedback, approve/hide reviews, and delete spam.
* **Analytics**: In-depth revenue and category sales breakdown.

---

## 💻 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, React Router v6, Axios, Recharts, React Icons, React Hot Toast, Vanilla CSS Design System |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose 8, JWT (jsonwebtoken), bcryptjs, Multer, Morgan, CORS, Dotenv |
| **State Management** | React Context API (`AuthContext`, `CartContext`, `WishlistContext`) |
| **Database** | MongoDB (Local Service / MongoDB Atlas compatible) |
| **Deployment** | 100% Railway Ready as a Single Service (`npm start`) |

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory (refer to `.env.example`):

```env
# Application Port (Railway provides process.env.PORT automatically)
PORT=5000

# MongoDB Connection String (Local or MongoDB Atlas)
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce

# JWT Secret for authentication tokens
JWT_SECRET=shopease_jwt_super_secret_key_2026_secure
JWT_EXPIRE=30d

# Client URL (Use * or leave blank for unified production deployment)
CLIENT_URL=*

# Node Environment
NODE_ENV=production
```

---

## 🚀 Local Development Setup

### 1. Install Dependencies
Run in the root directory:
```bash
npm install
```

### 2. Configure MongoDB
Ensure MongoDB is running locally on port `27017` or update `MONGO_URI` in `.env` to point to a MongoDB Atlas cluster.

### 3. Seed Sample Data
Populate the database with 32 realistic products, 7 categories, active coupons, customer accounts, orders, reviews, and the admin account:
```bash
npm run seed
```

### 4. Run Development Server
To run both backend API (with auto-reload) and Vite frontend concurrently:
```bash
npm run dev
```
* **Frontend**: `http://localhost:5173`
* **Backend API**: `http://localhost:5000/api`

---

## 📦 Single-Service Production Build & Run

Express serves the production-built React frontend from `dist/` and handles all API routes and React Router wildcard fallbacks from a single process.

### Step 1: Build the React Frontend
```bash
npm run build
```
This compiles the React application into the `dist/` directory.

### Step 2: Start the Unified Production Server
```bash
npm start
```
* The server boots on `process.env.PORT` (defaults to `5000`).
* Open `http://localhost:5000` in your browser.
* Both the Customer Website, Admin Panel, and Express REST APIs run seamlessly from this single process.

---

## 🧪 Automated Testing

Run the end-to-end test suite to verify all 22 system checks (API endpoints, database operations, static frontend serving, and SPA wildcard fallback):
```bash
npm run test:e2e
```

---

## 🔑 Default Login Credentials

### Administrator Account
* **URL**: `/admin/login`
* **Phone**: `9999999999`
* **Password**: `Admin@123456`

### Customer Demo Account
* **URL**: `/login`
* **Phone**: `9876543210`
* **Password**: `Password@123`
*(You can also register new accounts instantly using the registration page)*

### Active Promo Coupons
* `WELCOME10` — 10% OFF on orders over ₹500 (up to ₹1,000)
* `FESTIVE20` — 20% OFF on orders over ₹2,000 (up to ₹2,500)
* `SAVE500` — Flat ₹500 OFF on orders over ₹3,000
* `FLAT100` — Flat ₹100 OFF on orders over ₹500

---

## 🚂 Railway Deployment Guide (One Single Service)

This repository is pre-configured to deploy to Railway as **ONE single service**.

### Step 1: Push Code to GitHub
1. Initialize git in the root folder (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit of unified ShopEase project"
   ```
2. Create a new repository on GitHub (e.g., `ecommerce`).
3. Link and push your local repository:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ecommerce.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Railway
1. Sign in to [Railway.app](https://railway.app/).
2. Click **"New Project"** ➔ **"Deploy from GitHub repo"**.
3. Select your repository (`ecommerce`).
4. Railway will automatically detect Node.js.

### Step 3: Add MongoDB on Railway
1. In your Railway project canvas, click **"New"** ➔ **"Database"** ➔ **"Add MongoDB"**.
2. Railway will create a managed MongoDB instance.
3. Click on the MongoDB card, go to the **Connect** tab, and copy the `MONGO_URL` (or internal connection string).

### Step 4: Configure Environment Variables
In your Railway web service card, go to the **Variables** tab and add:
* `MONGO_URI`: (Paste the MongoDB connection string from Step 3)
* `JWT_SECRET`: `shopease_railway_jwt_secret_key_2026_xyz`
* `NODE_ENV`: `production`
*(Note: Do **NOT** set `PORT`; Railway injects `PORT` automatically!)*

### Step 5: Configure Build & Start Command
In the **Settings** tab of your Railway service:
* **Build Command**: `npm run build`
* **Start Command**: `npm start`

Railway will execute `npm run build` during the build phase (compiling the Vite React app into `dist/`) and then launch `npm start` (starting `server/server.js`), which serves both the API and the React frontend on the assigned Railway public domain.

### Step 6: Generate Public Domain
1. In your service settings, navigate to **Networking** ➔ **Public Networking**.
2. Click **Generate Domain** (e.g., `ecommerce-production-xxxx.up.railway.app`).
3. Open the URL — your complete E-commerce storefront and Admin panel are live!
