# Master POS Setup Documentation

**Version:** 2.0
**Last Updated:** 2025-11-18
**Status:** Foundation Complete - Phase 3 In Progress

## Overview

This document outlines the complete setup for the JoinVibe Point of Sale (POS) system, a world-class POS solution built with Wasp, React, TypeScript, and Supabase.

## System Architecture

### Technology Stack
- **Frontend:** React 18 with TypeScript
- **Backend:** Wasp Framework
- **Database:** Supabase (PostgreSQL)
- **UI Framework:** Tailwind CSS + shadcn/ui
- **State Management:** React Context API
- **Real-time:** Supabase Realtime subscriptions
- **Charts:** Chart.js / Recharts

### Key Features
1. **Multi-venue Support** - Manage multiple locations
2. **Employee Management** - Clock in/out, role-based access
3. **Real-time Kitchen Display** - Live order tracking with 3 view modes
4. **Advanced Payment Processing** - Multiple payment methods including crypto
5. **Inventory Management** - Track stock in real-time
6. **Analytics Dashboard** - Revenue, orders, and performance metrics
7. **Manager Controls** - Full administrative access

## Directory Structure

```
JV/
├── database/
│   └── complete-schema.sql          # Complete Supabase schema
├── src/
│   └── frontend/
│       ├── types/
│       │   └── database.types.ts    # TypeScript types
│       ├── lib/
│       │   ├── supabase.ts          # Supabase client
│       │   └── utils.ts             # Utility functions
│       ├── contexts/
│       │   ├── AuthContext.tsx      # Authentication
│       │   ├── POSContext.tsx       # POS state
│       │   └── EmployeeContext.tsx  # Employee management
│       ├── pages/
│       │   └── venue/
│       │       └── pos/
│       │           ├── auth/
│       │           │   └── manager/
│       │           │       └── ManagerSetup.tsx
│       │           ├── dashboard/
│       │           │   └── Dashboard.tsx
│       │           ├── new-order/
│       │           │   └── NewOrder.tsx
│       │           └── kitchen/
│       │               └── KitchenDisplay.tsx
│       └── components/
│           └── ui/                  # shadcn/ui components
├── MASTER_POS_SETUP.md              # This file
├── MASTER_POS_SETUP_V2_ADDITIONS.md
├── POS_IMPLEMENTATION_HANDOFF.md
└── POS_PROGRESS_SUMMARY.md
```

## Database Schema Overview

### Core Tables

#### 1. venues
- Stores venue (restaurant/bar) information
- Links to manager account
- Payment routing configuration

#### 2. employees
- Staff members for each venue
- Role assignment (manager, server, kitchen, bartender)
- Clock in/out tracking

#### 3. employee_shifts
- Shift tracking with start/end times
- Links to employee and venue
- Used for payment routing

#### 4. menu_items
- Products/dishes for each venue
- Category, pricing, availability
- Stock tracking

#### 5. orders
- Customer orders with status tracking
- Order type (dine-in, takeout, delivery)
- Table/customer information

#### 6. order_items
- Individual items in an order
- Quantity, price, modifiers
- Links to menu items

#### 7. payments
- Payment records
- Multiple payment methods
- Transaction status

#### 8. kitchen_display_settings
- Per-venue kitchen display preferences
- View mode (card, list, kanban)
- Sorting and filtering options

## Key Workflows

### 1. Manager Setup Flow
```
1. Manager accesses /venue/pos/auth/manager
2. Enter venue details (name, address, settings)
3. Configure payment methods
4. Set up initial menu categories
5. Create employee accounts
6. Dashboard redirect
```

### 2. Employee Clock-In Flow
```
1. Employee enters PIN/credential
2. System creates shift record
3. Employee context activated
4. Payments route to venue account
5. Role-based UI displayed
```

### 3. Order Processing Flow
```
1. Create new order → Order Screen
2. Add items from menu
3. Apply modifiers/notes
4. Submit to kitchen
5. Kitchen receives order → Kitchen Display
6. Kitchen updates status (preparing, ready)
7. Server marks complete
8. Process payment
9. Close order
```

### 4. Kitchen Display Modes

**Card View**
- Visual cards for each order
- Color-coded by status
- Large, touch-friendly

**List View**
- Compact table format
- Sortable columns
- More orders visible

**Kanban View**
- Columns: New, Preparing, Ready
- Drag-and-drop (optional)
- Status-based organization

## Authentication & Authorization

### Roles
- **Manager:** Full access to all features
- **Server:** Take orders, process payments
- **Kitchen:** View and update order status
- **Bartender:** Bar orders only

### Access Control
- Route protection based on role
- Context-based UI rendering
- Shift-based payment routing

## Real-time Features

### Supabase Realtime Subscriptions
1. **Kitchen Display** - Listen to orders table
2. **Order Updates** - Status changes broadcast
3. **Menu Changes** - Availability updates
4. **Employee Status** - Clock in/out notifications

## Payment Processing

### Supported Methods
1. **Credit/Debit Cards**
2. **Cryptocurrency (XRP, BTC, ETH)**
3. **VIBE Token**
4. **Cash**
5. **Mobile Wallets**

### Payment Routing
- Employee clocked in → Venue account
- Direct manager order → Manager account
- Configurable split percentages

## UI/UX Principles

### Design System
- **Colors:** Professional dark theme
- **Typography:** Inter font family
- **Spacing:** 4px base unit
- **Components:** shadcn/ui for consistency
- **Animations:** Smooth transitions (250ms)

### Responsive Design
- Desktop: Full featured
- Tablet: Touch-optimized
- Mobile: Essential features only

## Development Guidelines

### TypeScript Standards
- Strict mode enabled
- All components in .tsx
- Use database.types.ts for type safety
- No implicit any

### Code Organization
- One component per file
- Shared logic in lib/
- Types in types/
- Contexts for global state

### Best Practices
1. Use TypeScript interfaces from database.types.ts
2. Implement error boundaries
3. Loading states for async operations
4. Optimistic UI updates
5. Real-time subscription cleanup
6. Proper form validation

## Testing Strategy

### Unit Tests
- Utility functions
- Context providers
- Custom hooks

### Integration Tests
- Order flow
- Payment processing
- Kitchen display updates

### E2E Tests
- Complete user journeys
- Multi-venue scenarios
- Real-time functionality

## Deployment

### Prerequisites
1. Supabase project created
2. Environment variables set
3. Database schema installed
4. Row Level Security configured

### Environment Variables
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
```

### Build Process
```bash
npm install
npm run build
wasp deploy
```

## Security Considerations

### Database Security
- Row Level Security (RLS) policies
- Employee can only see own venue data
- Manager has full venue access
- Public access restricted

### API Security
- Supabase anon key for client
- Service role key server-side only
- Rate limiting on endpoints
- Input validation

### Payment Security
- PCI compliance for card payments
- Encrypted transaction data
- Secure key storage
- Audit logging

## Performance Optimization

### Frontend
1. Code splitting
2. Lazy loading routes
3. Memoized components
4. Virtual scrolling for large lists

### Backend
1. Indexed database queries
2. Efficient Supabase subscriptions
3. Caching strategies
4. Connection pooling

## Troubleshooting

### Common Issues

**Supabase Connection Failed**
- Check environment variables
- Verify network connectivity
- Confirm Supabase project is active

**Real-time Not Working**
- Enable Realtime in Supabase dashboard
- Check subscription setup
- Verify table permissions

**Type Errors**
- Regenerate types from Supabase
- Ensure schema matches types
- Check import paths

## Support & Resources

### Documentation
- Wasp Docs: https://wasp-lang.dev/docs
- Supabase Docs: https://supabase.com/docs
- shadcn/ui: https://ui.shadcn.com

### Community
- GitHub Issues
- Discord Channel
- Stack Overflow

## Changelog

### Version 2.0 (2025-11-18)
- Initial foundation setup
- Complete database schema
- TypeScript type definitions
- Supabase integration
- Documentation structure

### Upcoming
- Phase 3: Core page implementation (35% → 60%)
- Phase 4: Advanced features (60% → 80%)
- Phase 5: Testing & refinement (80% → 100%)

---

**Next Steps:** Proceed to Phase 3 implementation following POS_IMPLEMENTATION_HANDOFF.md
