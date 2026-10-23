import type { LucideIcon, LucideProps } from 'lucide-react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { Platform, Pressable, type PressableProps } from 'react-native';

import { Icon } from '../components/icon';
import { cn } from '../lib/utils';

const iconButtonVariants = cva(
  cn(
    'size-11 items-center justify-center rounded-full',
    Platform.select({ web: 'outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring' })
  ),
  {
    variants: {
      variant: {
        ghost: cn('active:bg-secondary', Platform.select({ web: 'hover:bg-secondary' })),
        outline: cn('border border-foreground bg-background active:bg-secondary', Platform.select({ web: 'hover:bg-secondary' })),
        // Solid backing so the icon passes contrast on any photo.
        overlay: cn('bg-background/95 shadow-card active:bg-secondary', Platform.select({ web: 'hover:bg-secondary' })),
      },
    },
    defaultVariants: { variant: 'ghost' },
  }
);

type IconButtonProps = Omit<PressableProps, 'children'> &
  VariantProps<typeof iconButtonVariants> & {
    icon: LucideIcon;
    /** Required: icon-only controls have no visible text. */
    accessibilityLabel: string;
    /** For toggles such as favourite; exposed as the pressed/selected state. */
    selected?: boolean;
    iconClassName?: string;
    iconProps?: Omit<LucideProps, 'ref'>;
    className?: string;
  };

/** Icon-only action with a 44pt target and a required accessible label. */
function IconButton({
  icon,
  variant,
  selected,
  className,
  iconClassName,
  iconProps,
  accessibilityState,
  ...props
}: IconButtonProps) {
  return (
    <Pressable
      role="button"
      accessibilityState={{ ...accessibilityState, selected }}
      aria-pressed={selected}
      className={cn(iconButtonVariants({ variant }), className)}
      {...props}>
      <Icon as={icon} className={iconClassName} {...iconProps} />
    </Pressable>
  );
}

export { IconButton, iconButtonVariants };
export type { IconButtonProps };
