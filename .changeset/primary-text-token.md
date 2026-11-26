---
"@artificialpoets/tokens": minor
"@artificialpoets/components": patch
---

Add `--primary-text` (`text-primary-text`): the brand colour as readable text (AP-2222). It is derived from `--primary` with relative colour, so every theme gets it without setting it. In light mode the lightness is capped at 0.55, which makes the AP orange about orange-600 (5.3:1 on white). In dark mode it is raised to at least 0.84, which makes it about orange-200 (5.5:1 on the dark card). Black, white and the neutral theme's zinc primaries pass through unchanged. Browsers without relative colour fall back to `--primary`.

Brand-coloured text in the components now uses it: the primary `Callout`, the `DataTableFilterChips` chip, the active `DateRangePicker` preset, the `.active-filter-chip` class and the `FanoutMap` primary spoke. Icons, fills, borders and rings stay on `primary`. The filter chip label is set apart by weight instead of 60% opacity, and the active date preset's tint drops from `/20` (dark `/30`) to `/10` (dark `/20`); both read under 4.5:1 before.
