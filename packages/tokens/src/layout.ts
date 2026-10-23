// THS breakpoints (px). Shared by the Tailwind preset and useBreakpoint().
export const breakpoints = {
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export type Breakpoint = keyof typeof breakpoints | 'base';

// Below this width the mobile (app) presentation applies, at or above it the desktop one.
export const DESKTOP_MIN_WIDTH = breakpoints.lg;

export const radius = { sm: 4, md: 8, lg: 12, xl: 16, '2xl': 24, full: 9999 } as const;

// Allowed spacing steps in px; Tailwind units 1, 2, 3, 4, 6, 8, 12, 16.
export const spacing = [0, 4, 8, 12, 16, 24, 32, 48, 64] as const;

export const elevation = {
  card: '0 2px 8px rgba(0, 0, 0, 0.08)',
  raised: '0 4px 12px rgba(0, 0, 0, 0.12)',
  overlay: '0 8px 24px rgba(0, 0, 0, 0.20)',
} as const;
