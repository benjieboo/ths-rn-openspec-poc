import {
  useAmenities,
  useAssignments,
  useListing,
  useMe,
  usePets,
  useResponsibilities,
  useReviews,
  useSitEssentials,
} from '@ths/api-contract/react';
import * as React from 'react';

import { callToAction, defaultSelection, viewerRole, visibleSections } from './logic';

/**
 * Everything the listing page needs, fetched in parallel. The listing query is critical (drives
 * the page's loading/error state); every other query is rendered per section.
 */
export function useListingPage(listingId: string) {
  const listing = useListing(listingId);
  const assignments = useAssignments(listingId);
  const pets = usePets(listingId);
  const amenities = useAmenities(listingId);
  const responsibilities = useResponsibilities(listingId);
  const essentials = useSitEssentials(listingId);
  const reviews = useReviews(listingId);
  const me = useMe();

  // If /me fails, fall back to the anonymous experience rather than waiting forever.
  const role = me.isPending ? 'unknown' : viewerRole(me.data, listing.data);
  const assignmentList = React.useMemo(() => assignments.data ?? [], [assignments.data]);

  // Date selection lives here, above the layout switch, so resizing keeps it.
  const [selectedId, setSelectedId] = React.useState<string | undefined>();
  const [touched, setTouched] = React.useState(false);
  React.useEffect(() => {
    if (!touched) setSelectedId(defaultSelection(assignmentList));
  }, [assignmentList, touched]);
  const selectAssignment = React.useCallback((id: string) => {
    setTouched(true);
    setSelectedId(id);
  }, []);

  const appliedIds = React.useMemo(
    () => (me.data?.applications ?? []).filter((app) => app.listingId === listingId).map((app) => app.assignmentId),
    [me.data, listingId]
  );

  const cta = callToAction({ role, assignments: assignmentList, selectedId, appliedIds });
  const visible = visibleSections({
    role,
    petCount: listing.data?.animals.reduce((n, x) => n + x.count, 0) ?? 0,
    amenityCount: listing.data?.amenityCount ?? 0,
    reviewCount: listing.data?.reviewCount ?? 0,
    assignments: assignmentList,
    assignmentsLoaded: assignments.isSuccess,
  });

  return {
    listingId,
    listing,
    assignments,
    pets,
    amenities,
    responsibilities,
    essentials,
    reviews,
    me,
    role,
    cta,
    visible,
    selectedId,
    selectAssignment,
    selectedAssignment: assignmentList.find((x) => x.id === selectedId),
    appliedIds,
  };
}

export type ListingPage = ReturnType<typeof useListingPage>;
