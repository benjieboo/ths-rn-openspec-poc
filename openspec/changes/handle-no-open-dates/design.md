# Design

## Context

The listing page derives its call to action and section visibility from `features/listing/logic.ts`. `use-listing-page.ts` passes it `assignments.data ?? []`, so dates that are still loading, dates that failed to load and a genuinely empty list all look the same: an empty array. `callToAction` maps an empty array to `{ kind: 'none', reason: 'no-dates' }`, and `mobile-listing.tsx` hides the apply bar for any `none`. `visibleSections` hides sit essentials when the list is empty. `SitEssentialsContent` already skips date entries it can't match, and always renders the guest policy.

On the mock side, data scenarios are pure transforms over a seed listing in `packages/mock-api/src/scenarios.ts`, and the scenario names and descriptions live in `packages/api-contract/src/scenarios.ts`.

## Goals / Non-Goals

**Goals:**
- Keep "no dates", "dates loading" and "dates failed" separate all the way to the UI.
- Change the existing screens as little as possible. No new screen components.

**Non-Goals:**
- Failing only the dates endpoint from the mock. The Jest tests cover the failed-dates path with a mocked query, and a scenario that fails one endpoint at a time is a separate decision.

## Decisions

**The `no-open-dates` transform empties both `assignments` and `sitEssentials.dates`.** Sit essentials refers to dates by id, so leaving its entries would make the data inconsistent, the same way `no-pets` also clears the per-pet responsibilities. Emptying wins whatever the order, so combining it with `all-assignments-reviewing` needs no special handling. *Alternative:* seed a third listing with no dates. Rejected because a scenario works on every listing and costs nothing in seed upkeep.

**Pass the dates' query status into `callToAction`, not just the list.** `callToAction` gets `assignments: Assignment[] | undefined` and a `datesFailed` flag. `undefined` returns `{ kind: 'loading' }` (the existing skeleton). A failure returns `{ kind: 'none', reason: 'dates-error' }`. Only a successful empty list returns `reason: 'no-dates'`. The role checks stay first, so the pet parent's note is unchanged. *Alternative:* keep the empty-array default and check the query status in each layout. Rejected because it spreads the same rule across mobile and desktop.

**The mobile bar hides only for the pet parent.** `showBar` becomes `!(cta.kind === 'none' && cta.reason === 'owner')`. For `no-dates`, the summary is the "No dates available right now" copy and there is no action. For `dates-error`, the summary is the inline error copy and the action is a "Try again" button that refetches the dates. This keeps what the bar tells you the same as what the dates section says.

**`DateChips` handles all three states.** Loading shows the skeleton, as now. A failure shows an inline error with "Try again". It reuses the existing section error pattern from `section-state.tsx` rather than adding new UI. An empty list shows "No dates available right now".

**Sit essentials is always visible.** `visibleSections.sitEssentials` becomes `true`, and the `assignmentsLoaded` input goes away. The content already renders only the parts it has. The detail page needs no change.

**"Notify me" is page state, not API state.** A `notifyRequested` flag lives in `useListingPage` next to the date selection, so it survives the mobile/desktop switch but not a reload. One `NotifyButton` (in `owner-panel.tsx`) renders in the mobile bar's action slot and in the desktop owner card when `cta` is `none/no-dates`. It uses the catalogue's `outline` Button at `sm` size, so the design system needs no change. Pressing it shows the existing success toast. *Alternative:* a mock endpoint storing alerts on `/me`. Deferred because the product hasn't defined delivery, and the spec says plainly that nothing is saved.

**`StickyApplyBar.action` becomes optional.** The component already renders `{action}` after a `flex-1` summary, so leaving it out gives a full-width summary. This is a type change plus a showcase example. Per project rules, it lands before the screen tasks.

## Risks / Trade-offs

- [Anonymous and partial members lose a membership prompt on listings with no dates] → This is a deliberate decision, recorded as out of scope in the proposal for product to revisit.
- [A sitter with a stale page applies to dates that have since closed, and the mock responds 404 `not_found`, not 409 `not_available`] → This is existing behaviour and unchanged here. It's worth a look when the per-endpoint failure scenarios are designed.
- ["Notify me" promises something it doesn't do yet] → It's acceptable for the POC, and the spec says so. A real build needs the alert stored and delivered before shipping, and that's listed as a follow-up.
