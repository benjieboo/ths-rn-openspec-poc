import type { ScenarioSelection } from '@ths/api-contract';

import type { Dataset, SeedListing } from './dataset';

// The only place that knows what data scenarios do. Handlers read the transformed dataset.
const TRANSFORMS: Partial<Record<ScenarioSelection['data'][number], (l: SeedListing) => SeedListing>> = {
  'all-assignments-reviewing': (l) => ({ ...l, assignments: l.assignments.map((a) => ({ ...a, isReviewing: true })) }),
  'no-open-dates': (l) => ({ ...l, assignments: [], sitEssentials: { ...l.sitEssentials, dates: [] } }),
  'no-reviews': (l) => ({ ...l, reviews: [] }),
  'no-amenities': (l) => ({ ...l, amenities: { highlights: [], categories: [] } }),
  'no-pets': (l) => ({ ...l, pets: [], responsibilities: { ...l.responsibilities, pets: [] } }),
};

export function applyScenarios(dataset: Dataset, selection: ScenarioSelection): Dataset {
  const transforms = selection.data.map((name) => TRANSFORMS[name]).filter((t) => t !== undefined);
  if (transforms.length === 0) return dataset;
  return {
    ...dataset,
    listings: dataset.listings.map((l) => transforms.reduce((acc, t) => t(acc), l)),
  };
}
