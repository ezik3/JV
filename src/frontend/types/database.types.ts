/**
 * Database Type Definitions
 * Generated for JoinVibe POS System
 * Version: 2.0
 * Last Updated: 2025-11-18
 *
 * These types match the Supabase database schema.
 * Import and use these types throughout the application for type safety.
 */

// =============================================
// Core Database Types
// =============================================

export interface Database {
  public: {
    Tables: {
      venues: {
        Row: Venue;
        Insert: VenueInsert;
        Update: VenueUpdate;
      };
      employees: {
        Row: Employee;
        Insert: EmployeeInsert;
        Update: EmployeeUpdate;
      };
      employee_shifts: {
        Row: EmployeeShift;
        Insert: EmployeeShiftInsert;
        Update: EmployeeShiftUpdate;
      };
      menu_categories: {
        Row: MenuCategory;
        Insert: MenuCategoryInsert;
        Update: MenuCategoryUpdate;
      };
      menu_items: {
        Row: MenuItem;
        Insert: MenuItemInsert;
        Update: MenuItemUpdate;
      };
      orders: {
        Row: Order;
        Insert: OrderInsert;
        Update: OrderUpdate;
      };
      order_items: {
        Row: OrderItem;
        Insert: OrderItemInsert;
        Update: OrderItemUpdate;
      };
      payments: {
        Row: Payment;
        Insert: PaymentInsert;
        Update: PaymentUpdate;
      };
      kitchen_display_settings: {
        Row: KitchenDisplaySettings;
        Insert: KitchenDisplaySettingsInsert;
        Update: KitchenDisplaySettingsUpdate;
      };
      inventory_transactions: {
        Row: InventoryTransaction;
        Insert: InventoryTransactionInsert;
        Update: InventoryTransactionUpdate;
      };
      discounts: {
        Row: Discount;
        Insert: DiscountInsert;
        Update: DiscountUpdate;
      };
    };
    Views: {
      order_summary: {
        Row: OrderSummary;
      };
      daily_sales: {
        Row: DailySales;
      };
      menu_item_performance: {
        Row: MenuItemPerformance;
      };
    };
  };
}

// =============================================
// Venue Types
// =============================================

export interface Venue {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string;
  phone: string | null;
  email: string | null;

  // Manager/Owner info
  manager_id: string | null;
  manager_name: string | null;
  manager_email: string | null;

  // Payment Configuration
  payment_account_id: string | null;
  payment_provider: string;
  crypto_wallet_address: string | null;

  // Settings
  currency: string;
  timezone: string;
  tax_rate: number;
  service_charge_rate: number;

  // Features
  accepts_crypto: boolean;
  accepts_vibe_token: boolean;
  kitchen_display_enabled: boolean;
  table_management_enabled: boolean;

  // Metadata
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export type VenueInsert = Omit<Venue, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type VenueUpdate = Partial<VenueInsert>;

// =============================================
// Employee Types
// =============================================

export type EmployeeRole = 'manager' | 'server' | 'kitchen' | 'bartender';

export interface Employee {
  id: string;
  venue_id: string;

  // Employee Info
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;

  // Authentication
  pin_code: string | null;
  password_hash: string | null;

  // Role & Permissions
  role: EmployeeRole;
  permissions: string[];

  // Employment Info
  hire_date: string | null;
  hourly_rate: number | null;

  // Status
  is_active: boolean;
  is_clocked_in: boolean;

  // Metadata
  created_at: string;
  updated_at: string;
}

export type EmployeeInsert = Omit<Employee, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type EmployeeUpdate = Partial<EmployeeInsert>;

// Helper type for employee with full name
export interface EmployeeWithName extends Employee {
  full_name: string;
}

// =============================================
// Employee Shift Types
// =============================================

export interface EmployeeShift {
  id: string;
  employee_id: string;
  venue_id: string;

  // Shift Times
  start_time: string;
  end_time: string | null;

  // Shift Info
  break_duration_minutes: number;
  notes: string | null;

  // Metadata
  created_at: string;
  updated_at: string;
}

export type EmployeeShiftInsert = Omit<EmployeeShift, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type EmployeeShiftUpdate = Partial<EmployeeShiftInsert>;

// =============================================
// Menu Category Types
// =============================================

export interface MenuCategory {
  id: string;
  venue_id: string;

  // Category Info
  name: string;
  description: string | null;
  display_order: number;
  icon: string | null;
  color: string | null;

  // Status
  is_active: boolean;

  // Metadata
  created_at: string;
  updated_at: string;
}

export type MenuCategoryInsert = Omit<MenuCategory, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type MenuCategoryUpdate = Partial<MenuCategoryInsert>;

// =============================================
// Menu Item Types
// =============================================

export interface MenuItemModifier {
  id: string;
  name: string;
  price: number;
  required?: boolean;
}

export interface MenuItemModifierGroup {
  id: string;
  name: string;
  required: boolean;
  multiple: boolean;
  options: MenuItemModifier[];
}

export interface MenuItem {
  id: string;
  venue_id: string;
  category_id: string | null;

  // Item Info
  name: string;
  description: string | null;
  sku: string | null;
  barcode: string | null;

  // Pricing
  price: number;
  cost: number | null;

  // Display
  image_url: string | null;
  icon: string | null;
  display_order: number;

  // Inventory
  track_inventory: boolean;
  stock_quantity: number;
  low_stock_threshold: number;

  // Attributes
  is_available: boolean;
  is_featured: boolean;
  is_alcohol: boolean;

  // Modifiers & Options
  modifiers: MenuItemModifierGroup[];

  // Metadata
  created_at: string;
  updated_at: string;
}

export type MenuItemInsert = Omit<MenuItem, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type MenuItemUpdate = Partial<MenuItemInsert>;

// Menu item with category info
export interface MenuItemWithCategory extends MenuItem {
  category?: MenuCategory;
}

// =============================================
// Order Types
// =============================================

export type OrderType = 'dine-in' | 'takeout' | 'delivery';
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'partially_refunded';
export type PaymentMethod = 'cash' | 'card' | 'crypto' | 'vibe_token';

export interface Order {
  id: string;
  venue_id: string;
  employee_id: string | null;

  // Order Info
  order_number: string;
  order_type: OrderType;

  // Customer Info
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  table_number: string | null;

  // Status
  status: OrderStatus;

  // Financial
  subtotal: number;
  tax_amount: number;
  service_charge: number;
  discount_amount: number;
  tip_amount: number;
  total_amount: number;

  // Payment
  payment_status: PaymentStatus;
  payment_method: PaymentMethod | null;

  // Notes
  notes: string | null;
  special_instructions: string | null;

  // Timestamps
  ordered_at: string;
  preparing_at: string | null;
  ready_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;

  // Metadata
  created_at: string;
  updated_at: string;
}

export type OrderInsert = Omit<Order, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type OrderUpdate = Partial<OrderInsert>;

// Order with items and employee info
export interface OrderWithDetails extends Order {
  order_items?: OrderItem[];
  employee?: Employee;
  item_count?: number;
}

// =============================================
// Order Item Types
// =============================================

export type OrderItemStatus = 'pending' | 'preparing' | 'ready' | 'served';

export interface SelectedModifier {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;

  // Item Info (snapshot at time of order)
  item_name: string;
  item_price: number;
  quantity: number;

  // Modifiers & Options
  modifiers: SelectedModifier[];
  special_instructions: string | null;

  // Calculated
  subtotal: number;

  // Status
  status: OrderItemStatus;

  // Kitchen
  prepared_by: string | null;
  prepared_at: string | null;

  // Metadata
  created_at: string;
  updated_at: string;
}

export type OrderItemInsert = Omit<OrderItem, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type OrderItemUpdate = Partial<OrderItemInsert>;

// Order item with menu item info
export interface OrderItemWithMenuItem extends OrderItem {
  menu_item?: MenuItem;
}

// =============================================
// Payment Types
// =============================================

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  order_id: string;
  venue_id: string;
  employee_id: string | null;

  // Payment Info
  amount: number;
  payment_method: PaymentMethod;
  payment_provider: string | null;

  // Transaction Details
  transaction_id: string | null;
  transaction_status: TransactionStatus;

  // Payment Method Specific
  card_last4: string | null;
  card_brand: string | null;
  crypto_currency: string | null;
  crypto_tx_hash: string | null;
  crypto_wallet_address: string | null;

  // Routing
  routed_to_account: string | null;

  // Metadata
  payment_metadata: Record<string, any>;
  notes: string | null;

  // Timestamps
  paid_at: string;
  refunded_at: string | null;

  // Metadata
  created_at: string;
  updated_at: string;
}

export type PaymentInsert = Omit<Payment, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type PaymentUpdate = Partial<PaymentInsert>;

// =============================================
// Kitchen Display Settings Types
// =============================================

export type ViewMode = 'card' | 'list' | 'kanban';
export type SortBy = 'ordered_at' | 'priority' | 'order_type';
export type SortDirection = 'asc' | 'desc';

export interface KitchenDisplaySettings {
  id: string;
  venue_id: string;

  // View Settings
  default_view_mode: ViewMode;
  sort_by: SortBy;
  sort_direction: SortDirection;

  // Display Settings
  auto_refresh_interval: number; // seconds
  show_completed_orders: boolean;
  completed_orders_duration: number; // seconds

  // Filters
  filter_by_order_type: OrderType[];

  // Alerts
  alert_on_new_order: boolean;
  alert_sound_enabled: boolean;

  // Metadata
  created_at: string;
  updated_at: string;
}

export type KitchenDisplaySettingsInsert = Omit<KitchenDisplaySettings, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type KitchenDisplaySettingsUpdate = Partial<KitchenDisplaySettingsInsert>;

// =============================================
// Inventory Transaction Types
// =============================================

export type InventoryTransactionType = 'sale' | 'restock' | 'adjustment' | 'waste';

export interface InventoryTransaction {
  id: string;
  venue_id: string;
  menu_item_id: string;
  employee_id: string | null;

  // Transaction Info
  transaction_type: InventoryTransactionType;
  quantity: number;
  previous_quantity: number;
  new_quantity: number;

  // Reference
  order_item_id: string | null;
  notes: string | null;

  // Metadata
  created_at: string;
}

export type InventoryTransactionInsert = Omit<InventoryTransaction, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type InventoryTransactionUpdate = Partial<InventoryTransactionInsert>;

// =============================================
// Discount Types
// =============================================

export type DiscountType = 'percentage' | 'fixed_amount' | 'free_item';

export interface Discount {
  id: string;
  venue_id: string;

  // Discount Info
  code: string;
  name: string;
  description: string | null;

  // Type & Value
  discount_type: DiscountType;
  discount_value: number;

  // Conditions
  min_order_amount: number | null;
  max_discount_amount: number | null;
  applicable_items: string[]; // Array of menu_item_ids

  // Validity
  start_date: string | null;
  end_date: string | null;
  max_uses: number | null;
  current_uses: number;

  // Status
  is_active: boolean;

  // Metadata
  created_at: string;
  updated_at: string;
}

export type DiscountInsert = Omit<Discount, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type DiscountUpdate = Partial<DiscountInsert>;

// =============================================
// View Types
// =============================================

export interface OrderSummary {
  id: string;
  order_number: string;
  order_type: OrderType;
  status: OrderStatus;
  total_amount: number;
  payment_status: PaymentStatus;
  ordered_at: string;
  venue_name: string;
  employee_name: string | null;
  item_count: number;
}

export interface DailySales {
  venue_id: string;
  venue_name: string;
  sale_date: string;
  order_count: number;
  subtotal: number;
  tax: number;
  service_charge: number;
  tips: number;
  total_revenue: number;
}

export interface MenuItemPerformance {
  id: string;
  name: string;
  category_id: string | null;
  category_name: string | null;
  price: number;
  times_ordered: number;
  total_quantity_sold: number;
  total_revenue: number;
  avg_order_value: number;
}

// =============================================
// Helper Types & Utilities
// =============================================

// Cart item (used in POS before creating order)
export interface CartItem {
  menu_item: MenuItem;
  quantity: number;
  selected_modifiers: SelectedModifier[];
  special_instructions: string;
  subtotal: number;
}

// Kitchen display order (with additional computed fields)
export interface KitchenOrder extends OrderWithDetails {
  elapsed_time: number; // minutes since ordered
  priority: 'normal' | 'high' | 'urgent';
}

// Analytics data types
export interface SalesMetrics {
  total_revenue: number;
  total_orders: number;
  average_order_value: number;
  total_tax: number;
  total_tips: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface CategorySales {
  category_name: string;
  revenue: number;
  percentage: number;
}

// Form types for creating entities
export interface CreateVenueForm {
  name: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  email: string;
  manager_name: string;
  manager_email: string;
  tax_rate: number;
  service_charge_rate: number;
}

export interface CreateEmployeeForm {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  pin_code: string;
  role: EmployeeRole;
  hourly_rate: number;
}

export interface CreateMenuItemForm {
  name: string;
  description: string;
  category_id: string;
  price: number;
  icon: string;
  track_inventory: boolean;
  stock_quantity: number;
  is_available: boolean;
}

// Filter and sort options
export interface OrderFilters {
  status?: OrderStatus[];
  order_type?: OrderType[];
  payment_status?: PaymentStatus[];
  date_from?: string;
  date_to?: string;
}

export interface OrderSort {
  field: keyof Order;
  direction: 'asc' | 'desc';
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// =============================================
// Type Guards
// =============================================

export function isEmployee(obj: any): obj is Employee {
  return obj && typeof obj.id === 'string' && typeof obj.venue_id === 'string' && typeof obj.role === 'string';
}

export function isOrder(obj: any): obj is Order {
  return obj && typeof obj.id === 'string' && typeof obj.order_number === 'string';
}

export function isMenuItem(obj: any): obj is MenuItem {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string' && typeof obj.price === 'number';
}

// =============================================
// Constants
// =============================================

export const ORDER_STATUSES: OrderStatus[] = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
export const ORDER_TYPES: OrderType[] = ['dine-in', 'takeout', 'delivery'];
export const PAYMENT_METHODS: PaymentMethod[] = ['cash', 'card', 'crypto', 'vibe_token'];
export const EMPLOYEE_ROLES: EmployeeRole[] = ['manager', 'server', 'kitchen', 'bartender'];
export const VIEW_MODES: ViewMode[] = ['card', 'list', 'kanban'];

// =============================================
// Export all types
// =============================================

export type {
  Database,
  // Re-export for convenience
  Venue, VenueInsert, VenueUpdate,
  Employee, EmployeeInsert, EmployeeUpdate,
  EmployeeShift, EmployeeShiftInsert, EmployeeShiftUpdate,
  MenuCategory, MenuCategoryInsert, MenuCategoryUpdate,
  MenuItem, MenuItemInsert, MenuItemUpdate,
  Order, OrderInsert, OrderUpdate,
  OrderItem, OrderItemInsert, OrderItemUpdate,
  Payment, PaymentInsert, PaymentUpdate,
  KitchenDisplaySettings, KitchenDisplaySettingsInsert, KitchenDisplaySettingsUpdate,
  InventoryTransaction, InventoryTransactionInsert, InventoryTransactionUpdate,
  Discount, DiscountInsert, DiscountUpdate,
};
