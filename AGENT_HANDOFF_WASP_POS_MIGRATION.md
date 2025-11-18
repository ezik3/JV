# 🚨 CRITICAL: WASP POS MIGRATION - AGENT HANDOFF DOCUMENT 🚨

**READ THIS ENTIRE FILE BEFORE DOING ANYTHING**

---

## ⚠️ WHAT THE FUCK WENT WRONG

We built 6 beautiful POS pages for **React + Supabase**, but this project uses **WASP** with **Prisma**.

The pages won't compile because they're trying to:
- Import from Supabase (doesn't exist in Wasp)
- Use custom React contexts (Wasp has its own auth)
- Call Supabase APIs directly (Wasp uses Prisma)

**WE NEED TO CONVERT THESE 6 PAGES TO WORK WITH WASP.**

---

## 🎯 THE MISSION

Convert 6 POS pages from Supabase architecture to Wasp architecture.

**THIS IS A COMPLETE POS SYSTEM REPLACEMENT - WE ARE NOT KEEPING THE OLD POS.**

---

## 📁 THE 6 FILES THAT NEED CONVERSION

All located in: `/home/user/JV/src/frontend/pages/POS/`

1. **Orders.jsx** - Order history & management
2. **Inventory.jsx** - Stock tracking & alerts
3. **MenuBuilder.jsx** - Menu item CRUD
4. **StaffManagement.jsx** - Employee management
5. **Analytics.jsx** - Business intelligence
6. **Settings.jsx** - System configuration

**DO NOT DELETE THESE FILES. CONVERT THEM IN PLACE.**

---

## 🔥 WHAT NEEDS TO CHANGE IN EACH FILE

### Current (Broken) Pattern:
```jsx
// ❌ THIS DOESN'T WORK IN WASP
import { useAuth, usePOS } from '../../contexts';
import { supabase } from '../../lib/supabase';

const { data } = await supabase.from('orders').select('*');
```

### New (Wasp) Pattern:
```jsx
// ✅ THIS WORKS IN WASP
import { useAuth } from 'wasp/client/auth';
import { useQuery } from 'wasp/client/operations';
import { getOrders } from 'wasp/client/operations';

const { data: orders } = useQuery(getOrders);
```

---

## 📋 CONVERSION CHECKLIST

After you complete EACH file, mark it here with `[x]` and update the "Completed By" field.

### File Status:

- [ ] **Orders.jsx** - NOT STARTED
  - Completed By: [Agent Name]
  - Date: [YYYY-MM-DD]
  - Notes: [Any issues encountered]

- [ ] **Inventory.jsx** - NOT STARTED
  - Completed By: [Agent Name]
  - Date: [YYYY-MM-DD]
  - Notes: [Any issues encountered]

- [ ] **MenuBuilder.jsx** - NOT STARTED
  - Completed By: [Agent Name]
  - Date: [YYYY-MM-DD]
  - Notes: [Any issues encountered]

- [ ] **StaffManagement.jsx** - NOT STARTED
  - Completed By: [Agent Name]
  - Date: [YYYY-MM-DD]
  - Notes: [Any issues encountered]

- [ ] **Analytics.jsx** - NOT STARTED
  - Completed By: [Agent Name]
  - Date: [YYYY-MM-DD]
  - Notes: [Any issues encountered]

- [ ] **Settings.jsx** - NOT STARTED
  - Completed By: [Agent Name]
  - Date: [YYYY-MM-DD]
  - Notes: [Any issues encountered]

---

## 🛠️ STEP-BY-STEP CONVERSION PROCESS

### FOR EACH FILE, DO THIS:

1. **Open the file**
   ```bash
   nano /home/user/JV/src/frontend/pages/POS/[FILENAME].jsx
   ```

2. **Remove these imports:**
   ```jsx
   // DELETE THESE
   import { useAuth, usePOS, useEmployee } from '../../contexts';
   import { supabase } from '../../lib/supabase';
   import { formatCurrency, formatTime } from '../../lib/utils';
   ```

3. **Add these imports:**
   ```jsx
   // ADD THESE
   import { useAuth } from 'wasp/client/auth';
   ```

4. **Replace Supabase calls with Wasp queries/actions**
   - Find all `supabase.from().select()` → Replace with Wasp `useQuery`
   - Find all `supabase.from().insert()` → Replace with Wasp `action`
   - Find all `supabase.from().update()` → Replace with Wasp `action`
   - Find all `supabase.from().delete()` → Replace with Wasp `action`

5. **Fix the useAuth() usage**
   ```jsx
   // OLD (Supabase)
   const { venue, isAuthenticated } = useAuth();

   // NEW (Wasp)
   const { data: user } = useAuth();
   // Access user properties directly
   ```

6. **Remove context dependencies**
   - Remove `usePOS()` calls
   - Remove `useEmployee()` calls
   - Replace with direct Wasp queries

7. **Test compilation**
   ```bash
   wasp start
   ```

8. **Update this handoff file**
   - Mark the file as `[x]` complete
   - Add your agent name
   - Add today's date
   - Note any issues

---

## 🔍 COMMON PATTERNS TO FIX

### Pattern 1: Fetching Data

**BEFORE (Supabase):**
```jsx
const fetchOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('venue_id', venue.id);
  setOrders(data);
};
```

**AFTER (Wasp):**
```jsx
// In main.wasp, define:
// query getOrders {
//   fn: import { getOrders } from "@src/server/queries",
//   entities: [Order]
// }

// In the component:
const { data: orders, isLoading } = useQuery(getOrders);
```

### Pattern 2: Creating Data

**BEFORE (Supabase):**
```jsx
const createOrder = async () => {
  const { error } = await supabase
    .from('orders')
    .insert([orderData]);
};
```

**AFTER (Wasp):**
```jsx
// In main.wasp, define:
// action createOrder {
//   fn: import { createOrder } from "@src/server/actions",
//   entities: [Order]
// }

// In the component:
import { createOrder } from 'wasp/client/operations';

const handleCreate = async () => {
  await createOrder(orderData);
};
```

### Pattern 3: Real-time Updates

**BEFORE (Supabase subscriptions):**
```jsx
const subscription = supabase
  .channel('orders-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, handleChange)
  .subscribe();
```

**AFTER (Wasp polling/manual refresh):**
```jsx
// Use polling interval
useEffect(() => {
  const interval = setInterval(() => {
    refetch(); // refetch from useQuery
  }, 5000);
  return () => clearInterval(interval);
}, []);
```

---

## 🚫 DO NOT CHANGE THESE

**KEEP THESE AS-IS:**
- UI components (Button, Card, Input, etc.) - They work fine
- Tailwind CSS classes - They work fine
- Component structure - Keep the same layout
- Feature functionality - Don't remove features

**ONLY CHANGE:**
- Imports (Supabase → Wasp)
- Data fetching (supabase.from() → useQuery)
- Data mutations (supabase.insert/update → actions)
- Auth usage (contexts → Wasp auth)

---

## 📝 AFTER EACH FILE IS DONE

1. **Mark it complete in the checklist above**
2. **Add your agent name and date**
3. **Note any problems you encountered**
4. **Test that `wasp start` compiles without errors**
5. **Commit your changes:**
   ```bash
   git add src/frontend/pages/POS/[FILENAME].jsx
   git commit -m "feat: Convert [FILENAME] to Wasp architecture"
   git push
   ```

---

## 🎯 HOW TO KNOW YOU'RE DONE

When ALL 6 files are marked `[x]` and `wasp start` runs without errors.

```bash
wasp start
# Should see: ✅ --- Successfully completed npm install.
# Should NOT see: ❌ --- [Error] Your wasp project failed to compile
```

---

## 📞 IF YOU GET STUCK

**Common Issues:**

1. **"Module has no exported member"**
   - You're importing something that doesn't exist in Wasp
   - Check main.wasp for available queries/actions
   - You might need to create a new query/action in main.wasp first

2. **"Property does not exist on type"**
   - Wasp's types are different from Supabase
   - Check the Prisma schema for correct field names
   - Look at existing Wasp pages for examples

3. **"Cannot find module 'wasp/client/operations'"**
   - You need to define the query/action in main.wasp first
   - Then Wasp will generate the client code

---

## 🔄 AGENT ROTATION PROTOCOL

**When you finish your session:**

1. Update the checklist above with what you completed
2. Add your agent name and date to each completed file
3. Write clear notes about any problems
4. Commit and push your changes
5. The next agent will read this file and continue where you left off

**When you start a new session:**

1. Read this ENTIRE file first
2. Check the checklist to see what's been done
3. Pick the next uncompleted file
4. Follow the conversion process above
5. Update the checklist when done

---

## 📊 CURRENT PROGRESS

**Files Completed:** 0 / 6
**Status:** NOT STARTED
**Next File:** Orders.jsx

---

## 🎯 SUCCESS CRITERIA

✅ All 6 files marked complete in checklist
✅ `wasp start` compiles with no errors
✅ All pages accessible at their routes
✅ No Supabase imports remaining
✅ No custom context imports remaining
✅ All database operations use Wasp queries/actions

---

## 🚀 FINAL NOTES

- This is a 12-month old Wasp project - DO NOT BREAK IT
- Only touch the 6 POS files listed above
- Test after EACH file conversion
- Document problems in the checklist
- The next agent has ZERO context - make your notes clear

**NOW START WITH Orders.jsx AND FOLLOW THE PROCESS ABOVE.**

---

**Last Updated:** 2025-11-18
**Current Agent:** [FILL THIS IN WHEN YOU START]
**Branch:** claude/complete-pos-system-01Pifb9t4e1zYhd6m6PEJrvj
