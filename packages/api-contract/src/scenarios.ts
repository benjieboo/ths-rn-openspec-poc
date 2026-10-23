export const VIEWER_SCENARIOS = ['anonymous', 'partial-member', 'full-sitter', 'own-listing'] as const;
export const DATA_SCENARIOS = [
  'all-assignments-reviewing',
  'no-reviews',
  'no-amenities',
  'no-pets',
  'loading-slow',
  'error',
  'favourite-error',
] as const;

export type ViewerScenario = (typeof VIEWER_SCENARIOS)[number];
export type DataScenario = (typeof DATA_SCENARIOS)[number];
export type ScenarioName = ViewerScenario | DataScenario;

export type ScenarioSelection = { viewer: ViewerScenario; data: DataScenario[] };

export const DEFAULT_SCENARIO: ScenarioSelection = { viewer: 'anonymous', data: [] };

export const SCENARIO_HEADER = 'x-scenario';

export const SCENARIO_DESCRIPTIONS: Record<ScenarioName, string> = {
  anonymous: 'Not signed in',
  'partial-member': 'Signed in, membership without applying',
  'full-sitter': 'Full sitter membership, can apply',
  'own-listing': "Viewing your own listing",
  'all-assignments-reviewing': 'Every date is under review',
  'no-reviews': 'Listing has no reviews',
  'no-amenities': 'Listing has no amenities',
  'no-pets': 'Listing has no pets',
  'loading-slow': '3–5 s responses',
  error: 'Listing endpoints return 500',
  'favourite-error': 'Favourite writes return 500',
};

export class ScenarioParseError extends Error {}

/** Parses "full-sitter,no-reviews". At most one viewer scenario; unknown names throw. */
export function parseScenarios(value: string | null | undefined): ScenarioSelection {
  if (!value) return DEFAULT_SCENARIO;
  const names = value.split(',').map((s) => s.trim()).filter(Boolean);
  const viewers: ViewerScenario[] = [];
  const data: DataScenario[] = [];
  for (const name of names) {
    if ((VIEWER_SCENARIOS as readonly string[]).includes(name)) viewers.push(name as ViewerScenario);
    else if ((DATA_SCENARIOS as readonly string[]).includes(name)) data.push(name as DataScenario);
    else throw new ScenarioParseError(`Unknown scenario "${name}"`);
  }
  if (viewers.length > 1) throw new ScenarioParseError(`Only one viewer scenario allowed, got ${viewers.join(', ')}`);
  return { viewer: viewers[0] ?? 'anonymous', data: [...new Set(data)] };
}

export function formatScenarios({ viewer, data }: ScenarioSelection) {
  return [viewer, ...data].join(',');
}
