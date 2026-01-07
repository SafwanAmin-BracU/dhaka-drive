# Phase 0: Research & Clarification

**Status**: Complete - No clarifications needed  
**Date**: 2026-01-07  
**Feature**: Save Service Provider from Booking Panel

## Executive Summary

All technical unknowns have been resolved through analysis of the existing codebase. The feature can proceed directly to Phase 1 design with high confidence.

---

## Research Findings

### 1. Database Layer - `savedProviders` Table

**Status**: ✅ CONFIRMED

The `savedProviders` table already exists in the schema with proper structure:

```typescript
export const savedProviders = pgTable("saved_providers", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  providerId: integer("provider_id")
    .references(() => serviceProviders.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

**Key Points**:
- Composite relationship: User → Provider (one-to-many)
- Foreign keys properly configured with cascade delete
- Timestamp tracks when provider was saved
- Table supports idempotent saves (unique constraint on userId + providerId not explicitly required, but application logic can handle duplicates)

**Implementation**: No schema migrations needed. Will use Drizzle ORM to interact with existing table.

---

### 2. Authentication Context

**Status**: ✅ CONFIRMED

Better Auth is properly configured and available throughout the application:

- Session/user data accessible via `event.locals` in route handlers
- Mock user function available in `$lib/server/auth.ts` during development
- All authenticated routes already use `event.locals.user` pattern
- User ID correctly typed as `string` (UUID from auth system)

**Pattern to Follow**:
```typescript
// In +server.ts form actions
const userId = event.locals.user?.id;
if (!userId) {
  return fail(401, { message: "Authentication required" });
}
```

**Implementation**: Use standard Better Auth session retrieval in all save/unsave operations.

---

### 3. Existing Booking Panel Structure

**Status**: ✅ CONFIRMED

The booking panel at `src/routes/app/services/book/[id]/+page.svelte` provides:

- Service provider data loaded from database
- Provider details (name, type, contact, address, rating)
- Form for appointment booking
- Error handling and loading states
- DaisyUI card-based layout

**Available Data for Save Button**:
- `data.provider.id` — providerId for save operation
- `data.provider.name` — for display in confirmations
- User session via `event.locals.user`

**Implementation**: Add save button component near provider info section or in card header.

---

### 4. Form Action Pattern

**Status**: ✅ CONFIRMED

SvelteKit form actions already established in project:

- `+server.ts` files handle POST/DELETE requests
- Form data validated via Zod schemas before mutations
- `fail()` for errors, `redirect()` for success
- Server functions in `$lib/server/[domain]/` handle business logic

**Pattern to Follow**:
```typescript
// In +server.ts
export const actions = {
  saveProvider: async (event) => {
    const data = await event.request.formData();
    // validate
    // call mutation
    // return result
  },
  unsaveProvider: async (event) => {
    // similar pattern
  }
};
```

**Implementation**: Create form action methods following established pattern.

---

### 5. Component Library & Styling

**Status**: ✅ CONFIRMED

- DaisyUI components available throughout codebase
- Button variants: `btn-primary` (saved), `btn-ghost` (unsaved)
- Toast/alert system via `FormAlert` component (used in forms throughout)
- Loading state patterns via `loading` boolean and button disable

**Button State Styling**:
- Saved: `btn btn-sm btn-primary` (filled, primary color)
- Unsaved: `btn btn-sm btn-ghost` (outline, neutral)
- Icon options: ❤️ heart, ⭐ star, 🔖 bookmark (DaisyUI supports emoji easily)

**Implementation**: Use DaisyUI buttons with conditional classes based on save state.

---

### 6. Server Logic Organization

**Status**: ✅ CONFIRMED

Existing structure in `$lib/server/services/`:

- `queries.ts` — Read operations (get saved providers, check if provider is saved)
- `mutations.ts` — Write operations (create/delete saved provider entries)

Both files properly typed and use Drizzle ORM.

**Pattern**:
```typescript
// queries.ts
export async function getProviderSaveStatus(userId: string, providerId: number) {
  return await db
    .select()
    .from(savedProviders)
    .where(and(eq(savedProviders.userId, userId), eq(savedProviders.providerId, providerId)))
    .limit(1);
}

// mutations.ts
export async function saveProvider(userId: string, providerId: number) {
  return await db
    .insert(savedProviders)
    .values({ userId, providerId })
    .onConflictDoNothing()
    .returning();
}
```

**Implementation**: Add these query/mutation functions to respective files.

---

### 7. Performance & Constraints

**Status**: ✅ CONFIRMED

- Edge-runtime compatible: No Node.js-only APIs required
- Database: Neon serverless already in use, supports Drizzle
- API Response: Simple boolean or object; <100ms expected
- Success Criteria SC-001 (2 second response) easily achievable

**Implementation**: No special optimization needed; standard patterns will meet performance targets.

---

### 8. Related Routes & Data Flow

**Status**: ✅ CONFIRMED

Existing saved providers UI at `src/routes/app/services/saved/+page.svelte`:

- Displays user's saved providers list
- Each provider has "Book Now" button linking to booking panel
- Can be modified to support remove action if needed

**Data Consistency**: Booking panel save operation updates same `savedProviders` table, so changes reflect immediately in saved providers list (assuming page refresh or real-time updates).

**Implementation**: No changes needed to saved providers list page; it will automatically reflect new saves.

---

## Design Decisions

### 1. Idempotent Save Operation

**Decision**: Use `onConflictDoNothing()` in Drizzle to handle duplicate save attempts gracefully.

**Rationale**: 
- User-friendly: No error if provider already saved; button just toggles back to "saved" state
- Meets FR-003 requirement for idempotent saves
- Simpler than explicit check-before-insert pattern

**Alternative Considered**: Explicit query-then-insert pattern — rejected because more complex and creates race conditions.

---

### 2. Button State Management

**Decision**: Fetch save status on page load and store in reactive state (`$state`).

**Rationale**:
- Meets FR-004 requirement for visual feedback
- Uses Svelte 5 runes (`$state`) per constitution
- Can support optimistic UI updates for instant feedback
- Reusable in SaveProviderButton component

**Alternative Considered**: Server-side render initial state in data prop — rejected because less responsive to async save operations.

---

### 3. Component Placement

**Decision**: SaveProviderButton component placed in booking panel card header/sidebar next to provider name.

**Rationale**:
- Meets FR-001 requirement for "prominent location"
- Doesn't interfere with booking form
- Follows DaisyUI card layout patterns
- Users see save option before committing to booking

**Alternative Considered**: Separate modal or bottom action bar — rejected because less accessible and creates extra navigation.

---

### 4. Form Action Location

**Decision**: Create actions in `src/routes/app/services/book/[id]/+server.ts`.

**Rationale**:
- Keeps save logic separate from booking form logic
- Can be called independently by SaveProviderButton component
- Follows SvelteKit patterns for form actions
- Easier to test and maintain

**Alternative Considered**: Extend existing +page.server.ts — rejected because mixing save/booking logic reduces separation of concerns.

---

## Implementation Confidence

**Overall Risk**: 🟢 LOW

**Confidence Factors**:
1. ✅ Database schema already exists and correct
2. ✅ Authentication pattern already established
3. ✅ Form action patterns well-established across codebase
4. ✅ Component library (DaisyUI) fully available
5. ✅ Similar save/bookmark patterns exist elsewhere (e.g., saving traffic reports)
6. ✅ No external dependencies required
7. ✅ No performance bottlenecks identified
8. ✅ No architectural conflicts identified

**Ready for Phase 1**: YES

All technical unknowns resolved. Feature is ready to proceed to design phase (data-model.md, contracts, quickstart.md).
