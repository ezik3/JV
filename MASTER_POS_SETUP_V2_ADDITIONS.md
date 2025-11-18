# JointVibe POS V2 - Extended Features Documentation

**Version:** 2.0
**Last Updated:** 2025-11-18
**Extends:** MASTER_POS_SETUP.md

This document contains detailed specifications for the extended POS pages (Pages 5-10).

---

## Table of Contents
1. [Orders Management](#page-5-orders-management)
2. [Inventory Management](#page-6-inventory-management)
3. [Menu Builder](#page-7-menu-builder)
4. [Staff Management](#page-8-staff-management)
5. [Analytics & Reports](#page-9-analytics--reports)
6. [Venue Settings](#page-10-venue-settings)
7. [Additional Database Tables](#additional-database-tables)
8. [Integration Points](#integration-points)

---

## PAGE 5: Orders Management (/venue/pos/orders)

**Purpose:** View, search, and manage all orders (active and historical)

**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│  Orders Management                          [Export CSV] │
├──────────────────────────────────────────────────────────┤
│  [Search] [Filter by Status] [Date Range] [Order Type]  │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │ #1234 | Table 5 | Dine In    | $45.67 | Completed │ │
│  │ 2:35 PM | John D. | Credit Card                    │ │
│  │ • Burger x2, Fries x2, Coke x2          [Details] │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │ #1235 | Takeout | $28.99 | Ready for Pickup       │ │
│  │ 2:40 PM | Sarah M. | Mobile Payment     [Details] │ │
│  │ • Pizza x1, Salad x1                               │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  [← Previous] Page 1 of 24 [Next →]                     │
└──────────────────────────────────────────────────────────┘
```

**Features:**

1. **Search & Filter:**
   - Search by order number, customer name, phone
   - Filter by status (All, Pending, Completed, Cancelled)
   - Filter by order type (Dine In, Takeout, Delivery)
   - Filter by payment status
   - Date range picker

2. **Order List:**
   - Sortable columns (time, total, status)
   - Expandable rows for order details
   - Quick actions (View, Edit, Refund, Print Receipt)
   - Color coding by status

3. **Order Details View:**
   - Full order information
   - Item breakdown with modifiers
   - Payment history
   - Customer information
   - Order timeline (created → confirmed → preparing → ready → served)
   - Employee who took the order
   - Special instructions/notes

4. **Actions:**
   - Modify order (if not completed)
   - Cancel order with reason
   - Process refund (manager only)
   - Re-print receipt
   - Send to kitchen (if modified)
   - Contact customer (SMS/email)

**Database Queries:**
```tsx
// Fetch orders with filters
const fetchOrders = async (filters) => {
  let query = supabase
    .from('pos_orders')
    .select(`
      *,
      pos_order_items(*),
      pos_employees(first_name, last_name),
      pos_tables(table_number)
    `)
    .eq('venue_id', venueId)
    .order('created_at', { ascending: false });

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.orderType) {
    query = query.eq('order_type', filters.orderType);
  }

  if (filters.dateFrom) {
    query = query.gte('created_at', filters.dateFrom);
  }

  if (filters.dateTo) {
    query = query.lte('created_at', filters.dateTo);
  }

  const { data, error } = await query;
  return data;
};
```

**Export Functionality:**
- Export to CSV (orders, items, payments)
- Date range selection
- Custom field selection
- Email export to owner

---

## PAGE 6: Inventory Management (/venue/pos/inventory)

**Purpose:** Track inventory levels, manage stock, and receive alerts

**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│  Inventory Management              [Add Item] [Restock]  │
├──────────────────────────────────────────────────────────┤
│  [Search] [Filter by Category] [Low Stock Only]          │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Chicken Breast | Meat | 15 lbs | Min: 20 lbs    🔴│ │
│  │ Unit Cost: $8.50/lb | Supplier: ABC Foods          │ │
│  │ Last Restock: 2025-11-15 | Expires: 2025-11-25    │ │
│  │ [Edit] [Restock] [View History]                   │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Tomatoes | Produce | 8 lbs | Min: 5 lbs        🟢 │ │
│  │ Unit Cost: $2.25/lb | Supplier: Fresh Farms        │ │
│  │ Last Restock: 2025-11-17 | Expires: 2025-11-22    │ │
│  │ [Edit] [Restock] [View History]                   │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  Low Stock Alerts: 12 items below minimum              │
└──────────────────────────────────────────────────────────┘
```

**Features:**

1. **Inventory List:**
   - Current quantity vs minimum quantity
   - Visual indicators (🔴 Low, 🟡 Medium, 🟢 Good)
   - Unit cost and total value
   - Supplier information
   - Expiration tracking

2. **Restock Management:**
   - Quick restock form
   - Automatic quantity adjustment
   - Cost tracking per restock
   - Supplier selection
   - Batch entry (multiple items)

3. **Inventory Adjustments:**
   - Manual quantity adjustments
   - Reason codes (waste, theft, correction)
   - Manager approval for large adjustments
   - Audit trail

4. **Low Stock Alerts:**
   - Automatic alerts when below minimum
   - Email/SMS notifications
   - Suggested reorder quantities
   - Priority ranking

5. **Inventory Reports:**
   - Usage trends (daily, weekly, monthly)
   - Cost analysis
   - Waste tracking
   - Variance reports
   - Supplier performance

**Database Schema:**
```sql
-- Inventory transactions for tracking
CREATE TABLE pos_inventory_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES pos_venues(id) ON DELETE CASCADE,
  inventory_item_id UUID NOT NULL REFERENCES pos_inventory(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('restock', 'adjustment', 'waste', 'sale')),
  quantity_change DECIMAL(10,2) NOT NULL,
  quantity_before DECIMAL(10,2) NOT NULL,
  quantity_after DECIMAL(10,2) NOT NULL,
  unit_cost DECIMAL(10,2),
  total_cost DECIMAL(10,2),
  reason TEXT,
  reference_id UUID, -- order_id if sale, or adjustment ID
  employee_id UUID REFERENCES pos_employees(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link menu items to inventory
CREATE TABLE pos_menu_item_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID NOT NULL REFERENCES pos_menu_items(id) ON DELETE CASCADE,
  inventory_item_id UUID NOT NULL REFERENCES pos_inventory(id) ON DELETE CASCADE,
  quantity_used DECIMAL(10,2) NOT NULL, -- How much inventory is used per menu item
  unit TEXT DEFAULT 'unit',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Auto-deduction on Sales:**
```tsx
// When order is completed, deduct inventory
const deductInventory = async (orderId: string) => {
  const { data: orderItems } = await supabase
    .from('pos_order_items')
    .select('menu_item_id, quantity')
    .eq('order_id', orderId);

  for (const item of orderItems) {
    // Get inventory mapping
    const { data: inventoryMappings } = await supabase
      .from('pos_menu_item_inventory')
      .select('inventory_item_id, quantity_used')
      .eq('menu_item_id', item.menu_item_id);

    for (const mapping of inventoryMappings) {
      const totalUsed = mapping.quantity_used * item.quantity;

      // Update inventory
      await supabase.rpc('deduct_inventory', {
        p_inventory_id: mapping.inventory_item_id,
        p_quantity: totalUsed,
        p_order_id: orderId
      });
    }
  }
};
```

---

## PAGE 7: Menu Builder (/venue/pos/menu)

**Purpose:** Create and manage menu items, categories, and pricing

**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│  Menu Management                    [Add Category] [Add Item] │
├──────────────────────────────────────────────────────────┤
│  Categories                                               │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                   │
│  │🍔  │ │🍕  │ │🥗  │ │🍰  │ │🍺  │                   │
│  │Food│ │Pizza│ │Salad│ │Dessert│ │Drinks│             │
│  └────┘ └────┘ └────┘ └────┘ └────┘                   │
├──────────────────────────────────────────────────────────┤
│  Food Items (24)                          [Bulk Edit]    │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 🍔 Classic Burger          $12.99    [Available] ✓│ │
│  │ Description: Beef patty with lettuce, tomato...    │ │
│  │ Prep Time: 12 min | Cost: $4.50 | Profit: $8.49  │ │
│  │ Modifiers: Cheese (+$1), Bacon (+$2)              │ │
│  │ [Edit] [Duplicate] [Delete] [View Analytics]      │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 🍟 French Fries            $4.99     [Available] ✓│ │
│  │ Description: Crispy golden fries                   │ │
│  │ Prep Time: 5 min | Cost: $0.80 | Profit: $4.19   │ │
│  │ Modifiers: Size (Small/Large), Seasoning          │ │
│  │ [Edit] [Duplicate] [Delete] [View Analytics]      │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Features:**

1. **Category Management:**
   - Create/edit/delete categories
   - Set category icons and colors
   - Drag-and-drop reordering
   - Show/hide categories
   - Schedule availability (e.g., breakfast menu 6am-11am)

2. **Menu Item Creation:**
   - Name, description, price
   - Upload item image
   - Set preparation time
   - Cost tracking (for profit calculation)
   - SKU/barcode
   - Availability toggle
   - Allergen information
   - Nutritional info (optional)

3. **Modifiers/Add-ons:**
   - Create modifier groups (e.g., "Size", "Toppings")
   - Set modifier prices
   - Required vs optional modifiers
   - Multiple selections allowed
   - Modifier inventory tracking

4. **Pricing Tools:**
   - Bulk price adjustments
   - Happy hour pricing
   - Seasonal pricing
   - Cost + markup calculator
   - Price history tracking

5. **Item Analytics:**
   - Sales performance
   - Profit margins
   - Popularity ranking
   - Time-of-day trends
   - Pairing suggestions (often ordered with...)

**Database Schema:**
```sql
-- Menu item modifiers
CREATE TABLE pos_menu_modifiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES pos_venues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  modifier_type TEXT NOT NULL CHECK (modifier_type IN ('radio', 'checkbox', 'quantity')),
  is_required BOOLEAN DEFAULT false,
  max_selections INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Modifier options
CREATE TABLE pos_modifier_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  modifier_id UUID NOT NULL REFERENCES pos_menu_modifiers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_adjustment DECIMAL(10,2) DEFAULT 0.00,
  is_default BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link modifiers to menu items
CREATE TABLE pos_menu_item_modifiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID NOT NULL REFERENCES pos_menu_items(id) ON DELETE CASCADE,
  modifier_id UUID NOT NULL REFERENCES pos_menu_modifiers(id) ON DELETE CASCADE,
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Price history
CREATE TABLE pos_price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID NOT NULL REFERENCES pos_menu_items(id) ON DELETE CASCADE,
  old_price DECIMAL(10,2) NOT NULL,
  new_price DECIMAL(10,2) NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  reason TEXT,
  effective_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Modifier Example:**
```tsx
// Modifier structure
{
  "modifiers": [
    {
      "id": "mod-1",
      "name": "Size",
      "type": "radio",
      "required": true,
      "options": [
        { "name": "Small", "price": 0 },
        { "name": "Medium", "price": 2 },
        { "name": "Large", "price": 4 }
      ]
    },
    {
      "id": "mod-2",
      "name": "Toppings",
      "type": "checkbox",
      "required": false,
      "max_selections": 3,
      "options": [
        { "name": "Lettuce", "price": 0 },
        { "name": "Tomato", "price": 0 },
        { "name": "Cheese", "price": 1 },
        { "name": "Bacon", "price": 2 }
      ]
    }
  ]
}
```

---

## PAGE 8: Staff Management (/venue/pos/staff)

**Purpose:** Manage employees, roles, schedules, and performance

**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│  Staff Management              [Add Employee] [Schedule] │
├──────────────────────────────────────────────────────────┤
│  [All Staff] [Active] [On Shift Now] [Roles]            │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 👤 John Smith | Waiter | PIN: ****      🟢 Active │ │
│  │ Email: john@example.com | Phone: (555) 123-4567   │ │
│  │ Hired: 2025-01-15 | Rate: $15.00/hr               │ │
│  │                                                     │ │
│  │ Current Shift: 2:00 PM - Now (4h 23m)              │ │
│  │ Today's Sales: $456.78 | Orders: 23                │ │
│  │                                                     │ │
│  │ [Edit] [View Shifts] [Performance] [Clock Out]    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 👤 Sarah Johnson | Bartender | PIN: ****  ⚫ Off  │ │
│  │ Email: sarah@example.com | Phone: (555) 987-6543  │ │
│  │ Hired: 2024-11-01 | Rate: $18.00/hr               │ │
│  │                                                     │ │
│  │ Last Shift: 2025-11-17 (6:00 PM - 12:00 AM)       │ │
│  │ This Week: $2,345.67 sales | 89 orders            │ │
│  │                                                     │ │
│  │ [Edit] [View Shifts] [Performance] [Schedule]     │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Features:**

1. **Employee Management:**
   - Add/edit employee profiles
   - Assign roles and permissions
   - Set PIN codes for clock-in
   - Contact information
   - Hire date and rate
   - Active/inactive status
   - Employee photos

2. **Role-Based Permissions:**
   - **Kitchen:** View kitchen display, update order status
   - **Waiter:** Take orders, modify orders, basic payments
   - **Bartender:** Bar orders, inventory for bar items
   - **Host:** Seating management, reservations, greet customers
   - **Manager:** Full access to all features

3. **Shift Management:**
   - Clock in/out tracking
   - Break time logging
   - Shift notes
   - Manager approval for shift edits
   - Automatic shift close at end of day
   - Shift handoff reports

4. **Performance Tracking:**
   - Sales per shift/week/month
   - Average ticket size
   - Orders completed
   - Customer ratings (if integrated)
   - Tips collected
   - Hourly productivity

5. **Scheduling:**
   - Weekly schedule builder
   - Drag-and-drop shift assignment
   - Conflict detection (overlapping shifts)
   - Availability management
   - Shift swap requests
   - Schedule templates

**Database Schema:**
```sql
-- Employee permissions
CREATE TABLE pos_employee_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES pos_employees(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  granted_by UUID REFERENCES pos_employees(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, permission)
);

-- Shift break tracking
CREATE TABLE pos_shift_breaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shift_id UUID NOT NULL REFERENCES pos_shifts(id) ON DELETE CASCADE,
  break_start TIMESTAMPTZ NOT NULL,
  break_end TIMESTAMPTZ,
  break_type TEXT DEFAULT 'regular' CHECK (break_type IN ('regular', 'meal', 'smoke')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schedule
CREATE TABLE pos_employee_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES pos_venues(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES pos_employees(id) ON DELETE CASCADE,
  schedule_date DATE NOT NULL,
  shift_start TIME NOT NULL,
  shift_end TIME NOT NULL,
  position TEXT,
  notes TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Performance Metrics:**
```tsx
const getEmployeePerformance = async (employeeId: string, dateRange: [Date, Date]) => {
  // Total sales
  const { data: orders } = await supabase
    .from('pos_orders')
    .select('total')
    .eq('employee_id', employeeId)
    .gte('created_at', dateRange[0])
    .lte('created_at', dateRange[1])
    .eq('payment_status', 'paid');

  const totalSales = orders?.reduce((sum, o) => sum + Number(o.total), 0) || 0;
  const orderCount = orders?.length || 0;
  const avgTicket = orderCount > 0 ? totalSales / orderCount : 0;

  // Total hours worked
  const { data: shifts } = await supabase
    .from('pos_shifts')
    .select('clock_in, clock_out, break_minutes')
    .eq('employee_id', employeeId)
    .gte('clock_in', dateRange[0])
    .lte('clock_in', dateRange[1])
    .eq('status', 'completed');

  const totalHours = shifts?.reduce((sum, s) => {
    const start = new Date(s.clock_in);
    const end = new Date(s.clock_out);
    const hours = (end - start) / (1000 * 60 * 60) - (s.break_minutes / 60);
    return sum + hours;
  }, 0) || 0;

  const salesPerHour = totalHours > 0 ? totalSales / totalHours : 0;

  return {
    totalSales,
    orderCount,
    avgTicket,
    totalHours,
    salesPerHour
  };
};
```

---

## PAGE 9: Analytics & Reports (/venue/pos/analytics)

**Purpose:** Business insights, sales reports, and performance metrics

**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│  Analytics Dashboard              [Date Range] [Export]  │
├──────────────────────────────────────────────────────────┤
│  Overview (Last 7 Days)                                  │
│                                                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│  │ Total    │  │ Orders   │  │ Avg      │  │ Top Item ││
│  │ Sales    │  │ 247      │  │ Ticket   │  │ Burger   ││
│  │ $8,432   │  │          │  │ $34.15   │  │ (48 sold)││
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘│
├──────────────────────────────────────────────────────────┤
│  Sales Trend                                             │
│  ┌────────────────────────────────────────────────────┐ │
│  │     [Line chart showing daily sales]               │ │
│  │  $2K ─                        ●                    │ │
│  │      │              ●       ●   ●                  │ │
│  │  $1K ─    ●      ●     ●                          │ │
│  │      │  ●   ●                                      │ │
│  │   $0 ─┴─────┴─────┴─────┴─────┴─────┴─────       │ │
│  │      Mon Tue Wed Thu Fri Sat Sun                  │ │
│  └────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────┤
│  Top Selling Items          │  Sales by Category        │
│  ┌─────────────────────────┐│  ┌─────────────────────┐ │
│  │ 1. Burger      $456.78  ││  │ Food      $5,234.56 │ │
│  │ 2. Pizza       $389.45  ││  │ Drinks    $2,198.89 │ │
│  │ 3. Fries       $234.12  ││  │ Desserts    $998.23 │ │
│  └─────────────────────────┘│  └─────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Report Types:**

1. **Sales Reports:**
   - Daily/weekly/monthly/yearly sales
   - Sales by hour (peak hours identification)
   - Sales by day of week
   - Sales by order type (dine-in, takeout, delivery)
   - Sales by payment method
   - Comparison to previous periods

2. **Item Reports:**
   - Top selling items
   - Least selling items
   - Item profitability
   - Item velocity (how fast items sell)
   - Category performance
   - Modifier popularity

3. **Employee Reports:**
   - Sales by employee
   - Orders by employee
   - Average ticket by employee
   - Hours worked vs sales generated
   - Clock-in/out logs
   - Late arrivals/early departures

4. **Financial Reports:**
   - Gross sales
   - Net sales (after refunds/discounts)
   - Tax collected
   - Tips collected
   - Payment method breakdown
   - Profit margins (if cost data available)

5. **Operational Reports:**
   - Average order fulfillment time
   - Kitchen performance (prep times)
   - Table turnover rate
   - Waste and comps
   - Inventory usage
   - Low stock alerts

6. **Customer Reports:**
   - New customers vs returning
   - Customer lifetime value
   - Order frequency
   - Average customer spend
   - Popular items by customer segment

**Visualizations:**
- Line charts (trends over time)
- Bar charts (comparisons)
- Pie charts (category breakdowns)
- Heat maps (hourly sales patterns)
- Tables (detailed data)

**Export Options:**
- PDF reports
- CSV data export
- Excel spreadsheets
- Scheduled email reports (daily/weekly/monthly)

**Database Aggregations:**
```tsx
// Sales by hour
const getSalesByHour = async (venueId: string, date: Date) => {
  const { data } = await supabase
    .from('pos_orders')
    .select('created_at, total')
    .eq('venue_id', venueId)
    .gte('created_at', startOfDay(date))
    .lte('created_at', endOfDay(date))
    .eq('payment_status', 'paid');

  const hourlyData = Array(24).fill(0).map((_, hour) => ({
    hour,
    sales: 0,
    orders: 0
  }));

  data?.forEach(order => {
    const hour = new Date(order.created_at).getHours();
    hourlyData[hour].sales += Number(order.total);
    hourlyData[hour].orders += 1;
  });

  return hourlyData;
};

// Top items
const getTopItems = async (venueId: string, limit = 10) => {
  const { data } = await supabase
    .from('pos_order_items')
    .select(`
      item_name,
      quantity,
      total_price,
      pos_orders!inner(venue_id, payment_status)
    `)
    .eq('pos_orders.venue_id', venueId)
    .eq('pos_orders.payment_status', 'paid');

  const itemMap = {};
  data?.forEach(item => {
    if (!itemMap[item.item_name]) {
      itemMap[item.item_name] = {
        name: item.item_name,
        quantity: 0,
        revenue: 0
      };
    }
    itemMap[item.item_name].quantity += item.quantity;
    itemMap[item.item_name].revenue += Number(item.total_price);
  });

  return Object.values(itemMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
};
```

---

## PAGE 10: Venue Settings (/venue/pos/settings)

**Purpose:** Configure venue-wide POS settings and preferences

**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│  Venue Settings                              [Save]      │
├──────────────────────────────────────────────────────────┤
│  [General] [Payment] [Receipts] [Hardware] [Advanced]   │
├──────────────────────────────────────────────────────────┤
│  General Settings                                        │
│                                                           │
│  Venue Name:    [JointVibe Downtown           ]          │
│  Address:       [123 Main St                  ]          │
│  City:          [Austin                       ]          │
│  State:         [TX ▼]   ZIP: [78701         ]          │
│  Phone:         [(555) 123-4567               ]          │
│  Email:         [venue@example.com            ]          │
│                                                           │
│  Business Hours:                                         │
│  Monday    [9:00 AM ▼] - [11:00 PM ▼]  [✓ Open]        │
│  Tuesday   [9:00 AM ▼] - [11:00 PM ▼]  [✓ Open]        │
│  ...                                                      │
│                                                           │
│  Tax & Currency:                                         │
│  Currency:      [USD ▼]                                  │
│  Tax Rate:      [8.25] %                                 │
│  Timezone:      [America/Chicago ▼]                      │
│                                                           │
│  [Save Changes]                                          │
└──────────────────────────────────────────────────────────┘
```

**Settings Categories:**

### 1. General Settings
- Venue name, address, contact info
- Business hours (by day of week)
- Tax rate and currency
- Timezone
- Logo upload
- Venue description

### 2. Payment Settings
- Accepted payment methods
- Credit card processing (Stripe, Square, etc.)
- Cash handling rules
- Tip settings (suggested tip %, custom tips)
- Auto-gratuity rules (e.g., parties of 6+)
- Payment terminal configuration

### 3. Receipt Settings
- Receipt header/footer text
- Include logo on receipt
- Print automatically or on demand
- Receipt email settings
- SMS receipt notifications
- QR code for online review

### 4. Kitchen Settings
- Kitchen display auto-advance
- Order alert sounds and volume
- Default view mode (Card/List/Kanban)
- Preparation time targets
- Rush order indicators
- Print to kitchen printer

### 5. Order Settings
- Order number format (e.g., "ORD-####")
- Default order type
- Require customer name/phone
- Table management enabled
- Maximum order items
- Order timeout (auto-cancel if not paid)

### 6. Employee Settings
- PIN length (4-6 digits)
- Require manager override for refunds
- Discount authorization levels
- Clock-in grace period (late threshold)
- Break time tracking required
- Tip pooling rules

### 7. Inventory Settings
- Low stock alert threshold
- Auto-deduct inventory on sales
- Expiration date warnings
- Require cost tracking
- Barcode scanning enabled

### 8. Hardware Settings
- Receipt printer (IP/USB)
- Kitchen printer (IP/USB)
- Cash drawer configuration
- Barcode scanner
- Customer display
- Scale integration

### 9. Advanced Settings
- Data retention period
- Backup schedule
- API access (webhooks)
- Custom fields for orders
- Integrations (accounting, delivery apps)
- Developer mode

**Database Schema:**
```sql
-- Extended venue settings
ALTER TABLE pos_venues
ADD COLUMN settings JSONB DEFAULT '{
  "payment": {
    "acceptedMethods": ["cash", "credit_card", "debit_card", "mobile"],
    "tipSuggestions": [15, 18, 20, 25],
    "autoGratuity": {
      "enabled": true,
      "partySize": 6,
      "percentage": 18
    }
  },
  "receipt": {
    "autoprint": false,
    "includeLogo": true,
    "headerText": "Thank you for dining with us!",
    "footerText": "Please visit us again soon."
  },
  "kitchen": {
    "autoAdvance": true,
    "defaultView": "card",
    "alertSound": true,
    "alertVolume": 80
  },
  "orders": {
    "numberFormat": "ORD-####",
    "defaultType": "dine_in",
    "requireCustomerInfo": false,
    "orderTimeout": 30
  },
  "employee": {
    "pinLength": 4,
    "managerOverride": true,
    "clockInGracePeriod": 5
  },
  "inventory": {
    "autoDeduct": true,
    "lowStockThreshold": 20,
    "expirationWarningDays": 3
  },
  "hardware": {
    "receiptPrinter": null,
    "kitchenPrinter": null,
    "cashDrawer": null
  }
}';
```

---

## Additional Database Tables

### Customer Management
```sql
CREATE TABLE pos_customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES pos_venues(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  birthday DATE,
  loyalty_points INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0.00,
  visit_count INTEGER DEFAULT 0,
  last_visit TIMESTAMPTZ,
  notes TEXT,
  marketing_opt_in BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Reservations
```sql
CREATE TABLE pos_reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES pos_venues(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES pos_customers(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  party_size INTEGER NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  table_id UUID REFERENCES pos_tables(id),
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'seated', 'completed', 'cancelled', 'no_show')),
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Discounts & Promotions
```sql
CREATE TABLE pos_discounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES pos_venues(id) ON DELETE CASCADE,
  code TEXT,
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'bogo', 'free_item')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_purchase DECIMAL(10,2) DEFAULT 0.00,
  max_discount DECIMAL(10,2),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  requires_manager_approval BOOLEAN DEFAULT false,
  applicable_items JSONB, -- specific menu items or categories
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Audit Logs
```sql
CREATE TABLE pos_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES pos_venues(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES pos_employees(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Integration Points

### 1. Supabase Realtime Channels
```tsx
// Subscribe to multiple tables
const setupRealtimeSubscriptions = () => {
  const channel = supabase.channel('pos-updates')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'pos_orders' },
      handleOrderChange
    )
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'pos_order_items' },
      handleOrderItemChange
    )
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'pos_inventory' },
      handleInventoryChange
    )
    .subscribe();

  return channel;
};
```

### 2. Payment Processing
```tsx
// Stripe integration example
const processPayment = async (orderTotal: number, paymentMethod: string) => {
  if (paymentMethod === 'credit_card') {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(orderTotal * 100), // cents
      currency: 'usd',
      metadata: {
        venue_id: venueId,
        order_id: orderId
      }
    });

    return paymentIntent;
  }

  // Cash payment - just record it
  return { method: 'cash', status: 'completed' };
};
```

### 3. Email/SMS Notifications
```tsx
// Order confirmation SMS
const sendOrderConfirmation = async (order: Order) => {
  if (order.customer_phone) {
    await twilioClient.messages.create({
      body: `Your order #${order.order_number} is confirmed! Estimated ready time: ${order.estimated_ready_time}`,
      to: order.customer_phone,
      from: twilioPhoneNumber
    });
  }
};
```

### 4. Accounting Integration
```tsx
// Export to QuickBooks/Xero
const exportSalesToAccounting = async (dateRange: [Date, Date]) => {
  const orders = await fetchOrdersForExport(dateRange);

  const invoices = orders.map(order => ({
    date: order.created_at,
    customer: order.customer_name || 'Walk-in',
    items: order.pos_order_items.map(item => ({
      description: item.item_name,
      quantity: item.quantity,
      amount: item.total_price
    })),
    total: order.total,
    tax: order.tax,
    paymentMethod: order.payment_method
  }));

  // Send to accounting API
  await accountingAPI.createInvoices(invoices);
};
```

---

## Completion Checklist

### Phase 2: Core Infrastructure (30-60%)
- [ ] Set up Supabase project
- [ ] Run database migrations (all tables + RLS)
- [ ] Create AuthContext.tsx
- [ ] Create POSContext.tsx
- [ ] Create EmployeeContext.tsx
- [ ] Install shadcn/ui
- [ ] Build Manager Setup page
- [ ] Build Dashboard page
- [ ] Build New Order page
- [ ] Build Kitchen Display page

### Phase 3: Extended Features (60-80%)
- [ ] Build Orders management page
- [ ] Build Inventory management page
- [ ] Build Menu builder page
- [ ] Build Staff management page
- [ ] Build Analytics page
- [ ] Build Settings page

### Phase 4: Testing & Polish (80-100%)
- [ ] Integration testing
- [ ] Real-time functionality
- [ ] Employee workflows
- [ ] Payment processing
- [ ] Mobile responsiveness
- [ ] Performance optimization

---

**Document Version:** 2.0
**Completion:** 30%
**Last Updated:** 2025-11-18
**Next Priority:** Supabase setup and context creation
