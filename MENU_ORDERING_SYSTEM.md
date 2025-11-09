# Customer Menu Ordering System

## Overview

This implementation provides a comprehensive customer-facing menu ordering system inspired by UberEats and McDonald's interfaces, along with venue management capabilities for the JointVibe POS system.

## Features Implemented

### 1. Database Schema
- **Venue**: Stores venue information with support for pre-ordering
- **Category**: Menu categories for organizing items
- **MenuItem**: Individual menu items with pricing, images, and metadata
- **InventoryItem**: Inventory tracking for menu items
- **Table**: Table management for dine-in orders
- **Order**: Customer orders with status tracking
- **OrderItem**: Individual items within orders

### 2. Backend APIs

#### Menu Management
- `GET /api/menu/items?venueId=X` - Fetch menu items by venue
- `POST /api/menu/items` - Create new menu item
- `PUT /api/menu/items/:id` - Update menu item
- `DELETE /api/menu/items/:id` - Delete menu item
- `POST /api/menu/categories` - Create new category

#### Order Management
- `POST /api/orders/place-order` - Place a new order
- `GET /api/orders` - Get user's orders
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/venues/:venueId/orders` - Get venue's orders

### 3. Customer-Facing Features

#### Menu Browsing (`/venue/:venueId/menu`)
- Modern, responsive UI inspired by UberEats/McDonald's
- Category-based navigation
- Search functionality
- Item detail modals with full information
- Shopping cart with add/remove/update capabilities
- Support for three order types:
  - 🍽️ Dine In
  - 🥡 Takeout
  - ⏰ Pre-Order

#### Checkout (`/checkout`)
- Table selection for dine-in orders
- Special instructions field
- Payment method selection (JV Coin, Card)
- Order summary with pricing breakdown
- AI Waiter integration placeholder

### 4. Venue Management Features

#### POS Dashboard (`/venue/pos/dashboard`)
- Enhanced navigation with quick access to all features
- Real-time statistics:
  - Revenue tracking
  - Active orders
  - Customer count
  - Average order value
- Revenue and order charts
- Recent orders list
- Quick action buttons for common tasks

#### Navigation Structure
- Dashboard - Analytics and overview
- POS System - Point of sale interface
- Orders - Order management
- Menu Builder - Menu item management
- Inventory - Stock management

### 5. UI/UX Design

#### Customer Menu
- **Color Scheme**: Modern gradient backgrounds with clean white cards
- **Typography**: Clean, readable fonts with proper hierarchy
- **Interactions**: 
  - Hover effects on menu items
  - Smooth animations and transitions
  - Modal overlays for item details
  - Floating cart button on mobile
- **Responsive**: Fully responsive design for mobile, tablet, and desktop

#### POS Dashboard
- **Color Scheme**: Dark theme with purple accents (#6366F1)
- **Layout**: Card-based dashboard with clear sections
- **Charts**: Interactive Chart.js visualizations
- **Navigation**: Top navigation bar with all key features

## How to Use

### For End Users (Customers)

1. **Browse Menu**
   - Navigate to `/venue/:venueId/menu`
   - Select order type (Dine In, Takeout, or Pre-Order)
   - Browse categories or use search
   - Click items to view details
   - Add items to cart

2. **Checkout**
   - Review cart items
   - For dine-in: Select a table
   - Add special instructions if needed
   - Choose payment method
   - Place order

3. **AI Waiter** (Coming Soon)
   - Get personalized recommendations
   - Ask about ingredients and allergens
   - Modify orders via voice/chat
   - Request human assistance

### For Venue Owners

1. **Setup Menu**
   - Go to `/venue/pos/menu`
   - Create categories
   - Add menu items with:
     - Name and description
     - Price
     - Images
     - Preparation time
     - Allergen information
     - Calorie count

2. **Manage Orders**
   - View incoming orders on `/venue/pos/orders`
   - Update order status (pending → preparing → ready → completed)
   - Track order history

3. **Monitor Performance**
   - Dashboard shows real-time analytics
   - Revenue trends
   - Popular items
   - Customer metrics

## Technical Implementation

### Frontend Structure
```
src/frontend/pages/
├── CustomerMenu/
│   ├── CustomerMenu.jsx
│   └── CustomerMenu.css
├── Checkout/
│   ├── Checkout.jsx
│   └── Checkout.css
└── POS/
    └── components/
        ├── EnhancedDashboard.jsx
        ├── POSMenuBuilder.jsx
        ├── POSOrders.jsx
        └── ...
```

### Backend Structure
```
src/backend/routes/
├── menuRoutes.js
└── orders.js
```

### Database Models
See `schema.prisma` for complete schema definition.

## Future Enhancements

### Planned Features
1. **AI Waiter Integration**
   - Voice ordering
   - Chat-based assistance
   - Personalized recommendations
   - Multilingual support

2. **JV Coin Payment**
   - Crypto wallet integration
   - Offline payment support
   - Transaction history
   - Rewards and loyalty points

3. **Advanced Menu Features**
   - Customizable menu items
   - Modifiers and add-ons
   - Combo meals
   - Time-based availability

4. **Enhanced Analytics**
   - Sales reports
   - Popular items analysis
   - Peak hours tracking
   - Customer demographics

5. **Kitchen Management**
   - Kitchen display system
   - Order routing
   - Preparation tracking
   - Staff assignments

## Inspiration

This implementation draws inspiration from:
- **UberEats**: Clean menu browsing, category navigation, search functionality
- **McDonald's**: Fast ordering flow, visual menu presentation
- **Modern POS Systems**: Comprehensive venue management, real-time analytics

## Notes

- The system is designed to work both online and offline (with crypto payments)
- All UI components are built with accessibility in mind
- The code follows React best practices and modern ES6+ syntax
- Database queries are optimized with proper indexing and relationships
- Security considerations include authentication, authorization, and input validation

## Support

For issues or questions about the menu ordering system, please refer to the main JointVibe documentation or contact the development team.
