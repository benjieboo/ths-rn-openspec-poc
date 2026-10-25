import { useBreakpoint } from '@ths/ui';
import { WebHead } from './web-head';

import { copy } from './copy';
import { DesktopListing } from './desktop-listing';
import { MobileListing } from './mobile-listing';
import { ListingError, ListingNotFound, ListingSkeleton, BackBar } from './page-states';
import { useListingPage } from './use-listing-page';

/** The listing page. One component, two presentations, chosen by the breakpoint only. */
export function ListingScreen({ listingId }: { listingId: string }) {
  const page = useListingPage(listingId);
  const { isDesktop } = useBreakpoint();
  const { listing } = page;

  if (listing.isPending) {
    return (
      <>
        <ListingSkeleton desktop={isDesktop} />
        {!isDesktop && <BackBar overlay />}
      </>
    );
  }
  if (listing.error?.code === 'not_found') return <ListingNotFound showBack={!isDesktop} />;
  if (listing.error || !listing.data) return <ListingError showBack={!isDesktop} onRetry={() => listing.refetch()} />;

  const data = listing.data;
  return (
    <>
      <WebHead>
        <title>{copy.pageTitle(data.title, data.location.city)}</title>
        <meta name="description" content={data.introduction} />
      </WebHead>
      {isDesktop ? <DesktopListing page={page} listing={data} /> : <MobileListing page={page} listing={data} />}
    </>
  );
}
