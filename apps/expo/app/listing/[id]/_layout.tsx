import { Stack } from 'expo-router';

// Deep links to a detail page still get the listing underneath, so back leads to it.
export const unstable_settings = { initialRouteName: 'index' };

export default function ListingLayout() {
  return (
    <Stack screenOptions={{ headerTitleStyle: { fontFamily: 'Poppins_600SemiBold' }, headerBackButtonDisplayMode: 'minimal' }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="gallery" options={{ headerShown: false, presentation: 'fullScreenModal', animation: 'fade' }} />
    </Stack>
  );
}
