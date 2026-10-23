# Design

## Context

`@ths/ui` holds Reusables primitives (shadcn for React Native) styled by NativeWind against shadcn's CSS variables in `@ths/tokens/theme.css`. Brand values come from the THS design system guidance (semantic tokens, Poppins, radius, elevation, breakpoints).

## Goals / Non-Goals

**Goals:**
- Keep upstream Reusables components recognisable, so later `reusables add` output can be themed with minimal edits.
- One place to change a colour: `theme.css`.

**Non-Goals:**
- A full token pipeline (Style Dictionary, Figma variables sync). The CSS variables are hand-maintained for the POC.

## Decisions

**Two vocabularies, one source.** Reusables components use shadcn names (`primary`, `muted`, `border`…). We keep those names and map them onto THS semantic values, then add THS-only names (`heading`, `subtle`, `brand`, `accent-cta`, `highlight`, `success/warning/info/error`, `divider`, `overlay`). Both read the same CSS variables.
Alternative considered: rename everything to THS names. Rejected, because every future Reusables component would need rewriting.

| shadcn name | THS semantic |
|---|---|
| background / card / popover | bg/default |
| foreground | text/default |
| primary / primary-foreground | interactive/default / text/inverted |
| secondary, muted | bg/subtle |
| muted-foreground | text/subtle |
| accent (hover surface) | bg/brand-subtle |
| destructive | interactive/error |
| border | divider (gap, see spec) |
| input | border/input |
| ring | border/focus |

**Spacing stays on Tailwind's 4 px scale.** THS steps map to Tailwind units 1, 2, 3, 4, 6, 8, 12, 16 (4–64 px). Overriding the scale would silently break Reusables classes such as `size-9` and `gap-1.5`. Off-scale values (5, 7, 10, 14) are disallowed by convention in the DS spec.

**Radius overridden to THS:** `sm` 4, `md` 8 (buttons, inputs), `lg` 12 (cards), `xl` 16 (modals), `2xl` 24, `full`.

**Poppins via `@expo-google-fonts/poppins`.** On native, each weight is its own font family, so `fontWeight` alone can't pick a face. `Text` reads the last weight class in its merged className (`font-semibold`…) and appends the matching family class (`font-poppins-semibold`). Screens keep writing normal weight utilities.
Alternative tried: naming the families after the weight utilities so one class sets both. Rejected, because Tailwind's CSS ordering made it unreliable (bold and medium fell back to regular on web).

**Light mode only.** `userInterfaceStyle: light`. Dark and Inverted modes are token-ready (same variable names) but not populated.

**Breakpoint via `useBreakpoint()`.** It reads `useWindowDimensions`, so web resizes re-render. Components that change structure (PhotoGallery) use the hook; components that only change spacing use NativeWind `lg:` classes. Both read the same breakpoint values from `@ths/tokens`.

**MapPreview uses OpenStreetMap raster tiles**, enough to fill its box, around the approximate point, with an area circle overlay and attribution. This is plain `Image`, so it's identical on native and web, needs no API key and no native module.
Alternative considered: `react-native-maps`. Rejected, because it has no web support and would need a dev client rebuild.

**No new native modules.** Everything uses RN core plus libraries already in the dev client, so the iOS build from Phase 0 keeps working.

## Risks / Trade-offs

- [OSM tiles aren't meant for production traffic, and OSM blocks generic native user agents] → Native requests send an app User-Agent. Fine for a POC. Swap for a provider with a key before any real traffic.
- [ReadMore can't reliably measure truncation on web] → It uses a character threshold to decide whether to show the toggle, and line clamping to collapse.
- [Shadows render differently on Android] → RN 0.85 `boxShadow` is cross-platform on the new architecture. Verify in the showcase.
