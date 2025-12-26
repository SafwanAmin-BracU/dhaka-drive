<!--
SYNC IMPACT REPORT
Version change: 1.0.0 -> 2.1.0
Modified principles:
  - I. Schema-Driven Development → I. Layered Architecture (expanded to full separation of concerns)
  - II. Strict Type Safety → II. Type Safety & Validation (added Zod requirement)
  - III. Edge-Native Architecture → III. Edge-Native Architecture (unchanged)
  - IV. Modular & Reactive UI → IV. Component-Driven UI (expanded with component library mandate)
  - V. Feature Isolation → V. Server Logic Abstraction (new: server query/mutation pattern)
  - NEW: VI. Route File Discipline
  - NEW: VII. Authentication Pattern
  - NEW: VIII. Form Handling Standard
Added sections:
  - Architectural Directives (detailed layer responsibilities)
  - Naming Conventions (comprehensive table)
  - Route Structure Principles (hierarchy, groups, layouts)
  - State Management (server, client, URL state)
  - Error Handling (error type matrix)
  - Utility Guidelines (required utilities)
  - Constants (centralization mandate)
  - Component Contracts (required components)
  - Performance Directives
  - Security Directives
  - Code Quality Standards
  - Feature Checklist
Removed sections: Testing Gates
Templates requiring updates:
  - plan-template.md: Constitution Check should reference new principles ✅ (generic reference maintained)
  - spec-template.md: No changes needed ✅
  - tasks-template.md: No changes needed ✅
Follow-up TODOs: None
-->

# DhakaDrive Constitution

**Dhaka Drive** is a SvelteKit urban mobility platform providing traffic reporting, parking management, and vehicle service assistance for Dhaka, Bangladesh.

---

## Core Principles

### I. Layered Architecture

Code MUST be organized into distinct layers with explicit responsibilities:

| Layer | Location | Responsibility |
|-------|----------|----------------|
| Database Schema | `$lib/db/schema/` | Table definitions, enums, relations |
| Validation | `$lib/db/validation.ts` | Zod schemas derived from Drizzle tables |
| Server Logic | `$lib/server/[domain]/` | Queries and mutations—NEVER in route files |
| Components | `$lib/components/` | Reusable UI—NEVER inline route-specific markup |
| Utilities | `$lib/utils/` | Pure functions (date formatting, geo calculations) |
| Routes | `src/routes/` | Thin orchestration—calls server functions, composes components |

**Rationale**: Separation of concerns enables independent testing, reduces coupling, and makes the codebase navigable. Route files should be thin orchestrators, not business logic containers.

### II. Type Safety & Validation

TypeScript is mandatory for all code. The following rules are non-negotiable:

- `any` types are FORBIDDEN unless strictly justified with a comment
- Form data MUST be validated through Zod schemas before database operations
- NEVER use `as` type assertions on user input—parse through Zod instead
- Interfaces and types MUST be shared via `$lib/types/` or `app.d.ts`

**Rationale**: Runtime validation catches malformed data at system boundaries. Zod schemas derived from Drizzle tables ensure database and validation are always in sync.

### III. Edge-Native Architecture

All server-side code MUST be compatible with Cloudflare Pages Edge runtime:

- Avoid Node.js-only dependencies or APIs (like `fs`)
- Use Neon's serverless driver (`@neondatabase/serverless`)
- Build-time scripts may use Node.js but MUST be clearly separated

**Rationale**: Edge deployment provides low-latency responses globally. Non-compatible code will fail at runtime.

### IV. Component-Driven UI

UI MUST be composed from reusable components:

- Check `$lib/components/` before creating inline markup
- If a UI pattern appears twice, it MUST be extracted to a component
- Svelte 5 runes (`$state`, `$derived`, `$bindable`) for reactivity
- Tailwind utility classes and DaisyUI components for styling
- NO inline styles or custom CSS except in rare justified cases

**Rationale**: Component reuse ensures visual consistency, reduces bugs, and accelerates development. DaisyUI provides accessible, tested primitives.

### V. Server Logic Abstraction

Database interactions MUST flow through dedicated server modules:

```
$lib/server/
├── auth.ts              # getCurrentUser, requireAuth, requireAdmin
├── traffic/
│   ├── queries.ts       # Read operations
│   └── mutations.ts     # Write operations
├── parking/
│   ├── queries.ts
│   └── mutations.ts
└── services/
    ├── queries.ts
    └── mutations.ts
```

Route files are consumers only—they import and call these functions.

**Rationale**: Centralizing database logic enables unit testing without HTTP, makes queries reusable across routes, and keeps route files focused on request/response handling.

### VI. Route File Discipline

**`+page.server.ts` MUST:**

- Import and call functions from `$lib/server/`
- NEVER contain raw SQL or direct Drizzle queries inline
- Validate form data using Zod schemas before mutations
- Return structured errors via `fail()`

**`+page.svelte` MUST:**

- Compose UI from `$lib/components/`
- Handle loading and error states explicitly
- NEVER duplicate UI patterns that exist elsewhere

**Empty load functions are FORBIDDEN.** If a page needs no data, remove the `+page.server.ts` file entirely.

**Rationale**: Thin route files are easier to review, test, and maintain. Empty files add noise and suggest incomplete implementation.

### VII. Authentication Pattern

Until authentication is fully implemented, use a centralized mock:

```typescript
// $lib/server/auth.ts
export function getCurrentUserId(): number {
    // TODO: Replace with session-based auth
    return 1;
}
```

**All user ID references MUST call this function**—NEVER hardcode `userId: 1` inline.

Protected routes MUST check auth in layout or page server load.

**Rationale**: Centralized mock enables easy replacement when real auth is added. Hardcoded IDs scattered through the codebase are impossible to find and fix.

### VIII. Form Handling Standard

1. Form submits to SvelteKit action
2. Action validates with Zod schema
3. On validation failure: `return fail(400, { message, ...preservedFields })`
4. On success: call mutation function, then redirect or return success
5. Every form page MUST render `FormAlert` component for feedback

**Rationale**: Consistent form handling reduces bugs and ensures users always receive feedback on their actions.

---

## Technical Standards

### Technology Stack

| Component | Technology |
|-----------|------------|
| Language | TypeScript / Svelte 5 |
| Meta-Framework | SvelteKit 2.0 |
| Database | PostgreSQL (Neon) with PostGIS |
| ORM | Drizzle ORM |
| Styling | Tailwind CSS v4 + DaisyUI |
| Maps | MapLibre GL via `svelte-maplibre` |
| Package Manager | Bun |
| Deployment | Cloudflare Pages |
| CI/CD | GitLab CI |

### Naming Conventions

| Entity | Convention | Examples |
|--------|------------|----------|
| Components | PascalCase | `TabNav.svelte`, `StatusBadge.svelte` |
| Utility files | camelCase | `date.ts`, `geo.ts` |
| Server modules | camelCase | `queries.ts`, `mutations.ts` |
| DB tables | snake_case | `parking_spots`, `traffic_reports` |
| DB columns | snake_case | `created_at`, `is_verified` |
| Route folders | kebab-case | `parking/available/`, `traffic/report/` |
| TypeScript types | PascalCase | `ParkingSpot`, `CreateBookingInput` |
| Constants | SCREAMING_SNAKE | `DEFAULT_CENTER`, `MAP_STYLE` |

### Route Structure

```
/app                          # Dashboard
/app/[feature]                # Feature overview (landing/CTA page)
/app/[feature]/[action]       # List or create
/app/[feature]/[action]/[id]  # Item-specific operations
```

**Route Groups:**

- `(admin)/` — Admin-only pages with auth guard in layout
- `(features)/` — User-facing feature modules

### Database Schema Organization

Schema files MUST be split by domain:

- `schema/enums.ts` — Shared PostgreSQL enums
- `schema/traffic.ts` — Traffic tables
- `schema/parking.ts` — Parking tables
- `schema/services.ts` — Service tables
- `schema/feedback.ts` — Feedback tables

Relations MUST be defined in `relations.ts` for type-safe eager loading.

Validation schemas MUST exist for every insert/update operation.

### Error Handling

| Error Type | Handling |
|------------|----------|
| Validation | `fail(400, { message })` — display inline |
| Not Found | `throw error(404, 'Resource not found')` |
| Unauthorized | `throw redirect(303, '/login')` |
| Forbidden | `throw error(403, 'Access denied')` |
| Server | Log error, return `fail(500, { message: 'user-friendly text' })` |

NEVER expose internal error details to users. Log technical details server-side.

### Required Utilities

| File | MUST Contain |
|------|--------------|
| `utils/date.ts` | `formatDate`, `formatTime`, `timeAgo`, `formatDuration` |
| `utils/currency.ts` | `formatBDT`, `calculateParkingCost` |
| `utils/geo.ts` | `getDistanceKm`, `formatDistance`, `getCurrentPosition` |

If a helper function is used in more than one file, it belongs in `$lib/utils/`.

### Required Constants

| File | MUST Contain |
|------|--------------|
| `constants/map.ts` | Map styles, default center, zoom levels |
| `constants/app.ts` | Status colors, service type icons, enum mappings |

Magic values MUST NOT be hardcoded in components or route files.

### Required Components

| Component | Purpose |
|-----------|---------|
| `ui/TabNav` | Section navigation (all feature layouts) |
| `ui/FormAlert` | Success/error message display |
| `ui/LoadingButton` | Submit button with loading state |
| `ui/StatusBadge` | Consistent status pill styling |
| `ui/EmptyState` | Consistent empty list display |
| `map/MapView` | MapLibre wrapper with marker support |
| `forms/LocationGetter` | Geolocation acquisition with UI feedback |

---

## Performance Directives

1. **No over-fetching in layouts** — fetch feature-specific data in page loads
2. **Use `depends()`** — enable granular invalidation instead of full reloads
3. **Paginate large lists** — NEVER fetch unbounded result sets
4. **Lazy load maps** — defer MapLibre initialization until visible

---

## Security Directives

1. **Validate all inputs** — Zod schemas before database operations
2. **Check auth in server code** — NEVER trust client-side guards alone
3. **Use Drizzle's query builder** — NEVER interpolate raw SQL
4. **Never expose internal errors** — log details, return generic messages
5. **Role-based access** — admin routes MUST use `requireAdmin()` check

---

## Code Quality Standards

1. **No empty files** — if unused, delete it
2. **No duplicate code** — extract to component or utility
3. **No `any` types** — explicit typing required
4. **No inline styles** — use Tailwind classes
5. **No console.log in production** — use proper error logging
6. **Consistent imports** — barrel exports from `$lib/index.ts`

---

## Feature Implementation Checklist

When adding a new feature, the following MUST be completed:

- [ ] Schema in `$lib/db/schema/[domain].ts`
- [ ] Relations in `$lib/db/relations.ts`
- [ ] Validation schema in `$lib/db/validation.ts`
- [ ] Queries in `$lib/server/[domain]/queries.ts`
- [ ] Mutations in `$lib/server/[domain]/mutations.ts`
- [ ] Reusable components in `$lib/components/`
- [ ] Route files import from server layer, compose from components
- [ ] Tab added to relevant layout navigation
- [ ] Error states handled with `FormAlert`
- [ ] Empty states handled with `EmptyState`

---

## Development Workflow

### Review Process

- All changes MUST be submitted via Pull Request
- PRs MUST pass all automated checks (build, lint, typecheck)
- Database schema changes MUST include a corresponding migration file

---

## Governance

This Constitution supersedes all other project documentation and practices. Any deviation requires an amendment to this document.

### Amendments

- Amendments require a Pull Request with a clear rationale
- Changes to Core Principles require unanimous agreement from maintainers
- Versioning follows Semantic Versioning (MAJOR.MINOR.PATCH)

**Version**: 2.1.0 | **Ratified**: 2025-12-24 | **Last Amended**: 2025-12-26
