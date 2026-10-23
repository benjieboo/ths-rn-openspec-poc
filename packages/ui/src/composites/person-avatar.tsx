import { Avatar, AvatarFallback, AvatarImage } from '../components/avatar';
import { Text } from '../components/text';
import { initials } from '../lib/format';
import { cn } from '../lib/utils';

const SIZE = {
  sm: { box: 'size-8', text: 'text-xs' },
  md: { box: 'size-10', text: 'text-sm' },
  lg: { box: 'size-12', text: 'text-base' },
  xl: { box: 'size-16', text: 'text-xl' },
} as const;

type PersonAvatarProps = {
  name: string;
  photoUrl?: string | null;
  size?: keyof typeof SIZE;
  /** Brand ring for verified members. */
  verified?: boolean;
  className?: string;
};

/** Circular member photo with initials fallback and optional verification ring. */
function PersonAvatar({ name, photoUrl, size = 'md', verified, className }: PersonAvatarProps) {
  const s = SIZE[size];
  return (
    <Avatar alt={name} className={cn(s.box, verified && 'border-2 border-brand', className)}>
      {photoUrl ? <AvatarImage source={{ uri: photoUrl }} /> : null}
      <AvatarFallback className="bg-brand-subtle">
        <Text className={cn('font-semibold', s.text)}>{initials(name)}</Text>
      </AvatarFallback>
    </Avatar>
  );
}

export { PersonAvatar };
export type { PersonAvatarProps };
