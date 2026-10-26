# Proposal

## Why

A listing with no reviews currently shows nothing in place of the reviews section, so new pet parents look the same as ones with an unknown history. A "New listing" badge turns that gap into something positive: it tells sitters the pet parent is new to the community, and encourages them to be the first to sit.

## What Changes

- The title block shows a "New listing" badge, in the design system's highlight (lime) style, when the listing has no reviews.
- It appears in the same place on every layout (phone and desktop) and on every platform. It's announced to screen readers as "New listing".

Out of scope:

- Any change to the reviews section, which stays hidden when there are no reviews.
- A time-based definition of "new" (for example, created in the last 30 days). The API doesn't expose a creation date, and reviews are the signal sitters care about.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `listing-view`: the Title block requirement gains the New listing badge.

## Impact

- `apps/expo/features/listing`: title block and copy only. It uses the existing `Badge` `highlight` variant, so there are no design system changes.
- No API or contract changes: `reviewCount` is already on the listing.
