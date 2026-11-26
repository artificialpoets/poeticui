---
"@artificialpoets/tokens": minor
"@artificialpoets/components": patch
---

Tokens: a new `overlay` scrim token, readable destructive colours and a visible dark divider.

- New `--overlay` / `bg-overlay`: the scrim behind drawers, dialogs and
  mobile sidebars. Black at 30% in light mode, 60% in dark mode.
- `--destructive` is `red-700` in light mode (about 6:1 on white, was
  `red-500` at about 3.7:1) and `red-400` in dark mode, with
  `--destructive-foreground` on `neutral-950` there so the label passes 4.5:1.
- Dark `--border-tertiary` is white at 6%. It was `neutral-900`, the same
  colour as dark `--card`, so dividers on cards vanished.
- `--font-sans` reads `--font-inter` first, so an app that self-hosts Inter
  (next/font) can supply its own face and metric-matched fallback.

Components:

- The `blue` colour of Button, Checkbox, Radio and Switch drew from the orange
  palette. It now uses blue.
- Stacked, sidebar and drawer layouts use `bg-overlay` for their scrim.
- Listbox, Fieldset errors and the Checkbox disabled check use semantic tokens
  instead of raw palette colours, so they follow dark mode and the brand.
- Accessibility: Tabs and SegmentedTabs get arrow-key, Home and End
  navigation; Breadcrumbs render an ordered list with `aria-current="page"`;
  Navbar and Sidebar items set `aria-current`; sortable DataTable headers set
  `aria-sort`; an `alert` Dialog uses `role="alertdialog"`; the date range
  picker is a Popover (a Menu trapped the keyboard) with unique input ids and
  labelled days; the Slider fills from the right in RTL and shows a focus
  ring in Firefox; the table filter popover no longer steals focus back from
  its clear buttons; SiteSwitcher renders nothing when there is no site.
