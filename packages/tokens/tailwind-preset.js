const { hairlineWidth } = require('nativewind/theme');

// Keep in sync with src/layout.ts (this file is loaded by Tailwind in Node, so it can't import TS).
const screens = { xs: '375px', sm: '640px', md: '768px', lg: '1024px', xl: '1280px' };

const v = (name) => `hsl(var(--${name}))`;

// Each Poppins weight is its own font family on native, where fontWeight alone can't pick a
// face. Text in @ths/ui reads the weight class (font-semibold…) and adds the matching family.
const poppins = {
  sans: ['Poppins_400Regular'],
  'poppins-normal': ['Poppins_400Regular'],
  'poppins-medium': ['Poppins_500Medium'],
  'poppins-semibold': ['Poppins_600SemiBold'],
  'poppins-bold': ['Poppins_700Bold'],
  'poppins-extrabold': ['Poppins_800ExtraBold'],
};

/**
 * THS design tokens as a Tailwind preset. Colours resolve to the CSS variables in theme.css,
 * so theming happens there, not in component classes.
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  darkMode: 'class',
  theme: {
    screens,
    // THS type scale: [size, line height]. Overrides Tailwind's, which differs from 3xl up.
    fontSize: {
      '2xs': ['10px', '16px'],
      xs: ['12px', '19px'],
      sm: ['14px', '21px'],
      base: ['16px', '24px'],
      lg: ['18px', '27px'],
      xl: ['20px', '28px'],
      '2xl': ['24px', '32px'],
      '3xl': ['28px', '36px'],
      '4xl': ['32px', '40px'],
      '5xl': ['40px', '48px'],
      '6xl': ['48px', '58px'],
      '7xl': ['60px', '66px'],
      '8xl': ['72px', '80px'],
    },
    extend: {
      colors: {
        border: v('border'),
        input: { DEFAULT: v('input'), hover: v('input-hover'), active: v('input-active') },
        ring: v('ring'),
        background: v('background'),
        foreground: v('foreground'),
        primary: { DEFAULT: v('primary'), hover: v('primary-hover'), foreground: v('primary-foreground') },
        secondary: { DEFAULT: v('secondary'), foreground: v('secondary-foreground') },
        destructive: {
          DEFAULT: v('destructive'),
          hover: v('destructive-hover'),
          foreground: v('destructive-foreground'),
        },
        muted: { DEFAULT: v('muted'), foreground: v('muted-foreground') },
        accent: { DEFAULT: v('accent'), foreground: v('accent-foreground') },
        popover: { DEFAULT: v('popover'), foreground: v('popover-foreground') },
        card: { DEFAULT: v('card'), foreground: v('card-foreground') },

        heading: v('heading'),
        subtle: v('subtle'),
        disabled: { DEFAULT: v('disabled'), surface: v('disabled-surface') },
        divider: v('divider'),
        brand: { DEFAULT: v('brand'), surface: v('brand-surface'), subtle: v('brand-subtle') },
        'accent-cta': { DEFAULT: v('accent-cta'), hover: v('accent-cta-hover'), subtle: v('accent-cta-subtle') },
        highlight: { DEFAULT: v('highlight'), hover: v('highlight-hover') },
        success: { DEFAULT: v('success'), icon: v('success-icon'), surface: v('success-surface') },
        warning: { DEFAULT: v('warning'), icon: v('warning-icon'), surface: v('warning-surface') },
        info: { DEFAULT: v('info'), icon: v('info-icon'), surface: v('info-surface') },
        error: { DEFAULT: v('error'), icon: v('error-icon'), surface: v('error-surface') },
        overlay: 'hsl(var(--overlay))',
      },
      fontFamily: poppins,
      borderRadius: { sm: '4px', md: '8px', lg: '12px', xl: '16px', '2xl': '24px' },
      borderWidth: { hairline: hairlineWidth() },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.08)',
        raised: '0 4px 12px rgba(0, 0, 0, 0.12)',
        overlay: '0 8px 24px rgba(0, 0, 0, 0.20)',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  future: { hoverOnlyWhenSupported: true },
  plugins: [require('tailwindcss-animate')],
};
