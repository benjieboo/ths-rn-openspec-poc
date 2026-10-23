import { TextClassContext } from './text';
import { cn } from '../lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Platform, Pressable } from 'react-native';

const buttonVariants = cva(
  cn(
    'group shrink-0 flex-row items-center justify-center gap-2 rounded-md',
    Platform.select({
      web: "outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none whitespace-nowrap [&_svg]:pointer-events-none [&_svg]:shrink-0",
    })
  ),
  {
    variants: {
      variant: {
        default: cn('bg-primary active:bg-primary-hover', Platform.select({ web: 'hover:bg-primary-hover' })),
        accent: cn(
          'bg-accent-cta active:bg-accent-cta-hover',
          Platform.select({ web: 'hover:bg-accent-cta-hover' })
        ),
        destructive: cn(
          'bg-destructive active:bg-destructive-hover',
          Platform.select({ web: 'hover:bg-destructive-hover' })
        ),
        outline: cn(
          'border border-foreground bg-background active:bg-secondary',
          Platform.select({ web: 'hover:bg-secondary' })
        ),
        secondary: cn('bg-brand-subtle active:bg-brand-subtle/70', Platform.select({ web: 'hover:bg-brand-subtle/70' })),
        ghost: cn('active:bg-secondary', Platform.select({ web: 'hover:bg-secondary' })),
        link: '',
      },
      // THS minimum touch target is 44pt, so sm is 44 tall rather than shadcn's 32.
      size: {
        default: 'h-12 px-6',
        sm: 'h-11 px-4',
        lg: 'h-14 px-8',
        icon: 'size-11',
      },
      disabled: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { variant: ['default', 'accent', 'destructive', 'outline', 'secondary'], disabled: true, className: 'border-transparent bg-disabled-surface' },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      disabled: false,
    },
  }
);

const buttonTextVariants = cva(
  cn('text-base font-semibold text-foreground', Platform.select({ web: 'pointer-events-none transition-colors' })),
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        accent: 'text-primary-foreground',
        destructive: 'text-destructive-foreground',
        outline: '',
        secondary: '',
        ghost: '',
        link: cn('underline', Platform.select({ web: 'underline-offset-4 group-hover:opacity-80' })),
      },
      size: {
        default: '',
        sm: 'text-sm',
        lg: 'text-lg',
        icon: '',
      },
      disabled: {
        true: 'text-disabled',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      disabled: false,
    },
  }
);

type ButtonProps = React.ComponentProps<typeof Pressable> &
  React.RefAttributes<typeof Pressable> &
  Omit<VariantProps<typeof buttonVariants>, 'disabled'>;

function Button({ className, variant, size, disabled, ...props }: ButtonProps) {
  const isDisabled = !!disabled;
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size, disabled: isDisabled })}>
      <Pressable
        className={cn(buttonVariants({ variant, size, disabled: isDisabled }), className)}
        role="button"
        disabled={disabled}
        aria-disabled={isDisabled}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
