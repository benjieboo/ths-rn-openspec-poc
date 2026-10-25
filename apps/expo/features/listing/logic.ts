import type { Assignment, Listing, Viewer } from '@ths/api-contract';

import { copy } from './copy';

/** `unknown` until the viewer has loaded, so a member never briefly sees the anonymous experience. */
export type ViewerRole = 'unknown' | 'anonymous' | 'partial' | 'full' | 'owner';

export function viewerRole(viewer: Viewer | undefined, listing: Pick<Listing, 'owner'> | undefined): ViewerRole {
  if (!viewer || viewer.membership === 'anonymous') return 'anonymous';
  if (listing && viewer.memberId === listing.owner.id) return 'owner';
  return viewer.membership === 'full' ? 'full' : 'partial';
}

export const availableAssignments = (assignments: Assignment[]) => assignments.filter((a) => !a.isReviewing);

export const allReviewing = (assignments: Assignment[]) =>
  assignments.length > 0 && assignments.every((a) => a.isReviewing);

/** Preselect the only open range; otherwise nothing is selected. */
export function defaultSelection(assignments: Assignment[]) {
  const open = availableAssignments(assignments);
  return open.length === 1 ? open[0]!.id : undefined;
}

export type CallToAction =
  | { kind: 'none'; reason: 'owner' | 'no-dates' }
  | { kind: 'loading' }
  | { kind: 'join' | 'upgrade' | 'apply' | 'choose-dates'; label: string; disabled: false }
  | { kind: 'applied' | 'paused'; label: string; disabled: true };

type CtaInput = {
  role: ViewerRole;
  assignments: Assignment[];
  selectedId?: string;
  /** Assignment ids this viewer has applied to on this listing. */
  appliedIds: string[];
};

export function callToAction({ role, assignments, selectedId, appliedIds }: CtaInput): CallToAction {
  if (role === 'unknown') return { kind: 'loading' };
  if (role === 'owner') return { kind: 'none', reason: 'owner' };
  if (assignments.length === 0) return { kind: 'none', reason: 'no-dates' };
  if (role === 'anonymous') return { kind: 'join', label: copy.cta.join, disabled: false };
  if (role === 'partial') return { kind: 'upgrade', label: copy.cta.upgrade, disabled: false };

  if (allReviewing(assignments)) return { kind: 'paused', label: copy.cta.paused, disabled: true };
  if (selectedId && appliedIds.includes(selectedId)) return { kind: 'applied', label: copy.cta.applied, disabled: true };
  const selected = assignments.find((a) => a.id === selectedId && !a.isReviewing);
  if (!selected) return { kind: 'choose-dates', label: copy.cta.apply, disabled: false };
  return { kind: 'apply', label: copy.cta.apply, disabled: false };
}

type VisibilityInput = {
  role: ViewerRole;
  petCount: number;
  amenityCount: number;
  reviewCount: number;
  assignments: Assignment[];
  /** Until dates load, keep their section (showing its skeleton) so the page doesn't shift. */
  assignmentsLoaded?: boolean;
};

export function visibleSections({ role, petCount, amenityCount, reviewCount, assignments, assignmentsLoaded = true }: VisibilityInput) {
  const isOwner = role === 'owner';
  const known = role !== 'unknown';
  return {
    reviewingBanner: allReviewing(assignments),
    pets: petCount > 0,
    amenities: amenityCount > 0,
    reviews: reviewCount > 0,
    sitEssentials: !assignmentsLoaded || assignments.length > 0,
    favourite: known && !isOwner,
    refer: known && !isOwner,
    report: known && !isOwner,
  };
}
