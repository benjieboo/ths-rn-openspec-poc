# design-system Specification

## Purpose
The THS design system is the only source of UI for every journey. It guarantees that a screen composed from it looks and behaves like TrustedHousesitters on iOS, Android and web, adapts to the viewer's screen size, and meets accessibility requirements without per-screen effort.

## Requirements

### Requirement: Semantic tokens only

Screens and composite components SHALL reference THS semantic tokens (surface, text, interactive, border, icon, feedback) and SHALL NOT use raw colour values or primitive palette steps. When no semantic token fits a need, the gap SHALL be recorded in this spec before a value is introduced.

#### Scenario: Primary call to action colour
- **WHEN** a screen renders a primary call to action
- **THEN** it uses the primary interactive token (deep teal) with inverted text

#### Scenario: Accent and highlight reserved for personality
- **WHEN** a component needs a personality moment (a pet-type tag, a "new" badge, an accent callout)
- **THEN** it uses the accent (purple) or highlight (lime) tokens
- **AND** those tokens are never used for the primary call to action of a screen

#### Scenario: Missing token
- **WHEN** a design need has no matching semantic token
- **THEN** the gap is added to the "Known token gaps" requirement before any value is introduced

### Requirement: Known token gaps

The design system SHALL list every place where it uses a value that is not a published THS semantic token, with the reason.

#### Scenario: Visible divider
- **WHEN** a component needs a visible hairline divider on a white surface
- **THEN** it uses the `divider` token (grey 200), because the published `border/subtle` (grey 50) is not visible on white
- **AND** this gap stays listed until the THS token set publishes a visible subtle border

#### Scenario: Verified badge contrast
- **WHEN** a verified badge renders
- **THEN** it uses the brand-subtle surface with default text, because the published pattern (inverted text on brand teal) is 2.9:1 and fails WCAG AA for small text

#### Scenario: Skeleton surface
- **WHEN** a loading skeleton renders
- **THEN** it uses the `divider` token as its fill, for the same reason

### Requirement: Typography

All text SHALL render in Poppins on every platform, at weight 400 or heavier, in sentence case, using the THS type scale. Display text uses the heading colour; body text uses the default text colour (deep teal, not black).

#### Scenario: Fonts not yet loaded
- **WHEN** the app starts and Poppins has not finished loading
- **THEN** the splash screen stays visible until fonts are ready, so text never re-flows after first paint

#### Scenario: Heading semantics
- **WHEN** a heading-level text is rendered
- **THEN** it is exposed to assistive technology as a heading with its level (1–4)

#### Scenario: Weight floor
- **WHEN** any text is rendered
- **THEN** its weight is 400 or heavier

### Requirement: Responsive layout contract

The design system SHALL expose one breakpoint contract used by every component and screen: the mobile app pattern applies below 1024 px wide (all native devices and narrow web), and the desktop pattern applies at 1024 px and above. Components SHALL adapt within themselves and SHALL NOT require platform-specific screen files.

#### Scenario: Native phone
- **WHEN** a component renders on a native phone
- **THEN** it uses its mobile presentation

#### Scenario: Narrow browser window
- **WHEN** a component renders on web narrower than 1024 px
- **THEN** it uses the same mobile presentation as native

#### Scenario: Desktop browser
- **WHEN** a component renders on web at 1024 px or wider
- **THEN** it uses its desktop presentation where one is defined, otherwise its mobile presentation

#### Scenario: Window resized across the breakpoint
- **WHEN** a web viewer resizes the window across 1024 px
- **THEN** components switch presentation without a reload

### Requirement: Accessible by default

Every interactive component SHALL expose a role and an accessible name, provide a touch target of at least 44 × 44 pt, show a visible focus indicator on web keyboard focus, and meet WCAG AA contrast for text and icons against its surface.

#### Scenario: Icon-only control
- **WHEN** an icon-only control (favourite, share, close) is rendered
- **THEN** it requires an accessible label and exposes it to screen readers

#### Scenario: Keyboard focus on web
- **WHEN** a web user tabs to an interactive component
- **THEN** a focus ring in the focus token is visible around it

#### Scenario: Selected and disabled states announced
- **WHEN** a selectable component (for example a date range) is selected or unavailable
- **THEN** its selected or disabled state is exposed to assistive technology, not only shown visually

### Requirement: Compose only from the catalogue

Screens SHALL compose only from design system components plus layout views. A screen that needs UI not provided by the design system SHALL add it to the design system, with its own requirement in this spec, before using it.

#### Scenario: Screen needs an unlisted component
- **WHEN** a journey needs UI that the design system does not provide
- **THEN** the component and its requirement are added to the design system first

### Requirement: Core primitives

The design system SHALL provide these primitives: Text (h1–h4, body, lead, small, caption, label, muted, link), Button (default deep teal, accent purple, outline, ghost, destructive, link), Badge (neutral, verified, highlight, accent and feedback tones), Card, Avatar with initials fallback, Separator, Skeleton, Dialog, AlertDialog, Tabs, Accordion and AspectRatio.

#### Scenario: Avatar without a photo
- **WHEN** an Avatar has no image or the image fails to load
- **THEN** it shows the person's initials

#### Scenario: Media keeps its space while loading
- **WHEN** an image inside an AspectRatio is loading
- **THEN** its space is reserved so surrounding content does not shift

### Requirement: IconButton

The design system SHALL provide an icon-only button in `ghost`, `outline` and `overlay` (on photography) styles, which cannot be rendered without an accessible label.

#### Scenario: Overlay on a photo
- **WHEN** an overlay IconButton sits on top of photography
- **THEN** it has a solid backing so the icon meets contrast on any photo

### Requirement: Section

The design system SHALL provide a Section that gives a page block a heading, optional trailing action and content, with consistent vertical rhythm.

#### Scenario: Section heading semantics
- **WHEN** a Section renders its title
- **THEN** the title is announced as a level 2 heading

### Requirement: ReadMore

The design system SHALL provide a ReadMore text block that collapses long copy to a set number of lines with a toggle.

#### Scenario: Long text
- **WHEN** content is longer than the collapsed length
- **THEN** a "Read more" control expands it, changes to "Show less", and announces the expanded state

#### Scenario: Short text
- **WHEN** content fits within the collapsed length
- **THEN** no toggle is shown

### Requirement: ActionListRow

The design system SHALL provide a navigable row with a label, optional description and a trailing chevron, at least 56 pt tall, exposed as a link.

#### Scenario: Row activated
- **WHEN** a user presses an ActionListRow
- **THEN** its action runs and the row shows a pressed state

### Requirement: StatusBanner

The design system SHALL provide an inline status banner in `info`, `success`, `warning`, `error` and `brand` tones, with a tone icon and message.

#### Scenario: Banner announced
- **WHEN** a StatusBanner appears
- **THEN** its message is exposed to assistive technology as a status, not only shown by colour

### Requirement: AnimalCountBadge

The design system SHALL provide a badge showing a count and species icon for each species on a listing.

#### Scenario: Spoken count
- **WHEN** a screen reader focuses an AnimalCountBadge for two dogs
- **THEN** it announces "2 dogs", not the icon name

### Requirement: PhotoGallery

The design system SHALL provide a listing photo gallery that adapts by breakpoint and reports which photo was pressed.

#### Scenario: Mobile presentation
- **WHEN** it renders below the desktop breakpoint
- **THEN** photos are swipeable at full width with a visible "n / N" position indicator

#### Scenario: Desktop presentation
- **WHEN** it renders at the desktop breakpoint with five or more photos
- **THEN** it shows one large and four small photos and a control with the total photo count

#### Scenario: Photo pressed
- **WHEN** a viewer presses a photo or the photo count control
- **THEN** the gallery reports the photo index so the screen can open a full-screen view

### Requirement: DateRangeChip

The design system SHALL provide a selectable chip for one sit date range, including an unavailable `reviewing` state.

#### Scenario: Selection announced
- **WHEN** a DateRangeChip is selected
- **THEN** its selected state is shown and exposed to assistive technology

#### Scenario: Reviewing
- **WHEN** a DateRangeChip is in the reviewing state
- **THEN** it cannot be selected and shows and announces that applications are being reviewed

### Requirement: OwnerCard

The design system SHALL provide a pet parent summary with avatar, name, role label and optional verification, plus a slot for dates and a call to action.

#### Scenario: Verified owner
- **WHEN** the owner is verified
- **THEN** a verified badge in the brand token is shown next to their name

### Requirement: PetCard

The design system SHALL provide a pressable card for one pet showing photo, name, breed and age.

#### Scenario: Pet without a photo
- **WHEN** a PetCard has no photo
- **THEN** it shows a species illustration instead of an empty space

### Requirement: AmenityList

The design system SHALL provide a list of home amenities with an optional limit.

#### Scenario: More amenities than the limit
- **WHEN** an AmenityList has more amenities than its limit
- **THEN** it shows only the limit and a "Show all N amenities" control with the full count

### Requirement: ReviewCard

The design system SHALL provide a card for one sitter review: reviewer avatar and name, review text with read more, and stay dates.

#### Scenario: Long review
- **WHEN** a review is longer than the collapsed length
- **THEN** it collapses with a read more control

### Requirement: MapPreview

The design system SHALL provide an approximate location map that never reveals an exact address.

#### Scenario: Location privacy
- **WHEN** a MapPreview renders
- **THEN** it shows an area circle around an approximate point, with no pin on an exact address
- **AND** map attribution is visible

#### Scenario: Map announced
- **WHEN** a screen reader focuses the map
- **THEN** it announces the approximate location in words

### Requirement: StickyApplyBar

The design system SHALL provide a bar pinned to the bottom of the screen, above the device safe area, with a summary slot and an action slot, for the mobile presentation.

#### Scenario: Safe area
- **WHEN** a StickyApplyBar renders on a device with a home indicator
- **THEN** its content sits above the home indicator

### Requirement: Visual parity across platforms

The design system SHALL provide a showcase page that renders every catalogue component from one route on native and web, so differences between platforms can be reviewed side by side.

#### Scenario: Showcase on native and web
- **WHEN** a reviewer opens the design system showcase on iOS and on web
- **THEN** both render every catalogue component from the same route file with the same tokens
