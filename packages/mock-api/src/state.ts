import type { ViewerScenario } from '@ths/api-contract';

type ViewerState = {
  favourites: Set<string>;
  applications: { id: string; listingId: string; assignmentId: string }[];
};

// Writes are keyed by viewer scenario so one viewer's actions never leak into another's.
const state = new Map<ViewerScenario, ViewerState>();
const reports: { id: string; listingId: string; reason: string }[] = [];
let counter = 0;

export function viewerState(viewer: ViewerScenario): ViewerState {
  let s = state.get(viewer);
  if (!s) {
    s = { favourites: new Set(), applications: [] };
    state.set(viewer, s);
  }
  return s;
}

export function nextId(prefix: string) {
  counter += 1;
  return `${prefix}_${counter}`;
}

export function addReport(report: (typeof reports)[number]) {
  reports.push(report);
}

export function resetState() {
  state.clear();
  reports.length = 0;
  counter = 0;
}
