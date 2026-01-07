# Implementation Plan: App Dashboard & Auth Integration Fixes

**Branch**: `002-app-dashboard-fixes` | **Date**: 2026-01-07 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-app-dashboard-fixes/spec.md`

## Summary

This feature replaces all hardcoded `userId: 1` values across 8+ routes with the authenticated user's ID from Better Auth session, builds an improved app dashboard with quick actions, traffic summary, and recent activity sections, and updates the admin navbar to use theme-aware DaisyUI classes.

## Technical Context

**Language/Version**: TypeScript 5.9 / Svelte 5  
**Primary Dependencies**: SvelteKit 2.0, Better Auth, Drizzle ORM, DaisyUI 5  
**Storage**: PostgreSQL (Neon) via Drizzle ORM  
**Testing**: Manual verification (per Constitution IX)  
**Target Platform**: Cloudflare Pages Edge runtime  
**Project Type**: Web application (SvelteKit)  
**Performance Goals**: Dashboard load < 2s, no N+1 queries  
**Constraints**: Edge-compatible, no Node.js-only APIs  
**Scale/Scope**: 8 routes to update, 1 new dashboard UI, 1 navbar fix

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Layered Architecture | ✅ PASS | Server logic will be in `$lib/server/`, routes are thin orchestrators |
| II. Type Safety | ✅ PASS | User session typed via `app.d.ts`, Zod validation for forms |
| III. Edge-Native | ✅ PASS | Better Auth compatible with edge, no Node.js APIs |
| IV. Component-Driven UI | ✅ PASS | Dashboard uses DaisyUI cards, stats, no custom CSS |
| V. Server Logic Abstraction | ✅ PASS | Auth helper in `$lib/server/auth.ts`, queries abstracted |
| VI. Route File Discipline | ✅ PASS | Routes import from server layer, no inline queries for new code |
| VII. Authentication Pattern | ✅ PASS | Uses Better Auth `auth.api.getSession()` via `locals` |
| VIII. Form Handling | N/A | No new forms in this feature |
| IX. Testing Strategy | ✅ PASS | Manual verification only |
| X. Documentation Authority | ✅ PASS | Better Auth patterns from context7 |

## Project Structure

### Documentation (this feature)

```text
specs/002-app-dashboard-fixes/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (N/A - no new entities)
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no new APIs)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── lib/
│   ├── server/
│   │   └── auth.ts              # NEW: requireUser() helper function
│   └── components/
│       └── dashboard/
│           ├── QuickActions.svelte    # NEW: Feature navigation cards
│           ├── TrafficSummary.svelte  # NEW: Incident overview widget
│           └── RecentActivity.svelte  # NEW: User's recent bookings/requests
├── routes/
│   └── app/
│       ├── +layout.server.ts    # MODIFY: Add session to layout data
│       ├── +page.server.ts      # MODIFY: Fetch dashboard data
│       ├── +page.svelte         # MODIFY: New dashboard UI
│       ├── admin/
│       │   └── +layout.svelte   # MODIFY: Theme-aware navbar
│       ├── parking/
│       │   ├── book/[id]/+page.server.ts  # MODIFY: Use session userId
│       │   └── history/+page.server.ts    # MODIFY: Use session userId
│       ├── services/
│       │   ├── book/[id]/+page.server.ts  # MODIFY: Use session userId
│       │   ├── history/+page.server.ts    # MODIFY: Use session userId
│       │   ├── request/+page.server.ts    # MODIFY: Use session userId
│       │   ├── requests/+page.server.ts   # MODIFY: Use session userId
│       │   └── saved/+page.server.ts      # MODIFY: Use session userId
│       └── traffic/
│           └── report/new/+page.server.ts # MODIFY: Use session userId
└── app.d.ts             # MODIFY: Add user/session to Locals interface
```

**Structure Decision**: Single web application following existing SvelteKit structure. New dashboard components in `$lib/components/dashboard/`. Auth helper in `$lib/server/auth.ts` per Constitution V.

## Complexity Tracking

No violations requiring justification.
