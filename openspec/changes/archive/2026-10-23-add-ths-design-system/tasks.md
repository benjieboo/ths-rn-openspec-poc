# Tasks

## 1. Tokens

- [x] 1.1 Map THS semantic colours onto shadcn and THS variable names in `packages/tokens/theme.css` and `theme.ts`. Verify: showcase colour swatches match the THS values
- [x] 1.2 Tailwind preset: THS radius, elevation, breakpoints, Poppins font families. Verify: `tsc` passes and showcase renders Poppins at each weight on iOS and web
- [x] 1.3 Export breakpoint constants from `@ths/tokens`. Verify: imported by `useBreakpoint`

## 2. Primitives

- [x] 2.1 Load Poppins and hold the splash screen until loaded; force light mode. Verify: no fallback-font flash on iOS cold start
- [x] 2.2 Re-tune Text variants to the THS type scale with heading roles. Verify: showcase type ramp
- [x] 2.3 Re-tune Button (add `accent`), Badge (add THS tones), Card, Avatar, Skeleton to THS patterns. Verify: showcase
- [x] 2.4 Add IconButton with required accessible label and 44 pt target. Verify: TypeScript rejects missing label

## 3. Composites

- [x] 3.1 `useBreakpoint` hook. Verify: showcase shows the current breakpoint and switches on web resize
- [x] 3.2 Section, ReadMore, ActionListRow, StatusBanner, AnimalCountBadge
- [x] 3.3 PhotoGallery (carousel below `lg`, grid at `lg`+)
- [x] 3.4 DateRangeChip, OwnerCard, PetCard, AmenityList, ReviewCard
- [x] 3.5 MapPreview (OSM tiles, approximate circle, attribution) and StickyApplyBar
- [x] 3.6 Export everything from `@ths/ui`. Verify: `pnpm typecheck` passes

## 4. Showcase and verification

- [x] 4.1 `/design-system` route rendering every catalogue component with sample data. Verify: opens on iOS and web
- [x] 4.2 Screenshot the showcase on iOS, mobile web and desktop web. Verify: no platform differences beyond expected native controls

## Workflow follow-up

- Archive this change so `openspec/specs/design-system/spec.md` holds the contract
