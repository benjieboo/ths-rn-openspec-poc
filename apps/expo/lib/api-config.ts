import { parseScenarios, type ScenarioSelection } from '@ths/api-contract';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_PORT = 4010;

/**
 * Where the mock API lives, per platform (see openspec/specs/mock-api):
 * EXPO_PUBLIC_API_URL wins; web uses the page's host; native uses the Metro host (works for
 * simulators and devices on the same network), falling back to the emulator/simulator loopback.
 */
export function resolveApiBaseUrl() {
  const override = process.env.EXPO_PUBLIC_API_URL;
  if (override) return override.replace(/\/$/, '');

  if (Platform.OS === 'web') {
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    return `http://${host}:${API_PORT}`;
  }

  const metroHost = Constants.expoConfig?.hostUri?.split(':')[0];
  if (metroHost) return `http://${metroHost}:${API_PORT}`;
  return `http://${Platform.OS === 'android' ? '10.0.2.2' : 'localhost'}:${API_PORT}`;
}

/** On web, `?scenario=full-sitter,no-reviews` deep-links a state. Native starts anonymous. */
export function initialScenario(): ScenarioSelection | undefined {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return undefined;
  try {
    return parseScenarios(new URLSearchParams(window.location.search).get('scenario'));
  } catch {
    return undefined;
  }
}

export function mirrorScenarioToUrl(scenario: ScenarioSelection) {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  const value = [scenario.viewer, ...scenario.data].join(',');
  if (value === 'anonymous') url.searchParams.delete('scenario');
  else url.searchParams.set('scenario', value);
  window.history.replaceState(window.history.state, '', url);
}
