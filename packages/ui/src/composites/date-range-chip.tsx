import { CheckIcon, HourglassIcon } from 'lucide-react-native';
import { Platform, Pressable, View } from 'react-native';

import { Icon } from '../components/icon';
import { Text } from '../components/text';
import { formatDateRange, formatDateRangeSpoken } from '../lib/format';
import { cn } from '../lib/utils';

type DateRangeChipProps = {
  start: string;
  end: string;
  selected?: boolean;
  /** Owner is reviewing applications for these dates: shown, announced, not selectable. */
  reviewing?: boolean;
  onPress?: () => void;
  className?: string;
};

/** One sit date range, selectable. */
function DateRangeChip({ start, end, selected, reviewing, onPress, className }: DateRangeChipProps) {
  const label = formatDateRange(start, end);
  const spoken = `${formatDateRangeSpoken(start, end)}${reviewing ? ', reviewing applications' : ''}`;
  return (
    <Pressable
      role="button"
      accessibilityLabel={spoken}
      accessibilityState={{ selected: !!selected, disabled: !!reviewing }}
      aria-selected={!!selected}
      aria-disabled={!!reviewing}
      disabled={reviewing || !onPress}
      onPress={onPress}
      className={cn(
        'min-h-11 flex-row items-center gap-3 rounded-md border px-4 py-3',
        selected ? 'border-2 border-foreground bg-brand-subtle' : 'border-input bg-background',
        reviewing && 'border-divider bg-secondary',
        !reviewing && !selected && 'active:border-input-hover',
        Platform.select({ web: 'outline-none focus-visible:ring-2 focus-visible:ring-ring' }),
        !reviewing && !selected && Platform.select({ web: 'hover:border-input-hover' }),
        className
      )}>
      <View className="flex-1">
        <Text className={cn('font-semibold', reviewing && 'text-subtle')}>{label}</Text>
        {reviewing ? (
          <View className="flex-row items-center gap-1">
            <Icon as={HourglassIcon} size={12} className="text-subtle" />
            <Text variant="caption">Reviewing applications</Text>
          </View>
        ) : null}
      </View>
      {selected ? <Icon as={CheckIcon} className="text-foreground" /> : null}
    </Pressable>
  );
}

export { DateRangeChip };
export type { DateRangeChipProps };
