// Every user-facing string the listing-view spec quotes lives here, so tests assert against
// the same constants and wording changes happen in one place.
import type { ReportReason } from '@ths/api-contract';

export const copy = {
  brand: 'TrustedHousesitters',

  sections: {
    introduction: 'Introduction',
    home: 'Home & location',
    amenities: 'Amenities',
    pets: 'Meet the pets',
    responsibilities: 'Responsibilities',
    sitEssentials: 'Sit essentials',
    reviews: (n: number) => `Sitter reviews (${n})`,
    reviewsTitle: 'Sitter reviews',
    location: 'Location',
    sitterNeeded: 'Sitter needed',
    photos: 'Photos',
  },

  newListing: 'New listing',

  loading: 'Loading listing',

  listingError: {
    title: "We couldn't load this listing",
    body: 'Check your connection and try again.',
    retry: 'Try again',
  },
  sectionError: (what: string) => `We couldn't load ${what}.`,
  notFound: {
    title: "We can't find this listing",
    body: "It may have been taken down, or the link isn't quite right. There are plenty more sits to explore.",
    action: 'Back to home',
  },

  reviewing: {
    title: 'Reviewing applications',
    body: (ownerName: string) => `${ownerName} is reviewing applications for all of their dates.`,
  },

  showAllAmenities: (n: number) => `Show all ${n} amenities`,
  amenityCount: (n: number) => `${n} amenities`,
  showMoreReviews: 'Show more reviews',
  mapNote: 'Approximate location. The exact address is shared once a sit is confirmed.',
  mapLabel: (place: string) => `Approximate location: ${place}`,
  noDates: 'No dates available right now',
  datesWhat: 'the dates',
  notify: {
    action: 'Notify me',
    requested: "You'll be notified",
    confirmed: "We'll let you know when dates open",
  },

  cta: {
    join: 'Join now to apply',
    upgrade: 'Upgrade to apply',
    apply: 'Apply',
    applied: 'Applied',
    paused: 'Applications paused',
  },
  upgradeNote: "Your current membership doesn't include applying to sits.",
  ownListingNote: 'This is your listing',
  chooseDatesFirst: 'Choose your dates first',

  membershipPrompt: {
    title: 'Join to apply',
    body: 'Members can apply to sits like this one, save favourites and get to know pet parents before they travel.',
    plans: 'See membership plans',
    notNow: 'Not now',
  },

  apply: {
    title: 'Apply to this sit',
    body: (ownerName: string, dates: string) => `You're applying for ${dates}. Add a note for ${ownerName} if you'd like.`,
    messageLabel: (ownerName: string) => `Message to ${ownerName} (optional)`,
    send: 'Send application',
    cancel: 'Cancel',
    sent: 'Application sent',
    unavailable: 'These dates are no longer taking applications',
    alreadyApplied: "You've already applied for these dates",
    failed: "We couldn't send your application. Please try again.",
  },

  favourite: {
    add: 'Add to favourites',
    remove: 'Remove from favourites',
    failed: "We couldn't update your favourites. Please try again.",
  },

  share: {
    label: 'Share listing',
    copied: 'Link copied',
  },
  back: 'Back',

  refer: {
    title: "Know someone who'd love this sit?",
    action: 'Share this listing',
  },

  report: {
    link: 'Report listing',
    title: 'Report this listing',
    description: 'Tell us what looks wrong. Reports are confidential.',
    reasons: {
      inaccurate: 'Inaccurate information',
      inappropriate: 'Inappropriate content',
      scam: 'Possible scam',
      unavailable: 'No longer available',
      other: 'Other',
    } satisfies Record<ReportReason, string>,
    details: 'Details (optional)',
    send: 'Send report',
    cancel: 'Cancel',
    thanks: "Thanks for letting us know. We'll take a look.",
    failed: "We couldn't send your report. Please try again.",
  },

  home: {
    type: { apartment: 'Apartment', house: 'House', cottage: 'Cottage', farm: 'Farm', other: 'Home' },
    setting: { city: 'City', town: 'Town', countryside: 'Countryside', beach: 'Beach', mountain: 'Mountains' },
    publicTransport: 'Accessible by public transport',
    carIncluded: 'Car included',
  },

  timeAlone: {
    none: "Can't be left alone",
    up_to_2h: 'Can be left alone for up to 2 hours',
    up_to_4h: 'Can be left alone for up to 4 hours',
    up_to_6h: 'Can be left alone for up to 6 hours',
    over_6h: 'Can be left alone for more than 6 hours',
  },
  medication: { needed: 'Medication needed', none: 'No medication needed' },
  homeTasks: 'Around the home',
  homeTaskArea: { pets: 'Pets', plants: 'Plants', home: 'Home', garden: 'Garden', other: 'Other' },

  essentials: {
    arrival: 'Arrival',
    departure: 'Departure',
    toBeAgreed: 'To be agreed later',
    guestPolicy: 'Guest and pet policy',
    guestsWithApproval: 'Guests allowed (must be approved in advance)',
    guestsAllowed: 'Guests allowed',
    noGuests: 'No guests',
    sitterPets: 'Sitters can bring pets',
    noSitterPets: 'Sitters cannot bring pets',
  },

  pets: {
    about: 'About',
    care: 'Care',
  },

  petParent: 'Pet parent',

  pageTitle: (listingTitle: string, city: string) => `${listingTitle} in ${city} | TrustedHousesitters`,
  detailPageTitle: (page: string, listingTitle: string) => `${page} · ${listingTitle} | TrustedHousesitters`,
} as const;
