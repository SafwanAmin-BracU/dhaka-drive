# Feature Specification: Save Service Provider from Booking Panel

**Feature Branch**: `003-save-service-provider`  
**Created**: 2026-01-07  
**Status**: Draft  
**Input**: User description: "as a user I want to be able to save a service provider from the booking panel"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Quick Save During Booking (Priority: P1)

As a user browsing a service provider's booking panel, I want to save that provider to my favorites with a single click so that I can quickly access trusted providers in the future without having to search for them again.

**Why this priority**: This is the core feature request that directly improves the user experience by reducing friction when discovering and maintaining trusted service providers. Users often want to bookmark providers they like before committing to a booking.

**Independent Test**: Can be fully tested by navigating to a service provider's booking panel, clicking a "Save" button, and verifying the provider appears in the saved providers list on the `/app/services/saved` page.

**Acceptance Scenarios**:

1. **Given** I am on the booking panel for a service provider, **When** I click the "Save Provider" button, **Then** the provider is added to my saved providers list
2. **Given** I have already saved a provider, **When** I navigate back to their booking panel, **Then** the "Save Provider" button shows as already saved (visual indicator like filled heart or "Unsave")
3. **Given** I am on the booking panel, **When** I click "Save Provider" and the action completes, **Then** I see a confirmation message (toast/alert) indicating the provider was saved
4. **Given** I save a provider and then visit `/app/services/saved`, **When** the page loads, **Then** the saved provider appears in my saved providers list

---

### User Story 2 - Remove Saved Provider from Booking Panel (Priority: P2)

As a user who has already saved a provider and visits their booking panel again, I want to easily unsave them with a single click so that I can update my saved providers list without navigating to the saved providers page.

**Why this priority**: This provides a complete workflow - users can save and unsave providers from the same place they save them, reducing need to navigate between pages for management.

**Independent Test**: Can be tested by saving a provider, returning to their booking panel, clicking the unsave action, and verifying the provider is removed from the saved providers list.

**Acceptance Scenarios**:

1. **Given** I have saved a provider and I am on their booking panel, **When** I click "Unsave" (or the visual toggle), **Then** the provider is removed from my saved providers list
2. **Given** I have just unsaved a provider on the booking panel, **When** I navigate to `/app/services/saved`, **Then** the provider no longer appears in my list
3. **Given** I click "Unsave" on a booking panel, **When** the action completes, **Then** the button toggles back to "Save" state with appropriate visual feedback

---

### User Story 3 - Save Provider Without Booking (Priority: P3)

As a user exploring service providers, I want to be able to save a provider's information for future reference even if I'm not ready to book an appointment right now so that I can build a curated list of trusted providers.

**Why this priority**: This allows users to plan ahead and maintain a personalized directory of providers, supporting different user behaviors (research now, book later).

**Independent Test**: Can be tested by navigating to a provider's booking panel, saving them without filling out the booking form, and verifying they appear in saved providers list.

**Acceptance Scenarios**:

1. **Given** I am on a service provider's booking panel, **When** I save the provider without completing the booking form, **Then** the provider is still saved successfully
2. **Given** I save a provider without booking, **When** I visit their booking panel again later, **Then** my previous booking form data does not interfere with the save status

---

### Edge Cases

- What happens if a user tries to save a provider multiple times?
  - System should handle gracefully: either silently ignore the duplicate (idempotent) or show a message indicating the provider is already saved
- What happens if the user is not authenticated when they try to save?
  - System should redirect to login page or show a message prompting authentication before allowing saves
- What if a provider is deleted from the system after a user has saved them?
  - The saved provider entry should persist in the user's list (showing archived/inactive status) or be gracefully handled with appropriate messaging
- What happens if the network request to save fails?
  - System should show an error message and allow the user to retry

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Booking panel MUST display a "Save Provider" button in a prominent location (sidebar, header, or action bar)
- **FR-002**: When user clicks "Save Provider" button, system MUST create or reuse an entry in the `savedProviders` table linking the authenticated user to the service provider
- **FR-003**: System MUST prevent duplicate saves - if a provider is already saved by the user, attempting to save again MUST be idempotent (no error, clear state indication)
- **FR-004**: System MUST display visual feedback indicating whether a provider is saved (button state changes from "Save" to "Unsave" or equivalent)
- **FR-005**: Booking panel MUST display an "Unsave" or equivalent action if the provider is already saved, allowing users to remove the provider from their saved list
- **FR-006**: When user clicks "Unsave", system MUST remove the entry from the `savedProviders` table for that user and provider
- **FR-007**: System MUST show a success message (toast/confirmation) after successfully saving or unsaving a provider
- **FR-008**: Saving a provider MUST NOT affect the booking form state or require the user to complete the booking
- **FR-009**: System MUST require user authentication - only authenticated users can save providers; unauthenticated users should be prompted to login
- **FR-010**: Saved providers list on `/app/services/saved` page MUST reflect real-time changes made from the booking panel

### Key Entities

- **Saved Provider**: Represents a one-to-many relationship between a user and service providers they've marked as favorites. Stored in the existing `savedProviders` table with fields: `id`, `userId`, `providerId`, `createdAt`.
- **Service Provider**: Existing entity representing a service provider (mechanic, car wash, etc.) with details like name, type, contact info, address, and rating.
- **User Session**: Contains authenticated user's ID; required to establish the user-provider relationship.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can save a provider and see it appear in their saved providers list within 2 seconds of clicking save
- **SC-002**: The save button's state (saved/unsaved) accurately reflects the current save status 100% of the time
- **SC-003**: Saving from the booking panel creates a verified entry in the database that can be retrieved and displayed in the saved providers list
- **SC-004**: Users can toggle save state (save → unsave → save) without errors or data inconsistency
- **SC-005**: Save/unsave operations complete successfully for 99.9% of user requests
- **SC-006**: Unauthenticated users are consistently redirected to login when attempting to save a provider

## Assumptions

- User authentication is already properly configured and available via session/auth context
- The `savedProviders` database table already exists and is properly configured with foreign key relationships
- The service provider data is loaded on the booking panel and available to the component
- DaisyKit/TailwindCSS styling system is in place for button states and visual feedback
- Toast/notification system exists for showing success/error messages to users
- Backend server actions or API endpoints can handle database operations for saving/unsaving providers
