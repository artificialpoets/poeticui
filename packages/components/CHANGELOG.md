# @artificialpoets/components

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
