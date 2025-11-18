-- =====================================================
-- JOINTVIBE POS V2 - COMPLETE DATABASE SCHEMA
-- =====================================================
-- This schema includes all features from MASTER_POS_SETUP
-- plus V2 additions for employee management, check-ins,
-- remote ordering, and push notification ads
-- =====================================================
-- AGENT INSTRUCTIONS:
-- 1. Run this ONCE in Supabase SQL Editor
-- 2. Do NOT modify unless updating master docs
-- 3. All changes must be documented
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geolocation features

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE app_role AS ENUM ('admin', 'manager', 'staff', 'kitchen', 'bartender', 'waiter', 'host');
CREATE TYPE order_status AS ENUM ('pending', 'preparing', 'ready', 'served', 'cancelled');
CREATE TYPE order_type AS ENUM ('dine_in', 'pickup', 'delivery');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'mobile', 'jvcoin');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE table_status AS ENUM ('available', 'occupied', 'reserved');
CREATE TYPE shift_status AS ENUM ('active', 'break', 'ended');
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'declined', 'expired');
CREATE TYPE notification_status AS ENUM ('draft', 'scheduled', 'sent', 'cancelled');
CREATE TYPE stock_status AS ENUM ('good', 'low', 'critical');

-- =====================================================
-- USER MANAGEMENT TABLES
-- =====================================================

-- User Roles Table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- User Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- VENUE TABLES
-- =====================================================

-- Venues Table
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'US',
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  operating_hours JSONB, -- e.g., {"monday": {"open": "10:00", "close": "22:00"}}
  tax_rate NUMERIC(5,2) DEFAULT 10.00,
  currency TEXT DEFAULT 'USD',
  timezone TEXT DEFAULT 'America/New_York',
  is_active BOOLEAN DEFAULT true,
  pos_initialized BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Venue Settings Table
CREATE TABLE IF NOT EXISTS venue_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  setting_key TEXT NOT NULL,
  setting_value JSONB,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(venue_id, setting_key)
);

-- =====================================================
-- EMPLOYEE MANAGEMENT (V2)
-- =====================================================

-- Employee Invitations Table
CREATE TABLE IF NOT EXISTS employee_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  employee_email TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  role app_role NOT NULL,
  permissions JSONB DEFAULT '{}'::jsonb,
  status invitation_status DEFAULT 'pending',
  invitation_token UUID DEFAULT gen_random_uuid(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '7 days'),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Employee Venue Links Table
CREATE TABLE IF NOT EXISTS employee_venue_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  permissions JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  hired_date TIMESTAMPTZ DEFAULT now(),
  terminated_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, venue_id)
);

-- Employee Shifts Table
CREATE TABLE IF NOT EXISTS employee_shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  clock_in_time TIMESTAMPTZ DEFAULT now(),
  clock_out_time TIMESTAMPTZ,
  total_sales NUMERIC(10,2) DEFAULT 0,
  orders_served INTEGER DEFAULT 0,
  status shift_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- VENUE CHECK-INS (V2)
-- =====================================================

-- Venue Check-ins Table
CREATE TABLE IF NOT EXISTS venue_check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  check_in_time TIMESTAMPTZ DEFAULT now(),
  check_out_time TIMESTAMPTZ,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  table_number TEXT,
  is_visible_to_guests BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active', -- 'active', 'checked_out'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Guest Messages Table
CREATE TABLE IF NOT EXISTS guest_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Waiter Calls Table
CREATE TABLE IF NOT EXISTS waiter_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  table_number TEXT,
  request_type TEXT NOT NULL, -- 'call_waiter', 'request_bill', 'assistance'
  notes TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'acknowledged', 'completed'
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- =====================================================
-- FLOORPLAN & TABLES
-- =====================================================

-- Floorplans Table
CREATE TABLE IF NOT EXISTS floorplans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  canvas_width INTEGER DEFAULT 2000,
  canvas_height INTEGER DEFAULT 1200,
  items JSONB DEFAULT '[]'::jsonb,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Venue Tables
CREATE TABLE IF NOT EXISTS venue_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  table_number TEXT NOT NULL,
  capacity INTEGER DEFAULT 4,
  section TEXT,
  status table_status DEFAULT 'available',
  x_position NUMERIC,
  y_position NUMERIC,
  floorplan_id UUID REFERENCES floorplans(id) ON DELETE CASCADE,
  qr_code_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(venue_id, table_number)
);

-- =====================================================
-- MENU MANAGEMENT
-- =====================================================

-- Menu Categories Table
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  cost NUMERIC(10,2), -- Cost of goods sold
  image_url TEXT,
  station TEXT DEFAULT 'kitchen', -- 'kitchen', 'bar', 'expo'
  preparation_time INTEGER DEFAULT 15, -- minutes
  modifiers JSONB, -- Available customizations
  allergens TEXT[],
  is_available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- ORDERS & PAYMENTS
-- =====================================================

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number INTEGER GENERATED ALWAYS AS IDENTITY,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  table_id UUID REFERENCES venue_tables(id),
  table_number TEXT,
  customer_name TEXT,
  customer_id UUID REFERENCES auth.users(id), -- For enduser orders
  status order_status DEFAULT 'pending',
  order_type order_type DEFAULT 'dine_in', -- V2: pickup, delivery
  station TEXT,
  priority TEXT DEFAULT 'normal',
  notes TEXT,

  -- V2: Remote ordering fields
  pickup_time TIMESTAMPTZ,
  delivery_address JSONB,
  delivery_instructions TEXT,
  delivery_fee NUMERIC(10,2) DEFAULT 0,
  estimated_ready_time TIMESTAMPTZ,
  estimated_delivery_time TIMESTAMPTZ,
  confirmation_code TEXT,

  -- Pricing
  subtotal NUMERIC(10,2) DEFAULT 0,
  tax NUMERIC(10,2) DEFAULT 0,
  tip NUMERIC(10,2) DEFAULT 0,
  discount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) DEFAULT 0,

  -- Staff tracking
  staff_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),
  name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  price NUMERIC(10,2) NOT NULL,
  modifiers JSONB,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  payment_method payment_method NOT NULL,
  status payment_status DEFAULT 'pending',
  transaction_id TEXT,
  staff_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- RESERVATIONS (V2)
-- =====================================================

-- Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  reservation_time TIMESTAMPTZ NOT NULL,
  party_size INTEGER NOT NULL,
  table_id UUID REFERENCES venue_tables(id),
  special_occasion TEXT,
  seating_preference TEXT,
  pre_order_id UUID REFERENCES orders(id),
  status TEXT DEFAULT 'confirmed', -- 'confirmed', 'seated', 'completed', 'cancelled', 'no_show'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- INVENTORY MANAGEMENT
-- =====================================================

-- Inventory Items Table
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  quantity NUMERIC(10,2) DEFAULT 0,
  unit TEXT DEFAULT 'unit', -- 'unit', 'kg', 'L', 'lb', etc.
  low_threshold NUMERIC(10,2) DEFAULT 0,
  reorder_quantity NUMERIC(10,2),
  cost_per_unit NUMERIC(10,2),
  supplier TEXT,
  last_restocked TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(venue_id, sku)
);

-- Inventory Transactions Table
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL, -- 'restock', 'adjustment', 'consumption', 'waste'
  quantity NUMERIC(10,2) NOT NULL,
  notes TEXT,
  staff_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- PUSH NOTIFICATIONS (V2)
-- =====================================================

-- Push Notification Credits Table
CREATE TABLE IF NOT EXISTS push_notification_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  credits_purchased INTEGER NOT NULL,
  credits_used INTEGER DEFAULT 0,
  credits_remaining INTEGER NOT NULL,
  purchase_amount NUMERIC(10,2),
  purchased_at TIMESTAMPTZ DEFAULT now()
);

-- Promotional Notifications Table
CREATE TABLE IF NOT EXISTS promotional_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  ad_type TEXT NOT NULL, -- 'happy_hour', 'event', 'limited_offer', 'menu_item'
  message_text TEXT NOT NULL,
  image_url TEXT,
  target_audience JSONB,
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  recipients_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0,
  conversions_count INTEGER DEFAULT 0,
  credits_spent INTEGER DEFAULT 0,
  status notification_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- ANALYTICS TABLES
-- =====================================================

-- Sales Summary Table (for faster analytics queries)
CREATE TABLE IF NOT EXISTS sales_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  hour INTEGER, -- 0-23
  total_sales NUMERIC(10,2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  total_customers INTEGER DEFAULT 0,
  avg_order_value NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(venue_id, date, hour)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- Venue indexes
CREATE INDEX IF NOT EXISTS idx_venues_owner_id ON venues(owner_id);
CREATE INDEX IF NOT EXISTS idx_venues_pos_init ON venues(pos_initialized);

-- Employee indexes
CREATE INDEX IF NOT EXISTS idx_employee_invitations_venue ON employee_invitations(venue_id);
CREATE INDEX IF NOT EXISTS idx_employee_invitations_token ON employee_invitations(invitation_token);
CREATE INDEX IF NOT EXISTS idx_employee_links_user ON employee_venue_links(user_id);
CREATE INDEX IF NOT EXISTS idx_employee_links_venue ON employee_venue_links(venue_id);
CREATE INDEX IF NOT EXISTS idx_employee_shifts_employee ON employee_shifts(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_shifts_venue ON employee_shifts(venue_id);
CREATE INDEX IF NOT EXISTS idx_employee_shifts_status ON employee_shifts(status);

-- Check-in indexes
CREATE INDEX IF NOT EXISTS idx_check_ins_user ON venue_check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_venue ON venue_check_ins(venue_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_status ON venue_check_ins(status);

-- Table indexes
CREATE INDEX IF NOT EXISTS idx_venue_tables_venue ON venue_tables(venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_tables_status ON venue_tables(status);

-- Menu indexes
CREATE INDEX IF NOT EXISTS idx_menu_items_venue ON menu_items(venue_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);

-- Order indexes
CREATE INDEX IF NOT EXISTS idx_orders_venue ON orders(venue_id);
CREATE INDEX IF NOT EXISTS idx_orders_table ON orders(table_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- Payment indexes
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_venue ON payments(venue_id);

-- Inventory indexes
CREATE INDEX IF NOT EXISTS idx_inventory_venue ON inventory_items(venue_id);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_sales_summary_venue_date ON sales_summary(venue_id, date);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_venue_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE waiter_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE floorplans ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_notification_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotional_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_summary ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$
BEGIN
    -- User Roles Policies
    DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
    DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;

    -- Profiles Policies
    DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

    -- Venues Policies
    DROP POLICY IF EXISTS "Venue owners can manage their venues" ON venues;
    DROP POLICY IF EXISTS "Venue employees can view their venues" ON venues;

    -- Orders Policies
    DROP POLICY IF EXISTS "Staff can view venue orders" ON orders;
    DROP POLICY IF EXISTS "Staff can create orders" ON orders;
    DROP POLICY IF EXISTS "Staff can update orders" ON orders;
    DROP POLICY IF EXISTS "Customers can view their orders" ON orders;
END $$;

-- User Roles Policies
CREATE POLICY "Users can view their own roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
  ON user_roles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Profiles Policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Venues Policies (Owner and employees can access)
CREATE POLICY "Venue owners can manage their venues"
  ON venues FOR ALL
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Venue employees can view their venues"
  ON venues FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employee_venue_links
      WHERE venue_id = venues.id AND user_id = auth.uid() AND is_active = true
    )
  );

-- Orders Policies (Staff and employees can access)
CREATE POLICY "Staff can view venue orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employee_venue_links
      WHERE venue_id = orders.venue_id AND user_id = auth.uid() AND is_active = true
    ) OR
    EXISTS (
      SELECT 1 FROM venues
      WHERE id = orders.venue_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Staff can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employee_venue_links
      WHERE venue_id = orders.venue_id AND user_id = auth.uid() AND is_active = true
    ) OR
    EXISTS (
      SELECT 1 FROM venues
      WHERE id = orders.venue_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Staff can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employee_venue_links
      WHERE venue_id = orders.venue_id AND user_id = auth.uid() AND is_active = true
    ) OR
    EXISTS (
      SELECT 1 FROM venues
      WHERE id = orders.venue_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Customers can view their orders"
  ON orders FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

-- =====================================================
-- REALTIME SUBSCRIPTIONS
-- =====================================================

-- Enable realtime for orders table (kitchen display)
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS orders;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS order_items;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS employee_shifts;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS waiter_calls;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS venue_tables;

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_venues_updated_at ON venues;
CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON venues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_venue_tables_updated_at ON venue_tables;
CREATE TRIGGER update_venue_tables_updated_at BEFORE UPDATE ON venue_tables
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_menu_items_updated_at ON menu_items;
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate order totals
CREATE OR REPLACE FUNCTION calculate_order_totals()
RETURNS TRIGGER AS $$
DECLARE
  order_subtotal NUMERIC(10,2);
  order_tax NUMERIC(10,2);
  venue_tax_rate NUMERIC(5,2);
BEGIN
  -- Get venue tax rate
  SELECT tax_rate INTO venue_tax_rate
  FROM venues
  WHERE id = NEW.venue_id;

  -- Calculate subtotal from order items
  SELECT COALESCE(SUM(price * quantity), 0)
  INTO order_subtotal
  FROM order_items
  WHERE order_id = NEW.id;

  -- Calculate tax
  order_tax := order_subtotal * (venue_tax_rate / 100);

  -- Update order
  NEW.subtotal := order_subtotal;
  NEW.tax := order_tax;
  NEW.total := order_subtotal + order_tax + COALESCE(NEW.tip, 0) + COALESCE(NEW.delivery_fee, 0) - COALESCE(NEW.discount, 0);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate order totals
DROP TRIGGER IF EXISTS calculate_order_totals_trigger ON orders;
CREATE TRIGGER calculate_order_totals_trigger
  BEFORE INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION calculate_order_totals();

-- =====================================================
-- END OF SCHEMA
-- =====================================================

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'JointVibe POS V2 database schema created successfully!';
  RAISE NOTICE 'Total tables: 30+';
  RAISE NOTICE 'RLS policies: Enabled';
  RAISE NOTICE 'Realtime: Configured';
  RAISE NOTICE 'Next step: Update .env with Supabase credentials';
END $$;
