import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/poppins';

/**
 * Loads Poppins at every weight the design system allows (never below 400).
 * Family names match the Tailwind preset's fontFamily keys. Returns true once loaded.
 */
export function useDesignSystemFonts() {
  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  // On a load error, render with the system font rather than blocking the app.
  return loaded || !!error;
}
