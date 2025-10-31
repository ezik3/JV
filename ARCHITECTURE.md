# System Architecture - Customer Menu Ordering System

## Overview Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     JOINTVIBE PLATFORM                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────┐         ┌────────────────────┐         │
│  │  CUSTOMER SIDE     │         │   VENUE SIDE       │         │
│  │                    │         │   (POS)            │         │
│  ├────────────────────┤         ├────────────────────┤         │
│  │                    │         │                    │         │
│  │  📱 Menu Browser   │         │  📊 Dashboard      │         │
│  │  /venue/:id/menu   │         │  /pos/dashboard    │         │
│  │                    │         │                    │         │
│  │  Features:         │         │  Features:         │         │
│  │  • Browse by Cat.  │         │  • Analytics       │         │
│  │  • Search Items    │         │  • Quick Actions   │         │
│  │  • View Details    │         │  • Navigation      │         │
│  │  • Add to Cart     │         │                    │         │
│  │  • Order Types     │         │  🛒 POS System     │         │
│  │                    │         │  /pos/system       │         │
│  │  🛒 Checkout       │         │                    │         │
│  │  /checkout         │         │  👨‍🍳 Orders        │         │
│  │                    │         │  /pos/orders       │         │
│  │  Features:         │         │                    │         │
│  │  • Table Select    │         │  📖 Menu Builder   │         │
│  │  • Instructions    │         │  /pos/menu         │         │
│  │  • Payment Method  │         │                    │         │
│  │  • Place Order     │         │  📦 Inventory      │         │
│  │  • Toast Notif.    │         │  /pos/inventory    │         │
│  │                    │         │                    │         │
│  └────────────────────┘         └────────────────────┘         │
│           │                              │                      │
│           └──────────────┬───────────────┘                      │
│                          ▼                                      │
│  ┌──────────────────────────────────────────────────┐          │
│  │              BACKEND API LAYER                   │          │
│  ├──────────────────────────────────────────────────┤          │
│  │                                                   │          │
│  │  Menu APIs                Order APIs             │          │
│  │  ─────────                ──────────             │          │
│  │  GET    /api/menu/items   POST /api/orders      │          │
│  │  POST   /api/menu/items   GET  /api/orders      │          │
│  │  PUT    /api/menu/:id     PUT  /api/orders/:id  │          │
│  │  DELETE /api/menu/:id     GET  /api/venues/:id  │          │
│  │  POST   /api/categories           /orders       │          │
│  │                                                   │          │
│  └──────────────────────────────────────────────────┘          │
│                          ▼                                      │
│  ┌──────────────────────────────────────────────────┐          │
│  │              DATABASE LAYER (Prisma)             │          │
│  ├──────────────────────────────────────────────────┤          │
│  │                                                   │          │
│  │  User ──┬── Order ──── OrderItem ── MenuItem     │          │
│  │         │                            ├── Category│          │
│  │         └── Venue ─┬── MenuItem      └── Inventory          │
│  │                    ├── Category                  │          │
│  │                    ├── Table ─── Order           │          │
│  │                    └── InventoryItem             │          │
│  │                                                   │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Customer Journey Flow

```
START
  │
  ▼
┌─────────────────────────┐
│ Land on Menu Page       │
│ /venue/:venueId/menu    │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Select Order Type       │
│ • Dine-in 🍽️           │
│ • Takeout 🥡           │
│ • Pre-order ⏰         │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Browse Menu             │
│ • By Category           │
│ • By Search             │
│ • View Details          │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Add Items to Cart       │
│ • Click [+] button      │
│ • Cart updates          │
│ • View cart badge       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Review Cart             │
│ • Update quantities     │
│ • Remove items          │
│ • See total             │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Click "Checkout"        │
│ → Navigate to /checkout │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Select Table (if dine-in)│
│ • View available tables │
│ • Choose table          │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Add Special Instructions│
│ • Allergies             │
│ • Preferences           │
│ • Special requests      │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Choose Payment Method   │
│ • JV Coin 💰           │
│ • Credit Card 💳       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Place Order             │
│ → API: POST /orders     │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Toast Notification      │
│ ✅ Order #12345         │
│ "Order placed success!" │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Redirect to Home        │
│ Cart cleared            │
└─────────────────────────┘
  │
  ▼
END
```

## Venue (POS) Flow

```
START
  │
  ▼
┌─────────────────────────┐
│ Manager Login           │
│ /pos/auth/manager       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ POS Dashboard           │
│ /pos/dashboard          │
│                         │
│ • View Analytics        │
│ • See Recent Orders     │
│ • Quick Actions         │
└───────────┬─────────────┘
            │
            ├──────────────────────┐
            │                      │
            ▼                      ▼
┌─────────────────────┐  ┌─────────────────────┐
│ Menu Builder        │  │ Order Management    │
│ /pos/menu           │  │ /pos/orders         │
│                     │  │                     │
│ • Create Items      │  │ • View Orders       │
│ • Edit Items        │  │ • Update Status     │
│ • Delete Items      │  │ • View Details      │
│ • Manage Categories │  │ • Track Progress    │
└─────────────────────┘  └─────────────────────┘
            │                      │
            ▼                      ▼
┌─────────────────────┐  ┌─────────────────────┐
│ Inventory           │  │ POS System          │
│ /pos/inventory      │  │ /pos/system         │
│                     │  │                     │
│ • Track Stock       │  │ • Process Orders    │
│ • Low Stock Alerts  │  │ • In-person Sales   │
│ • Update Quantities │  │ • Quick Checkout    │
└─────────────────────┘  └─────────────────────┘
```

## Data Flow Diagram

```
┌──────────────┐
│   Customer   │
└──────┬───────┘
       │ Browses menu
       ▼
┌──────────────────────┐
│ GET /api/menu/items  │
│ ?venueId=X           │
└──────┬───────────────┘
       │ Returns categories
       │ with menu items
       ▼
┌──────────────┐
│  Categories  │──┐
│  + Items     │  │ Displayed in UI
└──────────────┘  │
                  │
       ┌──────────┘
       │ Customer adds to cart
       ▼
┌──────────────┐
│ Shopping Cart│ (LocalStorage)
└──────┬───────┘
       │ Proceeds to checkout
       ▼
┌──────────────────────┐
│ POST /api/orders     │
│ - venueId            │
│ - orderType          │
│ - tableId            │
│ - items[]            │
│ - specialInstructions│
└──────┬───────────────┘
       │ Creates order
       ▼
┌──────────────┐
│    Order     │──┐
│  OrderItems  │  │
└──────────────┘  │
                  │ Returns order
       ┌──────────┘
       │
       ▼
┌──────────────┐
│   Customer   │
│ Order #12345 │
└──────────────┘
       │
       │ Venue views
       ▼
┌─────────────────────────┐
│ GET /api/venues/:id/    │
│     orders              │
└──────┬──────────────────┘
       │ Returns venue orders
       ▼
┌──────────────┐
│ POS Dashboard│
│ Order List   │
└──────┬───────┘
       │ Updates status
       ▼
┌──────────────────────────┐
│ PUT /api/orders/:id/     │
│     status               │
└──────┬───────────────────┘
       │ Status: preparing
       │ → ready → completed
       ▼
┌──────────────┐
│  Order       │
│  Complete    │
└──────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────┐
│         FRONTEND LAYER              │
├─────────────────────────────────────┤
│ • React 18.2.0                      │
│ • React Router 5.3.3                │
│ • Lucide React (Icons)              │
│ • Chart.js (Analytics)              │
│ • Custom CSS (Responsive)           │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│       ROUTING LAYER (Wasp)          │
├─────────────────────────────────────┤
│ • main.wasp (Route definitions)     │
│ • API endpoint declarations         │
│ • Authentication integration        │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│        BACKEND LAYER                │
├─────────────────────────────────────┤
│ • Node.js / Express                 │
│ • menuRoutes.js                     │
│ • orders.js                         │
│ • Authentication middleware         │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│      DATABASE LAYER (Prisma)        │
├─────────────────────────────────────┤
│ • SQLite (Development)              │
│ • PostgreSQL (Production ready)     │
│ • Prisma ORM                        │
│ • 7 new models                      │
└─────────────────────────────────────┘
```

## File Structure

```
/home/runner/work/JV/JV/
│
├── schema.prisma                    # Database schema
├── main.wasp                        # Routes & API definitions
│
├── src/
│   ├── backend/
│   │   ├── routes/
│   │   │   ├── menuRoutes.js       # Menu CRUD APIs
│   │   │   └── orders.js           # Order APIs
│   │   └── seedData.js             # Sample data
│   │
│   └── frontend/
│       └── pages/
│           ├── CustomerMenu/       # Customer menu interface
│           │   ├── CustomerMenu.jsx
│           │   └── CustomerMenu.css
│           │
│           ├── Checkout/           # Checkout page
│           │   ├── Checkout.jsx
│           │   └── Checkout.css
│           │
│           └── POS/                # POS system
│               ├── components/
│               │   ├── EnhancedDashboard.jsx
│               │   ├── POSLayoutWrapper.jsx
│               │   ├── POSMenuBuilder.jsx
│               │   └── ...
│               └── styles/
│                   └── enhancedDashboard.css
│
└── Documentation/
    ├── MENU_ORDERING_SYSTEM.md     # Feature docs
    ├── IMPLEMENTATION_SUMMARY.md   # Technical details
    ├── QUICK_START.md              # Quick reference
    ├── FINAL_SUMMARY.md            # Completion summary
    └── ARCHITECTURE.md             # This file
```

---

**This architecture provides a scalable, maintainable foundation for the JointVibe menu ordering system!**
