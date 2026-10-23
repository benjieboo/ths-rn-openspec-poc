import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { ApiError } from '../client';
import type { ApplicationRequest, ReportRequest, Viewer } from '../schemas';
import { useApi } from './provider';

// Query keys always end with the scenario key: each viewer/data state has its own cache.
export const queryKeys = {
  listing: (id: string, s: string) => ['listing', id, s] as const,
  assignments: (id: string, s: string) => ['listing', id, 'assignments', s] as const,
  pets: (id: string, s: string) => ['listing', id, 'pets', s] as const,
  amenities: (id: string, s: string) => ['listing', id, 'amenities', s] as const,
  responsibilities: (id: string, s: string) => ['listing', id, 'responsibilities', s] as const,
  sitEssentials: (id: string, s: string) => ['listing', id, 'sit-essentials', s] as const,
  reviews: (id: string, s: string) => ['listing', id, 'reviews', s] as const,
  me: (s: string) => ['me', s] as const,
};

export function useListing(listingId: string) {
  const { client, scenarioKey } = useApi();
  return useQuery({ queryKey: queryKeys.listing(listingId, scenarioKey), queryFn: () => client.getListing(listingId) });
}

export function useAssignments(listingId: string) {
  const { client, scenarioKey } = useApi();
  return useQuery({
    queryKey: queryKeys.assignments(listingId, scenarioKey),
    queryFn: () => client.getAssignments(listingId),
    select: (d) => d.items,
  });
}

export function usePets(listingId: string) {
  const { client, scenarioKey } = useApi();
  return useQuery({
    queryKey: queryKeys.pets(listingId, scenarioKey),
    queryFn: () => client.getPets(listingId),
    select: (d) => d.items,
  });
}

export function useAmenities(listingId: string) {
  const { client, scenarioKey } = useApi();
  return useQuery({ queryKey: queryKeys.amenities(listingId, scenarioKey), queryFn: () => client.getAmenities(listingId) });
}

export function useResponsibilities(listingId: string) {
  const { client, scenarioKey } = useApi();
  return useQuery({
    queryKey: queryKeys.responsibilities(listingId, scenarioKey),
    queryFn: () => client.getResponsibilities(listingId),
  });
}

export function useSitEssentials(listingId: string) {
  const { client, scenarioKey } = useApi();
  return useQuery({
    queryKey: queryKeys.sitEssentials(listingId, scenarioKey),
    queryFn: () => client.getSitEssentials(listingId),
  });
}

/** Paginated reviews; call fetchNextPage() for "Show more reviews". */
export function useReviews(listingId: string) {
  const { client, scenarioKey } = useApi();
  return useInfiniteQuery({
    queryKey: queryKeys.reviews(listingId, scenarioKey),
    queryFn: ({ pageParam }) => client.getReviews(listingId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.totalPages ? last.page + 1 : undefined),
  });
}

export function useMe() {
  const { client, scenarioKey } = useApi();
  return useQuery({ queryKey: queryKeys.me(scenarioKey), queryFn: () => client.getMe() });
}

export function useIsFavourite(listingId: string) {
  const me = useMe();
  return me.data?.favouriteListingIds.includes(listingId) ?? false;
}

/**
 * Optimistic favourite toggle: the heart flips immediately, and rolls back if the server
 * rejects it (try the `favourite-error` scenario).
 */
export function useToggleFavourite(listingId: string) {
  const { client, scenarioKey } = useApi();
  const queryClient = useQueryClient();
  const key = queryKeys.me(scenarioKey);

  return useMutation<unknown, ApiError, boolean, { previous?: Viewer }>({
    mutationFn: (makeFavourite) => (makeFavourite ? client.addFavourite(listingId) : client.removeFavourite(listingId)),
    onMutate: async (makeFavourite) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Viewer>(key);
      if (previous) {
        const ids = new Set(previous.favouriteListingIds);
        if (makeFavourite) ids.add(listingId);
        else ids.delete(listingId);
        queryClient.setQueryData<Viewer>(key, { ...previous, favouriteListingIds: [...ids] });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
}

export function useApply(listingId: string) {
  const { client, scenarioKey } = useApi();
  const queryClient = useQueryClient();
  return useMutation<unknown, ApiError, ApplicationRequest>({
    mutationFn: (body) => client.apply(listingId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.me(scenarioKey) }),
  });
}

export function useReportListing(listingId: string) {
  const { client } = useApi();
  return useMutation<unknown, ApiError, ReportRequest>({ mutationFn: (body) => client.report(listingId, body) });
}
