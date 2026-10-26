# Spec Delta

## MODIFIED Requirements

### Requirement: StickyApplyBar

The design system SHALL provide a bar pinned to the bottom of the screen, above the device safe area, with a summary slot and an action slot, for the mobile presentation. The action slot SHALL be optional, so the bar can carry a summary alone.

#### Scenario: Safe area
- **WHEN** a StickyApplyBar renders on a device with a home indicator
- **THEN** its content sits above the home indicator

#### Scenario: Summary only
- **WHEN** a StickyApplyBar renders with a summary and no action
- **THEN** the summary fills the bar's width, the bar keeps its height and safe-area padding, and no empty button space is left
