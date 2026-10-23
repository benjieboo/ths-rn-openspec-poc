# mock-api Specification

## Purpose
The mock API is the data contract for listing-related journeys. It serves fictional data in the exact shapes the real API is expected to provide, and lets any client choose a viewer state and data edge case per request, so every state a member can see is reproducible.

## Requirements

### Requirement: Contract-first responses

Every endpoint SHALL have a published request and response schema, shared by clients and the server. The server SHALL NOT send a response that fails its schema, and clients SHALL reject responses that fail it.

#### Scenario: Seed data drifts from the contract
- **WHEN** seed data no longer matches a response schema
- **THEN** the server's test suite fails before any client receives the bad shape

#### Scenario: Client receives an unexpected shape
- **WHEN** a client receives a response that fails its schema
- **THEN** the client surfaces it as an error rather than rendering partial data

### Requirement: Error shape

Every error response SHALL use one shape: an HTTP status and a body with a machine-readable `code` and a human-readable `message`.

#### Scenario: Unknown listing
- **WHEN** a client requests a listing id that does not exist
- **THEN** the server responds 404 with code `not_found`

#### Scenario: Invalid request body
- **WHEN** a client sends a body that fails the request schema
- **THEN** the server responds 400 with code `invalid_request`

### Requirement: Listing resources

The API SHALL serve, per listing: the listing summary (title, introduction, approximate location, photos, home details, owner summary, animal counts, review and amenity counts); open sit dates; pets; categorised amenities; responsibilities; sit essentials; and paginated sitter reviews.

#### Scenario: Listing summary
- **WHEN** a client requests `GET /listings/{id}` for a seeded listing
- **THEN** it receives the summary with photos in display order and animal counts by species

#### Scenario: Approximate location only
- **WHEN** any listing resource is returned
- **THEN** location contains city, region, country, neighbourhood and approximate coordinates, and never a street address or exact coordinates

#### Scenario: Reviews pagination
- **WHEN** a client requests `GET /listings/{id}/reviews?page=2`
- **THEN** it receives the second page, with the page number, page size, total count and total pages

#### Scenario: Page out of range
- **WHEN** a client requests a review page beyond the last page
- **THEN** it receives an empty page with correct totals, not an error

### Requirement: Viewer

`GET /me` SHALL describe the viewer: membership state (`anonymous`, `partial`, `full`), whether they can apply, their favourite listing ids, the dates they have applied to, and their member id when signed in.

#### Scenario: Anonymous viewer
- **WHEN** no viewer scenario is selected
- **THEN** the viewer is anonymous, cannot apply, and has no favourites

#### Scenario: Viewer owns the listing
- **WHEN** the `own-listing` scenario is selected
- **THEN** the viewer's member id equals the owner id of the primary seeded listing (2001)

### Requirement: Favourites

`PUT /me/favourites/{listingId}` SHALL add a favourite and `DELETE /me/favourites/{listingId}` SHALL remove it. Both are idempotent and return the resulting favourite state. Anonymous viewers SHALL receive 401.

#### Scenario: Add then read
- **WHEN** a signed-in viewer adds a favourite and then requests `GET /me`
- **THEN** the listing id is in their favourites

#### Scenario: Anonymous favourite
- **WHEN** an anonymous viewer tries to add a favourite
- **THEN** the server responds 401 with code `unauthenticated`

### Requirement: Applications

`POST /listings/{id}/applications` SHALL accept an application for one open date range. Only full members can apply.

#### Scenario: Full member applies
- **WHEN** a full member applies to an open date range they have not applied to
- **THEN** the server responds 201 with a pending application, and `GET /me` lists it

#### Scenario: Anonymous applicant
- **WHEN** an anonymous viewer applies
- **THEN** the server responds 401 with code `unauthenticated`

#### Scenario: Partial member applies
- **WHEN** a partial member applies
- **THEN** the server responds 403 with code `membership_required`

#### Scenario: Dates under review or already applied
- **WHEN** a full member applies to a date range that is being reviewed, or one they already applied to
- **THEN** the server responds 409 with code `not_available` or `already_applied`

#### Scenario: Own listing
- **WHEN** a viewer applies to their own listing
- **THEN** the server responds 403 with code `own_listing`

### Requirement: Reports

`POST /listings/{id}/reports` SHALL accept a report with a reason from a fixed list and optional details, from any viewer including anonymous.

#### Scenario: Report accepted
- **WHEN** a viewer reports a listing with a valid reason
- **THEN** the server responds 202 with a report id

### Requirement: Scenario selection

Clients SHALL select scenarios per request with an `x-scenario` header or a `scenario` query parameter. The value is a comma-separated list of at most one viewer scenario plus any data scenarios. Unknown names SHALL be rejected with 400.

Viewer scenarios: `anonymous` (default), `partial-member`, `full-sitter`, `own-listing`.
Data scenarios: `all-assignments-reviewing`, `no-reviews`, `no-amenities`, `no-pets`, `loading-slow`, `error`, `favourite-error`.

#### Scenario: Combined scenarios
- **WHEN** a client sends `x-scenario: full-sitter,no-reviews`
- **THEN** the viewer is a full member and the listing has zero reviews and an empty reviews page

#### Scenario: All dates under review
- **WHEN** `all-assignments-reviewing` is selected
- **THEN** every open date range is marked as reviewing

#### Scenario: Empty sections
- **WHEN** `no-amenities` or `no-pets` is selected
- **THEN** the amenities or pets resource is empty and the listing's counts agree

#### Scenario: Server error
- **WHEN** `error` is selected
- **THEN** listing read endpoints respond 500 with code `server_error`

#### Scenario: Favourite fails
- **WHEN** `favourite-error` is selected
- **THEN** favourite writes respond 500, so clients can show their rollback behaviour

#### Scenario: Two viewer scenarios
- **WHEN** a client sends two viewer scenarios
- **THEN** the server responds 400 with code `invalid_scenario`

### Requirement: Latency

The server SHALL add a random delay of 200–600 ms to every response by default, and 3–5 s when `loading-slow` is selected. Latency SHALL be disableable for automated tests.

#### Scenario: Default latency
- **WHEN** a client calls any endpoint without `loading-slow`
- **THEN** the response arrives after 200–600 ms

#### Scenario: Slow loading
- **WHEN** `loading-slow` is selected
- **THEN** the response arrives after 3–5 s

### Requirement: Isolated in-memory writes

Writes SHALL be stored in memory per viewer scenario, so actions taken as one viewer never appear for another, and a reset endpoint SHALL restore the seed state.

#### Scenario: Viewers don't share favourites
- **WHEN** the `full-sitter` viewer adds a favourite
- **THEN** the `partial-member` viewer's favourites are unchanged

#### Scenario: Reset
- **WHEN** a client calls `POST /__reset`
- **THEN** all favourites, applications and reports return to the seed state

### Requirement: Reachable from every development target

The API base URL SHALL resolve correctly from the iOS simulator, the Android emulator and web without per-developer configuration, and SHALL be overridable by environment variable.

#### Scenario: Android emulator
- **WHEN** the app runs on the Android emulator
- **THEN** it calls the mock API at the host machine address the emulator exposes

#### Scenario: Override
- **WHEN** `EXPO_PUBLIC_API_URL` is set
- **THEN** the app uses it on every platform
