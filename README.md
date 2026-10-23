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
packages/api-contract/   (Phase 2) zod schemas + typed client
packages/mock-api/       (Phase 2) Hono server + seed.json
```

## Run

```bash
pnpm install
pnpm dev                      # Expo dev server on :8090
```

- Web: http://localhost:8090 (design system showcase: http://localhost:8090/design-system)
- iOS: `pnpm --filter @ths/expo exec expo run:ios --port 8090` (dev client; SDK 56)

Port 8090 is used so this doesn't collide with the main THS app's Metro on 8081.
If CocoaPods fails with a Unicode error, run with `LANG=en_US.UTF-8`.
After changing `packages/tokens/tailwind-preset.js`, restart Metro with `--clear`.

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
- [ ] 2. Mock API + contract
- [ ] 3. Listing spec (review gate)
- [ ] 4. Generate the Listing from the spec
- [ ] 5. Prove the loop with a spec-only change
