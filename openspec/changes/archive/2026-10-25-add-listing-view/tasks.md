# Tasks

## 1. Design system additions (before any screen work)

- [x] 1.1 Add RadioGroup, Textarea and Label via the Reusables CLI into `packages/ui`, themed to THS. Verify: showcase renders them; tests for "Radio group semantics" and "Labelled text area"
- [x] 1.2 Toast provider and `useToast()` with default, success and error tones, auto-dismiss after about 4 s, newest replaces oldest, offset above sticky bars. Verify: tests for "Confirmation" and "Several messages"; showcase buttons trigger each tone on iOS and web
- [x] 1.3 PhotoViewer: opens at an index, swipe, arrow buttons, "n / N", close button, web arrow keys and Escape. Verify: Jest test for "Open at a photo"; Playwright test for "Keyboard on web" (real browser)
- [x] 1.4 Export the new components and update the showcase route. Verify: `pnpm typecheck`

## 2. Test tooling

- [x] 2.1 Jest (`jest-expo`) and React Native Testing Library in `apps/expo`, with NativeWind and Reanimated test setup. Verify: a smoke test renders the home route
- [x] 2.2 Test helper that renders a route inside `ApiProvider` backed by the in-process mock API, taking a scenario. Verify: a test reads `/me` as `full-sitter`
- [x] 2.3 Playwright on web with two viewport projects (390 and 1280 px). Verify: `pnpm --filter @ths/expo e2e` runs the design-system keyboard test at both widths

## 3. View model

- [x] 3.1 `copy.ts` with every string the spec quotes. Verify: the spec's quoted strings appear in `copy.ts`
- [x] 3.2 `viewerRole`, `callToAction`, `visibleSections` and the formatting helpers (location line, age, time alone, home facts, handover time, guest policy). Verify: table tests cover the call-to-action scenarios (anonymous, partial, own listing, paused, no dates, choose dates, applied) and visibility scenarios (no pets, no amenities, no reviews, all reviewing banner)
- [x] 3.3 `useListingPage(id)` with parallel queries and date selection state (single available range preselected). Verify: test for "Single available range"

## 4. Listing page layouts

- [x] 4.1 Routes under `app/listing/[id]/` with thin route files. Verify: tests for "Open a listing from a link" and "Deep link to a detail page"; "Back from a detail page" scroll restore checked manually on iOS and web
- [x] 4.2 Mobile presentation: full-bleed gallery, custom collapsing header with back, favourite and share, section rows, pets scroller, map, owner card with dates, StickyApplyBar. Verify: render test at phone width finds rows and the apply bar; manual check of the collapse on iOS and mobile web
- [x] 4.3 Desktop presentation: header row, photo grid, two columns, inline sections, sticky owner card, refer a friend and report in the sidebar. Verify: render test at 1280 px finds inline sections and no section rows ("Sections inline"); test for "Resize across the breakpoint" keeps the selected dates; manual sticky check
- [x] 4.4 Content order and heading levels. Verify: test reads headings in order (title level 1, sections level 2)

## 5. Sections

- [x] 5.1 Title block, status banner, introduction. Verify: tests for "Animal counts", "No pets", "All dates under review", "Some dates open", "Long introduction"
- [x] 5.2 Home and location, amenities (highlights first, show all), location map with privacy note. Verify: tests for "Home facts", "Show all", "No amenities", "Privacy note"
- [x] 5.3 Pets section and responsibilities. Verify: tests for "Age wording", "Time alone wording", "Medication"
- [x] 5.4 Sit essentials and sitter reviews (preview inline, hidden when empty). Verify: tests for "Times to be agreed", "Guests need approval", "No reviews"
- [x] 5.5 Pet parent card and date chips. Verify: tests for "Choose dates" and "No open dates"

## 6. Detail pages

- [x] 6.1 Home, amenities (grouped), responsibilities, sit essentials pages with title, back, listing context, centred column on desktop. Verify: render test per page
- [x] 6.2 Reviews page with "Show more reviews" pagination. Verify: test for "Load more" (12 reviews, 3 pages)
- [x] 6.3 Pet page with details and that pet's responsibilities. Verify: test for "Open a pet"
- [x] 6.4 Gallery route using PhotoViewer, opened at the pressed photo. Verify: test for "Gallery" (photo 3 of N)

## 7. Actions

- [x] 7.1 Primary call to action per viewer, membership prompt, upgrade note, own-listing note. Verify: tests for "Anonymous viewer", "Partial member", "Own listing", "Everything under review, full sitter"
- [x] 7.2 Apply flow: choose dates, message, confirm, success toast, applied state, 409 handling. Verify: tests for "No dates selected", "Successful application", "Dates became unavailable"
- [x] 7.3 Favourite with optimistic update, error toast, anonymous prompt. Verify: tests for "Save", "Save fails" (`favourite-error`), "Anonymous heart"
- [x] 7.4 Share and refer a friend (native share sheet, Web Share, copy-link fallback with toast). Verify: Jest test for "Native share" (Share mocked); Playwright test for "Web without a share sheet"
- [x] 7.5 Report listing dialog with reasons, optional details, disabled until chosen, confirmation toast. Verify: tests for "Send a report" and "Reason required"

## 8. States and metadata

- [x] 8.1 Loading skeleton per presentation and no layout shift. Verify: tests for "First load"; manual check with `loading-slow`
- [x] 8.2 Full-page error with retry, section-level errors, not-found page. Verify: tests for "Listing fails", "One section fails", "Unknown listing"
- [x] 8.3 Web title and meta description per route. Verify: Playwright test for "Browser tab" (Head is web-only)

## 9. Cross-platform verification

- [x] 9.1 Playwright smoke at 390 and 1280 px for `anonymous` and `full-sitter`: page renders, call to action label correct, apply flow succeeds for full sitter. Verify: e2e passes
- [x] 9.2 Screenshots of iOS, mobile web and desktop web for `anonymous` and `full-sitter`, saved to `docs/screenshots/`. Verify: files present and visually reviewed
- [x] 9.3 Confirm no `.web.tsx` / `.native.tsx` files outside `packages/ui`. Verify: `find` returns nothing

## Workflow follow-up

- Archive this change so `openspec/specs/listing-view/spec.md` reflects the shipped behaviour and `design-system` gains the new components
