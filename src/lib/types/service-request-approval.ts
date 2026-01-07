import { z } from 'zod';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

export const approveRequestSchema = z.object({
  requestId: z.number().int().positive('Request ID must be a positive number'),
  adminId: z.string().min(1, 'Admin ID is required'),
});

export const rejectRequestSchema = z.object({
  requestId: z.number().int().positive('Request ID must be a positive number'),
  rejectionReason: z.enum(
    ['ProviderUnavailable', 'IncompleteInfo', 'UserUnresponsive', 'Other'],
    { message: 'Invalid rejection reason' }
  ),
  customReason: z.string().optional(),
  adminId: z.string().min(1, 'Admin ID is required'),
});

export const getPendingRequestsSchema = z.object({
  sortBy: z.enum(['submittedAt', 'serviceType', 'providerName']).default('submittedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  limit: z.number().int().positive().max(100).default(50),
  offset: z.number().int().nonnegative().default(0),
});

// ============================================================================
// TYPESCRIPT TYPES & INTERFACES
// ============================================================================

export interface ServiceRequestListItem {
  id: number;
  userId: string;
  userName: string;
  userEmail: string;
  serviceType: string;
  requestedDateTime: Date | null;
  submittedAt: Date | null;
  providerName: string;
  providerType: string;
  notes: string | null;
  status: 'Pending' | 'Accepted' | 'Completed' | 'Cancelled' | 'Rejected';
}

export interface ServiceRequestDetail {
  id: number;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  userLocation?: { lat: number; lon: number };
  
  serviceType: string;
  issueDescription: string;
  providerId: number | null;
  providerName: string | null;
  providerType: string | null;
  providerContact: string | null;
  providerAddress: string | null;
  providerRating: number | null;
  providerAvailabilityConflict: boolean;
  
  requestedDateTime: Date | null;
  notes: string | null;
  
  status: 'Pending' | 'Accepted' | 'Completed' | 'Cancelled' | 'Rejected';
  submittedAt: Date | null;
  approvedAt: Date | null;
  rejectedAt: Date | null;
  rejectionReason: string | null;
  approvedByAdmin?: { id: string; name: string; email: string } | null;
}

export interface ApprovalResponse {
  success: boolean;
  message: string;
  data?: {
    requestId: number;
    newStatus: 'Accepted';
    notificationsSent: { user: boolean; provider: boolean };
  };
  error?: string;
}

export interface RejectionResponse {
  success: boolean;
  message: string;
  data?: {
    requestId: number;
    newStatus: 'Rejected';
    rejectionReason: string;
    notificationsSent: { user: boolean; provider: boolean };
  };
  error?: string;
}

export interface GetPendingRequestsResponse {
  success: boolean;
  data: {
    requests: ServiceRequestListItem[];
    total: number;
    hasMore: boolean;
  };
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const REJECTION_REASONS = {
  ProviderUnavailable: 'Provider not available',
  IncompleteInfo: 'Incomplete information',
  UserUnresponsive: 'User unresponsive',
  Other: 'Other',
} as const;

export const REJECTION_REASON_VALUES = Object.keys(REJECTION_REASONS) as Array<keyof typeof REJECTION_REASONS>;

export type RejectionReason = keyof typeof REJECTION_REASONS;

// Type exports for form data
export type ApproveRequestInput = z.infer<typeof approveRequestSchema>;
export type RejectRequestInput = z.infer<typeof rejectRequestSchema>;
export type GetPendingRequestsInput = z.infer<typeof getPendingRequestsSchema>;
