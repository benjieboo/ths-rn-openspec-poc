# Spec Delta

## MODIFIED Requirements

### Requirement: Title block

The page SHALL show the listing title, the approximate location as "City, Region, Country", and one count badge per species. When the listing has no reviews, the title block SHALL also show a "New listing" badge in the highlight style.

#### Scenario: Animal counts
- **WHEN** a listing has one cat
- **THEN** a badge shows "1" with a cat icon and is announced as "1 cat"

#### Scenario: No pets
- **WHEN** a listing has no pets
- **THEN** no animal badges are shown

#### Scenario: New listing
- **WHEN** a listing has no reviews
- **THEN** a "New listing" badge appears in the title block on every layout and platform, and is announced as "New listing"

#### Scenario: Listing with reviews
- **WHEN** a listing has at least one review
- **THEN** no "New listing" badge is shown
