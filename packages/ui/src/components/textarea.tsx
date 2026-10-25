import * as React from 'react';
import { Platform, TextInput, View } from 'react-native';

import { cn } from '../lib/utils';
import { Text } from './text';

type TextareaProps = React.ComponentProps<typeof TextInput> &
  React.RefAttributes<TextInput> & {
    /** Visible label, also announced as the field's name. */
    label?: string;
    hint?: string;
    containerClassName?: string;
  };

function Textarea({
  className,
  containerClassName,
  label,
  hint,
  multiline = true,
  numberOfLines = Platform.select({ web: 3, native: 6 }), // web: initial height; native: max height
  placeholderClassName,
  ...props
}: TextareaProps) {
  const id = React.useId();
  return (
    <View className={cn('gap-2', containerClassName)}>
      {label ? (
        <Text variant="label" nativeID={id}>
          {label}
        </Text>
      ) : null}
      <TextInput
        accessibilityLabel={label}
        aria-labelledby={label ? id : undefined}
        className={cn(
          // TextInput doesn't go through Text, so it sets the Poppins family itself.
          'min-h-24 w-full rounded-md border border-input bg-background px-3 py-3 font-poppins-normal text-base text-foreground',
          Platform.select({
            web: 'resize-y outline-none placeholder:text-subtle hover:border-input-hover focus-visible:border-input-active focus-visible:ring-2 focus-visible:ring-ring',
          }),
          props.editable === false && 'opacity-50',
          className
        )}
        placeholderClassName={cn('text-subtle', placeholderClassName)}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        {...props}
      />
      {hint ? <Text variant="caption">{hint}</Text> : null}
    </View>
  );
}

export { Textarea };
export type { TextareaProps };
