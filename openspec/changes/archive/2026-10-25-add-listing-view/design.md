# Design

## Context

The design system (`@ths/ui`), the data contract and hooks (`@ths/api-contract/react`) and the mock API with scenarios already exist (see `specs/design-system`, `specs/mock-api`). Expo Router serves native and web from `apps/expo/app`. Reanimated 4 is in the dev client.

## Goals / Non-Goals

**Goals:**
- Zero platform-forked screen files. Layout differences come only from `useBreakpoint()` and NativeWind breakpoint classes.
- Behaviour logic (which call to action, which sections show) lives in pure functions that are unit-tested without rendering.

**Non-Goals:**
- Production static export of dynamic listing routes (`generateStaticParams`). The dev server renders them on demand.
- Animations beyond the collapsing header and toast fade.

## Decisions

**Routes.** `app/listing/[id]/_layout.tsx` (stack), `index.tsx`, `home.tsx`, `amenities.tsx`, `responsibilities.tsx`, `sit-essentials.tsx`, `reviews.tsx`, `pets/[petId].tsx`, and `gallery.tsx` (presented as a full-screen modal; `?photo=n` sets the start index). Route files stay thin: they read params and render a feature component.

**Feature folder for composition: `apps/expo/features/listing/`.** Section components (`HomeSection`, `AmenitiesSection`…) compose `@ths/ui` with layout-only classes (flex, gap, padding). No colours, type or radius are set here. If a section needs styling, it becomes a design system component first.

**View model.** `useListingPage(id)` runs the listing, assignments, pets, amenities, responsibilities, essentials, reviews (first page) and viewer queries in parallel. It returns data plus derived state from pure functions:
- `viewerRole(viewer, listing)` returns `anonymous | partial | full | owner`.
- `callToAction({ role, assignments, selectedId, applications })` returns `{ kind: 'join' | 'upgrade' | 'apply' | 'applied' | 'paused' | 'choose-dates' | 'none', label, disabled }`.
- `visibleSections(data)` decides which sections and rows show, given empty data.

Each spec scenario about call-to-action or visibility maps to a table test of these functions.

**Copy in one module.** `features/listing/copy.ts` holds every user-facing string the spec quotes, so tests assert against the same constants and wording changes happen in one place.

**Primary button is deep teal for every call to action.** The design-system spec reserves accent (purple) from primary calls to action. The live THS page uses purple for "Join now to apply". Following the spec keeps the system consistent. Switching to purple would mean changing the design-system spec first, not the screen.

**Mobile header.** The listing route hides the stack header and renders its own: an absolutely positioned bar with overlay IconButtons. Its background opacity and title fade are driven by a Reanimated scroll handler on the page's `Animated.ScrollView`. Reanimated runs on web too, so it's the same code.

**Desktop sidebar.** It uses `web:sticky web:top-6` on the right column. Desktop presentation only happens on web, so there's no native equivalent to handle.

**Date selection** is held in the page component, above the presentation switch, so resizing across the breakpoint keeps it. If exactly one range is available, it's preselected.

**Section-level errors.** The page treats the listing query as critical: loading shows the skeleton, error shows the full-page retry. Every other query renders per section: skeleton, inline `StatusBanner` with retry, or content.

**Sharing.** It uses `Share.share` from React Native core on native. On web it uses `navigator.share` when available, otherwise `navigator.clipboard.writeText` plus a toast. The shared URL is `{origin}/listing/{id}`. On native, the origin comes from `EXPO_PUBLIC_WEB_URL`, defaulting to the dev server URL.

**Design system additions.**
- RadioGroup, Textarea and Label come from the Reusables CLI, themed like the other primitives.
- Toast is a small in-house component: a provider plus a `useToast()` hook, rendered through the existing PortalHost with a Reanimated fade. It sits above the StickyApplyBar by reading a bottom offset from context.
- PhotoViewer uses a paging FlatList (same approach as the PhotoGallery carousel), arrow IconButtons, and a web `keydown` listener for arrows and Escape.

**Web metadata** comes from `expo-router/head` (`<Head><title>…</title><meta name="description" …/></Head>`) in each route.

**Testing.**
- Jest with `jest-expo` and React Native Testing Library. Tests render pages inside `ApiProvider`, with a `fetch` that calls the real mock app in-process (`createApp({ latency: false }).request`). Scenarios are exercised against the real mock behaviour, with no hand-written fixtures.
- Pure view-model functions get table tests.
- One Playwright smoke test on web, at 390 px and 1280 px wide, covers the mobile and desktop presentations against the running dev servers.

## Risks / Trade-offs

- [Expo Router web may not restore scroll position on back] → Verify. If needed, keep the listing mounted under detail pages (stack on web) or store the offset per listing.
- [jest-expo with NativeWind needs the CSS transformer configured] → Follow the NativeWind testing setup. If classes don't apply in tests, assert on accessibility roles and text, not styles.
- [Reanimated scroll handlers in tests] → Use Reanimated's Jest setup. The header's visual collapse is verified manually and in Playwright screenshots, not in unit tests.
