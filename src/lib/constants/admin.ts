/**
 * Admin-related constants for request approval workflow
 */

export const REQUEST_STATUSES = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  REJECTED: 'Rejected',
} as const;

export const REQUEST_STATUS_LABELS: Record<string, string> = {
  'Pending': '⏳ Pending',
  'Accepted': '✅ Accepted',
  'Completed': '✓ Completed',
  'Cancelled': '✗ Cancelled',
  'Rejected': '❌ Rejected',
};

export const REJECTION_REASON_LABELS: Record<string, string> = {
  'ProviderUnavailable': 'Provider not available',
  'IncompleteInfo': 'Incomplete information',
  'UserUnresponsive': 'User unresponsive',
  'Other': 'Other reason',
};

export const SERVICE_TYPE_ICONS: Record<string, string> = {
  'Mechanic': '🔧',
  'Towing': '🚛',
  'CarWash': '🚿',
  'Emergency': '🚨',
  'Fuel': '⛽',
};

export const SERVICE_TYPE_COLORS: Record<string, string> = {
  'Mechanic': 'badge-info',
  'Towing': 'badge-warning',
  'CarWash': 'badge-success',
  'Emergency': 'badge-error',
  'Fuel': 'badge-secondary',
};

export const APPROVAL_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 100;
export const DEFAULT_SORT_BY = 'submittedAt';
export const DEFAULT_SORT_ORDER = 'desc';

// Notification timing constants
export const NOTIFICATION_TIMEOUT_MS = 2000; // Show notifications for 2 seconds
export const APPROVAL_TIMEOUT_S = 30; // Approval should complete within 30 seconds (SC-003)
export const NOTIFICATION_DELIVERY_TIMEOUT_S = 10; // Notifications should be sent within 10 seconds (SC-004)
