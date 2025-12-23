<!--
SYNC IMPACT REPORT
Version change: 0.0.0 -> 1.0.0
Modified principles: All (Initial definition)
Added sections: None
Removed sections: None
Templates requiring updates: None
Follow-up TODOs: None
-->

# DhakaDrive Constitution

## Core Principles

### I. Schema-Driven Development

The Drizzle schema (`src/lib/drizzle/schema.ts`) is the single source of truth for data models. All database interactions must be type-safe and aligned with the schema. Migrations must be generated and applied consistently using Drizzle Kit. Direct SQL queries should be avoided unless absolutely necessary for performance, and must be documented.

### II. Strict Type Safety

TypeScript is mandatory for all code. `any` types are forbidden unless strictly justified and commented with a reason. Interfaces and types should be shared via `src/lib/index.ts` or `app.d.ts` where appropriate to ensure consistency across the application.

### III. Edge-Native Architecture

The application is deployed on Cloudflare Pages. All server-side code (loaders, actions, API routes) must be compatible with the Edge runtime. Avoid Node.js-only dependencies or APIs (like `fs`) unless polyfilled or strictly separated into build-time scripts.

### IV. Modular & Reactive UI

Use Svelte 5 runes and reactive primitives for state management. Logic should be encapsulated in reusable components or composables (lib files). Styles should use Tailwind utility classes and DaisyUI components to maintain consistency and reduce custom CSS.

### V. Feature Isolation

Code related to specific modules (Traffic, Parking, Services, Admin) should be organized within the `routes` directory structure or dedicated `lib` folders to maintain separation of concerns. Shared utilities should be placed in `src/lib` but domain-specific logic must remain within its domain module.

## Technical Standards

### Technology Stack

- **Language:** TypeScript / Svelte 5
- **Meta-Framework:** SvelteKit 2.0
- **Database:** PostgreSQL (via Neon)
- **ORM:** Drizzle ORM
- **Styling:** TailwindCSS, DaisyUI
- **Package Manager:** Bun
- **Deployment:** Cloudflare Pages

### Code Quality

- All code must pass linting and formatting checks (Prettier/ESLint).
- Components should be small and focused on a single responsibility.
- Server-side logic should be separated from UI components (use `+page.server.ts` or `+server.ts`).

## Development Workflow

### Review Process

- All changes must be submitted via Pull Request.
- PRs must pass all automated checks (build, lint, typecheck).
- Database schema changes must include a corresponding migration file.

### Testing Gates

- Critical paths (Booking, Reporting) should have integration tests.
- Utility functions must have unit tests.

## Governance

This Constitution supersedes all other project documentation and practices. Any deviation requires an amendment to this document.

### Amendments

- Amendments require a Pull Request with a clear rationale.
- Changes to Core Principles require unanimous agreement from maintainers.
- Versioning follows Semantic Versioning (MAJOR.MINOR.PATCH).

**Version**: 1.0.0 | **Ratified**: 2025-12-24 | **Last Amended**: 2025-12-24
