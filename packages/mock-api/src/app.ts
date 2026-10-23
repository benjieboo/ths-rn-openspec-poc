import {
  ApiErrorBody,
  endpoints,
  parseScenarios,
  REVIEWS_PAGE_SIZE,
  SCENARIO_HEADER,
  ScenarioParseError,
  type ApiErrorCode,
  type EndpointName,
  type ResponseOf,
  type ScenarioSelection,
} from '@ths/api-contract';
import { Hono, type Context } from 'hono';
import { cors } from 'hono/cors';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import type { z } from 'zod';

import { amenityTotal, seed, toListing, type Dataset, type SeedListing } from './dataset';
import { applyScenarios } from './scenarios';
import { addReport, nextId, resetState, viewerState } from './state';

type Env = { Variables: { scenario: ScenarioSelection; data: Dataset } };
type Ctx = Context<Env>;

export type AppOptions = {
  /** Random delay per response. Off for tests. */
  latency?: boolean;
  /** Override the seed (tests). */
  dataset?: Dataset;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const between = (min: number, max: number) => min + Math.random() * (max - min);

export function errorBody(code: ApiErrorCode, message: string): ApiErrorBody {
  return { error: { code, message } };
}

function fail(c: Ctx, status: ContentfulStatusCode, code: ApiErrorCode, message: string) {
  return c.json(errorBody(code, message), status);
}

/** Validates against the contract before sending. A mismatch is a server bug, so it's a 500. */
export function respond<E extends EndpointName>(c: Ctx, name: E, data: ResponseOf<E>) {
  const endpoint = endpoints[name];
  const parsed = (endpoint.response as z.ZodType).safeParse(data);
  if (!parsed.success) {
    console.error(`[mock-api] ${name} response failed contract`, parsed.error.issues);
    return fail(c, 500, 'server_error', `${name} response failed contract`);
  }
  return c.json(parsed.data as object, endpoint.status as ContentfulStatusCode);
}

export function createApp({ latency = true, dataset = seed }: AppOptions = {}) {
  const app = new Hono<Env>();

  app.use('*', cors({ origin: (origin) => origin ?? '*', allowHeaders: ['content-type', SCENARIO_HEADER] }));

  app.post('/__reset', (c) => {
    resetState();
    return c.body(null, 204);
  });

  app.use('*', async (c, next) => {
    if (c.req.method === 'OPTIONS') return next();
    try {
      const scenario = parseScenarios(c.req.header(SCENARIO_HEADER) ?? c.req.query('scenario'));
      c.set('scenario', scenario);
      c.set('data', applyScenarios(dataset, scenario));
    } catch (e) {
      if (e instanceof ScenarioParseError) return fail(c, 400, 'invalid_scenario', e.message);
      throw e;
    }
    if (latency) {
      const slow = c.get('scenario').data.includes('loading-slow');
      await sleep(slow ? between(3000, 5000) : between(200, 600));
    }
    await next();
  });

  // Listing reads: 404 for unknown ids, 500 under the `error` scenario.
  const withListing = (handler: (c: Ctx, entry: SeedListing) => Response | Promise<Response>) => (c: Ctx) => {
    if (c.get('scenario').data.includes('error')) return fail(c, 500, 'server_error', 'Something went wrong (error scenario)');
    const id = c.req.param('listingId');
    const entry = c.get('data').listings.find((l) => l.listing.id === id);
    if (!entry) return fail(c, 404, 'not_found', `No listing with id ${id}`);
    return handler(c, entry);
  };

  app.get(endpoints.getListing.path, withListing((c, l) => respond(c, 'getListing', toListing(l))));
  app.get(endpoints.getAssignments.path, withListing((c, l) => respond(c, 'getAssignments', { items: l.assignments })));
  app.get(endpoints.getPets.path, withListing((c, l) => respond(c, 'getPets', { items: l.pets })));
  app.get(
    endpoints.getAmenities.path,
    withListing((c, l) => respond(c, 'getAmenities', { ...l.amenities, total: amenityTotal(l.amenities) }))
  );
  app.get(endpoints.getResponsibilities.path, withListing((c, l) => respond(c, 'getResponsibilities', l.responsibilities)));
  app.get(endpoints.getSitEssentials.path, withListing((c, l) => respond(c, 'getSitEssentials', l.sitEssentials)));
  app.get(
    endpoints.getReviews.path,
    withListing((c, l) => {
      const page = Math.max(1, Number.parseInt(c.req.query('page') ?? '1', 10) || 1);
      const start = (page - 1) * REVIEWS_PAGE_SIZE;
      return respond(c, 'getReviews', {
        items: l.reviews.slice(start, start + REVIEWS_PAGE_SIZE),
        page,
        pageSize: REVIEWS_PAGE_SIZE,
        total: l.reviews.length,
        totalPages: Math.ceil(l.reviews.length / REVIEWS_PAGE_SIZE),
      });
    })
  );

  const viewerFor = (c: Ctx) => {
    const name = c.get('scenario').viewer;
    return { name, profile: c.get('data').viewers[name], state: viewerState(name) };
  };

  app.get(endpoints.getMe.path, (c) => {
    const { profile, state } = viewerFor(c);
    return respond(c, 'getMe', {
      ...profile,
      favouriteListingIds: [...state.favourites],
      applications: state.applications,
    });
  });

  const setFavourite = (isFavourite: boolean) => (c: Ctx) => {
    const { profile, state } = viewerFor(c);
    if (profile.membership === 'anonymous') return fail(c, 401, 'unauthenticated', 'Sign in to save favourites');
    if (c.get('scenario').data.includes('favourite-error')) {
      return fail(c, 500, 'server_error', 'Could not update favourites (favourite-error scenario)');
    }
    const listingId = c.req.param('listingId')!;
    if (!c.get('data').listings.some((l) => l.listing.id === listingId)) {
      return fail(c, 404, 'not_found', `No listing with id ${listingId}`);
    }
    if (isFavourite) state.favourites.add(listingId);
    else state.favourites.delete(listingId);
    return respond(c, isFavourite ? 'addFavourite' : 'removeFavourite', { listingId, isFavourite });
  };
  app.put(endpoints.addFavourite.path, setFavourite(true));
  app.delete(endpoints.removeFavourite.path, setFavourite(false));

  app.post(endpoints.apply.path, async (c) => {
    const body = endpoints.apply.body.safeParse(await c.req.json().catch(() => null));
    if (!body.success) return fail(c, 400, 'invalid_request', body.error.message);
    const { profile, state } = viewerFor(c);
    if (profile.membership === 'anonymous') return fail(c, 401, 'unauthenticated', 'Sign in to apply');
    if (profile.membership !== 'full') return fail(c, 403, 'membership_required', 'A full membership is needed to apply');

    const listingId = c.req.param('listingId');
    const entry = c.get('data').listings.find((l) => l.listing.id === listingId);
    if (!entry) return fail(c, 404, 'not_found', `No listing with id ${listingId}`);
    if (entry.listing.owner.id === profile.memberId) return fail(c, 403, 'own_listing', "You can't apply to your own listing");

    const assignment = entry.assignments.find((a) => a.id === body.data.assignmentId);
    if (!assignment) return fail(c, 404, 'not_found', `No dates with id ${body.data.assignmentId}`);
    if (assignment.isReviewing) return fail(c, 409, 'not_available', 'The pet parent is reviewing applications for these dates');
    if (state.applications.some((a) => a.assignmentId === assignment.id)) {
      return fail(c, 409, 'already_applied', "You've already applied for these dates");
    }

    const application = { id: nextId('app'), listingId, assignmentId: assignment.id };
    state.applications.push(application);
    return respond(c, 'apply', { ...application, status: 'pending' });
  });

  app.post(endpoints.report.path, async (c) => {
    const body = endpoints.report.body.safeParse(await c.req.json().catch(() => null));
    if (!body.success) return fail(c, 400, 'invalid_request', body.error.message);
    const listingId = c.req.param('listingId');
    if (!c.get('data').listings.some((l) => l.listing.id === listingId)) {
      return fail(c, 404, 'not_found', `No listing with id ${listingId}`);
    }
    const id = nextId('rep');
    addReport({ id, listingId, reason: body.data.reason });
    return respond(c, 'report', { id });
  });

  app.notFound((c) => fail(c, 404, 'not_found', `No route for ${c.req.method} ${c.req.path}`));
  app.onError((err, c) => {
    console.error('[mock-api]', err);
    return fail(c, 500, 'server_error', 'Unexpected server error');
  });

  return app;
}
