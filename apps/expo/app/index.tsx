import { Button, Icon, Text } from '@ths/ui';
import { Stack } from 'expo-router';
import { PawPrintIcon } from 'lucide-react-native';
import { Platform, View } from 'react-native';

// Phase 0 smoke test: one route file, rendered natively and as a web page.
export default function HelloScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'THS Listing POC' }} />
      <View className="flex-1 items-center justify-center gap-6 bg-background p-6">
        <Icon as={PawPrintIcon} className="size-12 text-primary" />
        <View className="items-center gap-2">
          <Text variant="h3">Hello from one route file</Text>
          <Text className="text-center text-muted-foreground" testID="platform-label">
            Rendering on {Platform.OS} · components from @ths/ui
          </Text>
        </View>
        <Button onPress={() => {}}>
          <Text>Design system button</Text>
        </Button>
      </View>
    </>
  );
}
