# Phase 1: Data Model & Validation

**Status**: Design Complete  
**Date**: 2026-01-07  
**Feature**: Save Service Provider from Booking Panel

## Entity Definitions

### SavedProvider

**Purpose**: Track which service providers are bookmarked by each user.

**Data Structure**:
```typescript
interface SavedProvider {
  id: number;                    // Primary key, auto-increment
  userId: string;                // Foreign key → user.id (UUID)
  providerId: number;            // Foreign key → serviceProviders.id
  createdAt: Date;              // Timestamp when provider was saved
}
```

**Database Table** (existing):
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

**Key Relationships**:
- One user → many saved providers (1:N)
- One service provider → many users who saved it (1:N)
- Cascade delete on user deletion (preserve provider if user deleted)

**Constraints**:
- Both userId and providerId are NOT NULL
- No explicit unique constraint; idempotency handled by application logic

---

### SaveProviderInput

**Purpose**: Validate and type data for save/unsave operations.

**Validation Schema**:
```typescript
export const saveProviderSchema = z.object({
  providerId: z.number().int().positive("Provider ID must be a positive integer"),
  action: z.enum(["save", "unsave"]).describe("Action to perform"),
});

export type SaveProviderInput = z.infer<typeof saveProviderSchema>;
```

**Validation Rules**:
1. `providerId` must be a positive integer
2. `action` must be either "save" or "unsave"
3. `userId` is retrieved from session (not from form input for security)

**Error Scenarios**:
- Missing or invalid `providerId` → HTTP 400 Bad Request
- Missing or invalid `action` → HTTP 400 Bad Request
- Missing user session → HTTP 401 Unauthorized
- Non-existent provider ID → HTTP 404 Not Found (application check)

---

### SaveProviderResponse

**Purpose**: Type API responses for save/unsave operations.

**Success Response**:
```typescript
export interface SaveProviderResponse {
  success: true;
  action: "save" | "unsave";
  providerId: number;
  message: string;                    // e.g., "Provider saved successfully"
  isSaved: boolean;                   // True if action was "save", false if "unsave"
}
```

**Error Response**:
```typescript
export interface SaveProviderErrorResponse {
  success: false;
  error: string;                      // Error message
  code: "UNAUTHORIZED" | "INVALID_INPUT" | "NOT_FOUND" | "SERVER_ERROR";
}
```

---

## State & Reactivity

### SaveProviderButton Component State

**Purpose**: Track save status and loading state in the UI component.

**State Variables** (Svelte 5 Runes):
```typescript
let isSaved = $state(false);           // Whether provider is currently saved
let isLoading = $state(false);         // Whether operation is in progress
let errorMessage = $state("");         // Error message if operation fails
```

**Initial State Logic**:
```typescript
// On component mount, fetch current save status
onMount(async () => {
  const status = await checkProviderSaveStatus(providerId);
  isSaved = status.isSaved;
});
```

**Derived State**:
```typescript
// Button appearance based on state
let buttonText = $derived(isSaved ? "Unsave" : "Save Provider");
let buttonClass = $derived(isSaved ? "btn btn-sm btn-primary" : "btn btn-sm btn-ghost");
let buttonDisabled = $derived(isLoading);
let buttonLoading = $derived(isLoading);
```

---

## Operations

### 1. Query: Check if Provider is Saved

**Purpose**: Determine save status for display.

**Function Signature**:
```typescript
export async function checkProviderSaveStatus(
  db: Database,
  userId: string,
  providerId: number
): Promise<{ isSaved: boolean; savedId?: number }>;
```

**Implementation Logic**:
1. Query `savedProviders` table
2. Filter by `userId` AND `providerId`
3. Return true if record exists, false otherwise
4. Return savedId if exists (for potential future delete operations)

**Database Query**:
```sql
SELECT id FROM saved_providers
WHERE user_id = $1 AND provider_id = $2
LIMIT 1;
```

**Performance**: O(1) with proper indexing on (userId, providerId)

---

### 2. Mutation: Save Provider

**Purpose**: Add provider to user's saved list.

**Function Signature**:
```typescript
export async function saveProvider(
  db: Database,
  userId: string,
  providerId: number
): Promise<SavedProvider | null>;
```

**Implementation Logic**:
1. Validate inputs via Zod schema
2. Check if provider exists (FK constraint prevents invalid IDs at DB level)
3. Attempt insert
4. Handle duplicate: Use `onConflictDoNothing()` for idempotency
5. Return created record or null if already existed

**Database Operation**:
```typescript
await db
  .insert(savedProviders)
  .values({
    userId,
    providerId,
    createdAt: new Date(),
  })
  .onConflictDoNothing()
  .returning();
```

**Idempotency**: Subsequent calls with same userId + providerId return gracefully (no error)

**Side Effects**: None (only creates single row, no cascade effects)

---

### 3. Mutation: Unsave Provider

**Purpose**: Remove provider from user's saved list.

**Function Signature**:
```typescript
export async function unsaveProvider(
  db: Database,
  userId: string,
  providerId: number
): Promise<{ deletedId: number } | null>;
```

**Implementation Logic**:
1. Validate inputs via Zod schema
2. Delete record matching userId AND providerId
3. Return deleted ID for confirmation, or null if nothing found
4. Idempotent: No error if record doesn't exist

**Database Operation**:
```typescript
await db
  .delete(savedProviders)
  .where(
    and(
      eq(savedProviders.userId, userId),
      eq(savedProviders.providerId, providerId)
    )
  )
  .returning({ id: savedProviders.id });
```

**Idempotency**: Subsequent calls with same userId + providerId succeed silently (no rows affected, no error)

**Side Effects**: None (only deletes single row)

---

## Validation Rules

### Input Validation (Zod)

```typescript
export const saveProviderSchema = z.object({
  providerId: z.number()
    .int("Provider ID must be an integer")
    .positive("Provider ID must be positive")
    .describe("ID of the service provider to save"),
  
  action: z.enum(["save", "unsave"])
    .describe("Whether to save or unsave the provider"),
});
```

### Business Logic Validation

1. **Authentication Check** (FR-009):
   - Reject if `userId` is missing (not authenticated)
   - Return HTTP 401 Unauthorized

2. **Provider Existence Check** (implicit via FK):
   - Database FK constraint on `providerId` → `serviceProviders.id`
   - Invalid provider ID rejected by database
   - Return HTTP 400 Bad Request

3. **Idempotency Check** (implicit via `onConflictDoNothing()`):
   - Duplicate save attempts handled gracefully
   - No error message; treated as successful no-op
   - Button state reflects actual database state

### State Consistency

- **After Save**: `isSaved = true`, button shows "Unsave", record exists in DB
- **After Unsave**: `isSaved = false`, button shows "Save Provider", record removed from DB
- **On Error**: `isSaved` reverts to previous value, error message displayed

---

## Error Handling

### HTTP Status Codes

| Scenario | Status | Response |
|----------|--------|----------|
| Success (save/unsave) | 200 OK | `{ success: true, ... }` |
| Missing/invalid input | 400 Bad Request | `{ success: false, code: "INVALID_INPUT" }` |
| Not authenticated | 401 Unauthorized | `{ success: false, code: "UNAUTHORIZED" }` |
| Provider not found | 404 Not Found | `{ success: false, code: "NOT_FOUND" }` |
| Server error | 500 Internal Server Error | `{ success: false, code: "SERVER_ERROR" }` |

### User-Facing Messages

**Success**:
- Save: "Provider saved! You can find it in your saved list."
- Unsave: "Provider removed from saved list."

**Errors**:
- Unauthorized: "Please log in to save providers."
- Invalid Input: "Something went wrong. Please try again."
- Server Error: "Unable to save provider. Please try again later."

---

## Data Persistence

### Storage Strategy

- **Primary Storage**: PostgreSQL `savedProviders` table (source of truth)
- **Session Cache**: Browser session storage or component state (UI responsiveness)
- **Optimistic UI**: Update button state immediately, revert on error

### Consistency Model

- **Eventual Consistency**: OK for this feature
- **Strong Consistency**: Maintained via form action → server mutation → immediate response
- **No distributed transactions**: Single table update, no cross-table dependencies

### Cascading Behavior

- User deletion: All saved providers deleted via FK cascade (OK, user gone)
- Provider deletion: FK constraint prevents deletion if saved by users (prevents orphaned records)
  - Solution: Update provider to `is_active = false` instead of deleting

---

## Testing Scenarios (Manual)

1. **Save new provider**: Button state changes to "Unsave", record created in DB
2. **Save duplicate**: Second save attempt shows "Unsave" (idempotent)
3. **Unsave provider**: Button state changes to "Save", record deleted from DB
4. **Unsave non-saved**: Second unsave attempt changes button to "Save" (idempotent)
5. **Toggle save state**: Save → Unsave → Save works without errors
6. **Unauthenticated access**: Redirects to login or shows "Please log in" error
7. **Saved list reflects changes**: After save, provider appears in `/app/services/saved`
8. **Network failure**: Error message shown, button state reverts

---

## Performance Characteristics

- **Query save status**: ~5ms (single index lookup)
- **Save operation**: ~10ms (single insert)
- **Unsave operation**: ~10ms (single delete)
- **SC-001 target (2 seconds)**: Easily achieved, actual time typically <100ms

---

## Migration Strategy

**No migrations required**: `savedProviders` table already exists in schema.

**Backward Compatibility**: ✅ 100% compatible; new feature adds to existing table without modifications.
