import { TextClassContext } from './text';
import { cn } from '../lib/utils';
import { Slot } from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Platform, View } from 'react-native';

const badgeVariants = cva(
  cn(
    'group shrink-0 flex-row items-center justify-center gap-1 self-start overflow-hidden rounded-full border border-transparent px-3 py-1',
    Platform.select({ web: 'w-fit whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3' })
  ),
  {
    variants: {
      variant: {
        default: 'bg-primary',
        secondary: 'bg-secondary',
        outline: 'border-border bg-background',
        destructive: 'bg-destructive',
        // THS pattern is inverted text on brand teal, which is 2.9:1 and fails WCAG AA at this size.
        verified: 'bg-brand-subtle',
        highlight: 'bg-highlight',
        accent: 'bg-accent-cta-subtle',
        success: 'bg-success-surface',
        warning: 'bg-warning-surface',
        info: 'bg-info-surface',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const badgeTextVariants = cva('text-xs font-semibold', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      outline: 'text-foreground',
      destructive: 'text-destructive-foreground',
      verified: 'text-foreground',
      // Lime needs dark text to pass contrast.
      highlight: 'text-foreground',
      accent: 'text-accent-cta',
      success: 'text-success',
      warning: 'text-warning',
      info: 'text-info',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type BadgeProps = React.ComponentProps<typeof View> & React.RefAttributes<View> & {
  asChild?: boolean;
} & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, asChild, ...props }: BadgeProps) {
  const Component = asChild ? Slot : View;
  return (
    <TextClassContext.Provider value={badgeTextVariants({ variant })}>
      <Component className={cn(badgeVariants({ variant }), className)} {...props} />
    </TextClassContext.Provider>
  );
}

export { Badge, badgeTextVariants, badgeVariants };
export type { BadgeProps };
