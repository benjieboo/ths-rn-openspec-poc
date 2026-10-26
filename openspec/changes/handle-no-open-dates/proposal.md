# Proposal

## Why

A listing with no open dates is a dead end for a sitter, and today it's handled by decisions nobody wrote down. On mobile the apply bar disappears, so a sitter only finds out they can't apply after scrolling to the bottom of the page. The sit essentials section is hidden too, taking the guest policy with it. The state also can't be reproduced: no mock scenario or seeded listing has zero open dates, even though the mock API promises that every state a member can see is reproducible.

## What Changes

- Add a `no-open-dates` data scenario to the mock API. It returns zero open date ranges and keeps the listing's other resources consistent with that. It combines with any viewer scenario and with `all-assignments-reviewing`.
- On mobile, keep the apply bar visible when there are no open dates. "No dates available right now" is its small title, and "Notify me" is a secondary action instead of the call to action.
- Offer "Notify me" on every layout when there are no open dates, for every viewer except the pet parent. For now it only confirms with a message and changes to "You'll be notified" for the visit. Nothing is saved.
- The design system's StickyApplyBar can render without an action, so a bar with only a summary is possible.
- Specify the current behaviour that was never written down. With no open dates, no viewer other than the pet parent gets a call to action (anonymous and partial members included). The pet parent still sees "This is your listing". No status banner is shown. Favourite, share, refer a friend and report work as usual.
- Stop treating dates that are still loading, or that failed to load, as "no dates". Today the page does, so the call to action disappears while dates load and is never offered if they fail.
- Sit essentials stays visible with no open dates: the guest policy and whether sitters can bring pets are shown, and the arrival and departure details are left out. This applies to the inline section, the mobile row and the detail page.

## Out of scope

- A dedicated "no dates" status banner.
- Saving a "Notify me" request or actually sending notifications. That needs an API and a delivery channel, and needs product input.
- Nudging viewers to save the listing.
- Any membership conversion call to action ("Join now", "Upgrade") for anonymous or partial members on a listing with no dates. A later change may revisit this with product input.
- Showing past or filled dates, or explaining why there are none.
- Seeding a third listing that has no dates. The scenario covers it.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `mock-api`: Scenario selection gains the `no-open-dates` data scenario.
- `listing-view`: a new "No open dates" requirement (behaviour per viewer, no banner, and not mistaking loading or failed dates for no dates), plus changes to Mobile presentation (the apply bar stays) and Sit essentials (stays visible).
- `design-system`: StickyApplyBar may render with only a summary.

## Impact

- `packages/api-contract/src/scenarios.ts`: new scenario name and description. The scenarios dev screen picks it up from these lists.
- `packages/mock-api/src/scenarios.ts`: new transform, and tests in `app.test.ts`.
- `packages/ui/src/composites/sticky-apply-bar.tsx`: `action` becomes optional, and the showcase gets a summary-only example.
- `apps/expo/features/listing/`: `logic.ts` (sit essentials visibility), `mobile-listing.tsx` (bar visibility and summary), `copy.ts`, and their Jest and Playwright tests.
- No API shape changes and no new dependencies.
