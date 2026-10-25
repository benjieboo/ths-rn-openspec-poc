# Spec Delta

## MODIFIED Requirements

### Requirement: Core primitives

The design system SHALL provide these primitives: Text (h1–h4, body, lead, small, caption, label, muted, link), Button (default deep teal, accent purple, outline, ghost, destructive, link), Badge (neutral, verified, highlight, accent and feedback tones), Card, Avatar with initials fallback, Separator, Skeleton, Dialog, AlertDialog, Tabs, Accordion, AspectRatio, RadioGroup and Textarea.

#### Scenario: Avatar without a photo
- **WHEN** an Avatar has no image or the image fails to load
- **THEN** it shows the person's initials

#### Scenario: Media keeps its space while loading
- **WHEN** an image inside an AspectRatio is loading
- **THEN** its space is reserved so surrounding content does not shift

#### Scenario: Radio group semantics
- **WHEN** a screen reader focuses a RadioGroup option
- **THEN** it announces the option label, its checked state and its position in the group

#### Scenario: Labelled text area
- **WHEN** a Textarea renders with a label
- **THEN** the label is visible and announced as the field's name

## ADDED Requirements

### Requirement: Toast

The design system SHALL provide brief, non-blocking messages that appear above content and dismiss themselves, in `default`, `success` and `error` tones, announced to assistive technology.

#### Scenario: Confirmation
- **WHEN** a screen shows a success toast
- **THEN** it appears above the content, clear of the safe area and any sticky bar, is announced, and disappears after about four seconds

#### Scenario: Several messages
- **WHEN** a second toast is shown while one is visible
- **THEN** the newer one replaces the older one

### Requirement: PhotoViewer

The design system SHALL provide a full-screen photo viewer that opens at a given photo, moves between photos by swipe, arrow buttons or keyboard arrows, shows "n / N", and closes with a labelled close control or the Escape key on web.

#### Scenario: Open at a photo
- **WHEN** the viewer opens at index 2 of 10
- **THEN** it shows photo 3 and "3 / 10"

#### Scenario: Keyboard on web
- **WHEN** a web user presses the right arrow key, then Escape
- **THEN** the next photo shows, then the viewer closes
