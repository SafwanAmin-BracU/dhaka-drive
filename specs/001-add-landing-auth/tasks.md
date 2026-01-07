# Tasks: Add Landing and Auth Pages

**Input**: Design documents from `/specs/001-add-landing-auth/`
**Prerequisites**: plan.md ✓, spec.md ✓

**Tests**: Automated tests are NOT required. Focus on manual validation.

**Organization**: Tasks are grouped by user story to enable independent implementation and manual verification of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Project type**: SvelteKit web application
- **Components**: `src/lib/components/`
- **Routes**: `src/routes/`
- **Styles**: `src/lib/app.css`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization - components directory already exists

- [x] T001 Verify project structure and dependencies are ready (run `bun install` if needed)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core components that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Create Navbar component with auth-aware buttons in src/lib/components/Navbar.svelte
  - Display DhakaDrive branding on right
  - Accept `isAuthenticated` prop (boolean, defaults to false)
  - Show login button on left when `isAuthenticated = false`
  - Show profile button on left when `isAuthenticated = true`
  - Use DaisyUI navbar classes
  - Add WCAG AA accessibility: ARIA labels, keyboard navigation, focus states

**Checkpoint**: Foundation ready - navbar component in place, user story implementation can begin

---

## Phase 3: User Story 1 - View Landing Page (Priority: P1) 🎯 MVP

**Goal**: User visits root route (/) and sees landing page with navbar showing login/profile button based on auth status

**Manual Validation**:

1. Visit <http://localhost:5173/>
2. Verify landing page displays with navbar
3. Verify login button visible on left (when not authenticated)
4. Verify page loads in under 2 seconds

### Implementation for User Story 1

- [x] T003 [US1] Create server load function in src/routes/+page.server.ts
  - Return placeholder `isAuthenticated: false` (TODO: replace with Better Auth)
- [x] T004 [US1] Update landing page in src/routes/+page.svelte
  - Import global CSS from `$lib/app.css`
  - Import and include Navbar component directly (pass `isAuthenticated` from data)
  - Add welcoming hero section for DhakaDrive
  - Include call-to-action for login/signup
  - Add loading state skeleton
  - Ensure WCAG AA accessibility (semantic HTML, proper headings, contrast)

**Checkpoint**: User Story 1 complete - landing page with navbar fully functional and manually verified

---

## Phase 4: User Story 2 - Access Auth Page (Priority: P2)

**Goal**: User navigates to /auth and sees auth page; authenticated users redirected to landing

**Manual Validation**:

1. Visit <http://localhost:5173/auth>
2. Verify auth page displays with form placeholder
3. Verify page loads successfully

### Implementation for User Story 2

- [x] T005 [P] [US2] Create auth page server load in src/routes/auth/+page.server.ts
  - Check authentication status
  - Redirect to `/` if already authenticated
  - Return page data for unauthenticated users
- [x] T006 [US2] Create auth page in src/routes/auth/+page.svelte
  - Import global CSS from `$lib/app.css`
  - Import and include Navbar component directly (pass `isAuthenticated` from data)
  - Display auth form placeholder (login/signup UI)
  - Include loading state
  - Include error state handling
  - Ensure WCAG AA accessibility

**Checkpoint**: User Story 2 complete - auth page works independently, redirect logic in place

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting both user stories

- [x] T007 [P] Verify navbar real-time update capability (reactive to auth state changes)
- [x] T008 [P] Run accessibility audit on both pages (keyboard navigation, screen reader)
- [x] T009 Manual verification of all acceptance scenarios from spec.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Story 2 (Phase 4)**: Depends on Foundational phase completion (can run parallel to US1)
- **Polish (Phase 5)**: Depends on both user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1

### Within Each User Story

- Server load before page component
- Core implementation before polish

### Parallel Opportunities

- T005 and T003/T004 can run in parallel (different route folders)
- T007 and T008 can run in parallel

---

## Parallel Example: After Foundational Complete

```text
# Once Phase 2 is done, both stories can proceed in parallel:
Developer A: T003 → T004 (User Story 1)
Developer B: T005 → T006 (User Story 2)
Developer B: T007 → T008 (User Story 2)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002)
3. Complete Phase 3: User Story 1 (T003, T004)
4. **STOP and VALIDATE**: Manually verify landing page with navbar
5. Deploy/demo if ready - this is a functional MVP!

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Verify independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Verify independently → Deploy/Demo
4. Polish phase → Final validation

---

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 9 |
| User Story 1 Tasks | 2 |
| User Story 2 Tasks | 2 |
| Foundational Tasks | 1 |
| Parallel Opportunities | 3 tasks marked [P] |
| MVP Scope | Phase 1-3 (User Story 1) |

## Notes

- **No root layout created** - each public page includes Navbar directly to avoid /app inheriting from root
- Authentication logic is placeholder (`isAuthenticated: false`) - actual auth implemented separately
- Navbar button click handlers not implemented (future feature)
- All pages use DaisyUI for consistent styling with existing app
- WCAG AA compliance required for all new components
