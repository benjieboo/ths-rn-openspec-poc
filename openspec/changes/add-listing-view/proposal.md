# Proposal

## Why

The listing page is where a sitter decides whether a sit is right for them and their first chance to act on it. It's the first journey of this POC: it has to prove that one spec, one design system and one set of routes can produce the same member experience as a native app and as responsive web pages.

## What Changes

- A listing page at `/listing/{id}`, rendered from one route on iOS, Android and web. It shows what a sitter needs to decide, in this order: photos, title and location, pets at a glance, the pet parent's introduction, the home, amenities, the pets, responsibilities, sit essentials, sitter reviews, location, and the pet parent with their dates.
- Two presentations from the same components: the mobile app pattern (full-bleed photos, collapsing header, rows that open detail pages, sticky apply bar) and the desktop web pattern (photo grid, two columns, sticky owner card).
- Detail pages for home and location, amenities, responsibilities, sit essentials, reviews, each pet, and a full-screen photo viewer. They're deep-linkable on every platform.
- Behaviour for every viewer: anonymous, partial member, full sitter and the listing's own pet parent. This covers the primary call to action, favourites, applying, sharing and reporting.
- Loading, error, empty and slow states for the page and for each section.
- Design system additions the page needs: Toast, PhotoViewer, RadioGroup and Textarea.

Out of scope:

- Membership purchase. "Join" and "Upgrade" open a placeholder prompt.
- Sign-in. The viewer comes from the mock API scenario.
- Messaging the pet parent, the matching-facets experiment, and refer-a-friend rewards. Refer-a-friend here is share only.
- Saved search context such as "back to results".

## Capabilities

### New Capabilities

- `listing-view`: What a sitter sees and can do on a listing, across viewer states, layouts and data conditions, including the detail pages.

### Modified Capabilities

- `design-system`: Core primitives gain RadioGroup and Textarea. New Toast and PhotoViewer components.

## Impact

- `apps/expo/app/listing/[id]/…`: new routes. `apps/expo/features/listing/`: section compositions built only from `@ths/ui`.
- `packages/ui`: Toast, PhotoViewer, RadioGroup, Textarea.
- Test tooling: Jest with React Native Testing Library for the app, and a Playwright smoke test on web.
- No contract changes are expected. If the page needs data the contract lacks, the contract changes through its own spec delta first.
