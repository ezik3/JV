-- ============================================================================
-- JointVibe POS V2 - Complete Database Schema
-- ============================================================================
-- Version: 2.0
-- Created: 2025-11-18
-- Database: PostgreSQL (Supabase)
-- Total Tables: 30+
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- 1. POS Venues
CREATE TABLE IF NOT EXISTS pos_venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  phone TEXT,
  email TEXT,
  timezone TEXT DEFAULT 'America/New_York',
  currency TEXT DEFAULT 'USD',
  tax_rate DECIMAL(5,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{
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
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. POS Employees
CREATE TABLE IF NOT EXISTS pos_employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES pos_venues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('kitchen', 'waiter', 'bartender', 'host', 'manager')),
  pin_code TEXT NOT NULL,
  hourly_rate DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  hire_date DATE DEFAULT CURRENT_DATE,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(venue_id, pin_code)
);

-- 3. POS Shifts
CREATE TABLE IF NOT EXISTS pos_shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES pos_venues(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES pos_employees(id) ON DELETE CASCADE,
  clock_in TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  clock_out TIMESTAMPTZ,
  break_minutes INTEGER DEFAULT 0,
  total_sales DECIMAL(10,2) DEFAULT 0.00,
  total_orders INTEGER DEFAULT 0,
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. POS Menu Categories
CREATE TABLE IF NOT EXISTS pos_menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES pos_venues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. POS Menu Items
CREATE TABLE IF NOT EXISTS pos_menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES pos_venues(id) ON DELETE CASCADE,
  category_id UUID REFERENCES pos_menu_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2) DEFAULT 0.00,
  sku TEXT,
  barcode TEXT,
  image_url TEXT,
  prep_time_minutes INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  modifiers JSONB DEFAULT '[]',
  allergens TEXT[] DEFAULT '{}',
  nutritional_info JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. POS Orders
CREATE TABLE IF NOT EXISTS pos_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES pos_venues(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,
  employee_id UUID REFERENCES pos_employees(id),
  shift_id UUID REFERENCES pos_shifts(id),
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  table_number TEXT,
  order_type TEXT NOT NULL CHECK (order_type IN ('dine_in', 'takeout', 'delivery', 'bar')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'completed', 'cancelled')),
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  tax DECIMAL(10,2) DEFAULT 0.00,
  tip DECIMAL(10,2) DEFAULT 0.00,
  discount DECIMAL(10,2) DEFAULT 0.00,
  total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partially_paid', 'refunded')),
  notes TEXT,
  kitchen_notes TEXT,
  special_requests TEXT,
  estimated_ready_time TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(venue_id, order_number)
);

-- 7. POS Order Items
CREATE TABLE IF NOT EXISTS pos_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES pos_orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES pos_menu_items(id),
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  modifiers JSONB DEFAULT '[]',
  special_instructions TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'served', 'cancelled')),
  prepared_by UUID REFERENCES pos_employees(id),
  prepared_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. POS Inventory
CREATE TABLE IF NOT EXISTS pos_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES pos_venues(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  category TEXT,
  unit TEXT NOT NULL DEFAULT 'unit',
  current_quantity DECIMAL(10,2) DEFAULT 0.00,
  minimum_quantity DECIMAL(10,2) DEFAULT 0.00,
  reorder_quantity DECIMAL(10,2) DEFAULT 0.00,
  unit_cost DECIMAL(10,2) DEFAULT 0.00,
  supplier TEXT,
  last_restock_date DATE,
  expiration_date DATE,
  location TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. POS Payments
CREATE TABLE IF NOT EXISTS pos_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES pos_venues(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES pos_orders(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES pos_employees(id),
  shift_id UUID REFERENCES pos_shifts(id),
  amount DECIMAL(10,2) NOT NULL,
  tip_amount DECIMAL(10,2) DEFAULT 0.00,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'credit_card', 'debit_card', 'mobile', 'gift_card', 'comp')),
  card_last_four TEXT,
  transaction_id TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. POS Tables
CREATE TABLE IF NOT EXISTS pos_tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES pos_venues(id) ON DELETE CASCADE,
  table_number TEXT NOT NULL,
  section TEXT,
  capacity INTEGER DEFAULT 4,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved', 'cleaning')),
  current_order_id UUID REFERENCES pos_orders(id),
  qr_code TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(venue_id, table_number)
);

-- ============================================================================
-- EXTENDED TABLES
-- ============================================================================

-- 11. POS Customers
CREATE TABLE IF NOT EXISTS pos_customers (
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

-- 12. POS Reservations
CREATE TABLE IF NOT EXISTS pos_reservations (
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

-- 13. POS Menu Modifiers
CREATE TABLE IF NOT EXISTS pos_menu_modifiers (
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

-- 14. POS Modifier Options
CREATE TABLE IF NOT EXISTS pos_modifier_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  modifier_id UUID NOT NULL REFERENCES pos_menu_modifiers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_adjustment DECIMAL(10,2) DEFAULT 0.00,
  is_default BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. POS Menu Item Modifiers (Link table)
CREATE TABLE IF NOT EXISTS pos_menu_item_modifiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID NOT NULL REFERENCES pos_menu_items(id) ON DELETE CASCADE,
  modifier_id UUID NOT NULL REFERENCES pos_menu_modifiers(id) ON DELETE CASCADE,
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. POS Menu Item Inventory (Link table)
CREATE TABLE IF NOT EXISTS pos_menu_item_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID NOT NULL REFERENCES pos_menu_items(id) ON DELETE CASCADE,
  inventory_item_id UUID NOT NULL REFERENCES pos_inventory(id) ON DELETE CASCADE,
  quantity_used DECIMAL(10,2) NOT NULL,
  unit TEXT DEFAULT 'unit',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. POS Inventory Transactions
CREATE TABLE IF NOT EXISTS pos_inventory_transactions (
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
  reference_id UUID,
  employee_id UUID REFERENCES pos_employees(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. POS Price History
CREATE TABLE IF NOT EXISTS pos_price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID NOT NULL REFERENCES pos_menu_items(id) ON DELETE CASCADE,
  old_price DECIMAL(10,2) NOT NULL,
  new_price DECIMAL(10,2) NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  reason TEXT,
  effective_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. POS Employee Permissions
CREATE TABLE IF NOT EXISTS pos_employee_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES pos_employees(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  granted_by UUID REFERENCES pos_employees(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, permission)
);

-- 20. POS Shift Breaks
CREATE TABLE IF NOT EXISTS pos_shift_breaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shift_id UUID NOT NULL REFERENCES pos_shifts(id) ON DELETE CASCADE,
  break_start TIMESTAMPTZ NOT NULL,
  break_end TIMESTAMPTZ,
  break_type TEXT DEFAULT 'regular' CHECK (break_type IN ('regular', 'meal', 'smoke')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. POS Employee Schedule
CREATE TABLE IF NOT EXISTS pos_employee_schedule (
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

-- 22. POS Discounts
CREATE TABLE IF NOT EXISTS pos_discounts (
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
  applicable_items JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. POS Audit Logs
CREATE TABLE IF NOT EXISTS pos_audit_logs (
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

-- 24. POS Cash Drawer Sessions
CREATE TABLE IF NOT EXISTS pos_cash_drawer_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES pos_venues(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES pos_employees(id) ON DELETE CASCADE,
  shift_id UUID REFERENCES pos_shifts(id),
  opening_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  closing_amount DECIMAL(10,2),
  expected_amount DECIMAL(10,2),
  variance DECIMAL(10,2),
  opened_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ,
  notes TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'reconciled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 25. POS Refunds
CREATE TABLE IF NOT EXISTS pos_refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES pos_venues(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES pos_orders(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES pos_payments(id),
  employee_id UUID NOT NULL REFERENCES pos_employees(id),
  manager_id UUID REFERENCES pos_employees(id),
  amount DECIMAL(10,2) NOT NULL,
  reason TEXT NOT NULL,
  refund_method TEXT NOT NULL CHECK (refund_method IN ('cash', 'credit_card', 'store_credit')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'completed', 'denied')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 26. POS Tax Rates
CREATE TABLE IF NOT EXISTS pos_tax_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES pos_venues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rate DECIMAL(5,2) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 27. POS Printer Logs
CREATE TABLE IF NOT EXISTS pos_printer_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES pos_venues(id) ON DELETE CASCADE,
  printer_type TEXT NOT NULL CHECK (printer_type IN ('receipt', 'kitchen', 'bar', 'label')),
  order_id UUID REFERENCES pos_orders(id),
  employee_id UUID REFERENCES pos_employees(id),
  content TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'printed', 'failed')),
  error_message TEXT,
  printed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 28. POS Tips
CREATE TABLE IF NOT EXISTS pos_tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES pos_venues(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES pos_orders(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES pos_employees(id),
  shift_id UUID REFERENCES pos_shifts(id),
  tip_amount DECIMAL(10,2) NOT NULL,
  tip_type TEXT NOT NULL CHECK (tip_type IN ('cash', 'card', 'auto_gratuity')),
  is_pooled BOOLEAN DEFAULT false,
  distributed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 29. POS Order Status History
CREATE TABLE IF NOT EXISTS pos_order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES pos_orders(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  changed_by UUID REFERENCES pos_employees(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 30. POS Notifications
CREATE TABLE IF NOT EXISTS pos_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES pos_venues(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('low_stock', 'order_ready', 'employee_late', 'cash_drawer_variance', 'system_alert')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  reference_id UUID,
  is_read BOOLEAN DEFAULT false,
  read_by UUID REFERENCES auth.users(id),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Venues
CREATE INDEX idx_pos_venues_owner_id ON pos_venues(owner_id);
CREATE INDEX idx_pos_venues_is_active ON pos_venues(is_active);

-- Employees
CREATE INDEX idx_pos_employees_venue_id ON pos_employees(venue_id);
CREATE INDEX idx_pos_employees_pin_code ON pos_employees(pin_code);
CREATE INDEX idx_pos_employees_role ON pos_employees(role);
CREATE INDEX idx_pos_employees_is_active ON pos_employees(is_active);

-- Shifts
CREATE INDEX idx_pos_shifts_venue_id ON pos_shifts(venue_id);
CREATE INDEX idx_pos_shifts_employee_id ON pos_shifts(employee_id);
CREATE INDEX idx_pos_shifts_status ON pos_shifts(status);
CREATE INDEX idx_pos_shifts_clock_in ON pos_shifts(clock_in);

-- Menu Categories
CREATE INDEX idx_pos_menu_categories_venue_id ON pos_menu_categories(venue_id);
CREATE INDEX idx_pos_menu_categories_sort_order ON pos_menu_categories(sort_order);

-- Menu Items
CREATE INDEX idx_pos_menu_items_venue_id ON pos_menu_items(venue_id);
CREATE INDEX idx_pos_menu_items_category_id ON pos_menu_items(category_id);
CREATE INDEX idx_pos_menu_items_is_available ON pos_menu_items(is_available);
CREATE INDEX idx_pos_menu_items_is_active ON pos_menu_items(is_active);

-- Orders
CREATE INDEX idx_pos_orders_venue_id ON pos_orders(venue_id);
CREATE INDEX idx_pos_orders_order_number ON pos_orders(order_number);
CREATE INDEX idx_pos_orders_employee_id ON pos_orders(employee_id);
CREATE INDEX idx_pos_orders_shift_id ON pos_orders(shift_id);
CREATE INDEX idx_pos_orders_status ON pos_orders(status);
CREATE INDEX idx_pos_orders_payment_status ON pos_orders(payment_status);
CREATE INDEX idx_pos_orders_created_at ON pos_orders(created_at);
CREATE INDEX idx_pos_orders_order_type ON pos_orders(order_type);

-- Order Items
CREATE INDEX idx_pos_order_items_order_id ON pos_order_items(order_id);
CREATE INDEX idx_pos_order_items_menu_item_id ON pos_order_items(menu_item_id);
CREATE INDEX idx_pos_order_items_status ON pos_order_items(status);

-- Inventory
CREATE INDEX idx_pos_inventory_venue_id ON pos_inventory(venue_id);
CREATE INDEX idx_pos_inventory_category ON pos_inventory(category);
CREATE INDEX idx_pos_inventory_is_active ON pos_inventory(is_active);

-- Payments
CREATE INDEX idx_pos_payments_venue_id ON pos_payments(venue_id);
CREATE INDEX idx_pos_payments_order_id ON pos_payments(order_id);
CREATE INDEX idx_pos_payments_employee_id ON pos_payments(employee_id);
CREATE INDEX idx_pos_payments_shift_id ON pos_payments(shift_id);
CREATE INDEX idx_pos_payments_created_at ON pos_payments(created_at);

-- Tables
CREATE INDEX idx_pos_tables_venue_id ON pos_tables(venue_id);
CREATE INDEX idx_pos_tables_status ON pos_tables(status);

-- Customers
CREATE INDEX idx_pos_customers_venue_id ON pos_customers(venue_id);
CREATE INDEX idx_pos_customers_email ON pos_customers(email);
CREATE INDEX idx_pos_customers_phone ON pos_customers(phone);

-- Inventory Transactions
CREATE INDEX idx_pos_inventory_transactions_venue_id ON pos_inventory_transactions(venue_id);
CREATE INDEX idx_pos_inventory_transactions_inventory_item_id ON pos_inventory_transactions(inventory_item_id);
CREATE INDEX idx_pos_inventory_transactions_transaction_type ON pos_inventory_transactions(transaction_type);
CREATE INDEX idx_pos_inventory_transactions_created_at ON pos_inventory_transactions(created_at);

-- Audit Logs
CREATE INDEX idx_pos_audit_logs_venue_id ON pos_audit_logs(venue_id);
CREATE INDEX idx_pos_audit_logs_employee_id ON pos_audit_logs(employee_id);
CREATE INDEX idx_pos_audit_logs_entity_type ON pos_audit_logs(entity_type);
CREATE INDEX idx_pos_audit_logs_created_at ON pos_audit_logs(created_at);

-- ============================================================================
-- TRIGGERS FOR AUTOMATED UPDATES
-- ============================================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables that have the column
CREATE TRIGGER update_pos_venues_updated_at BEFORE UPDATE ON pos_venues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pos_employees_updated_at BEFORE UPDATE ON pos_employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pos_shifts_updated_at BEFORE UPDATE ON pos_shifts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pos_menu_categories_updated_at BEFORE UPDATE ON pos_menu_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pos_menu_items_updated_at BEFORE UPDATE ON pos_menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pos_orders_updated_at BEFORE UPDATE ON pos_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pos_order_items_updated_at BEFORE UPDATE ON pos_order_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pos_inventory_updated_at BEFORE UPDATE ON pos_inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pos_payments_updated_at BEFORE UPDATE ON pos_payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pos_tables_updated_at BEFORE UPDATE ON pos_tables FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pos_customers_updated_at BEFORE UPDATE ON pos_customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pos_reservations_updated_at BEFORE UPDATE ON pos_reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pos_employee_schedule_updated_at BEFORE UPDATE ON pos_employee_schedule FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pos_refunds_updated_at BEFORE UPDATE ON pos_refunds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate order number automatically
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  venue_settings JSONB;
  number_format TEXT;
  next_number INTEGER;
  formatted_number TEXT;
BEGIN
  -- Get venue settings
  SELECT settings INTO venue_settings FROM pos_venues WHERE id = NEW.venue_id;

  -- Get number format (default: ORD-####)
  number_format := COALESCE(venue_settings->'orders'->>'numberFormat', 'ORD-####');

  -- Get next number for today
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM '[0-9]+$') AS INTEGER)), 0) + 1
  INTO next_number
  FROM pos_orders
  WHERE venue_id = NEW.venue_id
  AND DATE(created_at) = CURRENT_DATE;

  -- Format the number
  formatted_number := REPLACE(number_format, '####', LPAD(next_number::TEXT, 4, '0'));

  NEW.order_number := formatted_number;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_order_number_trigger
BEFORE INSERT ON pos_orders
FOR EACH ROW
WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
EXECUTE FUNCTION generate_order_number();

-- Calculate order totals automatically
CREATE OR REPLACE FUNCTION calculate_order_totals()
RETURNS TRIGGER AS $$
DECLARE
  venue_tax_rate DECIMAL(5,2);
BEGIN
  -- Get tax rate from venue
  SELECT tax_rate INTO venue_tax_rate FROM pos_venues WHERE id = NEW.venue_id;

  -- Calculate tax if not provided
  IF NEW.tax IS NULL OR NEW.tax = 0 THEN
    NEW.tax := ROUND((NEW.subtotal * venue_tax_rate / 100), 2);
  END IF;

  -- Calculate total
  NEW.total := NEW.subtotal + NEW.tax + COALESCE(NEW.tip, 0) - COALESCE(NEW.discount, 0);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_order_totals_trigger
BEFORE INSERT OR UPDATE ON pos_orders
FOR EACH ROW
EXECUTE FUNCTION calculate_order_totals();

-- Track order status changes
CREATE OR REPLACE FUNCTION track_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO pos_order_status_history (order_id, from_status, to_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, NEW.employee_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_order_status_change_trigger
AFTER UPDATE ON pos_orders
FOR EACH ROW
EXECUTE FUNCTION track_order_status_change();

-- Update shift totals when orders are completed
CREATE OR REPLACE FUNCTION update_shift_totals()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.payment_status IS DISTINCT FROM NEW.payment_status AND NEW.payment_status = 'paid' THEN
    UPDATE pos_shifts
    SET total_sales = total_sales + NEW.total,
        total_orders = total_orders + 1
    WHERE id = NEW.shift_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_shift_totals_trigger
AFTER UPDATE ON pos_orders
FOR EACH ROW
WHEN (NEW.shift_id IS NOT NULL)
EXECUTE FUNCTION update_shift_totals();

-- Deduct inventory when order is completed
CREATE OR REPLACE FUNCTION deduct_inventory_on_order()
RETURNS TRIGGER AS $$
DECLARE
  mapping RECORD;
  total_used DECIMAL(10,2);
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'completed' THEN
    -- Loop through order items
    FOR item IN SELECT * FROM pos_order_items WHERE order_id = NEW.id LOOP
      -- Get inventory mappings for this menu item
      FOR mapping IN
        SELECT * FROM pos_menu_item_inventory WHERE menu_item_id = item.menu_item_id
      LOOP
        total_used := mapping.quantity_used * item.quantity;

        -- Update inventory quantity
        UPDATE pos_inventory
        SET current_quantity = current_quantity - total_used
        WHERE id = mapping.inventory_item_id;

        -- Log the transaction
        INSERT INTO pos_inventory_transactions (
          venue_id, inventory_item_id, transaction_type,
          quantity_change, quantity_before, quantity_after,
          reference_id, employee_id
        )
        SELECT
          NEW.venue_id,
          mapping.inventory_item_id,
          'sale',
          -total_used,
          current_quantity + total_used,
          current_quantity,
          NEW.id,
          NEW.employee_id
        FROM pos_inventory
        WHERE id = mapping.inventory_item_id;
      END LOOP;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER deduct_inventory_on_order_trigger
AFTER UPDATE ON pos_orders
FOR EACH ROW
EXECUTE FUNCTION deduct_inventory_on_order();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE pos_venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_menu_modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_modifier_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_menu_item_modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_menu_item_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_employee_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_shift_breaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_employee_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_cash_drawer_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_tax_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_printer_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_notifications ENABLE ROW LEVEL SECURITY;

-- Venues: Users can only see/manage their own venues
CREATE POLICY "Users can view own venues"
  ON pos_venues FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own venues"
  ON pos_venues FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own venues"
  ON pos_venues FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own venues"
  ON pos_venues FOR DELETE
  USING (auth.uid() = owner_id);

-- Employees: Can view/manage employees at their venue
CREATE POLICY "View employees at own venue"
  ON pos_employees FOR SELECT
  USING (
    venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())
  );

CREATE POLICY "Insert employees at own venue"
  ON pos_employees FOR INSERT
  WITH CHECK (
    venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())
  );

CREATE POLICY "Update employees at own venue"
  ON pos_employees FOR UPDATE
  USING (
    venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())
  );

CREATE POLICY "Delete employees at own venue"
  ON pos_employees FOR DELETE
  USING (
    venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())
  );

-- Generic RLS policy for venue-scoped tables
-- (Apply similar policies to all other tables)

CREATE POLICY "View data at own venue" ON pos_shifts FOR SELECT USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Insert data at own venue" ON pos_shifts FOR INSERT WITH CHECK (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Update data at own venue" ON pos_shifts FOR UPDATE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Delete data at own venue" ON pos_shifts FOR DELETE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));

CREATE POLICY "View data at own venue" ON pos_menu_categories FOR SELECT USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Insert data at own venue" ON pos_menu_categories FOR INSERT WITH CHECK (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Update data at own venue" ON pos_menu_categories FOR UPDATE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Delete data at own venue" ON pos_menu_categories FOR DELETE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));

CREATE POLICY "View data at own venue" ON pos_menu_items FOR SELECT USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Insert data at own venue" ON pos_menu_items FOR INSERT WITH CHECK (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Update data at own venue" ON pos_menu_items FOR UPDATE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Delete data at own venue" ON pos_menu_items FOR DELETE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));

CREATE POLICY "View data at own venue" ON pos_orders FOR SELECT USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Insert data at own venue" ON pos_orders FOR INSERT WITH CHECK (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Update data at own venue" ON pos_orders FOR UPDATE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Delete data at own venue" ON pos_orders FOR DELETE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));

CREATE POLICY "View data at own venue" ON pos_inventory FOR SELECT USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Insert data at own venue" ON pos_inventory FOR INSERT WITH CHECK (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Update data at own venue" ON pos_inventory FOR UPDATE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Delete data at own venue" ON pos_inventory FOR DELETE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));

CREATE POLICY "View data at own venue" ON pos_payments FOR SELECT USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Insert data at own venue" ON pos_payments FOR INSERT WITH CHECK (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Update data at own venue" ON pos_payments FOR UPDATE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Delete data at own venue" ON pos_payments FOR DELETE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));

CREATE POLICY "View data at own venue" ON pos_tables FOR SELECT USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Insert data at own venue" ON pos_tables FOR INSERT WITH CHECK (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Update data at own venue" ON pos_tables FOR UPDATE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Delete data at own venue" ON pos_tables FOR DELETE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));

CREATE POLICY "View data at own venue" ON pos_customers FOR SELECT USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Insert data at own venue" ON pos_customers FOR INSERT WITH CHECK (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Update data at own venue" ON pos_customers FOR UPDATE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Delete data at own venue" ON pos_customers FOR DELETE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));

CREATE POLICY "View data at own venue" ON pos_reservations FOR SELECT USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Insert data at own venue" ON pos_reservations FOR INSERT WITH CHECK (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Update data at own venue" ON pos_reservations FOR UPDATE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Delete data at own venue" ON pos_reservations FOR DELETE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));

CREATE POLICY "View data at own venue" ON pos_menu_modifiers FOR SELECT USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Insert data at own venue" ON pos_menu_modifiers FOR INSERT WITH CHECK (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Update data at own venue" ON pos_menu_modifiers FOR UPDATE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Delete data at own venue" ON pos_menu_modifiers FOR DELETE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));

CREATE POLICY "View data at own venue" ON pos_inventory_transactions FOR SELECT USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Insert data at own venue" ON pos_inventory_transactions FOR INSERT WITH CHECK (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));

CREATE POLICY "View data at own venue" ON pos_employee_schedule FOR SELECT USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Insert data at own venue" ON pos_employee_schedule FOR INSERT WITH CHECK (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Update data at own venue" ON pos_employee_schedule FOR UPDATE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Delete data at own venue" ON pos_employee_schedule FOR DELETE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));

CREATE POLICY "View data at own venue" ON pos_discounts FOR SELECT USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Insert data at own venue" ON pos_discounts FOR INSERT WITH CHECK (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Update data at own venue" ON pos_discounts FOR UPDATE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Delete data at own venue" ON pos_discounts FOR DELETE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));

CREATE POLICY "View data at own venue" ON pos_audit_logs FOR SELECT USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Insert data at own venue" ON pos_audit_logs FOR INSERT WITH CHECK (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));

CREATE POLICY "View data at own venue" ON pos_cash_drawer_sessions FOR SELECT USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Insert data at own venue" ON pos_cash_drawer_sessions FOR INSERT WITH CHECK (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Update data at own venue" ON pos_cash_drawer_sessions FOR UPDATE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));

CREATE POLICY "View data at own venue" ON pos_refunds FOR SELECT USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Insert data at own venue" ON pos_refunds FOR INSERT WITH CHECK (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Update data at own venue" ON pos_refunds FOR UPDATE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));

CREATE POLICY "View data at own venue" ON pos_tax_rates FOR SELECT USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Insert data at own venue" ON pos_tax_rates FOR INSERT WITH CHECK (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Update data at own venue" ON pos_tax_rates FOR UPDATE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));

CREATE POLICY "View data at own venue" ON pos_printer_logs FOR SELECT USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Insert data at own venue" ON pos_printer_logs FOR INSERT WITH CHECK (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Update data at own venue" ON pos_printer_logs FOR UPDATE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));

CREATE POLICY "View data at own venue" ON pos_tips FOR SELECT USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Insert data at own venue" ON pos_tips FOR INSERT WITH CHECK (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Update data at own venue" ON pos_tips FOR UPDATE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));

CREATE POLICY "View data at own venue" ON pos_notifications FOR SELECT USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Insert data at own venue" ON pos_notifications FOR INSERT WITH CHECK (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));
CREATE POLICY "Update data at own venue" ON pos_notifications FOR UPDATE USING (venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid()));

-- Special policies for linked tables (order_items, modifier_options, etc.)
CREATE POLICY "View order items" ON pos_order_items FOR SELECT
  USING (order_id IN (SELECT id FROM pos_orders WHERE venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())));
CREATE POLICY "Insert order items" ON pos_order_items FOR INSERT
  WITH CHECK (order_id IN (SELECT id FROM pos_orders WHERE venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())));
CREATE POLICY "Update order items" ON pos_order_items FOR UPDATE
  USING (order_id IN (SELECT id FROM pos_orders WHERE venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())));
CREATE POLICY "Delete order items" ON pos_order_items FOR DELETE
  USING (order_id IN (SELECT id FROM pos_orders WHERE venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())));

CREATE POLICY "View modifier options" ON pos_modifier_options FOR SELECT
  USING (modifier_id IN (SELECT id FROM pos_menu_modifiers WHERE venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())));
CREATE POLICY "Insert modifier options" ON pos_modifier_options FOR INSERT
  WITH CHECK (modifier_id IN (SELECT id FROM pos_menu_modifiers WHERE venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())));
CREATE POLICY "Update modifier options" ON pos_modifier_options FOR UPDATE
  USING (modifier_id IN (SELECT id FROM pos_menu_modifiers WHERE venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())));
CREATE POLICY "Delete modifier options" ON pos_modifier_options FOR DELETE
  USING (modifier_id IN (SELECT id FROM pos_menu_modifiers WHERE venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())));

CREATE POLICY "View menu item modifiers" ON pos_menu_item_modifiers FOR SELECT
  USING (menu_item_id IN (SELECT id FROM pos_menu_items WHERE venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())));
CREATE POLICY "Insert menu item modifiers" ON pos_menu_item_modifiers FOR INSERT
  WITH CHECK (menu_item_id IN (SELECT id FROM pos_menu_items WHERE venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())));
CREATE POLICY "Delete menu item modifiers" ON pos_menu_item_modifiers FOR DELETE
  USING (menu_item_id IN (SELECT id FROM pos_menu_items WHERE venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())));

CREATE POLICY "View menu item inventory" ON pos_menu_item_inventory FOR SELECT
  USING (menu_item_id IN (SELECT id FROM pos_menu_items WHERE venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())));
CREATE POLICY "Insert menu item inventory" ON pos_menu_item_inventory FOR INSERT
  WITH CHECK (menu_item_id IN (SELECT id FROM pos_menu_items WHERE venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())));
CREATE POLICY "Delete menu item inventory" ON pos_menu_item_inventory FOR DELETE
  USING (menu_item_id IN (SELECT id FROM pos_menu_items WHERE venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())));

CREATE POLICY "View price history" ON pos_price_history FOR SELECT
  USING (menu_item_id IN (SELECT id FROM pos_menu_items WHERE venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())));
CREATE POLICY "Insert price history" ON pos_price_history FOR INSERT
  WITH CHECK (menu_item_id IN (SELECT id FROM pos_menu_items WHERE venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())));

CREATE POLICY "View employee permissions" ON pos_employee_permissions FOR SELECT
  USING (employee_id IN (SELECT id FROM pos_employees WHERE venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())));
CREATE POLICY "Insert employee permissions" ON pos_employee_permissions FOR INSERT
  WITH CHECK (employee_id IN (SELECT id FROM pos_employees WHERE venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())));
CREATE POLICY "Delete employee permissions" ON pos_employee_permissions FOR DELETE
  USING (employee_id IN (SELECT id FROM pos_employees WHERE venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())));

CREATE POLICY "View shift breaks" ON pos_shift_breaks FOR SELECT
  USING (shift_id IN (SELECT id FROM pos_shifts WHERE venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())));
CREATE POLICY "Insert shift breaks" ON pos_shift_breaks FOR INSERT
  WITH CHECK (shift_id IN (SELECT id FROM pos_shifts WHERE venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())));
CREATE POLICY "Update shift breaks" ON pos_shift_breaks FOR UPDATE
  USING (shift_id IN (SELECT id FROM pos_shifts WHERE venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())));

CREATE POLICY "View order status history" ON pos_order_status_history FOR SELECT
  USING (order_id IN (SELECT id FROM pos_orders WHERE venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())));
CREATE POLICY "Insert order status history" ON pos_order_status_history FOR INSERT
  WITH CHECK (order_id IN (SELECT id FROM pos_orders WHERE venue_id IN (SELECT id FROM pos_venues WHERE owner_id = auth.uid())));

-- ============================================================================
-- REALTIME PUBLICATION
-- ============================================================================

-- Enable realtime for critical tables
ALTER PUBLICATION supabase_realtime ADD TABLE pos_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE pos_order_items;
ALTER PUBLICATION supabase_realtime ADD TABLE pos_inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE pos_notifications;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to deduct inventory (called by trigger)
CREATE OR REPLACE FUNCTION deduct_inventory(
  p_inventory_id UUID,
  p_quantity DECIMAL(10,2),
  p_order_id UUID
)
RETURNS VOID AS $$
DECLARE
  current_qty DECIMAL(10,2);
BEGIN
  SELECT current_quantity INTO current_qty FROM pos_inventory WHERE id = p_inventory_id;

  UPDATE pos_inventory
  SET current_quantity = current_quantity - p_quantity
  WHERE id = p_inventory_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check low stock and create notifications
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TRIGGER AS $$
DECLARE
  venue RECORD;
  threshold DECIMAL(10,2);
BEGIN
  -- Get venue settings
  SELECT * INTO venue FROM pos_venues WHERE id = NEW.venue_id;
  threshold := COALESCE((venue.settings->'inventory'->>'lowStockThreshold')::DECIMAL, 20);

  -- Check if below threshold
  IF NEW.current_quantity <= NEW.minimum_quantity OR NEW.current_quantity <= threshold THEN
    INSERT INTO pos_notifications (
      venue_id, notification_type, priority, title, message, reference_id
    ) VALUES (
      NEW.venue_id,
      'low_stock',
      'high',
      'Low Stock Alert',
      'Inventory item "' || NEW.item_name || '" is running low (' || NEW.current_quantity || ' ' || NEW.unit || ' remaining)',
      NEW.id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_low_stock_trigger
AFTER INSERT OR UPDATE ON pos_inventory
FOR EACH ROW
EXECUTE FUNCTION check_low_stock();

-- ============================================================================
-- INITIAL SEED DATA (Optional)
-- ============================================================================

-- You can add seed data here for testing purposes
-- For example: default categories, sample menu items, etc.

-- ============================================================================
-- SCHEMA COMPLETE
-- ============================================================================
-- Total Tables: 30
-- Total Indexes: 40+
-- Total Triggers: 10+
-- Total Functions: 8+
-- RLS Policies: 100+
-- ============================================================================
