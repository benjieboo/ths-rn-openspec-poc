# Spec Delta

## ADDED Requirements

### Requirement: No open dates

When a listing has no open date ranges, the page SHALL say "No dates available right now" under "Sitter needed" on every layout. No viewer other than the pet parent SHALL get a primary call to action. No status banner is shown. Favourite, share, refer a friend and report SHALL work as they do on any listing. Until dates have loaded successfully, the page SHALL NOT treat the listing as having no dates.

#### Scenario: Anonymous viewer, no dates
- **WHEN** an anonymous viewer opens a listing with no open dates
- **THEN** "No dates available right now" is shown, there is no "Join now to apply" action, "Notify me" is offered, and pressing the heart still opens the membership prompt

#### Scenario: Partial member, no dates
- **WHEN** a partial member opens a listing with no open dates
- **THEN** "No dates available right now" is shown, with no "Upgrade to apply" action and no upgrade note

#### Scenario: Full sitter, no dates
- **WHEN** a full sitter opens a listing with no open dates
- **THEN** "No dates available right now" is shown, there is no "Apply" action, and the viewer can still save, share and report the listing

#### Scenario: Pet parent, no dates
- **WHEN** the pet parent views their own listing with no open dates
- **THEN** "No dates available right now" and the note "This is your listing" are shown, with no apply, favourite or report control

#### Scenario: No banner
- **WHEN** a listing has no open dates
- **THEN** no status banner is shown, including the "Reviewing applications" banner

#### Scenario: Dates still loading
- **WHEN** the listing has loaded but its dates have not
- **THEN** the dates and the call to action show their loading state, and "No dates available right now" is not shown

#### Scenario: Dates fail to load
- **WHEN** the listing loads but its dates fail
- **THEN** the dates show an inline error with "Try again", "No dates available right now" is not shown, and no apply action is offered until the dates load

### Requirement: Notify me when dates open

When a listing has no open dates, every viewer except the pet parent SHALL be offered "Notify me" as a secondary action, next to "No dates available right now". Pressing it SHALL confirm with a message and change the action to "You'll be notified" for the rest of the visit. Nothing is saved yet, so the choice is not kept after the page is reloaded.

#### Scenario: Ask to be notified
- **WHEN** a viewer presses "Notify me" on a listing with no open dates
- **THEN** a message says "We'll let you know when dates open", and the action reads "You'll be notified", is disabled and is announced as such

#### Scenario: Notify me on every layout
- **WHEN** a listing with no open dates is shown on a phone, narrow web or desktop
- **THEN** "Notify me" uses the secondary (outline) button style, in the apply bar on mobile and in the pet parent card on desktop

#### Scenario: Not for the pet parent
- **WHEN** the pet parent views their own listing with no open dates
- **THEN** "Notify me" is not shown

#### Scenario: Only with no open dates
- **WHEN** a listing has at least one open date range, or its dates are still loading or failed to load
- **THEN** "Notify me" is not shown

#### Scenario: Not kept after reload
- **WHEN** a viewer who pressed "Notify me" reloads the page
- **THEN** "Notify me" is offered again

## MODIFIED Requirements

### Requirement: Mobile presentation

Below the desktop breakpoint (all phones and narrow web), the listing page SHALL use the app pattern: full-bleed swipeable photos under a transparent header with back, favourite and share controls. Home and location, amenities, responsibilities, sit essentials and sitter reviews appear as rows that open their detail pages. Pets scroll horizontally, and an apply bar stays pinned to the bottom. The apply bar SHALL stay visible when the listing has no open dates, with "No dates available right now" as its small title and "Notify me" in place of the call to action.

#### Scenario: Collapsing header
- **WHEN** the viewer scrolls past the photos
- **THEN** the header gains a solid background and shows the listing title, and its controls stay reachable

#### Scenario: Section rows
- **WHEN** the viewer presses the "Amenities" row
- **THEN** the amenities detail page opens

#### Scenario: Apply bar
- **WHEN** the page is scrolled to any position
- **THEN** the apply bar stays visible above the device's home indicator, showing the selected or next available dates and the primary call to action for this viewer

#### Scenario: Apply bar with no open dates
- **WHEN** a viewer other than the pet parent opens a listing with no open dates on a phone or narrow web
- **THEN** the apply bar stays visible at any scroll position, with "No dates available right now" as a small title in the caption style and a "Notify me" secondary button instead of the primary call to action

### Requirement: Sit essentials

The page SHALL show arrival and departure for each open date range, the guest policy and whether sitters can bring pets. When the listing has no open dates, sit essentials SHALL stay visible, without arrival and departure details.

#### Scenario: Times to be agreed
- **WHEN** arrival or departure time is not set
- **THEN** it reads "To be agreed later"

#### Scenario: Guests need approval
- **WHEN** guests are allowed with approval
- **THEN** it reads "Guests allowed (must be approved in advance)"

#### Scenario: No open dates
- **WHEN** a listing has no open dates
- **THEN** the sit essentials section on desktop, its row on mobile and its detail page all show the guest policy and whether sitters can bring pets, with no arrival or departure details
