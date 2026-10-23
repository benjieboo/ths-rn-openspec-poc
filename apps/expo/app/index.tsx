import { ActionListRow, Text } from '@ths/ui';
import { Stack, useRouter } from 'expo-router';
import { Platform, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ title: 'THS Listing POC' }} />
      <View className="flex-1 bg-background p-6">
        <View className="w-full max-w-xl gap-6 self-center">
          <View className="gap-2">
            <Text variant="h1">THS Listing POC</Text>
            <Text variant="lead">One React Native codebase for app and web, driven by OpenSpec.</Text>
            <Text variant="caption">Rendering on {Platform.OS}</Text>
          </View>
          <View>
            <ActionListRow
              label="Design system"
              description="Every @ths/ui component, from one route"
              onPress={() => router.push('/design-system')}
              last
            />
          </View>
        </View>
      </View>
    </>
  );
}
