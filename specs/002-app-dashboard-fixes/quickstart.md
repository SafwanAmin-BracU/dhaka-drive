# Quickstart: App Dashboard & Auth Integration Fixes

**Feature**: 002-app-dashboard-fixes  
**Date**: 2026-01-07

## Prerequisites

- Node.js 18+ or Bun runtime
- PostgreSQL database with existing schema
- Better Auth configured with Google OAuth
- Environment variables set (DATABASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)

## Implementation Order

### Phase 1: Auth Infrastructure (P1 - Critical)

1. **Update `app.d.ts`** - Add user/session types to Locals interface
2. **Update `hooks.server.ts`** - Populate locals with session data
3. **Create `$lib/server/auth.ts`** - Add `requireUser()` helper

### Phase 2: Route Updates (P1 - Critical)

Update these files to use `requireUser(locals)` instead of hardcoded `userId: 1`:

| Route | File | Change |
|-------|------|--------|
| Parking Book | `src/routes/app/parking/book/[id]/+page.server.ts` | Replace `userId: 1` in action |
| Parking History | `src/routes/app/parking/history/+page.server.ts` | Replace `currentUserId = 1` |
| Service Book | `src/routes/app/services/book/[id]/+page.server.ts` | Replace `userId: 1` in action |
| Service History | `src/routes/app/services/history/+page.server.ts` | Replace `currentUserId = 1` |
| Service Request | `src/routes/app/services/request/+page.server.ts` | Replace `userId: 1` in action |
| Service Requests | `src/routes/app/services/requests/+page.server.ts` | Replace `currentUserId = 1` |
| Saved Providers | `src/routes/app/services/saved/+page.server.ts` | Replace `currentUserId = 1` |
| Traffic Report | `src/routes/app/traffic/report/new/+page.server.ts` | Replace `userId: 1` in action |

### Phase 3: Dashboard UI (P2)

1. **Create dashboard components** in `$lib/components/dashboard/`:
   - `QuickActions.svelte` - Navigation cards for Traffic, Parking, Services
   - `TrafficSummary.svelte` - Recent incidents widget
   - `RecentActivity.svelte` - User's recent bookings and requests

2. **Update `src/routes/app/+page.server.ts`** - Fetch dashboard data
3. **Update `src/routes/app/+page.svelte`** - Compose dashboard from components

### Phase 4: Admin Navbar (P3)

1. **Update `src/routes/app/admin/+layout.svelte`** - Replace `bg-neutral` with `bg-base-200`

## Verification Steps

### Auth Integration

```bash
# 1. Start dev server
bun run dev

# 2. Log in via Google OAuth at /auth
# 3. Create a parking booking at /app/parking/book/1
# 4. Check database: booking should have your user ID, not "1"
```

### Dashboard

```bash
# 1. Navigate to /app
# 2. Verify: Quick action cards visible (Traffic, Parking, Services)
# 3. Verify: Traffic summary shows recent incidents
# 4. Verify: Recent activity shows your bookings/requests
```

### Admin Navbar

```bash
# 1. Navigate to /app/admin
# 2. Verify: Navbar uses theme colors (not hardcoded dark)
# 3. Verify: Active tab is highlighted appropriately
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/app.d.ts` | Type definitions for App.Locals |
| `src/hooks.server.ts` | Session population in handle hook |
| `src/lib/server/auth.ts` | Auth helper functions |
| `src/routes/app/+page.svelte` | Dashboard UI composition |
| `src/routes/app/admin/+layout.svelte` | Admin navigation layout |

## Rollback Plan

If issues arise:

1. Revert `hooks.server.ts` changes to restore original behavior
2. Routes will fall back to needing manual `userId` handling
3. Dashboard can be reverted to map-only view
