import { BirdIcon, CatIcon, DogIcon, FishIcon, PawPrintIcon, RabbitIcon, TurtleIcon, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '../components/icon';
import { Text } from '../components/text';
import { cn } from '../lib/utils';

export type Species = 'dog' | 'cat' | 'bird' | 'fish' | 'rabbit' | 'reptile' | 'horse' | 'poultry' | 'farm' | 'other';

const SPECIES: Record<Species, { icon: LucideIcon; one: string; many: string }> = {
  dog: { icon: DogIcon, one: 'dog', many: 'dogs' },
  cat: { icon: CatIcon, one: 'cat', many: 'cats' },
  bird: { icon: BirdIcon, one: 'bird', many: 'birds' },
  fish: { icon: FishIcon, one: 'fish', many: 'fish' },
  rabbit: { icon: RabbitIcon, one: 'rabbit', many: 'rabbits' },
  reptile: { icon: TurtleIcon, one: 'reptile', many: 'reptiles' },
  horse: { icon: PawPrintIcon, one: 'horse', many: 'horses' },
  poultry: { icon: BirdIcon, one: 'chicken', many: 'chickens' },
  farm: { icon: PawPrintIcon, one: 'farm animal', many: 'farm animals' },
  other: { icon: PawPrintIcon, one: 'pet', many: 'pets' },
};

export function speciesIcon(species: Species) {
  return SPECIES[species]?.icon ?? PawPrintIcon;
}

export function speciesLabel(species: Species, count: number) {
  const s = SPECIES[species] ?? SPECIES.other;
  return `${count} ${count === 1 ? s.one : s.many}`;
}

type AnimalCountBadgeProps = { species: Species; count: number; className?: string };

/** Count plus species icon. Spoken as "2 dogs", never the icon name. */
function AnimalCountBadge({ species, count, className }: AnimalCountBadgeProps) {
  return (
    <View
      accessible
      role="img"
      accessibilityLabel={speciesLabel(species, count)}
      className={cn('flex-row items-center gap-1 rounded-full bg-secondary px-3 py-1', className)}>
      <Text variant="label">{count}</Text>
      <Icon as={speciesIcon(species)} size={16} className="text-subtle" />
    </View>
  );
}

export { AnimalCountBadge };
