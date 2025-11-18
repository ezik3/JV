// =====================================================
// JOINTVIBE POS V2 - TYPESCRIPT TYPE DEFINITIONS
// =====================================================
// AGENT INSTRUCTIONS:
// 1. These types MUST match database/complete-schema.sql exactly
// 2. Do NOT modify without updating schema
// 3. All changes must be documented
// =====================================================

// Enums
export type AppRole = 'admin' | 'manager' | 'staff' | 'kitchen' | 'bartender' | 'waiter' | 'host';
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
export type OrderType = 'dine_in' | 'pickup' | 'delivery';
export type PaymentMethod = 'cash' | 'card' | 'mobile' | 'jvcoin';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type TableStatus = 'available' | 'occupied' | 'reserved';
export type ShiftStatus = 'active' | 'break' | 'ended';
export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired';
export type NotificationStatus = 'draft' | 'scheduled' | 'sent' | 'cancelled';
export type StockStatus = 'good' | 'low' | 'critical';

// Database Tables
export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Venue {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  owner_id: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  operating_hours: Record<string, { open: string; close: string }> | null;
  tax_rate: number;
  currency: string;
  timezone: string;
  is_active: boolean;
  pos_initialized: boolean;
  created_at: string;
  updated_at: string;
}

export interface VenueSetting {
  id: string;
  venue_id: string;
  setting_key: string;
  setting_value: any;
  updated_at: string;
}

// Employee Management (V2)
export interface EmployeeInvitation {
  id: string;
  venue_id: string;
  employee_email: string;
  invited_by: string;
  role: AppRole;
  permissions: Record<string, boolean>;
  status: InvitationStatus;
  invitation_token: string;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
}

export interface EmployeeVenueLink {
  id: string;
  user_id: string;
  venue_id: string;
  role: AppRole;
  permissions: Record<string, boolean>;
  is_active: boolean;
  hired_date: string;
  terminated_date: string | null;
  created_at: string;
}

export interface EmployeeShift {
  id: string;
  employee_id: string;
  venue_id: string;
  clock_in_time: string;
  clock_out_time: string | null;
  total_sales: number;
  orders_served: number;
  status: ShiftStatus;
  created_at: string;
}

// Venue Check-ins (V2)
export interface VenueCheckIn {
  id: string;
  user_id: string;
  venue_id: string;
  check_in_time: string;
  check_out_time: string | null;
  latitude: number | null;
  longitude: number | null;
  table_number: string | null;
  is_visible_to_guests: boolean;
  status: string;
  created_at: string;
}

export interface GuestMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  venue_id: string;
  message_text: string;
  read_at: string | null;
  created_at: string;
}

export interface WaiterCall {
  id: string;
  user_id: string;
  venue_id: string;
  table_number: string | null;
  request_type: 'call_waiter' | 'request_bill' | 'assistance';
  notes: string | null;
  status: 'pending' | 'acknowledged' | 'completed';
  assigned_to: string | null;
  created_at: string;
  completed_at: string | null;
}

// Floorplan & Tables
export interface Floorplan {
  id: string;
  venue_id: string;
  name: string;
  canvas_width: number;
  canvas_height: number;
  items: FloorplanItem[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface FloorplanItem {
  type: 'table' | 'wall' | 'bar' | 'decoration';
  id?: string;
  tableId?: string;
  x: number;
  y: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  width?: number;
  height?: number;
  rotation?: number;
  tableNumber?: string;
  capacity?: number;
  section?: string;
}

export interface VenueTable {
  id: string;
  venue_id: string;
  table_number: string;
  capacity: number;
  section: string | null;
  status: TableStatus;
  x_position: number | null;
  y_position: number | null;
  floorplan_id: string | null;
  qr_code_url: string | null;
  created_at: string;
  updated_at: string;
}

// Menu Management
export interface MenuCategory {
  id: string;
  venue_id: string;
  name: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface MenuItem {
  id: string;
  venue_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  cost: number | null;
  image_url: string | null;
  station: 'kitchen' | 'bar' | 'expo';
  preparation_time: number;
  modifiers: MenuItemModifier[] | null;
  allergens: string[] | null;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface MenuItemModifier {
  name: string;
  options: string[];
  required: boolean;
  priceModifier?: number;
}

// Orders & Payments
export interface Order {
  id: string;
  order_number: number;
  venue_id: string;
  table_id: string | null;
  table_number: string | null;
  customer_name: string | null;
  customer_id: string | null;
  status: OrderStatus;
  order_type: OrderType;
  station: string | null;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  notes: string | null;

  // V2: Remote ordering fields
  pickup_time: string | null;
  delivery_address: DeliveryAddress | null;
  delivery_instructions: string | null;
  delivery_fee: number;
  estimated_ready_time: string | null;
  estimated_delivery_time: string | null;
  confirmation_code: string | null;

  // Pricing
  subtotal: number;
  tax: number;
  tip: number;
  discount: number;
  total: number;

  // Staff tracking
  staff_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DeliveryAddress {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zip_code: string;
  latitude?: number;
  longitude?: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  name: string;
  quantity: number;
  price: number;
  modifiers: Record<string, any> | null;
  notes: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  venue_id: string;
  amount: number;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  transaction_id: string | null;
  staff_id: string | null;
  created_at: string;
}

// Reservations (V2)
export interface Reservation {
  id: string;
  user_id: string;
  venue_id: string;
  reservation_time: string;
  party_size: number;
  table_id: string | null;
  special_occasion: string | null;
  seating_preference: string | null;
  pre_order_id: string | null;
  status: 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show';
  notes: string | null;
  created_at: string;
}

// Inventory Management
export interface InventoryItem {
  id: string;
  venue_id: string;
  sku: string;
  name: string;
  category: string | null;
  quantity: number;
  unit: string;
  low_threshold: number;
  reorder_quantity: number | null;
  cost_per_unit: number | null;
  supplier: string | null;
  last_restocked: string | null;
  created_at: string;
  updated_at: string;
}

export interface InventoryTransaction {
  id: string;
  inventory_item_id: string;
  transaction_type: 'restock' | 'adjustment' | 'consumption' | 'waste';
  quantity: number;
  notes: string | null;
  staff_id: string | null;
  created_at: string;
}

// Push Notifications (V2)
export interface PushNotificationCredit {
  id: string;
  venue_id: string;
  credits_purchased: number;
  credits_used: number;
  credits_remaining: number;
  purchase_amount: number | null;
  purchased_at: string;
}

export interface PromotionalNotification {
  id: string;
  venue_id: string;
  created_by: string;
  ad_type: 'happy_hour' | 'event' | 'limited_offer' | 'menu_item';
  message_text: string;
  image_url: string | null;
  target_audience: TargetAudience | null;
  scheduled_for: string | null;
  sent_at: string | null;
  recipients_count: number;
  views_count: number;
  clicks_count: number;
  conversions_count: number;
  credits_spent: number;
  status: NotificationStatus;
  created_at: string;
}

export interface TargetAudience {
  type: 'nearby' | 'favorited' | 'previous_customers' | 'custom';
  radius?: number;
  filters?: Record<string, any>;
}

// Analytics
export interface SalesSummary {
  id: string;
  venue_id: string;
  date: string;
  hour: number | null;
  total_sales: number;
  total_orders: number;
  total_customers: number;
  avg_order_value: number;
  created_at: string;
}

// Extended Types for Frontend Use
export interface OrderWithItems extends Order {
  items: OrderItem[];
  table?: VenueTable;
  staff?: Profile;
  customer?: Profile;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  modifiers?: Record<string, any>;
  notes?: string;
}

export interface DashboardStats {
  todaysSales: number;
  salesTrend: string;
  orders: number;
  ordersTrend: string;
  activeTables: number;
  tablesTrend: string;
  avgOrderValue: number;
  avgTrend: string;
}

export interface StaffMember extends Profile {
  role: AppRole;
  status: 'active' | 'break' | 'off';
  shift?: EmployeeShift;
  todaySales?: number;
  todayOrders?: number;
}

export interface InvitationWithVenue extends EmployeeInvitation {
  venues?: {
    name: string;
    logo_url: string | null;
  };
}

// Supabase Response Types
export interface SupabaseResponse<T> {
  data: T | null;
  error: any | null;
}

export interface SupabaseListResponse<T> {
  data: T[] | null;
  error: any | null;
  count?: number | null;
}

// Kitchen Display View Types
export type KitchenViewMode = 'card' | 'list' | 'kanban';

export interface KitchenFilterState {
  status: OrderStatus | 'all';
  station: string | 'all';
  priority: string | 'all';
}

// Settings Types
export interface VenueSettings {
  general: {
    name: string;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    logo_url: string | null;
  };
  payment: {
    tax_rate: number;
    currency: string;
    payment_methods: PaymentMethod[];
  };
  printers: {
    receipt_printer: string | null;
    kitchen_printer: string | null;
  };
  operating_hours: Record<string, { enabled: boolean; open: string; close: string }>;
  advanced: {
    timezone: string;
    features: {
      enableAIWaiter: boolean;
      enableCheckIn: boolean;
      enableRemoteOrdering: boolean;
    };
  };
}

// Form Types
export interface MenuItemFormData {
  name: string;
  category_id: string;
  price: number;
  cost?: number;
  description?: string;
  station: 'kitchen' | 'bar' | 'expo';
  preparation_time: number;
  modifiers?: MenuItemModifier[];
  allergens?: string[];
  image?: File;
}

export interface TableFormData {
  table_number: string;
  capacity: number;
  section?: string;
}

export interface EmployeeInviteFormData {
  email: string;
  role: AppRole;
  permissions: Record<string, boolean>;
}

// Geolocation Types
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  timestamp: number;
}

// Chart Data Types
export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface HourlyChartData {
  hour: string;
  sales: number;
  orders: number;
}

export interface CategoryRevenueData {
  name: string;
  value: number;
  color: string;
}
