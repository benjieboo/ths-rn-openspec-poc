import type { Assignment, Viewer } from '@ths/api-contract';

import { copy } from './copy';
import { ageText, guestPolicyText, handoverText, homeFacts, locationLine, longDate, medicationText, timeAloneText } from './format';
import { callToAction, defaultSelection, viewerRole, visibleSections } from './logic';

// Table tests for listing-view spec scenarios that are pure decisions.

const a = (id: string, isReviewing = false): Assignment => ({ id, startDate: '2026-12-20', endDate: '2026-12-27', isReviewing });
const viewer = (over: Partial<Viewer>): Viewer => ({
  memberId: 'mem_1',
  firstName: 'Jo',
  membership: 'full',
  canApply: true,
  favouriteListingIds: [],
  applications: [],
  ...over,
});
const owner = { owner: { id: 'mem_owner', firstName: 'Camille', photoUrl: null, verified: true, memberSince: '2021-01-01' } };

describe('viewerRole', () => {
  it.each([
    [undefined, 'anonymous'],
    [viewer({ membership: 'anonymous', memberId: null }), 'anonymous'],
    [viewer({ membership: 'partial' }), 'partial'],
    [viewer({ membership: 'full' }), 'full'],
    [viewer({ memberId: 'mem_owner' }), 'owner'],
  ] as const)('%o → %s', (v, role) => expect(viewerRole(v, owner)).toBe(role));
});

describe('Primary call to action by viewer', () => {
  const two = [a('x'), a('y')];
  it.each([
    ['viewer still loading', { role: 'unknown', assignments: two }, { kind: 'loading' }],
    ['Anonymous viewer', { role: 'anonymous', assignments: two }, { kind: 'join', label: copy.cta.join }],
    ['Partial member', { role: 'partial', assignments: two }, { kind: 'upgrade', label: copy.cta.upgrade }],
    ['Own listing', { role: 'owner', assignments: two }, { kind: 'none', reason: 'owner' }],
    ['Everything under review, full sitter', { role: 'full', assignments: [a('x', true), a('y', true)] }, { kind: 'paused', label: copy.cta.paused, disabled: true }],
    ['No open dates', { role: 'full', assignments: [] }, { kind: 'none', reason: 'no-dates' }],
    ['No dates selected', { role: 'full', assignments: two }, { kind: 'choose-dates', label: copy.cta.apply }],
    ['dates selected', { role: 'full', assignments: two, selectedId: 'y' }, { kind: 'apply', label: copy.cta.apply }],
    ['Successful application (applied)', { role: 'full', assignments: two, selectedId: 'y', appliedIds: ['y'] }, { kind: 'applied', label: copy.cta.applied, disabled: true }],
    ['selected range under review', { role: 'full', assignments: [a('x'), a('y', true)], selectedId: 'y' }, { kind: 'choose-dates' }],
  ] as const)('%s', (_name, input, expected) => {
    expect(callToAction({ appliedIds: [], ...input } as Parameters<typeof callToAction>[0])).toMatchObject(expected);
  });
});

describe('Pet parent and dates', () => {
  it('Single available range is preselected', () => expect(defaultSelection([a('x'), a('y', true)])).toBe('x'));
  it('several ranges: nothing preselected', () => expect(defaultSelection([a('x'), a('y')])).toBeUndefined());
});

describe('Section visibility', () => {
  const base = { role: 'full' as const, petCount: 1, amenityCount: 16, reviewCount: 12, assignments: [a('x'), a('y', true)] };
  it('No pets', () => expect(visibleSections({ ...base, petCount: 0 }).pets).toBe(false));
  it('No amenities', () => expect(visibleSections({ ...base, amenityCount: 0 }).amenities).toBe(false));
  it('No reviews', () => expect(visibleSections({ ...base, reviewCount: 0 }).reviews).toBe(false));
  it('All dates under review', () => expect(visibleSections({ ...base, assignments: [a('x', true)] }).reviewingBanner).toBe(true));
  it('Some dates open', () => expect(visibleSections(base).reviewingBanner).toBe(false));
  it('sit essentials keep their place while dates load', () =>
    expect(visibleSections({ ...base, assignments: [], assignmentsLoaded: false }).sitEssentials).toBe(true));
  it('Own listing hides favourite, refer, report', () =>
    expect(visibleSections({ ...base, role: 'owner' })).toMatchObject({ favourite: false, refer: false, report: false }));
});

describe('Formatting', () => {
  it('location line', () =>
    expect(
      locationLine({ neighbourhood: 'Plateau', city: 'Montréal', region: 'QC', country: 'Canada', countryCode: 'CA', approximateCoordinates: { lat: 0, lon: 0 } })
    ).toBe('Montréal, QC, Canada'));
  it.each([[1, '1 year'], [3, '3 years'], [0.5, 'Under 1 year'], [null, undefined]] as const)('Age wording %s → %s', (age, text) =>
    expect(ageText(age)).toBe(text));
  it('Home facts', () =>
    expect(homeFacts({ description: '', type: 'apartment', setting: 'city', publicTransport: true, carIncluded: false })).toEqual([
      'Apartment',
      'City',
      'Accessible by public transport',
    ]));
  it('Time alone wording', () => expect(timeAloneText('over_6h')).toBe('Can be left alone for more than 6 hours'));
  it('Medication', () => {
    expect(medicationText({ required: true, note: 'x' })).toBe('Medication needed');
    expect(medicationText({ required: false, note: null })).toBe('No medication needed');
  });
  it('Times to be agreed', () => expect(handoverText({ time: null, note: null })).toBe('To be agreed later'));
  it('Guests need approval', () =>
    expect(guestPolicyText({ allowed: true, requiresApproval: true })).toBe('Guests allowed (must be approved in advance)'));
  it('long date', () => expect(longDate('2026-12-20')).toBe('Sun 20 Dec 26'));
});
