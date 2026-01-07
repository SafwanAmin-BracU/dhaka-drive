# Research: App Dashboard & Auth Integration Fixes

**Feature**: 002-app-dashboard-fixes  
**Date**: 2026-01-07

## Research Tasks Resolved

### 1. Better Auth Session Integration in SvelteKit

**Decision**: Populate `event.locals.user` and `event.locals.session` in the `handle` hook by calling `auth.api.getSession()`.

**Rationale**: Better Auth's `svelteKitHandler` does NOT automatically populate locals. The session must be explicitly fetched and assigned in `hooks.server.ts`. This is the documented pattern from Better Auth's SvelteKit integration guide.

**Alternatives considered**:

- Call `auth.api.getSession()` in every route file → Rejected: DRY violation, repetitive code
- Use middleware/layout to fetch session → Rejected: Still requires hook setup for proper typing

**Implementation Pattern**:

```typescript
// hooks.server.ts
export async function handle({ event, resolve }) {
  const session = await auth.api.getSession({
    headers: event.request.headers,
  });
  
  if (session) {
    event.locals.session = session.session;
    event.locals.user = session.user;
  }
  
  return svelteKitHandler({ event, resolve, auth, building });
}
```

### 2. User ID Access Pattern

**Decision**: Create a `requireUser()` helper in `$lib/server/auth.ts` that extracts user ID from `locals.user` and throws redirect if not authenticated.

**Rationale**: Centralizes auth check logic, provides consistent error handling, follows Constitution V (Server Logic Abstraction).

**Alternatives considered**:

- Inline `if (!locals.user) redirect()` in every route → Rejected: Repetitive, error-prone
- Use layout-level protection only → Rejected: Insufficient for form actions, direct API calls

**Implementation Pattern**:

```typescript
// $lib/server/auth.ts
import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export function requireUser(locals: App.Locals): string {
  if (!locals.user?.id) {
    throw redirect(303, '/auth');
  }
  return locals.user.id;
}
```

### 3. Dashboard Data Requirements

**Decision**: Fetch dashboard data in `+page.server.ts` with three parallel queries:

1. Traffic incidents (from existing layout data, limit 5)
2. Recent bookings for current user (limit 5)
3. Recent service requests for current user (limit 5)

**Rationale**: Parallel queries minimize latency. Limited results prevent over-fetching. User-specific data filtered by authenticated user ID.

**Alternatives considered**:

- Fetch all data in layout → Rejected: Constitution directive "No over-fetching in layouts"
- Client-side data fetching → Rejected: Slower initial load, requires loading states

### 4. Admin Navbar Theming

**Decision**: Replace hardcoded `bg-neutral text-neutral-content` with `bg-base-200 text-base-content` for theme awareness.

**Rationale**: DaisyUI semantic colors (`base-100`, `base-200`, `base-content`) automatically adapt to the active theme. This follows Constitution IV (Component-Driven UI).

**Alternatives considered**:

- Use `bg-primary` → Rejected: Too prominent, admin nav should be subtle
- Use custom CSS variables → Rejected: Constitution forbids custom CSS

### 5. Type Safety for User Session

**Decision**: Extend `App.Locals` in `app.d.ts` to include `user` and `session` properties with proper Better Auth types.

**Rationale**: TypeScript requires explicit typing for `locals` properties. Using Better Auth's exported types ensures consistency.

**Type Definition**:

```typescript
// app.d.ts
import type { Session, User } from 'better-auth/types';

declare global {
  namespace App {
    interface Locals {
      drizzle: import("$lib/drizzle").dbRef;
      schema: import("$lib/drizzle").schemaRef;
      user: User | null;
      session: Session | null;
    }
  }
}
```

## Dependencies Identified

| Dependency | Version | Purpose |
|------------|---------|---------|
| better-auth | existing | Session management, user authentication |
| drizzle-orm | existing | Database queries for dashboard data |
| DaisyUI | existing | Theme-aware UI components |

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Session type mismatch | Low | Medium | Import types directly from better-auth |
| Performance regression on dashboard | Medium | Low | Limit queries to 5 results, use parallel fetching |
| Breaking existing routes | Medium | High | Test each route after userId replacement |
