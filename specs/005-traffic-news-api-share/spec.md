# Feature Specification: Traffic News API & Social Sharing

**Feature Branch**: `005-traffic-news-api-share`  
**Created**: January 7, 2026  
**Status**: Draft  
**Input**: User description: "The news feature of traffic will be an API that can be given to external services. When the service posts a news, the news will then be updated in the user news panel. Also add a facebook share link for the share button"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - External Service Posts Traffic News via API (Priority: P1)

An external news service, traffic authority, or third-party application posts a traffic news item via the DhakaDrive API. The news is immediately available for display to users without any manual intervention.

**Why this priority**: This is the core capability that enables external services to contribute traffic information in real-time. It's fundamental to the feature's value proposition and must work independently.

**Independent Test**: Can be fully tested by using an API client (curl, Postman, etc.) to POST a traffic news item to the endpoint and verifying it appears in the database and is queryable via the news API.

**Acceptance Scenarios**:

1. **Given** an external service has valid API credentials, **When** the service POSTs a new traffic news item with required fields (title, content, location, severity), **Then** the news item is stored in the database with a unique ID and timestamp
2. **Given** a traffic news item has been posted via API, **When** the news is queried via the public news API, **Then** the item is returned with all posted fields and metadata
3. **Given** an external service sends malformed data, **When** the service POSTs invalid JSON or missing required fields, **Then** the API responds with a 400 error and descriptive error message
4. **Given** an external service without valid credentials, **When** the service attempts to POST news, **Then** the API responds with a 401 Unauthorized error

---

### User Story 2 - Users See Updated Traffic News in News Panel (Priority: P1)

Users viewing the traffic news panel see the latest news posted by external services, with the most recent items appearing first or with filters/sorting available.

**Why this priority**: This is the end-user experience that delivers the value of external news integration. Users must see fresh traffic information in real-time without page refreshes.

**Independent Test**: Can be fully tested by posting news via API, then accessing the news panel in the UI and verifying the new item appears with correct information and formatting.

**Acceptance Scenarios**:

1. **Given** a user is viewing the traffic news panel, **When** new traffic news has been posted via API in the last few seconds, **Then** the user sees the new item in the panel (either automatically refreshed or after a manual refresh)
2. **Given** multiple traffic news items exist in the system, **When** the user views the news panel, **Then** news items are displayed in reverse chronological order (newest first)
3. **Given** traffic news items with different severity levels exist, **When** the user views the news panel, **Then** items are visually distinguished by severity level (e.g., color coding or badges)
4. **Given** a user is viewing the news panel with many items, **When** the user scrolls or paginates, **Then** additional news items load without page reload

---

### User Story 3 - Users Share Traffic News to Facebook (Priority: P1)

Users can click a "Share to Facebook" button on traffic news items to share them with their Facebook network, with the option to add a personal message.

**Why this priority**: Social sharing is critical for virality and community engagement. Traffic information shared on social media can reach more people and increase awareness of traffic conditions.

**Independent Test**: Can be tested by clicking the Facebook share button on a news item and verifying the Facebook share dialog opens with the news title, description, and a link back to the news item.

**Acceptance Scenarios**:

1. **Given** a user is viewing a traffic news item, **When** the user clicks the "Share to Facebook" button, **Then** the Facebook share dialog opens with the news title and description pre-populated
2. **Given** a user has opened the Facebook share dialog, **When** the user adds a personal message and clicks "Share", **Then** the news item is posted to their Facebook timeline with the custom message
3. **Given** a user clicks the "Share to Facebook" button, **When** the button is clicked, **Then** a Facebook share count or confirmation is shown to indicate success
4. **Given** a traffic news item has been shared to Facebook by users, **When** someone views that Facebook post, **Then** clicking the link opens the traffic news in DhakaDrive with proper metadata

---

### User Story 4 - Share Button Also Supports Other Platforms (Priority: P2)

In addition to Facebook, users can share traffic news to other social platforms (WhatsApp, Twitter/X, etc.) to maximize reach.

**Why this priority**: While Facebook sharing is primary, supporting other platforms increases flexibility and reaches users across different social networks. This is valuable but not blocking the initial feature.

**Independent Test**: Can be tested by verifying that additional share buttons are present and functional for each platform, with proper URLs and share dialogs opening.

**Acceptance Scenarios**:

1. **Given** a user is viewing a traffic news item, **When** the user clicks a WhatsApp share button, **Then** the WhatsApp share dialog or app opens with a pre-composed message
2. **Given** a user is viewing a traffic news item, **When** the user clicks a Twitter/X share button, **Then** the tweet composer opens with the news title and a link
3. **Given** mobile users are viewing a news item, **When** the user clicks a share button, **Then** the native sharing sheet appears with available apps on their device

---

### User Story 5 - API Rate Limiting and Authentication (Priority: P2)

External services are authenticated and rate-limited to prevent spam and ensure system stability.

**Why this priority**: Security and stability are important for production. Rate limiting prevents abuse, but the system can function for initial MVP testing with basic authentication.

**Independent Test**: Can be tested by attempting to post excessive requests and verifying rate limit responses, and by attempting to post without valid credentials.

**Acceptance Scenarios**:

1. **Given** an external service with valid API key, **When** the service submits requests within the rate limit (e.g., 100 requests per hour), **Then** all requests are accepted
2. **Given** an external service exceeds its rate limit, **When** the service attempts to POST another news item, **Then** the API responds with 429 Too Many Requests and includes a `Retry-After` header
3. **Given** an external service without an API key, **When** the service attempts to POST news, **Then** the API requires authentication via header or token

### Edge Cases

- What happens when an external service posts duplicate news items (same title, location, time)? Should duplicates be rejected or allowed?
- How does the system handle very long news titles or descriptions from external services?
- What happens when an external service posts news with coordinates outside Dhaka or Bangladesh? Should geographic validation occur?
- How are news items from external services moderated or verified before appearing to users?
- [NEEDS CLARIFICATION: Should external services be able to edit or delete news items they posted via API?]

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST provide a REST API endpoint (`POST /api/traffic/news`) for external services to submit traffic news items
- **FR-002**: System MUST require valid API authentication (API key or bearer token) for news submission endpoints
- **FR-003**: System MUST validate that news submissions include required fields: title, content, location (lat/long), and severity level
- **FR-004**: System MUST store submitted traffic news items in the database with a unique ID, timestamp, source identifier, and all submitted data
- **FR-005**: System MUST expose a public API endpoint (`GET /api/traffic/news`) for retrieving traffic news, optionally filtered by location radius, date range, or severity
- **FR-006**: System MUST display all traffic news items (from external services and other sources) in the user news panel with clear attribution to the source
- **FR-007**: System MUST render a "Share to Facebook" button on each traffic news item in the UI
- **FR-008**: System MUST generate proper Open Graph meta tags for news items so Facebook previews display the news title, description, and relevant image
- **FR-009**: When a user clicks the Facebook share button, the system MUST open the Facebook Share Dialog with news title, description, image, and a deep link to the specific news item
- **FR-010**: System MUST support additional share buttons for WhatsApp and Twitter/X (or other platforms) if included in scope
- **FR-011**: System MUST track successful API submissions and log them for monitoring and debugging
- **FR-012**: System MUST handle API errors gracefully and return appropriate HTTP status codes (400, 401, 429, 500, etc.) with descriptive messages
- **FR-013**: System MUST implement rate limiting on the news submission API (e.g., per API key or per IP address) with configurable limits
- **FR-014**: System MUST reject or sanitize HTML/JavaScript in submitted news content to prevent injection attacks
- **FR-015**: Users MUST be able to see a real-time or near-real-time update of news after it's posted via API without manual page refresh

### Key Entities *(include if feature involves data)*

- **TrafficNews** (existing table): Represents a traffic news item with fields for id, title, content, source, location (geography), severity, publishedAt, createdAt
- **APICredential** (new): Represents an external service's API key or credentials with fields for id, serviceId, apiKey, isActive, createdAt, lastUsedAt
- **NewsSource** (new): Represents the source of news (external service identifier) with fields for id, name, description, and contact info

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: External services can successfully submit traffic news via API and items appear in user news panel within 5 seconds of submission
- **SC-002**: News items shared to Facebook include proper preview images and descriptions that render correctly in Facebook feed
- **SC-003**: At least 80% of submitted news items (via API) are successfully stored and retrievable without errors
- **SC-004**: API response time for news submission requests is under 500ms for 95th percentile
- **SC-005**: System can handle at least 100 news submissions per hour without performance degradation
- **SC-006**: Rate limiting prevents any single external service from submitting more than 1000 news items per day
- **SC-007**: Users successfully share traffic news to Facebook in at least 90% of attempts without errors
- **SC-008**: Shared news posts on Facebook include proper attribution to DhakaDrive and the original source
- **SC-009**: At least 50% of external services using the API do so with valid authentication within the first month
- **SC-010**: System maintains 99.5% uptime for the traffic news API endpoint
