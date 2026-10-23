import { BadgeCheckIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

import { Badge } from '../components/badge';
import { Icon } from '../components/icon';
import { Text } from '../components/text';
import { cn } from '../lib/utils';
import { PersonAvatar } from './person-avatar';

type OwnerCardProps = {
  name: string;
  photoUrl?: string | null;
  roleLabel?: string;
  verified?: boolean;
  /** Dates and call to action go here. */
  children?: React.ReactNode;
  /** `card` adds the surface (desktop sidebar); `plain` sits inside a page. */
  variant?: 'card' | 'plain';
  className?: string;
};

/** Pet parent summary with a slot for sit dates and the call to action. */
function OwnerCard({ name, photoUrl, roleLabel = 'Pet parent', verified, children, variant = 'card', className }: OwnerCardProps) {
  return (
    <View
      className={cn(
        'gap-5',
        variant === 'card' && 'rounded-lg border border-divider bg-card p-6 shadow-card',
        className
      )}>
      <View className="flex-row items-center gap-4">
        <PersonAvatar name={name} photoUrl={photoUrl} size="lg" verified={verified} />
        <View className="flex-1 gap-1">
          <Text className="text-lg font-semibold">{name}</Text>
          <View className="flex-row flex-wrap items-center gap-2">
            <Text variant="muted">{roleLabel}</Text>
            {verified ? (
              <Badge variant="verified" accessibilityLabel="ID verified">
                <Icon as={BadgeCheckIcon} size={12} />
                <Text>ID verified</Text>
              </Badge>
            ) : null}
          </View>
        </View>
      </View>
      {children}
    </View>
  );
}

export { OwnerCard };
export type { OwnerCardProps };
