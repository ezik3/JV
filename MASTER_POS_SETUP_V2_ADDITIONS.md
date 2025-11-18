# MASTER POS SETUP V2 - NEW ARCHITECTURE ADDITIONS
## Critical New Features & Architecture (Add these to main document)

**IMPORTANT:** This document contains NEW architecture requirements that MUST be integrated into the main MASTER_POS_SETUP.md. These are not optional - they define the core user experience.

---

## 🎯 CRITICAL CHANGES FROM V1

### What's Different in V2?

1. **NO ODOO INTEGRATION** - Removed completely, using Supabase only
2. **Employee Management System** - Role-based access with shift mode
3. **Enduser Venue Check-In** - Special in-venue experience (vibe-sphere style)
4. **Remote Ordering** - Pickup, delivery, dine-in from anywhere
5. **Employee Phone POS** - Staff take orders on their phones
6. **Venue Home Redesign** - Manager overview dashboard
7. **Push Notification Ads** - Venue promotion system

---

## 📱 USER ROLES & ACCESS CONTROL

### Overview

The system supports **THREE distinct user types** with different experiences:

```
┌─────────────────────────────────────────────────────────────┐
│                       USER TYPES                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. VENUE OWNER/MANAGER                                     │
│     ├─ Full access to all venue features                    │
│     ├─ Can invite and manage employees                      │
│     ├─ Can delegate specific access permissions             │
│     └─ Access to analytics, settings, staff management      │
│                                                              │
│  2. EMPLOYEE (Venue Staff)                                  │
│     ├─ Starts as "enduser" account                          │
│     ├─ When invited by manager → gains employee status      │
│     ├─ Can "clock in" to start shift                        │
│     ├─ In shift → sees employee-only screens                │
│     ├─ Access limited based on manager-assigned role:       │
│     │  • Kitchen Staff: Kitchen displays, order management  │
│     │  • Waiter/Server: POS, orders, table management       │
│     │  • Bartender: POS, bar orders                         │
│     │  • Host: Table management, reservations               │
│     └─ Payments go to venue, not personal account           │
│                                                              │
│  3. ENDUSER (Customer)                                      │
│     ├─ Regular JV app user                                  │
│     ├─ Can browse venues, make reservations                 │
│     ├─ When checked into venue → gets special experience    │
│     ├─ In-venue features:                                   │
│     │  • AI menu chat                                       │
│     │  • Mobile ordering from table                         │
│     │  • See venue floorplan & available seating            │
│     │  • Message other guests (opt-in)                      │
│     │  • Call waiter/bartender                              │
│     │  • Request bill splitting                             │
│     └─ Can order remotely (pickup/delivery)                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 👥 EMPLOYEE MANAGEMENT & SHIFT MODE

### Initial Setup Flow

#### 1. Manager First-Time Setup

When a venue owner clicks POS in navbar:

```
User clicks "POS" in navbar
    ↓
Redirected to /venue/pos/auth/manager
    ↓
ONE-TIME SETUP SCREEN (only shown once):
  ├─ Verify account ownership
  ├─ Set up POS master account
  ├─ Create initial admin credentials
  └─ Agree to payment processing terms
    ↓
Setup complete → Full POS access granted
    ↓
Manager sees /venue/pos/dashboard
```

**Key Rules:**
- Setup screen ONLY shown once per venue
- After setup, manager has full access to all POS features
- Manager can invite employees from Staff Management page

---

#### 2. Employee Invitation Flow

**From Manager's Perspective (Staff Management Page):**

```
Manager navigates to /venue/pos/staff
    ↓
Clicks "Invite Employee"
    ↓
Invitation Form:
  ├─ Enter employee email
  ├─ SELECT ROLE:
  │  ├─ Kitchen Staff
  │  ├─ Waiter/Server
  │  ├─ Bartender
  │  ├─ Host
  │  ├─ Manager (sub-manager)
  │  └─ Custom (select specific permissions)
  ├─ Assign specific screen access:
  │  [ ] Dashboard (view only)
  │  [ ] New Orders (take orders)
  │  [ ] Kitchen Display
  │  [ ] Menu Management
  │  [ ] Inventory
  │  [ ] Table Management
  │  [ ] Analytics (view only)
  │  [ ] Staff Management
  │  [ ] Settings
  └─ Send Invite
    ↓
Email sent to employee with invitation link
    ↓
Employee acceptance tracked in database
```

**Database Schema for Employee Invitations:**

```sql
CREATE TABLE employee_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id),
  employee_email TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  role TEXT NOT NULL, -- 'kitchen', 'waiter', 'bartender', 'host', 'manager'
  permissions JSONB DEFAULT '{}'::jsonb, -- e.g., {"pos": true, "kitchen": true, "inventory": false}
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'declined', 'expired'
  invitation_token UUID DEFAULT gen_random_uuid(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '7 days'),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE employee_venue_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  venue_id UUID NOT NULL REFERENCES venues(id),
  role TEXT NOT NULL,
  permissions JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  hired_date TIMESTAMPTZ DEFAULT now(),
  terminated_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, venue_id)
);

CREATE TABLE employee_shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES auth.users(id),
  venue_id UUID NOT NULL REFERENCES venues(id),
  clock_in_time TIMESTAMPTZ DEFAULT now(),
  clock_out_time TIMESTAMPTZ,
  total_sales NUMERIC(10,2) DEFAULT 0,
  orders_served INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- 'active', 'break', 'ended'
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

**From Employee's Perspective:**

```
Employee receives email invitation
    ↓
Clicks invitation link
    ↓
IF no JV account:
  ├─ Prompted to create enduser account
  └─ After signup, redirect back to invitation
IF has JV account:
  └─ Prompted to login
    ↓
Acceptance Screen:
  ├─ Shows venue name
  ├─ Shows role being offered
  ├─ Shows permissions granted
  ├─ "Accept" or "Decline" buttons
    ↓
IF Accept:
  ├─ Record created in employee_venue_links table
  ├─ User now has dual identity: enduser + employee
  └─ Redirected to /venue/[venue-id]/employee/welcome
    ↓
Welcome Screen:
  ├─ "Your employee access has been granted"
  ├─ "Start Shift" button (disabled until clocked in)
  └─ Link to view assigned permissions
```

---

### 3. Shift Mode (Employee Experience)

When employee is rostered and ready to work:

```
Employee opens JV app
    ↓
IF employee has active venue link:
  ├─ App detects employee status
  └─ Shows "Start Shift?" popup modal
    ↓
Modal Content:
  ┌─────────────────────────────────────┐
  │  🏢 Ready to Start Your Shift?     │
  │                                     │
  │  Venue: [Nocturne Lounge]          │
  │  Role: Waiter                       │
  │                                     │
  │  [Start Shift] [Not Now]           │
  └─────────────────────────────────────┘
    ↓
IF "Start Shift" clicked:
  ├─ Record created in employee_shifts table
  ├─ clock_in_time = now()
  ├─ App UI transforms to Employee Mode
  └─ Navigation changes to employee-specific screens
    ↓
EMPLOYEE MODE UI:
  ├─ Top bar shows: "🟢 ON SHIFT | [Venue Name] | Clock Out"
  ├─ Navigation shows only assigned screens:
  │  (Example for Waiter role:)
  │  ├─ 📱 Take Order (New Order screen)
  │  ├─ 📋 My Orders (orders they created)
  │  ├─ 🪑 Tables (table management)
  │  ├─ 💰 Today's Sales (their stats)
  │  └─ ⚙️ Settings (limited)
  └─ All orders/payments linked to venue, not employee
```

**Key Features of Employee Mode:**

1. **Payment Routing:**
   - All payments go to venue's account
   - Employee CANNOT transfer to personal account
   - Tracked in database: `payments.employee_id` shows who processed it

2. **Order Tracking:**
   - Orders show which employee created them: `orders.staff_id`
   - Employee can see "My Orders" vs "All Orders" (if permission granted)

3. **Mobile POS:**
   - Employee can take orders on phone
   - Walking around venue, tableside ordering
   - Modify orders, add items, split bills
   - Process payments on the spot

4. **Shift End:**
   ```
   Employee clicks "Clock Out"
       ↓
   Confirmation Modal:
     ├─ Shows shift summary:
     │  • Hours worked: 6h 32m
     │  • Orders served: 24
     │  • Total sales: $1,245.50
     └─ "Confirm Clock Out" button
       ↓
   Updates employee_shifts:
     ├─ clock_out_time = now()
     └─ status = 'ended'
       ↓
   App returns to Enduser Mode
   ```

---

## 🎪 ENDUSER VENUE CHECK-IN EXPERIENCE

### Concept

When an enduser physically visits a venue and "checks in" (geolocation-verified), they unlock a **premium in-venue experience** similar to the vibe-sphere design.

### Check-In Flow

```
Enduser approaches venue
    ↓
App detects proximity (geolocation)
    ↓
Popup appears:
  ┌─────────────────────────────────────┐
  │  📍 You're near Nocturne Lounge!   │
  │                                     │
  │  Check in to unlock:                │
  │  • Digital menu with AI assistant   │
  │  • Table view & seating selection   │
  │  • Connect with other guests        │
  │  • Order from your phone            │
  │                                     │
  │  [Check In] [Maybe Later]           │
  └─────────────────────────────────────┘
    ↓
IF "Check In" clicked:
  ├─ Verify geolocation (must be within 100m of venue)
  ├─ Record check-in in database
  ├─ UI transforms to In-Venue Experience
  └─ Navigation changes completely
```

### In-Venue Experience UI (vibe-sphere inspired)

**Reference Design:** https://github.com/ezik3/vibe-sphere

**Screen Layout:**

```
┌──────────────────────────────────────────────────────────┐
│  🎵 Nocturne Lounge           🔔  💬  👤               │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  [🏠 Venue]  [🍔 Menu]  [💬 Social]  [📍 Seating]      │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  VENUE FEED:                                             │
│  ┌────────────────────────────────────────────────┐    │
│  │  🎉 Happy Hour until 8 PM!                     │    │
│  │  🎶 DJ Set starts at 10 PM                     │    │
│  │  📸 [Live venue photos from guests]            │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  QUICK ACTIONS:                                          │
│  [🤖 Ask AI about menu]  [🍕 Order Now]                │
│  [👋 Call Waiter]        [💳 Request Bill]             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Key Features:**

1. **AI Menu Assistant:**
   ```
   User clicks "Ask AI about menu"
       ↓
   Chat Interface Opens:
     User: "What's your best cocktail for someone who likes sweet drinks?"
     AI: "I'd recommend our Signature Berry Mojito! It's our #1 seller..."
     AI: [Shows drink card with photo, price, ingredients]
     AI: "Would you like to order one?"
     User: "Yes, add 2 to my order"
     AI: "✅ Added 2x Berry Mojito to your order ($24.00)"
   ```

2. **Mobile Ordering from Table:**
   ```
   User browses menu
       ↓
   Adds items to cart
       ↓
   Cart shows:
     ├─ Items
     ├─ Subtotal
     ├─ Table number (auto-detected or entered)
     └─ "Place Order" button
       ↓
   Order sent to kitchen/bar
       ↓
   Waiter delivers to table
       ↓
   User gets notification: "Your order is on the way! 🎉"
   ```

3. **Seating Layout Visualization:**
   ```
   User clicks "📍 Seating" tab
       ↓
   Shows venue floorplan (created by manager in Table Management):
     ├─ Visual map of tables
     ├─ Green = available
     ├─ Red = occupied
     ├─ Yellow = reserved
     ├─ User can request specific table
     └─ Host/Manager approves request
   ```

4. **Social Features (Opt-In):**
   ```
   User enables "Visible to other guests"
       ↓
   Other checked-in users can see:
     ├─ First name + profile photo
     ├─ "Send drink" option
     ├─ Chat request button
     └─ Icebreaker prompts
       ↓
   Privacy controls:
     ├─ Can disable anytime
     ├─ Block users
     └─ Report inappropriate behavior
   ```

5. **Communication Features:**
   - **Call Waiter:** Sends notification to staff's phone
   - **Request Bill:** Waiter brings bill to table
   - **Split Bill:** Divide by person or by item
   - **Order Status:** Live updates ("Preparing", "On the way")

### Database Schema for Check-Ins

```sql
CREATE TABLE venue_check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  venue_id UUID NOT NULL REFERENCES venues(id),
  check_in_time TIMESTAMPTZ DEFAULT now(),
  check_out_time TIMESTAMPTZ,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  table_number TEXT,
  is_visible_to_guests BOOLEAN DEFAULT false, -- social feature opt-in
  status TEXT DEFAULT 'active', -- 'active', 'checked_out'
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE guest_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  receiver_id UUID NOT NULL REFERENCES auth.users(id),
  venue_id UUID NOT NULL REFERENCES venues(id),
  message_text TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE waiter_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  venue_id UUID NOT NULL REFERENCES venues(id),
  table_number TEXT,
  request_type TEXT NOT NULL, -- 'call_waiter', 'request_bill', 'assistance'
  notes TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'acknowledged', 'completed'
  assigned_to UUID REFERENCES auth.users(id), -- employee who responds
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);
```

---

## 🚗 REMOTE ORDERING SYSTEM (Pickup, Delivery, Dine-In)

### Overview

Endusers can order from venues **WITHOUT being physically present**. This supports:
- **Pickup:** Order ahead, pick up when ready
- **Delivery:** Order to home/office address
- **Dine-In Reservation:** Reserve table + pre-order menu items

### Order Type Selection

**Existing Reference:** `/src/frontend/JointVibePOS/MenuSection.jsx` and `/POSMain.jsx`

**Enhanced Flow:**

```
User opens venue page (not checked in)
    ↓
Sees order type selector:
  ┌─────────────────────────────────────┐
  │  How would you like to order?       │
  │                                     │
  │  [🚶 Pickup]                        │
  │  Order ahead, pick up when ready    │
  │                                     │
  │  [🚗 Delivery]                      │
  │  Delivered to your location         │
  │                                     │
  │  [🪑 Dine-In]                       │
  │  Reserve a table + pre-order        │
  └─────────────────────────────────────┘
    ↓
User selects order type
    ↓
Proceeds to menu...
```

### Pickup Flow

```
User selects "Pickup"
    ↓
Browses menu, adds items to cart
    ↓
Checkout screen shows:
  ├─ Order summary
  ├─ Pickup location: [Venue Address]
  ├─ Estimated ready time: [Auto-calculated based on kitchen load]
  ├─ "When will you arrive?" picker:
  │  • ASAP (15-20 mins)
  │  • 30 minutes
  │  • 1 hour
  │  • Custom time picker
  ├─ Special instructions textarea
  └─ Payment methods
    ↓
User pays (payment processed immediately)
    ↓
Order sent to kitchen with "PICKUP" tag
    ↓
Kitchen prepares order
    ↓
User gets notifications:
  • "Order confirmed! Preparing now..."
  • "Your order is ready for pickup! 🎉"
    ↓
User arrives at venue
    ↓
Shows order confirmation code to staff
    ↓
Staff marks order as "Picked Up"
```

**Example Use Case:**
*"I'm running late for work. I order my coffee at 7:45 AM, tell the venue I'll arrive at 8:05 AM. Payment is done. I arrive, my coffee is ready and waiting."*

### Delivery Flow

```
User selects "Delivery"
    ↓
Enter delivery address:
  ├─ Street address
  ├─ Apartment/Unit (optional)
  ├─ Delivery instructions
  └─ Phone number for driver
    ↓
App calculates:
  ├─ Distance from venue
  ├─ Delivery fee (based on distance)
  ├─ Estimated delivery time
  └─ Shows on checkout screen
    ↓
Browses menu, adds to cart
    ↓
Checkout shows:
  ├─ Order summary
  ├─ Subtotal: $32.50
  ├─ Delivery fee: $5.00
  ├─ Tax: $3.75
  ├─ Total: $41.25
  ├─ Estimated delivery: 35-45 minutes
  └─ Payment
    ↓
Payment processed
    ↓
Order sent to kitchen with "DELIVERY" tag
    ↓
Kitchen prepares
    ↓
When ready → Assign to delivery driver (future integration with Uber Eats API, DoorDash, or custom driver)
    ↓
User gets real-time tracking:
  • "Order is being prepared..."
  • "Out for delivery! 🚗"
  • "Driver is 5 minutes away!"
  • "Delivered! Enjoy your meal! 🎉"
```

### Dine-In Reservation with Pre-Order

```
User selects "Dine-In"
    ↓
Reservation Form:
  ├─ Date & Time picker
  ├─ Number of guests
  ├─ Special occasion? (Birthday, Anniversary, etc.)
  ├─ Seating preference (Indoor, Outdoor, VIP, etc.)
  └─ "Would you like to pre-order?" toggle
    ↓
IF pre-order enabled:
  ├─ Browse menu
  ├─ Add items to cart
  ├─ Payment options:
  │  • Pay now (discount may apply)
  │  • Pay at venue
  └─ Checkout
    ↓
Reservation confirmed
    ↓
Venue receives:
  ├─ Reservation details
  ├─ Pre-order items (if any)
  └─ Kitchen can start prep before guest arrives
    ↓
Guest arrives at venue
    ↓
Host sees reservation + pre-order
    ↓
Table ready, food starts cooking
    ↓
Faster service, better experience!
```

### Database Schema for Remote Orders

```sql
-- Add columns to existing orders table:
ALTER TABLE orders ADD COLUMN order_type TEXT DEFAULT 'dine_in';
-- 'dine_in', 'pickup', 'delivery'

ALTER TABLE orders ADD COLUMN pickup_time TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN delivery_address JSONB;
-- Example: {"street": "123 Main St", "unit": "Apt 4B", "city": "...", "zip": "..."}

ALTER TABLE orders ADD COLUMN delivery_instructions TEXT;
ALTER TABLE orders ADD COLUMN delivery_fee NUMERIC(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN estimated_ready_time TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN estimated_delivery_time TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN confirmation_code TEXT; -- e.g., "P1K4U2" for pickup verification

CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  venue_id UUID NOT NULL REFERENCES venues(id),
  reservation_time TIMESTAMPTZ NOT NULL,
  party_size INTEGER NOT NULL,
  table_id UUID REFERENCES venue_tables(id),
  special_occasion TEXT,
  seating_preference TEXT,
  pre_order_id UUID REFERENCES orders(id), -- if they pre-ordered
  status TEXT DEFAULT 'confirmed', -- 'confirmed', 'seated', 'completed', 'cancelled', 'no_show'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 🏠 VENUE HOME DASHBOARD REDESIGN

### Current State
**File:** `/src/frontend/pages/VenueOwnerHome.jsx`

Currently shows:
- Basic stats (revenue, orders, customers)
- Recent activity list
- Quick action buttons

### New Design (vibe-sphere inspired)

**Concept:** Make `/venue/home` the PRIMARY control center for managers, with a beautiful, modern interface showing live venue operations.

**Layout:**

```
┌──────────────────────────────────────────────────────────┐
│  🏢 Nocturne Lounge                    🔔 👤 ⚙️          │
├──────────────────────────────────────────────────────────┤
│  📊 LIVE VENUE OVERVIEW                                  │
│  ┌────────────────────────────────────────────────┐     │
│  │  🟢 OPEN | 78 Guests In Venue | 12 Staff On    │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  TODAY'S STATS                                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Revenue  │  │ Orders   │  │ Avg Order│              │
│  │ $3,245   │  │    156   │  │  $54.22  │              │
│  │ +12.5%   │  │   +8.2%  │  │  +5.3%   │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│                                                          │
│  LIVE ACTIVITY                                           │
│  ┌────────────────────────────────────────────────┐     │
│  │  🔥 HIGH PRIORITY ORDERS                        │     │
│  │  • Table 5: 2x Signature Cocktail (8 min ago)  │     │
│  │  • Pickup Order #1043 (ready in 5 min)         │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  QUICK ACTIONS                                           │
│  [📱 View POS] [🍔 Manage Menu] [📊 Analytics]         │
│  [📣 Create Promo Ad] [👥 Staff Schedule]               │
│                                                          │
│  TABLES OVERVIEW (Interactive Floorplan)                 │
│  [Shows mini version of floorplan with table statuses]  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Key Features:**

1. **Live Metrics (Real-time):**
   - Current guests in venue (from check-ins)
   - Staff currently on shift
   - Revenue ticking up as orders complete
   - Live order count

2. **Priority Alerts:**
   - Long wait times on orders
   - Low inventory warnings
   - Staff calling for manager assistance
   - Negative customer feedback

3. **Push Notification Ad Creation:**
   ```
   Manager clicks "Create Promo Ad"
       ↓
   Ad Builder Interface:
     ├─ Ad Type:
     │  • Happy Hour Promo
     │  • Event Announcement
     │  • Limited Time Offer
     │  • Special Menu Item
     ├─ Target Audience:
     │  [ ] All users nearby (500m radius)
     │  [ ] Users who favorited venue
     │  [ ] Previous customers (visited in last 30 days)
     │  [ ] Custom (age, interests, etc.)
     ├─ Message:
     │  [Text editor with character limit]
     │  Example: "🍹 Happy Hour NOW! 50% off all cocktails until 8 PM!"
     ├─ Image/Video (optional)
     ├─ Schedule:
     │  • Send now
     │  • Schedule for later
     ├─ Budget:
     │  • Costs X JVCoins per 100 recipients
     │  • Preview estimated reach
     └─ [Preview] [Send]
       ↓
   Uses venue's purchased push notification credits
       ↓
   Notification sent to targeted users
       ↓
   Analytics tracked: views, clicks, conversions
   ```

4. **Interactive Floorplan Widget:**
   - Mini version of floorplan from Table Management
   - Click table → see who's seated, current order, time seated
   - Green = available, Yellow = reserved, Red = occupied, Blue = needs attention

---

## 📊 PUSH NOTIFICATION AD SYSTEM

### Purchase Flow

Venues can buy push notification credits from their account:

```
Manager goes to /venue/credits
    ↓
Sees credit packages:
  ├─ Starter Pack: 500 notifications - $50 (50 JVCoins)
  ├─ Growth Pack: 2000 notifications - $180 (180 JVCoins)
  └─ Pro Pack: 10000 notifications - $800 (800 JVCoins)
    ↓
Purchases pack
    ↓
Credits added to venue account
    ↓
Can now create promo ads from Venue Home
```

### Database Schema

```sql
CREATE TABLE push_notification_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id),
  credits_purchased INTEGER NOT NULL,
  credits_used INTEGER DEFAULT 0,
  credits_remaining INTEGER NOT NULL,
  purchase_amount NUMERIC(10,2),
  purchased_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE promotional_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  ad_type TEXT NOT NULL, -- 'happy_hour', 'event', 'limited_offer', 'menu_item'
  message_text TEXT NOT NULL,
  image_url TEXT,
  target_audience JSONB, -- {"type": "nearby", "radius": 500, "filters": {...}}
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  recipients_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0,
  conversions_count INTEGER DEFAULT 0, -- users who visited/ordered after seeing ad
  credits_spent INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'sent', 'cancelled'
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 🎯 IMPLEMENTATION PRIORITY ORDER

Based on the new architecture, here's the recommended build order:

### Phase 1: Foundation (Week 1)
1. ✅ Set up Supabase project
2. ✅ Create database tables (new schema with employee, check-ins, remote orders)
3. ✅ Set up authentication (Supabase Auth)
4. ✅ Install shadcn/ui + Tailwind CSS
5. ✅ Create base contexts (AuthContext, POSContext)
6. ✅ Build POSLayout + Sidebar

### Phase 2: Core POS (Week 2)
1. ✅ Manager first-time setup screen (`/venue/pos/auth/manager`)
2. ✅ Dashboard (replace current `/venue/pos/dashboard`)
3. ✅ New Order page (main POS interface)
4. ✅ Kitchen Display System with real-time
5. ✅ Basic menu management

### Phase 3: Employee System (Week 3)
1. ✅ Employee invitation system (Staff Management page)
2. ✅ Employee acceptance flow
3. ✅ Shift mode (clock in/out)
4. ✅ Employee-specific navigation and permissions
5. ✅ Mobile POS for employees

### Phase 4: Enduser Experience (Week 4)
1. ✅ Venue check-in system (geolocation)
2. ✅ In-venue UI transformation
3. ✅ AI menu chat assistant
4. ✅ Mobile ordering from table
5. ✅ Seating visualization
6. ✅ Social features (guest messaging)
7. ✅ Call waiter/request bill features

### Phase 5: Remote Ordering (Week 5)
1. ✅ Order type selector (Pickup/Delivery/Dine-In)
2. ✅ Pickup flow + time selection
3. ✅ Delivery flow + address management
4. ✅ Dine-In reservation with pre-order
5. ✅ Order tracking notifications

### Phase 6: Venue Home & Ads (Week 6)
1. ✅ Redesign Venue Home page (`/venue/home`)
2. ✅ Live metrics dashboard
3. ✅ Push notification credit system
4. ✅ Ad creation interface
5. ✅ Ad analytics

### Phase 7: Polish & Launch (Week 7)
1. ✅ Testing all user flows
2. ✅ UI/UX refinements
3. ✅ Performance optimization
4. ✅ Documentation
5. ✅ Production deployment

---

## 🔧 ODOO REMOVAL CHECKLIST

All references to Odoo must be removed:

- [ ] Remove `/backend/services/odooService.js`
- [ ] Remove Odoo routes from `/backend/routes/pos.js`
- [ ] Update MASTER_POS_SETUP.md comparison table (remove "Odoo integration")
- [ ] Remove any Odoo config files
- [ ] Update all documentation to show Supabase only

---

## 📝 NOTES FOR AI AGENTS

If you're an AI agent reading this:

1. **This is V2** - Major architecture changes from original plan
2. **No Odoo** - Use Supabase for everything
3. **Three user types** - Owner, Employee, Enduser (each has different experience)
4. **Employee mode is critical** - When employee clocks in, their UI completely changes
5. **Check-in experience is key differentiator** - This is what makes JV special for venues
6. **Remote ordering is essential** - People want to order pickup/delivery
7. **Track completed work** - Update the completed tasks section as you build
8. **Design quality matters** - Use shadcn/ui, make it look professional, not sloppy

---

## ❓ QUESTIONS TO ASK USER BEFORE BUILDING

Before starting implementation:

1. **Supabase Project:**
   - Do you have a Supabase account?
   - Should I guide you through setup?

2. **Geolocation:**
   - For venue check-in, acceptable radius? (50m, 100m, 200m?)

3. **Delivery:**
   - Integrate with third-party (Uber Eats, DoorDash) or build custom?
   - Delivery fee calculation method?

4. **AI Menu Chat:**
   - Use OpenAI GPT-4, Anthropic Claude, or other?
   - Train on venue's menu specifically?

5. **Social Features:**
   - Age restrictions for guest messaging?
   - Moderation system needed?

6. **Starting Point:**
   - Build foundation first, or start with visible results (dashboard)?

---

**END OF V2 ADDITIONS**

This document should be merged into the main MASTER_POS_SETUP.md sections.
