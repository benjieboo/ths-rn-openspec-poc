# Tasks

## 1. Implement from the delta

- [ ] 1.1 Add the badge label to `features/listing/copy.ts` and render it in `TitleBlock` with the `highlight` Badge when `reviewCount` is 0. Verify: no platform-specific files changed (`git diff --stat` shows only shared files)
- [ ] 1.2 Jest tests for "New listing" (scenario `no-reviews`, phone and desktop widths) and "Listing with reviews". Verify: `pnpm --filter @ths/expo test`
- [ ] 1.3 Playwright check for "New listing" at 390 and 1280 px. Verify: `pnpm --filter @ths/expo e2e`
- [ ] 1.4 See it on the iOS simulator with the `no-reviews` scenario. Verify: screenshot in `docs/screenshots/ios-new-listing.png`

## Workflow follow-up

- Archive the change so `specs/listing-view` includes the badge
