import type { Listing } from '@ths/api-contract';
import { Button, OwnerCard, Skeleton, StatusBanner, Text, useToast } from '@ths/ui';
import { View } from 'react-native';

import type { ListingActions } from './actions';
import { copy } from './copy';
import { DateChips } from './sections';
import type { ListingPage } from './use-listing-page';

export function CtaButton({ page, actions, className }: { page: ListingPage; actions: ListingActions; className?: string }) {
  const { cta } = page;
  if (cta.kind === 'none') return null;
  if (cta.kind === 'loading') return <Skeleton className={`h-12 w-44 rounded-md ${className ?? ''}`} />;
  return (
    <Button onPress={actions.onCta} disabled={cta.disabled} className={className} testID="primary-cta">
      <Text>{cta.label}</Text>
    </Button>
  );
}

/** Secondary action when there are no open dates. Not saved yet, so it lasts for this visit. */
export function NotifyButton({ page }: { page: ListingPage }) {
  const toast = useToast();
  if (page.cta.kind !== 'none' || page.cta.reason !== 'no-dates') return null;
  const requested = page.notifyRequested;
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={requested}
      testID="notify-me"
      onPress={() => {
        page.requestNotify();
        toast.show(copy.notify.confirmed, { tone: 'success' });
      }}>
      <Text>{requested ? copy.notify.requested : copy.notify.action}</Text>
    </Button>
  );
}

export function CtaNotes({ page }: { page: ListingPage }) {
  if (page.role === 'owner') return <StatusBanner tone="brand">{copy.ownListingNote}</StatusBanner>;
  if (page.role === 'partial' && page.cta.kind === 'upgrade') return <StatusBanner tone="info">{copy.upgradeNote}</StatusBanner>;
  return null;
}

/** Pet parent, their dates and (on desktop) the call to action. */
export function OwnerPanel({
  listing,
  page,
  actions,
  withCta,
  variant,
}: {
  listing: Listing;
  page: ListingPage;
  actions: ListingActions;
  withCta: boolean;
  variant: 'card' | 'plain';
}) {
  return (
    <OwnerCard
      name={listing.owner.firstName}
      photoUrl={listing.owner.photoUrl}
      roleLabel={copy.petParent}
      verified={listing.owner.verified}
      variant={variant}>
      <DateChips query={page.assignments} selectedId={page.selectedId} onSelect={page.selectAssignment} />
      <View className="gap-3">
        <CtaNotes page={page} />
        {withCta && (
          <>
            <CtaButton page={page} actions={actions} />
            <NotifyButton page={page} />
          </>
        )}
      </View>
    </OwnerCard>
  );
}
