import * as React from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '../components/text';
import { cn } from '../lib/utils';

type ReadMoreProps = {
  children: string;
  /** Lines shown while collapsed. */
  numberOfLines?: number;
  /**
   * Text shorter than this never shows a toggle. Truncation can't be measured reliably on
   * web, so length decides whether the toggle appears and line clamping does the collapsing.
   */
  collapseAfterChars?: number;
  className?: string;
  textClassName?: string;
};

/** Long copy collapsed to a few lines with a "Read more" / "Show less" toggle. */
function ReadMore({
  children,
  numberOfLines = 4,
  collapseAfterChars = 240,
  className,
  textClassName,
}: ReadMoreProps) {
  const [expanded, setExpanded] = React.useState(false);
  const collapsible = children.length > collapseAfterChars;

  return (
    <View className={cn('gap-2', className)}>
      <Text className={textClassName} numberOfLines={collapsible && !expanded ? numberOfLines : undefined}>
        {children}
      </Text>
      {collapsible && (
        <Pressable
          role="button"
          accessibilityState={{ expanded }}
          aria-expanded={expanded}
          onPress={() => setExpanded((value) => !value)}
          hitSlop={12}
          className="self-start">
          <Text variant="link">{expanded ? 'Show less' : 'Read more'}</Text>
        </Pressable>
      )}
    </View>
  );
}

export { ReadMore };
export type { ReadMoreProps };
