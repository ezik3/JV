-- =============================================
-- JoinVibe POS System - Complete Database Schema
-- Version: 2.0
-- Database: PostgreSQL (Supabase)
-- Last Updated: 2025-11-18
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLE: venues
-- Purpose: Store venue (restaurant/bar) information
-- =============================================
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'USA',
  phone VARCHAR(50),
  email VARCHAR(255),

  -- Manager/Owner info
  manager_id UUID, -- Links to Wasp auth user if applicable
  manager_name VARCHAR(255),
  manager_email VARCHAR(255),

  -- Payment Configuration
  payment_account_id VARCHAR(255), -- External payment account ID
  payment_provider VARCHAR(50) DEFAULT 'stripe', -- stripe, crypto, etc.
  crypto_wallet_address VARCHAR(255),

  -- Settings
  currency VARCHAR(10) DEFAULT 'USD',
  timezone VARCHAR(50) DEFAULT 'America/New_York',
  tax_rate DECIMAL(5,2) DEFAULT 0.00,
  service_charge_rate DECIMAL(5,2) DEFAULT 0.00,

  -- Features
  accepts_crypto BOOLEAN DEFAULT false,
  accepts_vibe_token BOOLEAN DEFAULT false,
  kitchen_display_enabled BOOLEAN DEFAULT true,
  table_management_enabled BOOLEAN DEFAULT false,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,

  -- Indexes
  CONSTRAINT venues_slug_key UNIQUE (slug)
);

CREATE INDEX idx_venues_slug ON venues(slug);
CREATE INDEX idx_venues_manager_id ON venues(manager_id);
CREATE INDEX idx_venues_is_active ON venues(is_active);

-- =============================================
-- TABLE: employees
-- Purpose: Store employee information for each venue
-- =============================================
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,

  -- Employee Info
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),

  -- Authentication
  pin_code VARCHAR(6), -- 4-6 digit PIN for quick login
  password_hash VARCHAR(255), -- For more secure login

  -- Role & Permissions
  role VARCHAR(50) NOT NULL DEFAULT 'server', -- manager, server, kitchen, bartender
  permissions JSONB DEFAULT '[]', -- Array of permission strings

  -- Employment Info
  hire_date DATE,
  hourly_rate DECIMAL(10,2),

  -- Status
  is_active BOOLEAN DEFAULT true,
  is_clocked_in BOOLEAN DEFAULT false,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT employees_pin_venue_unique UNIQUE (venue_id, pin_code)
);

CREATE INDEX idx_employees_venue_id ON employees(venue_id);
CREATE INDEX idx_employees_role ON employees(role);
CREATE INDEX idx_employees_is_active ON employees(is_active);
CREATE INDEX idx_employees_is_clocked_in ON employees(is_clocked_in);

-- =============================================
-- TABLE: employee_shifts
-- Purpose: Track employee clock in/out times
-- =============================================
CREATE TABLE IF NOT EXISTS employee_shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,

  -- Shift Times
  start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_time TIMESTAMPTZ,

  -- Shift Info
  break_duration_minutes INTEGER DEFAULT 0,
  notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_employee_shifts_employee_id ON employee_shifts(employee_id);
CREATE INDEX idx_employee_shifts_venue_id ON employee_shifts(venue_id);
CREATE INDEX idx_employee_shifts_start_time ON employee_shifts(start_time);
CREATE INDEX idx_employee_shifts_end_time ON employee_shifts(end_time);

-- =============================================
-- TABLE: menu_categories
-- Purpose: Organize menu items into categories
-- =============================================
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,

  -- Category Info
  name VARCHAR(100) NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  icon VARCHAR(50), -- emoji or icon name
  color VARCHAR(20), -- hex color for UI

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT menu_categories_venue_name_unique UNIQUE (venue_id, name)
);

CREATE INDEX idx_menu_categories_venue_id ON menu_categories(venue_id);
CREATE INDEX idx_menu_categories_display_order ON menu_categories(display_order);

-- =============================================
-- TABLE: menu_items
-- Purpose: Store menu items/products
-- =============================================
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,

  -- Item Info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sku VARCHAR(100),
  barcode VARCHAR(100),

  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2), -- Cost of goods

  -- Display
  image_url TEXT,
  icon VARCHAR(50), -- emoji or icon name
  display_order INTEGER DEFAULT 0,

  -- Inventory
  track_inventory BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,

  -- Attributes
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_alcohol BOOLEAN DEFAULT false,

  -- Modifiers & Options
  modifiers JSONB DEFAULT '[]', -- Array of modifier groups

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT menu_items_venue_name_unique UNIQUE (venue_id, name)
);

CREATE INDEX idx_menu_items_venue_id ON menu_items(venue_id);
CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX idx_menu_items_is_available ON menu_items(is_available);
CREATE INDEX idx_menu_items_display_order ON menu_items(display_order);

-- =============================================
-- TABLE: orders
-- Purpose: Store customer orders
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,

  -- Order Info
  order_number VARCHAR(50) UNIQUE NOT NULL,
  order_type VARCHAR(50) DEFAULT 'dine-in', -- dine-in, takeout, delivery

  -- Customer Info
  customer_name VARCHAR(255),
  customer_phone VARCHAR(50),
  customer_email VARCHAR(255),
  table_number VARCHAR(20),

  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- pending, preparing, ready, completed, cancelled

  -- Financial
  subtotal DECIMAL(10,2) DEFAULT 0.00,
  tax_amount DECIMAL(10,2) DEFAULT 0.00,
  service_charge DECIMAL(10,2) DEFAULT 0.00,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  tip_amount DECIMAL(10,2) DEFAULT 0.00,
  total_amount DECIMAL(10,2) DEFAULT 0.00,

  -- Payment
  payment_status VARCHAR(50) DEFAULT 'unpaid', -- unpaid, paid, refunded, partially_refunded
  payment_method VARCHAR(50), -- cash, card, crypto, vibe_token

  -- Notes
  notes TEXT,
  special_instructions TEXT,

  -- Timestamps
  ordered_at TIMESTAMPTZ DEFAULT NOW(),
  preparing_at TIMESTAMPTZ,
  ready_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_venue_id ON orders(venue_id);
CREATE INDEX idx_orders_employee_id ON orders(employee_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_ordered_at ON orders(ordered_at);

-- =============================================
-- TABLE: order_items
-- Purpose: Individual items within an order
-- =============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,

  -- Item Info (snapshot at time of order)
  item_name VARCHAR(255) NOT NULL,
  item_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,

  -- Modifiers & Options
  modifiers JSONB DEFAULT '[]', -- Selected modifiers with prices
  special_instructions TEXT,

  -- Calculated
  subtotal DECIMAL(10,2) NOT NULL, -- item_price * quantity + modifiers

  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- pending, preparing, ready, served

  -- Kitchen
  prepared_by UUID REFERENCES employees(id) ON DELETE SET NULL,
  prepared_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item_id ON order_items(menu_item_id);
CREATE INDEX idx_order_items_status ON order_items(status);

-- =============================================
-- TABLE: payments
-- Purpose: Track payment transactions
-- =============================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,

  -- Payment Info
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL, -- cash, card, crypto, vibe_token
  payment_provider VARCHAR(50), -- stripe, coinbase, xrpl, etc.

  -- Transaction Details
  transaction_id VARCHAR(255) UNIQUE,
  transaction_status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded

  -- Payment Method Specific
  card_last4 VARCHAR(4),
  card_brand VARCHAR(50),
  crypto_currency VARCHAR(20), -- XRP, BTC, ETH, etc.
  crypto_tx_hash VARCHAR(255),
  crypto_wallet_address VARCHAR(255),

  -- Routing
  routed_to_account VARCHAR(255), -- Which account received the payment

  -- Metadata
  payment_metadata JSONB DEFAULT '{}',
  notes TEXT,

  -- Timestamps
  paid_at TIMESTAMPTZ DEFAULT NOW(),
  refunded_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_venue_id ON payments(venue_id);
CREATE INDEX idx_payments_employee_id ON payments(employee_id);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_payments_transaction_status ON payments(transaction_status);
CREATE INDEX idx_payments_paid_at ON payments(paid_at);

-- =============================================
-- TABLE: kitchen_display_settings
-- Purpose: Store kitchen display preferences per venue
-- =============================================
CREATE TABLE IF NOT EXISTS kitchen_display_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,

  -- View Settings
  default_view_mode VARCHAR(20) DEFAULT 'card', -- card, list, kanban
  sort_by VARCHAR(50) DEFAULT 'ordered_at', -- ordered_at, priority, order_type
  sort_direction VARCHAR(10) DEFAULT 'asc', -- asc, desc

  -- Display Settings
  auto_refresh_interval INTEGER DEFAULT 5, -- seconds
  show_completed_orders BOOLEAN DEFAULT true,
  completed_orders_duration INTEGER DEFAULT 300, -- seconds (5 min)

  -- Filters
  filter_by_order_type JSONB DEFAULT '[]', -- Array of order types to show

  -- Alerts
  alert_on_new_order BOOLEAN DEFAULT true,
  alert_sound_enabled BOOLEAN DEFAULT true,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT kitchen_display_settings_venue_unique UNIQUE (venue_id)
);

CREATE INDEX idx_kitchen_display_settings_venue_id ON kitchen_display_settings(venue_id);

-- =============================================
-- TABLE: inventory_transactions
-- Purpose: Track inventory changes
-- =============================================
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,

  -- Transaction Info
  transaction_type VARCHAR(50) NOT NULL, -- sale, restock, adjustment, waste
  quantity INTEGER NOT NULL, -- Positive for additions, negative for subtractions
  previous_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,

  -- Reference
  order_item_id UUID REFERENCES order_items(id) ON DELETE SET NULL,
  notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inventory_transactions_venue_id ON inventory_transactions(venue_id);
CREATE INDEX idx_inventory_transactions_menu_item_id ON inventory_transactions(menu_item_id);
CREATE INDEX idx_inventory_transactions_created_at ON inventory_transactions(created_at);

-- =============================================
-- TABLE: discounts
-- Purpose: Store discount/promotion codes
-- =============================================
CREATE TABLE IF NOT EXISTS discounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,

  -- Discount Info
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Type & Value
  discount_type VARCHAR(50) NOT NULL, -- percentage, fixed_amount, free_item
  discount_value DECIMAL(10,2) NOT NULL,

  -- Conditions
  min_order_amount DECIMAL(10,2),
  max_discount_amount DECIMAL(10,2),
  applicable_items JSONB DEFAULT '[]', -- Array of menu_item_ids

  -- Validity
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT discounts_venue_code_unique UNIQUE (venue_id, code)
);

CREATE INDEX idx_discounts_venue_id ON discounts(venue_id);
CREATE INDEX idx_discounts_code ON discounts(code);
CREATE INDEX idx_discounts_is_active ON discounts(is_active);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON venues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employee_shifts_updated_at BEFORE UPDATE ON employee_shifts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_categories_updated_at BEFORE UPDATE ON menu_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_items_updated_at BEFORE UPDATE ON order_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kitchen_display_settings_updated_at BEFORE UPDATE ON kitchen_display_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discounts_updated_at BEFORE UPDATE ON discounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Generate unique order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  number_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate format: ORD-YYYYMMDD-XXXX (e.g., ORD-20231118-0001)
    new_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
                  LPAD(FLOOR(RANDOM() * 9999 + 1)::TEXT, 4, '0');

    -- Check if number already exists
    SELECT EXISTS(SELECT 1 FROM orders WHERE order_number = new_number) INTO number_exists;

    -- Exit loop if unique
    EXIT WHEN NOT number_exists;
  END LOOP;

  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-generate order number if not provided
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION set_order_number();

-- Function: Update order totals when order_items change
CREATE OR REPLACE FUNCTION update_order_totals()
RETURNS TRIGGER AS $$
DECLARE
  order_subtotal DECIMAL(10,2);
  order_tax DECIMAL(10,2);
  order_service_charge DECIMAL(10,2);
  order_total DECIMAL(10,2);
  venue_tax_rate DECIMAL(5,2);
  venue_service_rate DECIMAL(5,2);
BEGIN
  -- Get venue rates
  SELECT tax_rate, service_charge_rate INTO venue_tax_rate, venue_service_rate
  FROM venues v
  JOIN orders o ON o.venue_id = v.id
  WHERE o.id = COALESCE(NEW.order_id, OLD.order_id);

  -- Calculate subtotal from all order items
  SELECT COALESCE(SUM(subtotal), 0) INTO order_subtotal
  FROM order_items
  WHERE order_id = COALESCE(NEW.order_id, OLD.order_id);

  -- Calculate tax and service charge
  order_tax := order_subtotal * (venue_tax_rate / 100);
  order_service_charge := order_subtotal * (venue_service_rate / 100);

  -- Calculate total
  order_total := order_subtotal + order_tax + order_service_charge;

  -- Update order
  UPDATE orders
  SET
    subtotal = order_subtotal,
    tax_amount = order_tax,
    service_charge = order_service_charge,
    total_amount = order_total - COALESCE(discount_amount, 0) + COALESCE(tip_amount, 0)
  WHERE id = COALESCE(NEW.order_id, OLD.order_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_order_totals_on_item_insert AFTER INSERT ON order_items
  FOR EACH ROW EXECUTE FUNCTION update_order_totals();

CREATE TRIGGER update_order_totals_on_item_update AFTER UPDATE ON order_items
  FOR EACH ROW EXECUTE FUNCTION update_order_totals();

CREATE TRIGGER update_order_totals_on_item_delete AFTER DELETE ON order_items
  FOR EACH ROW EXECUTE FUNCTION update_order_totals();

-- Function: Update inventory on order item creation
CREATE OR REPLACE FUNCTION update_inventory_on_order()
RETURNS TRIGGER AS $$
BEGIN
  -- Only decrease inventory for 'sale' transactions
  IF (SELECT track_inventory FROM menu_items WHERE id = NEW.menu_item_id) THEN
    -- Decrease stock quantity
    UPDATE menu_items
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE id = NEW.menu_item_id;

    -- Create inventory transaction
    INSERT INTO inventory_transactions (
      venue_id,
      menu_item_id,
      transaction_type,
      quantity,
      previous_quantity,
      new_quantity,
      order_item_id
    )
    SELECT
      o.venue_id,
      NEW.menu_item_id,
      'sale',
      -NEW.quantity,
      m.stock_quantity + NEW.quantity,
      m.stock_quantity,
      NEW.id
    FROM orders o
    JOIN menu_items m ON m.id = NEW.menu_item_id
    WHERE o.id = NEW.order_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_inventory_on_order_trigger AFTER INSERT ON order_items
  FOR EACH ROW EXECUTE FUNCTION update_inventory_on_order();

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE kitchen_display_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;

-- Note: Specific RLS policies will depend on your authentication system
-- Below are example policies that allow venue managers full access to their venue data

-- Example: Venue managers can view and edit their own venue
CREATE POLICY "Venue managers can manage their venue" ON venues
  FOR ALL
  USING (manager_id = auth.uid())
  WITH CHECK (manager_id = auth.uid());

-- Example: Employees of a venue can view venue data
CREATE POLICY "Employees can view their venue" ON venues
  FOR SELECT
  USING (id IN (SELECT venue_id FROM employees WHERE id = auth.uid()));

-- Add similar policies for other tables based on your auth requirements

-- =============================================
-- SEED DATA (Optional - for development)
-- =============================================

-- Uncomment below to add sample data for testing

/*
-- Sample Venue
INSERT INTO venues (
  name, slug, address, city, state, zip_code,
  manager_name, manager_email,
  currency, tax_rate, service_charge_rate
) VALUES (
  'The Joint Vibe Cafe',
  'joint-vibe-cafe',
  '123 Main Street',
  'New York',
  'NY',
  '10001',
  'John Manager',
  'john@jointvibe.com',
  'USD',
  8.50,
  15.00
) RETURNING id;

-- Sample Categories (replace venue_id with actual UUID)
INSERT INTO menu_categories (venue_id, name, icon, display_order) VALUES
  ('your-venue-id', 'Appetizers', '🍟', 1),
  ('your-venue-id', 'Entrees', '🍔', 2),
  ('your-venue-id', 'Drinks', '🍹', 3),
  ('your-venue-id', 'Desserts', '🍰', 4);

-- Sample Menu Items
INSERT INTO menu_items (venue_id, category_id, name, description, price, icon, is_available) VALUES
  ('your-venue-id', 'appetizers-category-id', 'French Fries', 'Crispy golden fries', 5.99, '🍟', true),
  ('your-venue-id', 'entrees-category-id', 'Cheeseburger', 'Juicy beef patty with cheese', 12.99, '🍔', true),
  ('your-venue-id', 'drinks-category-id', 'Coca Cola', 'Classic refreshing soda', 2.99, '🥤', true),
  ('your-venue-id', 'desserts-category-id', 'Chocolate Cake', 'Rich chocolate dessert', 6.99, '🍰', true);
*/

-- =============================================
-- VIEWS (Optional - for reporting)
-- =============================================

-- View: Order Summary with Employee Info
CREATE OR REPLACE VIEW order_summary AS
SELECT
  o.id,
  o.order_number,
  o.order_type,
  o.status,
  o.total_amount,
  o.payment_status,
  o.ordered_at,
  v.name AS venue_name,
  e.first_name || ' ' || e.last_name AS employee_name,
  COUNT(oi.id) AS item_count
FROM orders o
JOIN venues v ON o.venue_id = v.id
LEFT JOIN employees e ON o.employee_id = e.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, v.name, e.first_name, e.last_name;

-- View: Daily Sales by Venue
CREATE OR REPLACE VIEW daily_sales AS
SELECT
  v.id AS venue_id,
  v.name AS venue_name,
  DATE(o.ordered_at) AS sale_date,
  COUNT(o.id) AS order_count,
  SUM(o.subtotal) AS subtotal,
  SUM(o.tax_amount) AS tax,
  SUM(o.service_charge) AS service_charge,
  SUM(o.tip_amount) AS tips,
  SUM(o.total_amount) AS total_revenue
FROM venues v
LEFT JOIN orders o ON v.id = o.venue_id
WHERE o.payment_status = 'paid'
GROUP BY v.id, v.name, DATE(o.ordered_at)
ORDER BY sale_date DESC, v.name;

-- View: Menu Item Performance
CREATE OR REPLACE VIEW menu_item_performance AS
SELECT
  mi.id,
  mi.name,
  mi.category_id,
  mc.name AS category_name,
  mi.price,
  COUNT(oi.id) AS times_ordered,
  SUM(oi.quantity) AS total_quantity_sold,
  SUM(oi.subtotal) AS total_revenue,
  AVG(oi.subtotal) AS avg_order_value
FROM menu_items mi
LEFT JOIN menu_categories mc ON mi.category_id = mc.id
LEFT JOIN order_items oi ON mi.id = oi.menu_item_id
LEFT JOIN orders o ON oi.order_id = o.id
WHERE o.payment_status = 'paid'
GROUP BY mi.id, mi.name, mi.category_id, mc.name, mi.price
ORDER BY total_revenue DESC;

-- =============================================
-- GRANTS (Adjust based on your setup)
-- =============================================

-- Grant usage to authenticated users (Supabase default role)
-- GRANT USAGE ON SCHEMA public TO authenticated;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- =============================================
-- END OF SCHEMA
-- =============================================

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ JoinVibe POS database schema installed successfully!';
  RAISE NOTICE '📋 Created tables: venues, employees, employee_shifts, menu_categories, menu_items, orders, order_items, payments, kitchen_display_settings, inventory_transactions, discounts';
  RAISE NOTICE '🔧 Created functions: update_updated_at_column, generate_order_number, set_order_number, update_order_totals, update_inventory_on_order';
  RAISE NOTICE '👁️ Created views: order_summary, daily_sales, menu_item_performance';
  RAISE NOTICE '🔒 Enabled Row Level Security on all tables';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Configure RLS policies based on your authentication';
  RAISE NOTICE '2. Add seed data for testing (optional)';
  RAISE NOTICE '3. Update TypeScript types to match this schema';
  RAISE NOTICE '4. Test connections from your application';
END $$;
