import { Image, Platform, Pressable, View } from 'react-native';

import { Icon } from '../components/icon';
import { Text } from '../components/text';
import { cn } from '../lib/utils';
import { speciesIcon, type Species } from './animal-count-badge';

type PetCardProps = {
  name: string;
  species: Species;
  breed?: string;
  age?: string;
  photoUrl?: string | null;
  onPress?: () => void;
  className?: string;
};

/** One pet. Falls back to a species illustration when there's no photo. */
function PetCard({ name, species, breed, age, photoUrl, onPress, className }: PetCardProps) {
  const details = [breed, age].filter(Boolean).join(' · ');
  return (
    <Pressable
      role="button"
      accessibilityLabel={[name, breed, age].filter(Boolean).join(', ')}
      onPress={onPress}
      disabled={!onPress}
      className={cn(
        'w-40 gap-3 active:opacity-80',
        Platform.select({ web: 'rounded-lg outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring' }),
        className
      )}>
      <View className="aspect-square w-full overflow-hidden rounded-lg bg-accent-cta-subtle">
        {photoUrl ? (
          <Image source={{ uri: photoUrl }} className="h-full w-full" resizeMode="cover" />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Icon as={speciesIcon(species)} size={56} className="text-accent-cta" />
          </View>
        )}
      </View>
      <View className="gap-0.5">
        <Text className="font-semibold" numberOfLines={1}>
          {name}
        </Text>
        {details ? (
          <Text variant="muted" numberOfLines={1}>
            {details}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

export { PetCard };
export type { PetCardProps };
