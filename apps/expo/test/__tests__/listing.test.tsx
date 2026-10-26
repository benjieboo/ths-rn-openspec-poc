import { Text } from '@ths/ui';
import { act, fireEvent, screen, waitFor, within } from 'expo-router/testing-library';
import { testRouter } from 'expo-router/testing-library';
import { Share } from 'react-native';

import * as ListingLayout from '@/app/listing/[id]/_layout';
import AmenitiesRoute from '@/app/listing/[id]/amenities';
import GalleryRoute from '@/app/listing/[id]/gallery';
import HomeRoute from '@/app/listing/[id]/home';
import ListingRoute from '@/app/listing/[id]/index';
import PetRoute from '@/app/listing/[id]/pets/[petId]';
import ResponsibilitiesRoute from '@/app/listing/[id]/responsibilities';
import ReviewsRoute from '@/app/listing/[id]/reviews';
import SitEssentialsRoute from '@/app/listing/[id]/sit-essentials';
import { copy } from '@/features/listing/copy';
import { DESKTOP, PHONE, renderRoutes, resetMockApi, setWindowSize } from '../render';

// One describe per requirement in openspec/changes/add-listing-view/specs/listing-view/spec.md;
// test names are the spec's scenario names. Data comes from the real mock API.

const ROUTES = {
  index: () => <Text>Home</Text>,
  'listing/[id]/_layout': ListingLayout,
  'listing/[id]/index': ListingRoute,
  'listing/[id]/home': HomeRoute,
  'listing/[id]/amenities': AmenitiesRoute,
  'listing/[id]/responsibilities': ResponsibilitiesRoute,
  'listing/[id]/sit-essentials': SitEssentialsRoute,
  'listing/[id]/reviews': ReviewsRoute,
  'listing/[id]/pets/[petId]': PetRoute,
  'listing/[id]/gallery': GalleryRoute,
};

const TITLE = 'Sunny Plateau flat with a cat who loves the balcony';
type Opts = Parameters<typeof renderRoutes>[2];
const open = (url: string, opts?: Opts) => renderRoutes(ROUTES, url, opts);
const openListing = async (opts?: Opts, id = '2001') => {
  const r = open(`/listing/${id}`, opts);
  await screen.findByTestId('listing-title');
  // Wait until the viewer and dates are known: the CTA, the owner's note or the no-dates copy replaces its skeleton.
  await waitFor(() =>
    expect(
      screen.queryByTestId('primary-cta') ?? screen.queryByText(copy.ownListingNote) ?? screen.queryAllByText(copy.noDates)[0]
    ).toBeTruthy()
  );
  return r;
};

/** Wraps fetch so matching requests fail with the given status and error code. */
const failing =
  (match: (url: string, method: string) => boolean, status: number, code: string) =>
  (real: typeof fetch): typeof fetch =>
  async (input, init) => {
    const url = String(input);
    if (match(url, init?.method ?? 'GET')) {
      return new Response(JSON.stringify({ error: { code, message: 'simulated' } }), {
        status,
        headers: { 'content-type': 'application/json' },
      });
    }
    return real(input, init);
  };

/** Wraps fetch so matching requests never answer, to hold a section in its loading state. */
const hanging =
  (match: (url: string) => boolean) =>
  (real: typeof fetch): typeof fetch =>
  (input, init) =>
    match(String(input)) ? new Promise<Response>(() => {}) : real(input, init);

beforeEach(async () => {
  await resetMockApi();
  setWindowSize(PHONE);
});

describe('One route per page on every platform', () => {
  it('Open a listing from a link', async () => {
    await openListing();
    expect(screen.getByTestId('listing-title')).toHaveTextContent(TITLE);
  });

  it('Deep link to a detail page', async () => {
    const r = open('/listing/2001/amenities');
    expect(await screen.findByRole('heading', { name: 'Essentials' })).toBeTruthy();
    act(() => testRouter.back());
    await waitFor(() => expect(r.getPathname()).toBe('/listing/2001'));
    expect(await screen.findByTestId('listing-title')).toBeTruthy();
  });

  it('Unknown listing', async () => {
    open('/listing/9999');
    expect(await screen.findByText(copy.notFound.title)).toBeTruthy();
    expect(screen.getByRole('button', { name: copy.notFound.action })).toBeTruthy();
  });
});

describe('Content order', () => {
  it('Reading order', async () => {
    await openListing({ size: DESKTOP });
    await screen.findByRole('heading', { name: copy.sections.reviews(12) });
    const headings = screen.getAllByRole('heading').map((h) => h.props.children);
    expect(headings).toEqual([
      TITLE,
      copy.sections.introduction,
      copy.sections.home,
      copy.sections.amenities,
      copy.sections.pets,
      copy.sections.responsibilities,
      copy.sections.sitEssentials,
      copy.sections.reviews(12),
      copy.sections.location,
    ]);
    expect(screen.getByTestId('listing-title').props['aria-level']).toBe('1');
  });
});

describe('Mobile presentation', () => {
  it('Section rows', async () => {
    const r = await openListing();
    fireEvent.press(screen.getByRole('link', { name: 'Amenities, 16 amenities' }));
    await waitFor(() => expect(r.getPathname()).toBe('/listing/2001/amenities'));
  });

  it('Apply bar', async () => {
    await openListing();
    expect(screen.getByTestId('apply-bar-dates')).toHaveTextContent('20 – 27 Dec 26');
    expect(screen.getByTestId('primary-cta')).toHaveTextContent(copy.cta.join);
  });

  it('Apply bar with no open dates', async () => {
    await openListing({ scenario: 'full-sitter,no-open-dates' });
    expect(screen.getByTestId('apply-bar-dates')).toHaveTextContent(copy.noDates);
    expect(screen.getByTestId('notify-me')).toHaveTextContent(copy.notify.action);
    expect(screen.queryByTestId('primary-cta')).toBeNull();
  });
});

describe('Desktop presentation', () => {
  it('Sections inline', async () => {
    await openListing({ size: DESKTOP });
    expect(await screen.findByRole('button', { name: copy.showAllAmenities(16) })).toBeTruthy();
    expect(screen.queryByRole('link', { name: copy.sections.home })).toBeNull();
    expect(screen.getByText(copy.sections.reviews(12))).toBeTruthy();
  });

  it('Resize across the breakpoint', async () => {
    await openListing({ size: DESKTOP, scenario: 'full-sitter' });
    fireEvent.press(await screen.findByLabelText('10 February to 24 February 2027'));
    setWindowSize(PHONE);
    expect(await screen.findByTestId('apply-bar-dates')).toHaveTextContent('10 – 24 Feb 27');
  });
});

describe('Loading', () => {
  it('First load', async () => {
    open('/listing/2001');
    expect(screen.getByLabelText(copy.loading)).toBeTruthy();
    expect(await screen.findByTestId('listing-title')).toBeTruthy();
    expect(screen.queryByLabelText(copy.loading)).toBeNull();
  });
});

describe('Errors and retry', () => {
  it('Listing fails', async () => {
    open('/listing/2001', { scenario: 'error' });
    expect(await screen.findByText(copy.listingError.title)).toBeTruthy();
    expect(screen.getByRole('button', { name: copy.listingError.retry })).toBeTruthy();
  });

  it('One section fails', async () => {
    await openListing({ size: DESKTOP, fetch: failing((url) => url.includes('/reviews'), 500, 'server_error') });
    expect(await screen.findByText(copy.sectionError('the reviews'))).toBeTruthy();
    expect(screen.getByTestId('listing-title')).toBeTruthy();
    expect(screen.getByTestId('primary-cta')).toBeTruthy();
  });
});

describe('Title block', () => {
  it('Animal counts', async () => {
    await openListing();
    expect(screen.getByLabelText('1 cat')).toBeTruthy();
  });

  it('No pets', async () => {
    await openListing({ scenario: 'no-pets' }, '2002');
    expect(screen.queryByLabelText(/dogs?$/)).toBeNull();
    expect(screen.queryByText(copy.sections.pets)).toBeNull();
  });
});

describe('Title block › New listing badge (add-new-listing-badge)', () => {
  it.each([
    ['phone', PHONE],
    ['desktop', DESKTOP],
  ])('New listing (%s)', async (_name, size) => {
    await openListing({ scenario: 'no-reviews', size });
    expect(screen.getByTestId('new-listing-badge')).toHaveTextContent(copy.newListing);
    expect(screen.getByLabelText(copy.newListing)).toBeTruthy();
  });

  it('Listing with reviews', async () => {
    await openListing();
    expect(screen.queryByTestId('new-listing-badge')).toBeNull();
  });
});

describe('Status banner', () => {
  it('All dates under review', async () => {
    await openListing({ scenario: 'all-assignments-reviewing' });
    expect(await screen.findByText(copy.reviewing.body('Camille'))).toBeTruthy();
  });

  it('Some dates open', async () => {
    await openListing();
    await screen.findByLabelText(/10 February/);
    expect(screen.queryByText(copy.reviewing.body('Camille'))).toBeNull();
  });
});

describe('Introduction', () => {
  it('Long introduction', async () => {
    await openListing();
    const intro = screen.getByText(/^Hi, I'm Camille!/);
    expect(intro.props.numberOfLines).toBe(4);
    expect(screen.getAllByRole('button', { name: 'Read more' }).length).toBeGreaterThan(0);
  });
});

describe('Home and location', () => {
  it('Home facts', async () => {
    await openListing({ size: DESKTOP });
    for (const fact of ['Apartment', 'City', 'Accessible by public transport']) expect(screen.getByText(fact)).toBeTruthy();
  });
});

describe('Amenities', () => {
  it('Show all', async () => {
    const r = await openListing({ size: DESKTOP });
    fireEvent.press(await screen.findByRole('button', { name: copy.showAllAmenities(16) }));
    await waitFor(() => expect(r.getPathname()).toBe('/listing/2001/amenities'));
    await screen.findByRole('heading', { name: 'Kitchen' });
    expect(screen.getAllByTestId('amenity-item')).toHaveLength(16);
  });

  it('No amenities', async () => {
    await openListing({ scenario: 'no-amenities' });
    expect(screen.queryByRole('link', { name: /Amenities/ })).toBeNull();
    setWindowSize(DESKTOP);
    expect(screen.queryByRole('heading', { name: copy.sections.amenities })).toBeNull();
  });
});

describe('Pets', () => {
  it('Open a pet', async () => {
    const r = await openListing();
    fireEvent.press(await screen.findByRole('button', { name: 'Pickle, Domestic shorthair, 3 years' }));
    await waitFor(() => expect(r.getPathname()).toBe('/listing/2001/pets/pet_2001_1'));
    expect(await screen.findByRole('heading', { name: copy.pets.about })).toBeTruthy();
    expect(await screen.findByText('Can be left alone for more than 6 hours')).toBeTruthy();
  });

  it('Age wording', async () => {
    await openListing();
    expect(await screen.findByText('Domestic shorthair · 3 years')).toBeTruthy();
  });
});

describe('Responsibilities', () => {
  it('Time alone wording', async () => {
    await openListing({ size: DESKTOP });
    expect(await screen.findByText('Can be left alone for more than 6 hours')).toBeTruthy();
  });

  it('Medication', async () => {
    await openListing({ size: DESKTOP }, '2002');
    expect(await screen.findByText('Medication needed')).toBeTruthy();
    expect(screen.getByText('Joint supplement with breakfast.')).toBeTruthy();
    expect(screen.getByText('No medication needed')).toBeTruthy();
  });
});

describe('Sit essentials', () => {
  it('Times to be agreed', async () => {
    await openListing({ size: DESKTOP });
    expect((await screen.findAllByText(/To be agreed later/)).length).toBeGreaterThan(0);
  });

  it('Guests need approval', async () => {
    await openListing({ size: DESKTOP });
    expect(await screen.findByText('Guests allowed (must be approved in advance)')).toBeTruthy();
  });

  describe('No open dates', () => {
    it('desktop section', async () => {
      await openListing({ size: DESKTOP, scenario: 'no-open-dates' });
      expect(await screen.findByText('Guests allowed (must be approved in advance)')).toBeTruthy();
      expect(screen.queryByText(copy.essentials.arrival)).toBeNull();
    });

    it('mobile row', async () => {
      const r = await openListing({ scenario: 'no-open-dates' });
      fireEvent.press(screen.getByRole('link', { name: copy.sections.sitEssentials }));
      await waitFor(() => expect(r.getPathname()).toBe('/listing/2001/sit-essentials'));
    });

    it('detail page', async () => {
      open('/listing/2001/sit-essentials', { scenario: 'no-open-dates' });
      expect(await screen.findByText('Guests allowed (must be approved in advance)')).toBeTruthy();
      expect(screen.queryByText(copy.essentials.arrival)).toBeNull();
    });
  });
});

describe('Sitter reviews', () => {
  it('Load more', async () => {
    open('/listing/2001/reviews');
    await waitFor(() => expect(screen.getAllByTestId('review-card')).toHaveLength(5));
    for (const expected of [10, 12]) {
      await act(async () => {
        fireEvent.press(screen.getByRole('button', { name: copy.showMoreReviews }));
      });
      await waitFor(() => expect(screen.getAllByTestId('review-card')).toHaveLength(expected), { timeout: 10000 });
    }
    expect(screen.queryByRole('button', { name: copy.showMoreReviews })).toBeNull();
  });

  it('No reviews', async () => {
    await openListing({ scenario: 'no-reviews' });
    expect(screen.queryByRole('link', { name: /Sitter reviews/ })).toBeNull();
    setWindowSize(DESKTOP);
    expect(screen.queryByText(/Sitter reviews/)).toBeNull();
  });
});

describe('Location map', () => {
  it('Privacy note', async () => {
    await openListing();
    expect(screen.getByText(copy.mapNote)).toBeTruthy();
    expect(screen.getByLabelText('Approximate location: Plateau-Mont-Royal, Montréal')).toBeTruthy();
  });
});

describe('Pet parent and dates', () => {
  it('Choose dates', async () => {
    await openListing({ scenario: 'full-sitter' });
    const chip = await screen.findByLabelText('10 February to 24 February 2027');
    fireEvent.press(chip);
    expect(screen.getByLabelText('10 February to 24 February 2027')).toBeSelected();
    expect(screen.getByTestId('apply-bar-dates')).toHaveTextContent('10 – 24 Feb 27');
  });

  it('No open dates', async () => {
    await openListing({ size: DESKTOP, scenario: 'full-sitter,no-open-dates' });
    expect(within(screen.getByTestId('date-chips')).getByText(copy.noDates)).toBeTruthy();
    expect(screen.queryByTestId('primary-cta')).toBeNull();
  });
});

// openspec/changes/handle-no-open-dates/specs/listing-view/spec.md
describe('No open dates', () => {
  it('Anonymous viewer, no dates', async () => {
    await openListing({ scenario: 'no-open-dates' });
    expect(screen.getAllByText(copy.noDates).length).toBeGreaterThan(0);
    expect(screen.queryByText(copy.cta.join)).toBeNull();
    expect(screen.getByTestId('notify-me')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: copy.favourite.add }));
    expect(await screen.findByText(copy.membershipPrompt.title)).toBeTruthy();
  });

  it('Partial member, no dates', async () => {
    await openListing({ scenario: 'partial-member,no-open-dates' });
    expect(screen.getAllByText(copy.noDates).length).toBeGreaterThan(0);
    expect(screen.queryByText(copy.cta.upgrade)).toBeNull();
    expect(screen.queryByText(copy.upgradeNote)).toBeNull();
  });

  it('Full sitter, no dates', async () => {
    await openListing({ scenario: 'full-sitter,no-open-dates' });
    expect(screen.queryByTestId('primary-cta')).toBeNull();
    expect(await screen.findByRole('button', { name: copy.favourite.add })).toBeTruthy();
    expect(screen.getByRole('button', { name: copy.share.label })).toBeTruthy();
    expect(screen.getByRole('link', { name: copy.report.link })).toBeTruthy();
  });

  it('Pet parent, no dates', async () => {
    await openListing({ scenario: 'own-listing,no-open-dates' });
    expect(await screen.findByText(copy.ownListingNote)).toBeTruthy();
    expect(screen.getAllByText(copy.noDates).length).toBeGreaterThan(0);
    expect(screen.queryByTestId('primary-cta')).toBeNull();
    expect(screen.queryByRole('button', { name: copy.favourite.add })).toBeNull();
    expect(screen.queryByRole('link', { name: copy.report.link })).toBeNull();
  });

  it('No banner', async () => {
    await openListing({ scenario: 'full-sitter,no-open-dates,all-assignments-reviewing' });
    expect(screen.getAllByText(copy.noDates).length).toBeGreaterThan(0);
    expect(screen.queryByText(copy.reviewing.body('Camille'))).toBeNull();
  });

  it('Dates still loading', async () => {
    open('/listing/2001', { scenario: 'full-sitter', fetch: hanging((url) => url.includes('/assignments')) });
    await screen.findByTestId('listing-title');
    // The viewer is known once the heart appears.
    await screen.findByRole('button', { name: copy.favourite.add });
    expect(screen.queryByText(copy.noDates)).toBeNull();
    expect(screen.queryByTestId('primary-cta')).toBeNull();
  });

  it('Dates fail to load', async () => {
    let fail = true;
    const flaky = (real: typeof fetch): typeof fetch => (input, init) =>
      fail && String(input).includes('/assignments')
        ? failing(() => true, 500, 'server_error')(real)(input, init)
        : real(input, init);
    open('/listing/2001', { scenario: 'full-sitter', fetch: flaky });
    const errors = await screen.findAllByText(copy.sectionError(copy.datesWhat));
    expect(errors).toHaveLength(2); // dates section and the apply bar
    expect(screen.queryByText(copy.noDates)).toBeNull();
    expect(screen.queryByTestId('primary-cta')).toBeNull();

    fail = false;
    // One "Try again" in the dates section, one in the apply bar, which renders last.
    const retries = screen.getAllByText(copy.listingError.retry);
    expect(retries).toHaveLength(2);
    fireEvent.press(retries[1]!);
    expect(await screen.findByTestId('primary-cta')).toHaveTextContent(copy.cta.apply);
  });
});

describe('Primary call to action by viewer', () => {
  it('Anonymous viewer', async () => {
    await openListing();
    fireEvent.press(screen.getByTestId('primary-cta'));
    expect(await screen.findByText(copy.membershipPrompt.title)).toBeTruthy();
    expect(screen.getByText(copy.membershipPrompt.plans)).toBeTruthy();
    expect(screen.getByText(copy.membershipPrompt.notNow)).toBeTruthy();
  });

  it('Partial member', async () => {
    await openListing({ scenario: 'partial-member' });
    await waitFor(() => expect(screen.getByTestId('primary-cta')).toHaveTextContent(copy.cta.upgrade));
    expect(screen.getByText(copy.upgradeNote)).toBeTruthy();
  });

  it('Own listing', async () => {
    await openListing({ scenario: 'own-listing' });
    expect(await screen.findByText(copy.ownListingNote)).toBeTruthy();
    expect(screen.queryByTestId('primary-cta')).toBeNull();
    expect(screen.queryByRole('button', { name: copy.favourite.add })).toBeNull();
    expect(screen.queryByRole('link', { name: copy.report.link })).toBeNull();
  });

  it('Everything under review, full sitter', async () => {
    await openListing({ scenario: 'full-sitter,all-assignments-reviewing' });
    await waitFor(() => expect(screen.getByTestId('primary-cta')).toHaveTextContent(copy.cta.paused));
    expect(screen.getByTestId('primary-cta')).toBeDisabled();
  });
});

describe('Applying', () => {
  it('No dates selected', async () => {
    await openListing({ scenario: 'full-sitter' });
    await waitFor(() => expect(screen.getByTestId('primary-cta')).toHaveTextContent(copy.cta.apply));
    fireEvent.press(screen.getByTestId('primary-cta'));
    expect(await screen.findByText(copy.chooseDatesFirst)).toBeTruthy();
    expect(screen.queryByText(copy.apply.title)).toBeNull();
  });

  it('Successful application', async () => {
    await openListing({ scenario: 'full-sitter' });
    fireEvent.press(await screen.findByLabelText('10 February to 24 February 2027'));
    fireEvent.press(screen.getByTestId('primary-cta'));
    expect(await screen.findByText(copy.apply.title)).toBeTruthy();
    fireEvent.changeText(screen.getByLabelText(copy.apply.messageLabel('Camille')), 'Hello Camille!');
    fireEvent.press(screen.getByRole('button', { name: copy.apply.send }));
    expect(await screen.findByText(copy.apply.sent)).toBeTruthy();
    await waitFor(() => expect(screen.getByTestId('primary-cta')).toHaveTextContent(copy.cta.applied));
    expect(screen.getByTestId('primary-cta')).toBeDisabled();
  });

  it('Dates became unavailable', async () => {
    await openListing({
      scenario: 'full-sitter',
      fetch: failing((url, method) => method === 'POST' && url.includes('/applications'), 409, 'not_available'),
    });
    fireEvent.press(await screen.findByLabelText('10 February to 24 February 2027'));
    fireEvent.press(screen.getByTestId('primary-cta'));
    fireEvent.press(await screen.findByRole('button', { name: copy.apply.send }));
    expect(await screen.findByText(copy.apply.unavailable)).toBeTruthy();
  });
});

describe('Favourite', () => {
  it('Save', async () => {
    await openListing({ scenario: 'full-sitter' });
    fireEvent.press(await screen.findByRole('button', { name: copy.favourite.add }));
    expect(await screen.findByRole('button', { name: copy.favourite.remove })).toBeTruthy();
  });

  it('Save fails', async () => {
    await openListing({ scenario: 'full-sitter,favourite-error' });
    fireEvent.press(await screen.findByRole('button', { name: copy.favourite.add }));
    expect(await screen.findByText(copy.favourite.failed)).toBeTruthy();
    expect(await screen.findByRole('button', { name: copy.favourite.add })).toBeTruthy();
  });

  it('Anonymous heart', async () => {
    await openListing();
    fireEvent.press(screen.getByRole('button', { name: copy.favourite.add }));
    expect(await screen.findByText(copy.membershipPrompt.title)).toBeTruthy();
  });
});

describe('Share and refer a friend', () => {
  it('Native share', async () => {
    const share = jest.spyOn(Share, 'share').mockResolvedValue({ action: 'sharedAction' });
    await openListing();
    fireEvent.press(screen.getByRole('button', { name: copy.share.label }));
    await waitFor(() => expect(share).toHaveBeenCalled());
    expect(share.mock.calls[0]![0]).toMatchObject({ title: TITLE, url: expect.stringMatching(/\/listing\/2001$/) });
    fireEvent.press(screen.getByRole('button', { name: copy.refer.action }));
    await waitFor(() => expect(share).toHaveBeenCalledTimes(2));
  });
});

describe('Report listing', () => {
  it('Reason required, then Send a report', async () => {
    await openListing();
    fireEvent.press(screen.getByRole('link', { name: copy.report.link }));
    const dialog = await screen.findByText(copy.report.title);
    expect(dialog).toBeTruthy();
    expect(screen.getByRole('button', { name: copy.report.send })).toBeDisabled();
    fireEvent.press(screen.getByRole('radio', { name: 'Possible scam, 3 of 5' }));
    const send = screen.getByRole('button', { name: copy.report.send });
    expect(send).toBeEnabled();
    fireEvent.press(send);
    expect(await screen.findByText(copy.report.thanks)).toBeTruthy();
  });
});

describe('Detail pages', () => {
  it.each([
    ['home', copy.sections.home, 'Apartment'],
    ['responsibilities', copy.sections.responsibilities, 'Around the home'],
    ['sit-essentials', copy.sections.sitEssentials, 'Guest and pet policy'],
  ])('%s page has its title, listing context and content', async (path, title, content) => {
    open(`/listing/2001/${path}`);
    expect(await screen.findByRole('heading', { name: title })).toBeTruthy();
    expect(screen.getByText(TITLE)).toBeTruthy();
    expect(await screen.findByText(content)).toBeTruthy();
  });

  it('Gallery', async () => {
    const r = await openListing();
    // Layout events don't fire under Jest; the carousel renders photos once it knows its size.
    fireEvent(screen.getByTestId('photo-carousel'), 'layout', { nativeEvent: { layout: { width: 390, height: 292 } } });
    fireEvent.press(await screen.findByRole('button', { name: /^Photo 3 of 10/ }));
    await waitFor(() => expect(r.getPathname()).toBe('/listing/2001/gallery'));
    expect(r.getSearchParams()).toMatchObject({ photo: '2' });
    expect(await screen.findByTestId('photo-viewer-position')).toHaveTextContent('3 / 10');
  });
});

void within;

describe('Notify me when dates open', () => {
  it('Ask to be notified', async () => {
    await openListing({ scenario: 'full-sitter,no-open-dates' });
    fireEvent.press(screen.getByTestId('notify-me'));
    expect(await screen.findByRole('status')).toHaveTextContent(copy.notify.confirmed);
    expect(screen.getByTestId('notify-me')).toHaveTextContent(copy.notify.requested);
    expect(screen.getByTestId('notify-me')).toBeDisabled();
  });

  it.each([
    ['phone', PHONE],
    ['desktop', DESKTOP],
  ])('Notify me on every layout (%s)', async (_name, size) => {
    await openListing({ size, scenario: 'partial-member,no-open-dates' });
    expect(screen.getAllByTestId('notify-me')).toHaveLength(1);
    expect(screen.getByTestId('notify-me')).toHaveTextContent(copy.notify.action);
  });

  it('Not for the pet parent', async () => {
    await openListing({ scenario: 'own-listing,no-open-dates' });
    expect(screen.queryByTestId('notify-me')).toBeNull();
  });

  it('Only with no open dates', async () => {
    await openListing({ scenario: 'full-sitter' });
    expect(screen.queryByTestId('notify-me')).toBeNull();
  });

  it('Only with no open dates (dates still loading)', async () => {
    open('/listing/2001', { scenario: 'full-sitter', fetch: hanging((url) => url.includes('/assignments')) });
    await screen.findByRole('button', { name: copy.favourite.add });
    expect(screen.queryByTestId('notify-me')).toBeNull();
  });

  it('Not kept after reload', async () => {
    const r = await openListing({ scenario: 'full-sitter,no-open-dates' });
    fireEvent.press(screen.getByTestId('notify-me'));
    expect(screen.getByTestId('notify-me')).toHaveTextContent(copy.notify.requested);
    r.unmount();
    await openListing({ scenario: 'full-sitter,no-open-dates' });
    expect(screen.getByTestId('notify-me')).toHaveTextContent(copy.notify.action);
  });
});
