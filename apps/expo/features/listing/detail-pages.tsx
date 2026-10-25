import type { Listing } from '@ths/api-contract';
import { useAssignments, useListing, usePets, useResponsibilities, useReviews, useSitEssentials, useAmenities } from '@ths/api-contract/react';
import { PetCard, PhotoViewer, Section, Skeleton, Text, useBreakpoint } from '@ths/ui';
import { Stack, useRouter } from 'expo-router';
import Head from 'expo-router/head';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

import { copy } from './copy';
import { ageText } from './format';
import { ListingError, ListingNotFound } from './page-states';
import { SectionState } from './section-state';
import {
  AmenitiesContent,
  HomeContent,
  LocationContent,
  PetResponsibility,
  ResponsibilitiesContent,
  ReviewsList,
  SitEssentialsContent,
} from './sections';

/** Shared frame for detail pages: title, back (stack header), listing context, centred column on desktop. */
function DetailLayout({
  listingId,
  title,
  children,
}: {
  listingId: string;
  title: string | ((listing: Listing) => string);
  children: (listing: Listing) => React.ReactNode;
}) {
  const listing = useListing(listingId);
  const resolvedTitle = listing.data ? (typeof title === 'function' ? title(listing.data) : title) : '';

  let body: React.ReactNode;
  if (listing.isPending) body = <Skeleton className="h-64 w-full rounded-lg" />;
  else if (listing.error?.code === 'not_found') return <ListingNotFound showBack={false} />;
  else if (listing.error || !listing.data) return <ListingError showBack={false} onRetry={() => listing.refetch()} />;
  else body = children(listing.data);

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ title: resolvedTitle, headerBackTitle: copy.back }} />
      {listing.data && (
        <Head>
          <title>{copy.detailPageTitle(resolvedTitle, listing.data.title)}</title>
        </Head>
      )}
      <ScrollView contentContainerClassName="pb-16">
        <View className="w-full max-w-2xl gap-6 self-center px-4 py-6">
          {listing.data && (
            <View className="gap-1">
              <Text variant="h1">{resolvedTitle}</Text>
              <Text variant="muted" numberOfLines={1}>
                {listing.data.title}
              </Text>
            </View>
          )}
          {body}
        </View>
      </ScrollView>
    </View>
  );
}

export function HomeDetailPage({ listingId }: { listingId: string }) {
  return (
    <DetailLayout listingId={listingId} title={copy.sections.home}>
      {(listing) => (
        <>
          <HomeContent listing={listing} collapse={false} />
          <Section title={copy.sections.location}>
            <LocationContent listing={listing} />
          </Section>
        </>
      )}
    </DetailLayout>
  );
}

export function AmenitiesDetailPage({ listingId }: { listingId: string }) {
  const amenities = useAmenities(listingId);
  return (
    <DetailLayout listingId={listingId} title={copy.sections.amenities}>
      {() => (
        <SectionState query={amenities} what="the amenities">
          {(a) => <AmenitiesContent amenities={a} />}
        </SectionState>
      )}
    </DetailLayout>
  );
}

export function ResponsibilitiesDetailPage({ listingId }: { listingId: string }) {
  const responsibilities = useResponsibilities(listingId);
  return (
    <DetailLayout listingId={listingId} title={copy.sections.responsibilities}>
      {() => (
        <SectionState query={responsibilities} what="the responsibilities">
          {(r) => <ResponsibilitiesContent responsibilities={r} />}
        </SectionState>
      )}
    </DetailLayout>
  );
}

export function SitEssentialsDetailPage({ listingId }: { listingId: string }) {
  const essentials = useSitEssentials(listingId);
  const assignments = useAssignments(listingId);
  return (
    <DetailLayout listingId={listingId} title={copy.sections.sitEssentials}>
      {() => (
        <SectionState query={essentials} what="the sit essentials">
          {(e) => <SitEssentialsContent essentials={e} assignments={assignments.data ?? []} />}
        </SectionState>
      )}
    </DetailLayout>
  );
}

export function ReviewsDetailPage({ listingId }: { listingId: string }) {
  const reviews = useReviews(listingId);
  const items = reviews.data?.pages.flatMap((p) => p.items) ?? [];
  return (
    <DetailLayout listingId={listingId} title={(l) => copy.sections.reviews(l.reviewCount)}>
      {() => (
        <SectionState query={reviews} what="the reviews">
          {() => (
            <ReviewsList
              reviews={items}
              hasMore={!!reviews.hasNextPage}
              loadingMore={reviews.isFetchingNextPage}
              onLoadMore={() => reviews.fetchNextPage()}
            />
          )}
        </SectionState>
      )}
    </DetailLayout>
  );
}

export function PetDetailPage({ listingId, petId }: { listingId: string; petId: string }) {
  const pets = usePets(listingId);
  const responsibilities = useResponsibilities(listingId);
  const pet = pets.data?.find((p) => p.id === petId);
  const care = responsibilities.data?.pets.find((r) => r.petId === petId);
  return (
    <DetailLayout listingId={listingId} title={pet?.name ?? copy.sections.pets}>
      {() => (
        <SectionState query={pets} what="this pet">
          {() =>
            pet ? (
              <View className="gap-2">
                <PetCard
                  name={pet.name}
                  species={pet.species}
                  breed={pet.breed ?? undefined}
                  age={ageText(pet.ageYears)}
                  photoUrl={pet.photoUrl}
                  className="w-64"
                />
                {pet.about ? (
                  <Section title={copy.pets.about}>
                    <Text>{pet.about}</Text>
                  </Section>
                ) : null}
                {care ? (
                  <Section title={copy.pets.care}>
                    <PetResponsibility item={care} />
                  </Section>
                ) : null}
              </View>
            ) : (
              <ListingNotFound showBack={false} />
            )
          }
        </SectionState>
      )}
    </DetailLayout>
  );
}

export function GalleryPage({ listingId, initialIndex }: { listingId: string; initialIndex: number }) {
  const router = useRouter();
  const listing = useListing(listingId);
  useBreakpoint();
  const close = () =>
    router.canGoBack() ? router.back() : router.replace({ pathname: '/listing/[id]', params: { id: listingId } });

  if (!listing.data) return <View className="flex-1 bg-brand-surface" />;
  return (
    <>
      <Head>
        <title>{copy.detailPageTitle(copy.sections.photos, listing.data.title)}</title>
      </Head>
      <PhotoViewer
        photos={listing.data.photos.map((p) => ({ id: p.id, url: p.url, alt: p.alt ?? undefined }))}
        initialIndex={initialIndex}
        onClose={close}
      />
    </>
  );
}
