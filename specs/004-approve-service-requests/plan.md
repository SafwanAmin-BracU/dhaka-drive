# Implementation Plan: Admin Approval of Service Requests

**Branch**: `004-approve-service-requests` | **Date**: 2026-01-07 | **Spec**: [spec.md](./spec.md)

## Summary

Enable admin users to review, approve, and reject pending service requests submitted by users. Admins can view all pending requests in a dashboard, click to see full details including user info, provider availability, and notes, then approve or reject with notifications sent to both user and provider. Rejection supports predefined reasons plus optional custom text. Approved/rejected requests remain visible for 90 days before archival.

**Primary Requirement**: FR-001 through FR-018 define a complete admin approval workflow with audit logging, race condition prevention, and dual-channel notifications (in-app + email).

---

## Technical Context

**Language/Version**: TypeScript with Svelte 5 | Node.js 20+  
**Primary Dependencies**: SvelteKit 2.0, Drizzle ORM, Better Auth, Neon PostgreSQL, DaisyUI + Tailwind CSS  
**Storage**: PostgreSQL (Neon) via Drizzle ORM - edge-native serverless driver  
**Target Platform**: SvelteKit running on Cloudflare Pages Edge runtime  
**Project Type**: SvelteKit web application (monorepo frontend + backend)  
**Performance Goals**: Page load < 2s (SC-002), approval completion < 30s (SC-003), notifications < 10s (SC-004)  
**Constraints**: Edge-runtime compatible (no Node.js-only APIs), Zod validation required, DaisyUI components only  
**Scale/Scope**: Support 50+ concurrent pending requests, 1000+ historical requests, multi-admin concurrent access

---

## Constitution Check

**GATE: Validate Architecture Against DhakaDrive Constitution**

✅ **PASS** - Layered Architecture: Service requests follow established pattern (queries/mutations in `$lib/server/services/`, components in `$lib/components/`, routes orchestrate)  
✅ **PASS** - Type Safety: All code uses TypeScript with Zod validation; no `any` types permitted  
✅ **PASS** - Edge-Native: Using Drizzle ORM with Neon serverless driver (edge-compatible); no Node.js-only APIs  
✅ **PASS** - Component-Driven UI: All UI uses DaisyUI components (btn, card, modal, table, badge); no custom CSS  
✅ **PASS** - Server Logic Abstraction: Database calls isolated in `$lib/server/services/` modules  
✅ **PASS** - Route File Discipline: Routes remain thin orchestrators, importing from server layer  
✅ **PASS** - Authentication: Better Auth session used for admin verification via `event.locals.user`  
✅ **PASS** - Role-Based Access: Admin routes use auth guard checking `user.role === 'admin'`  

**Pre-Phase 0 Assessment**: ✅ **ALL GATES PASS** - No constitution violations, no justification needed, ready for Phase 0 research.

---

## Project Structure

### Documentation (this feature)

```text
specs/004-approve-service-requests/
├── spec.md                 # ✅ Feature specification (COMPLETE)
├── plan.md                 # ✅ This file - Architecture & design
├── research.md             # Phase 0: Research unknowns & best practices
├── data-model.md           # Phase 1: Data models, schemas, validations
├── quickstart.md           # Phase 1: Implementation guide
├── contracts/              # Phase 1: API response types
│   └── service-request.ts
├── tasks.md                # Phase 2: Task breakdown (16 implementation tasks)
└── checklists/
    ├── plan.md             # Planning checklist
    └── requirements.md     # ✅ Requirements validation (COMPLETE)
```

### Source Code (repository)

**NEW FILES TO CREATE** (organized by layer per constitution):

```text
src/lib/
├── types/
│   └── service-request-approval.ts          # ✅ Zod schemas, response types
│
├── server/
│   ├── auth.ts                              # Add requireAdmin() helper
│   └── services/
│       ├── queries.ts                       # Add getPendingRequests, getRequestById, getRejectionReasons
│       └── mutations.ts                     # Add approveRequest, rejectRequest, updateRequestStatus
│
├── components/
│   ├── ServiceRequestList.svelte            # Pending requests table with sorting
│   ├── ServiceRequestDetails.svelte         # Full request details view
│   ├── ApprovalModal.svelte                 # Confirm approval dialog
│   └── RejectionReasonModal.svelte          # Reject dialog with predefined reasons
│
└── db/
    ├── schema/                              # MODIFY: Add request approval fields
    │   └── services.ts                      # Add approvedAt, rejectedAt, rejectionReason, approvedByAdminId
    │
    └── validation.ts                        # MODIFY: Add ApproveRequestInput schema

src/routes/
├── app/
│   └── admin/
│       ├── +layout.server.ts                # MODIFY: Add admin auth guard
│       ├── +page.svelte                     # Admin dashboard (link to requests)
│       ├── requests/
│       │   ├── +page.server.ts              # Load pending requests
│       │   ├── +page.svelte                 # Requests list page
│       │   ├── [id]/
│       │   │   ├── +page.server.ts          # Load request details
│       │   │   ├── +page.svelte             # Request details page
│       │   │   └── +server.ts               # POST approve/reject actions
│       │   └── +server.ts                   # GET pending requests (API for filtering)
│       └── notifications/
│           └── [id]/
│               └── +server.ts               # POST trigger notifications
```

**Structure Decision**: Single SvelteKit monorepo with admin feature branch under `/app/admin/requests/`. All database queries centralized in `$lib/server/services/`, all components in `$lib/components/`. Follows existing DhakaDrive patterns established by traffic, parking, and services modules.

---

## Data Model Overview

### Database Schema (NEW & MODIFIED)

**Existing Table**: `service_requests` (id, userId, providerId, issueDescription, status, userLocation, createdAt)

**MODIFICATIONS NEEDED**:
- Add `approvedAt: timestamp | null` - timestamp when admin approved
- Add `rejectedAt: timestamp | null` - timestamp when admin rejected
- Add `rejectionReason: text | null` - predefined or custom rejection reason
- Add `approvedByAdminId: text | null` - references user(id) for admin identity
- Add `requestedDateTime: timestamp | null` - when user wants the service (for appointment booking)
- Add `notes: text | null` - special notes/requirements from user
- Update `status` enum to support "Rejected" (currently: Pending, Accepted, Completed, Cancelled)

**Existing Table**: `user` (no changes, already has id for admin identification)

**NEW TABLE**: `request_audit_log` (optional - can track all actions for compliance)
- id (serial pk)
- requestId (int fk to service_requests)
- adminId (text fk to user)
- action (enum: Approved, Rejected)
- reason (text) - optional rejection reason
- timestamp (timestamp default now)

### Validation Schemas (Zod)

```typescript
// Request approval input
approveRequestSchema: z.object({
  requestId: z.number().int().positive(),
  adminId: z.string().min(1),
})

// Request rejection input
rejectRequestSchema: z.object({
  requestId: z.number().int().positive(),
  rejectionReason: z.enum(['ProviderUnavailable', 'IncompleteInfo', 'UserUnresponsive', 'Other']),
  customReason: z.string().optional(),
  adminId: z.string().min(1),
})

// Get pending requests filter
getPendingRequestsSchema: z.object({
  sortBy: z.enum(['submittedAt', 'serviceType', 'providerName']).default('submittedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  limit: z.number().int().positive().max(100).default(50),
  offset: z.number().int().nonnegative().default(0),
})
```

---

## API Contracts

### GET /app/admin/requests
**Purpose**: Fetch pending service requests list for admin dashboard  
**Auth**: Admin only (via Better Auth session)  
**Query Params**: `sortBy`, `sortOrder`, `limit`, `offset`  
**Response**:
```typescript
{
  success: true,
  data: {
    requests: Array<{
      id: number,
      userId: string,
      userName: string,
      serviceType: 'Mechanic' | 'Towing' | 'CarWash' | 'Emergency' | 'Fuel',
      requestedDateTime: ISO8601,
      submittedAt: ISO8601,
      providerName: string,
      notes: string,
      status: 'Pending' | 'Approved' | 'Rejected'
    }>,
    total: number,
    hasMore: boolean
  }
}
```

### GET /app/admin/requests/[id]
**Purpose**: Fetch full details of a specific request  
**Auth**: Admin only  
**Response**:
```typescript
{
  success: true,
  data: {
    id: number,
    userId: string,
    userName: string,
    userEmail: string,
    userPhone: string,
    serviceType: string,
    providerId: number,
    providerName: string,
    providerType: string,
    providerContact: string,
    providerAvailabilityConflict: boolean, // warning flag
    requestedDateTime: ISO8601,
    notes: string,
    issueDescription: string,
    userLocation: { lat, lon },
    status: 'Pending' | 'Approved' | 'Rejected',
    approvedAt: ISO8601 | null,
    rejectedAt: ISO8601 | null,
    rejectionReason: string | null,
    approvedByAdmin: { id, name, email } | null
  }
}
```

### POST /app/admin/requests/[id]/+server.ts
**Purpose**: Approve or reject a service request  
**Auth**: Admin only  
**Body**:
```typescript
{
  action: 'approve' | 'reject',
  rejectionReason?: 'ProviderUnavailable' | 'IncompleteInfo' | 'UserUnresponsive' | 'Other',
  customReason?: string
}
```
**Response**:
```typescript
{
  success: boolean,
  message: string,
  data?: {
    requestId: number,
    newStatus: 'Approved' | 'Rejected',
    notificationsSent: { user: boolean, provider: boolean }
  },
  error?: string
}
```

---

## Implementation Phases

### Phase 0: Research *(Resolve Unknowns)*

**Research Tasks**:
1. ✅ Verify `service_requests` table schema and status enum values
2. ✅ Confirm Better Auth session structure for admin role checking
3. ✅ Verify notification system (email + in-app) is operational
4. ✅ Check for existing audit logging patterns in codebase
5. ✅ Validate DaisyUI table and modal components available
6. ✅ Review Drizzle query patterns for concurrent access safety

**Output**: `research.md` documenting all findings and best practices

### Phase 1: Design & Schema *(Generate contracts, data models, quickstart)*

**Deliverables**:
- `data-model.md` - Entity definitions, schema modifications, validation rules
- `contracts/service-request.ts` - TypeScript types for all API responses
- `quickstart.md` - Step-by-step implementation guide
- Database migration plan (schema changes)

**Key Decisions**:
- Rejection reasons: Predefined list + optional custom text field
- Notifications: Email + in-app (both channels)
- Request archival: Hide after 90 days (keep in DB for compliance)
- Concurrent approvals: Use DB-level unique constraint + optimistic locking

### Phase 2: Implementation Tasks *(TBD by speckit.tasks)*

16 tasks organized by:
- **T001-T005**: Setup (database schema, auth helper, types, constants)
- **T006-T009**: Server layer (queries, mutations, validation, notification triggers)
- **T010-T013**: Component layer (list, details, approval modal, rejection modal)
- **T014-T016**: Routes & integration (list page, details page, actions)
- **T017-T020**: Verification & edge cases (concurrent access, error handling, audit logging)

---

## Complexity Justification

No constitution violations identified. Architecture adheres to all principles:
- ✅ Layered (queries/mutations separate, components reusable, routes thin)
- ✅ Type-safe (Zod validation on all inputs)
- ✅ Edge-compatible (Drizzle + Neon serverless)
- ✅ DaisyUI-first (table, modal, button, badge components)
- ✅ Server logic abstracted (no DB calls in routes)

---

## Success Metrics (from spec)

- **SC-001**: 95% of admins can locate and open management page on first attempt
- **SC-002**: Load time for 50+ requests < 2 seconds
- **SC-003**: Approval completion (click to notifications sent) < 30 seconds
- **SC-004**: 100% of approvals trigger user + provider notifications within 10s
- **SC-005**: 100% of actions logged to audit trail with admin ID + timestamp
- **SC-006**: Zero duplicate approvals (concurrent attempt prevention at DB level)

---

## Next Steps

1. **Run `/speckit.plan` Phase 0**: Generate `research.md` to validate technical assumptions
2. **Run `/speckit.plan` Phase 1**: Generate `data-model.md`, `contracts/`, `quickstart.md`
3. **Run `/speckit.tasks`**: Generate task breakdown with dependencies and estimates
4. **Begin Implementation**: Execute tasks in order, following `quickstart.md` pattern

**Status**: ✅ Ready for Phase 0 research
