# Feature Specification: Admin Approval of Service Requests

**Feature Branch**: `004-approve-service-requests`  
**Created**: 2026-01-07  
**Status**: Draft  
**Input**: User description: "as an admin, I want to be able to approve the pending services requests of users"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Pending Service Requests (Priority: P1)

As an admin, I want to view a list of all pending service requests submitted by users so that I can review them and understand the current workload of requests awaiting approval.

**Why this priority**: This is the foundational capability - admins cannot approve requests they cannot see. Without a pending requests dashboard, the entire approval workflow is blocked.

**Independent Test**: Can be fully tested by logging in as an admin, navigating to the service requests management page, and verifying that all pending requests are displayed with relevant details (user name, service type, date submitted, provider availability, notes).

**Acceptance Scenarios**:

1. **Given** I am logged in as an admin, **When** I navigate to the service requests management page, **Then** I see a list of all requests with status "Pending"
2. **Given** there are pending service requests, **When** the page loads, **Then** each request displays: requester name, service type, requested date/time, and date submitted
3. **Given** I am viewing the pending requests list, **When** I sort by date submitted (newest first), **Then** most recent requests appear at the top
4. **Given** there are no pending requests, **When** I load the page, **Then** I see a "No pending requests" message with helpful guidance

---

### User Story 2 - View Request Details (Priority: P1)

As an admin, I want to click on a pending request to see full details including user information, provider availability, and any notes so that I can make an informed approval decision.

**Why this priority**: Admins need complete context to approve requests. Without viewing request details, they cannot verify user information, check provider availability, or understand special requirements in notes.

**Independent Test**: Can be fully tested by selecting a pending request from the list and verifying all relevant details are displayed: requester profile info, contact info, service provider details, availability conflicts, and request notes.

**Acceptance Scenarios**:

1. **Given** I am viewing a pending request in the list, **When** I click on it, **Then** a detailed view opens showing full request information
2. **Given** I am viewing request details, **Then** I see: user profile info, contact information, selected service provider (name, type, contact), requested service type, requested date/time, and any notes from user
3. **Given** I am reviewing request details, **When** provider availability is blocked at the requested time, **Then** a warning badge appears indicating "Provider may be unavailable"
4. **Given** I am viewing request details, **When** the request includes special notes from the user, **Then** notes are prominently displayed in a highlighted section

---

### User Story 3 - Approve Service Request (Priority: P1)

As an admin, I want to click an "Approve" button on a pending request to mark it as approved, which notifies the user and the service provider so that both parties can proceed with the booking.

**Why this priority**: This is the core approval action - without being able to approve requests, the admin cannot fulfill their primary responsibility.

**Independent Test**: Can be fully tested by selecting a pending request, clicking "Approve", and verifying: (1) request status changes to "Approved", (2) request is removed from pending list, (3) user receives notification, (4) service provider receives notification.

**Acceptance Scenarios**:

1. **Given** I am viewing a pending request details page, **When** I click the "Approve" button, **Then** the system marks the request as approved
2. **Given** I have approved a request, **When** the action completes, **Then** the request is removed from the pending list
3. **Given** I approve a request, **When** the approval processes, **Then** the user receives a notification that their request was approved
4. **Given** I approve a request, **When** the approval processes, **Then** the service provider receives a notification of the approved request with details

---

### User Story 4 - Reject Service Request (Priority: P2)

As an admin, I want to reject a pending request if it cannot be fulfilled (e.g., provider not available, insufficient information) so that users know their request was reviewed and notified of the decision.

**Why this priority**: While less critical than approval workflow, rejection capability prevents requests from sitting indefinitely and provides necessary user feedback. Supports complete request lifecycle management.

**Independent Test**: Can be fully tested by selecting a pending request, clicking "Reject", providing a reason, and verifying: (1) request status changes to "Rejected", (2) user is notified with rejection reason, (3) request appears in rejection history.

**Acceptance Scenarios**:

1. **Given** I am viewing a pending request details page, **When** I click the "Reject" button, **Then** a rejection reason modal appears
2. **Given** the rejection reason dialog is open, **When** I select a reason (e.g., "Provider not available", "Incomplete information") and click "Reject", **Then** the request is marked as rejected
3. **Given** I have rejected a request, **When** the action completes, **Then** the user receives a notification with the rejection reason
4. **Given** I reject a request, **When** viewing request history, **Then** rejected requests are visible with their rejection reasons in a separate "Rejected" section

---

### User Story 5 - Bulk Approval Actions (Priority: P3)

As an admin, I want to select multiple pending requests and approve them in bulk so that I can process simple requests more efficiently during high-volume periods.

**Why this priority**: Efficiency enhancement for handling multiple straightforward requests simultaneously. Valuable for high-traffic scenarios but not essential for MVP.

**Independent Test**: Can be fully tested by selecting 2+ requests via checkboxes, clicking "Approve Selected", and verifying all selected requests are marked approved and removed from pending list.

**Acceptance Scenarios**:

1. **Given** I am viewing the pending requests list, **When** I check multiple request checkboxes, **Then** bulk action buttons ("Approve All", "Reject All") appear
2. **Given** I have selected multiple requests, **When** I click "Approve All", **Then** all selected requests are marked approved
3. **Given** I bulk approve requests, **When** the action completes, **Then** each affected user receives an individual approval notification

---

### Edge Cases

- What happens when a request is approved but the service provider's availability has changed since the request was submitted?
- How does the system handle if an admin approves a request but the corresponding provider/user booking fails?
- What if a request is pending longer than X days - should it auto-expire or require manual handling?
- How should the system handle concurrent approvals if two admins approve the same request simultaneously?
- What if an approved request is later modified (e.g., provider availability changes) - should approval be invalidated?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow admins to access a dedicated "Service Requests" management page accessible from the admin dashboard
- **FR-002**: System MUST display all requests with status "Pending" on the pending requests list page
- **FR-003**: System MUST sort pending requests by submission date (newest first) by default, with ability to sort by other fields (status, service type)
- **FR-004**: System MUST display for each request in the list: requester name, service type, requested date/time, and submission date
- **FR-005**: System MUST allow admins to click a request to view its full details page
- **FR-006**: System MUST display on request details: user profile info, contact info, selected provider info, service type, requested time, notes, and current approval status
- **FR-007**: System MUST show a warning indicator if a provider's availability conflicts with the requested time
- **FR-008**: System MUST provide an "Approve" button on pending request details that marks the request as "Approved"
- **FR-009**: System MUST remove approved requests from the pending list after approval
- **FR-010**: System MUST trigger a notification to the user upon request approval with confirmation message
- **FR-011**: System MUST trigger a notification to the service provider upon request approval with request details
- **FR-012**: System MUST provide a "Reject" button on pending request details
- **FR-013**: System MUST show a rejection reason selection modal when "Reject" is clicked with predefined reasons (e.g., "Provider not available", "Incomplete information", "User unresponsive", "Other")
- **FR-014**: System MUST trigger a notification to the user upon rejection with the rejection reason
- **FR-015**: System MUST display rejected requests in a separate "Rejected" section with rejection reason visible
- **FR-016**: System MUST prevent non-admin users from accessing the service requests management page
- **FR-017**: System MUST persist all approval/rejection actions in an audit log with timestamp and admin user who performed the action
- **FR-018**: System MUST handle concurrent approval attempts (prevent double-approval via race conditions)

### Key Entities *(include if feature involves data)*

- **Service Request**: Represents a user's request for a service from a specific provider
  - Attributes: id, userId, serviceProviderId, requestedDateTime, notes, status (Pending/Approved/Rejected), submittedAt, approvedAt, rejectedAt, rejectedReason, approvedByAdminId
  - Relationships: belongs to User, belongs to ServiceProvider

- **Admin**: User with elevated permissions to manage service requests
  - Attributes: id, userId, role, permissions
  - Relationships: one User can be an Admin, one Admin can approve/reject multiple requests

- **Notification**: Message sent to user or provider about request status changes
  - Attributes: id, recipientId, recipientType (User/Provider), type (Approved/Rejected), requestId, message, sentAt
  - Relationships: belongs to ServiceRequest

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of admins successfully locate and open the pending requests management page on first attempt
- **SC-002**: Admins can view and filter 50+ pending requests without performance degradation (page load < 2 seconds)
- **SC-003**: Admins can approve a request and notify stakeholders in under 30 seconds (from click to notification sent)
- **SC-004**: 100% of approved requests trigger notifications to both user and provider within 10 seconds of approval
- **SC-005**: Audit log captures 100% of approval/rejection actions with admin identity and timestamp
- **SC-006**: Zero instances of duplicate approvals (race condition prevention validates 100% of concurrent attempts)

## Assumptions

- Admin users already exist in the system with an "admin" role assigned
- Service requests table already exists in the database
- Notification system is operational for sending approval/rejection notifications
- Better Auth session management is available to identify current admin user
- Service providers have availability tracking in the database

## Clarifications Resolved

**Q1: Rejection Reason Format** → **Decision: Both predefined + custom**
- Admins can quickly select from predefined reasons (Provider not available, Incomplete information, User unresponsive, Other)
- Optional text field allows custom explanation for edge cases
- Supports both fast processing and detailed feedback to users

**Q2: Request Retention Policy** → **Decision: Archive after 90 days**
- Approved/rejected requests remain visible and searchable for 90 days
- After 90 days, requests are archived (kept in database for compliance but hidden from default views)
- Balances audit requirements with performance and storage management

**Q3: Notification Channels** → **Decision: Email + In-app notifications**
- Users receive immediate in-app notification when request is approved/rejected
- Users also receive email notification for persistence and reach (especially for service providers who may not visit app frequently)
- Service providers receive both notification types for critical workflow updates
