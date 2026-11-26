---
"@artificialpoets/components": patch
---

Accessibility: selected tabs in forced colors, a readable filter trigger, an outlined slider track, and keyboard-scrollable tables.

- `Tabs` and `SegmentedTabs`: the selected tab takes `SelectedItem` /
  `SelectedItemText` in forced colors. Before, its fill was its only marker,
  and forced colors drop fills.
- `DataTableFilterPopover`: the idle filter icon and the clear button use full
  `muted-foreground` (the idle icon read about 2.6:1 at `/50`). The trigger and
  its input use `outline-hidden` instead of `outline-none`, so forced colors
  still draw focus.
- `Slider`: a 1px inset edge at 55% `foreground` outlines the track at 3:1 or
  more on `card` and `background` in both modes. The empty part stays light, so
  an orange fill still stands apart from it.
- `Table`: while the table is wider than its box, the scroll wrapper is a Tab
  stop with a `ring` outline, so keyboard users in Safari can scroll to the
  hidden columns. When the caller names it (`aria-label` or
  `aria-labelledby`), it is also a `region`. A table that fits adds no Tab stop.
