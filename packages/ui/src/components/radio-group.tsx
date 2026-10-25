import * as RadioGroupPrimitive from '@rn-primitives/radio-group';
import { Platform, View } from 'react-native';

import { cn } from '../lib/utils';
import { Text } from './text';

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root className={cn('gap-1', className)} {...props} />;
}

type RadioGroupItemProps = React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
  label: string;
  description?: string;
  /** Position in the group, announced on native (web assistive tech derives it from the radiogroup). */
  index?: number;
  total?: number;
};

/** One option. The whole row is the target (at least 44pt), not just the circle. */
function RadioGroupItem({ className, label, description, index, total, disabled, ...props }: RadioGroupItemProps) {
  const position = Platform.OS !== 'web' && index !== undefined && total ? `, ${index + 1} of ${total}` : '';
  return (
    <RadioGroupPrimitive.Item
      accessibilityLabel={`${label}${position}`}
      disabled={disabled}
      className={cn(
        'min-h-11 flex-row items-center gap-3 rounded-md px-2 py-2 active:bg-secondary',
        Platform.select({ web: 'outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring' }),
        disabled && 'opacity-50',
        className
      )}
      {...props}>
      <View className="size-5 items-center justify-center rounded-full border-2 border-foreground">
        <RadioGroupPrimitive.Indicator className="size-2.5 rounded-full bg-primary" />
      </View>
      <View className="flex-1">
        <Text>{label}</Text>
        {description ? <Text variant="muted">{description}</Text> : null}
      </View>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
export type { RadioGroupItemProps };
