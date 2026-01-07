# Implementation Plan: Save Service Provider from Booking Panel

**Branch**: `003-save-service-provider` | **Date**: 2026-01-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-save-service-provider/spec.md`

## Summary

Allow authenticated users to save/bookmark service providers directly from the booking panel. This feature reduces friction in the provider discovery workflow by enabling quick favoriting without leaving the booking page. Users can toggle save state with visual feedback and see updates reflected in their saved providers list.

**Technical Approach**: Implement a server action (`+server.ts`) that creates/deletes `savedProviders` entries. Add a reactive button component to the booking panel that queries current save state and toggles via form action with optimistic UI updates.

## Technical Context

**Language/Version**: TypeScript with Svelte 5  
**Primary Dependencies**: SvelteKit 2.0, Drizzle ORM, Better Auth, DaisyUI  
**Storage**: PostgreSQL (Neon) - existing `savedProviders` table  
**Testing**: Manual validation (no automated tests required per constitution)  
**Target Platform**: Web (Cloudflare Pages edge runtime)  
**Project Type**: SvelteKit web application  
**Performance Goals**: Save/unsave operations complete within 2 seconds (SC-001)  
**Constraints**: Must be edge-runtime compatible; no Node.js-only APIs  
**Scale/Scope**: Single UI feature; minimal API surface; affects 1 existing route and 1 new endpoint

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Violations**: NONE

**Alignment Verification**:
- ✅ **Layered Architecture**: Database layer (`savedProviders` table), server logic layer (queries/mutations in `$lib/server/services/`), UI component layer (new save button component)
- ✅ **Type Safety**: Will use Zod validation for save/unsave inputs; TypeScript throughout
- ✅ **Edge-Native**: Form action handles mutations; Neon serverless driver already in use
- ✅ **Component-Driven UI**: DaisyUI button with state classes (`btn-primary` for saved, `btn-ghost` for unsaved)
- ✅ **Server Logic Abstraction**: Mutations delegated to `$lib/server/services/mutations.ts`
- ✅ **Route File Discipline**: Booking route calls server functions; form action validates and delegates
- ✅ **Authentication Pattern**: Better Auth session used to get `userId` for save operation
- ✅ **Form Handling Standard**: Form submits to action, validates, returns feedback
- ✅ **Documentation Authority**: Using context7 for DaisyUI, SvelteKit, and Drizzle patterns

## Project Structure

### Documentation (this feature)

```text
specs/003-save-service-provider/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 (if needed for clarifications)
├── data-model.md        # Phase 1 design (entity details, validation)
├── quickstart.md        # Phase 1 design (implementation guide)
├── contracts/           # Phase 1 design (API response shapes)
│   └── save-provider.ts # TypeScript types for API responses
└── checklists/
    └── requirements.md  # Spec validation checklist
```

### Source Code

**Existing Modified**:
- `src/routes/app/services/book/[id]/+page.svelte` — Add save button UI
- `src/lib/server/services/queries.ts` — Add `checkIfProviderSaved()` query
- `src/lib/server/services/mutations.ts` — Add `saveProvider()` and `unsaveProvider()` mutations

**New Files**:
- `src/routes/app/services/book/[id]/+server.ts` — Form actions for save/unsave
- `src/lib/components/SaveProviderButton.svelte` — Reusable save button component
- `src/lib/types/saved-provider.ts` — TypeScript types for save operations

**Existing Used (No Changes)**:
- `src/lib/drizzle/schema.ts` — `savedProviders` table already defined
- `src/lib/server/auth.ts` — Session/user utilities

**Structure Decision**: Single SvelteKit web application. Feature affects:
1. UI layer: New button component in booking panel
2. Server logic: New mutations for save/unsave operations
3. No database schema changes (table already exists)
4. No new routes (uses existing booking route with form action)

## Complexity Tracking

No Constitution Check violations identified. All design decisions align with established patterns.
