import type { z } from 'zod';

import { buildPath, endpoints, type EndpointName, type ResponseOf } from './endpoints';
import { formatScenarios, SCENARIO_HEADER, type ScenarioSelection } from './scenarios';
import { ApiErrorBody, type ApiErrorCode, type ApplicationRequest, type ReportRequest } from './schemas';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: ApiErrorCode | 'invalid_response' | 'network_error',
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type ClientOptions = {
  baseUrl: string;
  scenario?: ScenarioSelection;
  fetch?: typeof fetch;
};

export function createApiClient({ baseUrl, scenario, fetch: fetchImpl = fetch }: ClientOptions) {
  async function call<E extends EndpointName>(
    name: E,
    params: Record<string, string> = {},
    { query, body }: { query?: Record<string, string>; body?: unknown } = {}
  ): Promise<ResponseOf<E>> {
    const endpoint = endpoints[name];
    const qs = query ? `?${new URLSearchParams(query)}` : '';
    const url = `${baseUrl}${buildPath(endpoint.path, params)}${qs}`;

    let res: Response;
    try {
      res = await fetchImpl(url, {
        method: endpoint.method,
        headers: {
          accept: 'application/json',
          ...(body !== undefined && { 'content-type': 'application/json' }),
          ...(scenario && { [SCENARIO_HEADER]: formatScenarios(scenario) }),
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    } catch (e) {
      throw new ApiError(0, 'network_error', e instanceof Error ? e.message : 'Network request failed');
    }

    const json: unknown = await res.json().catch(() => null);
    if (!res.ok) {
      const parsed = ApiErrorBody.safeParse(json);
      if (parsed.success) throw new ApiError(res.status, parsed.data.error.code, parsed.data.error.message);
      throw new ApiError(res.status, 'invalid_response', `HTTP ${res.status} with an unrecognised error body`);
    }

    // Reject anything that doesn't match the contract rather than rendering partial data.
    const parsed = (endpoint.response as z.ZodType).safeParse(json);
    if (!parsed.success) {
      throw new ApiError(res.status, 'invalid_response', `${name}: response failed contract: ${parsed.error.message}`);
    }
    return parsed.data as ResponseOf<E>;
  }

  return {
    getListing: (listingId: string) => call('getListing', { listingId }),
    getAssignments: (listingId: string) => call('getAssignments', { listingId }),
    getPets: (listingId: string) => call('getPets', { listingId }),
    getAmenities: (listingId: string) => call('getAmenities', { listingId }),
    getResponsibilities: (listingId: string) => call('getResponsibilities', { listingId }),
    getSitEssentials: (listingId: string) => call('getSitEssentials', { listingId }),
    getReviews: (listingId: string, page = 1) => call('getReviews', { listingId }, { query: { page: String(page) } }),
    getMe: () => call('getMe'),
    addFavourite: (listingId: string) => call('addFavourite', { listingId }),
    removeFavourite: (listingId: string) => call('removeFavourite', { listingId }),
    apply: (listingId: string, body: ApplicationRequest) => call('apply', { listingId }, { body }),
    report: (listingId: string, body: ReportRequest) => call('report', { listingId }, { body }),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
