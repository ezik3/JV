// =====================================================
// UTILITY FUNCTIONS FOR JOINTVIBE POS
// =====================================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { OrderStatus, TableStatus, PaymentMethod, StockStatus } from '../types/database.types';

// =====================================================
// TAILWIND CLASS NAME MERGER
// =====================================================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// =====================================================
// CURRENCY & NUMBER FORMATTING
// =====================================================

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

// =====================================================
// DATE & TIME FORMATTING
// =====================================================

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatOrderAge(createdAt: string): string {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins === 1) return '1 min ago';
  if (diffMins < 60) return `${diffMins} mins ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) return '1 hour ago';
  return `${diffHours} hours ago`;
}

export function formatDuration(startTime: string, endTime?: string): string {
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : new Date();
  const diffMs = end.getTime() - start.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

// =====================================================
// STATUS & BADGE HELPERS
// =====================================================

export function getOrderStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500',
    preparing: 'bg-blue-500/20 text-blue-500 border-blue-500',
    ready: 'bg-green-500/20 text-green-500 border-green-500',
    served: 'bg-gray-500/20 text-gray-500 border-gray-500',
    cancelled: 'bg-red-500/20 text-red-500 border-red-500'
  };
  return colors[status] || colors.pending;
}

export function getTableStatusColor(status: TableStatus): string {
  const colors: Record<TableStatus, string> = {
    available: 'bg-green-500/20 text-green-500 border-green-500',
    occupied: 'bg-red-500/20 text-red-500 border-red-500',
    reserved: 'bg-yellow-500/20 text-yellow-500 border-yellow-500'
  };
  return colors[status] || colors.available;
}

export function getStockStatus(item: { quantity: number; low_threshold: number }): StockStatus {
  if (item.quantity === 0) return 'critical';
  if (item.quantity <= item.low_threshold) return 'low';
  return 'good';
}

export function getStockStatusColor(status: StockStatus): string {
  const colors: Record<StockStatus, string> = {
    good: 'bg-green-500/20 text-green-500 border-green-500',
    low: 'bg-yellow-500/20 text-yellow-500 border-yellow-500',
    critical: 'bg-red-500/20 text-red-500 border-red-500'
  };
  return colors[status];
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: 'bg-gray-500/20 text-gray-500',
    normal: 'bg-blue-500/20 text-blue-500',
    high: 'bg-orange-500/20 text-orange-500',
    urgent: 'bg-red-500/20 text-red-500'
  };
  return colors[priority] || colors.normal;
}

// =====================================================
// PAYMENT METHOD HELPERS
// =====================================================

export function getPaymentMethodIcon(method: PaymentMethod): string {
  const icons: Record<PaymentMethod, string> = {
    cash: '💵',
    card: '💳',
    mobile: '📱',
    jvcoin: '🪙'
  };
  return icons[method] || '💰';
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  const labels: Record<PaymentMethod, string> = {
    cash: 'Cash',
    card: 'Card',
    mobile: 'Mobile Pay',
    jvcoin: 'JVCoin'
  };
  return labels[method] || 'Unknown';
}

// =====================================================
// CALCULATION HELPERS
// =====================================================

export function calculateSubtotal(items: Array<{ price: number; quantity: number }>): number {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

export function calculateTax(subtotal: number, taxRate: number): number {
  return subtotal * (taxRate / 100);
}

export function calculateTotal(
  subtotal: number,
  tax: number,
  tip: number = 0,
  discount: number = 0,
  deliveryFee: number = 0
): number {
  return subtotal + tax + tip + deliveryFee - discount;
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function calculateTrendText(change: number): string {
  if (change > 0) return `+${change.toFixed(1)}%`;
  if (change < 0) return `${change.toFixed(1)}%`;
  return '0%';
}

// =====================================================
// GEOLOCATION HELPERS
// =====================================================

export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });
  });
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Haversine formula
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

export function isWithinRadius(
  userLat: number,
  userLon: number,
  venueLat: number,
  venueLon: number,
  radiusMeters: number = 100
): boolean {
  const distance = calculateDistance(userLat, userLon, venueLat, venueLon);
  return distance <= radiusMeters;
}

// =====================================================
// STRING HELPERS
// =====================================================

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatPermission(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

// =====================================================
// ARRAY HELPERS
// =====================================================

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

export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

// =====================================================
// VALIDATION HELPERS
// =====================================================

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

export function isValidZipCode(zip: string): boolean {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zip);
}

// =====================================================
// LOCAL STORAGE HELPERS
// =====================================================

export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function saveToLocalStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function removeFromLocalStorage(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

// =====================================================
// DEBOUNCE & THROTTLE
// =====================================================

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

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

// =====================================================
// ERROR HANDLING
// =====================================================

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unknown error occurred';
}

// =====================================================
// RANDOM GENERATORS
// =====================================================

export function generateConfirmationCode(length: number = 6): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${timestamp}${random}`;
}

// =====================================================
// ORDER HELPERS
// =====================================================

export function getNextOrderStatus(currentStatus: OrderStatus): OrderStatus | null {
  const statusFlow: Record<OrderStatus, OrderStatus | null> = {
    pending: 'preparing',
    preparing: 'ready',
    ready: 'served',
    served: null,
    cancelled: null
  };
  return statusFlow[currentStatus];
}

export function getOrderStatusButtonText(status: OrderStatus): string {
  const buttonText: Record<OrderStatus, string> = {
    pending: 'Start Preparing',
    preparing: 'Mark Ready',
    ready: 'Mark Served',
    served: 'Completed',
    cancelled: 'Cancelled'
  };
  return buttonText[status];
}

// =====================================================
// SOUND HELPERS
// =====================================================

export function playNotificationSound(): void {
  try {
    const audio = new Audio('/sounds/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(err => console.error('Error playing sound:', err));
  } catch (error) {
    console.error('Error initializing audio:', error);
  }
}

export function vibrate(pattern: number | number[] = 200): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

// =====================================================
// EXPORT ALL
// =====================================================

export default {
  cn,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatDate,
  formatTime,
  formatDateTime,
  formatOrderAge,
  formatDuration,
  getOrderStatusColor,
  getTableStatusColor,
  getStockStatus,
  getStockStatusColor,
  getPriorityColor,
  getPaymentMethodIcon,
  getPaymentMethodLabel,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  calculatePercentageChange,
  calculateTrendText,
  getCurrentPosition,
  calculateDistance,
  isWithinRadius,
  slugify,
  truncate,
  capitalize,
  formatPermission,
  groupBy,
  sortBy,
  unique,
  isValidEmail,
  isValidPhone,
  isValidZipCode,
  getFromLocalStorage,
  saveToLocalStorage,
  removeFromLocalStorage,
  debounce,
  throttle,
  getErrorMessage,
  generateConfirmationCode,
  generateOrderNumber,
  getNextOrderStatus,
  getOrderStatusButtonText,
  playNotificationSound,
  vibrate
};
