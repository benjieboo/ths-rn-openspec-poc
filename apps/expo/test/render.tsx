import { PortalHost } from '@rn-primitives/portal';
import { parseScenarios } from '@ths/api-contract';
import { ApiProvider, makeQueryClient } from '@ths/api-contract/react';
import { ToastProvider } from '@ths/ui';
import { act, render, type RenderOptions } from '@testing-library/react-native';
import { ExpoRoot } from 'expo-router/build/ExpoRoot';
import { store } from 'expo-router/build/global-state/router-store';
import { getMockContext, type MockContextConfig } from 'expo-router/testing-library';
import * as React from 'react';
import { Dimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { fetch as undiciFetch } from 'undici';

// React Native's Jest setup stubs global fetch; tests use a real HTTP client against the mock API.
const httpFetch = undiciFetch as unknown as typeof fetch;

export const API_URL = process.env.TEST_API_URL ?? 'http://127.0.0.1:4099';

export const PHONE = { width: 390, height: 844 };
export const DESKTOP = { width: 1280, height: 900 };

type Options = {
  scenario?: string;
  size?: { width: number; height: number };
  /** Wrap the real fetch, e.g. to simulate a failure the mock API has no scenario for. */
  fetch?: (real: typeof fetch) => typeof fetch;
};

const METRICS = { frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 47, left: 0, right: 0, bottom: 34 } };

/** Sets the window size seen by useBreakpoint. Dimensions.set emits a change, so tests can resize mid-test. */
export function setWindowSize({ width, height }: { width: number; height: number }) {
  const metrics = { width, height, scale: 2, fontScale: 1 };
  act(() => Dimensions.set({ window: metrics, screen: metrics }));
}

export function Providers({
  scenario = 'anonymous',
  fetch: wrapFetch,
  children,
}: {
  scenario?: string;
  fetch?: Options['fetch'];
  children: React.ReactNode;
}) {
  // A fresh cache per render, no retries: each test sees exactly what the mock API says.
  const [queryClient] = React.useState(() => {
    const qc = makeQueryClient();
    qc.setDefaultOptions({ queries: { retry: false, staleTime: Infinity, gcTime: Infinity } });
    return qc;
  });
  const fetchImpl = React.useMemo(() => (wrapFetch ? wrapFetch(httpFetch) : httpFetch), [wrapFetch]);
  return (
    <SafeAreaProvider initialMetrics={METRICS}>
      <ApiProvider baseUrl={API_URL} initialScenario={parseScenarios(scenario)} queryClient={queryClient} fetch={fetchImpl}>
        <ToastProvider>
          {children}
          <PortalHost />
        </ToastProvider>
      </ApiProvider>
    </SafeAreaProvider>
  );
}

export function renderWithProviders(ui: React.ReactElement, { scenario, size = PHONE, fetch, ...rest }: Options & RenderOptions = {}) {
  setWindowSize(size);
  return render(ui, {
    wrapper: ({ children }) => (
      <Providers scenario={scenario} fetch={fetch}>
        {children}
      </Providers>
    ),
    ...rest,
  });
}

/**
 * Renders real route modules through Expo Router at a URL. Mirrors expo-router's renderRouter but
 * keeps real timers: these tests talk to a real HTTP server, and fake timers stall it.
 */
export function renderRoutes(routes: MockContextConfig, initialUrl: string, { scenario, size = PHONE, fetch }: Options = {}) {
  setWindowSize(size);
  process.env.EXPO_ROUTER_IMPORT_MODE = 'sync';
  const result = render(<ExpoRoot context={getMockContext(routes)} location={initialUrl} />, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <Providers scenario={scenario} fetch={fetch}>
        {children}
      </Providers>
    ),
  });
  return Object.assign(result, {
    getPathname: () => store.getRouteInfo().pathname,
    getSearchParams: () => store.getRouteInfo().params,
  });
}

export async function resetMockApi() {
  await httpFetch(`${API_URL}/__reset`, { method: 'POST' });
}
