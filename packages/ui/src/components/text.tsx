import { cn } from '../lib/utils';
import { Slot } from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Platform, Text as RNText, type Role } from 'react-native';

// Order matters: base, then the inherited context (e.g. a Button's text colour), then the
// variant, then className. So an explicit variant inside a Button still wins over the context.
const TEXT_BASE = cn('text-base text-foreground', Platform.select({ web: 'select-text' }));

const textVariants = cva('',
  {
    variants: {
      variant: {
        default: '',
        body: '',
        h1: 'text-4xl font-bold text-heading',
        h2: 'text-2xl font-semibold text-heading',
        h3: 'text-xl font-semibold',
        h4: 'text-lg font-medium',
        lead: 'text-lg font-normal text-subtle',
        small: 'text-sm font-normal',
        caption: 'text-xs font-normal text-subtle',
        label: 'text-sm font-semibold',
        muted: 'text-sm font-normal text-subtle',
        link: cn('font-semibold underline', Platform.select({ web: 'underline-offset-4 hover:opacity-80' })),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type TextVariantProps = VariantProps<typeof textVariants>;

type TextVariant = NonNullable<TextVariantProps['variant']>;

const ROLE: Partial<Record<TextVariant, Role>> = {
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  h4: 'heading',
};

const ARIA_LEVEL: Partial<Record<TextVariant, string>> = {
  h1: '1',
  h2: '2',
  h3: '3',
  h4: '4',
};

const TextClassContext = React.createContext<string | undefined>(undefined);

// Poppins ships one family per weight; map the weight class to its family so the right face
// renders on native as well as web. Classes must stay literal for Tailwind to generate them.
const WEIGHT_FAMILY = {
  normal: 'font-poppins-normal',
  medium: 'font-poppins-medium',
  semibold: 'font-poppins-semibold',
  bold: 'font-poppins-bold',
  extrabold: 'font-poppins-extrabold',
} as const;

function withFontFamily(className: string) {
  let weight: keyof typeof WEIGHT_FAMILY = 'normal';
  for (const token of className.split(/\s+/)) {
    const name = token.slice(5);
    if (token.startsWith('font-') && name in WEIGHT_FAMILY) weight = name as keyof typeof WEIGHT_FAMILY;
  }
  return cn(className, WEIGHT_FAMILY[weight]);
}

function Text({
  className,
  asChild = false,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof RNText> &
  React.RefAttributes<typeof RNText> &
  TextVariantProps & {
    asChild?: boolean;
  }) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot : RNText;
  return (
    <Component
      className={withFontFamily(cn(TEXT_BASE, textClass, textVariants({ variant }), className))}
      role={variant ? ROLE[variant] : undefined}
      aria-level={variant ? ARIA_LEVEL[variant] : undefined}
      {...props}
    />
  );
}

export { Text, TextClassContext };
