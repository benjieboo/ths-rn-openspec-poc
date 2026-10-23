import type { z } from 'zod';

import * as S from './schemas';

type Endpoint = {
  method: 'GET' | 'PUT' | 'DELETE' | 'POST';
  /** Hono-style path; `:name` segments are filled from params. */
  path: string;
  status: number;
  response: z.ZodType;
  body?: z.ZodType;
};

/** The single source of truth for routes: the server registers these, the client calls these. */
export const endpoints = {
  getListing: { method: 'GET', path: '/listings/:listingId', status: 200, response: S.Listing },
  getAssignments: { method: 'GET', path: '/listings/:listingId/assignments', status: 200, response: S.AssignmentList },
  getPets: { method: 'GET', path: '/listings/:listingId/pets', status: 200, response: S.PetList },
  getAmenities: { method: 'GET', path: '/listings/:listingId/amenities', status: 200, response: S.Amenities },
  getResponsibilities: {
    method: 'GET',
    path: '/listings/:listingId/responsibilities',
    status: 200,
    response: S.Responsibilities,
  },
  getSitEssentials: { method: 'GET', path: '/listings/:listingId/sit-essentials', status: 200, response: S.SitEssentials },
  getReviews: { method: 'GET', path: '/listings/:listingId/reviews', status: 200, response: S.ReviewPage },
  getMe: { method: 'GET', path: '/me', status: 200, response: S.Viewer },
  addFavourite: { method: 'PUT', path: '/me/favourites/:listingId', status: 200, response: S.FavouriteState },
  removeFavourite: { method: 'DELETE', path: '/me/favourites/:listingId', status: 200, response: S.FavouriteState },
  apply: {
    method: 'POST',
    path: '/listings/:listingId/applications',
    status: 201,
    response: S.Application,
    body: S.ApplicationRequest,
  },
  report: {
    method: 'POST',
    path: '/listings/:listingId/reports',
    status: 202,
    response: S.ReportReceipt,
    body: S.ReportRequest,
  },
} as const satisfies Record<string, Endpoint>;

export type EndpointName = keyof typeof endpoints;
export type ResponseOf<E extends EndpointName> = z.infer<(typeof endpoints)[E]['response']>;

export const REVIEWS_PAGE_SIZE = 5;

export function buildPath(template: string, params: Record<string, string>) {
  return template.replace(/:([A-Za-z]+)/g, (_, key: string) => {
    const value = params[key];
    if (value === undefined) throw new Error(`Missing path param "${key}" for ${template}`);
    return encodeURIComponent(value);
  });
}
