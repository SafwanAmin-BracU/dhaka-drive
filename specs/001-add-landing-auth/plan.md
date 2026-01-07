# Implementation Plan: Add Landing and Auth Pages

**Branch**: `001-add-landing-auth` | **Date**: January 7, 2026 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-add-landing-auth/spec.md`

## Summary

Create a landing page at the root route (/) and an auth page at /auth route. The landing page includes a top navigation bar with a login button (when logged out) or profile button (when logged in). Pages must include loading/error states and meet WCAG AA accessibility standards.

## Technical Context

**Language/Version**: TypeScript 5.9, Svelte 5  
**Primary Dependencies**: SvelteKit 2, TailwindCSS 4, DaisyUI 5  
**Storage**: N/A (no data persistence for this feature)  
**Testing**: Manual browser testing (no automated testing framework configured)  
**Target Platform**: Cloudflare Pages (Web)  
**Project Type**: Web application (SvelteKit)  
**Performance Goals**: <2 seconds time to first paint  
**Constraints**: WCAG AA accessibility compliance  
**Scale/Scope**: 2 routes, 1 reusable navbar component

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ No constitution file present - proceeding with standard patterns

## Project Structure

### Documentation (this feature)

```text
specs/001-add-landing-auth/
├── plan.md              # This file
├── spec.md              # Feature specification
├── checklists/          # Quality checklists
└── tasks.md             # Implementation tasks (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── lib/
│   ├── app.css                    # Global styles (existing)
│   └── components/
│       └── Navbar.svelte          # NEW: Reusable navbar component
├── routes/
│   ├── +layout.server.ts          # Existing: passes auth state
│   ├── +page.svelte               # MODIFY: Landing page with navbar
│   ├── +page.server.ts            # NEW: Landing page server load
│   └── auth/
│       ├── +page.svelte           # NEW: Auth page with navbar
│       └── +page.server.ts        # NEW: Auth page server (redirect logic)
```

**Structure Decision**: SvelteKit file-based routing with shared navbar component. The navbar is placed in `$lib/components` for reusability. **No root layout is created** - each public page (`/`, `/auth`) includes the Navbar directly. This ensures `/app/*` routes retain their own layout without inheriting from root.

## Implementation Approach

### Phase 1: Navbar Component

Create a reusable `Navbar.svelte` component in `$lib/components/` that:

- Displays app branding (DhakaDrive logo)
- Shows login button on the left when `isAuthenticated = false`
- Shows profile button on the left when `isAuthenticated = true`
- Accepts `isAuthenticated` prop (defaults to false for now)
- Uses DaisyUI navbar classes for consistent styling
- Implements WCAG AA accessibility (proper ARIA labels, keyboard navigation)

### Phase 2: Landing Page

Update `src/routes/+page.svelte` to:

- Import global CSS from `$lib/app.css`
- Import and include Navbar component directly (no root layout)
- Display welcoming landing content for DhakaDrive
- Include call-to-action for login/signup
- Support loading state via skeleton
- Meet accessibility requirements

Create `src/routes/+page.server.ts` to:

- Return `isAuthenticated: false` placeholder (TODO: replace with Better Auth)

### Phase 3: Auth Page

Create `src/routes/auth/+page.svelte` to:

- Import global CSS from `$lib/app.css`
- Import and include Navbar component directly
- Display auth form placeholder
- Include loading and error states
- Meet accessibility requirements

Create `src/routes/auth/+page.server.ts` to:

- Check auth state, redirect to `/` if already authenticated

## Complexity Tracking

> No violations - feature follows standard SvelteKit patterns
