import type { Listing } from '@ths/api-contract';
import { colors } from '@ths/tokens';
import {
  ActionListRow,
  formatDateRange,
  IconButton,
  PhotoGallery,
  Section,
  StickyApplyBar,
  Text,
  useToastBottomOffset,
} from '@ths/ui';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon, HeartIcon, Share2Icon } from 'lucide-react-native';
import * as React from 'react';
import { View, useWindowDimensions, type LayoutChangeEvent } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  scrollTo,
  runOnUI,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useListingActions } from './actions';
import { copy } from './copy';
import { CtaButton, OwnerPanel } from './owner-panel';
import { SectionState } from './section-state';
import { IntroductionSection, LocationContent, PetsRow, ReferBlock, ReviewingBanner, TitleBlock } from './sections';
import type { ListingPage } from './use-listing-page';

const HEADER_HEIGHT = 56;
const STICKY_BAR_HEIGHT = 88;

/** The app pattern: full-bleed photos, collapsing header, section rows, sticky apply bar. */
export function MobileListing({ page, listing }: { page: ListingPage; listing: Listing }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const heroHeight = (width * 3) / 4;

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);
  const datesY = React.useRef(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const revealDates = React.useCallback(() => {
    const y = Math.max(datesY.current - insets.top - HEADER_HEIGHT, 0);
    runOnUI(() => {
      'worklet';
      scrollTo(scrollRef, 0, y, true);
    })();
  }, [insets.top, scrollRef]);

  const actions = useListingActions(page, { revealDates });
  const showBar = page.cta.kind !== 'none';  // includes 'loading', so the bar doesn't pop in
  useToastBottomOffset(showBar ? STICKY_BAR_HEIGHT : 0);

  // The header turns solid and shows the title once the photos have scrolled away.
  const fadeRange = [heroHeight - insets.top - HEADER_HEIGHT * 2, heroHeight - insets.top - HEADER_HEIGHT];
  const solidStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, fadeRange, [0, 1], Extrapolation.CLAMP),
  }));

  const id = page.listingId;
  const go = (path: 'home' | 'amenities' | 'responsibilities' | 'sit-essentials' | 'reviews') =>
    router.push({ pathname: `/listing/[id]/${path}`, params: { id } });

  const next = page.selectedAssignment ?? page.assignments.data?.find((a) => !a.isReviewing);

  return (
    <View className="flex-1 bg-background">
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 32 }}
        testID="listing-scroll">
        <PhotoGallery
          photos={listing.photos.map((p) => ({ id: p.id, url: p.url, alt: p.alt ?? undefined }))}
          layout="carousel"
          onPhotoPress={(i) => router.push({ pathname: '/listing/[id]/gallery', params: { id, photo: String(i) } })}
        />

        <View className="gap-2 px-4 pt-6">
          <TitleBlock listing={listing} />
          {page.visible.reviewingBanner && (
            <View className="pt-4">
              <ReviewingBanner ownerName={listing.owner.firstName} />
            </View>
          )}
        </View>

        <View className="px-4">
          <IntroductionSection listing={listing} />
          <View>
            <ActionListRow label={copy.sections.home} onPress={() => go('home')} last={!page.visible.amenities} />
            {page.visible.amenities && (
              <ActionListRow
                label={copy.sections.amenities}
                description={copy.amenityCount(listing.amenityCount)}
                onPress={() => go('amenities')}
                last
              />
            )}
          </View>
        </View>

        {page.visible.pets && (
          <Section>
            {/* Untitled Section so the heading can be inset while the cards scroll edge to edge. */}
            <View className="px-4">
              <Text variant="h3" role="heading" aria-level={2} className="text-heading">
                {copy.sections.pets}
              </Text>
            </View>
            <SectionState query={page.pets} what="the pets">
              {(pets) => (
                <PetsRow
                  pets={pets}
                  inset
                  onPetPress={(pet) => router.push({ pathname: '/listing/[id]/pets/[petId]', params: { id, petId: pet.id } })}
                />
              )}
            </SectionState>
          </Section>
        )}

        <View className="px-4">
          <ActionListRow label={copy.sections.responsibilities} onPress={() => go('responsibilities')} />
          {page.visible.sitEssentials && <ActionListRow label={copy.sections.sitEssentials} onPress={() => go('sit-essentials')} />}
          {page.visible.reviews && (
            <ActionListRow label={copy.sections.reviews(listing.reviewCount)} onPress={() => go('reviews')} last />
          )}

          <Section title={copy.sections.location}>
            <LocationContent listing={listing} />
          </Section>

          <View
            className="gap-6 py-6"
            onLayout={(e: LayoutChangeEvent) => {
              datesY.current = e.nativeEvent.layout.y;
            }}>
            <OwnerPanel listing={listing} page={page} actions={actions} withCta={false} variant="plain" />
          </View>

          {page.visible.refer && (
            <View className="border-t border-divider py-6">
              <ReferBlock onShare={actions.onShare} />
            </View>
          )}
          {page.visible.report && (
            <View className="border-t border-divider py-4">
              <ActionListRow label={copy.report.link} onPress={actions.openReport} last />
            </View>
          )}
        </View>
      </Animated.ScrollView>

      {/* Collapsing header */}
      <View
        pointerEvents="box-none"
        style={{ paddingTop: insets.top, height: insets.top + HEADER_HEIGHT }}
        className="absolute left-0 right-0 top-0">
        <Animated.View
          pointerEvents="none"
          style={[
            { position: 'absolute', inset: 0, backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.divider },
            solidStyle,
          ]}
        />
        <View pointerEvents="box-none" className="flex-1 flex-row items-center gap-2 px-4">
          <IconButton
            icon={ArrowLeftIcon}
            variant="overlay"
            accessibilityLabel={copy.back}
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          />
          <Animated.View style={[{ flex: 1 }, solidStyle]} pointerEvents="none">
            <Text numberOfLines={1} className="font-semibold" accessibilityElementsHidden importantForAccessibility="no">
              {listing.title}
            </Text>
          </Animated.View>
          {page.visible.favourite && (
            <IconButton
              icon={HeartIcon}
              variant="overlay"
              selected={actions.isFavourite}
              accessibilityLabel={actions.isFavourite ? copy.favourite.remove : copy.favourite.add}
              iconClassName={actions.isFavourite ? 'text-destructive' : undefined}
              iconProps={{ fill: actions.isFavourite ? 'currentColor' : 'none' }}
              onPress={actions.onFavourite}
            />
          )}
          <IconButton icon={Share2Icon} variant="overlay" accessibilityLabel={copy.share.label} onPress={actions.onShare} />
        </View>
      </View>

      {showBar && (
        <StickyApplyBar
          summary={
            next ? (
              <View>
                <Text variant="caption">{copy.sections.sitterNeeded}</Text>
                <Text className="font-semibold" testID="apply-bar-dates">
                  {formatDateRange(next.startDate, next.endDate)}
                </Text>
              </View>
            ) : null
          }
          action={<CtaButton page={page} actions={actions} />}
        />
      )}

      {actions.dialogs}
    </View>
  );
}

