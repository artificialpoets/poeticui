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

- Updated dependencies [74779c5]
  - @artificialpoets/tokens@0.2.1

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
