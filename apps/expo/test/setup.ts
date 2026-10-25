// Reanimated 4 / Worklets have no native runtime under Jest; use their published mocks.
jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// undici (the test HTTP client) reports resource timing; the RN Jest environment's performance lacks it.
const perf = globalThis.performance as Performance & { markResourceTiming?: () => void };
if (perf && typeof perf.markResourceTiming !== 'function') perf.markResourceTiming = () => {};

// Page tests make real requests to the mock API; give async queries a little more room than 1 s.
require('@testing-library/react-native').configure({ asyncUtilTimeout: 5000 });
