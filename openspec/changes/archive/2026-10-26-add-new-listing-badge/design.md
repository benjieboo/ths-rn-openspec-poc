# Design

## Context

`TitleBlock` (features/listing/sections.tsx) is shared by the mobile and desktop presentations. The listing already carries `reviewCount`.

## Decisions

**Render in `TitleBlock`, next to the animal count badges.** One place, so it appears on every layout and platform without layout-specific code.

**Use the existing `Badge` `highlight` variant.** The design-system spec reserves highlight (lime) for personality moments like "new" badges, and its text already passes contrast (9.3:1), so there's no design system change.

## Risks / Trade-offs

- [A listing whose reviews fail to load could be mistaken for new] → The badge reads `reviewCount` from the listing summary, not the reviews request, so a reviews failure can't trigger it.
