# Proposal

## Why

Every journey in this POC, starting with the Listing page, must be composed from one cross-platform design system so that native and web stay identical by construction. Today `@ths/ui` holds stock shadcn/Reusables primitives in a neutral theme. Nothing looks like TrustedHousesitters, and there are no components for the things a listing actually shows (pets, dates, reviews, owner, location).

## What Changes

- Theme the design system with THS semantic tokens: deep-teal trust anchor, mid-teal brand marks, purple accent and lime highlight for personality moments only, Poppins type scale, THS radius, elevation and breakpoints.
- Re-tune the shadcn/Reusables primitives (Button, Text, Badge, Card, Avatar, Separator, Skeleton, Dialog, AlertDialog, Tabs, Accordion, AspectRatio, Icon) to the THS component patterns.
- Add the THS composite components the Listing journey needs: PhotoGallery, OwnerCard, DateRangeChip, PetCard, AmenityList, ReviewCard, ActionListRow, StickyApplyBar, ReadMore, AnimalCountBadge, MapPreview, StatusBanner, IconButton, Section.
- Add a responsive breakpoint contract (mobile app pattern below `lg`, desktop web pattern at `lg` and above) shared by every component.
- Add a design-system showcase route that renders every component on native and web from one file, so drift is visible.

Out of scope:

- Dark and Inverted modes. Light mode only for the POC; the token structure leaves room to add them.
- Toast and Sheet/Drawer. Reusables doesn't ship them; they get added when a journey spec needs them.
- Storybook. The showcase route covers review for now.
- Any Listing screen composition. That belongs to the `listing-view` change.

## Capabilities

### New Capabilities

- `design-system`: The THS cross-platform component contract. Covers the tokens screens may use, the components they compose from, how components adapt by breakpoint, and the accessibility guarantees each component provides.

### Modified Capabilities

None.

## Impact

- `packages/tokens`: new THS theme (CSS variables, Tailwind preset, TS constants, breakpoints).
- `packages/ui`: themed primitives, new composites, `useBreakpoint`, font loading.
- `apps/expo`: loads Poppins, forces light mode, adds `/design-system` showcase route.
- New dependency: `@expo-google-fonts/poppins` (JS and font assets only, so no native rebuild).
- Map tiles come from OpenStreetMap with attribution. No API key.
