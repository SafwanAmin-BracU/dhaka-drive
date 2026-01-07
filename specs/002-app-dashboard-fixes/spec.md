# Feature Specification: App Dashboard & Auth Integration Fixes

**Feature Branch**: `002-app-dashboard-fixes`  
**Created**: 2026-01-07  
**Status**: Draft  
**Input**: User description: "Update userID usage in routes and build a better app dashboard page (currently shows empty map). Also fix admin route navbar that is still black to use current theme."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Authenticated User Data Access (Priority: P1)

As an authenticated user, I want my interactions (bookings, service requests, traffic reports) to be associated with my actual account so that I can view my personal history and data across sessions.

**Why this priority**: Currently all routes use hardcoded `userId: 1`, which means all user actions are incorrectly attributed. This is a critical data integrity issue that affects every user-facing feature.

**Independent Test**: Can be fully tested by logging in as different users and verifying that created records (bookings, service requests, reports) are correctly attributed to each user's account.

**Acceptance Scenarios**:

1. **Given** I am logged in as user A, **When** I create a parking booking, **Then** the booking record stores my actual user ID (not hardcoded `1`)
2. **Given** I am logged in as user B, **When** I view my booking history, **Then** I see only my bookings (not all bookings or user A's bookings)
3. **Given** I am logged in as user A, **When** I submit a traffic report, **Then** the report is attributed to my account
4. **Given** I am logged in as user A, **When** I request a service, **Then** the service request shows my user ID as the requester

---

### User Story 2 - Improved App Dashboard (Priority: P2)

As a user, I want to see a comprehensive dashboard when I open the app that shows me relevant information at a glance, including quick access to main features, recent activity, and current traffic conditions, rather than just an empty map.

**Why this priority**: The current dashboard shows only a map with parking spots, providing minimal value and poor first impression. A better dashboard improves user engagement and feature discoverability.

**Independent Test**: Can be tested by visiting `/app` and verifying that the dashboard displays meaningful sections: quick action cards, recent activity summary, and traffic status widget.

**Acceptance Scenarios**:

1. **Given** I am on the app dashboard, **When** the page loads, **Then** I see quick-action cards for Traffic, Parking, and Services
2. **Given** I am on the app dashboard, **When** the page loads, **Then** I see a summary of current traffic conditions
3. **Given** I am on the app dashboard, **When** the page loads, **Then** I see my recent activity (last bookings, reports, requests)
4. **Given** I click on a quick-action card, **When** I click "View Traffic", **Then** I am navigated to `/app/traffic`

---

### User Story 3 - Theme-Aware Admin Navbar (Priority: P3)

As an admin user, I want the admin navigation bar to match the application's current theme so that the interface feels consistent and visually cohesive.

**Why this priority**: This is a visual polish issue. The admin navbar currently uses hardcoded dark colors (`bg-neutral`) that don't adapt to the theme, creating visual inconsistency.

**Independent Test**: Can be tested by visiting `/app/admin` and verifying that the navbar uses theme-aware CSS classes that respond to theme changes.

**Acceptance Scenarios**:

1. **Given** I am on any admin page, **When** the page loads, **Then** the admin navigation bar uses theme-aware styling (not hardcoded dark colors)
2. **Given** the application theme is light, **When** I view the admin navbar, **Then** the navbar colors are appropriate for a light theme
3. **Given** the application uses DaisyUI theming, **When** I view the admin navbar, **Then** the navbar uses DaisyUI semantic color classes that respect theme configuration

---

### Edge Cases

- What happens when a user's session expires mid-action (e.g., during booking creation)?
  - System should redirect to login page with a message indicating session expiration
- How does the system handle unauthenticated access to routes requiring user ID?
  - Routes should check for authentication and redirect to login if user is not authenticated
- What happens if the authenticated user's ID doesn't exist in the database?
  - System should handle gracefully, potentially logging out the user with an error message

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST retrieve the authenticated user's ID from the session/auth context instead of using hardcoded values
- **FR-002**: System MUST update all routes that create user-attributed records (bookings, service requests, traffic reports, saved providers) to use the authenticated user's ID
- **FR-003**: System MUST update all routes that query user-specific data (history, requests, saved items) to filter by the authenticated user's ID
- **FR-004**: App dashboard MUST display quick-action navigation cards for main features (Traffic, Parking, Services)
- **FR-005**: App dashboard MUST display a summary section showing recent traffic incidents
- **FR-006**: App dashboard MUST display user's recent activity (recent bookings, service requests)
- **FR-007**: Admin navigation bar MUST use theme-aware DaisyUI classes instead of hardcoded `bg-neutral text-neutral-content`
- **FR-008**: System MUST ensure all user-facing routes under `/app` require authentication

### Key Entities

- **User Session**: Contains authenticated user's ID, email, and session metadata; retrieved via Better Auth's session API
- **User Activity**: Aggregated view of user's bookings, service requests, and traffic reports for dashboard display

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of user-attributed database writes use the authenticated user's ID (no hardcoded IDs remain)
- **SC-002**: 100% of user-specific data queries filter by the authenticated user's ID
- **SC-003**: Dashboard page displays at least 3 distinct information sections (quick actions, traffic summary, recent activity)
- **SC-004**: Admin navbar passes visual consistency check with application theme
- **SC-005**: Users can identify their personal data correctly when viewing history/saved items
- **SC-006**: Dashboard provides one-click access to all main features (Traffic, Parking, Services)

## Assumptions

- Better Auth is properly configured and provides session data via `locals` or a similar mechanism
- The existing auth setup in `hooks.server.ts` can be extended to populate user session data in `locals`
- DaisyUI theme classes (e.g., `bg-base-100`, `text-base-content`) are available and configured
- The app already has traffic incidents data available via the layout server load function
