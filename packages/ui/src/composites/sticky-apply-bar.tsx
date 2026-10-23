import * as React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '../lib/utils';

type StickyApplyBarProps = {
  /** Left side, e.g. the selected dates. */
  summary?: React.ReactNode;
  /** Right side, the call to action. */
  action: React.ReactNode;
  className?: string;
};

/**
 * Mobile call-to-action bar. Place it after the scroll view in a flex column so it stays
 * pinned at the bottom; it pads itself above the home indicator.
 */
function StickyApplyBar({ summary, action, className }: StickyApplyBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      className={cn('flex-row items-center gap-4 border-t border-divider bg-background px-4 pt-3 shadow-overlay', className)}>
      <View className="flex-1">{summary}</View>
      {action}
    </View>
  );
}

export { StickyApplyBar };
export type { StickyApplyBarProps };
