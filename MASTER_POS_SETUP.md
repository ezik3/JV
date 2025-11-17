# MASTER POS SETUP DOCUMENTATION
## Complete Blueprint for Nocturne POS System Implementation

**Document Version:** 1.0
**Created:** 2025-11-17
**Source Repository:** https://github.com/ezik3/nocturne-pos
**Target Repository:** JV (https://github.com/ezik3/JV)

---

## TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [System Architecture Overview](#system-architecture-overview)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [File Structure & Organization](#file-structure--organization)
6. [Core Features & Functionality](#core-features--functionality)
7. [Page-by-Page Breakdown](#page-by-page-breakdown)
8. [Component Specifications](#component-specifications)
9. [State Management & Context](#state-management--context)
10. [Authentication & Authorization](#authentication--authorization)
11. [Routing Structure](#routing-structure)
12. [Design System & Styling](#design-system--styling)
13. [Implementation Roadmap](#implementation-roadmap)
14. [Current JV vs Nocturne Comparison](#current-jv-vs-nocturne-comparison)

---

## EXECUTIVE SUMMARY

### What is Nocturne POS?

Nocturne POS is a **modern, web-based Point of Sale system** specifically designed for nightlife venues (bars, nightclubs, restaurants). It features:

- **Full-featured POS interface** with cart management and order processing
- **Kitchen Display System (KDS)** for kitchen staff
- **Table management** with visual floorplan editor
- **Inventory tracking** with low-stock alerts
- **Staff management** with role-based access control
- **Analytics & reporting** with revenue tracking
- **Real-time order updates** using Supabase
- **Multi-payment method support** (Cash, Card, Mobile, JVCoin)

### Key Differences from Current JV Implementation

| Aspect | Current JV | Nocturne POS |
|--------|-----------|--------------|
| **Framework** | Complex multi-implementation (Enhanced/Classic/Simplified) | Single, clean React + TypeScript implementation |
| **Backend** | Express.js + MongoDB + Odoo integration | Supabase (PostgreSQL + Realtime + Auth) |
| **State Management** | Simple Context API with mock data | Context API with Supabase integration |
| **File Count** | 59+ JSX files, 33+ CSS files (~25,000 lines) | 20+ pages, modular components (~3,000 lines) |
| **Data Persistence** | None (all mock data, resets on reload) | Full database persistence with Supabase |
| **Authentication** | Partial (structure only, not integrated) | Complete Supabase Auth with RLS |
| **Design System** | Multiple CSS files, inconsistent | shadcn/ui components + Tailwind CSS |
| **Real-time Updates** | None | Supabase Realtime for orders/kitchen |
| **Complexity** | High (multiple implementations, backup files) | Low (single source of truth) |

### Why Rebuild with Nocturne Architecture?

1. **Simplicity:** Clean, maintainable codebase vs current 25,000+ line complexity
2. **Persistence:** Real database vs mock data that disappears
3. **Real-time:** Instant kitchen updates vs manual refresh
4. **Modern Stack:** TypeScript + Supabase vs legacy patterns
5. **Scalability:** Production-ready vs prototype

---

## SYSTEM ARCHITECTURE OVERVIEW

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                         │
│  ┌────────────────────────────────────────────────────┐    │
│  │  React App (TypeScript + Vite)                     │    │
│  │  ├── Authentication Layer (AuthContext)            │    │
│  │  ├── POS Context (Global State)                    │    │
│  │  ├── Protected Routes                              │    │
│  │  └── Pages (Dashboard, Orders, Kitchen, etc.)     │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↕ (HTTP/WebSocket)
┌─────────────────────────────────────────────────────────────┐
│                   SUPABASE BACKEND                           │
│  ┌────────────────────────────────────────────────────┐    │
│  │  PostgreSQL Database                               │    │
│  │  ├── Tables (orders, order_items, payments, etc.) │    │
│  │  ├── Row Level Security (RLS)                     │    │
│  │  └── Auto-incrementing sequences                  │    │
│  ├────────────────────────────────────────────────────┤    │
│  │  Authentication & Authorization                    │    │
│  │  ├── User Management                               │    │
│  │  ├── Role-based Access (admin/manager/staff)      │    │
│  │  └── Session Management                           │    │
│  ├────────────────────────────────────────────────────┤    │
│  │  Realtime Subscriptions                           │    │
│  │  └── Order updates to kitchen displays            │    │
│  ├────────────────────────────────────────────────────┤    │
│  │  Edge Functions                                   │    │
│  │  └── process-payment (payment processing)         │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

#### Order Creation Flow
```
User adds items to cart (POSContext)
    ↓
User clicks "Complete Order"
    ↓
createOrder() calculates totals
    ↓
Order saved to Supabase (orders + order_items tables)
    ↓
Realtime subscription notifies Kitchen Display
    ↓
Kitchen staff sees new order instantly
```

#### Authentication Flow
```
User visits /auth/login
    ↓
Enters email + password
    ↓
Supabase Auth validates credentials
    ↓
Session token stored in browser
    ↓
User redirected to /venue/pos/dashboard
    ↓
Protected routes validate session
```

---

## TECHNOLOGY STACK

### Frontend

| Technology | Purpose | Version/Notes |
|-----------|---------|---------------|
| **React** | UI Framework | v18+ with hooks |
| **TypeScript** | Type Safety | 95.7% of codebase |
| **Vite** | Build Tool | Fast dev server, HMR |
| **React Router** | Routing | v6 with protected routes |
| **Tailwind CSS** | Styling | Utility-first CSS |
| **shadcn/ui** | Component Library | 40+ pre-built components |
| **Lucide React** | Icons | Modern icon library |
| **React Query** | Data Fetching | Server state management |

### Backend

| Technology | Purpose |
|-----------|---------|
| **Supabase** | Backend-as-a-Service |
| **PostgreSQL** | Database (via Supabase) |
| **Supabase Auth** | User authentication |
| **Supabase Realtime** | WebSocket connections |
| **Edge Functions** | Serverless functions |
| **Row Level Security** | Database-level auth |

### Development Tools

- **Bun** - Package manager (faster than npm)
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **TypeScript Compiler** - Type checking

---

## DATABASE SCHEMA

### Complete Database Structure

#### 1. **user_roles** Table
```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Role Enum
CREATE TYPE app_role AS ENUM ('admin', 'manager', 'staff', 'kitchen');
```

**Purpose:** Manages role-based access control (RBAC)

**Fields:**
- `id`: Unique identifier
- `user_id`: References Supabase auth.users
- `role`: One of: admin, manager, staff, kitchen
- `created_at`: Timestamp

**RLS Policies:**
- Users can view their own roles
- Only admins can manage roles

---

#### 2. **profiles** Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Purpose:** Extended user profile information

**Fields:**
- `id`: Unique identifier
- `user_id`: Links to auth.users (one-to-one)
- `full_name`: Display name
- `avatar_url`: Profile picture URL
- `created_at`, `updated_at`: Audit timestamps

**RLS Policies:**
- All authenticated users can view profiles
- Users can update their own profile

---

#### 3. **floorplans** Table
```sql
CREATE TABLE floorplans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id TEXT NOT NULL DEFAULT 'default',
  name TEXT NOT NULL,
  canvas_width INTEGER DEFAULT 2000,
  canvas_height INTEGER DEFAULT 1200,
  items JSONB DEFAULT '[]'::jsonb,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Purpose:** Store visual table layouts for floorplan editor

**Fields:**
- `id`: Unique identifier
- `venue_id`: Multi-venue support (defaults to 'default')
- `name`: Floorplan name (e.g., "Main Floor", "VIP Section")
- `canvas_width`, `canvas_height`: Canvas dimensions in pixels
- `items`: JSON array of floorplan elements (tables, walls, decorations)
- `created_by`: User who created the floorplan
- `created_at`, `updated_at`: Audit timestamps

**RLS Policies:**
- Managers/admins can manage all floorplans
- Staff can view only

---

#### 4. **venue_tables** Table
```sql
CREATE TABLE venue_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number TEXT NOT NULL,
  capacity INTEGER DEFAULT 4,
  section TEXT,
  status TEXT DEFAULT 'available',
  x_position NUMERIC,
  y_position NUMERIC,
  floorplan_id UUID REFERENCES floorplans(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Purpose:** Track individual tables in the venue

**Fields:**
- `id`: Unique identifier
- `table_number`: Display number (e.g., "T1", "VIP-3")
- `capacity`: Maximum guests (default: 4)
- `section`: Physical location (e.g., "Main Floor", "Patio")
- `status`: Current state (available/occupied/reserved)
- `x_position`, `y_position`: Coordinates on floorplan
- `floorplan_id`: Links to floorplans table
- `created_at`, `updated_at`: Audit timestamps

**RLS Policies:**
- Staff can view and update
- Managers have full control

---

#### 5. **orders** Table (PRIMARY ENTITY)
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number INTEGER GENERATED ALWAYS AS IDENTITY,
  table_id UUID REFERENCES venue_tables(id),
  table_number TEXT,
  customer_name TEXT,
  status TEXT DEFAULT 'pending',
  station TEXT,
  priority TEXT DEFAULT 'normal',
  notes TEXT,
  subtotal NUMERIC(10,2) DEFAULT 0,
  tax NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) DEFAULT 0,
  staff_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Status values: pending, preparing, ready, served, cancelled
-- Station values: kitchen, bar, expo
-- Priority values: low, normal, high, urgent

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
```

**Purpose:** Core order management

**Fields:**
- `id`: Unique identifier (UUID)
- `order_number`: Human-readable sequential number (auto-increment)
- `table_id`: Reference to venue_tables (optional, for dine-in)
- `table_number`: Denormalized for quick display
- `customer_name`: Guest name (optional)
- `status`: Order lifecycle state
  - `pending`: Just created, awaiting preparation
  - `preparing`: Being made in kitchen/bar
  - `ready`: Completed, ready to serve
  - `served`: Delivered to customer
  - `cancelled`: Order cancelled
- `station`: Where order should be prepared (kitchen/bar/expo)
- `priority`: Urgency level (low/normal/high/urgent)
- `notes`: Special instructions
- `subtotal`: Pre-tax total
- `tax`: Tax amount (calculated)
- `total`: Final amount (subtotal + tax)
- `staff_id`: Who created the order
- `created_at`, `updated_at`: Audit timestamps

**Special Features:**
- **Realtime enabled** - Kitchen displays auto-update when orders change
- **Auto-incrementing order_number** for easy reference

**RLS Policies:**
- All staff can view, create, and update orders

---

#### 6. **order_items** Table
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id TEXT,
  name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  price NUMERIC(10,2) NOT NULL,
  modifiers JSONB,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Purpose:** Individual items within each order

**Fields:**
- `id`: Unique identifier
- `order_id`: Parent order (cascading delete - items deleted when order deleted)
- `menu_item_id`: Reference to menu item (TEXT for flexibility)
- `name`: Item name (denormalized for order history)
- `quantity`: How many of this item
- `price`: Price per unit at time of order
- `modifiers`: JSON array of customizations (e.g., `{"add": ["extra cheese"], "remove": ["onions"]}`)
- `notes`: Item-specific instructions
- `image_url`: Product image
- `created_at`: When item was added

**RLS Policies:**
- Staff can view and create order items

---

#### 7. **payments** Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  transaction_id TEXT,
  staff_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- payment_method: cash, card, mobile
-- status: pending, completed, failed, refunded
```

**Purpose:** Track payments for orders

**Fields:**
- `id`: Unique identifier
- `order_id`: Which order this payment is for
- `amount`: Payment amount
- `payment_method`: How customer paid (cash/card/mobile)
- `status`: Payment state (pending/completed/failed/refunded)
- `transaction_id`: External payment processor reference
- `staff_id`: Who processed the payment
- `created_at`: Payment timestamp

**RLS Policies:**
- Staff can view and create payments

---

### Database Relationships Diagram

```
user_roles ──┐
             ├── user_id ──> auth.users (Supabase)
profiles ────┘

floorplans
     │
     └── id
         │
venue_tables (floorplan_id FK)
     │
     └── id
         │
orders (table_id FK)
     │
     ├── id
     │   ├── order_items (order_id FK, CASCADE DELETE)
     │   └── payments (order_id FK, CASCADE DELETE)
     │
     └── staff_id ──> auth.users
```

---

### Key Database Features

1. **UUID Primary Keys** - Universally unique, distributed-friendly
2. **Auto-incrementing order_number** - Human-readable order IDs (1001, 1002, etc.)
3. **Cascading Deletes** - Delete order → auto-delete items & payments
4. **JSONB Fields** - Flexible data storage (modifiers, floorplan items)
5. **Row Level Security** - Database-level authorization
6. **Realtime Subscriptions** - WebSocket updates for orders table
7. **Timestamptz** - Timezone-aware timestamps
8. **Numeric(10,2)** - Precise currency storage (no floating point errors)

---

## FILE STRUCTURE & ORGANIZATION

### Nocturne POS Directory Structure

```
nocturne-pos/
│
├── public/                          # Static assets
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
│
├── src/                             # Source code
│   ├── main.tsx                     # Application entry point
│   ├── App.tsx                      # Root component with routing
│   ├── App.css                      # Global styles
│   ├── index.css                    # Tailwind imports
│   │
│   ├── components/                  # Reusable components
│   │   ├── NavLink.tsx              # Navigation link component
│   │   ├── ProtectedRoute.tsx       # Auth guard for routes
│   │   │
│   │   ├── POS/                     # POS-specific components
│   │   │   ├── POSLayout.tsx        # Main POS layout wrapper
│   │   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   │   └── KDS/
│   │   │       └── KitchenCard.tsx  # Kitchen display card
│   │   │
│   │   └── ui/                      # shadcn/ui components (40+ files)
│   │       ├── accordion.tsx
│   │       ├── alert.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── table.tsx
│   │       ├── badge.tsx
│   │       ├── tabs.tsx
│   │       └── ... (35+ more)
│   │
│   ├── contexts/                    # React Context providers
│   │   ├── AuthContext.tsx          # Authentication state
│   │   └── POSContext.tsx           # POS global state
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── use-mobile.tsx           # Mobile detection
│   │   └── use-toast.ts             # Toast notifications
│   │
│   ├── integrations/                # Third-party integrations
│   │   └── supabase/
│   │       ├── client.ts            # Supabase client config
│   │       └── types.ts             # TypeScript types
│   │
│   ├── lib/                         # Utilities
│   │   └── utils.ts                 # Helper functions
│   │
│   └── pages/                       # Page components
│       ├── Index.tsx                # Landing page
│       ├── NotFound.tsx             # 404 page
│       │
│       ├── Auth/                    # Authentication pages
│       │   ├── Login.tsx
│       │   └── Signup.tsx
│       │
│       └── POS/                     # POS pages (13 pages)
│           ├── Dashboard.tsx        # Main dashboard
│           ├── NewOrder.tsx         # Create new order
│           ├── Orders.tsx           # Order management
│           ├── Kitchen.tsx          # Kitchen display (legacy)
│           ├── KitchenEnhanced.tsx  # Enhanced kitchen display
│           ├── Menu.tsx             # Menu management
│           ├── Inventory.tsx        # Inventory tracking
│           ├── Tables.tsx           # Table management
│           ├── FloorplanEditor.tsx  # Visual floorplan editor
│           ├── Sales.tsx            # Sales reports
│           ├── Analytics.tsx        # Analytics dashboard
│           ├── Staff.tsx            # Staff management
│           └── Settings.tsx         # System settings
│
├── supabase/                        # Supabase configuration
│   ├── config.toml                  # Supabase project config
│   ├── migrations/                  # Database migrations
│   │   └── 20251112135635_*.sql     # Initial schema
│   └── functions/                   # Edge functions
│       └── process-payment/
│           └── index.ts             # Payment processing
│
├── index.html                       # HTML entry point
├── package.json                     # Dependencies
├── bun.lockb                        # Bun lock file
├── vite.config.ts                   # Vite configuration
├── tailwind.config.ts               # Tailwind configuration
├── tsconfig.json                    # TypeScript config
├── components.json                  # shadcn/ui config
└── README.md                        # Project documentation
```

### File Count Summary

| Category | Count | Purpose |
|----------|-------|---------|
| **POS Pages** | 13 | Main application screens |
| **Auth Pages** | 2 | Login/Signup |
| **POS Components** | 3 | Layout, Sidebar, Kitchen card |
| **UI Components** | 40+ | Reusable shadcn/ui components |
| **Contexts** | 2 | State management |
| **Hooks** | 2 | Custom React hooks |
| **Config Files** | 8 | Build/type configs |
| **Database Files** | 2 | Migration + edge function |
| **Total** | ~70 | Estimated total files |

---

## CORE FEATURES & FUNCTIONALITY

### 1. Order Management
- Create orders with multiple items
- Add modifiers and notes to items
- Calculate subtotal, tax (10%), and total
- Assign orders to tables
- Track order status (pending → preparing → ready → served)
- Order history and filtering

### 2. Kitchen Display System (KDS)
- Real-time order updates via Supabase Realtime
- Filter by status (all/pending/preparing/ready)
- Visual order cards with item details
- One-click status progression
- Timestamp tracking for order age
- Station-based filtering (kitchen/bar)

### 3. Table Management
- Visual table map with status indicators
- Table capacity tracking
- Status management (available/occupied/reserved)
- Section organization
- QR code generation for digital menus
- Table-to-order linking

### 4. Menu Management
- CRUD operations for menu items
- Category organization
- Price and description management
- Availability toggle
- Image uploads
- Search and filtering

### 5. Inventory Management
- Stock level tracking
- Low-stock alerts (critical/low/good)
- SKU-based organization
- Quantity adjustments
- Unit of measurement tracking
- Reorder threshold configuration

### 6. Staff Management
- Role-based access control (admin/manager/staff/kitchen)
- Staff profiles with avatars
- Shift tracking
- Clock in/out functionality
- Sales and order count per staff
- Status indicators (active/break/off)

### 7. Analytics & Reporting
- **Dashboard Metrics:**
  - Today's sales revenue
  - Order count
  - Active table count
  - Average order value
  - Trend indicators vs. yesterday

- **Sales Analytics:**
  - Hourly revenue breakdown
  - Peak hours analysis
  - Top-selling items
  - Category revenue distribution

- **Weekly Performance:**
  - Daily revenue charts
  - Order volume trends
  - Day-over-day comparisons

### 8. Payment Processing
- Multi-method support (Cash, Card, Mobile Pay, JVCoin)
- Payment validation
- Transaction tracking
- Receipt generation
- Payment status management (pending/completed/failed/refunded)

### 9. Floorplan Editor
- Visual drag-and-drop table placement
- Canvas-based editing
- Table positioning coordinates
- Multi-floor support
- Save/load floorplan configurations

### 10. Settings Management
- Venue information configuration
- Payment method toggles
- Tax rate configuration
- Printer settings (receipt + kitchen)
- System preferences

---

## PAGE-BY-PAGE BREAKDOWN

### 1. Landing Page (`/`)
**File:** `src/pages/Index.tsx`

**Purpose:** Public homepage

**Features:**
- Hero section with branding
- Call-to-action for sign up
- Feature highlights
- Redirect to login for existing users

**Implementation Notes:**
- Not visible in provided code (stub)
- Should link to `/auth/login` and `/auth/signup`

---

### 2. Login Page (`/auth/login`)
**File:** `src/pages/Auth/Login.tsx`

**Purpose:** User authentication

**Features:**
- Email/password input
- Form validation
- Error handling with toast notifications
- Success redirect to dashboard
- Link to signup page

**Implementation:**
```typescript
const { signIn } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();
  await signIn(email, password);
  // Redirects to /venue/pos/dashboard on success
};
```

**UI Components:**
- Input fields (email, password)
- Submit button
- Error display
- Link to signup

**AuthContext Integration:**
- Calls `signIn(email, password)`
- Returns success/error
- Sets user session

---

### 3. Signup Page (`/auth/signup`)
**File:** `src/pages/Auth/Signup.tsx`

**Purpose:** New user registration

**Features:**
- Email/password registration
- Automatic profile creation
- Default 'staff' role assignment
- Email verification
- Success redirect to login

**Implementation:**
```typescript
const { signUp } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();
  await signUp(email, password);
  // Creates user in auth.users
  // Creates profile in profiles table
  // Assigns staff role in user_roles
};
```

**Database Operations:**
1. Create user in Supabase Auth
2. Insert profile record
3. Insert user_role record (role: 'staff')
4. Send verification email

---

### 4. Dashboard (`/venue/pos/dashboard`)
**File:** `src/pages/POS/Dashboard.tsx`

**Purpose:** Main overview screen after login

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  JV POS                                             │
├─────────────────────────────────────────────────────┤
│  [Today's Sales] [Orders] [Active Tables] [AOV]    │
│   $2,543.00      48       12             $52.98    │
│   +12.5%         +8.2%    +3             +5.3%     │
├─────────────────────────────────────────────────────┤
│  Recent Orders          │  Top Items               │
│  ────────────────────   │  ──────────────────      │
│  #1001  Table 5  $45.50 │  1. Signature Cocktail   │
│  #1002  Table 2  $78.25 │     24 sold              │
│  #1003  Table 8  $32.00 │  2. House Wine           │
│  #1004  Table 1  $156.75│     21 sold              │
│  #1005  Table 3  $89.50 │  3. Premium Beer         │
│                         │     18 sold              │
└─────────────────────────┴──────────────────────────┘
```

**Data Displayed:**

1. **Statistics Cards (Top Row):**
   - **Today's Sales:** `$2,543.00` (+12.5% vs yesterday)
   - **Orders:** `48` (+8.2%)
   - **Active Tables:** `12` (+3)
   - **Average Order Value:** `$52.98` (+5.3%)

2. **Recent Orders (Left Column):**
   - Order number (e.g., #1001)
   - Table assignment
   - Order total
   - Status badge ("Preparing")
   - Shows 5 most recent

3. **Top Items (Right Column):**
   - Item name
   - Quantity sold
   - Ranked list (top 5)

**Mock Data:**
```typescript
const stats = {
  todaysSales: 2543.00,
  salesTrend: "+12.5%",
  orders: 48,
  ordersTrend: "+8.2%",
  activeTables: 12,
  tablesTrend: "+3",
  avgOrderValue: 52.98,
  avgTrend: "+5.3%"
};

const recentOrders = [
  { id: "1001", table: 5, total: 45.50, status: "Preparing" },
  // ... 4 more
];

const topItems = [
  { name: "Signature Cocktail", sold: 24 },
  { name: "House Wine", sold: 21 },
  // ... 3 more
];
```

**Icons:**
- TrendingUp (for sales)
- ShoppingBag (for orders)
- Users (for tables)
- DollarSign (for AOV)

**Real Implementation Notes:**
- Replace mock data with Supabase queries
- Calculate trends from yesterday's data
- Use SQL aggregations for top items
- Real-time order count via Realtime subscription

---

### 5. New Order (`/venue/pos/new-order`)
**File:** `src/pages/POS/NewOrder.tsx`

**Purpose:** Create new orders (primary POS interface)

**Layout:**
```
┌────────────────────────────────────────────────────┐
│  New Order                                         │
├──────────────────────────────────┬─────────────────┤
│  [Search]  [All] [Coffee] [Food] │  CART           │
│  ┌──────┐ ┌──────┐ ┌──────┐     │  ─────────────  │
│  │ Latte│ │Cappuc│ │ Crois│     │  Latte x2       │
│  │$3.50 │ │$3.75 │ │$4.25 │     │  $7.00          │
│  └──────┘ └──────┘ └──────┘     │                 │
│  ┌──────┐ ┌──────┐ ┌──────┐     │  Croissant x1   │
│  │Espres│ │Muffin│ │Bagle │     │  $4.25          │
│  │$3.00 │ │$4.75 │ │$4.50 │     │  ─────────────  │
│  └──────┘ └──────┘ └──────┘     │  Subtotal: $11.25│
│                                  │  Tax (10%): $1.13│
│                                  │  Total: $12.38  │
│                                  │                 │
│                                  │  [Clear Cart]   │
│                                  │  [Checkout]     │
└──────────────────────────────────┴─────────────────┘
```

**Features:**

1. **Menu Display (Left Side):**
   - Search bar for filtering items
   - Category filter buttons (extracted from menu items)
   - Responsive grid (2-4 columns based on screen size)
   - Each item card shows:
     - Item name
     - Price
     - Category badge
     - Availability indicator
   - Click to add to cart

2. **Shopping Cart (Right Sidebar, 96 units wide):**
   - Cart item list with:
     - Item name
     - Quantity controls (- / + buttons)
     - Individual price
     - Remove button (X)
   - Price summary:
     - Subtotal (sum of all items)
     - Tax (10% of subtotal)
     - Total (subtotal + tax)
   - Action buttons:
     - Clear Cart (removes all items)
     - Checkout (creates order)

**Implementation:**

```typescript
const { menu, cart, addToCart, updateCartItem, removeFromCart, clearCart, createOrder } = usePOS();

// Filter menu by category and search
const filteredMenu = menu.filter(item => {
  const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
  const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
  return matchesCategory && matchesSearch && item.available;
});

// Calculate totals
const subtotal = cart.reduce((sum, item) =>
  sum + (item.menuItem.price * item.quantity), 0
);
const tax = subtotal * 0.10;
const total = subtotal + tax;

// Handle checkout
const handleCheckout = async () => {
  if (cart.length === 0) {
    toast({ title: "Cart is empty" });
    return;
  }

  await createOrder();
  toast({ title: "Order created successfully!" });
};
```

**Cart Item Structure:**
```typescript
interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  modifiers?: string[];
  notes?: string;
}
```

**POSContext Functions Used:**
- `addToCart(menuItem)` - Add item or increment quantity
- `updateCartItem(id, quantity)` - Change quantity (removes if 0)
- `removeFromCart(id)` - Delete item
- `clearCart()` - Empty cart
- `createOrder()` - Save to database and clear cart

**Real Implementation:**
- Fetch menu from database (not hardcoded)
- Add table selection dropdown
- Add customer name input
- Add order notes textarea
- Add modifier selection (e.g., "no ice", "extra shot")
- Integrate with payment processing

---

### 6. Orders (`/venue/pos/orders`)
**File:** `src/pages/POS/Orders.tsx`

**Purpose:** View and manage all orders

**Layout:**
```
┌────────────────────────────────────────────────────┐
│  Orders                                            │
├────────────────────────────────────────────────────┤
│  Order #  │ Table │ Total   │ Status    │ Time    │
│  ──────────────────────────────────────────────────│
│  1005     │ 5     │ $89.50  │ [Pending] │ 2:30 PM │
│  1004     │ 1     │ $156.75 │ [Preparing]│2:25 PM │
│  1003     │ 8     │ $32.00  │ [Ready]   │ 2:20 PM │
│  1002     │ 2     │ $78.25  │ [Completed]│2:15 PM │
│  1001     │ 5     │ $45.50  │ [Completed]│2:10 PM │
└────────────────────────────────────────────────────┘
```

**Features:**
- Scrollable table of all orders
- Color-coded status badges:
  - Yellow: Pending
  - Blue: Preparing
  - Green: Ready/Completed
- "View" button for order details (eye icon)
- Timestamp for each order

**Mock Data:**
```typescript
const orders = [
  { id: "1005", table: 5, total: 89.50, status: "pending", time: "2:30 PM" },
  { id: "1004", table: 1, total: 156.75, status: "preparing", time: "2:25 PM" },
  { id: "1003", table: 8, total: 32.00, status: "ready", time: "2:20 PM" },
  { id: "1002", table: 2, total: 78.25, status: "completed", time: "2:15 PM" },
  { id: "1001", table: 5, total: 45.50, status: "completed", time: "2:10 PM" }
];
```

**Status Badge Colors:**
- `pending`: `bg-yellow-500/20 text-yellow-500`
- `preparing`: `bg-blue-500/20 text-blue-500`
- `ready`: `bg-green-500/20 text-green-500`
- `completed`: `bg-green-500/20 text-green-500`

**Real Implementation:**
- Fetch from Supabase `orders` table with JOIN to `order_items`
- Add filtering by status, date range, table
- Add pagination for large order lists
- Add order detail modal showing items
- Add status update functionality
- Add export to CSV/PDF

---

### 7. Kitchen Display (`/venue/pos/kitchen`)
**File:** `src/pages/POS/Kitchen.tsx`

**Purpose:** Kitchen staff view of pending orders (legacy version)

**Layout:**
```
┌────────────────────────────────────────────────────┐
│  Kitchen Display                                   │
│  [All] [Pending] [Preparing] [Ready]              │
├────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐              │
│  │ Order #1005  │  │ Order #1004  │              │
│  │ Table 5      │  │ Table 1      │              │
│  │ [Pending]    │  │ [Preparing]  │              │
│  │              │  │              │              │
│  │ 2x Latte     │  │ 1x Croissant │              │
│  │ 1x Muffin    │  │ 1x Bagel     │              │
│  │              │  │ 1x Coffee    │              │
│  │ 5 min ago    │  │ 10 min ago   │              │
│  │              │  │              │              │
│  │ [Start]      │  │ [Mark Ready] │              │
│  └──────────────┘  └──────────────┘              │
└────────────────────────────────────────────────────┘
```

**Features:**
1. **Filter Buttons:** All, Pending, Preparing, Ready
2. **Order Cards:**
   - Order number and table
   - Status badge
   - Item list with quantities
   - Timestamp (X min ago)
   - Action button based on status:
     - Pending → "Start Preparing"
     - Preparing → "Mark Ready"
     - Ready → "Complete Order"

**Mock Data:**
```typescript
const orders = [
  {
    id: "1005",
    table: 5,
    status: "pending",
    items: ["2x Latte", "1x Muffin"],
    time: "5 min ago"
  },
  {
    id: "1004",
    table: 1,
    status: "preparing",
    items: ["1x Croissant", "1x Bagel", "1x Coffee"],
    time: "10 min ago"
  },
  // ... more orders
];
```

**Status Colors:**
- Pending: Yellow
- Preparing: Blue
- Ready: Green

**Implementation:**
```typescript
const [filter, setFilter] = useState("all");

const filteredOrders = orders.filter(order =>
  filter === "all" || order.status === filter
);

const handleStatusUpdate = (orderId, newStatus) => {
  // Update order status in database
  // Realtime subscription will update other KDS screens
};
```

**Real Implementation:**
- Supabase Realtime subscription for live updates
- Sound notification for new orders
- Auto-scroll to new orders
- Color-code by priority
- Show order preparation time limit
- Station filtering (kitchen vs bar)

---

### 8. Kitchen Enhanced (`/venue/pos/kitchen-enhanced`)
**File:** `src/pages/POS/KitchenEnhanced.tsx`

**Purpose:** Improved kitchen display with additional features

**Differences from Legacy Kitchen:**
- Enhanced visual design
- Better filtering options
- Improved card layout
- Additional order metadata
- Priority indicators
- Station-based view

**Implementation:** (Similar to Kitchen.tsx but with enhancements)

---

### 9. Menu Management (`/venue/pos/menu`)
**File:** `src/pages/POS/Menu.tsx`

**Purpose:** CRUD operations for menu items

**Layout:**
```
┌────────────────────────────────────────────────────┐
│  Menu Management                [+ Add Item]       │
│  Manage your venue's menu items                    │
├────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ 🍽️       │  │ 🍽️       │  │ 🍽️       │        │
│  │ Latte    │  │Cappuccino│  │ Espresso │        │
│  │ Coffee   │  │ Coffee   │  │ Coffee   │        │
│  │ $3.50    │  │ $3.75    │  │ $3.00    │        │
│  │          │  │          │  │          │        │
│  │ [Edit] [Delete]│[Edit] [Delete]│[Edit] [Delete]│
│  └──────────┘  └──────────┘  └──────────┘        │
└────────────────────────────────────────────────────┘
```

**Features:**
- Grid display of all menu items
- Each card shows:
  - Emoji icon (🍽️)
  - Item name
  - Category
  - Price
  - Edit and Delete buttons
- "Add Item" button (top right)

**Mock Data:**
```typescript
const menu = [
  { id: "1", name: "Latte", category: "Coffee", price: 3.50 },
  { id: "2", name: "Cappuccino", category: "Coffee", price: 3.75 },
  { id: "3", name: "Espresso", category: "Coffee", price: 3.00 },
  { id: "4", name: "Croissant", category: "Food", price: 4.25 },
  { id: "5", name: "Muffin", category: "Food", price: 4.75 },
  { id: "6", name: "Bagel", category: "Food", price: 4.50 }
];
```

**Actions:**
- **Add Item:** Open modal/form for new menu item
- **Edit:** Open modal with item data pre-filled
- **Delete:** Confirm and remove item

**Real Implementation:**
- Fetch from `menu_items` table (needs to be created)
- Image upload for items
- Category management
- Availability toggle
- Pricing history
- Modifier options (e.g., "add shot", "extra cheese")
- Allergen information

---

### 10. Inventory (`/venue/pos/inventory`)
**File:** `src/pages/POS/Inventory.tsx`

**Purpose:** Track stock levels and manage inventory

**Layout:**
```
┌────────────────────────────────────────────────────┐
│  Inventory                          [+ Add Item]   │
│  Track and manage stock levels                     │
├────────────────────────────────────────────────────┤
│  SKU    │ Item   │ Qty │ Low Threshold │ Status  │
│  ────────────────────────────────────────────────  │
│  CB001  │ Coffee │ 45  │ 100           │[Critical]│
│  MK002  │ Milk   │ 80  │ 50            │[Low]    │
│  SG003  │ Sugar  │ 150 │ 75            │[Good]   │
│  FL004  │ Flour  │ 200 │ 100           │[Good]   │
│  BT005  │ Butter │ 30  │ 40            │[Low]    │
└────────────────────────────────────────────────────┘
```

**Features:**
- Table view of all inventory items
- Columns:
  - SKU (unique identifier)
  - Item name
  - Current quantity
  - Low stock threshold
  - Status badge
  - Actions (Adjust button)
- Status calculation logic:
  - **Critical** (red): quantity < threshold * 0.5
  - **Low** (yellow): quantity < threshold
  - **Good** (green): quantity >= threshold

**Mock Data:**
```typescript
const inventory = [
  { sku: "CB001", name: "Coffee Beans", quantity: 45, unit: "kg", threshold: 100 },
  { sku: "MK002", name: "Milk", quantity: 80, unit: "L", threshold: 50 },
  { sku: "SG003", name: "Sugar", quantity: 150, unit: "kg", threshold: 75 },
  { sku: "FL004", name: "Flour", quantity: 200, unit: "kg", threshold: 100 },
  { sku: "BT005", name: "Butter", quantity: 30, unit: "kg", threshold: 40 }
];
```

**Status Badge Function:**
```typescript
const getStatusBadge = (quantity, threshold) => {
  if (quantity < threshold * 0.5) {
    return <Badge className="bg-red-500">Critical</Badge>;
  } else if (quantity < threshold) {
    return <Badge className="bg-yellow-500">Low Stock</Badge>;
  }
  return <Badge className="bg-green-500">Good</Badge>;
};
```

**Real Implementation:**
- Create `inventory` table in database
- Link to `menu_items` (recipe management)
- Automatic deduction on order creation
- Purchase order generation
- Supplier management
- Cost tracking (COGS)
- Inventory value calculation
- Stock take/audit functionality
- Batch/expiry date tracking

---

### 11. Tables (`/venue/pos/tables`)
**File:** `src/pages/POS/Tables.tsx`

**Purpose:** Manage restaurant tables and seating

**Layout:**
```
┌────────────────────────────────────────────────────┐
│  Tables                                            │
├──────────────────────────────┬─────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐ │  Table 1            │
│  │ T1   │ │ T2   │ │ T3   │ │  Main Floor         │
│  │[Avail]│[Occup]│[Reserv]│ │  Capacity: 4        │
│  │ 4ppl │ │ 4ppl │ │ 2ppl │ │  Status: Available  │
│  └──────┘ └──────┘ └──────┘ │                     │
│  ┌──────┐ ┌──────┐ ┌──────┐ │  [Seat Guests]      │
│  │ T4   │ │ T5   │ │ T6   │ │  [View QR Code]     │
│  │[Avail]│[Occup]│[Avail]│ │                     │
│  │ 6ppl │ │ 8ppl │ │ 4ppl │ │                     │
│  └──────┘ └──────┘ └──────┘ │                     │
└──────────────────────────────┴─────────────────────┘
```

**Features:**

1. **Table Grid (Left):**
   - Visual cards for each table
   - Table number
   - Status badge (Available/Occupied/Reserved)
   - Capacity (number of people)
   - Click to select and view details

2. **Table Details Panel (Right):**
   - Full table information
   - Section location
   - Guest count
   - Order number (if occupied)
   - Reservation details (if reserved)
   - Action buttons:
     - **Available:** "Seat Guests"
     - **Occupied:** "View Order", "Process Payment"
     - **All:** "View QR Code"

**Mock Data:**
```typescript
const tables = [
  { id: "1", number: "1", capacity: 4, section: "Main Floor", status: "available" },
  { id: "2", number: "2", capacity: 4, section: "Main Floor", status: "occupied",
    guests: 3, orderNumber: "1005", duration: "45 min" },
  { id: "3", number: "3", capacity: 2, section: "Bar", status: "reserved",
    time: "6:00 PM", name: "Smith" },
  { id: "4", number: "4", capacity: 6, section: "VIP", status: "available" },
  { id: "5", number: "5", capacity: 8, section: "Main Floor", status: "occupied",
    guests: 7, orderNumber: "1003", duration: "1h 20min" },
  { id: "6", number: "6", capacity: 4, section: "Patio", status: "available" },
  { id: "7", number: "7", capacity: 2, section: "Bar", status: "available" },
  { id: "8", number: "8", capacity: 4, section: "VIP", status: "occupied",
    guests: 4, orderNumber: "1002", duration: "30 min" }
];
```

**Status Colors:**
- **Available:** Green (`bg-green-500`)
- **Occupied:** Red (`bg-red-500`)
- **Reserved:** Blue (`bg-blue-500`)

**Implementation:**
```typescript
const [selectedTable, setSelectedTable] = useState(null);

const handleTableClick = (table) => {
  setSelectedTable(table);
};
```

**Real Implementation:**
- Fetch from `venue_tables` table
- Link to `orders` table (show active order)
- Update status in real-time
- QR code generation for table (links to digital menu)
- Reservation system integration
- Waitlist management
- Table merging/splitting
- Integration with floorplan editor

---

### 12. Floorplan Editor (`/venue/pos/floorplan`)
**File:** `src/pages/POS/FloorplanEditor.tsx`

**Purpose:** Visual drag-and-drop floorplan designer

**Features:**
- Canvas-based editor (2000x1200 default)
- Drag tables to position
- X/Y coordinate saving
- Multiple floorplan support (Main Floor, VIP, Patio)
- Save/load configurations
- Visual representation for front-of-house staff

**Data Storage:**
```typescript
// Stored in floorplans table
{
  id: "uuid",
  venue_id: "default",
  name: "Main Floor",
  canvas_width: 2000,
  canvas_height: 1200,
  items: [
    { type: "table", tableId: "1", x: 100, y: 150 },
    { type: "table", tableId: "2", x: 300, y: 150 },
    { type: "wall", x1: 0, y1: 500, x2: 500, y2: 500 }
  ]
}
```

**Real Implementation:**
- React DnD or similar drag-drop library
- Canvas or SVG rendering
- Snap-to-grid functionality
- Shape library (tables, walls, bar, kitchen)
- Zoom and pan controls
- Export to image

---

### 13. Sales (`/venue/pos/sales`)
**File:** `src/pages/POS/Sales.tsx`

**Purpose:** Sales reports and performance tracking

**Layout:**
```
┌────────────────────────────────────────────────────┐
│  Sales                          [Export Report]    │
├────────────────────────────────────────────────────┤
│  [Today's Revenue] [Orders] [Avg Order] [Peak Hr] │
│   $5,243.50        87       $60.27      1 PM      │
├────────────────────────────────────────────────────┤
│  Sales by Hour                                     │
│  ──────────────────────────────────────────────────│
│  9 AM   ████░░░░░░░░ $420                         │
│  10 AM  ██████░░░░░░ $680                         │
│  11 AM  ████████░░░░ $850                         │
│  12 PM  ██████████░░ $920                         │
│  1 PM   ████████████ $1,050 ← PEAK               │
│  2 PM   ██████████░░ $890                         │
│  ...                                               │
├────────────────────────────────────────────────────┤
│  Top Items                                         │
│  ──────────────────────────────────────────────────│
│  1. Signature Cocktail    45 sold    $675         │
│  2. House Wine            38 sold    $570         │
│  3. Premium Beer          52 sold    $416         │
│  4. Appetizer Platter     28 sold    $392         │
│  5. Dessert Special       31 sold    $465         │
└────────────────────────────────────────────────────┘
```

**Features:**
- Today's sales summary (4 stat cards)
- Hourly sales breakdown with bar charts
- Peak hour identification
- Top-selling items with quantities and revenue
- Export report button

**Mock Data:**
```typescript
const salesData = {
  revenue: 5243.50,
  orders: 87,
  avgOrder: 60.27,
  peakHour: "1 PM",
  hourly: [
    { hour: "9 AM", sales: 420 },
    { hour: "10 AM", sales: 680 },
    { hour: "11 AM", sales: 850 },
    { hour: "12 PM", sales: 920 },
    { hour: "1 PM", sales: 1050 },
    // ...
  ],
  topItems: [
    { name: "Signature Cocktail", quantity: 45, revenue: 675 },
    { name: "House Wine", quantity: 38, revenue: 570 },
    // ...
  ]
};
```

**Real Implementation:**
- Date range picker (today/week/month/custom)
- Category breakdown
- Payment method analysis
- Staff performance comparison
- Hourly/daily/weekly trends
- Export to CSV/PDF
- Print receipts summary

---

### 14. Analytics (`/venue/pos/analytics`)
**File:** `src/pages/POS/Analytics.tsx`

**Purpose:** Comprehensive business intelligence dashboard

**Layout:**
```
┌────────────────────────────────────────────────────┐
│  Analytics                                         │
│  [Overview] [Revenue] [Customers] [Products]       │
├────────────────────────────────────────────────────┤
│  OVERVIEW TAB                                      │
├────────────────────────────────────────────────────┤
│  [Weekly Revenue] [Total Orders] [AOV] [Peak Day] │
│   $30,900         520           $59.42  Saturday  │
│   +18.2%          +12.5%        +5.1%   $6,500    │
├────────────────────────────────────────────────────┤
│  Weekly Performance                                │
│  ──────────────────────────────────────────────────│
│  Mon  ████████░░ $4,200  62 orders                │
│  Tue  ██████████░ $4,800  71 orders               │
│  Wed  ████████░░ $4,100  59 orders                │
│  Thu  ██████████░ $5,200  78 orders               │
│  Fri  ████████████ $6,100  92 orders              │
│  Sat  ████████████ $6,500  98 orders ← PEAK       │
│  Sun  ████████░░ $4,000  60 orders                │
├────────────────────────────────────────────────────┤
│  Peak Hours                                        │
│  ──────────────────────────────────────────────────│
│  6 PM - 7 PM: 78 orders                           │
│  7 PM - 8 PM: 89 orders                           │
│  8 PM - 9 PM: 95 orders ← BUSIEST                 │
│  ...                                               │
├────────────────────────────────────────────────────┤
│  Revenue by Category                               │
│  ──────────────────────────────────────────────────│
│  🍸 Cocktails       $12,500  (35%)                │
│  🍴 Food            $9,800   (28%)                │
│  🍷 Wine            $7,200   (20%)                │
│  🍺 Beer            $4,300   (12%)                │
│  🥤 Non-Alcoholic   $1,800   (5%)                 │
└────────────────────────────────────────────────────┘
```

**Features:**

1. **Tab Navigation:**
   - Overview (default)
   - Revenue (detailed revenue analytics)
   - Customers (customer analytics)
   - Products (product performance)

2. **Overview Tab:**
   - Weekly metrics (4 cards)
   - Daily performance bar chart
   - Peak hours analysis
   - Category revenue breakdown with percentages

**Mock Data:**
```typescript
const analyticsData = {
  weeklyRevenue: 30900,
  revenueTrend: "+18.2%",
  totalOrders: 520,
  ordersTrend: "+12.5%",
  avgOrderValue: 59.42,
  avgTrend: "+5.1%",
  peakDay: "Saturday",
  peakDayRevenue: 6500,

  weeklyPerformance: [
    { day: "Monday", revenue: 4200, orders: 62 },
    { day: "Tuesday", revenue: 4800, orders: 71 },
    // ...
  ],

  peakHours: [
    { time: "6 PM - 7 PM", orders: 78 },
    { time: "7 PM - 8 PM", orders: 89 },
    { time: "8 PM - 9 PM", orders: 95 },
    // ...
  ],

  categoryRevenue: [
    { category: "Cocktails", revenue: 12500, percentage: 35, icon: "🍸" },
    { category: "Food", revenue: 9800, percentage: 28, icon: "🍴" },
    { category: "Wine", revenue: 7200, percentage: 20, icon: "🍷" },
    { category: "Beer", revenue: 4300, percentage: 12, icon: "🍺" },
    { category: "Non-Alcoholic", revenue: 1800, percentage: 5, icon: "🥤" }
  ]
};
```

**Real Implementation:**
- Interactive charts (Chart.js or Recharts)
- Date range filtering
- Export functionality
- Customer retention metrics
- Staff performance analytics
- Inventory turnover rates
- Profit margin analysis

---

### 15. Staff (`/venue/pos/staff`)
**File:** `src/pages/POS/Staff.tsx`

**Purpose:** Staff management and performance tracking

**Layout:**
```
┌────────────────────────────────────────────────────┐
│  Staff Management               [+ Add Staff]      │
├────────────────────────────────────────────────────┤
│  [Active Staff: 3]  [Total Sales: $450]  [Orders: 15]│
├────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────┐ │
│  │ 👤 Sarah Johnson  [Manager]  [Active]        │ │
│  │    Shift: 10:00 AM - 6:00 PM                 │ │
│  │    Sales: $180  |  Orders: 6                 │ │
│  └───────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────┐ │
│  │ 👤 Mike Chen      [Bartender] [Active]       │ │
│  │    Shift: 12:00 PM - 8:00 PM                 │ │
│  │    Sales: $220  |  Orders: 7                 │ │
│  └───────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────┐ │
│  │ 👤 Emma Davis     [Server]    [Break]        │ │
│  │    Shift: 11:00 AM - 7:00 PM                 │ │
│  │    Sales: $50   |  Orders: 2                 │ │
│  └───────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────┐ │
│  │ 👤 Alex Turner    [Kitchen]   [Off]          │ │
│  │    Shift: Not scheduled                      │ │
│  │    [Clock In]                                │ │
│  └───────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

**Features:**

1. **Summary Cards (Top):**
   - Active staff count (calculated from status)
   - Total sales (sum of all active staff sales)
   - Total orders processed

2. **Staff List:**
   - Avatar with initials
   - Full name
   - Role badge (Manager/Bartender/Server/Kitchen)
   - Status indicator (Active/Break/Off)
   - Shift schedule
   - Performance metrics (sales and orders - only for active/break)
   - Clock In button for off-duty staff

**Mock Data:**
```typescript
const staff = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Manager",
    status: "active",
    shift: "10:00 AM - 6:00 PM",
    sales: 180,
    orders: 6,
    avatar: "SJ"
  },
  {
    id: "2",
    name: "Mike Chen",
    role: "Bartender",
    status: "active",
    shift: "12:00 PM - 8:00 PM",
    sales: 220,
    orders: 7,
    avatar: "MC"
  },
  {
    id: "3",
    name: "Emma Davis",
    role: "Server",
    status: "break",
    shift: "11:00 AM - 7:00 PM",
    sales: 50,
    orders: 2,
    avatar: "ED"
  },
  {
    id: "4",
    name: "Alex Turner",
    role: "Kitchen",
    status: "off",
    shift: null,
    avatar: "AT"
  },
  {
    id: "5",
    name: "Lisa Wong",
    role: "Server",
    status: "off",
    shift: null,
    avatar: "LW"
  }
];
```

**Status Colors:**
- **Active:** Green (`bg-green-500`)
- **Break:** Yellow (`bg-yellow-500`)
- **Off:** Muted gray (`bg-gray-500`)

**Role Badge Colors:**
- Manager: Purple
- Bartender: Blue
- Server: Green
- Kitchen: Orange

**Calculations:**
```typescript
const activeStaff = staff.filter(s => s.status === "active").length;
const totalSales = staff
  .filter(s => s.status !== "off")
  .reduce((sum, s) => sum + (s.sales || 0), 0);
const totalOrders = staff
  .filter(s => s.status !== "off")
  .reduce((sum, s) => sum + (s.orders || 0), 0);
```

**Real Implementation:**
- Link to `profiles` and `user_roles` tables
- Clock in/out functionality with timestamps
- Break tracking
- Tips management
- Performance leaderboards
- Schedule management
- Time-off requests
- Payroll integration

---

### 16. Settings (`/venue/pos/settings`)
**File:** `src/pages/POS/Settings.tsx`

**Purpose:** System configuration and preferences

**Layout:**
```
┌────────────────────────────────────────────────────┐
│  Settings                                          │
├────────────────────────────────────────────────────┤
│  VENUE INFORMATION                                 │
│  ──────────────────────────────────────────────────│
│  Venue Name:  [JV POS - Night Venue       ]       │
│  Address:     [123 Main St, City, State   ]       │
│                                    [Save]          │
├────────────────────────────────────────────────────┤
│  PAYMENT SETTINGS                                  │
│  ──────────────────────────────────────────────────│
│  Accepted Payment Methods:                         │
│  [✓ Cash] [✓ Card] [✓ JVCoin] [✓ Mobile Pay]     │
│                                                    │
│  Tax Rate (%):  [10.00]                           │
├────────────────────────────────────────────────────┤
│  PRINTER CONFIGURATION                             │
│  ──────────────────────────────────────────────────│
│  Receipt Printer IP:  [192.168.1.100]             │
│  Kitchen Printer IP:  [192.168.1.101]             │
│                                    [Test Connection]│
└────────────────────────────────────────────────────┘
```

**Settings Categories:**

1. **Venue Information:**
   - Venue name (text input)
   - Address (text input)
   - Save button

2. **Payment Settings:**
   - Payment method toggles (Cash, Card, JVCoin, Mobile Pay)
   - Tax rate input (numeric, percentage)

3. **Printer Configuration:**
   - Receipt printer IP address
   - Kitchen printer IP address
   - Test connection button

**Real Implementation:**
- Store in `venue_settings` table (to be created)
- Logo upload
- Operating hours configuration
- Currency selection
- Language/localization
- Receipt template customization
- Email notification settings
- Backup and restore functionality

---

## COMPONENT SPECIFICATIONS

### 1. POSLayout
**File:** `src/components/POS/POSLayout.tsx`

**Purpose:** Main layout wrapper for all POS pages

**Structure:**
```tsx
<POSProvider>
  <div className="flex min-h-screen w-full">
    <Sidebar />
    <main className="flex-1 overflow-auto bg-background">
      {children}
    </main>
  </div>
</POSProvider>
```

**Features:**
- Wraps all POS pages with POSContext provider
- Two-column layout (sidebar + main content)
- Full-height viewport
- Responsive design

---

### 2. Sidebar
**File:** `src/components/POS/Sidebar.tsx`

**Purpose:** Navigation menu for POS system

**Structure:**
```tsx
<aside className="w-64 border-r border-border glass">
  <div className="p-6">
    <h2>JV POS</h2>
    <p>Night Venue System</p>
  </div>

  <nav className="space-y-2 p-4">
    {navItems.map(item => (
      <NavLink
        to={item.path}
        icon={item.icon}
        label={item.label}
      />
    ))}
  </nav>
</aside>
```

**Navigation Items:**
1. Dashboard → `/venue/pos/dashboard` (LayoutDashboard icon)
2. New Order → `/venue/pos/new-order` (ShoppingCart icon)
3. Orders → `/venue/pos/orders` (UtensilsCrossed icon)
4. Kitchen (Legacy) → `/venue/pos/kitchen` (UtensilsCrossed icon)
5. Kitchen Display → `/venue/pos/kitchen-enhanced` (UtensilsCrossed icon)
6. Menu → `/venue/pos/menu` (Menu icon)
7. Tables → `/venue/pos/tables` (Table2 icon)
8. Floorplan → `/venue/pos/floorplan` (LayoutDashboard icon)
9. Inventory → `/venue/pos/inventory` (Package icon)
10. Analytics → `/venue/pos/analytics` (BarChart3 icon)
11. Staff → `/venue/pos/staff` (Users icon)
12. Settings → `/venue/pos/settings` (Settings icon)

**Active State Styling:**
- Background: `bg-primary/20`
- Text color: `text-primary`
- Font weight: `font-semibold`
- Glow effect: `neon-glow`

**Hover State:**
- Background: `hover:bg-secondary/50`

---

### 3. ProtectedRoute
**File:** `src/components/ProtectedRoute.tsx`

**Purpose:** Guard routes requiring authentication

**Implementation:**
```tsx
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};
```

**Usage:**
```tsx
<Route
  path="/venue/pos/*"
  element={
    <ProtectedRoute>
      <POSLayout>
        <Outlet />
      </POSLayout>
    </ProtectedRoute>
  }
/>
```

---

### 4. KitchenCard
**File:** `src/components/POS/KDS/KitchenCard.tsx`

**Purpose:** Display individual orders in kitchen view

**Props:**
```typescript
interface KitchenCardProps {
  order: {
    id: string;
    orderNumber: number;
    tableNumber: string;
    status: "pending" | "preparing" | "ready";
    items: OrderItem[];
    createdAt: string;
    priority?: "low" | "normal" | "high" | "urgent";
  };
  onStatusUpdate: (orderId: string, newStatus: string) => void;
}
```

**Structure:**
```tsx
<Card>
  <CardContent>
    <div className="flex justify-between">
      <h3>Order #{orderNumber}</h3>
      <Badge>{status}</Badge>
    </div>

    <p>Table {tableNumber}</p>

    <ul>
      {items.map(item => (
        <li>{item.quantity}x {item.name}</li>
      ))}
    </ul>

    <p>{timeAgo}</p>

    <Button onClick={handleStatusUpdate}>
      {getButtonText(status)}
    </Button>
  </CardContent>
</Card>
```

**Status Button Logic:**
- Pending → "Start Preparing"
- Preparing → "Mark Ready"
- Ready → "Complete Order"

---

### 5. shadcn/ui Components

The nocturne-pos system uses **40+ pre-built components** from shadcn/ui:

**Form Components:**
- `input.tsx` - Text inputs
- `label.tsx` - Form labels
- `button.tsx` - Buttons with variants
- `textarea.tsx` - Multi-line text
- `checkbox.tsx` - Checkboxes
- `radio-group.tsx` - Radio buttons
- `select.tsx` - Dropdowns
- `switch.tsx` - Toggle switches

**Display Components:**
- `card.tsx` - Container cards
- `badge.tsx` - Status badges
- `table.tsx` - Data tables
- `avatar.tsx` - User avatars
- `separator.tsx` - Divider lines
- `progress.tsx` - Progress bars

**Overlay Components:**
- `dialog.tsx` - Modals
- `alert-dialog.tsx` - Confirmation dialogs
- `sheet.tsx` - Side panels
- `popover.tsx` - Popovers
- `tooltip.tsx` - Tooltips
- `dropdown-menu.tsx` - Dropdown menus

**Navigation Components:**
- `tabs.tsx` - Tab navigation
- `navigation-menu.tsx` - Nav menus
- `breadcrumb.tsx` - Breadcrumbs

**Feedback Components:**
- `alert.tsx` - Alert messages
- `toast.tsx` - Toast notifications
- `skeleton.tsx` - Loading skeletons
- `spinner.tsx` - Loading spinners

**All components:**
- Built with Radix UI primitives
- Fully accessible (ARIA compliant)
- Customizable with Tailwind
- TypeScript typed
- Consistent design system

---

## STATE MANAGEMENT & CONTEXT

### POSContext

**File:** `src/contexts/POSContext.tsx`

**Purpose:** Global state management for POS operations

**State Variables:**

```typescript
interface POSContextState {
  // Orders
  orders: Order[];

  // Shopping cart
  cart: CartItem[];

  // Menu items
  menu: MenuItem[];

  // Current staff member
  currentStaff: Staff | null;
}
```

**Data Structures:**

```typescript
interface MenuItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  imageUrl?: string;
  available: boolean;
}

interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  modifiers?: string[];
  notes?: string;
}

interface Order {
  id: string;
  orderNumber: number;
  items: CartItem[];
  tableNumber?: string;
  status: "pending" | "preparing" | "ready" | "served" | "cancelled";
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  staffId: string;
}

interface Staff {
  id: string;
  name: string;
  role: "admin" | "manager" | "staff" | "kitchen";
  pin?: string;
}
```

**Context Functions:**

```typescript
interface POSContextType {
  // State
  orders: Order[];
  cart: CartItem[];
  menu: MenuItem[];
  currentStaff: Staff | null;

  // Cart operations
  addToCart: (menuItem: MenuItem) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartItem: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;

  // Order operations
  createOrder: () => Promise<void>;

  // Staff operations
  setCurrentStaff: (staff: Staff | null) => void;
}
```

**Implementation Details:**

```typescript
// Add to cart (or increment if exists)
const addToCart = (menuItem: MenuItem) => {
  const existingItem = cart.find(item => item.menuItem.id === menuItem.id);

  if (existingItem) {
    updateCartItem(existingItem.id, existingItem.quantity + 1);
  } else {
    const newItem: CartItem = {
      id: crypto.randomUUID(),
      menuItem,
      quantity: 1
    };
    setCart([...cart, newItem]);
  }
};

// Update quantity (remove if 0)
const updateCartItem = (cartItemId: string, quantity: number) => {
  if (quantity <= 0) {
    removeFromCart(cartItemId);
  } else {
    setCart(cart.map(item =>
      item.id === cartItemId ? { ...item, quantity } : item
    ));
  }
};

// Remove from cart
const removeFromCart = (cartItemId: string) => {
  setCart(cart.filter(item => item.id !== cartItemId));
};

// Clear entire cart
const clearCart = () => {
  setCart([]);
};

// Create order from cart
const createOrder = async () => {
  const subtotal = cart.reduce((sum, item) =>
    sum + (item.menuItem.price * item.quantity), 0
  );
  const tax = subtotal * 0.10; // 10% tax
  const total = subtotal + tax;

  const newOrder: Order = {
    id: crypto.randomUUID(),
    orderNumber: orders.length + 1001, // Start at 1001
    items: [...cart],
    status: "pending",
    subtotal,
    tax,
    total,
    createdAt: new Date().toISOString(),
    staffId: currentStaff?.id || "unknown"
  };

  // In real implementation: Save to Supabase
  // await supabase.from('orders').insert(newOrder);

  setOrders([...orders, newOrder]);
  clearCart();
};
```

**Mock Menu Initialization:**

```typescript
useEffect(() => {
  // Initialize with sample menu items
  setMenu([
    {
      id: "1",
      name: "Latte",
      description: "Espresso with steamed milk",
      category: "Coffee",
      price: 3.50,
      available: true
    },
    {
      id: "2",
      name: "Cappuccino",
      description: "Espresso with foam",
      category: "Coffee",
      price: 3.75,
      available: true
    },
    {
      id: "3",
      name: "Espresso",
      description: "Strong black coffee",
      category: "Coffee",
      price: 3.00,
      available: true
    },
    {
      id: "4",
      name: "Croissant",
      description: "Butter croissant",
      category: "Food",
      price: 4.25,
      available: true
    },
    {
      id: "5",
      name: "Muffin",
      description: "Blueberry muffin",
      category: "Food",
      price: 4.75,
      available: true
    },
    {
      id: "6",
      name: "Bagel",
      description: "Plain bagel with cream cheese",
      category: "Food",
      price: 4.50,
      available: true
    }
  ]);
}, []);
```

**Provider Setup:**

```typescript
export const POSProvider = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);

  // ... functions ...

  return (
    <POSContext.Provider value={{
      orders,
      cart,
      menu,
      currentStaff,
      addToCart,
      removeFromCart,
      updateCartItem,
      clearCart,
      createOrder,
      setCurrentStaff
    }}>
      {children}
    </POSContext.Provider>
  );
};
```

**Hook Usage:**

```typescript
// In any component
const { cart, addToCart, createOrder } = usePOS();
```

---

### AuthContext

**File:** `src/contexts/AuthContext.tsx`

**Purpose:** Authentication state management

**State:**

```typescript
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasRole: (role: string) => Promise<boolean>;
}
```

**Implementation:**

```typescript
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Listen for auth state changes
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    });
  }, []);

  // Sign in
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast({ title: "Error signing in", description: error.message });
      throw error;
    }

    toast({ title: "Welcome back!" });
  };

  // Sign up
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      toast({ title: "Error signing up", description: error.message });
      throw error;
    }

    // Create user profile
    if (data.user) {
      await supabase.from('profiles').insert({
        user_id: data.user.id,
        full_name: email.split('@')[0]
      });

      // Assign default role
      await supabase.from('user_roles').insert({
        user_id: data.user.id,
        role: 'staff'
      });
    }

    toast({ title: "Account created! Check your email." });
  };

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({ title: "Error signing out", description: error.message });
      throw error;
    }

    toast({ title: "Signed out" });
  };

  // Check user role
  const hasRole = async (role: string) => {
    if (!user) return false;

    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', role)
      .single();

    return !!data;
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Usage:**

```typescript
// In Login.tsx
const { signIn } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();
  await signIn(email, password);
  navigate('/venue/pos/dashboard');
};
```

---

## AUTHENTICATION & AUTHORIZATION

### Supabase Auth Flow

**1. User Registration:**
```
User submits signup form
  ↓
signUp(email, password) called
  ↓
Supabase creates user in auth.users
  ↓
Insert profile in profiles table
  ↓
Insert role in user_roles table (default: staff)
  ↓
Send verification email
  ↓
User clicks email link
  ↓
Account activated
```

**2. User Login:**
```
User submits login form
  ↓
signIn(email, password) called
  ↓
Supabase validates credentials
  ↓
Session token created
  ↓
Token stored in localStorage
  ↓
User state updated in AuthContext
  ↓
Redirect to /venue/pos/dashboard
```

**3. Protected Routes:**
```
User navigates to /venue/pos/dashboard
  ↓
ProtectedRoute checks AuthContext
  ↓
If user === null → Redirect to /auth/login
  ↓
If user exists → Render page
```

**4. Row Level Security (RLS):**

Supabase enforces database-level authorization:

```sql
-- Example: Orders table RLS policy
CREATE POLICY "Staff can view orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Staff can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true);
```

**5. Role-Based Access:**

```typescript
// Check if user is manager
const isManager = await hasRole('manager');

if (isManager) {
  // Show manager-only features
}
```

**Role Hierarchy:**
- **Admin:** Full system access
- **Manager:** All POS functions + staff management
- **Staff:** POS, orders, tables (no settings/analytics)
- **Kitchen:** Kitchen display only

---

## ROUTING STRUCTURE

### Complete Route Configuration

**File:** `src/App.tsx`

```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/signup" element={<Signup />} />

              {/* Protected POS routes */}
              <Route
                path="/venue/pos/*"
                element={
                  <ProtectedRoute>
                    <POSLayout>
                      <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="new-order" element={<NewOrder />} />
                        <Route path="kitchen" element={<Kitchen />} />
                        <Route path="kitchen-enhanced" element={<KitchenEnhanced />} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="menu" element={<Menu />} />
                        <Route path="inventory" element={<Inventory />} />
                        <Route path="tables" element={<Tables />} />
                        <Route
                          path="floorplan"
                          element={
                            <Suspense fallback={<div>Loading Floorplan...</div>}>
                              <FloorplanEditor />
                            </Suspense>
                          }
                        />
                        <Route path="sales" element={<Sales />} />
                        <Route path="staff" element={<Staff />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="settings" element={<Settings />} />

                        {/* Default to dashboard */}
                        <Route path="*" element={<Navigate to="dashboard" replace />} />
                      </Routes>
                    </POSLayout>
                  </ProtectedRoute>
                }
              />

              {/* 404 fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
```

**Route Summary:**

| Path | Component | Auth Required | Description |
|------|-----------|---------------|-------------|
| `/` | Index | No | Landing page |
| `/auth/login` | Login | No | User login |
| `/auth/signup` | Signup | No | User registration |
| `/venue/pos/dashboard` | Dashboard | Yes | Main dashboard |
| `/venue/pos/new-order` | NewOrder | Yes | Create orders |
| `/venue/pos/orders` | Orders | Yes | View all orders |
| `/venue/pos/kitchen` | Kitchen | Yes | Kitchen display (legacy) |
| `/venue/pos/kitchen-enhanced` | KitchenEnhanced | Yes | Kitchen display (enhanced) |
| `/venue/pos/menu` | Menu | Yes | Menu management |
| `/venue/pos/inventory` | Inventory | Yes | Inventory tracking |
| `/venue/pos/tables` | Tables | Yes | Table management |
| `/venue/pos/floorplan` | FloorplanEditor | Yes | Floorplan editor |
| `/venue/pos/sales` | Sales | Yes | Sales reports |
| `/venue/pos/analytics` | Analytics | Yes | Analytics dashboard |
| `/venue/pos/staff` | Staff | Yes | Staff management |
| `/venue/pos/settings` | Settings | Yes | System settings |

---

## DESIGN SYSTEM & STYLING

### Tailwind CSS Configuration

**File:** `tailwind.config.ts`

```typescript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        accent: "hsl(var(--accent))",
        destructive: "hsl(var(--destructive))",
        border: "hsl(var(--border))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};
```

### CSS Custom Properties

**File:** `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Color scheme */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --secondary: 217.2 32.6% 17.5%;
    --muted: 217.2 32.6% 17.5%;
    --accent: 217.2 32.6% 17.5%;
    --destructive: 0 62.8% 30.6%;
    --border: 217.2 32.6% 17.5%;
    --radius: 0.5rem;
  }
}

@layer components {
  /* Glass morphism effect */
  .glass {
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .glass-hover {
    transition: all 0.3s ease;
  }

  .glass-hover:hover {
    background: rgba(15, 23, 42, 0.8);
    border-color: rgba(255, 255, 255, 0.2);
  }

  /* Neon glow effect */
  .neon-glow {
    box-shadow: 0 0 10px rgba(99, 102, 241, 0.5),
                0 0 20px rgba(99, 102, 241, 0.3),
                0 0 30px rgba(99, 102, 241, 0.1);
  }

  .neon-glow:hover {
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.7),
                0 0 30px rgba(99, 102, 241, 0.5),
                0 0 45px rgba(99, 102, 241, 0.3);
  }
}
```

### Component Styling Patterns

**1. Card Component:**
```tsx
<Card className="glass glass-hover">
  <CardContent className="p-6">
    {/* Content */}
  </CardContent>
</Card>
```

**2. Button Variants:**
```tsx
<Button variant="default">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost">Cancel</Button>
<Button variant="outline">Outline</Button>
```

**3. Badge Variants:**
```tsx
<Badge className="bg-green-500/20 text-green-500">Available</Badge>
<Badge className="bg-red-500/20 text-red-500">Occupied</Badge>
<Badge className="bg-blue-500/20 text-blue-500">Reserved</Badge>
<Badge className="bg-yellow-500/20 text-yellow-500">Pending</Badge>
```

**4. Grid Layouts:**
```tsx
{/* Responsive grid: 1 col mobile, 2 tablet, 4 desktop */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
  {/* Items */}
</div>
```

**5. Icons:**
```tsx
import { ShoppingCart, Users, DollarSign } from 'lucide-react';

<ShoppingCart className="h-4 w-4" />
<Users className="h-5 w-5 text-muted-foreground" />
<DollarSign className="h-6 w-6 text-primary" />
```

---

## IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Week 1-2)

**1.1 Project Setup**
- [ ] Initialize Vite + React + TypeScript project
- [ ] Install dependencies (see package.json)
- [ ] Configure Tailwind CSS
- [ ] Set up Supabase project
- [ ] Configure environment variables (.env)

**1.2 Supabase Configuration**
- [ ] Create Supabase account/project
- [ ] Run database migrations
- [ ] Configure Row Level Security policies
- [ ] Set up authentication providers
- [ ] Enable Realtime for orders table

**1.3 Core Components**
- [ ] Install shadcn/ui components
- [ ] Create POSLayout component
- [ ] Create Sidebar navigation
- [ ] Create ProtectedRoute component
- [ ] Set up routing structure

---

### Phase 2: Authentication (Week 2)

**2.1 Auth Context**
- [ ] Implement AuthContext provider
- [ ] Create signIn function
- [ ] Create signUp function
- [ ] Create signOut function
- [ ] Implement hasRole function

**2.2 Auth Pages**
- [ ] Build Login page
- [ ] Build Signup page
- [ ] Add form validation
- [ ] Add error handling
- [ ] Add toast notifications

**2.3 Testing**
- [ ] Test user registration
- [ ] Test user login
- [ ] Test protected routes
- [ ] Test role-based access

---

### Phase 3: POS Core (Week 3-4)

**3.1 POS Context**
- [ ] Implement POSContext provider
- [ ] Create cart state management
- [ ] Implement addToCart function
- [ ] Implement updateCartItem function
- [ ] Implement removeFromCart function
- [ ] Implement clearCart function
- [ ] Implement createOrder function

**3.2 Menu System**
- [ ] Create menu_items table (if not in migration)
- [ ] Fetch menu from Supabase
- [ ] Build Menu management page
- [ ] Add CRUD operations for menu items
- [ ] Add category management

**3.3 New Order Page**
- [ ] Build NewOrder page layout
- [ ] Implement menu display grid
- [ ] Add search functionality
- [ ] Add category filtering
- [ ] Build cart sidebar
- [ ] Implement quantity controls
- [ ] Add price calculations
- [ ] Add checkout functionality

**3.4 Orders Management**
- [ ] Build Orders page
- [ ] Fetch orders from database
- [ ] Display orders in table
- [ ] Add status filtering
- [ ] Add order detail view
- [ ] Implement status updates

---

### Phase 4: Kitchen Display (Week 4-5)

**4.1 Kitchen Display**
- [ ] Build Kitchen page
- [ ] Set up Realtime subscription
- [ ] Display orders in cards
- [ ] Add status filtering
- [ ] Implement status update buttons
- [ ] Add sound notifications

**4.2 Enhanced Kitchen**
- [ ] Build KitchenEnhanced page
- [ ] Add priority indicators
- [ ] Add station filtering
- [ ] Implement timer displays
- [ ] Add prep time tracking

---

### Phase 5: Table Management (Week 5)

**5.1 Tables**
- [ ] Build Tables page
- [ ] Fetch tables from database
- [ ] Display table grid
- [ ] Add table detail panel
- [ ] Implement status updates
- [ ] Link tables to orders

**5.2 Floorplan Editor**
- [ ] Build FloorplanEditor page
- [ ] Implement drag-and-drop
- [ ] Add table positioning
- [ ] Save floorplan configurations
- [ ] Load floorplan layouts

---

### Phase 6: Inventory (Week 6)

**6.1 Inventory System**
- [ ] Create inventory table
- [ ] Build Inventory page
- [ ] Display inventory items
- [ ] Implement stock level tracking
- [ ] Add low-stock alerts
- [ ] Build quantity adjustment modal
- [ ] Add inventory CRUD operations

---

### Phase 7: Analytics & Reports (Week 7)

**7.1 Dashboard**
- [ ] Build Dashboard page
- [ ] Fetch today's statistics
- [ ] Calculate trends (vs yesterday)
- [ ] Display recent orders
- [ ] Show top-selling items

**7.2 Sales Reports**
- [ ] Build Sales page
- [ ] Fetch sales data by hour
- [ ] Create bar chart visualization
- [ ] Display top items
- [ ] Add export functionality

**7.3 Analytics**
- [ ] Build Analytics page
- [ ] Implement tab navigation
- [ ] Create weekly performance charts
- [ ] Add peak hours analysis
- [ ] Show category revenue breakdown
- [ ] Add date range filtering

---

### Phase 8: Staff & Settings (Week 8)

**8.1 Staff Management**
- [ ] Build Staff page
- [ ] Fetch staff from database
- [ ] Display staff list with metrics
- [ ] Add clock in/out functionality
- [ ] Track staff performance
- [ ] Add staff CRUD operations

**8.2 Settings**
- [ ] Build Settings page
- [ ] Add venue information form
- [ ] Implement payment method toggles
- [ ] Add tax rate configuration
- [ ] Add printer settings

---

### Phase 9: Payment Processing (Week 9)

**9.1 Payment Modal**
- [ ] Create payment modal component
- [ ] Add payment method selection
- [ ] Implement payment validation
- [ ] Create payment records in database
- [ ] Update order status after payment

**9.2 Edge Function**
- [ ] Deploy process-payment edge function
- [ ] Integrate with payment gateway (if needed)
- [ ] Add transaction tracking
- [ ] Implement refund functionality

---

### Phase 10: Polish & Testing (Week 10)

**10.1 UI/UX Refinements**
- [ ] Add loading states
- [ ] Implement error boundaries
- [ ] Add empty states
- [ ] Improve mobile responsiveness
- [ ] Add animations and transitions

**10.2 Testing**
- [ ] Test all CRUD operations
- [ ] Test Realtime subscriptions
- [ ] Test authentication flows
- [ ] Test role-based access
- [ ] Performance testing
- [ ] Cross-browser testing

**10.3 Documentation**
- [ ] Write user manual
- [ ] Create admin guide
- [ ] Document API endpoints
- [ ] Add inline code comments

---

### Phase 11: Deployment (Week 11)

**11.1 Production Setup**
- [ ] Set up production Supabase project
- [ ] Configure production environment variables
- [ ] Set up custom domain
- [ ] Configure SSL certificates

**11.2 Deployment**
- [ ] Build production bundle
- [ ] Deploy to hosting (Vercel/Netlify/Lovable)
- [ ] Test production deployment
- [ ] Set up monitoring and error tracking

---

## CURRENT JV VS NOCTURNE COMPARISON

### Detailed Comparison

| Feature | Current JV Implementation | Nocturne POS | Recommendation |
|---------|---------------------------|--------------|----------------|
| **Architecture** | Multiple implementations (Enhanced/Classic/Simplified) causing confusion | Single, clean React + TypeScript implementation | **Use Nocturne** - simpler, maintainable |
| **File Structure** | 59+ JSX files, 33+ CSS files (~25,000 LOC) | 20+ pages, modular components (~3,000 LOC) | **Use Nocturne** - 8x less code |
| **Backend** | Express.js + MongoDB + Odoo (partial integration) | Supabase (PostgreSQL + Auth + Realtime) | **Use Nocturne** - modern, scalable |
| **Database** | MongoDB with incomplete schema | PostgreSQL with full schema + RLS | **Use Nocturne** - proper relational data |
| **Authentication** | Structure exists but not integrated | Complete Supabase Auth with RLS | **Use Nocturne** - production-ready |
| **Data Persistence** | None - all mock data | Full database persistence | **Use Nocturne** - critical requirement |
| **Real-time Updates** | None | Supabase Realtime for kitchen | **Use Nocturne** - essential for KDS |
| **State Management** | Simple Context with mock data | Context + Supabase integration | **Use Nocturne** - proper backend sync |
| **Design System** | Multiple CSS files, inconsistent | shadcn/ui + Tailwind (40+ components) | **Use Nocturne** - consistent, accessible |
| **TypeScript** | Minimal/none | Full TypeScript (95.7%) | **Use Nocturne** - type safety |
| **Component Library** | Custom components | shadcn/ui (Radix primitives) | **Use Nocturne** - accessible, tested |
| **Build Tool** | Webpack (via Wasp) | Vite | **Use Nocturne** - faster dev experience |
| **Order Management** | Frontend only, no DB | Full CRUD with database | **Use Nocturne** - functional |
| **Kitchen Display** | Multiple versions (backup files) | Clean, single implementation | **Use Nocturne** - no confusion |
| **Table Management** | Implemented but no DB | Full table system + floorplan | **Use Nocturne** - complete feature |
| **Inventory** | UI only, no backend | Full inventory with alerts | **Use Nocturne** - operational |
| **Analytics** | Mock data only | Real database queries | **Use Nocturne** - actual insights |
| **Staff Management** | UI structure only | Complete with roles/permissions | **Use Nocturne** - RBAC implemented |
| **Payment Processing** | Simulated (2s delay) | Edge function + DB records | **Use Nocturne** - real transactions |
| **Code Duplication** | High (backup files, multiple implementations) | Minimal (single source of truth) | **Use Nocturne** - DRY principle |
| **Maintenance Burden** | High (25,000+ LOC, multiple patterns) | Low (3,000 LOC, consistent patterns) | **Use Nocturne** - sustainable |

### What to Keep from JV

Despite Nocturne being superior, there are a few things from JV worth considering:

1. **Enhanced Dashboard Charts** - JV has Chart.js integration for visualizations
2. **Payment Modal Design** - JV's EnhancedPaymentModal has nice animations
3. **JVCoin Integration** - Custom cryptocurrency payment method
4. **Mode Toggle** - Classic vs Professional mode (if desired)

### Migration Strategy

**Option 1: Fresh Start (RECOMMENDED)**
- Start new project with Nocturne architecture
- Port JV-specific features (JVCoin, etc.) to Nocturne
- Cleaner, faster implementation
- Estimated time: 8-10 weeks

**Option 2: Gradual Refactor**
- Keep JV structure, replace backend with Supabase
- Simplify frontend components over time
- Higher risk of continued technical debt
- Estimated time: 12-16 weeks

**Recommendation:** **Option 1** - The JV codebase has too much technical debt. Starting fresh with Nocturne's clean architecture will save time in the long run.

---

## IMPLEMENTATION CHECKLIST

Use this checklist when rebuilding the POS system:

### Setup Phase
- [ ] Create new GitHub repository
- [ ] Initialize Vite + React + TypeScript project
- [ ] Install all dependencies from package.json
- [ ] Configure Tailwind CSS and PostCSS
- [ ] Set up Supabase project
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Install shadcn/ui CLI and components

### Core Infrastructure
- [ ] Implement AuthContext (Supabase Auth)
- [ ] Implement POSContext (state management)
- [ ] Create POSLayout component
- [ ] Create Sidebar navigation
- [ ] Create ProtectedRoute guard
- [ ] Set up routing structure
- [ ] Configure toast notifications

### Authentication
- [ ] Build Login page
- [ ] Build Signup page
- [ ] Implement email/password auth
- [ ] Set up RLS policies
- [ ] Create profiles table triggers
- [ ] Test authentication flow

### Menu & Orders
- [ ] Create menu_items table (if needed)
- [ ] Build Menu management page (CRUD)
- [ ] Build NewOrder page with cart
- [ ] Implement order creation logic
- [ ] Build Orders management page
- [ ] Add order filtering and search

### Kitchen Display
- [ ] Build Kitchen page
- [ ] Set up Realtime subscriptions
- [ ] Implement status update workflow
- [ ] Add sound notifications
- [ ] Build KitchenEnhanced page

### Table Management
- [ ] Build Tables page
- [ ] Implement table status management
- [ ] Link tables to orders
- [ ] Build FloorplanEditor page
- [ ] Add drag-and-drop functionality

### Inventory
- [ ] Create inventory table
- [ ] Build Inventory page
- [ ] Implement low-stock alerts
- [ ] Add quantity adjustment
- [ ] Link inventory to menu items

### Analytics & Reports
- [ ] Build Dashboard page
- [ ] Implement statistics calculations
- [ ] Build Sales page with charts
- [ ] Build Analytics page with tabs
- [ ] Add export functionality

### Staff & Settings
- [ ] Build Staff page
- [ ] Implement role management
- [ ] Add clock in/out functionality
- [ ] Build Settings page
- [ ] Add venue configuration

### Payments
- [ ] Build payment modal
- [ ] Implement payment methods
- [ ] Create payments table records
- [ ] Deploy process-payment edge function
- [ ] Test payment flow

### Testing & QA
- [ ] Test all CRUD operations
- [ ] Test authentication flows
- [ ] Test real-time updates
- [ ] Test role-based access
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing

### Deployment
- [ ] Set up production Supabase
- [ ] Configure environment variables
- [ ] Build production bundle
- [ ] Deploy to hosting platform
- [ ] Configure custom domain
- [ ] Set up monitoring

---

## CONCLUSION

This document provides a **complete blueprint** for implementing the Nocturne POS system in your JV repository. The Nocturne architecture is:

- **Simpler:** 3,000 LOC vs 25,000 LOC
- **More maintainable:** Single implementation vs multiple
- **Production-ready:** Real database vs mock data
- **Modern:** TypeScript + Supabase vs legacy patterns
- **Scalable:** Clean architecture vs technical debt

**Next Steps:**

1. **Review this document** with your development team
2. **Set up Supabase project** and run migrations
3. **Start with Phase 1** (Foundation) from the roadmap
4. **Follow the implementation checklist** systematically
5. **Port JV-specific features** (JVCoin, branding) as needed
6. **Test thoroughly** at each phase
7. **Deploy to production** when complete

**Estimated Timeline:** 8-10 weeks for full implementation

**Key Files to Reference:**
- This document: `/home/user/JV/MASTER_POS_SETUP.md`
- Nocturne repo: https://github.com/ezik3/nocturne-pos
- Database migration: `supabase/migrations/20251112135635_*.sql`

---

**Document Created:** 2025-11-17
**Author:** Claude (AI Assistant)
**For:** JV Repository POS System Implementation

---

*This document should be the single source of truth for any AI agent working on the POS system. It contains complete specifications, implementations, and guidance for recreating the Nocturne POS functionality in the JV repository.*
