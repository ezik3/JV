# Quick Start Guide - Menu Ordering System

## 🚀 What You Can Do Now

### For Customers
Navigate to: `/venue/:venueId/menu`

**Features Available:**
- ✅ Browse menu by categories
- ✅ Search for specific items
- ✅ View detailed item information
- ✅ Add items to shopping cart
- ✅ Choose order type (Dine-in, Takeout, Pre-order)
- ✅ Select tables for dine-in
- ✅ Add special instructions
- ✅ Choose payment method
- ✅ Place orders

### For Venue Owners
Navigate to: `/venue/pos/dashboard`

**Navigation Available:**
- 📊 Dashboard - Analytics and overview
- 🛒 POS System - Process orders
- 👨‍🍳 Orders - Manage incoming orders
- 📖 Menu Builder - Create/edit menu items
- 📦 Inventory - Track stock

## 🎨 UI Preview

### Customer Menu Interface
```
┌─────────────────────────────────────────────┐
│  ← JointVibe Lounge              🛒 Cart (3)│
├─────────────────────────────────────────────┤
│  🍽️ Dine In  🥡 Takeout  ⏰ Pre-Order      │
├─────────────────────────────────────────────┤
│  🔍 Search menu items...                    │
├─────────────────────────────────────────────┤
│  [Cocktails] [Spirits] [Beer] [Food]        │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────┐  ┌─────────────┐          │
│  │   🍹        │  │   🍸        │          │
│  │ Electric    │  │ Tropical    │          │
│  │ Vibe        │  │ Paradise    │          │
│  │ $15.99  [+] │  │ $14.99  [+] │          │
│  └─────────────┘  └─────────────┘          │
│                                             │
│  ┌─────────────┐  ┌─────────────┐          │
│  │   🥃        │  │   🍺        │          │
│  │ Whiskey     │  │ Craft       │          │
│  │ Flight      │  │ IPA         │          │
│  │ $35.99  [+] │  │ $8.99   [+] │          │
│  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────┘
    [View Cart: 3 items • $45.97] 💳
```

### Checkout Page
```
┌─────────────────────────────────────────────┐
│  ← Checkout                                 │
├─────────────────────────────────────────────┤
│  Order Details                              │
│  🍽️ Dine In                                │
│                                             │
│  Select Table                               │
│  [T1] [T2] [T3] [T4] [T5]                   │
│   ✓                                         │
│                                             │
│  🤖 Need help? [Open AI Waiter]             │
│                                             │
│  Special Instructions                       │
│  ┌───────────────────────────────────────┐ │
│  │ No ice, extra lime please...          │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  Payment Method                             │
│  ◉ 💰 JV Coin                               │
│  ○ 💳 Credit/Debit Card                     │
├─────────────────────────────────────────────┤
│  Order Summary                              │
│  Electric Vibe x1          $15.99           │
│  Tropical Paradise x2      $29.98           │
│  ───────────────────────────────            │
│  Subtotal                  $45.97           │
│  Service Fee               $2.30            │
│  Total                     $48.27           │
│                                             │
│  [Place Order • $48.27] 🚀                  │
└─────────────────────────────────────────────┘
```

### POS Dashboard
```
┌─────────────────────────────────────────────────────────┐
│  🔥 JointVibe POS                                       │
│  [Dashboard] [POS System] [Orders] [Menu] [Inventory]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Dashboard Overview                   Today ▼ [Refresh] │
│  ● All Systems Operational                              │
│                                                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ 💵 Revenue   │ │ 🛒 Orders    │ │ 👥 Customers │   │
│  │ $8,459       │ │ 24 Active    │ │ 156 Today    │   │
│  │ ↗ +15.3%     │ │ 4 Pending    │ │ ↗ +23%       │   │
│  └──────────────┘ └──────────────┘ └──────────────┘   │
│                                                         │
│  Quick Actions                                          │
│  [🛒 New Order] [📖 Menu Builder]                      │
│  [👨‍🍳 Orders]    [📦 Inventory]                        │
│                                                         │
│  📈 Revenue & Orders Chart                              │
│  Recent Orders                                          │
│  #1234 VIP Booth + Vodka    ✅ $524.00  2m ago         │
│  #1235 Cocktails (x4)       ⏳ $72.00   5m ago         │
└─────────────────────────────────────────────────────────┘
```

## 📋 Database Models Overview

```
User ──┬── Order ──── OrderItem ── MenuItem
       │                           ├── Category
       └── Venue ─┬── MenuItem     └── InventoryItem
                  ├── Category
                  ├── Table ─── Order
                  └── InventoryItem
```

## 🔌 API Endpoints Quick Reference

### Menu APIs
```
GET    /api/menu/items?venueId=1        # Fetch menu
POST   /api/menu/items                  # Create item
PUT    /api/menu/items/:id              # Update item
DELETE /api/menu/items/:id              # Delete item
POST   /api/menu/categories             # Create category
```

### Order APIs
```
POST   /api/orders/place-order          # Place order
GET    /api/orders                      # Get user orders
PUT    /api/orders/:id/status           # Update status
GET    /api/venues/:venueId/orders      # Get venue orders
```

## 🎯 Key Routes

### Customer
- `/venue/:venueId/menu` - Browse menu and add to cart
- `/checkout` - Review and place order

### Venue Owner (POS)
- `/venue/pos/auth/manager` - Login
- `/venue/pos/dashboard` - Main dashboard
- `/venue/pos/system` - POS interface
- `/venue/pos/orders` - Order management
- `/venue/pos/menu` - Menu builder
- `/venue/pos/inventory` - Inventory tracking

## 💡 Sample Data

Sample venue with menu items is available in:
`src/backend/seedData.js`

Includes:
- 1 venue (JointVibe Lounge)
- 4 categories (Cocktails, Spirits, Beer & Wine, Food)
- 13 menu items with images, prices, descriptions
- 10 sample tables

## 🚦 Getting Started

1. **Run Migrations**
   ```bash
   # Using Wasp (if installed)
   wasp db migrate-dev
   
   # Or using Prisma directly
   npx prisma migrate dev
   ```

2. **Seed Database (Optional)**
   - Import `seedData.js`
   - Use Prisma client to create records
   - Or manually add via Menu Builder

3. **Access Pages**
   - Customer: `/venue/1/menu` (replace 1 with actual venue ID)
   - Venue: `/venue/pos/auth/manager`

4. **Test Flow**
   - Browse menu
   - Add items to cart
   - Proceed to checkout
   - Select table
   - Place order
   - View order in POS system

## 🎨 Design Colors

### Customer Menu
- Primary: `#6366f1` (Indigo)
- Success: `#10b981` (Green)
- Background: `#f8f9fa` (Light Gray)
- Text: `#1f2937` (Dark Gray)

### POS Dashboard
- Background: `#0F172A` (Dark Blue)
- Surface: `#1E293B` (Slate)
- Accent: `#6366F1` (Indigo)
- Text: `#F8FAFC` (White)

## 🔮 Future Enhancements

**AI Waiter** 🤖
- Voice ordering
- Chat recommendations
- Multi-language support

**JV Coin** 💰
- Wallet integration
- Offline payments
- Transaction history

**Analytics** 📊
- Sales reports
- Popular items
- Peak hours

**Kitchen** 👨‍🍳
- Display system
- Order routing
- Prep tracking

---

**Ready to test!** Start by navigating to `/venue/pos/dashboard` after logging in! 🚀
