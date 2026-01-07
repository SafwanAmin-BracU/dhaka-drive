# Implementation Tasks: Admin Approval of Service Requests

**Branch**: `004-approve-service-requests`  
**Date**: 2026-01-07  
**Feature Spec**: [spec.md](./spec.md)  
**Implementation Guide**: [plan.md](./plan.md)  

---

## Overview

This task list breaks down the "Admin Approval of Service Requests" feature into independently executable tasks organized by user story and implementation phase.

**Total Tasks**: 24  
**Estimated Time**: 3-4 hours  
**Complexity**: Medium  
**MVP Scope**: User Stories 1-3 (P1 core approval workflow)

---

## Format Guide

- **[P]**: Task can run in parallel (different files, no dependencies on incomplete tasks)
- **[US#]**: User story this task belongs to (US1, US2, US3, US4, US5)
- Paths are SvelteKit-relative from `src/` root

---

## Phase 1: Setup & Prerequisites

### Database Schema & Migrations

- [ ] T001 Create migration file to add approval fields to `service_requests` table
  - Add columns: `approvedAt`, `rejectedAt`, `rejectionReason`, `approvedByAdminId` 
  - Add columns: `requestedDateTime`, `notes`
  - File: `drizzle/[new_migration].sql`

- [ ] T002 Update `requestStatusEnum` in `src/lib/drizzle/schema.ts` to include "Rejected" status
  - Modify: Add `"Rejected"` to enum values (currently: Pending, Accepted, Completed, Cancelled)

- [ ] T003 [P] Update `serviceRequests` table definition in `src/lib/drizzle/schema.ts`
  - Add new columns with proper types and defaults
  - Add foreign key: `approvedByAdminId → user.id`

---

## Phase 2: Foundational - Shared Infrastructure

### Types, Validation, Constants

- [ ] T004 [P] Create Zod validation schemas in `src/lib/types/service-request-approval.ts`
  - `approveRequestSchema`: { requestId, adminId }
  - `rejectRequestSchema`: { requestId, rejectionReason, customReason, adminId }
  - `getPendingRequestsSchema`: { sortBy, sortOrder, limit, offset }
  - Export all schemas for use in server code

- [ ] T005 [P] Create TypeScript types in `src/lib/types/service-request-approval.ts`
  - `ServiceRequestListItem` interface (for list display)
  - `ServiceRequestDetail` interface (for detail page)
  - `ApprovalResponse` interface (for API responses)
  - `RejectionResponse` interface (for rejection responses)
  - Export rejection reason constants: `REJECTION_REASONS = ['ProviderUnavailable', 'IncompleteInfo', 'UserUnresponsive', 'Other']`

- [ ] T006 [P] Create constants file `src/lib/constants/admin.ts`
  - Export request statuses mapping
  - Export rejection reason labels (human-readable versions)
  - Export service type icons/colors

### Authentication & Authorization

- [ ] T007 Add `requireAdmin()` helper to `src/lib/server/auth.ts`
  - Function: Checks `event.locals.user?.role === 'admin'`
  - Throws redirect(303, '/login') if not admin
  - Returns user object if admin

### Notification System Setup

- [ ] T008 Create notification helper in `src/lib/server/notifications.ts` (or extend existing)
  - `sendApprovalNotification(userId, requestDetails)` - in-app + email
  - `sendRejectionNotification(userId, rejectionReason)` - in-app + email
  - `sendProviderApprovalNotification(providerId, requestDetails)` - in-app + email
  - Assumes notification system infrastructure exists; wrapper functions only

---

## Phase 3: User Story 1 - View Pending Service Requests (Priority: P1)

**Goal**: Admin can see list of all pending service requests with key details and sort options  
**Manual Validation**: Navigate to `/app/admin/requests` → verify 5+ pending requests display with name, service type, date, provider info

### Server Layer - Queries

- [ ] T009 [P] [US1] Create `getPendingRequests()` query in `src/lib/server/services/queries.ts`
  - Query `service_requests` table with status = 'Pending'
  - Join with `user` table for requester name/email
  - Join with `service_providers` table for provider info
  - Support sorting by: submittedAt (default), serviceType, providerName
  - Support pagination: limit, offset
  - Return: Array of ServiceRequestListItem

- [ ] T010 [P] [US1] Create `getTotalPendingCount()` query in `src/lib/server/services/queries.ts`
  - Simple count of requests with status = 'Pending'
  - Used for pagination UI

### Component Layer

- [ ] T011 [P] [US1] Create `ServiceRequestList.svelte` component in `src/lib/components/`
  - Display pending requests in DaisyUI table with columns: Requester, Service Type, Requested Time, Provider, Submitted
  - Sortable headers (clicking header toggles sort order)
  - Show "No pending requests" message if empty (using DaisyUI `alert`)
  - Each row clickable (link to `/admin/requests/[id]`)
  - Props: `{requests: Array, total: number, isLoading: boolean}`
  - Use Svelte 5 runes: `$state` for sort state

### Route Layer

- [ ] T012 [US1] Create `src/routes/app/admin/requests/+page.server.ts`
  - Load action: Call `requireAdmin(event)` to verify permissions (FR-016)
  - Load action: Call `getPendingRequests()` with default sort (submittedAt, desc)
  - Return: `{ requests, total }`

- [ ] T013 [US1] Create `src/routes/app/admin/requests/+page.svelte`
  - Import and render `ServiceRequestList` component
  - Pass loaded requests data
  - Handle loading/error states with DaisyUI alerts

**Checkpoint**: Can navigate to `/app/admin/requests` and see pending requests list (US1 complete)

---

## Phase 4: User Story 2 - View Request Details (Priority: P1)

**Goal**: Admin can click request to see full details including user info, provider availability, notes  
**Manual Validation**: Click a request → detail page shows user info, provider details, notes, availability warning if applicable

### Server Layer - Queries

- [ ] T014 [P] [US2] Create `getRequestById()` query in `src/lib/server/services/queries.ts`
  - Query `service_requests` by id
  - Join with `user` table for requester details (name, email, phone if available)
  - Join with `service_providers` table for full provider info
  - Check provider availability at requested time (FR-007)
  - Return: ServiceRequestDetail object with all fields

### Component Layer

- [ ] T015 [P] [US2] Create `ServiceRequestDetails.svelte` component in `src/lib/components/`
  - Display in two columns (left: user info, right: provider info)
  - Show user: name, email, phone, location map
  - Show provider: name, type, contact, address, rating, availability warning (FR-007)
  - Show request: service type, requested date/time, notes in highlighted section
  - Show status: current approval status
  - Props: `{request: ServiceRequestDetail}`
  - All styling via DaisyUI (card, badge, alert)

### Route Layer

- [ ] T016 [US2] Create `src/routes/app/admin/requests/[id]/+page.server.ts`
  - Load action: Call `requireAdmin()` to verify permissions
  - Load action: Call `getRequestById(params.id)`
  - Handle 404 if request not found
  - Return: `{ request }`

- [ ] T017 [US2] Create `src/routes/app/admin/requests/[id]/+page.svelte`
  - Import and render `ServiceRequestDetails` component
  - Add "Back to List" link
  - Show placeholder for Approve/Reject buttons (implemented in US3)

**Checkpoint**: Can click request and view full details with provider info and availability status (US2 complete)

---

## Phase 5: User Story 3 - Approve Service Request (Priority: P1)

**Goal**: Admin can approve request with one click; user & provider are notified  
**Manual Validation**: Click Approve → request removed from list, user/provider receive notifications

### Server Layer - Mutations

- [ ] T018 [P] [US3] Create `approveRequest()` mutation in `src/lib/server/services/mutations.ts`
  - Update `service_requests`: set status = 'Accepted', approvedAt = now, approvedByAdminId = currentUserId
  - Use conditional update to prevent race conditions (WHERE status = 'Pending')
  - Log action to audit trail (if audit table exists)
  - Return: Updated request object or error
  - File: `src/lib/server/services/mutations.ts`

- [ ] T019 [US3] Create approval notification trigger in `src/lib/server/services/mutations.ts`
  - After successful approval, call `sendApprovalNotification()` for user (FR-010)
  - After successful approval, call `sendProviderApprovalNotification()` for provider (FR-011)
  - Ensure notifications sent within 10s requirement (SC-004)
  - Handle notification failures gracefully (log but don't block approval)

### Component Layer

- [ ] T020 [US3] Create `ApprovalModal.svelte` component in `src/lib/components/`
  - DaisyUI modal with title "Confirm Approval"
  - Show request summary (user name, service type, provider name)
  - "Cancel" button (closes modal)
  - "Approve" button (triggers approval)
  - Loading state on button during submission
  - Success/error messages via DaisyUI alerts

### Route Layer - API

- [ ] T021 [US3] Create `src/routes/app/admin/requests/[id]/+server.ts` POST handler
  - Validate auth: Call `requireAdmin()`
  - Parse request body
  - Validate input with `approveRequestSchema`
  - Call `approveRequest()` mutation
  - Return JSON response with success status and new request state (FR-008)
  - Handle errors: Return appropriate HTTP status codes (400 validation, 401 auth, 500 server)
  - File: `src/routes/app/admin/requests/[id]/+server.ts`

### Component Integration

- [ ] T022 [US3] Update `ServiceRequestDetails.svelte` to include Approve/Reject buttons
  - Add "Approve" button (btn-primary) that opens `ApprovalModal`
  - Button disabled if request status not "Pending"
  - After approval, show success toast and disable button
  - Update parent component reactively

**Checkpoint**: Can approve request from detail page; notifications sent; request moves from pending (US3 complete, P1 MVP functional)

---

## Phase 6: User Story 4 - Reject Service Request (Priority: P2)

**Goal**: Admin can reject request with predefined or custom reason; user notified  
**Manual Validation**: Click Reject → select reason → confirm → user notified, request shows in Rejected section

### Server Layer - Mutations

- [ ] T023 [P] [US4] Create `rejectRequest()` mutation in `src/lib/server/services/mutations.ts`
  - Update `service_requests`: set status = 'Rejected', rejectedAt = now, rejectionReason = provided reason, approvedByAdminId = currentUserId
  - Use conditional update (WHERE status = 'Pending') to prevent race conditions
  - Log action to audit trail
  - Return: Updated request object or error
  - File: `src/lib/server/services/mutations.ts`

- [ ] T024 [US4] Create rejection notification trigger in `src/lib/server/services/mutations.ts`
  - After successful rejection, call `sendRejectionNotification()` for user (FR-014)
  - Include rejection reason in notification
  - Ensure notifications sent within 10s requirement

### Component Layer

- [ ] T025 [US4] Create `RejectionReasonModal.svelte` component in `src/lib/components/`
  - DaisyUI modal with title "Reject Request"
  - Dropdown select for predefined reasons: "Provider not available", "Incomplete information", "User unresponsive", "Other"
  - Optional text field for custom explanation
  - "Cancel" button (closes modal)
  - "Reject" button (triggers rejection)
  - Loading state during submission
  - Validation: Reason required, custom text required if "Other" selected

### Route Layer - API

- [ ] T026 [US4] Extend `src/routes/app/admin/requests/[id]/+server.ts` POST handler
  - Add support for action='reject'
  - Parse and validate rejection input with `rejectRequestSchema`
  - Call `rejectRequest()` mutation
  - Return success response (FR-012, FR-013)

### Component Integration & History View

- [ ] T027 [US4] Create `RejectedRequestsList.svelte` component in `src/lib/components/`
  - Similar to `ServiceRequestList` but for rejected requests
  - Show: Requester, Service Type, Rejection Reason, Rejected Date
  - Display rejection reason prominently

- [ ] T028 [US4] Update `ServiceRequestDetails.svelte` to show rejection info if applicable
  - If status = 'Rejected', show rejection reason in highlighted alert
  - Hide Approve/Reject buttons for rejected requests

- [ ] T029 [US4] Update `src/routes/app/admin/requests/+page.server.ts` to load rejected requests
  - Add `getRejectedRequests()` query (status = 'Rejected')
  - Return both pending and rejected: `{ pendingRequests, rejectedRequests, ...}`

- [ ] T030 [US4] Update `src/routes/app/admin/requests/+page.svelte` to show both lists
  - Show pending list (default view)
  - Add tab or section to view rejected requests with reasons
  - Use DaisyUI tabs for switching between Pending/Rejected views

**Checkpoint**: Can reject request with reason selection; user notified; rejected requests appear in history (US4 complete, full approval/rejection workflow)

---

## Phase 7: Cross-Cutting Concerns & Polish

### Error Handling & Edge Cases

- [ ] T031 Handle provider availability conflicts gracefully
  - When availability has changed since request submitted, show warning but allow approval
  - Log conflict to audit trail for admin awareness

- [ ] T032 Implement race condition prevention for concurrent approvals
  - Use Drizzle's WHERE status = 'Pending' check to ensure only one approval succeeds
  - Return error if request already approved (SC-006)
  - Test by attempting simultaneous approvals

- [ ] T033 Add comprehensive error handling to all server functions
  - Validation errors: Return 400 with error message
  - Auth errors: Return 401
  - Not found: Return 404
  - Server errors: Log details, return 500 with generic message
  - Never expose internal error details to client

### Audit Logging

- [ ] T034 Create audit log entries for all approvals and rejections
  - Insert to `request_audit_log` table: requestId, adminId, action, reason, timestamp
  - Called from both `approveRequest()` and `rejectRequest()` mutations
  - File: `src/lib/server/services/mutations.ts`

- [ ] T035 Create audit log viewer component (optional for MVP)
  - Admin page to view all approval/rejection history
  - Filter by date range, admin, action type
  - Location: `src/routes/app/admin/audit/+page.svelte`

### Navigation & Integration

- [ ] T036 Add "Service Requests" link to admin dashboard
  - Update `src/routes/app/admin/+page.svelte`
  - Add link card pointing to `/admin/requests`
  - Show count of pending requests as badge

- [ ] T037 Update admin layout to include auth guard
  - Verify `src/routes/app/admin/+layout.server.ts` calls `requireAdmin()`
  - Redirect to login if not admin
  - Redirect to dashboard if admin tries to access non-admin routes

### Performance Optimization

- [ ] T038 Optimize queries with indexes
  - Add index on `service_requests.status` for faster pending query
  - Add index on `service_requests.approvedByAdminId` for audit queries
  - Update Drizzle schema if needed

- [ ] T039 Implement pagination for large request lists
  - Enforce max 50 requests per page
  - Add "Load More" or page buttons in UI
  - Update server load function to respect limit/offset

### Documentation

- [ ] T040 Update `quickstart.md` with validation walkthrough
  - Step-by-step: Create test request → Approve → Verify notifications
  - Screenshots or descriptions of each step

- [ ] T041 Document API contracts in `contracts/service-request.ts`
  - Export TypeScript interfaces for all endpoints
  - Include example request/response payloads

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies → Start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 completion → BLOCKS all user stories
- **Phase 3 (US1)**: Depends on Phase 2 → Can start after foundation ready
- **Phase 4 (US2)**: Depends on Phase 3 → Uses US1 components, extends queries
- **Phase 5 (US3)**: Depends on Phase 4 → Adds mutations and approval actions
- **Phase 6 (US4)**: Depends on Phase 5 → Adds rejection capability
- **Phase 7 (Polish)**: Depends on all desired phases → Final optimizations and documentation

### User Story Dependencies

| Story | Priority | Depends On | Can Start After |
|-------|----------|-----------|-----------------|
| US1: View List | P1 | Phase 2 | Phase 2 complete |
| US2: View Details | P1 | US1 | US1 complete |
| US3: Approve | P1 | US2 | US2 complete |
| US4: Reject | P2 | US3 | US3 complete |
| US5: Bulk Approve | P3 | US4 | US4 complete (future) |

### Within-Phase Parallelization

**Phase 1** (Setup):
- T001, T002, T003 can run in parallel (independent database changes)

**Phase 2** (Foundational):
- T004, T005, T006 can run in parallel (types/constants)
- T007 can run in parallel (auth helper)
- T008 can run in parallel (notification setup)

**Phase 3** (US1):
- T009, T010 can run in parallel (both queries)
- T011 can start after T009/T010 (depends on query functions)
- T012, T013 can run in parallel (route layer, depends on T011)

**Phase 5** (US3):
- T018, T019 can run in parallel (both mutations)
- T020 can start after T018/T019 (depends on mutation)
- T021, T022 can run in parallel (route and component integration)

### Parallel Example

If team has 3 developers:
1. **Developer A**: Phase 1 + Phase 2 (Setup + Foundation) - BLOCKER, must complete first
2. **After A completes**:
   - **Developer B**: Phase 3 (US1) - View list
   - **Developer C**: Phase 4 (US2) - View details (can wait for B) 
   - **Developer A**: Phase 5 (US3) - Approve (after C)

Or sequential if one developer:
1. Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7

---

## MVP Scope & Rollout

### Minimum Viable Product (US1 → US3)

Complete these phases to achieve MVP:
1. ✅ Phase 1: Setup (database ready)
2. ✅ Phase 2: Foundational (auth, types, notifications)
3. ✅ Phase 3: US1 (view pending requests)
4. ✅ Phase 4: US2 (view request details)
5. ✅ Phase 5: US3 (approve requests)

**At this point**: Admin can view pending requests and approve them with notifications sent to user/provider. This meets core user story and delivers business value.

### Enhanced Version (Add US4)

6. ✅ Phase 6: US4 (reject requests)

**Result**: Complete approval/rejection workflow with full lifecycle management.

### Future Enhancements (P3)

- Phase 7+: US5 (bulk operations), audit viewer, performance optimizations

---

## Success Metrics (from spec)

- **SC-001**: 95% of admins find management page on first attempt ✓ (intuitive /admin/requests route)
- **SC-002**: Load time for 50+ requests < 2s ✓ (optimized Drizzle queries with pagination)
- **SC-003**: Approval completion < 30s ✓ (simple one-click action)
- **SC-004**: 100% of approvals send notifications within 10s ✓ (synchronous notification calls)
- **SC-005**: 100% of actions logged to audit ✓ (T034 audit logging)
- **SC-006**: Zero duplicate approvals ✓ (T032 race condition prevention)

---

## Implementation Strategy

### Start Here

1. **T001-T003**: Database setup (15 min)
2. **T004-T008**: Foundational layer (45 min)
3. **T009-T013**: US1 complete (45 min)
4. **TEST**: Verify pending requests list works
5. **T014-T017**: US2 complete (30 min)
6. **TEST**: Verify details page works
7. **T018-T022**: US3 complete (45 min)
8. **TEST**: Verify approval works end-to-end
9. **DEMO MVP**: Show admin can approve requests

### Then Continue

10. **T023-T030**: US4 complete (60 min) - rejection workflow
11. **T031-T041**: Polish & documentation (60 min)

**Total Effort**: ~4 hours for MVP, ~6 hours for full feature

---

## Checklist for Completion

- [ ] All Phase 1 tasks (T001-T003) complete and database migrated
- [ ] All Phase 2 tasks (T004-T008) complete and tests pass
- [ ] All Phase 3 tasks (T009-T013) complete - US1 manually verified
- [ ] All Phase 4 tasks (T014-T017) complete - US2 manually verified
- [ ] All Phase 5 tasks (T018-T022) complete - US3 manually verified (MVP complete)
- [ ] All Phase 6 tasks (T023-T030) complete - US4 manually verified (full feature)
- [ ] All Phase 7 tasks (T031-T041) complete - polish & documentation
- [ ] Quickstart.md validation passes
- [ ] Code adheres to DhakaDrive constitution
- [ ] Ready for deployment
