import type { HomeDetails, Location, Pet, Responsibilities, SitEssentials } from '@ths/api-contract';

import { copy } from './copy';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "Montréal, QC, Canada" */
export function locationLine(location: Location) {
  return [location.city, location.region, location.country].filter(Boolean).join(', ');
}

/** "Plateau-Mont-Royal, Montréal": for the map's spoken label. */
export function placeName(location: Location) {
  return [location.neighbourhood, location.city].filter(Boolean).join(', ');
}

/** "1 year", "3 years", "Under 1 year", or undefined when unknown. */
export function ageText(ageYears: Pet['ageYears']) {
  if (ageYears === null || ageYears === undefined) return undefined;
  if (ageYears < 1) return 'Under 1 year';
  const years = Math.floor(ageYears);
  return `${years} ${years === 1 ? 'year' : 'years'}`;
}

export function homeFacts(home: HomeDetails) {
  return [
    copy.home.type[home.type],
    copy.home.setting[home.setting],
    home.publicTransport ? copy.home.publicTransport : null,
    home.carIncluded ? copy.home.carIncluded : null,
  ].filter((f) => f !== null) as string[];
}

export function timeAloneText(value: Responsibilities['pets'][number]['timeAlone']) {
  return copy.timeAlone[value];
}

export function medicationText(medication: Responsibilities['pets'][number]['medication']) {
  return medication.required ? copy.medication.needed : copy.medication.none;
}

/** "Sun 20 Dec 26" from "2026-12-20". */
export function longDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y!, m! - 1, d!));
  return `${DAYS[date.getUTCDay()]} ${d} ${MONTHS[m! - 1]} ${String(y).slice(2)}`;
}

export function handoverText(handover: SitEssentials['dates'][number]['arrival']) {
  return handover.time ?? handover.note ?? copy.essentials.toBeAgreed;
}

export function guestPolicyText(guests: SitEssentials['guests']) {
  if (!guests.allowed) return copy.essentials.noGuests;
  return guests.requiresApproval ? copy.essentials.guestsWithApproval : copy.essentials.guestsAllowed;
}

export function sitterPetsText(allowed: boolean) {
  return allowed ? copy.essentials.sitterPets : copy.essentials.noSitterPets;
}
