# Architecture Overview - Ordering Flow

This diagram shows how the ordering system works after the fixes.

## Customer Ordering Flow

```
┌─────────────┐
│   Customer  │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. Navigate to venue
       ▼
┌─────────────────────────────┐
│  AIWaiter Component         │
│  /venue/:venueId/ai-waiter  │
└──────┬──────────────────────┘
       │
       │ 2. Request menu
       │ GET /api/menu/items?venueId=X
       ▼
┌─────────────────────────────┐
│  Wasp API Route             │
│  src/backend/routes/        │
│  menuRoutes.js              │
└──────┬──────────────────────┘
       │
       │ 3. Query MongoDB
       ▼
┌─────────────────────────────┐
│  MongoDB                    │
│  MenuItem Collection        │
│  { name, price, category }  │
└──────┬──────────────────────┘
       │
       │ 4. Return menu items
       │ { items: [...] }
       ▼
┌─────────────────────────────┐
│  Customer sees menu         │
│  Adds items to cart         │
└──────┬──────────────────────┘
       │
       │ 5. Place order
       │ POST /api/orders/place-order
       │ { venueId, items, totalAmount }
       ▼
┌─────────────────────────────┐
│  Wasp API Route             │
│  src/backend/routes/        │
│  orders.js:placeOrder       │
│  • Validates input          │
│  • Saves to MongoDB         │
│  • Returns orderId          │
└──────┬──────────────────────┘
       │
       │ 6. Save order
       ▼
┌─────────────────────────────┐
│  MongoDB                    │
│  Order Collection           │
│  { items, status, total }   │
└──────┬──────────────────────┘
       │
       │ 7. Order confirmation
       │ { success: true, orderId: "..." }
       ▼
┌─────────────────────────────┐
│  Customer receives          │
│  Order ID and can track     │
└─────────────────────────────┘
```

## Venue Receiving Orders

```
┌─────────────┐
│   Venue     │
│  Dashboard  │
│  /venue/    │
│  orders     │
└──────┬──────┘
       │
       │ 1. Page loads
       │ GET /api/orders/pos/venue
       ▼
┌─────────────────────────────┐
│  Express Route              │
│  backend/routes/orders.js   │
│  • Authenticates venue      │
│  • Rate limited             │
└──────┬──────────────────────┘
       │
       │ 2. Query MongoDB
       ▼
┌─────────────────────────────┐
│  MongoDB                    │
│  Order Collection           │
│  Find by venueId            │
└──────┬──────────────────────┘
       │
       │ 3. Return orders
       │ [{ _id, items, status, ... }]
       ▼
┌─────────────────────────────┐
│  VenueOrders Component      │
│  • Displays orders          │
│  • Shows status             │
│  • Listens to Socket.IO     │
└──────┬──────────────────────┘
       │
       │ Real-time updates
       │
       │ 4. New order placed
       ▼
┌─────────────────────────────┐
│  Socket.IO Server           │
│  backend/server.js          │
│  • Emits 'newOrder' event   │
│  • To venue room            │
└──────┬──────────────────────┘
       │
       │ 5. Socket event
       │ newOrder: { order }
       ▼
┌─────────────────────────────┐
│  VenueOrders Component      │
│  • Receives new order       │
│  • Updates order list       │
│  • Shows notification       │
└─────────────────────────────┘
```

## Order Status Update Flow

```
┌─────────────┐
│   Venue     │
│  Dashboard  │
└──────┬──────┘
       │
       │ 1. Update order status
       │ PATCH /api/orders/pos/:orderId/status
       │ { status: "confirmed" }
       ▼
┌─────────────────────────────┐
│  Express Route              │
│  backend/routes/orders.js   │
│  • Validates status         │
│  • Updates in MongoDB       │
└──────┬──────────────────────┘
       │
       │ 2. Update database
       ▼
┌─────────────────────────────┐
│  MongoDB                    │
│  Order.findByIdAndUpdate    │
└──────┬──────────────────────┘
       │
       │ 3. Emit Socket.IO events
       ▼
┌─────────────────────────────┐
│  Socket.IO Server           │
│  • To venue room            │
│  • To customer room         │
└──────┬──────┬───────────────┘
       │      │
       │      │ 4. Updates
       ▼      ▼
   ┌────┐  ┌────────┐
   │Venue│  │Customer│
   └────┘  └────────┘
```

## API Endpoints Summary

### Menu APIs (Wasp)
```
GET /api/menu/items?venueId=X
├─ Auth: Required
├─ Returns: { items: [...] }
└─ Status: ✅ Working (was stub)
```

### Order APIs (Wasp)
```
POST /api/orders/place-order
├─ Auth: Required
├─ Body: { venueId, items, totalAmount }
├─ Returns: { success, orderId, order }
├─ Validates: venueId, items, total
└─ Status: ✅ Working (was stub)

GET /api/orders/venue/:venueId
├─ Auth: Required
├─ Returns: { orders: [...] }
└─ Status: ✅ Newly Added

GET /api/orders/status/:orderId
├─ Auth: Required
├─ Returns: { order: {...} }
└─ Status: ✅ Newly Added

PATCH /api/orders/:orderId/status
├─ Auth: Required
├─ Body: { status: "confirmed|preparing|ready|..." }
├─ Returns: { success, order }
└─ Status: ✅ Newly Added
```

### Order APIs (Express - Backend)
```
POST /api/orders/pos/create
├─ Auth: Required (JWT)
├─ Rate Limited: 100/15min
├─ Emits: Socket.IO 'newOrder'
└─ Status: ✅ Working + Enhanced

GET /api/orders/pos/venue
├─ Auth: Required (JWT)
├─ Rate Limited: 100/15min
├─ Returns: Venue's orders
└─ Status: ✅ Working + Enhanced

PATCH /api/orders/pos/:orderId/status
├─ Auth: Required (JWT)
├─ Rate Limited: 100/15min
├─ Emits: Socket.IO 'orderStatusUpdated'
└─ Status: ✅ Working + Enhanced

GET /api/orders/my-orders
├─ Auth: Required (JWT)
├─ Rate Limited: 100/15min
├─ Returns: User's order history
└─ Status: ✅ Newly Added

GET /api/orders/:orderId
├─ Auth: Required (JWT)
├─ Rate Limited: 100/15min
├─ Returns: Specific order details
└─ Status: ✅ Newly Added
```

## Database Schema

### MenuItem
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  available: Boolean,
  venueId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  _id: ObjectId,
  customerName: String,
  userId: ObjectId (ref: User),
  venueId: ObjectId (ref: User),
  items: [{
    name: String,
    quantity: Number,
    price: Number,
    itemId: ObjectId (ref: MenuItem)
  }],
  totalAmount: Number,
  status: String (enum),
  paymentMethod: String (enum),
  paymentStatus: String (enum),
  tableNumber: String,        // 🆕 NEW
  orderType: String (enum),   // 🆕 NEW
  createdAt: Date
}
```

## Security Layers

```
┌────────────────────────────────────┐
│  Browser / Client                  │
└──────────────┬─────────────────────┘
               │
               │ HTTPS (production)
               ▼
┌────────────────────────────────────┐
│  Rate Limiter                      │
│  100 requests / 15 minutes         │
│  Per IP address                    │
└──────────────┬─────────────────────┘
               │
               │ Allowed
               ▼
┌────────────────────────────────────┐
│  Authentication                    │
│  • JWT Token (Express routes)      │
│  • Wasp Context (Wasp routes)      │
└──────────────┬─────────────────────┘
               │
               │ Authenticated
               ▼
┌────────────────────────────────────┐
│  Input Validation                  │
│  • ObjectId format                 │
│  • Type checking                   │
│  • Range validation                │
│  • Enum validation                 │
└──────────────┬─────────────────────┘
               │
               │ Valid
               ▼
┌────────────────────────────────────┐
│  Business Logic                    │
│  • Query database                  │
│  • Process request                 │
│  • Return response                 │
└────────────────────────────────────┘
```

## Real-Time Architecture

```
┌─────────────────┐
│  Socket.IO      │
│  Server         │
│  (Port 5000)    │
└────┬────────────┘
     │
     │ Rooms:
     │ • venue_{venueId}
     │ • user_{userId}
     │
     ├─────────────────────────────┐
     │                             │
     ▼                             ▼
┌─────────────┐           ┌─────────────┐
│  Venue      │           │  Customer   │
│  Dashboard  │           │  App        │
│             │           │             │
│  Listens:   │           │  Listens:   │
│  • newOrder │           │  • order-   │
│  • order-   │           │    Status-  │
│    Status-  │           │    Updated  │
│    Updated  │           │             │
└─────────────┘           └─────────────┘
```

## What Changed

### Before (Broken)
```
Customer → AIWaiter → /api/menu/venue/X/items → 404 Error
Customer → AIWaiter → Place Order → Fake OrderId
Venue → Dashboard → /api/orders/all → 404 Error
```

### After (Working)
```
Customer → AIWaiter → /api/menu/items?venueId=X → Real Menu ✅
Customer → AIWaiter → Place Order → Real Order in DB ✅
Venue → Dashboard → /api/orders/pos/venue → Real Orders ✅
Venue → Dashboard ← Socket.IO ← New Order Notification ✅
```

## Technology Stack

```
Frontend:
├─ React 18
├─ Vite
├─ Socket.IO Client
├─ React Router 5
└─ Wasp Framework

Backend:
├─ Express.js
├─ Wasp API Routes
├─ Socket.IO Server
├─ MongoDB + Mongoose
├─ SQLite + Prisma (Wasp)
└─ JWT Authentication

Security:
├─ express-rate-limit
├─ Input Validation
├─ ObjectId Validation
└─ Error Sanitization
```

## File Structure

```
/home/runner/work/JV/JV/
│
├─ src/
│  ├─ backend/
│  │  └─ routes/          # Wasp API Routes
│  │     ├─ menuRoutes.js    (getMenu) ✅ Fixed
│  │     ├─ orders.js        (4 endpoints) ✅ Fixed
│  │     └─ aiWaiter.js      (existing)
│  │
│  └─ frontend/
│     ├─ pages/
│     │  └─ VenueOrders.jsx  ✅ Fixed
│     └─ components/
│        └─ shared/
│           └─ AIWaiter/
│              └─ index.jsx  ✅ Fixed
│
├─ backend/
│  ├─ models/
│  │  ├─ order.js         ✅ Enhanced
│  │  ├─ menu.js          (existing)
│  │  └─ user.js          (existing)
│  │
│  ├─ routes/
│  │  └─ orders.js        ✅ Enhanced + 2 new endpoints
│  │
│  ├─ server.js           (Socket.IO server)
│  └─ seed-test-data.js   🆕 NEW
│
├─ main.wasp              ✅ 4 new API routes
│
└─ Documentation:
   ├─ SUMMARY.md             🆕 This overview
   ├─ TESTING_GUIDE.md       🆕 How to test
   ├─ CORE_FUNCTIONALITY_STATUS.md  🆕 Status report
   ├─ KNOWN_LIMITATIONS.md   🆕 Known issues
   └─ .env.example          🆕 Config template
```

## Quick Start Guide

1. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI
   ```

2. **Seed Test Data**
   ```bash
   cd backend
   node seed-test-data.js
   ```

3. **Start Servers**
   ```bash
   # Terminal 1: Backend
   cd backend
   npm start

   # Terminal 2: Frontend
   npm run dev
   ```

4. **Test Ordering**
   - Navigate to `/venues`
   - Click on a venue
   - Ask AI waiter to "show menu"
   - Place an order
   - Check `/venue/orders` as venue owner

---

For detailed testing instructions, see **TESTING_GUIDE.md**
For known limitations, see **KNOWN_LIMITATIONS.md**
For complete status report, see **CORE_FUNCTIONALITY_STATUS.md**
