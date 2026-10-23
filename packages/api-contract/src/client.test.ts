import { describe, expect, it } from 'vitest';

import { ApiError, createApiClient } from './client';
import { parseScenarios, ScenarioParseError } from './scenarios';

const respond = (status: number, body: unknown) => async () =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

describe('createApiClient', () => {
  it('rejects a response that fails the contract', async () => {
    const client = createApiClient({ baseUrl: 'http://x', fetch: respond(200, { title: 'no id' }) });
    await expect(client.getListing('1')).rejects.toMatchObject({ code: 'invalid_response' });
  });

  it('maps the error shape to ApiError', async () => {
    const client = createApiClient({
      baseUrl: 'http://x',
      fetch: respond(404, { error: { code: 'not_found', message: 'No listing 9' } }),
    });
    const err = await client.getListing('9').catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({ status: 404, code: 'not_found' });
  });

  it('sends the scenario header', async () => {
    let sent: Headers | undefined;
    const client = createApiClient({
      baseUrl: 'http://x',
      scenario: { viewer: 'full-sitter', data: ['no-reviews'] },
      fetch: async (_url, init) => {
        sent = new Headers(init?.headers);
        return respond(200, { error: { code: 'server_error', message: '' } })();
      },
    });
    await client.getMe().catch(() => {});
    expect(sent?.get('x-scenario')).toBe('full-sitter,no-reviews');
  });
});

describe('parseScenarios', () => {
  it('defaults to anonymous', () => expect(parseScenarios(null)).toEqual({ viewer: 'anonymous', data: [] }));
  it('combines viewer and data scenarios', () =>
    expect(parseScenarios('no-pets, full-sitter')).toEqual({ viewer: 'full-sitter', data: ['no-pets'] }));
  it('rejects unknown names', () => expect(() => parseScenarios('vip')).toThrow(ScenarioParseError));
  it('rejects two viewers', () => expect(() => parseScenarios('anonymous,full-sitter')).toThrow(ScenarioParseError));
});
