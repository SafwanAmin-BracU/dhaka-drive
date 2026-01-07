# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

**Primary Requirement**: Build an external-service API for submitting traffic news items (`POST /api/traffic/news`) with authentication and rate limiting, integrate real-time news updates in the user news panel, and add Facebook (+ WhatsApp/Twitter) social sharing buttons with proper Open Graph meta tags.

**Technical Approach**: 
- Create new server routes `/api/traffic/news` (GET/POST) with Zod validation
- Implement API key authentication and rate limiting middleware
- Add new `NewsSource` and `APICredential` tables to track external submissions
- Update existing `TrafficNews` table to store source attribution
- Implement Open Graph meta tags in news detail page `+page.svelte`
- Add share button component for Facebook/WhatsApp/Twitter with native integration
- Leverage `better-auth` for API key management

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

## Technical Context

**Language/Version**: TypeScript / SvelteKit 2.0 (Node 20+)  
**Primary Dependencies**: SvelteKit, Drizzle ORM, Zod, Neon (PostgreSQL), Better Auth  
**Storage**: PostgreSQL with PostGIS on Neon (existing `trafficNews` table + new `apiCredentials`, `newsSources` tables)  
**Testing**: Manual validation (per Constitution IX) via API clients and UI verification  
**Target Platform**: Cloudflare Pages (edge runtime, Node.js-free compatible)  
**Project Type**: Single SvelteKit web application  
**Performance Goals**: API response <500ms (p95), support 100+ news submissions/hour, 5-second UI update latency  
**Constraints**: Edge-runtime compatible (no Node.js APIs), rate-limited to 1000 items/service/day  
**Scale/Scope**: External service integration (10-50 services estimated), user-facing news panel with social sharing

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[Gates determined based on constitution file]

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
