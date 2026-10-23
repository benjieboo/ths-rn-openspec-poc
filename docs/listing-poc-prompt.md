# Prompt: OpenSpec + React Native–first POC (THS Listing page)

> The brief this repo is built from. Phases are tracked in the README.

---

## Goal

Build a proof-of-concept environment that shows two things working together:

1. **Spec-driven development with OpenSpec.** User journeys live as persistent, shared specs in the repo. An agent reads a spec and generates the experience from it. The spec is the source of truth. Code is the output.
2. **React Native first, for app and web.** One codebase, one design system, one set of routes. It renders as a native iOS/Android app and as React Native Web pages that stay in sync automatically, because they are the same components and the same routes.

The first experience is the **TrustedHousesitters sitter-facing Listing page**. Rebuild what the member sees and how it's structured. Don't copy how it's built today.

## Tech stack (use these unless something blocks you; if it does, tell me why before swapping)

- **Monorepo:** pnpm workspaces + Turborepo.
- **App:** Expo (latest stable SDK) + **Expo Router** for universal file-based routes. A route file under `app/` is a native screen and a web page at the same URL. Web output: `web.output: "static"` (or `"server"` if you need API routes), so listing pages get real URLs and SSR-friendly HTML.
- **Design system:** **React Native Reusables** (the shadcn/ui port for React Native), on **NativeWind v4** (Tailwind for RN). Treat it like shadcn: components are copied into our package and owned, not imported from node_modules.
- **Spec tooling:** **OpenSpec** (`npx @fission-ai/openspec@latest init`), configured for Claude Code.
- **Mock backend:** a small **Hono** server in its own package, with a JSON seed file as the "database", **zod** schemas shared with the app, and **TanStack Query** on the client.
- **Language:** TypeScript strict everywhere.

## Repo shape

```
/openspec
  project.md               # conventions, stack, DS rules, definition of done
  specs/
    listing-view/spec.md   # the Listing user journey (source of truth)
    design-system/spec.md  # DS contract: tokens, components, usage rules
    mock-api/spec.md       # endpoint contracts
  changes/                 # OpenSpec change proposals (proposal.md, tasks.md, spec deltas)
/apps/expo                 # Expo Router app → iOS, Android, Web
/packages/ui               # RN design system (shadcn/Reusables-based, THS-themed)
/packages/tokens           # design tokens → tailwind preset + TS constants
/packages/api-contract     # zod schemas + inferred types + typed fetch client
/packages/mock-api         # Hono server + seed.json + scenario switching
/packages/ui/storybook     # optional: on-device + web Storybook for the DS
```

## Phase 0: Scaffold and confirm
1. Scaffold the monorepo, Expo app, NativeWind, and Reusables. Initialise OpenSpec.
2. Prove a "hello" route renders on **iOS simulator** and **web** from the same file.
3. Stop and show me the structure before Phase 1.

## Phase 1: Design system (`packages/ui` + `packages/tokens`)
- Start from Reusables/shadcn primitives: Button, Card, Badge, Avatar, Separator, Sheet/Drawer, Dialog, Tabs, Accordion, Skeleton, Toast, Text/Typography, Icon (lucide-react-native).
- **Theme it as TrustedHousesitters**, using shadcn's CSS-variable-style semantic tokens (`background`, `foreground`, `primary`, `muted`, `accent`, `destructive`, `border`, `ring`, `radius`). Map THS brand values onto those tokens: primary purple CTA, deep green headings, warm neutrals, rounded cards. If a `ths-design` skill is available, use it for the values. If not, pull them from the live page.
- Add the THS-specific composites the Listing needs, built only from DS primitives: `PhotoGallery`, `OwnerCard`, `DateRangeChip`, `PetCard`, `AmenityList`, `ReviewCard`, `ActionListRow`, `StickyApplyBar`, `ReadMore`, `AnimalCountBadge`, `MapPreview`, `StatusBanner`.
- Responsive primitives: a `useBreakpoint()` hook plus NativeWind breakpoints (`md:`, `lg:`). Components adapt. No separate web components.
- Write `openspec/specs/design-system/spec.md` with each component's purpose, props, variants, a11y requirements, and do/don't rules, so an agent can compose screens without guessing.
- Accessibility is a requirement, not polish: roles, labels, focus order, 44pt touch targets, and contrast that passes WCAG AA.

## Phase 2: Mock API (`packages/mock-api` + `packages/api-contract`)
Write zod schemas first, then a Hono server backed by `seed.json`. Use **fictional** seed data (invented names, photos from Unsplash/placeholder URLs, an invented city listing). Mirror the shape of the real listing. Don't copy real members' names or reviews.

Endpoints (adjust if the spec says otherwise, but keep them in `mock-api/spec.md`):

| Method | Path | Purpose |
|---|---|---|
| GET | `/listings/:id` | Title, location (city/region/country + approx coords), intro, photos[], home type, setting, transport, owner summary, animals counts |
| GET | `/listings/:id/assignments` | Open sit dates (start/end, isReviewing, arrival/departure "to be agreed") |
| GET | `/listings/:id/pets` | Pets: name, species, breed, age, photo/illustration, care notes |
| GET | `/listings/:id/amenities` | Categorised amenities (top 5 + full list) |
| GET | `/listings/:id/responsibilities` | Per-pet notes, home and plant duties, time alone, medication |
| GET | `/listings/:id/sit-essentials` | Arrival/departure, guest policy, sitter-pet policy |
| GET | `/listings/:id/reviews?page=` | Paginated sitter reviews (name, avatar, text, stay dates) |
| GET | `/me` | Viewer membership state (see scenarios) |
| PUT / DELETE | `/me/favourites/:listingId` | Favourite toggle |
| POST | `/listings/:id/applications` | Apply to an assignment |
| POST | `/listings/:id/reports` | Report listing |

- **Scenario switching:** a `?scenario=` query or `x-scenario` header picks the viewer state: `anonymous`, `partial-member`, `full-sitter`, `all-assignments-reviewing`, `no-reviews`, `no-amenities`, `loading-slow`, `error`. Add a dev-only scenario picker in the app.
- Add realistic latency (200–600ms) so loading states get exercised.
- Make the API base URL configurable so iOS simulator, Android emulator (`10.0.2.2`) and web all reach the server.

## Phase 3: The Listing spec (`openspec/specs/listing-view/spec.md`)
Write this **before** building the screen. Use OpenSpec format: `### Requirement:` blocks with `#### Scenario:` WHEN/THEN cases. Base it on what the end user sees:

**Reference (look and structure only, don't copy the implementation):**
- Live page: https://www.trustedhousesitters.com/house-and-pet-sitting-assignments/canada/quebec/montreal/l/2159290/
- Current app scene (for structure and states only): `/Users/benc/Code/trustedhousesitters-next-ds-contract/frontend/apps/app/app/scenes/Sitter/Listing/Listing.js` and its subfolders (`Pet`, `ListingFeedbacks`, `ListingLocationMap`, `PartialJoinNowCTA`)

**Content hierarchy the member sees:**
1. Photo gallery (hero) with photo count. Opens a full-screen gallery.
2. Title, location line, animal count badges (e.g. 1 × cat).
3. Favourite and share actions.
4. "Reviewing applications" banner when every open assignment is being reviewed.
5. Introduction (with read more).
6. Home & location: description (read more), home type, setting, transport.
7. Amenities: top 5 plus "Show all N amenities".
8. Meet the pets: horizontal pet cards, each opening a pet detail view.
9. Responsibilities: per pet (time alone, medication), plus pet, plant and home duties.
10. Sit essentials: arrival/departure per date, guest and pet policy.
11. Sitter reviews (N): paginated review cards.
12. Location: approximate map with a privacy note (never an exact address).
13. Owner card: avatar, name, "Pet parent", sitter-needed dates.
14. Primary CTA, which depends on membership state: "Join now to apply" / select dates and apply / no CTA for own listing.
15. Refer a friend ("Know someone who'd love this sit?"), and Report listing.

**Layout must adapt, from one set of components:**
- **Mobile (native and narrow web):** app pattern. Full-bleed hero with a collapsing header (title fades into the nav bar, owner avatar overlaps the hero). Sections 6, 7, 9, 10 and 11 appear as `ActionListRow`s that push to detail routes. Pets as a horizontal scroller. **Sticky bottom apply bar** with dates and CTA.
- **Desktop web (≥ lg):** two columns. Left: gallery grid (1 large + 3 small + "N photos"), then all sections inline. Right: **sticky owner/dates/CTA card**, then refer-a-friend and report. Top-right favourite button.
- Detail routes (`/listing/[id]/home`, `/amenities`, `/responsibilities`, `/sit-essentials`, `/reviews`, `/pets/[petId]`, `/gallery`) exist on both platforms. On desktop web, sections render inline and the routes still work as deep links.

**States to specify as scenarios:** loading skeleton, error and retry, anonymous, partial member, full sitter, all assignments reviewing, no reviews, no amenities, no pets, favourite toggle (optimistic, with rollback on failure), share (native share sheet / Web Share API with a copy-link fallback), and report listing confirmation.

**Non-functional:** web pages have a proper `<title>` and meta description, and a shareable URL `/listing/[id]`. Every interactive element is accessible. No layout shift as images load.

Commit the spec. **Stop and let me review it** before generating the implementation.

## Phase 4: Generate the experience from the spec
1. Create an OpenSpec change: `openspec/changes/add-listing-view/` with `proposal.md`, `tasks.md`, and spec deltas. Validate with `openspec validate --strict`.
2. Implement `tasks.md` task by task, using **only** `packages/ui` components and `packages/api-contract` hooks. If the DS is missing something, add it to the DS (and its spec) first. Don't hand-roll one-off UI in the screen.
3. Each spec scenario maps to at least one test: component tests (Jest + React Native Testing Library), plus one Playwright smoke test on web covering desktop and mobile widths.
4. Archive the change when done (`openspec archive add-listing-view`), so `specs/` reflects the shipped behaviour.

## Phase 5: Prove the loop
Show that the spec drives the code. Make a small spec change through a new OpenSpec change, e.g. *"Show a 'New listing' badge when the listing has no reviews"*. Have the agent implement it from the spec delta alone. Confirm it shows up on iOS and web with no platform-specific code.

## Definition of done
- `pnpm dev` starts the mock API and Expo. The Listing renders on the iOS simulator, Android emulator, and web from the same route file.
- Side-by-side screenshots: iOS, mobile web, desktop web, for at least `anonymous` and `full-sitter`.
- Every Listing spec scenario is covered by a test, and the tests pass.
- Zero platform-forked screen files (`.web.tsx` / `.native.tsx` only allowed inside `packages/ui` primitives, with a comment explaining why).
- A `README.md` explaining the workflow for the next journey: write the spec → propose a change → agent implements → archive.

## Working rules
- Ask before swapping any stack choice above.
- Keep the member's experience front and centre. When the reference page and good practice disagree on usability or accessibility, flag it and suggest the better option. Don't silently copy a weak pattern.
- Commit at the end of each phase with a clear message.
