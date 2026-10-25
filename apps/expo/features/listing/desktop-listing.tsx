import type { Listing } from '@ths/api-contract';
import { Button, IconButton, PhotoGallery, Section, Text } from '@ths/ui';
import { useRouter } from 'expo-router';
import { HeartIcon, Share2Icon } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';

import { useListingActions } from './actions';
import { copy } from './copy';
import { OwnerPanel } from './owner-panel';
import { SectionState } from './section-state';
import {
  AmenitiesContent,
  HomeContent,
  IntroductionSection,
  LocationContent,
  PetsRow,
  ReferBlock,
  ResponsibilitiesContent,
  ReviewingBanner,
  ReviewsList,
  SitEssentialsContent,
  TitleBlock,
} from './sections';
import type { ListingPage } from './use-listing-page';

/** Desktop web: header row, photo grid, sections inline on the left, sticky owner card on the right. */
export function DesktopListing({ page, listing }: { page: ListingPage; listing: Listing }) {
  const router = useRouter();
  const actions = useListingActions(page);
  const id = page.listingId;
  const reviewItems = page.reviews.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerClassName="pb-16">
        <View className="w-full max-w-6xl gap-6 self-center px-8 py-8">
          <View className="flex-row items-start gap-6">
            <View className="flex-1">
              <TitleBlock listing={listing} />
            </View>
            <View className="flex-row gap-2">
              {page.visible.favourite && (
                <IconButton
                  icon={HeartIcon}
                  variant="outline"
                  selected={actions.isFavourite}
                  accessibilityLabel={actions.isFavourite ? copy.favourite.remove : copy.favourite.add}
                  iconClassName={actions.isFavourite ? 'text-destructive' : undefined}
                  iconProps={{ fill: actions.isFavourite ? 'currentColor' : 'none' }}
                  onPress={actions.onFavourite}
                />
              )}
              <IconButton icon={Share2Icon} variant="outline" accessibilityLabel={copy.share.label} onPress={actions.onShare} />
            </View>
          </View>

          {page.visible.reviewingBanner && <ReviewingBanner ownerName={listing.owner.firstName} />}

          <PhotoGallery
            photos={listing.photos.map((p) => ({ id: p.id, url: p.url, alt: p.alt ?? undefined }))}
            layout="grid"
            onPhotoPress={(i) => router.push({ pathname: '/listing/[id]/gallery', params: { id, photo: String(i) } })}
          />

          <View className="flex-row items-start gap-12">
            <View className="flex-1">
              <IntroductionSection listing={listing} />

              <Section title={copy.sections.home}>
                <HomeContent listing={listing} />
              </Section>

              {page.visible.amenities && (
                <Section title={copy.sections.amenities}>
                  <SectionState query={page.amenities} what="the amenities">
                    {(amenities) => (
                      <AmenitiesContent
                        amenities={amenities}
                        limit={5}
                        onShowAll={() => router.push({ pathname: '/listing/[id]/amenities', params: { id } })}
                      />
                    )}
                  </SectionState>
                </Section>
              )}

              {page.visible.pets && (
                <Section title={copy.sections.pets}>
                  <SectionState query={page.pets} what="the pets">
                    {(pets) => (
                      <PetsRow
                        pets={pets}
                        onPetPress={(pet) => router.push({ pathname: '/listing/[id]/pets/[petId]', params: { id, petId: pet.id } })}
                      />
                    )}
                  </SectionState>
                </Section>
              )}

              <Section title={copy.sections.responsibilities}>
                <SectionState query={page.responsibilities} what="the responsibilities">
                  {(r) => <ResponsibilitiesContent responsibilities={r} />}
                </SectionState>
              </Section>

              {page.visible.sitEssentials && (
                <Section title={copy.sections.sitEssentials}>
                  <SectionState query={page.essentials} what="the sit essentials">
                    {(e) => <SitEssentialsContent essentials={e} assignments={page.assignments.data ?? []} />}
                  </SectionState>
                </Section>
              )}

              {page.visible.reviews && (
                <Section title={copy.sections.reviews(listing.reviewCount)}>
                  <SectionState query={page.reviews} what="the reviews">
                    {() => (
                      <ReviewsList
                        reviews={reviewItems}
                        hasMore={!!page.reviews.hasNextPage}
                        loadingMore={page.reviews.isFetchingNextPage}
                        onLoadMore={() => page.reviews.fetchNextPage()}
                      />
                    )}
                  </SectionState>
                </Section>
              )}

              <Section title={copy.sections.location}>
                <LocationContent listing={listing} />
              </Section>
            </View>

            {/* Sticky sidebar: desktop only happens on web, so `web:sticky` is the whole story. */}
            <View className="w-96 gap-6 self-start web:sticky web:top-6">
              <OwnerPanel listing={listing} page={page} actions={actions} withCta variant="card" />
              {page.visible.refer && (
                <View className="rounded-lg border border-divider p-6">
                  <ReferBlock onShare={actions.onShare} />
                </View>
              )}
              {page.visible.report && (
                <Button variant="link" size="sm" onPress={actions.openReport} className="self-start">
                  <Text>{copy.report.link}</Text>
                </Button>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      {actions.dialogs}
    </View>
  );
}
