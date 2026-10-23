import * as React from 'react';
import { View, type ViewProps } from 'react-native';

import { Text } from '../components/text';
import { cn } from '../lib/utils';

type SectionProps = ViewProps & {
  title?: string;
  /** Trailing element beside the title, e.g. a "See all" link. */
  action?: React.ReactNode;
  className?: string;
};

/** A titled block of a page, with consistent vertical rhythm. Title is a level 2 heading. */
function Section({ title, action, className, children, ...props }: SectionProps) {
  return (
    <View className={cn('gap-4 py-6', className)} {...props}>
      {(title || action) && (
        <View className="flex-row items-center justify-between gap-4">
          {title ? (
            <Text variant="h3" role="heading" aria-level={2} className="flex-1 text-heading">
              {title}
            </Text>
          ) : (
            <View />
          )}
          {action}
        </View>
      )}
      {children}
    </View>
  );
}

export { Section };
export type { SectionProps };
