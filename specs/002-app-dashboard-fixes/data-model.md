# Data Model: App Dashboard & Auth Integration Fixes

**Feature**: 002-app-dashboard-fixes  
**Date**: 2026-01-07

## Overview

This feature does **not** introduce new database entities. It modifies how existing entities are accessed by replacing hardcoded user IDs with authenticated user IDs from the session.

## Affected Entities

### User (existing)

```
user
├── id: text (PK) - Used for userId references
├── name: text
├── email: text (unique)
├── emailVerified: boolean
├── image: text (nullable)
├── createdAt: timestamp
└── updatedAt: timestamp
```

**Change**: User ID is now retrieved from Better Auth session instead of hardcoded.

### Session (existing)

```
session
├── id: text (PK)
├── expiresAt: timestamp
├── token: text (unique)
├── userId: text (FK → user.id)
├── ipAddress: text (nullable)
└── userAgent: text (nullable)
```

**Change**: Session is populated in `event.locals` via `auth.api.getSession()`.

## Dashboard Data Aggregation

The dashboard displays aggregated views of existing entities:

### Traffic Summary View

```sql
-- Recent traffic incidents (limit 5)
SELECT * FROM traffic_news 
ORDER BY created_at DESC 
LIMIT 5
```

### Recent Bookings View

```sql
-- User's recent parking bookings (limit 5)
SELECT b.*, p.name, p.address 
FROM bookings b
JOIN parking_spots p ON b.parking_spot_id = p.id
WHERE b.user_id = :currentUserId
ORDER BY b.created_at DESC 
LIMIT 5
```

### Recent Service Requests View

```sql
-- User's recent service requests (limit 5)
SELECT sr.*, sp.name as provider_name, sp.type 
FROM service_requests sr
JOIN service_providers sp ON sr.provider_id = sp.id
WHERE sr.user_id = :currentUserId
ORDER BY sr.created_at DESC 
LIMIT 5
```

## Type Extensions

### App.Locals (app.d.ts)

```typescript
interface Locals {
  drizzle: dbRef;
  schema: schemaRef;
  user: User | null;      // NEW: From Better Auth session
  session: Session | null; // NEW: From Better Auth session
}
```

## No Schema Migrations Required

This feature only changes application logic, not database schema.
