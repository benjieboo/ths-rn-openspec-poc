import { CheckIcon, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Button } from '../components/button';
import { Icon } from '../components/icon';
import { Text } from '../components/text';
import { cn } from '../lib/utils';

export type Amenity = { id: string; label: string; detail?: string; icon?: LucideIcon };

type AmenityListProps = {
  amenities: Amenity[];
  /** Show at most this many, with a "Show all N amenities" control. */
  limit?: number;
  onShowAll?: () => void;
  className?: string;
};

/** Home amenities, optionally limited with a show-all control. Two columns on desktop. */
function AmenityList({ amenities, limit, onShowAll, className }: AmenityListProps) {
  const visible = limit ? amenities.slice(0, limit) : amenities;
  const hidden = amenities.length - visible.length;
  return (
    <View className={cn('gap-4', className)}>
      <View role="list" className="gap-3 lg:flex-row lg:flex-wrap">
        {visible.map((a) => (
          <View key={a.id} role="listitem" className="flex-row items-center gap-3 lg:w-[48%]">
            <Icon as={a.icon ?? CheckIcon} className="text-brand" />
            <Text className="flex-1">
              {a.label}
              {a.detail ? <Text className="text-subtle"> ({a.detail})</Text> : null}
            </Text>
          </View>
        ))}
      </View>
      {hidden > 0 && onShowAll ? (
        <Button variant="outline" size="sm" onPress={onShowAll} className="self-start">
          <Text>Show all {amenities.length} amenities</Text>
        </Button>
      ) : null}
    </View>
  );
}

export { AmenityList };
export type { AmenityListProps };
