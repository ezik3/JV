/**
 * Utility Functions Library
 * Version: 2.0
 * Last Updated: 2025-11-18
 *
 * This file contains utility functions used throughout the POS application.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type {
  Order,
  OrderItem,
  CartItem,
  MenuItem,
  SelectedModifier,
  KitchenOrder,
} from '../types/database.types';

// =============================================
// CSS & Styling Utilities
// =============================================

/**
 * Merge Tailwind CSS classes with clsx
 * Useful for conditional styling with shadcn/ui components
 *
 * @example
 * cn('bg-blue-500', isActive && 'bg-green-500', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// =============================================
// Currency & Number Formatting
// =============================================

/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale for formatting (default: 'en-US')
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a number with commas
 * @param num - The number to format
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Round to 2 decimal places (for money calculations)
 */
export function roundMoney(amount: number): number {
  return Math.round(amount * 100) / 100;
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return roundMoney((value / total) * 100);
}

// =============================================
// Date & Time Utilities
// =============================================

/**
 * Format a date string to a readable format
 * @param dateString - ISO date string
 * @param includeTime - Whether to include time (default: false)
 */
export function formatDate(dateString: string, includeTime: boolean = false): string {
  const date = new Date(dateString);

  if (includeTime) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Format a time string (HH:MM AM/PM)
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Get elapsed time in minutes
 */
export function getElapsedMinutes(startTime: string): number {
  const start = new Date(startTime).getTime();
  const now = new Date().getTime();
  return Math.floor((now - start) / 1000 / 60);
}

/**
 * Format elapsed time as "Xm ago" or "Xh Ym ago"
 */
export function formatElapsedTime(startTime: string): string {
  const minutes = getElapsedMinutes(startTime);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h ago`;
  }

  return `${hours}h ${remainingMinutes}m ago`;
}

/**
 * Get time range (e.g., "Today", "Yesterday", "Nov 18")
 */
export function getTimeRange(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return formatDate(dateString, false);
}

// =============================================
// Cart & Order Calculations
// =============================================

/**
 * Calculate cart item subtotal (price * quantity + modifiers)
 */
export function calculateCartItemSubtotal(item: CartItem): number {
  const basePrice = item.menu_item.price * item.quantity;
  const modifiersPrice = item.selected_modifiers.reduce(
    (sum, mod) => sum + mod.price * item.quantity,
    0
  );
  return roundMoney(basePrice + modifiersPrice);
}

/**
 * Calculate cart totals
 */
export function calculateCartTotals(
  cart: CartItem[],
  taxRate: number = 0,
  serviceChargeRate: number = 0,
  discountAmount: number = 0
) {
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = roundMoney(subtotal * (taxRate / 100));
  const serviceCharge = roundMoney(subtotal * (serviceChargeRate / 100));
  const total = roundMoney(subtotal + tax + serviceCharge - discountAmount);

  return {
    subtotal: roundMoney(subtotal),
    tax,
    serviceCharge,
    discount: roundMoney(discountAmount),
    total,
  };
}

/**
 * Calculate order item subtotal
 */
export function calculateOrderItemSubtotal(
  price: number,
  quantity: number,
  modifiers: SelectedModifier[]
): number {
  const basePrice = price * quantity;
  const modifiersPrice = modifiers.reduce(
    (sum, mod) => sum + mod.price * quantity,
    0
  );
  return roundMoney(basePrice + modifiersPrice);
}

// =============================================
// Order Status & Priority
// =============================================

/**
 * Get order status color class
 */
export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    preparing: 'bg-blue-100 text-blue-800 border-blue-300',
    ready: 'bg-green-100 text-green-800 border-green-300',
    completed: 'bg-gray-100 text-gray-800 border-gray-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
  };

  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
}

/**
 * Get order type badge color
 */
export function getOrderTypeBadge(orderType: string): string {
  const badges: Record<string, string> = {
    'dine-in': 'bg-purple-100 text-purple-800',
    'takeout': 'bg-orange-100 text-orange-800',
    'delivery': 'bg-blue-100 text-blue-800',
  };

  return badges[orderType] || 'bg-gray-100 text-gray-800';
}

/**
 * Calculate order priority based on elapsed time
 */
export function calculateOrderPriority(
  orderedAt: string
): 'normal' | 'high' | 'urgent' {
  const minutes = getElapsedMinutes(orderedAt);

  if (minutes >= 30) return 'urgent';
  if (minutes >= 15) return 'high';
  return 'normal';
}

/**
 * Get priority color
 */
export function getPriorityColor(priority: 'normal' | 'high' | 'urgent'): string {
  const colors = {
    normal: 'text-gray-600',
    high: 'text-orange-600',
    urgent: 'text-red-600',
  };

  return colors[priority];
}

/**
 * Convert Order to KitchenOrder with computed fields
 */
export function toKitchenOrder(order: Order): KitchenOrder {
  return {
    ...order,
    elapsed_time: getElapsedMinutes(order.ordered_at),
    priority: calculateOrderPriority(order.ordered_at),
  };
}

// =============================================
// String Utilities
// =============================================

/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert string to title case
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Generate a slug from a string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// =============================================
// Array Utilities
// =============================================

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Sort array by key
 */
export function sortBy<T>(
  array: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

// =============================================
// Validation Utilities
// =============================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (US format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
}

/**
 * Validate PIN code (4-6 digits)
 */
export function isValidPIN(pin: string): boolean {
  const pinRegex = /^\d{4,6}$/;
  return pinRegex.test(pin);
}

/**
 * Format phone number to (XXX) XXX-XXXX
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phone;
}

// =============================================
// Local Storage Utilities
// =============================================

/**
 * Safely get item from localStorage
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Safely set item in localStorage
 */
export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
}

/**
 * Safely remove item from localStorage
 */
export function removeLocalStorage(key: string): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
}

// =============================================
// Debounce & Throttle
// =============================================

/**
 * Debounce function execution
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle function execution
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// =============================================
// Random & ID Generation
// =============================================

/**
 * Generate a random ID
 */
export function generateId(length: number = 8): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

/**
 * Generate a random color hex
 */
export function generateRandomColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

// =============================================
// Error Handling
// =============================================

/**
 * Format error message for display
 */
export function formatError(error: any): string {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error_description) return error.error_description;
  return 'An unexpected error occurred';
}

/**
 * Check if error is network-related
 */
export function isNetworkError(error: any): boolean {
  return (
    error?.message?.includes('network') ||
    error?.message?.includes('fetch') ||
    error?.code === 'NETWORK_ERROR'
  );
}

// =============================================
// Payment Utilities
// =============================================

/**
 * Mask credit card number (show last 4 digits)
 */
export function maskCardNumber(cardNumber: string): string {
  return '**** **** **** ' + cardNumber.slice(-4);
}

/**
 * Get card brand icon/name
 */
export function getCardBrand(brand: string): string {
  const brands: Record<string, string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    discover: 'Discover',
  };

  return brands[brand.toLowerCase()] || brand;
}

// =============================================
// Chart Data Helpers
// =============================================

/**
 * Prepare data for Chart.js line chart
 */
export function prepareLineChartData(
  data: Array<{ date: string; value: number }>,
  label: string
) {
  return {
    labels: data.map(d => formatDate(d.date)),
    datasets: [
      {
        label,
        data: data.map(d => d.value),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.3,
      },
    ],
  };
}

/**
 * Prepare data for Chart.js doughnut chart
 */
export function prepareDoughnutChartData(
  data: Array<{ label: string; value: number }>,
  colors?: string[]
) {
  const defaultColors = [
    'rgb(99, 102, 241)',
    'rgb(139, 92, 246)',
    'rgb(59, 130, 246)',
    'rgb(16, 185, 129)',
    'rgb(245, 158, 11)',
  ];

  return {
    labels: data.map(d => d.label),
    datasets: [
      {
        data: data.map(d => d.value),
        backgroundColor: colors || defaultColors,
      },
    ],
  };
}

// =============================================
// Export all utilities
// =============================================

export default {
  // CSS & Styling
  cn,

  // Currency & Numbers
  formatCurrency,
  formatNumber,
  roundMoney,
  calculatePercentage,

  // Date & Time
  formatDate,
  formatTime,
  getElapsedMinutes,
  formatElapsedTime,
  getTimeRange,

  // Cart & Orders
  calculateCartItemSubtotal,
  calculateCartTotals,
  calculateOrderItemSubtotal,
  getOrderStatusColor,
  getOrderTypeBadge,
  calculateOrderPriority,
  getPriorityColor,
  toKitchenOrder,

  // Strings
  capitalize,
  toTitleCase,
  truncate,
  slugify,

  // Arrays
  groupBy,
  sortBy,
  unique,

  // Validation
  isValidEmail,
  isValidPhone,
  isValidPIN,
  formatPhoneNumber,

  // Local Storage
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,

  // Debounce & Throttle
  debounce,
  throttle,

  // Random & IDs
  generateId,
  generateRandomColor,

  // Error Handling
  formatError,
  isNetworkError,

  // Payment
  maskCardNumber,
  getCardBrand,

  // Charts
  prepareLineChartData,
  prepareDoughnutChartData,
};
