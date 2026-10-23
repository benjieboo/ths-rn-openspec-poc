import { ChevronRightIcon } from 'lucide-react-native';
import { Platform, Pressable, View, type PressableProps } from 'react-native';

import { Icon } from '../components/icon';
import { Text } from '../components/text';
import { cn } from '../lib/utils';

type ActionListRowProps = Omit<PressableProps, 'children'> & {
  label: string;
  description?: string;
  /** Hide the bottom divider, e.g. on the last row of a group. */
  last?: boolean;
  className?: string;
};

/** A navigable row with a chevron. At least 56pt tall and exposed as a link. */
function ActionListRow({ label, description, last, className, ...props }: ActionListRowProps) {
  return (
    <Pressable
      role="link"
      accessibilityLabel={description ? `${label}, ${description}` : label}
      className={cn(
        'min-h-14 flex-row items-center gap-4 py-3 active:bg-secondary',
        !last && 'border-b border-divider',
        Platform.select({ web: 'outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring' }),
        className
      )}
      {...props}>
      <View className="flex-1 gap-0.5">
        <Text className="font-medium">{label}</Text>
        {description ? <Text variant="muted">{description}</Text> : null}
      </View>
      <Icon as={ChevronRightIcon} className="text-subtle" />
    </Pressable>
  );
}

export { ActionListRow };
export type { ActionListRowProps };
