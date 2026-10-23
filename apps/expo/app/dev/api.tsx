import { formatScenarios, type ApiError } from '@ths/api-contract';
import {
  useAmenities,
  useApi,
  useAssignments,
  useIsFavourite,
  useListing,
  useMe,
  usePets,
  useResponsibilities,
  useReviews,
  useSitEssentials,
  useToggleFavourite,
} from '@ths/api-contract/react';
import { Button, Section, Skeleton, StatusBanner, Text } from '@ths/ui';
import { Stack, useLocalSearchParams } from 'expo-router';
import { RefreshControl, ScrollView, View } from 'react-native';

type Check = { label: string; isPending: boolean; error: ApiError | null; summary?: string };

function CheckRow({ label, isPending, error, summary }: Check) {
  if (isPending) return <Skeleton className="h-14 w-full rounded-md" />;
  if (error) {
    return (
      <StatusBanner tone="error" title={label}>
        {`${error.status} ${error.code}: ${error.message}`}
      </StatusBanner>
    );
  }
  return (
    <StatusBanner tone="success" title={label}>
      {summary ?? 'OK'}
    </StatusBanner>
  );
}

// Development-only: calls every endpoint with the current scenario and summarises the result.
export default function ApiCheckScreen() {
  const { listingId = '2001' } = useLocalSearchParams<{ listingId?: string }>();
  const { baseUrl, scenario } = useApi();
  const listing = useListing(listingId);
  const assignments = useAssignments(listingId);
  const pets = usePets(listingId);
  const amenities = useAmenities(listingId);
  const responsibilities = useResponsibilities(listingId);
  const essentials = useSitEssentials(listingId);
  const reviews = useReviews(listingId);
  const me = useMe();
  const isFavourite = useIsFavourite(listingId);
  const toggleFavourite = useToggleFavourite(listingId);

  const all = [listing, assignments, pets, amenities, responsibilities, essentials, reviews, me];
  const refetchAll = () => all.forEach((q) => q.refetch());
  const firstReviewPage = reviews.data?.pages[0];

  const checks: Check[] = [
    {
      label: `GET /listings/${listingId}`,
      ...listing,
      summary: listing.data && `${listing.data.title} · ${listing.data.photos.length} photos · ${listing.data.reviewCount} reviews`,
    },
    {
      label: 'GET …/assignments',
      ...assignments,
      summary: assignments.data && `${assignments.data.length} date ranges, ${assignments.data.filter((a) => a.isReviewing).length} reviewing`,
    },
    { label: 'GET …/pets', ...pets, summary: pets.data && (pets.data.map((p) => p.name).join(', ') || 'No pets') },
    { label: 'GET …/amenities', ...amenities, summary: amenities.data && `${amenities.data.total} amenities` },
    {
      label: 'GET …/responsibilities',
      ...responsibilities,
      summary: responsibilities.data && `${responsibilities.data.pets.length} pets, ${responsibilities.data.home.length} home tasks`,
    },
    { label: 'GET …/sit-essentials', ...essentials, summary: essentials.data && `${essentials.data.dates.length} date entries` },
    {
      label: 'GET …/reviews',
      ...reviews,
      summary: firstReviewPage && `page ${firstReviewPage.page}/${firstReviewPage.totalPages} · ${firstReviewPage.total} total`,
    },
    {
      label: 'GET /me',
      ...me,
      summary: me.data && `${me.data.membership}${me.data.firstName ? ` (${me.data.firstName})` : ''} · canApply ${me.data.canApply} · favourites ${me.data.favouriteListingIds.length}`,
    },
  ];

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ title: 'API check' }} />
      <ScrollView
        contentContainerClassName="pb-16"
        refreshControl={<RefreshControl refreshing={false} onRefresh={refetchAll} />}>
        <View className="w-full max-w-xl self-center px-4">
          <Section>
            <Text variant="h1">API check</Text>
            <Text variant="muted">Base URL: {baseUrl}</Text>
            <Text variant="muted">Scenario: {formatScenarios(scenario)}</Text>
          </Section>
          <View className="gap-3">
            {checks.map((c) => (
              <CheckRow key={c.label} {...c} />
            ))}
          </View>
          <Section title="Optimistic favourite">
            <Text variant="muted">
              Favourite: {String(isFavourite)}. With favourite-error it flips, then rolls back.
            </Text>
            {toggleFavourite.error ? (
              <StatusBanner tone="error">{`Rolled back: ${toggleFavourite.error.code}`}</StatusBanner>
            ) : null}
            <View className="flex-row gap-3">
              <Button variant="outline" onPress={() => toggleFavourite.mutate(!isFavourite)}>
                <Text>{isFavourite ? 'Remove favourite' : 'Add favourite'}</Text>
              </Button>
              <Button variant="ghost" onPress={refetchAll}>
                <Text>Refetch all</Text>
              </Button>
            </View>
          </Section>
        </View>
      </ScrollView>
    </View>
  );
}
