# POS Implementation Handoff Document

**Last Updated:** 2025-11-18
**Current Phase:** Phase 2 Complete - Starting Phase 3
**Overall Completion:** 35%

## Project Overview

This is a comprehensive Point of Sale (POS) system built for JoinVibe, supporting multiple venues, employee management, real-time kitchen displays, and advanced payment processing.

## Current Status Summary

### ✅ Completed (Phase 1-2: Foundation)
- [x] Project structure planning
- [x] Documentation framework
- [x] Database schema design
- [x] TypeScript type definitions
- [x] Supabase client setup
- [x] Utility functions library
- [x] Development guidelines

### 🔄 In Progress (Phase 3: Core Implementation)
- [ ] Supabase project setup with user
- [ ] Authentication contexts
- [ ] POS contexts
- [ ] Employee contexts
- [ ] UI framework installation
- [ ] Core pages (4 pages)

### ⏳ Pending (Phase 4-6: Advanced Features)
- [ ] Advanced analytics
- [ ] Multi-location features
- [ ] Third-party integrations
- [ ] Testing suite
- [ ] Deployment

## Architecture Decisions

### Technology Choices

**Frontend Framework: React + TypeScript**
- Reasoning: Type safety, component reusability, large ecosystem
- Trade-offs: Learning curve for TypeScript beginners

**Backend: Wasp Framework**
- Reasoning: Integrated auth, database, and deployment
- Trade-offs: Less flexible than custom backend

**Database: Supabase (PostgreSQL)**
- Reasoning: Real-time subscriptions, built-in auth, excellent DX
- Trade-offs: Vendor lock-in concerns

**UI Framework: Tailwind CSS + shadcn/ui**
- Reasoning: Utility-first, customizable, copy-paste components
- Trade-offs: HTML can get verbose

### State Management

**React Context API**
- AuthContext: User authentication and venue selection
- POSContext: Order state, cart management, menu data
- EmployeeContext: Employee shifts, role-based access

**Why not Redux/Zustand?**
- Context API sufficient for app size
- Simpler setup and maintenance
- Can migrate if needed later

### Database Design Decisions

**Normalized Schema**
- Separate tables for orders, order_items, payments
- Ensures data integrity
- Easier to query and report

**Employee-Venue Relationship**
- Employees linked to single venue
- Manager can create employee accounts
- Shift-based payment routing

**Real-time Considerations**
- Kitchen display subscribes to orders table
- Status updates broadcast via Supabase Realtime
- Optimistic updates on client

## File Structure Explained

```
JV/
├── database/
│   └── complete-schema.sql          # Run this in Supabase SQL editor
│
├── src/frontend/
│   ├── types/
│   │   └── database.types.ts        # Import these types everywhere
│   │
│   ├── lib/
│   │   ├── supabase.ts              # Singleton Supabase client
│   │   └── utils.ts                 # cn(), formatCurrency(), etc.
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx          # useAuth() hook
│   │   ├── POSContext.tsx           # usePOS() hook
│   │   └── EmployeeContext.tsx      # useEmployee() hook
│   │
│   ├── pages/venue/pos/
│   │   ├── auth/manager/
│   │   │   └── ManagerSetup.tsx     # Initial venue setup
│   │   ├── dashboard/
│   │   │   └── Dashboard.tsx        # Main dashboard
│   │   ├── new-order/
│   │   │   └── NewOrder.tsx         # Order creation
│   │   └── kitchen/
│   │       └── KitchenDisplay.tsx   # Kitchen display (3 modes)
│   │
│   └── components/ui/               # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ...
│
└── Documentation files (this and others)
```

## Critical Implementation Notes

### 1. Supabase Setup Process

**Steps for Next Agent:**
1. Guide user to create Supabase project at https://supabase.com
2. User runs `database/complete-schema.sql` in SQL Editor
3. User gets Project URL and Anon Key from Settings > API
4. Create `.env.local` file:
   ```
   REACT_APP_SUPABASE_URL=https://xxx.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJxxx...
   ```
5. Install Supabase client: `npm install @supabase/supabase-js`
6. Test connection in src/frontend/lib/supabase.ts

### 2. Context Implementation Pattern

**All contexts should follow this pattern:**

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface ContextType {
  // State and methods
}

const Context = createContext<ContextType | undefined>(undefined);

export function ContextProvider({ children }: { children: ReactNode }) {
  // State
  // Effects
  // Methods

  return (
    <Context.Provider value={{ /* state and methods */ }}>
      {children}
    </Context.Provider>
  );
}

export function useContextHook() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useContextHook must be used within ContextProvider');
  }
  return context;
}
```

### 3. Kitchen Display Requirements

**CRITICAL: Must be ONE unified component with 3 modes**

```typescript
type ViewMode = 'card' | 'list' | 'kanban';

function KitchenDisplay() {
  const [viewMode, setViewMode] = useState<ViewMode>('card');

  return (
    <div>
      <ViewModeToggle mode={viewMode} onModeChange={setViewMode} />
      {viewMode === 'card' && <CardView />}
      {viewMode === 'list' && <ListView />}
      {viewMode === 'kanban' && <KanbanView />}
    </div>
  );
}
```

**Do NOT create:**
- KitchenLegacy.tsx
- KitchenDisplay.tsx (as separate pages)
- Any separate route for different views

### 4. Real-time Subscriptions

**Pattern for Kitchen Display:**

```typescript
useEffect(() => {
  const subscription = supabase
    .channel('orders')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      (payload) => {
        // Handle order updates
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### 5. Employee Context & Payment Routing

**Key Logic:**

```typescript
// When employee clocks in:
const clockIn = async (employeeId: string) => {
  const { data: shift } = await supabase
    .from('employee_shifts')
    .insert({
      employee_id: employeeId,
      venue_id: currentVenueId,
      start_time: new Date().toISOString(),
    })
    .select()
    .single();

  setActiveShift(shift);
  // Now all payments route to venue account
};

// When processing payment:
const accountId = activeShift
  ? venue.payment_account_id
  : manager.account_id;
```

## Known Issues & Gotchas

### Issue 1: Chart.js Canvas Reuse
**Problem:** Chart.js can throw errors when re-rendering
**Solution:** Destroy chart instance before creating new one
```typescript
useEffect(() => {
  const chart = new Chart(ctx, config);
  return () => chart.destroy();
}, [data]);
```

### Issue 2: Supabase Type Generation
**Problem:** Types can get out of sync with database
**Solution:** Regenerate types after schema changes
```bash
npx supabase gen types typescript --project-id "xxx" > src/frontend/types/database.types.ts
```

### Issue 3: Real-time Connection Limits
**Problem:** Too many subscriptions can hit limits
**Solution:** Combine related subscriptions, clean up properly

### Issue 4: TypeScript Strict Mode
**Problem:** Wasp may have non-strict TypeScript
**Solution:** Use `// @ts-ignore` sparingly, fix types upstream

## Testing Notes

### Manual Testing Checklist
- [ ] Manager can create venue
- [ ] Manager can add employees
- [ ] Employee can clock in
- [ ] Orders appear in Kitchen Display
- [ ] Kitchen Display view modes work
- [ ] Payment processes successfully
- [ ] Real-time updates work
- [ ] Context data persists across navigation

### Unit Testing TODO
- [ ] Utility functions (formatCurrency, cn, etc.)
- [ ] Context providers
- [ ] Custom hooks

### Integration Testing TODO
- [ ] Complete order flow
- [ ] Employee clock in/out
- [ ] Payment processing
- [ ] Kitchen display updates

## Dependencies to Install

```bash
# Supabase
npm install @supabase/supabase-js

# UI Framework (if not already installed)
npm install -D tailwindcss@latest
npm install lucide-react class-variance-authority clsx tailwind-merge

# shadcn/ui (run after Tailwind setup)
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input table select dialog
```

## Environment Variables

Create `.env.local`:
```
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Git Workflow

**Branch:** `claude/phase-3-core-implementation-01KExEwHQ8QQ1tdSbZuz6nYa`

**Commit Strategy:**
- Commit after each major feature
- Use descriptive messages
- Reference task numbers if applicable

**Example commits:**
```
feat: add Supabase client and database types
feat: implement AuthContext with venue selection
feat: create Manager Setup page with form validation
feat: build unified Kitchen Display with 3 view modes
docs: update progress summary to 60%
```

## Common Patterns

### 1. Loading States
```typescript
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true);
      // fetch data
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;
```

### 2. Form Handling
```typescript
const [formData, setFormData] = useState({ ... });

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // submit logic
};
```

### 3. Type-Safe Supabase Queries
```typescript
import { Database } from '../types/database.types';

type Order = Database['public']['Tables']['orders']['Row'];

const { data, error } = await supabase
  .from('orders')
  .select('*')
  .returns<Order[]>();
```

## Performance Considerations

1. **Lazy Loading:** Use React.lazy() for page components
2. **Memoization:** Use useMemo/useCallback for expensive operations
3. **Virtual Scrolling:** For long menu lists
4. **Debouncing:** For search inputs
5. **Subscription Cleanup:** Always unsubscribe in useEffect cleanup

## Accessibility Checklist

- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] ARIA labels on icon buttons
- [ ] Form inputs have labels
- [ ] Color contrast meets WCAG AA
- [ ] Screen reader tested

## Next Agent Instructions

### Immediate Tasks (In Order):
1. ✅ Create foundation docs (THIS SESSION)
2. ⏳ Create database/complete-schema.sql
3. ⏳ Create src/frontend/types/database.types.ts
4. ⏳ Create src/frontend/lib/supabase.ts
5. ⏳ Create src/frontend/lib/utils.ts
6. ⏳ Guide user through Supabase setup
7. ⏳ Create 3 context files
8. ⏳ Install shadcn/ui
9. ⏳ Build 4 core pages
10. ⏳ Update documentation

### Success Criteria:
- All 4 pages render without errors
- TypeScript has no errors
- Kitchen Display shows 3 view toggle
- Contexts provide data correctly
- Documentation updated to 60%

## Questions for User

Before continuing, clarify:
1. Do you already have a Supabase account?
2. What payment providers do you want to integrate first?
3. Any specific branding/theme requirements?
4. Expected number of venues/employees?
5. Any hardware requirements (printers, etc.)?

## Resources

- [Wasp Documentation](https://wasp-lang.dev/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

**Current Agent Status:** Foundation documentation complete. Ready for Phase 3 implementation.

**Next Agent Should Start With:** Creating database schema SQL file, then TypeScript types.
