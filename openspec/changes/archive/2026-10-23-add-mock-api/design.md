# Design

## Context

The app is Expo Router (native + web) with TanStack Query not yet installed. Packages are TypeScript-source workspaces (`main: src/index.ts`) consumed directly by Metro, with no build step.

## Goals / Non-Goals

**Goals:**
- One schema definition per resource, used for server validation, client parsing and TypeScript types.
- Scenario state that is visible and switchable from the app in development.

**Non-Goals:**
- Mirroring the real THS API's URLs or field names. The contract describes what the journey needs. A future adapter can map the real API onto it.

## Decisions

**zod 4 schemas in `@ths/api-contract`, types inferred.** The server calls `Schema.parse` on every response before sending, and the client parses every response. A shared `endpoints` map ties method, path, params and schemas together, so the client and server can't disagree on a URL.
Alternative considered: OpenAPI first, with generated clients. Heavier tooling for a POC, and zod gives the same guarantees in-process.

**Hono on Node (`@hono/node-server`), run with `tsx watch`.** Hono's `app.request()` lets tests call routes without a port. Port `4010`, configurable via `PORT`.

**Seed as one `seed.json`, scenarios as pure transforms.** `applyScenarios(seed, scenarios)` returns a new dataset (for example, `no-pets` empties pets and zeroes animal counts). Read handlers never branch on scenario names; only the transform layer knows them. Keeping counts consistent lives in one place.

**Viewer from scenario.** Each viewer scenario maps to a fixed viewer record. In-memory write state is keyed by viewer scenario name, which gives isolation for free. `POST /__reset` clears it.

**Latency middleware.** Uniform random 200–600 ms, or 3–5 s for `loading-slow`. Disabled when `MOCK_LATENCY=off` (tests).

**Client: `createApiClient({ baseUrl, scenario })` plus TanStack Query hooks.** Query keys include the scenario, so switching scenario never shows another viewer's cached data. `ApiProvider` holds the scenario in React state. On web it's initialised from the `?scenario=` URL parameter so links can deep-link a state.

**Favourite toggle is optimistic.** `onMutate` updates the cached `/me`, `onError` restores the snapshot, `onSettled` refetches. The `favourite-error` scenario exercises the rollback.

**Base URL resolution:** `EXPO_PUBLIC_API_URL` if set. Otherwise, on web: `window.location.hostname:4010`; on Android: the Metro host from `expo-constants` (`hostUri`), falling back to `10.0.2.2`; on iOS: the Metro host, falling back to `localhost`. Using the Metro host also makes physical devices on the same network work.

**Seed photos:** Unsplash image URLs for pets and homes, served by Unsplash's CDN. Fictional names and text. Avatars from pravatar.

## Risks / Trade-offs

- [Response validation adds latency to every request] → Negligible against the artificial latency.
- [External image CDNs could change or rate-limit] → Acceptable for a POC. Photos are data, so swapping hosts is a seed change only.
- [Scenario state lives in the client, so a reload on native resets it to anonymous] → Acceptable in development. The web URL parameter covers shareable states.
