// Component and page tests run as iOS. Web behaviour (keyboard, layout, real browser) is covered by
// Playwright in e2e/, since React Native Testing Library targets native trees, not the DOM.
const transformIgnorePatterns = [
  '/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|standard-navigation|nativewind|react-native-css-interop|@rn-primitives|lucide-react-native|@tanstack|zod))',
  '/node_modules/react-native-reanimated/plugin/',
];

const shared = {
  transformIgnorePatterns,
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    // Jest resolves the "react-native" condition to lucide's .mjs build, which Jest won't transform.
    '^lucide-react-native$': require('node:path').join(require('node:path').dirname(require.resolve('lucide-react-native')), 'lucide-react-native.js'),
  },
};

module.exports = {
  globalSetup: '<rootDir>/test/global-setup.js',
  globalTeardown: '<rootDir>/test/global-teardown.js',
  ...shared,
  preset: 'jest-expo/ios',
  // Page tests make real HTTP calls to the mock API.
  testTimeout: 20000,
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/e2e/'],
};
