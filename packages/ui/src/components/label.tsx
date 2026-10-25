import * as LabelPrimitive from '@rn-primitives/label';

import { cn } from '../lib/utils';
import { Text } from './text';

function Label({
  className,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  disabled,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Text>) {
  return (
    <LabelPrimitive.Root
      className={cn('flex-row items-center gap-2', disabled && 'opacity-50')}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}>
      <LabelPrimitive.Text asChild {...props}>
        <Text variant="label" className={className}>
          {props.children}
        </Text>
      </LabelPrimitive.Text>
    </LabelPrimitive.Root>
  );
}

export { Label };
