# POS System Quick Reference

## Import Pattern Changes

### ❌ OLD (Supabase Pattern)
```javascript
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Fetch data
const { data, error } = await supabase
  .from('menu_items')
  .select('*');
```

### ✅ NEW (Wasp Pattern)
```javascript
import { useQuery } from 'wasp/client/operations';
import { useAction } from 'wasp/client/operations';
import { getMenuItems } from 'wasp/client/operations';

// Fetch data
const { data, isLoading, error } = useQuery(getMenuItems);
```

## Context Import Changes

### ❌ OLD
```javascript
import { usePOS } from '../../../context/POSContext';  // Wrong directory
import { useAuth } from '../contexts/AuthContext';     // Doesn't exist
```

### ✅ NEW
```javascript
import { usePOS } from '../../../contexts/POSContext';    // Correct
import { useOrders } from '../../../contexts/OrderContext'; // Correct
```

## Data Structure Changes

### ❌ OLD Structure
```javascript
const menuItem = {
  id: 1,
  name: 'Pizza',
  stockStatus: 'in-stock'  // Simple string
};

const inventory = {
  1: { quantity: 100 }  // Object map
};
```

### ✅ NEW Structure (Prisma Relations)
```javascript
const menuItem = {
  id: 1,
  name: 'Pizza',
  inventory: {              // Relation object
    quantity: 100,
    lowStockThreshold: 10
  }
};

// Access stock status
const stockStatus = menuItem.inventory?.quantity > 0 ? 'in-stock' : 'out-of-stock';
```

## CRUD Operations

### Creating Menu Items

```javascript
// In component
const { addMenuItem } = usePOS();

await addMenuItem({
  name: 'Pizza',
  description: 'Delicious pizza',
  price: 12.99,
  category: 'Food'
});
```

### Updating Inventory

```javascript
// In component
const { updateInventory } = usePOS();

await updateInventory(menuItemId, newQuantity);
```

### Creating Orders

```javascript
// In component
const { placeOrder } = useOrders();

await placeOrder({
  items: [
    { menuItemId: 1, quantity: 2, price: 12.99 }
  ],
  orderType: 'dine-in',
  subtotal: 25.98,
  tax: 2.60,
  tip: 5.00,
  total: 33.58
});
```

## Error Handling Pattern

### ✅ Proper Error Handling
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  
  try {
    await addMenuItem(data);
    // Success feedback
    alert('Menu item added successfully!');
  } catch (error) {
    console.error('Error:', error);
    // User-friendly error message
    alert('Failed to add menu item. Please try again.');
  } finally {
    setSubmitting(false);
  }
};
```

## Loading States Pattern

### ✅ Show Loading States
```javascript
const { data: menuItems = [], isLoading, error } = useQuery(getMenuItems);

if (isLoading) {
  return <div>Loading menu...</div>;
}

if (error) {
  return <div>Error loading menu: {error.message}</div>;
}

// Render with data
return (
  <div>
    {menuItems.map(item => (
      <div key={item.id}>{item.name}</div>
    ))}
  </div>
);
```

## Safe Array Operations

### ✅ Always Use Fallback
```javascript
// OLD: Can crash if menuItems is undefined
const filtered = menuItems.filter(item => ...);

// NEW: Safe with fallback
const { menuItems = [] } = usePOS();
const filtered = (menuItems || []).filter(item => ...);
```

## Component Hook Usage

### EnhancedPOS
```javascript
const { menuItems, isLoading, error } = usePOS();
```

### POSMenuBuilder
```javascript
const { menuItems = [], addMenuItem, isLoading } = usePOS();
```

### POSInventory
```javascript
const { menuItems = [], inventory = [], isLoading, updateInventory } = usePOS();
```

### OrderScreen
```javascript
const { orders = [], setActiveVenue, updateOrderStatus, isLoading } = useOrders();
```

## Database Queries (Backend)

### Query Pattern
```javascript
export const getMenuItems = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const venueId = context.user.venueId;

  return context.entities.MenuItem.findMany({
    where: { venueId },
    include: { inventory: true }  // Include relations
  });
};
```

### Action Pattern
```javascript
export const createMenuItem = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }
  
  const { name, description, price, category } = args;
  const venueId = context.user.venueId;

  return context.entities.MenuItem.create({
    data: {
      name,
      description,
      price,
      category,
      venue: { connect: { id: venueId } },
      inventory: {
        create: {
          quantity: 0,
          lowStockThreshold: 10,
          venue: { connect: { id: venueId } }
        }
      }
    }
  });
};
```

## Common Patterns Summary

1. **Always import from 'wasp/client/operations'**
2. **Use contexts from 'src/frontend/contexts/'** (plural)
3. **Add loading and error states to all components**
4. **Use async/await with try-catch for mutations**
5. **Include Prisma relations in queries** (include: { inventory: true })
6. **Scope all operations to venueId** (security)
7. **Use fallback arrays** (menuItems = [])
8. **Access related data through objects** (item.inventory.quantity)

## Testing Your Changes

```bash
# 1. Create database tables
wasp db migrate-dev

# 2. Start the application
wasp start

# 3. Test in browser
# - Login as a venue user
# - Navigate to /venue/pos/menu
# - Add a menu item
# - Check /venue/pos/inventory
# - Make an order in /venue/pos/system
```

---

**Need Help?** See POS_MIGRATION_GUIDE.md for detailed information.
