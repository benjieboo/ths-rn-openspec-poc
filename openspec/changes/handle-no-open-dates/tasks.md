# Tasks

## 1. Mock API: `no-open-dates` scenario

- [x] 1.1 Add `no-open-dates` to `DATA_SCENARIOS` and `SCENARIO_DESCRIPTIONS` in `packages/api-contract/src/scenarios.ts` ("Listing has no open dates"). Verify: it's listed on `/dev/scenarios` and `parseScenarios('full-sitter,no-open-dates')` succeeds
- [x] 1.2 Add the transform in `packages/mock-api/src/scenarios.ts`, emptying `assignments` and `sitEssentials.dates` and leaving the guest and sitter pets policy alone
- [x] 1.3 Vitest in `app.test.ts` for "No open dates" (`/listings/2001/assignments` is empty, sit essentials has no dates and the same guest policy) and "No open dates combined with all under review" (both orders give an empty list). Verify: `pnpm --filter @ths/mock-api test`

## 2. Design system: summary-only StickyApplyBar

- [x] 2.1 Make `action` optional in `packages/ui/src/composites/sticky-apply-bar.tsx`, and add a summary-only example to the showcase in `apps/expo/app/design-system.tsx`
- [x] 2.2 Jest test "Summary only" in `design-system.test.tsx`: the bar renders its summary with no button, and keeps its safe-area padding. Verify: `pnpm --filter @ths/expo test design-system`

## 3. Listing logic: keep "loading", "failed" and "no dates" apart

- [x] 3.1 In `features/listing/logic.ts`, `callToAction` takes `assignments: Assignment[] | undefined` plus `datesFailed`, and returns `loading`, `none/dates-error` or `none/no-dates` as in design.md. `visibleSections.sitEssentials` is always `true`, and the `assignmentsLoaded` input goes away. Update `use-listing-page.ts` to pass the query's data and status, not `?? []`
- [x] 3.2 Update `logic.test.ts`: the existing "No open dates" case for every role (anonymous, partial, full give `none/no-dates`, owner gives `none/owner`), plus new cases for dates still loading (`loading`) and dates failed (`none/dates-error`), and sit essentials visible with `[]`. Verify: `pnpm --filter @ths/expo test logic`

## 4. Listing screens

- [x] 4.1 `DateChips` (sections.tsx) shows an inline error with "Try again" when dates fail, reusing the section error pattern. Add any new copy to `copy.ts`
- [x] 4.2 In `mobile-listing.tsx`, hide the bar only for the pet parent. For `no-dates` the summary is `copy.noDates` with no action. For `dates-error` it's the error copy with a "Try again" action that refetches the dates
- [x] 4.3 Let the `openListing` helper in `test/__tests__/listing.test.tsx` also settle on "No dates available right now", so listings with no CTA can be opened
- [x] 4.4 Jest tests named after the listing-view scenarios, using `scenario: 'no-open-dates'` with each viewer: "Anonymous viewer, no dates" (no join action, and the heart opens the membership prompt), "Partial member, no dates" (no upgrade action or note), "Full sitter, no dates" (no apply, heart and report present), "Pet parent, no dates" (own-listing note, no favourite or report), "No banner" (with `all-assignments-reviewing` too). Verify: `pnpm --filter @ths/expo test listing`
- [x] 4.5 Jest tests "Apply bar with no open dates" (phone width: the bar reads the no-dates copy with no button) and "Sit essentials: No open dates" (desktop section, mobile row and the `/sit-essentials` detail page show the guest policy and no arrival or departure). Verify: `pnpm --filter @ths/expo test listing`
- [x] 4.6 Jest tests "Dates still loading" (no no-dates copy while dates are pending) and "Dates fail to load" (fail `/assignments` with the existing `failing` helper: inline error and "Try again" are shown, no apply action, and the mobile bar offers "Try again"; pressing it refetches and the CTA appears). Verify: `pnpm --filter @ths/expo test listing`
- [x] 4.7 Confirm the existing listing scenarios still pass, especially "Apply bar", "Single available range" and "Everything under review, full sitter". Verify: `pnpm --filter @ths/expo test`

## 5. Cross-platform check

- [x] 5.1 Playwright check at 390 and 1280 px with `?scenario=no-open-dates`: the no-dates copy is visible, there's no primary CTA, and the sit essentials guest policy is visible. At 390 px the bar stays visible after scrolling. Verify: `pnpm --filter @ths/expo e2e`
- [x] 5.2 See it on the iOS simulator as a full sitter with `no-open-dates`. Verify: screenshots in `docs/screenshots/ios-no-open-dates.png` and `web-mobile-no-open-dates.png`

## 6. Notify me

- [x] 6.1 Add `notifyRequested` to `useListingPage`, a `NotifyButton` in `owner-panel.tsx` (outline, `sm`, success toast, then a disabled "You'll be notified"), and copy in `copy.ts`. Render it in the mobile bar's action for `none/no-dates`, with the bar's summary as a caption-style small title, and in the desktop owner card. Verify: `pnpm --filter @ths/expo exec tsc --noEmit`
- [x] 6.2 Jest tests "Ask to be notified", "Notify me on every layout" (phone and desktop), "Not for the pet parent", "Only with no open dates" (open dates, and dates still loading) and "Not kept after reload". Update "Apply bar with no open dates" and "Anonymous viewer, no dates". Verify: `pnpm --filter @ths/expo test`
- [x] 6.3 Extend the Playwright no-open-dates check to press "Notify me" at 390 and 1280 px and see "You'll be notified", then re-capture the web and iOS screenshots. Verify: `pnpm --filter @ths/expo e2e`, plus the updated `docs/screenshots/*no-open-dates*`

## Workflow follow-up

- Archive the change so `specs/listing-view`, `specs/mock-api` and `specs/design-system` include these requirements
- Propose the follow-up product change (saving and delivering "Notify me" requests, a no-dates banner, nudging viewers to save, and whether anonymous and partial members get a conversion CTA) once product has weighed in
