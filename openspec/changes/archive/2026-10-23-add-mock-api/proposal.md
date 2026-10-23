# Proposal

## Why

The Listing journey needs realistic data in every state a member can be in (anonymous, partial member, full sitter, own listing) and every edge a screen must handle (empty sections, slow network, errors, a failed favourite). Without a contract and a mock server, those states can't be built, tested or demoed, and the app would end up coupled to guesses about the real THS API.

## What Changes

- A typed API contract shared by the app and the mock server: every request and response is a schema, so drift fails loudly on both sides.
- A mock API server with fictional seed data for the endpoints the Listing journey needs: listing, open dates, pets, amenities, responsibilities, sit essentials, reviews, viewer, favourites, applications and reports.
- Scenario switching per request, so any client (app, test, browser) can ask for a viewer state and data edge cases without restarting anything.
- Realistic latency by default, so loading states are always exercised.
- A typed client and data hooks for the app, including an optimistic favourite toggle that rolls back on failure.
- App wiring: the API base URL resolves correctly on the iOS simulator, Android emulator and web, plus a development-only scenario picker and an API check page.

Out of scope:

- Authentication. The viewer is defined entirely by the scenario.
- Persistence across server restarts. Writes (favourites, applications, reports) live in memory.
- Any Listing screen. That belongs to the `listing-view` change.
- Search, messaging, membership purchase.

## Capabilities

### New Capabilities

- `mock-api`: The data contract and mock behaviour for listing-related endpoints: resource shapes, error shapes, scenario selection, latency and in-memory writes.

### Modified Capabilities

None.

## Impact

- New `packages/api-contract`: zod schemas, inferred types, fetch client, TanStack Query hooks.
- New `packages/mock-api`: Hono server, `seed.json`, scenario engine, tests.
- `apps/expo`: query provider, API URL resolution, `/dev/scenarios` picker, `/dev/api` check page.
- Root `pnpm dev` starts the mock API alongside Expo.
- New dependencies: `zod`, `hono`, `@hono/node-server`, `@tanstack/react-query`, `tsx`, `vitest`. All are JS only, so no native rebuild.
