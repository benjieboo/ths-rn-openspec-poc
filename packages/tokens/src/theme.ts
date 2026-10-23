import { DefaultTheme, type Theme } from 'expo-router/react-navigation';

import { colors } from './colors';

// Light mode only for the POC (see openspec/specs/design-system).
export const NAV_THEME: Theme = {
  ...DefaultTheme,
  colors: {
    background: colors.background,
    border: colors.divider,
    card: colors.card,
    notification: colors.destructive,
    primary: colors.primary,
    text: colors.foreground,
  },
};
