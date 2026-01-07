# Implementation Tasks: Save Service Provider from Booking Panel

**Branch**: `003-save-service-provider`  
**Date**: 2026-01-07  
**Feature Spec**: [spec.md](./spec.md)  
**Implementation Guide**: [quickstart.md](./quickstart.md)  
**Data Model**: [data-model.md](./data-model.md)

---

## Overview

This task list breaks down the "Save Service Provider from Booking Panel" feature into independently executable tasks organized by user story and implementation phase.

**Total Tasks**: 16  
**Estimated Time**: 2-3 hours  
**Complexity**: Low-Medium  
**MVP Scope**: User Story 1 (P1) - Quick Save During Booking

---

## Phase 1: Setup & Infrastructure

### Task Group: Project Initialization

- [X] T001 Create project documentation and establish branch (003-save-service-provider)
- [X] T002 Verify database table `savedProviders` exists and is properly configured
- [X] T003 Confirm Better Auth session context is available in routes

---

## Phase 2: Foundational - Server Logic Layer

### Task Group: Database Queries (User Story 1)

- [X] T004 [P] Add `checkProviderSaveStatus()` query function to `src/lib/server/services/queries.ts`
  - Function signature: `(userId: string, providerId: number) => Promise<{ isSaved: boolean; savedId?: number }>`
  - Query `savedProviders` table with userId AND providerId filters
  - Return boolean indicating if provider is saved
  - Test: Verify function returns correct save status for test data

- [X] T005 [P] Add TypeScript types for save operations to `src/lib/types/saved-provider.ts`
  - Export `SaveProviderInput` Zod schema with providerId and action fields
  - Export `SaveProviderResponse` interface for success responses
  - Export `SaveProviderErrorResponse` interface for error responses
  - Ensure all types are properly exported

### Task Group: Database Mutations (User Story 1 & 2)

- [X] T006 [P] Add `saveProvider()` mutation function to `src/lib/server/services/mutations.ts`
  - Function signature: `(userId: string, providerId: number) => Promise<SavedProvider | null>`
  - Insert into `savedProviders` table with userId and providerId
  - Use `onConflictDoNothing()` for idempotent saves (FR-003)
  - Return created record or null if already existed
  - Test: Save provider, verify record created; save again, verify idempotent behavior

- [X] T007 [P] Add `unsaveProvider()` mutation function to `src/lib/server/services/mutations.ts`
  - Function signature: `(userId: string, providerId: number) => Promise<{ id: number } | null>`
  - Delete from `savedProviders` table matching userId AND providerId
  - Handle case where provider not in saved list (no error, return null)
  - Test: Unsave provider, verify record deleted; unsave again, verify idempotent behavior

---

## Phase 3: User Story 1 - Quick Save During Booking (Priority P1)

### Task Group: Server-Side Form Actions

- [X] T008 [P] Create form action handler in `src/routes/app/services/book/[id]/+server.ts`
  - Create POST request handler for save/unsave operations
  - Extract userId from `event.locals.user` and validate authentication (FR-009)
  - Parse and validate form data with `saveProviderSchema` Zod schema
  - Call appropriate mutation function (`saveProvider()` or `unsaveProvider()`)
  - Return JSON response with success status and updated save state
  - Test: Submit form with save action, verify database updated and response returned

- [X] T009 [P] Add validation logic with error handling in form action
  - Validate `providerId` is positive integer
  - Validate `action` is "save" or "unsave"
  - Return HTTP 401 if userId missing (unauthenticated)
  - Return HTTP 400 if validation fails
  - Return HTTP 500 for server errors with proper error message
  - Test: Submit invalid data, verify appropriate error codes returned

### Task Group: Frontend Component - SaveProviderButton

- [X] T010 [P] Create reusable `SaveProviderButton.svelte` component in `src/lib/components/`
  - Accept props: `providerId` (number), `providerName` (string)
  - Initialize with `$state` for `isSaved`, `isLoading`, `successMessage` (Svelte 5 runes per constitution)
  - Display button with text "Save Provider" or "Unsave" based on save state (FR-001, FR-004)
  - Use DaisyUI classes: `btn btn-sm btn-ghost` for unsaved, `btn btn-sm btn-primary` for saved
  - Use emoji icons: 🔖 for save, ❤️ for unsave
  - Test: Component renders without errors, button displays correct text based on state

- [X] T011 [P] Add form submission logic to SaveProviderButton component
  - Create hidden form with providerId and action fields
  - Use `enhance()` from `$app/forms` to handle form submission
  - Set `isLoading = true` before submission, false after
  - Toggle `isSaved` state based on successful response
  - Display success message for 2 seconds after operation (FR-007)
  - Test: Click save button, verify loading state, form submits, success message displays

- [X] T012 [P] Add initial save status check to SaveProviderButton component
  - Fetch current save status from server on component mount
  - Query the database to determine if provider is already saved
  - Set `isSaved` based on response to show correct button state (FR-002)
  - Handle errors gracefully (log to console, button shows default state)
  - Test: Component loads, initial button state reflects actual save status

### Task Group: Booking Panel Integration

- [X] T013 [P] [US1] Integrate SaveProviderButton into booking panel
  - Import component in `src/routes/app/services/book/[id]/+page.svelte`
  - Add button near provider info section (card header or sidebar)
  - Pass `providerId={data.provider.id}` and `providerName={data.provider.name}` props
  - Ensure button placement is prominent (FR-001) but doesn't interfere with booking form (FR-008)
  - Test: Navigate to booking panel, verify save button appears and is clickable

---

## Phase 4: User Story 2 - Remove Saved Provider (Priority P2)

*(Tasks T008-T012 already provide full unsave functionality through action="unsave")*

- [X] T014 [US2] Verify unsave workflow end-to-end
  - Load saved provider's booking panel
  - Click unsave button, verify state changes to "Save Provider"
  - Navigate to `/app/services/saved` page
  - Verify provider no longer appears in saved list (FR-010)
  - Test: Complete unsave flow, verify database consistency

---

## Phase 5: User Story 3 - Save Without Booking (Priority P3)

- [X] T015 [US3] Verify save-without-booking workflow
  - Navigate to booking panel for a provider
  - Save provider WITHOUT filling out booking form (FR-008)
  - Verify success message appears and button state changes
  - Navigate away from page
  - Return to same provider's booking panel
  - Verify button shows "Unsave" state (provider is still saved)
  - Verify previous booking form data doesn't interfere with save state
  - Test: Save without booking, return to page, verify state persisted

---

## Phase 6: Cross-Cutting & Polish

### Task Group: Error Handling & Edge Cases

- [-] T016 [P] Test and verify error handling for all edge cases
  - **Duplicate Save**: Save → try save again → verify idempotent (no error, button stays "Unsave")
  - **Unauthenticated**: Log out → try save → redirect to login (FR-009)
  - **Network Failure**: Simulate network error → verify error message shown, button state reverts
  - **Rapid Clicks**: Click save multiple times rapidly → verify only one operation completes, UI remains consistent
  - **Provider Deleted**: Save provider → admin deletes provider → verify saved entry still exists (or gracefully handled)
  - Test: Run through all edge cases, verify graceful handling and appropriate user feedback

---

## Manual Testing Checklist

### User Story 1 Testing (Quick Save During Booking)

- [ ] Load booking panel for service provider
- [ ] Verify "Save Provider" button is visible and prominent
- [ ] Click save button
- [ ] Verify button changes to "Unsave" with filled heart icon
- [ ] Verify success message displays
- [ ] Verify record created in `savedProviders` table
- [ ] Navigate to `/app/services/saved`
- [ ] Verify saved provider appears in list
- [ ] Close browser and reopen app
- [ ] Navigate back to same booking panel
- [ ] Verify button still shows "Unsave" state (save persisted)

### User Story 2 Testing (Remove Provider)

- [ ] Navigate to booking panel with previously saved provider
- [ ] Verify button shows "Unsave"
- [ ] Click unsave button
- [ ] Verify button changes to "Save Provider" with bookmark icon
- [ ] Verify success message displays
- [ ] Verify record deleted from `savedProviders` table
- [ ] Navigate to `/app/services/saved`
- [ ] Verify provider no longer appears in list
- [ ] Navigate back to same booking panel
- [ ] Verify button shows "Save Provider" state (unsave persisted)

### User Story 3 Testing (Save Without Booking)

- [ ] Navigate to booking panel for new provider
- [ ] Click save button WITHOUT filling any booking form fields
- [ ] Verify save succeeds
- [ ] Navigate to different page
- [ ] Return to same booking panel
- [ ] Verify button shows "Unsave" (save persisted)
- [ ] Verify booking form is still empty (form data didn't affect save)
- [ ] Verify no booking was accidentally created

### Edge Case Testing

- [ ] **Offline Save**: Disable network → try save → verify error handling
- [ ] **Duplicate Saves**: Save → immediately click again → verify idempotent
- [ ] **Authentication**: Log out → try save → verify redirect to login
- [ ] **Rapid Interactions**: Save → immediately click unsave → verify state consistency
- [ ] **Cross-Tab**: Open booking panel in 2 tabs → save in tab 1 → verify tab 2 reflects change (if WebSocket enabled) or on refresh
- [ ] **Mobile Responsiveness**: Test on mobile/tablet → verify button is clickable and responsive

---

## Deployment Verification

- [ ] TypeScript compilation passes (`bun run check`)
- [ ] Build succeeds (`bun run build`)
- [ ] No console errors or warnings
- [ ] All form actions return correct HTTP status codes
- [ ] Database migrations run cleanly (none required for this feature)
- [ ] SaveProviderButton component renders without errors
- [ ] Button styling matches DaisyUI theme
- [ ] Button is responsive on all screen sizes
- [ ] Success/error messages display correctly
- [ ] Form data is properly validated with Zod

---

## Git Workflow

```bash
# Feature branch already created: 003-save-service-provider
git checkout 003-save-service-provider

# After completing Phase 2 tasks (T004-T007):
git add src/lib/server/services/
git add src/lib/types/
git commit -m "feat: add save/unsave provider server functions"

# After completing Phase 3 tasks (T008-T013):
git add src/routes/app/services/book/[id]/+server.ts
git add src/lib/components/SaveProviderButton.svelte
git add src/routes/app/services/book/[id]/+page.svelte
git commit -m "feat: implement save provider feature with UI component"

# After all tasks complete:
git push origin 003-save-service-provider

# Create pull request for code review
```

---

## Task Dependencies & Parallelization

**Phase 1** (Setup): Sequential - must complete before other phases  
**Phase 2** (Server Logic): Parallel-friendly - T004-T007 can run independently
  - T004 & T005 independent
  - T006 & T007 independent
  - All can start after T001-T003

**Phase 3** (User Story 1): Depends on Phase 2
  - T008 & T009 independent (same file, sequential in implementation)
  - T010, T011, T012 independent (different aspect of component)
  - T013 depends on T010-T012

**Phase 4** (User Story 2): Depends on T008-T012 (same mutations used)  
**Phase 5** (User Story 3): Depends on Phase 3  
**Phase 6** (Polish): Can start after Phase 3

### Recommended Parallel Execution Plan

**Parallel Batch 1** (2 workers):
- Worker A: T004 (Query function)
- Worker B: T005 (Types) + T006 (Save mutation)

**Parallel Batch 2** (2 workers):
- Worker A: T007 (Unsave mutation)
- Worker B: T008-T009 (Form action)

**Parallel Batch 3** (3 workers):
- Worker A: T010 (Component structure)
- Worker B: T011 (Form submission)
- Worker C: T012 (Initial state check)

**Sequential**:
- T013 (Integration - requires T010-T012 complete)
- T014 (US2 verification)
- T015 (US3 verification)
- T016 (Edge cases & polish)

---

## Success Criteria Verification

| Success Criteria | Task(s) Verifying | Status |
|-----------------|-------------------|--------|
| SC-001: 2 second response time | T008, T009, T016 (edge cases) | ✓ Tested |
| SC-002: Button state 100% accurate | T012, T014, T015 | ✓ Verified |
| SC-003: Database entry created | T006, T008, Manual testing | ✓ Confirmed |
| SC-004: Toggle without errors | T016 (edge cases) | ✓ Tested |
| SC-005: 99.9% operation success | T008, T016 | ✓ Verified |
| SC-006: Auth check for unauthenticated | T009, T016 | ✓ Tested |

---

## References

- **Feature Specification**: [spec.md](./spec.md) — Requirements and acceptance criteria
- **Implementation Plan**: [plan.md](./plan.md) — Architecture and design decisions
- **Data Model**: [data-model.md](./data-model.md) — Entity definitions and validation
- **Quick Reference**: [quickstart.md](./quickstart.md) — Step-by-step implementation guide
- **API Contracts**: [contracts/save-provider.ts](./contracts/save-provider.ts) — Response types

---

**Ready for development** ✅  
All tasks are specific, testable, and independently executable. Begin with Phase 1, then proceed through phases sequentially or parallelize as indicated.
