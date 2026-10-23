import {
  Amenities,
  AssignmentList,
  Listing,
  OwnerSummary,
  Pet,
  Responsibilities,
  Review,
  SitEssentials,
  Viewer,
  VIEWER_SCENARIOS,
  type AnimalCount,
} from '@ths/api-contract';
import { z } from 'zod';

import seedJson from './seed.json' with { type: 'json' };

// Counts (reviews, amenities, animals) are derived, never stored, so scenarios can't make them drift.
const SeedListing = z.object({
  listing: Listing.omit({ animals: true, reviewCount: true, amenityCount: true }).extend({ owner: OwnerSummary }),
  assignments: AssignmentList.shape.items,
  pets: z.array(Pet),
  amenities: Amenities.omit({ total: true }),
  responsibilities: Responsibilities,
  sitEssentials: SitEssentials,
  reviews: z.array(Review),
});

const SeedViewer = Viewer.pick({ memberId: true, firstName: true, membership: true, canApply: true });

export const Seed = z.object({
  listings: z.array(SeedListing),
  viewers: z.record(z.enum(VIEWER_SCENARIOS), SeedViewer),
});

export type SeedListing = z.infer<typeof SeedListing>;
export type Dataset = z.infer<typeof Seed>;

/** Parsed at startup: a seed that drifts from the contract fails here (and in tests). */
export const seed: Dataset = Seed.parse(seedJson);

export function animalCounts(pets: SeedListing['pets']): AnimalCount[] {
  const counts = new Map<AnimalCount['species'], number>();
  for (const pet of pets) counts.set(pet.species, (counts.get(pet.species) ?? 0) + 1);
  return [...counts].map(([species, count]) => ({ species, count }));
}

export function amenityTotal(amenities: SeedListing['amenities']) {
  return amenities.categories.reduce((sum, c) => sum + c.amenities.length, 0);
}

export function toListing(entry: SeedListing): Listing {
  return {
    ...entry.listing,
    animals: animalCounts(entry.pets),
    reviewCount: entry.reviews.length,
    amenityCount: amenityTotal(entry.amenities),
  };
}
