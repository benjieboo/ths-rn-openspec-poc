import { PortalHost } from '@rn-primitives/portal';
import { parseScenarios } from '@ths/api-contract';
import { ApiProvider, makeQueryClient } from '@ths/api-contract/react';
import { ToastProvider } from '@ths/ui';
import { render, type RenderOptions } from '@testing-library/react-native';
import { renderRouter, type MockContextConfig } from 'expo-router/testing-library';
import * as React from 'react';
import * as RN from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { fetch as undiciFetch } from 'undici';

const httpFetch = undiciFetch as unknown as typeof fetch;

export const API_URL = process.env.TEST_API_URL ?? 'http://127.0.0.1:4099';

export const PHONE = { width: 390, height: 844 };
export const DESKTOP = { width: 1280, height: 900 };

type Options = { scenario?: string; size?: { width: number; height: number } };

const METRICS = { frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 47, left: 0, right: 0, bottom: 34 } };

/** Sets the window size seen by useBreakpoint / useWindowDimensions for this test. */
export function setWindowSize({ width, height }: { width: number; height: number }) {
  jest.spyOn(RN, 'useWindowDimensions').mockReturnValue({ width, height, scale: 2, fontScale: 1 });
}

export function Providers({ scenario = 'anonymous', children }: { scenario?: string; children: React.ReactNode }) {
  // A fresh cache per render, no retries: each test sees exactly what the mock API says.
  const [queryClient] = React.useState(() => {
    const qc = makeQueryClient();
    qc.setDefaultOptions({ queries: { retry: false, staleTime: Infinity, gcTime: Infinity } });
    return qc;
  });
  return (
    <SafeAreaProvider initialMetrics={METRICS}>
      <ApiProvider
        baseUrl={API_URL}
        initialScenario={parseScenarios(scenario)}
        queryClient={queryClient}
        // React Native's Jest setup stubs global fetch; tests use a real HTTP client against the mock API.
        fetch={httpFetch}>
        <ToastProvider>
          {children}
          <PortalHost />
        </ToastProvider>
      </ApiProvider>
    </SafeAreaProvider>
  );
}

export function renderWithProviders(ui: React.ReactElement, { scenario, size = PHONE, ...rest }: Options & RenderOptions = {}) {
  setWindowSize(size);
  return render(ui, { wrapper: ({ children }) => <Providers scenario={scenario}>{children}</Providers>, ...rest });
}

/** Renders real route modules through Expo Router at a URL. */
export function renderRoutes(routes: MockContextConfig, initialUrl: string, { scenario, size = PHONE }: Options = {}) {
  setWindowSize(size);
  return renderRouter(routes, {
    initialUrl,
    wrapper: ({ children }: { children: React.ReactNode }) => <Providers scenario={scenario}>{children}</Providers>,
  });
}

export async function resetMockApi() {
  await httpFetch(`${API_URL}/__reset`, { method: 'POST' });
}
