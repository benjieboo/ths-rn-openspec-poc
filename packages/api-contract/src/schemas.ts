import { z } from 'zod';

// Calendar dates (no time zone): "2026-12-20".
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');

export const Species = z.enum(['dog', 'cat', 'bird', 'fish', 'rabbit', 'reptile', 'horse', 'poultry', 'farm', 'other']);
export type Species = z.infer<typeof Species>;

export const ApiErrorBody = z.object({
  error: z.object({
    code: z.enum([
      'not_found',
      'invalid_request',
      'invalid_scenario',
      'unauthenticated',
      'membership_required',
      'own_listing',
      'not_available',
      'already_applied',
      'server_error',
    ]),
    message: z.string(),
  }),
});
export type ApiErrorBody = z.infer<typeof ApiErrorBody>;
export type ApiErrorCode = ApiErrorBody['error']['code'];

// Approximate only: never a street address or exact coordinates.
export const Location = z.object({
  neighbourhood: z.string().nullable(),
  city: z.string(),
  region: z.string(),
  country: z.string(),
  countryCode: z.string().length(2),
  approximateCoordinates: z.object({ lat: z.number(), lon: z.number() }),
});
export type Location = z.infer<typeof Location>;

export const Photo = z.object({ id: z.string(), url: z.url(), alt: z.string().nullable() });
export type Photo = z.infer<typeof Photo>;

export const OwnerSummary = z.object({
  id: z.string(),
  firstName: z.string(),
  photoUrl: z.url().nullable(),
  verified: z.boolean(),
  memberSince: isoDate,
});
export type OwnerSummary = z.infer<typeof OwnerSummary>;

export const AnimalCount = z.object({ species: Species, count: z.number().int().positive() });
export type AnimalCount = z.infer<typeof AnimalCount>;

export const HomeDetails = z.object({
  description: z.string(),
  type: z.enum(['apartment', 'house', 'cottage', 'farm', 'other']),
  setting: z.enum(['city', 'town', 'countryside', 'beach', 'mountain']),
  publicTransport: z.boolean(),
  carIncluded: z.boolean(),
});
export type HomeDetails = z.infer<typeof HomeDetails>;

export const Listing = z.object({
  id: z.string(),
  title: z.string(),
  introduction: z.string(),
  location: Location,
  photos: z.array(Photo).min(1),
  home: HomeDetails,
  owner: OwnerSummary,
  animals: z.array(AnimalCount),
  reviewCount: z.number().int().nonnegative(),
  amenityCount: z.number().int().nonnegative(),
});
export type Listing = z.infer<typeof Listing>;

export const Assignment = z.object({
  id: z.string(),
  startDate: isoDate,
  endDate: isoDate,
  /** The owner is reviewing applications; new applications aren't accepted. */
  isReviewing: z.boolean(),
});
export type Assignment = z.infer<typeof Assignment>;
export const AssignmentList = z.object({ items: z.array(Assignment) });
export type AssignmentList = z.infer<typeof AssignmentList>;

export const Pet = z.object({
  id: z.string(),
  name: z.string(),
  species: Species,
  breed: z.string().nullable(),
  ageYears: z.number().nonnegative().nullable(),
  photoUrl: z.url().nullable(),
  about: z.string().nullable(),
});
export type Pet = z.infer<typeof Pet>;
export const PetList = z.object({ items: z.array(Pet) });
export type PetList = z.infer<typeof PetList>;

export const Amenity = z.object({ id: z.string(), label: z.string(), detail: z.string().nullable() });
export type Amenity = z.infer<typeof Amenity>;
export const AmenityCategory = z.object({ id: z.string(), name: z.string(), amenities: z.array(Amenity) });
export const Amenities = z.object({
  total: z.number().int().nonnegative(),
  /** Ids of the amenities to show first, in order. */
  highlights: z.array(z.string()),
  categories: z.array(AmenityCategory),
});
export type Amenities = z.infer<typeof Amenities>;

export const TimeAlone = z.enum(['none', 'up_to_2h', 'up_to_4h', 'up_to_6h', 'over_6h']);
export const PetResponsibility = z.object({
  petId: z.string(),
  petName: z.string(),
  timeAlone: TimeAlone,
  medication: z.object({ required: z.boolean(), note: z.string().nullable() }),
  notes: z.string().nullable(),
});
export const HomeResponsibility = z.object({
  area: z.enum(['pets', 'plants', 'home', 'garden', 'other']),
  description: z.string(),
});
export const Responsibilities = z.object({
  pets: z.array(PetResponsibility),
  home: z.array(HomeResponsibility),
});
export type Responsibilities = z.infer<typeof Responsibilities>;

const HandoverTime = z.object({
  /** "14:00", or null when it's still to be agreed. */
  time: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
  note: z.string().nullable(),
});
export const SitEssentials = z.object({
  dates: z.array(z.object({ assignmentId: z.string(), arrival: HandoverTime, departure: HandoverTime })),
  guests: z.object({ allowed: z.boolean(), requiresApproval: z.boolean() }),
  sitterPetsAllowed: z.boolean(),
});
export type SitEssentials = z.infer<typeof SitEssentials>;

export const Review = z.object({
  id: z.string(),
  reviewer: z.object({ firstName: z.string(), photoUrl: z.url().nullable() }),
  text: z.string(),
  stayStart: isoDate,
  stayEnd: isoDate,
});
export type Review = z.infer<typeof Review>;
export const ReviewPage = z.object({
  items: z.array(Review),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});
export type ReviewPage = z.infer<typeof ReviewPage>;

export const MembershipState = z.enum(['anonymous', 'partial', 'full']);
export type MembershipState = z.infer<typeof MembershipState>;
export const Viewer = z.object({
  memberId: z.string().nullable(),
  firstName: z.string().nullable(),
  membership: MembershipState,
  canApply: z.boolean(),
  favouriteListingIds: z.array(z.string()),
  applications: z.array(z.object({ id: z.string(), listingId: z.string(), assignmentId: z.string() })),
});
export type Viewer = z.infer<typeof Viewer>;

export const FavouriteState = z.object({ listingId: z.string(), isFavourite: z.boolean() });
export type FavouriteState = z.infer<typeof FavouriteState>;

export const ApplicationRequest = z.object({
  assignmentId: z.string(),
  message: z.string().max(2000).optional(),
});
export type ApplicationRequest = z.infer<typeof ApplicationRequest>;
export const Application = z.object({
  id: z.string(),
  listingId: z.string(),
  assignmentId: z.string(),
  status: z.literal('pending'),
});
export type Application = z.infer<typeof Application>;

export const ReportReason = z.enum(['inaccurate', 'inappropriate', 'scam', 'unavailable', 'other']);
export type ReportReason = z.infer<typeof ReportReason>;
export const ReportRequest = z.object({ reason: ReportReason, details: z.string().max(2000).optional() });
export type ReportRequest = z.infer<typeof ReportRequest>;
export const ReportReceipt = z.object({ id: z.string() });
export type ReportReceipt = z.infer<typeof ReportReceipt>;
