# Spec Delta

## Purpose

The listing page helps a sitter decide whether a sit is right for them, and then act: apply, save it, or share it. It shows the same content and behaviour on the native app and on the web, adapting only its layout to the screen.

## ADDED Requirements

### Requirement: One route per page on every platform

The listing SHALL live at `/listing/{id}`, and each detail page SHALL live beneath it: `/home`, `/amenities`, `/responsibilities`, `/sit-essentials`, `/reviews`, `/pets/{petId}` and `/gallery`. The same routes SHALL serve native screens and web pages, and every route SHALL be deep-linkable.

#### Scenario: Open a listing from a link
- **WHEN** a viewer opens `/listing/2001` on web or follows the equivalent app link on a phone
- **THEN** the listing page for 2001 opens

#### Scenario: Deep link to a detail page
- **WHEN** a viewer opens `/listing/2001/amenities` directly
- **THEN** the amenities page opens, and going back leads to the listing page

#### Scenario: Unknown listing
- **WHEN** the listing does not exist
- **THEN** the page says the listing can't be found, in a warm tone, with a way back to the home page, instead of an error

### Requirement: Content order

The listing page SHALL present content in this order: photos; title, location and animal counts; status banner; introduction; home and location; amenities; pets; responsibilities; sit essentials; sitter reviews; location map; pet parent and dates with the primary call to action; refer a friend; report listing.

#### Scenario: Reading order
- **WHEN** a screen reader user moves through the listing page
- **THEN** content is announced in the order above, with the title as the level 1 heading and each section title as a level 2 heading

### Requirement: Mobile presentation

Below the desktop breakpoint (all phones and narrow web), the listing page SHALL use the app pattern: full-bleed swipeable photos under a transparent header with back, favourite and share controls. Home and location, amenities, responsibilities, sit essentials and sitter reviews appear as rows that open their detail pages. Pets scroll horizontally, and an apply bar stays pinned to the bottom.

#### Scenario: Collapsing header
- **WHEN** the viewer scrolls past the photos
- **THEN** the header gains a solid background and shows the listing title, and its controls stay reachable

#### Scenario: Section rows
- **WHEN** the viewer presses the "Amenities" row
- **THEN** the amenities detail page opens

#### Scenario: Apply bar
- **WHEN** the page is scrolled to any position
- **THEN** the apply bar stays visible above the device's home indicator, showing the selected or next available dates and the primary call to action for this viewer

### Requirement: Desktop presentation

At the desktop breakpoint and wider, the listing page SHALL use two columns under a header row (title, location, animal counts, favourite and share). The photo grid spans the page. The left column shows every section inline. The right column holds the pet parent card with dates and the primary call to action, which stays in view while scrolling, followed by refer a friend and report listing.

#### Scenario: Sections inline
- **WHEN** the page renders on desktop
- **THEN** home and location, amenities (first five), pets, responsibilities, sit essentials and the first page of reviews appear inline, not as rows

#### Scenario: Sticky owner card
- **WHEN** a desktop viewer scrolls through the left column
- **THEN** the pet parent card stays in view until the end of the content

#### Scenario: Resize across the breakpoint
- **WHEN** a web viewer resizes the window across the desktop breakpoint
- **THEN** the page switches presentation without a reload and keeps the selected dates

### Requirement: Loading

While listing data loads, the page SHALL show a skeleton with the same structure as the content for the current presentation, and photos SHALL keep their space so nothing shifts when they arrive.

#### Scenario: First load
- **WHEN** the listing page opens and data has not arrived
- **THEN** a skeleton of the photos, title, sections and owner card is shown, announced as loading

#### Scenario: Slow network
- **WHEN** responses take several seconds
- **THEN** the skeleton stays until data arrives, with no flashing or layout jump

### Requirement: Errors and retry

If the listing itself fails to load, the page SHALL show a friendly error with a retry. If only a secondary section fails, that section SHALL show its own inline error and retry while the rest of the page works.

#### Scenario: Listing fails
- **WHEN** the listing request fails
- **THEN** the page shows "We couldn't load this listing" with a "Try again" button that refetches

#### Scenario: One section fails
- **WHEN** the listing loads but its reviews fail
- **THEN** the reviews section shows an inline error with retry, and the rest of the page is usable

### Requirement: Title block

The page SHALL show the listing title, the approximate location as "City, Region, Country", and one count badge per species.

#### Scenario: Animal counts
- **WHEN** a listing has one cat
- **THEN** a badge shows "1" with a cat icon and is announced as "1 cat"

#### Scenario: No pets
- **WHEN** a listing has no pets
- **THEN** no animal badges are shown

### Requirement: Status banner

When every open date is under review, the page SHALL show a banner explaining that the pet parent is reviewing applications.

#### Scenario: All dates under review
- **WHEN** every open date range is being reviewed
- **THEN** a warning banner reads "Reviewing applications" and explains the pet parent is reviewing applications for all their dates

#### Scenario: Some dates open
- **WHEN** at least one date range is not under review
- **THEN** no banner is shown

### Requirement: Introduction

The page SHALL show the pet parent's introduction, collapsed with "Read more" when long.

#### Scenario: Long introduction
- **WHEN** the introduction is longer than the collapsed length
- **THEN** it is collapsed with a "Read more" control

### Requirement: Home and location

The page SHALL describe the home: the description, home type, setting, and whether it's reachable by public transport and includes a car. The detail page SHALL show all of it plus the location map.

#### Scenario: Home facts
- **WHEN** the home is an apartment in a city with public transport
- **THEN** the facts read "Apartment", "City" and "Accessible by public transport"

### Requirement: Amenities

The page SHALL show the highlighted amenities first, up to five, with a "Show all N amenities" control that opens the full list grouped by category. The section SHALL be hidden when the listing has no amenities.

#### Scenario: Show all
- **WHEN** a viewer presses "Show all 16 amenities"
- **THEN** the amenities page lists all 16, grouped by category

#### Scenario: No amenities
- **WHEN** the listing has no amenities
- **THEN** the amenities section and its row are not shown

### Requirement: Pets

The page SHALL show a card for each pet with photo (or species illustration), name, breed and age. Each card opens the pet's page, which shows the pet's details and that pet's responsibilities. The section SHALL be hidden when there are no pets.

#### Scenario: Open a pet
- **WHEN** a viewer presses Pickle's card
- **THEN** Pickle's page opens with breed, age, about and Pickle's care responsibilities

#### Scenario: Age wording
- **WHEN** a pet is 1 year old, or its age is unknown
- **THEN** the card shows "1 year", or omits the age

### Requirement: Responsibilities

The page SHALL show, for each pet, how long it can be left alone and whether medication is needed, then the home tasks.

#### Scenario: Time alone wording
- **WHEN** a pet can be left for more than six hours
- **THEN** it reads "Can be left alone for more than 6 hours"

#### Scenario: Medication
- **WHEN** a pet needs medication
- **THEN** "Medication needed" is shown with the note; otherwise "No medication needed"

### Requirement: Sit essentials

The page SHALL show arrival and departure for each open date range, the guest policy and whether sitters can bring pets.

#### Scenario: Times to be agreed
- **WHEN** arrival or departure time is not set
- **THEN** it reads "To be agreed later"

#### Scenario: Guests need approval
- **WHEN** guests are allowed with approval
- **THEN** it reads "Guests allowed (must be approved in advance)"

### Requirement: Sitter reviews

The page SHALL show "Sitter reviews (N)" with review cards, newest first, and load more on request. The section SHALL be hidden when there are no reviews.

#### Scenario: Load more
- **WHEN** a viewer on the reviews page reaches the end of the loaded reviews and more exist
- **THEN** a "Show more reviews" control loads the next page

#### Scenario: No reviews
- **WHEN** the listing has no reviews
- **THEN** the reviews section and its row are not shown

### Requirement: Location map

The page SHALL show the approximate location on a map with an area, never an exact point, and a note that the exact address is shared once a sit is confirmed.

#### Scenario: Privacy note
- **WHEN** the map is shown
- **THEN** the note reads "Approximate location. The exact address is shared once a sit is confirmed."

### Requirement: Pet parent and dates

The page SHALL show the pet parent card (photo, first name, "Pet parent", verified badge when verified) and, under "Sitter needed", one selectable chip per open date range. Dates under review are shown but can't be selected. When exactly one range is available, it SHALL be preselected.

#### Scenario: Choose dates
- **WHEN** a viewer selects "10 – 24 Feb 27"
- **THEN** that chip shows as selected, and the apply bar or owner card reflects it

#### Scenario: Single available range
- **WHEN** only one date range is open and not under review
- **THEN** it is selected when the page opens

#### Scenario: No open dates
- **WHEN** the listing has no open date ranges
- **THEN** "Sitter needed" reads "No dates available right now" and there is no call to action to apply

### Requirement: Primary call to action by viewer

The primary call to action SHALL depend on the viewer and use the primary (deep teal) button. Anonymous: "Join now to apply", which opens the membership prompt. Partial member: "Upgrade to apply" with a note that their membership doesn't include applying. Full sitter: "Apply". Pet parent viewing their own listing: no call to action, and a note that this is their listing.

#### Scenario: Anonymous viewer
- **WHEN** an anonymous viewer presses "Join now to apply"
- **THEN** a membership prompt opens explaining that members can apply, with "See membership plans" and "Not now"

#### Scenario: Partial member
- **WHEN** a partial member views the listing
- **THEN** the call to action reads "Upgrade to apply" and a note explains their current membership doesn't include applying

#### Scenario: Own listing
- **WHEN** the pet parent views their own listing
- **THEN** there is no apply action, favourite or report control, and a note reads "This is your listing"

#### Scenario: Everything under review, full sitter
- **WHEN** a full sitter views a listing where every date is under review
- **THEN** the call to action is disabled and reads "Applications paused"

### Requirement: Applying

A full sitter SHALL apply by choosing dates, pressing "Apply", optionally writing a message to the pet parent, and confirming. The page SHALL confirm success and prevent applying twice for the same dates.

#### Scenario: No dates selected
- **WHEN** a full sitter presses "Apply" with no dates selected and several are available
- **THEN** they are asked to choose dates first, and the date chips are brought into view

#### Scenario: Successful application
- **WHEN** a full sitter confirms an application
- **THEN** a confirmation "Application sent" appears, and for those dates the call to action reads "Applied" and is disabled

#### Scenario: Dates became unavailable
- **WHEN** the application fails because the dates are now under review
- **THEN** the viewer sees "These dates are no longer taking applications", and the dates refresh to show them as under review

### Requirement: Favourite

Signed-in viewers SHALL be able to save and unsave the listing with a heart control. It updates immediately and is reverted with a message if saving fails. Anonymous viewers pressing the heart SHALL see the membership prompt.

#### Scenario: Save
- **WHEN** a signed-in viewer presses the heart
- **THEN** it fills immediately and is announced as "Remove from favourites"

#### Scenario: Save fails
- **WHEN** saving the favourite fails
- **THEN** the heart returns to its previous state and a message says "We couldn't update your favourites. Please try again."

#### Scenario: Anonymous heart
- **WHEN** an anonymous viewer presses the heart
- **THEN** the membership prompt opens and nothing is saved

### Requirement: Share and refer a friend

The page SHALL let any viewer share the listing's web address. A "Know someone who'd love this sit?" block SHALL offer the same share action, for every viewer except the pet parent.

#### Scenario: Native share
- **WHEN** a viewer on a phone presses share
- **THEN** the system share sheet opens with the listing title and its web address

#### Scenario: Web without a share sheet
- **WHEN** a web browser doesn't support system sharing
- **THEN** the address is copied and a message says "Link copied"

### Requirement: Report listing

Any viewer except the pet parent SHALL be able to report the listing by choosing a reason (inaccurate, inappropriate, possible scam, no longer available, other), optionally adding details, and sending.

#### Scenario: Send a report
- **WHEN** a viewer chooses "Possible scam" and sends
- **THEN** the dialog closes and a message says "Thanks for letting us know. We'll take a look."

#### Scenario: Reason required
- **WHEN** a viewer tries to send without choosing a reason
- **THEN** sending is disabled until a reason is chosen

### Requirement: Detail pages

Each detail page SHALL have a title, a back control, the listing's name for context, and the same loading and error behaviour as the listing page. On desktop, detail pages SHALL render in a centred reading column.

#### Scenario: Back from a detail page
- **WHEN** a viewer presses back on a detail page they reached from the listing
- **THEN** they return to the listing at the scroll position they left

#### Scenario: Gallery
- **WHEN** a viewer presses the third photo
- **THEN** a full-screen viewer opens on photo 3 of N, can be swiped or arrowed through, and closes back to the listing

### Requirement: Web page metadata

On web, the listing page SHALL have the document title "{listing title} in {city} | TrustedHousesitters" and a meta description from the introduction. Each detail page SHALL have its own title.

#### Scenario: Browser tab
- **WHEN** listing 2001 is open on web
- **THEN** the tab title starts with the listing's title and includes "Montréal"
