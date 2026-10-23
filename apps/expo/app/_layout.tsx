import '@/global.css';

import { PortalHost } from '@rn-primitives/portal';
import { NAV_THEME } from '@ths/tokens';
import { useDesignSystemFonts } from '@ths/ui';
import { Stack } from 'expo-router';
import { ThemeProvider } from 'expo-router/react-navigation';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Hold the splash screen until Poppins is ready so text never re-flows after first paint.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const fontsReady = useDesignSystemFonts();

  React.useEffect(() => {
    if (fontsReady) SplashScreen.hideAsync();
  }, [fontsReady]);

  if (!fontsReady) return null;

  return (
    <ThemeProvider value={NAV_THEME}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerTitleStyle: { fontFamily: 'Poppins_600SemiBold' } }} />
      <PortalHost />
    </ThemeProvider>
  );
}
