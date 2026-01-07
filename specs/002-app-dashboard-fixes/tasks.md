# Tasks: App Dashboard & Auth Integration Fixes

**Input**: Design documents from `/specs/002-app-dashboard-fixes/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Automated tests are NOT required. Focus on manual validation.

**Organization**: Tasks are grouped by user story to enable independent implementation and manual verification of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Type definitions and infrastructure for auth integration

- [x] T001 [P] Update App.Locals interface with user/session types in src/app.d.ts
- [x] T002 [P] Create requireUser() helper function in src/lib/server/auth.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Session population in hooks - MUST be complete before ANY user story work

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Update hooks.server.ts to populate locals.user and locals.session via auth.api.getSession() in src/hooks.server.ts

**Checkpoint**: Foundation ready - auth infrastructure in place, user stories can begin

---

## Phase 3: User Story 1 - Authenticated User Data Access (Priority: P1) 🎯 MVP

**Goal**: Replace all hardcoded `userId: 1` with authenticated user's ID from session

**Manual Validation**: Log in as different users, create bookings/requests, verify database records have correct user IDs

### Implementation for User Story 1

- [x] T004 [P] [US1] Replace hardcoded userId with requireUser() in src/routes/app/parking/book/[id]/+page.server.ts
- [x] T005 [P] [US1] Replace hardcoded currentUserId with requireUser() in src/routes/app/parking/history/+page.server.ts
- [x] T006 [P] [US1] Replace hardcoded userId with requireUser() in src/routes/app/services/book/[id]/+page.server.ts
- [x] T007 [P] [US1] Replace hardcoded currentUserId with requireUser() in src/routes/app/services/history/+page.server.ts
- [x] T008 [P] [US1] Replace hardcoded userId with requireUser() in src/routes/app/services/request/+page.server.ts
- [x] T009 [P] [US1] Replace hardcoded currentUserId with requireUser() in src/routes/app/services/requests/+page.server.ts
- [x] T010 [P] [US1] Replace hardcoded currentUserId with requireUser() in src/routes/app/services/saved/+page.server.ts
- [x] T011 [P] [US1] Replace hardcoded userId with requireUser() in src/routes/app/traffic/report/new/+page.server.ts

**Checkpoint**: User Story 1 complete - all routes use authenticated user ID, ready for manual verification

---

## Phase 4: User Story 2 - Improved App Dashboard (Priority: P2)

**Goal**: Build comprehensive dashboard with quick actions, traffic summary, and recent activity

**Manual Validation**: Visit /app, verify 3 sections display (quick actions, traffic summary, recent activity), click cards to navigate

### Implementation for User Story 2

- [x] T012 [P] [US2] Create QuickActions.svelte component in src/lib/components/dashboard/QuickActions.svelte
- [x] T013 [P] [US2] Create TrafficSummary.svelte component in src/lib/components/dashboard/TrafficSummary.svelte
- [x] T014 [P] [US2] Create RecentActivity.svelte component in src/lib/components/dashboard/RecentActivity.svelte
- [x] T015 [US2] Update dashboard server load to fetch user's recent activity in src/routes/app/+page.server.ts
- [x] T016 [US2] Compose dashboard UI from components in src/routes/app/+page.svelte

**Checkpoint**: User Story 2 complete - dashboard shows quick actions, traffic summary, recent activity

---

## Phase 5: User Story 3 - Theme-Aware Admin Navbar (Priority: P3)

**Goal**: Update admin navbar to use DaisyUI theme-aware classes instead of hardcoded dark colors

**Manual Validation**: Visit /app/admin, verify navbar uses theme colors (bg-base-200 instead of bg-neutral)

### Implementation for User Story 3

- [x] T017 [US3] Replace bg-neutral with bg-base-200 and update text classes in src/routes/app/admin/+layout.svelte

**Checkpoint**: User Story 3 complete - admin navbar respects application theme

---

## Phase 6: Polish & Verification

**Purpose**: Final validation and type checking

- [x] T018 Run bun run check to verify no TypeScript errors
- [x] T019 Run quickstart.md verification steps for all user stories

**Note**: Pre-existing error in `parking/add/+page.server.ts` (ownerId type mismatch) is outside scope of this feature.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001, T002) - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (T003)
- **User Story 2 (Phase 4)**: Depends on Foundational (T003) - can run parallel with US1
- **User Story 3 (Phase 5)**: No dependencies on other stories - can run parallel
- **Polish (Phase 6)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Requires T001, T002, T003 complete - No dependencies on other stories
- **User Story 2 (P2)**: Requires T003 complete - May use requireUser() but independently testable
- **User Story 3 (P3)**: No auth dependencies - Can start after Phase 1

### Within Each User Story

- US1: All route tasks (T004-T011) can run in parallel [P]
- US2: Components (T012-T014) can run in parallel, then server (T015), then UI (T016)
- US3: Single task (T017)

### Parallel Opportunities

```text
After T003 completes:
├── US1: T004, T005, T006, T007, T008, T009, T010, T011 (all parallel)
├── US2: T012, T013, T014 (parallel), then T015, then T016
└── US3: T017 (can start anytime after Phase 1)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001, T002)
2. Complete Phase 2: Foundational (T003)
3. Complete Phase 3: User Story 1 (T004-T011)
4. **STOP and VALIDATE**: Log in, create booking, verify user ID in database
5. Deploy/demo if ready - auth integration working

### Incremental Delivery

1. Setup + Foundational → Auth infrastructure ready
2. Add User Story 1 → Verify → Deploy (MVP - data integrity fixed!)
3. Add User Story 2 → Verify → Deploy (improved UX)
4. Add User Story 3 → Verify → Deploy (visual polish)

---

## Notes

- All US1 tasks (T004-T011) modify different files → can run in parallel
- US2 components (T012-T014) are independent files → can run in parallel
- US3 is a single file change with no dependencies
- Commit after each task or logical group
- Run `bun run check` after completing each phase
