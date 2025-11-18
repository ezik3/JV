// ============================================================================
// JointVibe POS V2 - TypeScript Database Types
// ============================================================================
// Auto-generated type definitions based on Supabase schema
// Version: 2.0
// Last Updated: 2025-11-18
// ============================================================================

// ============================================================================
// ENUMS
// ============================================================================

export type EmployeeRole = 'kitchen' | 'waiter' | 'bartender' | 'host' | 'manager';

export type ShiftStatus = 'active' | 'completed' | 'abandoned';

export type OrderType = 'dine_in' | 'takeout' | 'delivery' | 'bar';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'completed' | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'partially_paid' | 'refunded';

export type OrderItemStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';

export type PaymentMethod = 'cash' | 'credit_card' | 'debit_card' | 'mobile' | 'gift_card' | 'comp';

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

export type ReservationStatus = 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show';

export type ModifierType = 'radio' | 'checkbox' | 'quantity';

export type InventoryTransactionType = 'restock' | 'adjustment' | 'waste' | 'sale';

export type BreakType = 'regular' | 'meal' | 'smoke';

export type DiscountType = 'percentage' | 'fixed_amount' | 'bogo' | 'free_item';

export type RefundMethod = 'cash' | 'credit_card' | 'store_credit';

export type RefundStatus = 'pending' | 'approved' | 'completed' | 'denied';

export type PrinterType = 'receipt' | 'kitchen' | 'bar' | 'label';

export type PrintStatus = 'pending' | 'printed' | 'failed';

export type TipType = 'cash' | 'card' | 'auto_gratuity';

export type NotificationType = 'low_stock' | 'order_ready' | 'employee_late' | 'cash_drawer_variance' | 'system_alert';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'critical';

export type CashDrawerSessionStatus = 'open' | 'closed' | 'reconciled';

// ============================================================================
// DATABASE SCHEMA TYPES
// ============================================================================

export interface Database {
  public: {
    Tables: {
      pos_venues: {
        Row: PosVenue;
        Insert: PosVenueInsert;
        Update: PosVenueUpdate;
      };
      pos_employees: {
        Row: PosEmployee;
        Insert: PosEmployeeInsert;
        Update: PosEmployeeUpdate;
      };
      pos_shifts: {
        Row: PosShift;
        Insert: PosShiftInsert;
        Update: PosShiftUpdate;
      };
      pos_menu_categories: {
        Row: PosMenuCategory;
        Insert: PosMenuCategoryInsert;
        Update: PosMenuCategoryUpdate;
      };
      pos_menu_items: {
        Row: PosMenuItem;
        Insert: PosMenuItemInsert;
        Update: PosMenuItemUpdate;
      };
      pos_orders: {
        Row: PosOrder;
        Insert: PosOrderInsert;
        Update: PosOrderUpdate;
      };
      pos_order_items: {
        Row: PosOrderItem;
        Insert: PosOrderItemInsert;
        Update: PosOrderItemUpdate;
      };
      pos_inventory: {
        Row: PosInventory;
        Insert: PosInventoryInsert;
        Update: PosInventoryUpdate;
      };
      pos_payments: {
        Row: PosPayment;
        Insert: PosPaymentInsert;
        Update: PosPaymentUpdate;
      };
      pos_tables: {
        Row: PosTable;
        Insert: PosTableInsert;
        Update: PosTableUpdate;
      };
      pos_customers: {
        Row: PosCustomer;
        Insert: PosCustomerInsert;
        Update: PosCustomerUpdate;
      };
      pos_reservations: {
        Row: PosReservation;
        Insert: PosReservationInsert;
        Update: PosReservationUpdate;
      };
      pos_menu_modifiers: {
        Row: PosMenuModifier;
        Insert: PosMenuModifierInsert;
        Update: PosMenuModifierUpdate;
      };
      pos_modifier_options: {
        Row: PosModifierOption;
        Insert: PosModifierOptionInsert;
        Update: PosModifierOptionUpdate;
      };
      pos_menu_item_modifiers: {
        Row: PosMenuItemModifier;
        Insert: PosMenuItemModifierInsert;
        Update: PosMenuItemModifierUpdate;
      };
      pos_menu_item_inventory: {
        Row: PosMenuItemInventory;
        Insert: PosMenuItemInventoryInsert;
        Update: PosMenuItemInventoryUpdate;
      };
      pos_inventory_transactions: {
        Row: PosInventoryTransaction;
        Insert: PosInventoryTransactionInsert;
        Update: PosInventoryTransactionUpdate;
      };
      pos_price_history: {
        Row: PosPriceHistory;
        Insert: PosPriceHistoryInsert;
        Update: PosPriceHistoryUpdate;
      };
      pos_employee_permissions: {
        Row: PosEmployeePermission;
        Insert: PosEmployeePermissionInsert;
        Update: PosEmployeePermissionUpdate;
      };
      pos_shift_breaks: {
        Row: PosShiftBreak;
        Insert: PosShiftBreakInsert;
        Update: PosShiftBreakUpdate;
      };
      pos_employee_schedule: {
        Row: PosEmployeeSchedule;
        Insert: PosEmployeeScheduleInsert;
        Update: PosEmployeeScheduleUpdate;
      };
      pos_discounts: {
        Row: PosDiscount;
        Insert: PosDiscountInsert;
        Update: PosDiscountUpdate;
      };
      pos_audit_logs: {
        Row: PosAuditLog;
        Insert: PosAuditLogInsert;
        Update: PosAuditLogUpdate;
      };
      pos_cash_drawer_sessions: {
        Row: PosCashDrawerSession;
        Insert: PosCashDrawerSessionInsert;
        Update: PosCashDrawerSessionUpdate;
      };
      pos_refunds: {
        Row: PosRefund;
        Insert: PosRefundInsert;
        Update: PosRefundUpdate;
      };
      pos_tax_rates: {
        Row: PosTaxRate;
        Insert: PosTaxRateInsert;
        Update: PosTaxRateUpdate;
      };
      pos_printer_logs: {
        Row: PosPrinterLog;
        Insert: PosPrinterLogInsert;
        Update: PosPrinterLogUpdate;
      };
      pos_tips: {
        Row: PosTip;
        Insert: PosTipInsert;
        Update: PosTipUpdate;
      };
      pos_order_status_history: {
        Row: PosOrderStatusHistory;
        Insert: PosOrderStatusHistoryInsert;
        Update: PosOrderStatusHistoryUpdate;
      };
      pos_notifications: {
        Row: PosNotification;
        Insert: PosNotificationInsert;
        Update: PosNotificationUpdate;
      };
    };
  };
}

// ============================================================================
// VENUE SETTINGS TYPE
// ============================================================================

export interface VenueSettings {
  payment: {
    acceptedMethods: PaymentMethod[];
    tipSuggestions: number[];
    autoGratuity: {
      enabled: boolean;
      partySize: number;
      percentage: number;
    };
  };
  receipt: {
    autoprint: boolean;
    includeLogo: boolean;
    headerText: string;
    footerText: string;
  };
  kitchen: {
    autoAdvance: boolean;
    defaultView: 'card' | 'list' | 'kanban';
    alertSound: boolean;
    alertVolume: number;
  };
  orders: {
    numberFormat: string;
    defaultType: OrderType;
    requireCustomerInfo: boolean;
    orderTimeout: number;
  };
  employee: {
    pinLength: number;
    managerOverride: boolean;
    clockInGracePeriod: number;
  };
  inventory: {
    autoDeduct: boolean;
    lowStockThreshold: number;
    expirationWarningDays: number;
  };
  hardware: {
    receiptPrinter: string | null;
    kitchenPrinter: string | null;
    cashDrawer: string | null;
  };
}

// ============================================================================
// TABLE ROW TYPES
// ============================================================================

export interface PosVenue {
  id: string;
  name: string;
  owner_id: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  phone: string | null;
  email: string | null;
  timezone: string;
  currency: string;
  tax_rate: number;
  is_active: boolean;
  settings: VenueSettings;
  created_at: string;
  updated_at: string;
}

export interface PosEmployee {
  id: string;
  venue_id: string;
  user_id: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  role: EmployeeRole;
  pin_code: string;
  hourly_rate: number | null;
  is_active: boolean;
  hire_date: string;
  permissions: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PosShift {
  id: string;
  venue_id: string;
  employee_id: string;
  clock_in: string;
  clock_out: string | null;
  break_minutes: number;
  total_sales: number;
  total_orders: number;
  notes: string | null;
  status: ShiftStatus;
  created_at: string;
  updated_at: string;
}

export interface PosMenuCategory {
  id: string;
  venue_id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PosMenuItem {
  id: string;
  venue_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  cost: number;
  sku: string | null;
  barcode: string | null;
  image_url: string | null;
  prep_time_minutes: number;
  is_available: boolean;
  is_active: boolean;
  tags: string[];
  modifiers: ModifierGroup[];
  allergens: string[];
  nutritional_info: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PosOrder {
  id: string;
  venue_id: string;
  order_number: string;
  employee_id: string | null;
  shift_id: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  table_number: string | null;
  order_type: OrderType;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  tip: number;
  discount: number;
  total: number;
  payment_method: string | null;
  payment_status: PaymentStatus;
  notes: string | null;
  kitchen_notes: string | null;
  special_requests: string | null;
  estimated_ready_time: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface PosOrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  modifiers: SelectedModifier[];
  special_instructions: string | null;
  status: OrderItemStatus;
  prepared_by: string | null;
  prepared_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PosInventory {
  id: string;
  venue_id: string;
  item_name: string;
  category: string | null;
  unit: string;
  current_quantity: number;
  minimum_quantity: number;
  reorder_quantity: number;
  unit_cost: number;
  supplier: string | null;
  last_restock_date: string | null;
  expiration_date: string | null;
  location: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PosPayment {
  id: string;
  venue_id: string;
  order_id: string;
  employee_id: string | null;
  shift_id: string | null;
  amount: number;
  tip_amount: number;
  payment_method: PaymentMethod;
  card_last_four: string | null;
  transaction_id: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PosTable {
  id: string;
  venue_id: string;
  table_number: string;
  section: string | null;
  capacity: number;
  status: TableStatus;
  current_order_id: string | null;
  qr_code: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PosCustomer {
  id: string;
  venue_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  birthday: string | null;
  loyalty_points: number;
  total_spent: number;
  visit_count: number;
  last_visit: string | null;
  notes: string | null;
  marketing_opt_in: boolean;
  created_at: string;
  updated_at: string;
}

export interface PosReservation {
  id: string;
  venue_id: string;
  customer_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  party_size: number;
  reservation_date: string;
  reservation_time: string;
  table_id: string | null;
  status: ReservationStatus;
  special_requests: string | null;
  created_at: string;
  updated_at: string;
}

export interface PosMenuModifier {
  id: string;
  venue_id: string;
  name: string;
  modifier_type: ModifierType;
  is_required: boolean;
  max_selections: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface PosModifierOption {
  id: string;
  modifier_id: string;
  name: string;
  price_adjustment: number;
  is_default: boolean;
  is_available: boolean;
  sort_order: number;
  created_at: string;
}

export interface PosMenuItemModifier {
  id: string;
  menu_item_id: string;
  modifier_id: string;
  is_required: boolean;
  created_at: string;
}

export interface PosMenuItemInventory {
  id: string;
  menu_item_id: string;
  inventory_item_id: string;
  quantity_used: number;
  unit: string;
  created_at: string;
}

export interface PosInventoryTransaction {
  id: string;
  venue_id: string;
  inventory_item_id: string;
  transaction_type: InventoryTransactionType;
  quantity_change: number;
  quantity_before: number;
  quantity_after: number;
  unit_cost: number | null;
  total_cost: number | null;
  reason: string | null;
  reference_id: string | null;
  employee_id: string | null;
  notes: string | null;
  created_at: string;
}

export interface PosPriceHistory {
  id: string;
  menu_item_id: string;
  old_price: number;
  new_price: number;
  changed_by: string | null;
  reason: string | null;
  effective_date: string;
  created_at: string;
}

export interface PosEmployeePermission {
  id: string;
  employee_id: string;
  permission: string;
  granted_by: string | null;
  granted_at: string;
}

export interface PosShiftBreak {
  id: string;
  shift_id: string;
  break_start: string;
  break_end: string | null;
  break_type: BreakType;
  created_at: string;
}

export interface PosEmployeeSchedule {
  id: string;
  venue_id: string;
  employee_id: string;
  schedule_date: string;
  shift_start: string;
  shift_end: string;
  position: string | null;
  notes: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PosDiscount {
  id: string;
  venue_id: string;
  code: string | null;
  name: string;
  description: string | null;
  discount_type: DiscountType;
  discount_value: number;
  min_purchase: number;
  max_discount: number | null;
  start_date: string | null;
  end_date: string | null;
  usage_limit: number | null;
  usage_count: number;
  is_active: boolean;
  requires_manager_approval: boolean;
  applicable_items: Record<string, any> | null;
  created_at: string;
}

export interface PosAuditLog {
  id: string;
  venue_id: string;
  employee_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_data: Record<string, any> | null;
  new_data: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface PosCashDrawerSession {
  id: string;
  venue_id: string;
  employee_id: string;
  shift_id: string | null;
  opening_amount: number;
  closing_amount: number | null;
  expected_amount: number | null;
  variance: number | null;
  opened_at: string;
  closed_at: string | null;
  notes: string | null;
  status: CashDrawerSessionStatus;
  created_at: string;
}

export interface PosRefund {
  id: string;
  venue_id: string;
  order_id: string;
  payment_id: string | null;
  employee_id: string;
  manager_id: string | null;
  amount: number;
  reason: string;
  refund_method: RefundMethod;
  status: RefundStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PosTaxRate {
  id: string;
  venue_id: string;
  name: string;
  rate: number;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
}

export interface PosPrinterLog {
  id: string;
  venue_id: string;
  printer_type: PrinterType;
  order_id: string | null;
  employee_id: string | null;
  content: string | null;
  status: PrintStatus;
  error_message: string | null;
  printed_at: string | null;
  created_at: string;
}

export interface PosTip {
  id: string;
  venue_id: string;
  order_id: string;
  employee_id: string;
  shift_id: string | null;
  tip_amount: number;
  tip_type: TipType;
  is_pooled: boolean;
  distributed_at: string | null;
  created_at: string;
}

export interface PosOrderStatusHistory {
  id: string;
  order_id: string;
  from_status: string | null;
  to_status: string;
  changed_by: string | null;
  notes: string | null;
  created_at: string;
}

export interface PosNotification {
  id: string;
  venue_id: string;
  notification_type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  reference_id: string | null;
  is_read: boolean;
  read_by: string | null;
  read_at: string | null;
  created_at: string;
}

// ============================================================================
// INSERT TYPES (for creating new records)
// ============================================================================

export type PosVenueInsert = Omit<PosVenue, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  settings?: Partial<VenueSettings>;
};

export type PosEmployeeInsert = Omit<PosEmployee, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};

export type PosShiftInsert = Omit<PosShift, 'id' | 'created_at' | 'updated_at' | 'clock_in'> & {
  id?: string;
  clock_in?: string;
};

export type PosMenuCategoryInsert = Omit<PosMenuCategory, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};

export type PosMenuItemInsert = Omit<PosMenuItem, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};

export type PosOrderInsert = Omit<PosOrder, 'id' | 'created_at' | 'updated_at' | 'order_number'> & {
  id?: string;
  order_number?: string;
};

export type PosOrderItemInsert = Omit<PosOrderItem, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};

export type PosInventoryInsert = Omit<PosInventory, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};

export type PosPaymentInsert = Omit<PosPayment, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};

export type PosTableInsert = Omit<PosTable, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};

export type PosCustomerInsert = Omit<PosCustomer, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};

export type PosReservationInsert = Omit<PosReservation, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};

export type PosMenuModifierInsert = Omit<PosMenuModifier, 'id' | 'created_at'> & {
  id?: string;
};

export type PosModifierOptionInsert = Omit<PosModifierOption, 'id' | 'created_at'> & {
  id?: string;
};

export type PosMenuItemModifierInsert = Omit<PosMenuItemModifier, 'id' | 'created_at'> & {
  id?: string;
};

export type PosMenuItemInventoryInsert = Omit<PosMenuItemInventory, 'id' | 'created_at'> & {
  id?: string;
};

export type PosInventoryTransactionInsert = Omit<PosInventoryTransaction, 'id' | 'created_at'> & {
  id?: string;
};

export type PosPriceHistoryInsert = Omit<PosPriceHistory, 'id' | 'created_at' | 'effective_date'> & {
  id?: string;
  effective_date?: string;
};

export type PosEmployeePermissionInsert = Omit<PosEmployeePermission, 'id' | 'granted_at'> & {
  id?: string;
};

export type PosShiftBreakInsert = Omit<PosShiftBreak, 'id' | 'created_at'> & {
  id?: string;
};

export type PosEmployeeScheduleInsert = Omit<PosEmployeeSchedule, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};

export type PosDiscountInsert = Omit<PosDiscount, 'id' | 'created_at' | 'usage_count'> & {
  id?: string;
  usage_count?: number;
};

export type PosAuditLogInsert = Omit<PosAuditLog, 'id' | 'created_at'> & {
  id?: string;
};

export type PosCashDrawerSessionInsert = Omit<PosCashDrawerSession, 'id' | 'created_at' | 'opened_at'> & {
  id?: string;
  opened_at?: string;
};

export type PosRefundInsert = Omit<PosRefund, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};

export type PosTaxRateInsert = Omit<PosTaxRate, 'id' | 'created_at'> & {
  id?: string;
};

export type PosPrinterLogInsert = Omit<PosPrinterLog, 'id' | 'created_at'> & {
  id?: string;
};

export type PosTipInsert = Omit<PosTip, 'id' | 'created_at'> & {
  id?: string;
};

export type PosOrderStatusHistoryInsert = Omit<PosOrderStatusHistory, 'id' | 'created_at'> & {
  id?: string;
};

export type PosNotificationInsert = Omit<PosNotification, 'id' | 'created_at'> & {
  id?: string;
};

// ============================================================================
// UPDATE TYPES (for updating existing records - all fields optional)
// ============================================================================

export type PosVenueUpdate = Partial<Omit<PosVenue, 'id' | 'created_at' | 'owner_id'>>;
export type PosEmployeeUpdate = Partial<Omit<PosEmployee, 'id' | 'created_at' | 'venue_id'>>;
export type PosShiftUpdate = Partial<Omit<PosShift, 'id' | 'created_at' | 'venue_id'>>;
export type PosMenuCategoryUpdate = Partial<Omit<PosMenuCategory, 'id' | 'created_at' | 'venue_id'>>;
export type PosMenuItemUpdate = Partial<Omit<PosMenuItem, 'id' | 'created_at' | 'venue_id'>>;
export type PosOrderUpdate = Partial<Omit<PosOrder, 'id' | 'created_at' | 'venue_id'>>;
export type PosOrderItemUpdate = Partial<Omit<PosOrderItem, 'id' | 'created_at' | 'order_id'>>;
export type PosInventoryUpdate = Partial<Omit<PosInventory, 'id' | 'created_at' | 'venue_id'>>;
export type PosPaymentUpdate = Partial<Omit<PosPayment, 'id' | 'created_at' | 'venue_id'>>;
export type PosTableUpdate = Partial<Omit<PosTable, 'id' | 'created_at' | 'venue_id'>>;
export type PosCustomerUpdate = Partial<Omit<PosCustomer, 'id' | 'created_at' | 'venue_id'>>;
export type PosReservationUpdate = Partial<Omit<PosReservation, 'id' | 'created_at' | 'venue_id'>>;
export type PosMenuModifierUpdate = Partial<Omit<PosMenuModifier, 'id' | 'created_at' | 'venue_id'>>;
export type PosModifierOptionUpdate = Partial<Omit<PosModifierOption, 'id' | 'created_at' | 'modifier_id'>>;
export type PosMenuItemModifierUpdate = Partial<Omit<PosMenuItemModifier, 'id' | 'created_at'>>;
export type PosMenuItemInventoryUpdate = Partial<Omit<PosMenuItemInventory, 'id' | 'created_at'>>;
export type PosInventoryTransactionUpdate = Partial<Omit<PosInventoryTransaction, 'id' | 'created_at'>>;
export type PosPriceHistoryUpdate = Partial<Omit<PosPriceHistory, 'id' | 'created_at'>>;
export type PosEmployeePermissionUpdate = Partial<Omit<PosEmployeePermission, 'id' | 'granted_at'>>;
export type PosShiftBreakUpdate = Partial<Omit<PosShiftBreak, 'id' | 'created_at'>>;
export type PosEmployeeScheduleUpdate = Partial<Omit<PosEmployeeSchedule, 'id' | 'created_at' | 'venue_id'>>;
export type PosDiscountUpdate = Partial<Omit<PosDiscount, 'id' | 'created_at' | 'venue_id'>>;
export type PosAuditLogUpdate = Partial<Omit<PosAuditLog, 'id' | 'created_at'>>;
export type PosCashDrawerSessionUpdate = Partial<Omit<PosCashDrawerSession, 'id' | 'created_at' | 'venue_id'>>;
export type PosRefundUpdate = Partial<Omit<PosRefund, 'id' | 'created_at' | 'venue_id'>>;
export type PosTaxRateUpdate = Partial<Omit<PosTaxRate, 'id' | 'created_at' | 'venue_id'>>;
export type PosPrinterLogUpdate = Partial<Omit<PosPrinterLog, 'id' | 'created_at'>>;
export type PosTipUpdate = Partial<Omit<PosTip, 'id' | 'created_at'>>;
export type PosOrderStatusHistoryUpdate = Partial<Omit<PosOrderStatusHistory, 'id' | 'created_at'>>;
export type PosNotificationUpdate = Partial<Omit<PosNotification, 'id' | 'created_at' | 'venue_id'>>;

// ============================================================================
// HELPER TYPES
// ============================================================================

export interface ModifierGroup {
  id: string;
  name: string;
  type: ModifierType;
  required: boolean;
  options: ModifierOption[];
}

export interface ModifierOption {
  name: string;
  price: number;
}

export interface SelectedModifier {
  group_id: string;
  group_name: string;
  option_name: string;
  price_adjustment: number;
}

export interface CartItem {
  menu_item_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  modifiers: SelectedModifier[];
  special_instructions?: string;
  total_price: number;
}

export interface CreateOrderData {
  order_type: OrderType;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  table_number?: string;
  items: CartItem[];
  notes?: string;
  kitchen_notes?: string;
  special_requests?: string;
}

export interface OrderWithItems extends PosOrder {
  pos_order_items: PosOrderItem[];
  pos_employees?: PosEmployee;
  pos_tables?: PosTable;
}

export interface MenuItemWithRelations extends PosMenuItem {
  pos_menu_categories?: PosMenuCategory;
  pos_menu_item_modifiers?: Array<{
    pos_menu_modifiers: PosMenuModifier & {
      pos_modifier_options: PosModifierOption[];
    };
  }>;
}

export interface EmployeeWithShift extends PosEmployee {
  current_shift?: PosShift;
}

export interface ShiftWithDetails extends PosShift {
  pos_employees: PosEmployee;
  pos_shift_breaks: PosShiftBreak[];
}

export interface DashboardStats {
  todaySales: number;
  todayOrders: number;
  averageTicket: number;
  activeOrders: number;
  employeesOnShift: number;
  lowStockItems: number;
}

export interface SalesReport {
  date: string;
  sales: number;
  orders: number;
  averageTicket: number;
}

export interface TopSellingItem {
  item_name: string;
  quantity_sold: number;
  revenue: number;
}

export interface EmployeePerformance {
  employee_id: string;
  employee_name: string;
  total_sales: number;
  total_orders: number;
  average_ticket: number;
  hours_worked: number;
  sales_per_hour: number;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface PinLoginFormData {
  pin: string;
}

export interface VenueFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  email: string;
  tax_rate: number;
  timezone: string;
  currency: string;
}

export interface EmployeeFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  pin_code: string;
  hourly_rate: number;
  hire_date: string;
}

export interface MenuItemFormData {
  name: string;
  description: string;
  category_id: string;
  price: number;
  cost: number;
  prep_time_minutes: number;
  image_url?: string;
  tags: string[];
  allergens: string[];
}

export interface InventoryFormData {
  item_name: string;
  category: string;
  unit: string;
  current_quantity: number;
  minimum_quantity: number;
  reorder_quantity: number;
  unit_cost: number;
  supplier: string;
}

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export type {
  // Main database type
  Database,

  // Enums
  EmployeeRole,
  ShiftStatus,
  OrderType,
  OrderStatus,
  PaymentStatus,
  OrderItemStatus,
  PaymentMethod,
  TableStatus,
  ReservationStatus,
  ModifierType,
  InventoryTransactionType,
  BreakType,
  DiscountType,
  RefundMethod,
  RefundStatus,
  PrinterType,
  PrintStatus,
  TipType,
  NotificationType,
  NotificationPriority,
  CashDrawerSessionStatus,
};
