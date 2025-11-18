// ============================================================================
// JointVibe POS V2 - Utility Functions
// ============================================================================
// 60+ utility functions for the POS system
// Version: 2.0
// Last Updated: 2025-11-18
// ============================================================================

import type {
  OrderStatus,
  OrderType,
  PaymentMethod,
  EmployeeRole,
  OrderItemStatus,
  SelectedModifier,
  CartItem,
} from '../types/database.types';

// ============================================================================
// CLASS UTILITIES (for Tailwind CSS)
// ============================================================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// DATE & TIME UTILITIES
// ============================================================================

/**
 * Format date to readable string
 * @param date - Date string or Date object
 * @param options - Intl.DateTimeFormat options
 */
export const formatDate = (
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', options || {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(dateObj);
};

/**
 * Format time to readable string
 * @param date - Date string or Date object
 */
export const formatTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(dateObj);
};

/**
 * Format date and time together
 * @param date - Date string or Date object
 */
export const formatDateTime = (date: string | Date): string => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

/**
 * Get relative time (e.g., "2 hours ago")
 * @param date - Date string or Date object
 */
export const getRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return formatDate(dateObj);
};

/**
 * Get time elapsed in minutes
 * @param date - Date string or Date object
 */
export const getElapsedMinutes = (date: string | Date): number => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  return Math.floor((now.getTime() - dateObj.getTime()) / 60000);
};

/**
 * Get start of day
 * @param date - Date object (defaults to today)
 */
export const startOfDay = (date: Date = new Date()): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of day
 * @param date - Date object (defaults to today)
 */
export const endOfDay = (date: Date = new Date()): Date => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Get start of week
 * @param date - Date object (defaults to today)
 */
export const startOfWeek = (date: Date = new Date()): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  const start = new Date(d.setDate(diff));
  start.setHours(0, 0, 0, 0);
  return start;
};

/**
 * Get end of week
 * @param date - Date object (defaults to today)
 */
export const endOfWeek = (date: Date = new Date()): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() + (6 - day);
  const end = new Date(d.setDate(diff));
  end.setHours(23, 59, 59, 999);
  return end;
};

/**
 * Get start of month
 * @param date - Date object (defaults to today)
 */
export const startOfMonth = (date: Date = new Date()): Date => {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of month
 * @param date - Date object (defaults to today)
 */
export const endOfMonth = (date: Date = new Date()): Date => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1, 0);
  d.setHours(23, 59, 59, 999);
  return d;
};

// ============================================================================
// CURRENCY UTILITIES
// ============================================================================

/**
 * Format number as currency
 * @param amount - Amount to format
 * @param currency - Currency code (default: USD)
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Parse currency string to number
 * @param value - Currency string (e.g., "$12.99")
 */
export const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/[^0-9.-]+/g, ''));
};

/**
 * Calculate percentage
 * @param value - Value to calculate percentage of
 * @param percentage - Percentage (e.g., 18 for 18%)
 */
export const calculatePercentage = (value: number, percentage: number): number => {
  return (value * percentage) / 100;
};

/**
 * Calculate tax
 * @param subtotal - Subtotal amount
 * @param taxRate - Tax rate (e.g., 8.25 for 8.25%)
 */
export const calculateTax = (subtotal: number, taxRate: number): number => {
  return Math.round(calculatePercentage(subtotal, taxRate) * 100) / 100;
};

/**
 * Calculate tip
 * @param subtotal - Subtotal amount
 * @param tipPercentage - Tip percentage (e.g., 18 for 18%)
 */
export const calculateTip = (subtotal: number, tipPercentage: number): number => {
  return Math.round(calculatePercentage(subtotal, tipPercentage) * 100) / 100;
};

/**
 * Calculate order total
 * @param subtotal - Subtotal amount
 * @param tax - Tax amount
 * @param tip - Tip amount
 * @param discount - Discount amount
 */
export const calculateOrderTotal = (
  subtotal: number,
  tax: number = 0,
  tip: number = 0,
  discount: number = 0
): number => {
  return Math.round((subtotal + tax + tip - discount) * 100) / 100;
};

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Capitalize first letter of string
 * @param str - String to capitalize
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert string to title case
 * @param str - String to convert
 */
export const toTitleCase = (str: string): string => {
  return str.split(' ').map(capitalize).join(' ');
};

/**
 * Truncate string
 * @param str - String to truncate
 * @param maxLength - Maximum length
 */
export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
};

/**
 * Generate initials from name
 * @param name - Full name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Format phone number
 * @param phone - Phone number string
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

/**
 * Generate random string
 * @param length - Length of string
 */
export const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// ============================================================================
// ORDER UTILITIES
// ============================================================================

/**
 * Generate order number
 * @param count - Order count for today
 * @param format - Format string (default: ORD-####)
 */
export const generateOrderNumber = (count: number, format: string = 'ORD-####'): string => {
  const paddedCount = count.toString().padStart(4, '0');
  return format.replace('####', paddedCount);
};

/**
 * Get order status color
 * @param status - Order status
 */
export const getOrderStatusColor = (status: OrderStatus): string => {
  const colors: Record<OrderStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-orange-100 text-orange-800',
    ready: 'bg-green-100 text-green-800',
    delivered: 'bg-purple-100 text-purple-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Get order type icon
 * @param type - Order type
 */
export const getOrderTypeIcon = (type: OrderType): string => {
  const icons: Record<OrderType, string> = {
    dine_in: '🍽️',
    takeout: '🥡',
    delivery: '🚗',
    bar: '🍺',
  };
  return icons[type] || '📦';
};

/**
 * Get order type label
 * @param type - Order type
 */
export const getOrderTypeLabel = (type: OrderType): string => {
  const labels: Record<OrderType, string> = {
    dine_in: 'Dine In',
    takeout: 'Takeout',
    delivery: 'Delivery',
    bar: 'Bar',
  };
  return labels[type] || type;
};

/**
 * Get payment method label
 * @param method - Payment method
 */
export const getPaymentMethodLabel = (method: PaymentMethod): string => {
  const labels: Record<PaymentMethod, string> = {
    cash: 'Cash',
    credit_card: 'Credit Card',
    debit_card: 'Debit Card',
    mobile: 'Mobile Payment',
    gift_card: 'Gift Card',
    comp: 'Comp',
  };
  return labels[method] || method;
};

/**
 * Check if order is overdue
 * @param createdAt - Order creation time
 * @param threshold - Threshold in minutes (default: 30)
 */
export const isOrderOverdue = (createdAt: string, threshold: number = 30): boolean => {
  return getElapsedMinutes(createdAt) > threshold;
};

/**
 * Get order urgency level
 * @param createdAt - Order creation time
 */
export const getOrderUrgency = (createdAt: string): 'low' | 'medium' | 'high' => {
  const elapsed = getElapsedMinutes(createdAt);
  if (elapsed < 10) return 'low';
  if (elapsed < 20) return 'medium';
  return 'high';
};

// ============================================================================
// CART UTILITIES
// ============================================================================

/**
 * Calculate cart item total
 * @param item - Cart item
 */
export const calculateCartItemTotal = (item: CartItem): number => {
  const modifierTotal = item.modifiers.reduce(
    (sum, mod) => sum + mod.price_adjustment,
    0
  );
  return (item.unit_price + modifierTotal) * item.quantity;
};

/**
 * Calculate cart subtotal
 * @param items - Cart items
 */
export const calculateCartSubtotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + calculateCartItemTotal(item), 0);
};

/**
 * Format modifiers for display
 * @param modifiers - Selected modifiers
 */
export const formatModifiers = (modifiers: SelectedModifier[]): string => {
  if (!modifiers || modifiers.length === 0) return '';
  return modifiers
    .map(mod => {
      const price = mod.price_adjustment > 0 ? ` (+${formatCurrency(mod.price_adjustment)})` : '';
      return `${mod.option_name}${price}`;
    })
    .join(', ');
};

/**
 * Get unique cart item ID (for tracking in cart)
 * @param menuItemId - Menu item ID
 * @param modifiers - Selected modifiers
 */
export const getCartItemId = (menuItemId: string, modifiers: SelectedModifier[]): string => {
  const modifierString = modifiers
    .map(m => `${m.group_id}:${m.option_name}`)
    .sort()
    .join('|');
  return `${menuItemId}::${modifierString}`;
};

// ============================================================================
// EMPLOYEE UTILITIES
// ============================================================================

/**
 * Get employee role label
 * @param role - Employee role
 */
export const getEmployeeRoleLabel = (role: EmployeeRole): string => {
  const labels: Record<EmployeeRole, string> = {
    kitchen: 'Kitchen Staff',
    waiter: 'Waiter/Waitress',
    bartender: 'Bartender',
    host: 'Host/Hostess',
    manager: 'Manager',
  };
  return labels[role] || role;
};

/**
 * Get employee role color
 * @param role - Employee role
 */
export const getEmployeeRoleColor = (role: EmployeeRole): string => {
  const colors: Record<EmployeeRole, string> = {
    kitchen: 'bg-orange-100 text-orange-800',
    waiter: 'bg-blue-100 text-blue-800',
    bartender: 'bg-purple-100 text-purple-800',
    host: 'bg-green-100 text-green-800',
    manager: 'bg-red-100 text-red-800',
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
};

/**
 * Format employee name
 * @param firstName - First name
 * @param lastName - Last name
 */
export const formatEmployeeName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`;
};

/**
 * Calculate hours worked
 * @param clockIn - Clock in time
 * @param clockOut - Clock out time (optional)
 * @param breakMinutes - Break minutes
 */
export const calculateHoursWorked = (
  clockIn: string,
  clockOut: string | null,
  breakMinutes: number = 0
): number => {
  const start = new Date(clockIn);
  const end = clockOut ? new Date(clockOut) : new Date();
  const totalMinutes = (end.getTime() - start.getTime()) / 60000;
  const workedMinutes = totalMinutes - breakMinutes;
  return Math.max(0, workedMinutes / 60);
};

/**
 * Format shift duration
 * @param clockIn - Clock in time
 * @param clockOut - Clock out time (optional)
 */
export const formatShiftDuration = (clockIn: string, clockOut: string | null): string => {
  const hours = calculateHoursWorked(clockIn, clockOut);
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
};

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validate email address
 * @param email - Email address
 */
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate phone number
 * @param phone - Phone number
 */
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || cleaned.length === 11;
};

/**
 * Validate PIN code
 * @param pin - PIN code
 * @param length - Expected length (default: 4)
 */
export const isValidPin = (pin: string, length: number = 4): boolean => {
  const regex = new RegExp(`^\\d{${length}}$`);
  return regex.test(pin);
};

/**
 * Validate price
 * @param price - Price value
 */
export const isValidPrice = (price: number): boolean => {
  return price > 0 && price < 100000;
};

/**
 * Validate quantity
 * @param quantity - Quantity value
 */
export const isValidQuantity = (quantity: number): boolean => {
  return Number.isInteger(quantity) && quantity > 0 && quantity <= 999;
};

// ============================================================================
// ANALYTICS UTILITIES
// ============================================================================

/**
 * Calculate average
 * @param numbers - Array of numbers
 */
export const average = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
};

/**
 * Calculate sum
 * @param numbers - Array of numbers
 */
export const sum = (numbers: number[]): number => {
  return numbers.reduce((total, n) => total + n, 0);
};

/**
 * Calculate percentage change
 * @param oldValue - Old value
 * @param newValue - New value
 */
export const percentageChange = (oldValue: number, newValue: number): number => {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

/**
 * Round to decimal places
 * @param value - Value to round
 * @param decimals - Number of decimal places (default: 2)
 */
export const roundTo = (value: number, decimals: number = 2): number => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

// ============================================================================
// LOCAL STORAGE UTILITIES
// ============================================================================

/**
 * Save to local storage
 * @param key - Storage key
 * @param value - Value to store
 */
export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Load from local storage
 * @param key - Storage key
 * @param defaultValue - Default value if not found
 */
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Remove from local storage
 * @param key - Storage key
 */
export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * Clear all local storage
 */
export const clearStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// ============================================================================
// DEBOUNCE & THROTTLE
// ============================================================================

/**
 * Debounce function
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

/**
 * Group array by key
 * @param array - Array to group
 * @param key - Key to group by
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

/**
 * Sort array by key
 * @param array - Array to sort
 * @param key - Key to sort by
 * @param ascending - Sort direction (default: true)
 */
export const sortBy = <T>(array: T[], key: keyof T, ascending: boolean = true): T[] => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return ascending ? -1 : 1;
    if (a[key] > b[key]) return ascending ? 1 : -1;
    return 0;
  });
};

/**
 * Remove duplicates from array
 * @param array - Array with duplicates
 */
export const unique = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

/**
 * Chunk array into smaller arrays
 * @param array - Array to chunk
 * @param size - Chunk size
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// ============================================================================
// OBJECT UTILITIES
// ============================================================================

/**
 * Deep clone object
 * @param obj - Object to clone
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 * @param obj - Object to check
 */
export const isEmpty = (obj: object): boolean => {
  return Object.keys(obj).length === 0;
};

/**
 * Pick keys from object
 * @param obj - Source object
 * @param keys - Keys to pick
 */
export const pick = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {} as Pick<T, K>);
};

/**
 * Omit keys from object
 * @param obj - Source object
 * @param keys - Keys to omit
 */
export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Class utilities
  cn,

  // Date & Time
  formatDate,
  formatTime,
  formatDateTime,
  getRelativeTime,
  getElapsedMinutes,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,

  // Currency
  formatCurrency,
  parseCurrency,
  calculatePercentage,
  calculateTax,
  calculateTip,
  calculateOrderTotal,

  // String
  capitalize,
  toTitleCase,
  truncate,
  getInitials,
  formatPhoneNumber,
  generateRandomString,

  // Order
  generateOrderNumber,
  getOrderStatusColor,
  getOrderTypeIcon,
  getOrderTypeLabel,
  getPaymentMethodLabel,
  isOrderOverdue,
  getOrderUrgency,

  // Cart
  calculateCartItemTotal,
  calculateCartSubtotal,
  formatModifiers,
  getCartItemId,

  // Employee
  getEmployeeRoleLabel,
  getEmployeeRoleColor,
  formatEmployeeName,
  calculateHoursWorked,
  formatShiftDuration,

  // Validation
  isValidEmail,
  isValidPhone,
  isValidPin,
  isValidPrice,
  isValidQuantity,

  // Analytics
  average,
  sum,
  percentageChange,
  roundTo,

  // Local Storage
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
  clearStorage,

  // Performance
  debounce,
  throttle,

  // Array
  groupBy,
  sortBy,
  unique,
  chunk,

  // Object
  deepClone,
  isEmpty,
  pick,
  omit,
};
