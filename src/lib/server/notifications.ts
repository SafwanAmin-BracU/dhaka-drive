import type { ServiceRequestDetail } from '$lib/types/service-request-approval';
import { REJECTION_REASON_LABELS } from '$lib/constants/admin';

/**
 * Notification helper module for service request approvals and rejections.
 * Provides functions to send notifications via email and in-app channels.
 */

interface NotificationPayload {
  recipientId: string;
  type: 'approval' | 'rejection';
  requestId: number;
  requestDetails?: Partial<ServiceRequestDetail>;
  rejectionReason?: string;
}

/**
 * Send an approval notification to a user.
 * Notification includes: approval confirmation and request details.
 *
 * @param userId - User ID to notify
 * @param requestDetails - Request details to include in notification
 * @returns Promise<boolean> - true if both email and in-app notifications sent successfully
 */
export async function sendApprovalNotification(
  userId: string,
  requestDetails: Partial<ServiceRequestDetail>
): Promise<boolean> {
  try {
    const emailSent = await sendEmailNotification({
      recipientId: userId,
      type: 'approval',
      requestId: requestDetails.id || 0,
      requestDetails,
    });

    const inAppSent = await sendInAppNotification({
      recipientId: userId,
      type: 'approval',
      requestId: requestDetails.id || 0,
      requestDetails,
    });

    return emailSent && inAppSent;
  } catch (error) {
    console.error('Error sending approval notification:', error);
    return false;
  }
}

/**
 * Send a rejection notification to a user.
 * Notification includes: rejection reason and next steps.
 *
 * @param userId - User ID to notify
 * @param requestId - Request ID that was rejected
 * @param rejectionReason - Reason for rejection (predefined)
 * @returns Promise<boolean> - true if both email and in-app notifications sent successfully
 */
export async function sendRejectionNotification(
  userId: string,
  requestId: number,
  rejectionReason: string
): Promise<boolean> {
  try {
    const reasonLabel = REJECTION_REASON_LABELS[rejectionReason] || rejectionReason;

    const emailSent = await sendEmailNotification({
      recipientId: userId,
      type: 'rejection',
      requestId,
      rejectionReason: reasonLabel,
    });

    const inAppSent = await sendInAppNotification({
      recipientId: userId,
      type: 'rejection',
      requestId,
      rejectionReason: reasonLabel,
    });

    return emailSent && inAppSent;
  } catch (error) {
    console.error('Error sending rejection notification:', error);
    return false;
  }
}

/**
 * Send an approval notification to a service provider.
 * Notification includes: request details and approval confirmation.
 *
 * @param providerId - Provider ID to notify
 * @param requestDetails - Request details to include
 * @returns Promise<boolean> - true if both notifications sent successfully
 */
export async function sendProviderApprovalNotification(
  providerId: string,
  requestDetails: Partial<ServiceRequestDetail>
): Promise<boolean> {
  try {
    const emailSent = await sendEmailNotification({
      recipientId: providerId,
      type: 'approval',
      requestId: requestDetails.id || 0,
      requestDetails,
    });

    const inAppSent = await sendInAppNotification({
      recipientId: providerId,
      type: 'approval',
      requestId: requestDetails.id || 0,
      requestDetails,
    });

    return emailSent && inAppSent;
  } catch (error) {
    console.error('Error sending provider approval notification:', error);
    return false;
  }
}

/**
 * Internal: Send email notification
 * TODO: Integrate with actual email service (SendGrid, Resend, etc.)
 */
async function sendEmailNotification(payload: NotificationPayload): Promise<boolean> {
  try {
    // TODO: Replace with actual email service
    console.log('[EMAIL NOTIFICATION]', payload);

    // Placeholder: simulate email sending
    // In production, call your email service API here
    // e.g., await sendgrid.send({ to: user.email, ... })

    return true;
  } catch (error) {
    console.error('Error sending email notification:', error);
    return false;
  }
}

/**
 * Internal: Send in-app notification
 * TODO: Integrate with actual in-app notification system (database, websocket, etc.)
 */
async function sendInAppNotification(payload: NotificationPayload): Promise<boolean> {
  try {
    // TODO: Replace with actual in-app notification system
    console.log('[IN-APP NOTIFICATION]', payload);

    // Placeholder: simulate in-app notification
    // In production, store notification in database or send via websocket
    // e.g., await db.insert(notifications).values({ ...payload })

    return true;
  } catch (error) {
    console.error('Error sending in-app notification:', error);
    return false;
  }
}
