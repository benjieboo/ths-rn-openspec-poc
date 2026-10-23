import {
  Amenities,
  AssignmentList,
  Listing,
  PetList,
  Responsibilities,
  ReviewPage,
  SitEssentials,
  Viewer,
} from '@ths/api-contract';
import { Hono } from 'hono';
import { beforeEach, describe, expect, it } from 'vitest';

import { createApp, respond } from './app';
import { Seed } from './dataset';
import seedJson from './seed.json' with { type: 'json' };
import { resetState } from './state';

// Tests mirror openspec/specs/mock-api/spec.md, grouped by requirement.

const app = createApp({ latency: false });

function call(path: string, { scenario, method = 'GET', body }: { scenario?: string; method?: string; body?: unknown } = {}) {
  return app.request(path, {
    method,
    headers: {
      ...(scenario && { 'x-scenario': scenario }),
      ...(body !== undefined && { 'content-type': 'application/json' }),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

async function json(path: string, opts?: Parameters<typeof call>[1]) {
  const res = await call(path, opts);
  return { status: res.status, body: (await res.json()) as any };
}

beforeEach(() => resetState());

describe('Contract-first responses', () => {
  it('seed parses through the contract', () => {
    expect(() => Seed.parse(seedJson)).not.toThrow();
  });

  it('every read endpoint returns a contract-valid body', async () => {
    const checks = [
      ['/listings/2001', Listing],
      ['/listings/2001/assignments', AssignmentList],
      ['/listings/2001/pets', PetList],
      ['/listings/2001/amenities', Amenities],
      ['/listings/2001/responsibilities', Responsibilities],
      ['/listings/2001/sit-essentials', SitEssentials],
      ['/listings/2001/reviews', ReviewPage],
      ['/me', Viewer],
    ] as const;
    for (const [path, schema] of checks) {
      const { status, body } = await json(path);
      expect(status, path).toBe(200);
      expect(() => schema.parse(body), path).not.toThrow();
    }
  });

  it('a response that fails its schema becomes a 500', async () => {
    const broken = new Hono<any>();
    broken.get('/x', (c) => respond(c, 'getListing', { title: 'missing everything' } as any));
    const res = await broken.request('/x');
    expect(res.status).toBe(500);
    expect(await res.json()).toMatchObject({ error: { code: 'server_error' } });
  });
});

describe('Error shape', () => {
  it('unknown listing is 404 not_found', async () => {
    const { status, body } = await json('/listings/9999');
    expect(status).toBe(404);
    expect(body).toEqual({ error: { code: 'not_found', message: expect.any(String) } });
  });

  it('invalid body is 400 invalid_request', async () => {
    const { status, body } = await json('/listings/2001/reports', { method: 'POST', body: { reason: 'boring' } });
    expect(status).toBe(400);
    expect(body.error.code).toBe('invalid_request');
  });
});

describe('Listing resources', () => {
  it('summary has ordered photos and derived counts', async () => {
    const { body } = await json('/listings/2001');
    expect(body.photos[0].id).toBe('2001-ph1');
    expect(body.animals).toEqual([{ species: 'cat', count: 1 }]);
    expect(body.reviewCount).toBe(12);
    expect(body.amenityCount).toBe(16);
  });

  it('location is approximate only', async () => {
    const { body } = await json('/listings/2001');
    expect(Object.keys(body.location).sort()).toEqual(
      ['approximateCoordinates', 'city', 'country', 'countryCode', 'neighbourhood', 'region'].sort()
    );
  });

  it('paginates reviews', async () => {
    const { body } = await json('/listings/2001/reviews?page=2');
    expect(body).toMatchObject({ page: 2, pageSize: 5, total: 12, totalPages: 3 });
    expect(body.items).toHaveLength(5);
    expect(body.items[0].id).toBe('rv6');
  });

  it('page out of range is empty, not an error', async () => {
    const { status, body } = await json('/listings/2001/reviews?page=9');
    expect(status).toBe(200);
    expect(body).toMatchObject({ items: [], total: 12, totalPages: 3 });
  });
});

describe('Viewer', () => {
  it('defaults to anonymous', async () => {
    const { body } = await json('/me');
    expect(body).toMatchObject({ memberId: null, membership: 'anonymous', canApply: false, favouriteListingIds: [] });
  });

  it('own-listing viewer owns listing 2001', async () => {
    const [me, listing] = await Promise.all([json('/me', { scenario: 'own-listing' }), json('/listings/2001')]);
    expect(me.body.memberId).toBe(listing.body.owner.id);
  });
});

describe('Favourites', () => {
  it('add then read, idempotent, remove', async () => {
    const scenario = 'full-sitter';
    expect((await json('/me/favourites/2001', { method: 'PUT', scenario })).body).toEqual({ listingId: '2001', isFavourite: true });
    await json('/me/favourites/2001', { method: 'PUT', scenario });
    expect((await json('/me', { scenario })).body.favouriteListingIds).toEqual(['2001']);
    await json('/me/favourites/2001', { method: 'DELETE', scenario });
    expect((await json('/me', { scenario })).body.favouriteListingIds).toEqual([]);
  });

  it('anonymous is 401', async () => {
    const { status, body } = await json('/me/favourites/2001', { method: 'PUT' });
    expect(status).toBe(401);
    expect(body.error.code).toBe('unauthenticated');
  });
});

describe('Applications', () => {
  const apply = (scenario: string | undefined, assignmentId = 'as_2001_1', listing = '2001') =>
    json(`/listings/${listing}/applications`, { method: 'POST', scenario, body: { assignmentId } });

  it('full member applies and sees it on /me', async () => {
    const { status, body } = await apply('full-sitter');
    expect(status).toBe(201);
    expect(body).toMatchObject({ listingId: '2001', assignmentId: 'as_2001_1', status: 'pending' });
    expect((await json('/me', { scenario: 'full-sitter' })).body.applications).toHaveLength(1);
  });

  it.each([
    [undefined, 401, 'unauthenticated'],
    ['partial-member', 403, 'membership_required'],
    ['own-listing', 403, 'own_listing'],
  ])('viewer %s gets %i %s', async (scenario, status, code) => {
    const res = await apply(scenario);
    expect(res.status).toBe(status);
    expect(res.body.error.code).toBe(code);
  });

  it('dates under review are 409 not_available', async () => {
    const res = await apply('full-sitter', 'as_2001_3');
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('not_available');
  });

  it('applying twice is 409 already_applied', async () => {
    await apply('full-sitter');
    const res = await apply('full-sitter');
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('already_applied');
  });
});

describe('Reports', () => {
  it('accepts a report from anonymous viewers', async () => {
    const { status, body } = await json('/listings/2001/reports', { method: 'POST', body: { reason: 'inaccurate' } });
    expect(status).toBe(202);
    expect(body.id).toMatch(/^rep_/);
  });
});

describe('Scenario selection', () => {
  it('combines viewer and data scenarios', async () => {
    const [me, listing, reviews] = await Promise.all([
      json('/me', { scenario: 'full-sitter,no-reviews' }),
      json('/listings/2001', { scenario: 'full-sitter,no-reviews' }),
      json('/listings/2001/reviews', { scenario: 'full-sitter,no-reviews' }),
    ]);
    expect(me.body.membership).toBe('full');
    expect(listing.body.reviewCount).toBe(0);
    expect(reviews.body).toMatchObject({ items: [], total: 0, totalPages: 0 });
  });

  it('accepts the query parameter too', async () => {
    expect((await json('/me?scenario=partial-member')).body.membership).toBe('partial');
  });

  it('all-assignments-reviewing marks every date', async () => {
    const { body } = await json('/listings/2001/assignments', { scenario: 'all-assignments-reviewing' });
    expect(body.items.every((a: { isReviewing: boolean }) => a.isReviewing)).toBe(true);
  });

  it('no-amenities and no-pets empty the resources and counts agree', async () => {
    const scenario = 'no-amenities,no-pets';
    const [listing, amenities, pets, resp] = await Promise.all([
      json('/listings/2002', { scenario }),
      json('/listings/2002/amenities', { scenario }),
      json('/listings/2002/pets', { scenario }),
      json('/listings/2002/responsibilities', { scenario }),
    ]);
    expect(listing.body).toMatchObject({ amenityCount: 0, animals: [] });
    expect(amenities.body).toMatchObject({ total: 0, categories: [], highlights: [] });
    expect(pets.body.items).toEqual([]);
    expect(resp.body.pets).toEqual([]);
  });

  it('error makes listing reads 500', async () => {
    const { status, body } = await json('/listings/2001', { scenario: 'error' });
    expect(status).toBe(500);
    expect(body.error.code).toBe('server_error');
  });

  it('favourite-error makes favourite writes 500', async () => {
    const { status } = await json('/me/favourites/2001', { method: 'PUT', scenario: 'full-sitter,favourite-error' });
    expect(status).toBe(500);
  });

  it.each(['anonymous,full-sitter', 'vip'])('rejects %s with 400 invalid_scenario', async (scenario) => {
    const { status, body } = await json('/me', { scenario });
    expect(status).toBe(400);
    expect(body.error.code).toBe('invalid_scenario');
  });
});

describe('Latency', () => {
  it('adds 200–600 ms by default', async () => {
    const slowApp = createApp({ latency: true });
    const start = performance.now();
    await slowApp.request('/me');
    const elapsed = performance.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(195);
    expect(elapsed).toBeLessThan(800);
  });
});

describe('Isolated in-memory writes', () => {
  it("viewers don't share favourites", async () => {
    await json('/me/favourites/2001', { method: 'PUT', scenario: 'full-sitter' });
    expect((await json('/me', { scenario: 'partial-member' })).body.favouriteListingIds).toEqual([]);
  });

  it('reset restores seed state', async () => {
    await json('/me/favourites/2001', { method: 'PUT', scenario: 'full-sitter' });
    expect((await call('/__reset', { method: 'POST' })).status).toBe(204);
    expect((await json('/me', { scenario: 'full-sitter' })).body.favouriteListingIds).toEqual([]);
  });
});
