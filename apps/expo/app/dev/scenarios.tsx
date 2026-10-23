import {
  DATA_SCENARIOS,
  formatScenarios,
  SCENARIO_DESCRIPTIONS,
  VIEWER_SCENARIOS,
  type DataScenario,
} from '@ths/api-contract';
import { useScenario } from '@ths/api-contract/react';
import { Button, Icon, Section, Text } from '@ths/ui';
import { Stack } from 'expo-router';
import { CheckIcon } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';

// Development-only: picks the mock API scenario for every request the app makes.
export default function ScenariosScreen() {
  const [scenario, setScenario] = useScenario();

  const toggleData = (name: DataScenario) =>
    setScenario({
      ...scenario,
      data: scenario.data.includes(name) ? scenario.data.filter((d) => d !== name) : [...scenario.data, name],
    });

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ title: 'Scenarios' }} />
      <ScrollView contentContainerClassName="pb-16">
        <View className="w-full max-w-xl self-center px-4">
          <Section>
            <Text variant="h1">Scenarios</Text>
            <Text variant="muted">
              Sent as the x-scenario header on every request. Current: {formatScenarios(scenario)}
            </Text>
          </Section>

          <Section title="Viewer">
            <View role="radiogroup" className="gap-2">
              {VIEWER_SCENARIOS.map((name) => {
                const selected = scenario.viewer === name;
                return (
                  <Button
                    key={name}
                    role="radio"
                    aria-checked={selected}
                    accessibilityState={{ checked: selected }}
                    variant={selected ? 'secondary' : 'outline'}
                    className="h-auto min-h-14 justify-between py-2"
                    onPress={() => setScenario({ ...scenario, viewer: name })}>
                    <View className="flex-1">
                      <Text>{name}</Text>
                      <Text variant="caption">{SCENARIO_DESCRIPTIONS[name]}</Text>
                    </View>
                    {selected ? <Icon as={CheckIcon} /> : null}
                  </Button>
                );
              })}
            </View>
          </Section>

          <Section title="Data">
            <View className="gap-2">
              {DATA_SCENARIOS.map((name) => {
                const selected = scenario.data.includes(name);
                return (
                  <Button
                    key={name}
                    role="checkbox"
                    aria-checked={selected}
                    accessibilityState={{ checked: selected }}
                    variant={selected ? 'secondary' : 'outline'}
                    className="h-auto min-h-14 justify-between py-2"
                    onPress={() => toggleData(name)}>
                    <View className="flex-1">
                      <Text>{name}</Text>
                      <Text variant="caption">{SCENARIO_DESCRIPTIONS[name]}</Text>
                    </View>
                    {selected ? <Icon as={CheckIcon} /> : null}
                  </Button>
                );
              })}
            </View>
          </Section>

          <Button variant="ghost" onPress={() => setScenario({ viewer: 'anonymous', data: [] })}>
            <Text>Reset to anonymous</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
