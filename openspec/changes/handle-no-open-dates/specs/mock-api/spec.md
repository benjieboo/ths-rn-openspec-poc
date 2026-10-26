# Spec Delta

## MODIFIED Requirements

### Requirement: Scenario selection

Clients SHALL select scenarios per request with an `x-scenario` header or a `scenario` query parameter. The value is a comma-separated list of at most one viewer scenario plus any data scenarios. Unknown names SHALL be rejected with 400.

Viewer scenarios: `anonymous` (default), `partial-member`, `full-sitter`, `own-listing`.
Data scenarios: `all-assignments-reviewing`, `no-open-dates`, `no-reviews`, `no-amenities`, `no-pets`, `loading-slow`, `error`, `favourite-error`.

#### Scenario: Combined scenarios
- **WHEN** a client sends `x-scenario: full-sitter,no-reviews`
- **THEN** the viewer is a full member and the listing has zero reviews and an empty reviews page

#### Scenario: All dates under review
- **WHEN** `all-assignments-reviewing` is selected
- **THEN** every open date range is marked as reviewing

#### Scenario: No open dates
- **WHEN** `no-open-dates` is selected
- **THEN** the listing's open date ranges are empty, its sit essentials list no arrival or departure details, and its guest policy and sitter pets policy are unchanged

#### Scenario: No open dates combined with all under review
- **WHEN** `no-open-dates` and `all-assignments-reviewing` are both selected, in either order
- **THEN** the listing has no open date ranges

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
