# 🎯 JointVibe POS V2 System

> **Complete Point-of-Sale system for the JointVibe platform**

## 📋 Overview

This is a comprehensive POS system designed for JointVibe venues with three distinct user experiences:

1. **Owner/Manager** - Full POS access (13 pages)
2. **Employee** - Shift mode with role-based access
3. **Enduser** - Check-in experience with AI ordering

## 🚀 Current Status

**Progress:** 30% Complete (Foundation Ready)

### ✅ Completed
- Complete database schema (30+ tables)
- TypeScript type definitions (80+ types)
- Supabase client setup
- Utility functions library (60+ functions)
- Comprehensive documentation

### ⏳ In Progress
- Authentication contexts
- UI component library
- POS pages implementation

### 📅 Timeline
- **Foundation:** Week 1 (DONE)
- **Core POS:** Weeks 2-4
- **Employee System:** Week 5
- **Enduser Experience:** Week 6-7
- **Final Features:** Week 8-10

## 📚 Documentation

### Start Here
1. **[POS_IMPLEMENTATION_HANDOFF.md](./POS_IMPLEMENTATION_HANDOFF.md)** - Read this first!
2. **[MASTER_POS_SETUP.md](./MASTER_POS_SETUP.md)** - Complete specifications
3. **[MASTER_POS_SETUP_V2_ADDITIONS.md](./MASTER_POS_SETUP_V2_ADDITIONS.md)** - V2 features

### Key Files
- `database/complete-schema.sql` - Database schema
- `src/frontend/types/database.types.ts` - TypeScript types
- `src/frontend/lib/supabase.ts` - Supabase client
- `src/frontend/lib/utils.ts` - Utility functions

## 🔧 Quick Start

### Prerequisites
- Node.js 18+
- Wasp 0.14.2+
- Supabase account

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# 3. Run database schema in Supabase SQL Editor
# Copy contents of database/complete-schema.sql

# 4. Start development server
npm run dev
```

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│     THREE USER EXPERIENCES          │
├─────────────────────────────────────┤
│                                     │
│  1. OWNER/MANAGER                   │
│     - Full POS (13 pages)           │
│     - Analytics & Reports           │
│     - Staff Management              │
│                                     │
│  2. EMPLOYEE (Shift Mode)           │
│     - Mobile POS                    │
│     - Role-based access             │
│     - Clock in/out                  │
│                                     │
│  3. ENDUSER (Customer)              │
│     - Geolocation check-in          │
│     - AI menu chat                  │
│     - Mobile ordering               │
│                                     │
└─────────────────────────────────────┘
```

## 📦 Tech Stack

### Frontend
- **Framework:** Wasp 0.14.2 (React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **State:** React Context API

### Backend
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Realtime:** Supabase Realtime
- **Storage:** Supabase Storage
- **API:** Wasp API endpoints

### External Services
- **AI:** OpenAI (for AI waiter)
- **Payments:** Stripe + JVCoin
- **SMS:** Twilio
- **Maps:** Google Maps API

## 🎯 Key Features

### Manager Features
- ✅ Real-time dashboard with live metrics
- ✅ New order creation with cart system
- ✅ Unified kitchen display (3 view modes)
- ✅ Menu management (CRUD)
- ✅ Table & floorplan management
- ✅ Inventory tracking
- ✅ Sales reports & analytics
- ✅ Staff management with invitations
- ✅ Configurable settings

### Employee Features
- ✅ Email invitation system
- ✅ Shift clock in/out
- ✅ Mobile POS on personal device
- ✅ Role-based permissions
- ✅ Performance metrics

### Enduser Features
- ✅ Geolocation-based check-in (100m radius)
- ✅ AI menu chat assistant
- ✅ Mobile ordering from table
- ✅ Seating visualization
- ✅ Social features (guest messaging)
- ✅ Call waiter / Request bill
- ✅ Remote ordering (pickup/delivery/dine-in)

### Advanced Features
- ✅ Real-time order updates
- ✅ Push notification ad system
- ✅ Multi-role authentication
- ✅ Row Level Security (RLS)
- ✅ VR-ready floorplan (A-Frame integration planned)
- ✅ Web3 integration (JVCoin)

## 📄 Database Schema

30+ tables including:
- User management (roles, profiles)
- Venue management
- Employee system
- Menu & categories
- Orders & payments
- Tables & floorplans
- Inventory
- Check-ins & reservations
- Push notifications
- Analytics

**See:** `database/complete-schema.sql`

## 🎨 UI Components

Using shadcn/ui for consistent, accessible components:
- Button, Card, Input, Label
- Table, Badge, Tabs, Dialog
- Select, Separator, Toast
- Avatar, Checkbox, Slider
- Dropdown Menu, Popover

**Install:**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label table badge tabs dialog
```

## 🧪 Testing

```bash
# Run type check
npm run type-check

# Run linter
npm run lint

# Run tests (when implemented)
npm run test
```

## 📁 Project Structure

```
/home/user/JV/
├── MASTER_POS_SETUP.md
├── MASTER_POS_SETUP_V2_ADDITIONS.md
├── POS_IMPLEMENTATION_HANDOFF.md
├── README_POS.md (this file)
├── .env.example
├── database/
│   └── complete-schema.sql
└── src/frontend/
    ├── lib/
    │   ├── supabase.ts ✅
    │   └── utils.ts ✅
    ├── types/
    │   └── database.types.ts ✅
    ├── contexts/
    │   ├── AuthContext.tsx (next)
    │   ├── POSContext.tsx (next)
    │   └── EmployeeContext.tsx (next)
    ├── components/
    │   ├── ui/ (shadcn/ui)
    │   ├── Layout/
    │   ├── POS/
    │   ├── Kitchen/
    │   └── Employee/
    └── pages/
        ├── POS/ (13 pages)
        ├── Employee/
        └── Enduser/
```

## 🚦 Development Workflow

### For Next Agent

1. **Read Documentation**
   - POS_IMPLEMENTATION_HANDOFF.md
   - MASTER_POS_SETUP.md
   - MASTER_POS_SETUP_V2_ADDITIONS.md

2. **Set Up Supabase**
   - Create project
   - Run database schema
   - Configure .env

3. **Build Foundation**
   - Create AuthContext
   - Create POSContext
   - Install shadcn/ui

4. **Build Pages (In Order)**
   - Manager Setup
   - Dashboard
   - New Order
   - Kitchen Display
   - ... (see docs for full list)

5. **Test & Deploy**
   - Comprehensive testing
   - Bug fixes
   - Production deployment

## 📖 API Documentation

### Supabase Client

```typescript
import { supabase } from '@/lib/supabase';

// Get current user
const user = await getCurrentUser();

// Get user roles
const roles = await getUserRoles(user.id);

// Subscribe to real-time changes
const channel = subscribeToTable('orders', { venue_id: venueId }, (payload) => {
  console.log('Order updated:', payload);
});
```

### Utility Functions

```typescript
import {
  formatCurrency,
  formatDateTime,
  calculateTotal,
  isWithinRadius
} from '@/lib/utils';

// Format currency
const price = formatCurrency(24.99); // "$24.99"

// Format date/time
const time = formatDateTime(order.created_at); // "Nov 18, 2025, 2:30 PM"

// Calculate order total
const total = calculateTotal(subtotal, tax, tip, discount);

// Check if user is within venue radius
const nearby = isWithinRadius(userLat, userLon, venueLat, venueLon, 100);
```

## 🐛 Troubleshooting

### Common Issues

**Issue:** Can't connect to Supabase
- Check .env file
- Verify URL and anon key
- Check Supabase project status

**Issue:** RLS policy denying access
- Check user_roles table
- Verify venue ownership
- Check employee_venue_links

**Issue:** Real-time not working
- Enable Replication in Supabase
- Check subscription code
- Verify network connection

## 🤝 Contributing

### Updating Documentation

After each work session:
1. Update completion status in POS_IMPLEMENTATION_HANDOFF.md
2. Update MASTER_POS_SETUP.md
3. Update MASTER_POS_SETUP_V2_ADDITIONS.md
4. Commit with descriptive message
5. Push to branch: `claude/build-complete-pos-system-01DTeM1ZTUdckFYiXNWtipDG`

### Code Guidelines

- Use TypeScript throughout
- Follow existing patterns
- Write clean, readable code
- Test thoroughly
- Update documentation

## 📞 Support

For questions or issues:
1. Check documentation first
2. Review code examples in docs
3. Test in isolation
4. Check Supabase logs

## 📜 License

Proprietary - JointVibe

---

## 🎯 Next Steps

**For Next Agent:**

1. ✅ Read POS_IMPLEMENTATION_HANDOFF.md
2. Set up Supabase project
3. Create .env file
4. Run database schema
5. Create AuthContext.tsx
6. Start building pages

**See:** POS_IMPLEMENTATION_HANDOFF.md for detailed instructions

---

**Created:** 2025-11-18
**Version:** 2.0.0
**Status:** Foundation Complete (30%)
**Next Milestone:** Authentication Contexts (45%)

🚀 **Let's build an amazing POS system!**
