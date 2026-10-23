import { breakpoints, DESKTOP_MIN_WIDTH, type Breakpoint } from '@ths/tokens';
import { useWindowDimensions } from 'react-native';

function breakpointFor(width: number): Breakpoint {
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  if (width >= breakpoints.xs) return 'xs';
  return 'base';
}

/**
 * The design system's one responsive contract. `isDesktop` switches a component between its
 * mobile (app) presentation and its desktop web presentation. Native phones are always mobile.
 * Re-renders on window resize, so web switches without a reload.
 */
export function useBreakpoint() {
  const { width } = useWindowDimensions();
  return { width, breakpoint: breakpointFor(width), isDesktop: width >= DESKTOP_MIN_WIDTH };
}
