import { serve } from '@hono/node-server';

import { createApp } from './app';

const port = Number(process.env.PORT ?? 4010);
const latency = process.env.MOCK_LATENCY !== 'off';

serve({ fetch: createApp({ latency }).fetch, port, hostname: '0.0.0.0' }, (info) => {
  console.log(`[mock-api] listening on http://localhost:${info.port} (latency ${latency ? 'on' : 'off'})`);
  console.log('[mock-api] listings: /listings/2001, /listings/2002 · scenarios via x-scenario header or ?scenario=');
});
