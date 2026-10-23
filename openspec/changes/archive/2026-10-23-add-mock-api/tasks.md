# Tasks

## 1. Contract

- [x] 1.1 zod schemas for every resource, request body and the error shape in `packages/api-contract`. Verify: `tsc` passes
- [x] 1.2 Endpoint map and scenario names shared by client and server. Verify: server routes and client methods both import it
- [x] 1.3 `createApiClient` that parses every response and throws a typed `ApiError`. Verify: unit test with a malformed response

## 2. Mock server

- [x] 2.1 `seed.json` with two fictional listings, matching the contract. Verify: test parses the full seed through the schemas
- [x] 2.2 Scenario parsing and data transforms (viewer, reviewing, empty sections, error, favourite-error). Verify: a test per scenario in the spec
- [x] 2.3 Read endpoints, including reviews pagination and 404. Verify: tests
- [x] 2.4 Write endpoints (favourites, applications, reports) with per-viewer in-memory state and `POST /__reset`. Verify: tests for each status code in the spec
- [x] 2.5 Latency middleware, disabled with `MOCK_LATENCY=off`. Verify: test measures default latency range
- [x] 2.6 Every response validated against its schema before sending. Verify: test that a corrupted response returns 500

## 3. App wiring

- [x] 3.1 TanStack Query hooks for each endpoint, with scenario in query keys; optimistic favourite toggle with rollback. Verify: `tsc` passes, rollback seen with `favourite-error`
- [x] 3.2 `ApiProvider` with base URL resolution and scenario state (web reads `?scenario=`). Verify: app reaches the API on iOS simulator and web
- [x] 3.3 `/dev/scenarios` picker and `/dev/api` check page. Verify: switching scenario changes `/me` on the check page
- [x] 3.4 Root `pnpm dev` starts the mock API and Expo. Verify: one command serves both

## Workflow follow-up

- Archive this change so `openspec/specs/mock-api/spec.md` holds the contract
