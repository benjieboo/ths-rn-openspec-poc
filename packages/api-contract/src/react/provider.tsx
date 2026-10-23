import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';

import { ApiError, createApiClient, type ApiClient } from '../client';
import { DEFAULT_SCENARIO, formatScenarios, type ScenarioSelection } from '../scenarios';

type ApiContextValue = {
  client: ApiClient;
  baseUrl: string;
  scenario: ScenarioSelection;
  /** Stable string for query keys, so switching scenario never shows another viewer's cache. */
  scenarioKey: string;
  setScenario: (scenario: ScenarioSelection) => void;
};

const ApiContext = React.createContext<ApiContextValue | null>(null);

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        // Only retry flaky networks; 4xx/5xx from the API are real answers (and scenarios rely on that).
        retry: (count, error) => error instanceof ApiError && error.code === 'network_error' && count < 2,
      },
    },
  });
}

type ApiProviderProps = {
  baseUrl: string;
  initialScenario?: ScenarioSelection;
  /** Called when the scenario changes, e.g. to mirror it into the web URL. */
  onScenarioChange?: (scenario: ScenarioSelection) => void;
  children: React.ReactNode;
};

export function ApiProvider({ baseUrl, initialScenario = DEFAULT_SCENARIO, onScenarioChange, children }: ApiProviderProps) {
  const [queryClient] = React.useState(makeQueryClient);
  const [scenario, setScenarioState] = React.useState(initialScenario);

  const setScenario = React.useCallback(
    (next: ScenarioSelection) => {
      setScenarioState(next);
      onScenarioChange?.(next);
    },
    [onScenarioChange]
  );

  const value = React.useMemo<ApiContextValue>(
    () => ({
      client: createApiClient({ baseUrl, scenario }),
      baseUrl,
      scenario,
      scenarioKey: formatScenarios(scenario),
      setScenario,
    }),
    [baseUrl, scenario, setScenario]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ApiContext.Provider value={value}>{children}</ApiContext.Provider>
    </QueryClientProvider>
  );
}

export function useApi() {
  const ctx = React.useContext(ApiContext);
  if (!ctx) throw new Error('useApi must be used inside <ApiProvider>');
  return ctx;
}

export function useScenario() {
  const { scenario, setScenario } = useApi();
  return [scenario, setScenario] as const;
}

// Every query and mutation error from this client is an ApiError.
declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError;
  }
}
