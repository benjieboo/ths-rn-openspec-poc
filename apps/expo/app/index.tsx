import { formatScenarios } from '@ths/api-contract';
import { useApi } from '@ths/api-contract/react';
import { ActionListRow, Text } from '@ths/ui';
import { Stack, useRouter } from 'expo-router';
import { Platform, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { scenario } = useApi();
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
              label="Listing: Sunny Plateau flat"
              description="Montréal · cat · 12 reviews"
              onPress={() => router.push({ pathname: '/listing/[id]', params: { id: '2001' } })}
            />
            <ActionListRow
              label="Listing: Garden house near the coast"
              description="Cascais · 2 dogs · one open date"
              onPress={() => router.push({ pathname: '/listing/[id]', params: { id: '2002' } })}
            />
            <ActionListRow
              label="Design system"
              description="Every @ths/ui component, from one route"
              onPress={() => router.push('/design-system')}
            />
            <ActionListRow
              label="Scenarios"
              description={`Mock API: ${formatScenarios(scenario)}`}
              onPress={() => router.push('/dev/scenarios')}
            />
            <ActionListRow
              label="API check"
              description="Every endpoint with the current scenario"
              onPress={() => router.push('/dev/api')}
              last
            />
          </View>
        </View>
      </View>
    </>
  );
}
