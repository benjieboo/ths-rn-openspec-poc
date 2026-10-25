# THS Listing POC: OpenSpec + React Native first

One React Native codebase renders the native app (iOS/Android) and the web pages from the
**same Expo Router route files**, using one shadcn-based design system. User journeys live as
OpenSpec specs; agents implement experiences from those specs.

Brief: [docs/listing-poc-prompt.md](docs/listing-poc-prompt.md)

## Layout

```
openspec/            specs (source of truth) + change proposals. Project rules: openspec/config.yaml
apps/expo/           Expo Router app. Routes only: app/ → native screens + web pages
packages/ui/         design system (React Native Reusables / shadcn, owned in-repo)
packages/tokens/     theme.css (semantic CSS variables) + Tailwind preset + TS theme
packages/api-contract/   zod schemas, endpoint map, typed client; React hooks at @ths/api-contract/react
packages/mock-api/       Hono server + seed.json + scenarios (port 4010)
```

## Run

```bash
pnpm install
pnpm dev                      # mock API on :4010 + Expo on :8090
pnpm test                     # contract, mock API and app tests (Jest starts its own mock API on :4099)
pnpm --filter @ths/expo e2e   # Playwright at 390 and 1280 px (needs `pnpm dev` running)
```

- Web: http://localhost:8090 · listing: http://localhost:8090/listing/2001 · design system: /design-system
- iOS: `pnpm --filter @ths/expo exec expo run:ios --port 8090` (dev client; SDK 56)

Port 8090 is used so this doesn't collide with the main THS app's Metro on 8081.
If CocoaPods fails with a Unicode error, run with `LANG=en_US.UTF-8`.
After changing `packages/tokens/tailwind-preset.js`, restart Metro with `--clear`.

## Mock API scenarios

Every request can pick a viewer and data edge cases, via the `x-scenario` header or `?scenario=`:

- Viewer (one of): `anonymous` (default), `partial-member`, `full-sitter`, `own-listing`
- Data (any): `all-assignments-reviewing`, `no-reviews`, `no-amenities`, `no-pets`, `loading-slow`, `error`, `favourite-error`

In the app: **Home → Scenarios** sets it for all requests; **Home → API check** shows every endpoint's result.
On web, the scenario is mirrored in the URL, e.g. `/dev/api?scenario=full-sitter,no-reviews`.
`curl -X POST localhost:4010/__reset` clears favourites and applications. Contract: [openspec/specs/mock-api/spec.md](openspec/specs/mock-api/spec.md).

## Where things live

- `apps/expo/app/listing/[id]/…`: thin route files (one per page, native and web)
- `apps/expo/features/listing/`: composition only: view model (`logic.ts`, `use-listing-page.ts`), copy, sections, layouts
- Tests are named after spec scenarios: `apps/expo/test/__tests__/listing.test.tsx`, `features/listing/logic.test.ts`, `e2e/`

## Adding design system components

Reusables CLI, from `packages/ui` (its `components.json` points into this package):

```bash
cd packages/ui && npx @react-native-reusables/cli@latest add card badge avatar
```

Then export the component from `packages/ui/src/index.ts`.

## Spec workflow (OpenSpec, via Claude Code)

1. `/opsx:explore`: think through a journey
2. `/opsx:propose "<idea>"`: creates `openspec/changes/<name>/` (proposal, design, tasks, spec deltas)
3. `/opsx:apply`: the agent implements tasks from the change
4. `/opsx:archive`: merges spec deltas into `openspec/specs/`, so specs reflect what shipped

CLI: `npx openspec list`, `npx openspec validate --strict`.

## Phases

- [x] 0. Scaffold: monorepo, Expo Router, NativeWind, Reusables, OpenSpec, hello route on iOS + web
- [x] 1. Design system themed as THS + Listing composites + DS spec (`/design-system` showcase)
- [x] 2. Mock API + contract (scenarios, `/dev/scenarios`, `/dev/api`)
- [x] 3. Listing spec (review gate)
- [x] 4. Generate the Listing from the spec (screenshots in [docs/screenshots](docs/screenshots))
- [ ] 5. Prove the loop with a spec-only change
