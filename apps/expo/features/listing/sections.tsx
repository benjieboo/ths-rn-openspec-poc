// Listing content blocks. Composition only: @ths/ui components plus layout classes (flex, gap,
// padding). Used inline on desktop, on detail pages, and on mobile where the spec shows them.
import type { Amenities, Assignment, Listing, Pet, Responsibilities, Review, SitEssentials } from '@ths/api-contract';
import {
  AmenityList,
  AnimalCountBadge,
  Badge,
  Button,
  DateRangeChip,
  formatDateRange,
  Icon,
  MapPreview,
  PetCard,
  ReadMore,
  ReviewCard,
  Section,
  Skeleton,
  StatusBanner,
  Text,
} from '@ths/ui';
import {
  BusIcon,
  CarIcon,
  ClockIcon,
  HomeIcon,
  LeafIcon,
  MapPinIcon,
  PawPrintIcon,
  PillIcon,
  SparklesIcon,
  UsersIcon,
  type LucideIcon,
} from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

import { copy } from './copy';
import {
  ageText,
  guestPolicyText,
  handoverText,
  homeFacts,
  locationLine,
  longDate,
  medicationText,
  placeName,
  sitterPetsText,
  timeAloneText,
} from './format';
import { type QueryLike, SectionState } from './section-state';

function Fact({ icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <View className="flex-row items-start gap-3">
      <Icon as={icon} className="mt-0.5 text-brand" />
      <View className="flex-1">{children}</View>
    </View>
  );
}

export function TitleBlock({ listing }: { listing: Listing }) {
  return (
    <View className="gap-2">
      <Text variant="h1" testID="listing-title">
        {listing.title}
      </Text>
      <Text variant="muted">{locationLine(listing.location)}</Text>
      {(listing.animals.length > 0 || listing.reviewCount === 0) && (
        <View className="flex-row flex-wrap items-center gap-2 pt-1">
          {listing.reviewCount === 0 && (
            <Badge variant="highlight" accessible accessibilityLabel={copy.newListing} testID="new-listing-badge">
              <Text>{copy.newListing}</Text>
            </Badge>
          )}
          {listing.animals.map((a) => (
            <AnimalCountBadge key={a.species} species={a.species} count={a.count} />
          ))}
        </View>
      )}
    </View>
  );
}

export function ReviewingBanner({ ownerName }: { ownerName: string }) {
  return (
    <StatusBanner tone="warning" title={copy.reviewing.title}>
      {copy.reviewing.body(ownerName)}
    </StatusBanner>
  );
}

export function IntroductionSection({ listing }: { listing: Listing }) {
  return (
    <Section title={copy.sections.introduction}>
      <ReadMore>{listing.introduction}</ReadMore>
    </Section>
  );
}

export function HomeFacts({ listing }: { listing: Listing }) {
  const icons: LucideIcon[] = [HomeIcon, MapPinIcon, BusIcon, CarIcon];
  return (
    <View className="gap-3">
      {homeFacts(listing.home).map((fact, i) => (
        <Fact key={fact} icon={icons[i] ?? HomeIcon}>
          <Text>{fact}</Text>
        </Fact>
      ))}
    </View>
  );
}

export function HomeContent({ listing, collapse = true }: { listing: Listing; collapse?: boolean }) {
  return (
    <View className="gap-6">
      {collapse ? <ReadMore>{listing.home.description}</ReadMore> : <Text>{listing.home.description}</Text>}
      <HomeFacts listing={listing} />
    </View>
  );
}

export function LocationContent({ listing }: { listing: Listing }) {
  return (
    <View className="gap-3">
      <MapPreview
        latitude={listing.location.approximateCoordinates.lat}
        longitude={listing.location.approximateCoordinates.lon}
        accessibilityLabel={copy.mapLabel(placeName(listing.location))}
      />
      <Text variant="caption">{copy.mapNote}</Text>
    </View>
  );
}

/** Highlights first (up to `limit`), then the rest; grouped by category when not limited. */
export function AmenitiesContent({
  amenities,
  limit,
  onShowAll,
}: {
  amenities: Amenities;
  limit?: number;
  onShowAll?: () => void;
}) {
  const all = amenities.categories.flatMap((c) => c.amenities);
  if (limit) {
    const byId = new Map(all.map((a) => [a.id, a]));
    const highlighted = amenities.highlights.map((id) => byId.get(id)).filter((a) => a !== undefined);
    const ordered = [...highlighted, ...all.filter((a) => !amenities.highlights.includes(a.id))];
    return (
      <AmenityList
        amenities={ordered.map((a) => ({ id: a.id, label: a.label, detail: a.detail ?? undefined }))}
        limit={limit}
        onShowAll={onShowAll}
      />
    );
  }
  return (
    <View className="gap-8">
      {amenities.categories.map((category) => (
        <View key={category.id} className="gap-4">
          <Text variant="h4" role="heading" aria-level={2}>
            {category.name}
          </Text>
          <AmenityList amenities={category.amenities.map((a) => ({ id: a.id, label: a.label, detail: a.detail ?? undefined }))} />
        </View>
      ))}
    </View>
  );
}

export function PetsRow({ pets, onPetPress, inset = false }: { pets: Pet[]; onPetPress: (pet: Pet) => void; inset?: boolean }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName={inset ? 'gap-4 px-4' : 'gap-4'}
      accessibilityRole="list">
      {pets.map((pet) => (
        <PetCard
          key={pet.id}
          name={pet.name}
          species={pet.species}
          breed={pet.breed ?? undefined}
          age={ageText(pet.ageYears)}
          photoUrl={pet.photoUrl}
          onPress={() => onPetPress(pet)}
        />
      ))}
    </ScrollView>
  );
}

export function PetResponsibility({ item }: { item: Responsibilities['pets'][number] }) {
  return (
    <View className="gap-2">
      <Text className="font-semibold">{item.petName}</Text>
      <Fact icon={ClockIcon}>
        <Text>{timeAloneText(item.timeAlone)}</Text>
      </Fact>
      <Fact icon={PillIcon}>
        <Text>{medicationText(item.medication)}</Text>
        {item.medication.required && item.medication.note ? <Text variant="muted">{item.medication.note}</Text> : null}
      </Fact>
      {item.notes ? <Text variant="muted">{item.notes}</Text> : null}
    </View>
  );
}

export function ResponsibilitiesContent({ responsibilities }: { responsibilities: Responsibilities }) {
  return (
    <View className="gap-6">
      {responsibilities.pets.map((item) => (
        <PetResponsibility key={item.petId} item={item} />
      ))}
      {responsibilities.home.length > 0 && (
        <View className="gap-3">
          <Text className="font-semibold">{copy.homeTasks}</Text>
          {responsibilities.home.map((task, i) => (
            <Fact key={i} icon={task.area === 'plants' || task.area === 'garden' ? LeafIcon : task.area === 'pets' ? PawPrintIcon : SparklesIcon}>
              <Text variant="label">{copy.homeTaskArea[task.area]}</Text>
              <Text>{task.description}</Text>
            </Fact>
          ))}
        </View>
      )}
    </View>
  );
}

export function SitEssentialsContent({ essentials, assignments }: { essentials: SitEssentials; assignments: Assignment[] }) {
  const byId = new Map(assignments.map((a) => [a.id, a]));
  return (
    <View className="gap-6">
      {essentials.dates.map((d) => {
        const assignment = byId.get(d.assignmentId);
        if (!assignment) return null;
        return (
          <View key={d.assignmentId} className="gap-2">
            <Text className="font-semibold">{formatDateRange(assignment.startDate, assignment.endDate)}</Text>
            <Text>
              <Text variant="label">{copy.essentials.arrival}</Text> · {longDate(assignment.startDate)}: {handoverText(d.arrival)}
            </Text>
            <Text>
              <Text variant="label">{copy.essentials.departure}</Text> · {longDate(assignment.endDate)}: {handoverText(d.departure)}
            </Text>
          </View>
        );
      })}
      <View className="gap-3">
        <Text className="font-semibold">{copy.essentials.guestPolicy}</Text>
        <Fact icon={UsersIcon}>
          <Text>{guestPolicyText(essentials.guests)}</Text>
        </Fact>
        <Fact icon={PawPrintIcon}>
          <Text>{sitterPetsText(essentials.sitterPetsAllowed)}</Text>
        </Fact>
      </View>
    </View>
  );
}

export function ReviewsList({
  reviews,
  hasMore,
  loadingMore,
  onLoadMore,
}: {
  reviews: Review[];
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
}) {
  return (
    <View className="gap-4">
      {reviews.map((r) => (
        <ReviewCard
          key={r.id}
          reviewerName={r.reviewer.firstName}
          reviewerPhotoUrl={r.reviewer.photoUrl}
          text={r.text}
          stayStart={r.stayStart}
          stayEnd={r.stayEnd}
        />
      ))}
      {loadingMore && <Skeleton className="h-32 w-full rounded-lg" />}
      {hasMore && !loadingMore && (
        <Button variant="outline" onPress={onLoadMore} className="self-start">
          <Text>{copy.showMoreReviews}</Text>
        </Button>
      )}
    </View>
  );
}

type DatesProps = {
  query: QueryLike<Assignment[]>;
  selectedId?: string;
  onSelect: (id: string) => void;
};

export function DateChips({ query, selectedId, onSelect }: DatesProps) {
  return (
    <View className="gap-3" testID="date-chips">
      <Text variant="label">{copy.sections.sitterNeeded}</Text>
      <SectionState query={query} what={copy.datesWhat} skeleton={<Skeleton className="h-14 w-full rounded-md" />}>
        {(assignments) =>
          assignments.length === 0 ? (
            <Text variant="muted">{copy.noDates}</Text>
          ) : (
            assignments.map((a) => (
              <DateRangeChip
                key={a.id}
                start={a.startDate}
                end={a.endDate}
                reviewing={a.isReviewing}
                selected={selectedId === a.id}
                onPress={() => onSelect(a.id)}
              />
            ))
          )
        }
      </SectionState>
    </View>
  );
}

export function ReferBlock({ onShare }: { onShare: () => void }) {
  return (
    <View className="gap-3">
      <Text className="font-semibold">{copy.refer.title}</Text>
      <Button variant="outline" size="sm" onPress={onShare} className="self-start">
        <Text>{copy.refer.action}</Text>
      </Button>
    </View>
  );
}
