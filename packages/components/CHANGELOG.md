# @artificialpoets/components

## 0.3.0

### Minor Changes

- 214e61b: Button centres an icon passed without `data-slot="icon"`, and a new Slider.

  A bare `<svg>` inside a Button (a lucide icon with only `className="size-4"`)
  sat on the text baseline, so it looked raised beside the label, and it kept the
  text colour. Button now gives any direct svg child the icon slot's alignment,
  size per button size, and `--btn-icon` colour. Icons with `data-slot="icon"`
  are unchanged.

  `Slider` (forms) is a themed `<input type="range">`: a track that reads on cards
  in both themes, `--primary` fill up to the thumb, and a `--primary` thumb, for
  WebKit/Blink and Firefox. Controlled or uncontrolled, like an input.

- 43dde6a: Button gains `color="primary"`, and the default color reads in dark mode.

  `primary` draws on the theme's `--primary` and `--primary-foreground`, with
  the background deepened toward black so white text clears 4.5:1 for a
  mid-lightness brand hue in both themes.

  The default `dark/zinc` used the palette's `neutral-400` in dark mode with
  white text. This palette's neutral scale is much lighter than Tailwind's,
  so that pair read at about 1.9:1. Dark mode now inverts on `--foreground`
  and `--background`. Light mode is unchanged.

- f30ae3c: DataTable learns an optional leading "#" column.

  `rowNumbers="always"` shows each row's position in the current sort and
  filter, counting across pages, so page 3 at 25 per page starts at 51.
  `rowNumbers="auto"` shows it only when the unfiltered rows exceed
  `rowNumbersThreshold` (default 10), and keeps it while the reader filters.
  `showsRowNumbers(mode, total, threshold)` exposes the same decision for
  hand-assembled tables.

  Additive only. The default is `"never"`, so every table renders exactly as
  it did.

- 8759dce: The brand `--primary` is orange-600, so white text on it reads 4.5:1.

  White on orange-500 read 3.45:1. That is under the 4.5:1 a 14px label needs, on
  every button, banner, badge and menu highlight drawn on `--primary`. orange-600
  reads 5.1:1. `--sidebar-primary` moves with it. orange-500 stays for decoration:
  the gradients, `--sidebar-ring` and `--chart-5`.

  - The primary Button and Switch fill with `--primary` itself; the 82% mix toward
    black is gone. The Button's hover now darkens (black at 10%). A white overlay
    would pull its label to 4.4:1.
  - The dark `--ring` is `--primary-text`. orange-600 on the dark page is 2.9:1,
    under the 3:1 a focus ring needs.
  - `--primary-text` caps light lightness at 0.54, down from 0.55. The text then
    clears 4.5:1 on the `bg-primary/10` tints the chips put behind it (4.7:1).
  - Hint uses a solid `bg-primary`. White on its 80% fill read 3.8:1.

- 8bcbb70: ServiceIcon learns two more publisher marks: Ride TV and The Score.

  Both are equestrian broadcasters in the publishing world the case studies
  report on, and both are hand-curated entries rather than simple-icons
  lookups, because neither ships one. Each carries its own viewBox and
  fillRule, which the curated path already supports, and records where its
  artwork came from: the Ride TV wordmark from ridetv.com, The Score's
  stacked wordmark from the Horse Radio Network logo, traced from the light
  side because the source art is reversed.

  Additive only. Every mark that drew before draws exactly as it did.

- 74779c5: The palette emits `--color-white` and `--color-black`, and Switch gains `color="primary"` as its default.

  Switch, Checkbox, Radio and Button reference white and black only inside
  arbitrary values. Tailwind does not count that as use, so the two colors never
  reached `:root`, and every mix of them resolved to no color. A checked switch
  had no track in dark mode. `@theme static` now always emits them.

  `primary` draws the checked track from `--primary`, deepened toward black as on
  the primary Button. An off switch is an outlined track with a grey thumb, so it
  reads on light and dark cards alike. Pass `color="dark/zinc"` to keep the
  neutral look.

### Patch Changes

- 86f812c: Accessibility: selected tabs in forced colors, a readable filter trigger, an outlined slider track, and keyboard-scrollable tables.

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

- 0898b55: Add `--primary-text` (`text-primary-text`): the brand colour as readable text (AP-2222). It is derived from `--primary` with relative colour, so every theme gets it without setting it. In light mode the lightness is capped at 0.55, which makes the AP orange about orange-600 (5.3:1 on white). In dark mode it is raised to at least 0.84, which makes it about orange-200 (5.5:1 on the dark card). Black, white and the neutral theme's zinc primaries pass through unchanged. Browsers without relative colour fall back to `--primary`.

  Brand-coloured text in the components now uses it: the primary `Callout`, the `DataTableFilterChips` chip, the active `DateRangePicker` preset, the `.active-filter-chip` class and the `FanoutMap` primary spoke. Icons, fills, borders and rings stay on `primary`. The filter chip label is set apart by weight instead of 60% opacity, and the active date preset's tint drops from `/20` (dark `/30`) to `/10` (dark `/20`); both read under 4.5:1 before.

- 897c108: Follow-ups from the reviews of the AP-2222 audit (AP-2222).

  - `DateRangePicker` / `Calendar`: the days are one Tab stop (a roving tabindex) instead of one per day, so Cancel and Apply are one Tab past the calendar. Arrow keys move a day or a week, Home and End go to the Sunday and Saturday of the week, PageUp and PageDown move a month; Alt, Ctrl and Meta combinations are left to the browser. Tab lands on the range end (or the start, if the end is empty), or the day last moved to until the range changes. Dates with a time part still match their day. `aria-pressed` is true only on the range start and end; the days between add "in range" to their name. Each month is a labelled group, and the days show a `ring` focus outline.
  - `Dialog`: the backdrop (`.modal-backdrop`) uses `bg-overlay` like drawers and sidebars. It was `foreground` at 15% (light) and 50% (dark). Dark mode had a light grey veil and is now black at 60%. Light mode goes from about 15% near-black to black at 30%, so it reads about twice as dark.
  - `NavbarItem` and `SidebarItem` keep a caller's `aria-current` (for example `"step"`) when `current` is not set. `current` still sets `"page"`.
  - `Tabs` and `SegmentedTabs`: in forced colors the selected tab's focus outline is the system `Highlight` colour. `forced-color-adjust-none` had kept it in the brand colour.
  - `Table`: the scroll wrapper stays a Tab stop while it has focus, so focus is not dropped when a resize stops the table overflowing.
  - Tokens docs: `--overlay` is listed in the README. The README, `semantic.css` and the components CONTRIBUTING now say `--primary-text` was tuned on the AP orange: a green-to-cyan primary (hue about 125° to 240°) can read as low as 3.8:1 on white. A test sweeps every hue.

- ea6f24e: Tokens: a new `overlay` scrim token, readable destructive colours and a visible dark divider.

  - New `--overlay` / `bg-overlay`: the scrim behind dialogs, drawers and
    mobile sidebars. Black at 30% in light mode, 60% in dark mode.
  - Light `--muted-foreground` is `neutral-700` (about 5.4:1 on
    `--background`, was `neutral-500` at about 3.2:1). Secondary text,
    placeholders and everything tinted from it (switch track ring, disabled
    borders, breadcrumb chevrons) read darker. Dark mode is unchanged.
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

- Updated dependencies [8759dce]
- Updated dependencies [0898b55]
- Updated dependencies [897c108]
- Updated dependencies [74779c5]
- Updated dependencies [ea6f24e]
  - @artificialpoets/tokens@0.3.0

## 0.2.0

### Minor Changes

- 087be8a: ServiceIcon draws far more brands, and draws the hard ones properly.

  The simple-icons map grows to cover the services our sites actually name,
  and brands simple-icons cannot ship (AWS, Azure, OpenAI, LinkedIn, Slack,
  Salesforce, Tableau) are now hand-curated SVGs rather than a Lucide glyph
  tinted to a brand hex. Curated marks may carry their own viewBox and
  multiple paths, which real artwork often needs and a forced 24x24 square
  would distort.

  Each curated entry records where its artwork came from, and the header
  states the rule the licences do not: every one of these is trademarked
  regardless of the artwork's licence, so they identify the services we
  integrate with, never endorsement — and a mark is never redrawn by hand.

  No public API change: ServiceIcon's props and SERVICE_ICON_NAMES are
  unchanged, and the curated-icon type is internal.

- 6ce3ca5: ServiceIcon knows the publisher brands our case studies name.

  Four curated marks join the map: Equine Network's EN monogram and its
  full lockup (two presentations, so the two studies about the same
  network do not wear the same mark), the Equus Magazine wordmark, and
  the Horse & Rider wordmark. All four are traced from the artwork each
  publisher ships on its own site, recorded per entry, and all four are
  single evenodd paths — they take currentColor like every other mark,
  so ink controls recolor them the same way.

  No public API change: the new names surface through SERVICE_ICON_NAMES
  the way every curated mark already does.

### Patch Changes

- Updated dependencies [fb1de3a]
- Updated dependencies [dad13db]
- Updated dependencies [1649c83]
- Updated dependencies [da3e907]
  - @artificialpoets/tokens@0.2.0
