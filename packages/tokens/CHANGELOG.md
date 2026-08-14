# @artificialpoets/tokens

## 0.2.0

### Minor Changes

- fb1de3a: Chart ramp: the ten brand data-viz colors, and one color per slot in both modes

  `--chart-1` … `--chart-10` now carry the brand data-viz palette. Slot order is
  unchanged, so a chart that used `--chart-3` still uses `--chart-3` — only the
  color it resolves to moves:

  | slot         | was           | now          | brand            |
  | ------------ | ------------- | ------------ | ---------------- |
  | `--chart-1`  | `blue-500`    | `blue-500`   | Blue `#2874D7`   |
  | `--chart-2`  | `rose-500`    | `rose-600`   | Rose `#DE3A74`   |
  | `--chart-3`  | `violet-500`  | `violet-600` | Violet `#906DCC` |
  | `--chart-4`  | `amber-500`   | `amber-500`  | Amber `#FF9501`  |
  | `--chart-5`  | `orange-500`  | `orange-500` | Orange `#FC4903` |
  | `--chart-6`  | `cyan-500`    | `sky-500`    | Sky `#27B4D7`    |
  | `--chart-7`  | `fuchsia-500` | `indigo-600` | Indigo `#7078D8` |
  | `--chart-8`  | `teal-500`    | `yellow-500` | Yellow `#FFC801` |
  | `--chart-9`  | `pink-500`    | `red-600`    | Red `#E8362A`    |
  | `--chart-10` | `lime-500`    | `lime-400`   | Lime `#B2BF2D`   |

  Every one of the ten already existed in the palette, so this stays a
  palette-reference change — no literals enter the semantic layer.

  The ramp is also mode-invariant now. It used to be declared twice, and the two
  copies had drifted: `--chart-3` was violet in light and amber in dark, `--chart-4`
  the reverse. A series changed color when the reader flipped the theme, which
  silently re-labels the data against its own legend. The ten are declared in
  `:root` only and inherit into dark; the `.dark` copy is gone.

  Themes may still override the ramp, in both modes or one.

- dad13db: The palette matches Figma, and the chart ramp is one shade again

  The AP Design System file is the source for 14 of the 26 hues — gray, zinc,
  neutral, red, orange, amber, yellow, lime, green, sky, blue, indigo, violet,
  rose. Those 154 tokens now render the Figma hex exactly. The remaining 12 hues
  keep their values everywhere except `-500` and `-600`, which are re-seated to
  the shape the Figma ramps imply.

  **What was wrong.** The ramp was generated from a fixed lightness per shade
  with a per-hue chroma curve, and `-500` was picked as the most chromatic
  in-gamut point for its hue. That put `-500` wherever the gamut boundary
  happened to fall, so the ordering broke in two directions at once. Yellow,
  lime, green, emerald, teal and cyan came out with a `-500` _lighter_ than
  their `-400` — lime-500 sat at L 0.888 against lime-400's 0.770. Blue,
  indigo, violet, purple, pink, rose and every neutral came out with a `-500`
  _darker_ than their `-600`, because `-600` was pinned at a flat L 0.610 for
  all 26 hues. Twenty of the 26 ramps were non-monotonic somewhere.

  After this change two inversions remain, both of them the Figma file's own:
  `indigo-600` and `indigo-700` are a thousandth of a lightness step apart, and
  `zinc-500` is fractionally darker than `zinc-600`. They are reproduced rather
  than corrected, so the tokens keep matching the design source.

  **The chart ramp.** `--chart-2`, `--chart-3`, `--chart-7` and `--chart-10`
  borrowed `-600`/`-400` to route around the broken 500s. With the 500s fixed
  they no longer need to, so all ten slots sit on `-500`. One shade across the
  ramp means a series' weight never reads as a ranking. Separation did not
  suffer: pairs closer than 0.02 OKLCH ΔE drop from four to three, and the
  minimum gap between neighbours in series order is unchanged.

  **Gamut.** No token is newly out of sRGB; the count of values that clipped on
  the way to a screen falls from 73 to 25.

  **Contrast, worth knowing before you upgrade.** The Figma 500s are lighter
  than the ones they replace, so several role tokens lose contrast against
  `--background`. White on `--info` goes 4.60:1 to 3.27:1, crossing from AA to
  large-text-only; `--destructive` as text goes 4.03:1 to 3.64:1 and
  `--muted-foreground` 3.67:1 to 3.21:1. Most of these were already under 4.5:1
  before this change, but `--info` was not. Anywhere a role colour carries small
  text on a light surface, reach for `-600` or `-700`.

- 1649c83: The Figma vocabulary resolves in CSS now, and dark secondary text is legible

  The AP Design System sheet names surfaces in a tiered vocabulary —
  contentPrimary → Secondary → Tertiary, an Inverse family, hover states
  promoted to tokens. The code names the same surfaces in roles. Neither
  maps onto the other, so a token read off the design file needed a human
  translator. This adds the dictionary: every sheet token now exists
  kebab-cased (`--content-secondary`, `--background-tertiary`,
  `--border-inverse-primary`…), aliased through the canonical role token
  wherever one exists, so the alias follows mode flips, scoped
  `.light`/`.dark` islands and brand overlays without its own mode pair.
  All of it registers in the Tailwind theme (`text-content-tertiary`,
  `bg-background-hover-overlay`).

  Two pieces are net-new, not aliases. The **tertiary text tier**
  (`--content-tertiary`, neutral-400) fills the gap between
  `--muted-foreground` and the border colour — the sheet has always had
  three text weights, the code had two. The **hover layer** —
  `--background-hover`, `--background-hover-overlay`,
  `--border-hover-overlay`, plus the inverse pair — promotes what
  `button.tsx` was hand-rolling per variant into tokens, at the sheet's
  values (black 2.5% / 20% on light, white 5% / 10% on dark).

  One value changes: dark-mode `--muted-foreground` moves from
  neutral-500 to neutral-300. The sheet's secondary text on dark surfaces
  is `#D6D2C8`; the shared value sat at ~4.4:1 against the dark
  background, this sits at ~9:1. Dark secondary text gets visibly
  lighter everywhere — that is the point.

  The Inverse family is bound as dark-first chrome in **any** mode — the
  same model as the sidebar tokens, not a mode flip. Its border tier binds
  the stone ramp because that is what the sheet binds; the sheet's zinc-\*
  captions are stale (bindings win, and the captions are being fixed in
  the file).

  P5 holds: the light and dark payloads still declare identical token
  sets, 35 each. The bridge lives on `:root` alone, where var() chains
  re-resolve per subtree.

- da3e907: Light is scopable now, the way dark always was

  `.dark` has always worked on any element, not just `<html>`: put it on a
  section and every token inside that subtree flips. Light had no counterpart.
  `:root` held the light values, `.dark` overrode them, and there was nothing for
  a nested scope to add — so a consumer could force a dark band inside a light
  page but never a light band inside a dark one.

  The light payload is now selectored `:root, .light`. Custom properties inherit,
  and a declaration on the element itself always beats a value inherited from an
  ancestor, so a `.light` subtree restores light tokens even deep inside a `.dark`
  document. Re-nesting resolves nearest-ancestor-wins for free — `.dark > .light >
.dark` is correct at every level — because that is just how inheritance works.
  No variant, no `:not()`, no selector gymnastics.

  **Principle P5, added to the theme contract:** `.light` declares exactly what
  `.dark` declares, no more. The mode-invariant tokens stay on `:root` alone —
  `--radius`, the spacing rhythm, the heading scale, and the chart ramp. Putting
  any of them on `.light` would shadow a higher-scope override for every element
  inside a light island, which is how a themed `--radius` silently reverts to
  stock. The two blocks are checked against each other: 33 tokens in each.

  **Theme overlays must mirror their light selector.** An overlay that writes its
  light values only to `:root` — or to its own `html[data-theme="x"]` root — now
  gets SHADOWED inside a `.light` island by the generic values here, because those
  reach the element by inheritance while `.light` declares on it directly. The fix
  is the shape overlays already use for dark:

  ```css
  html[data-brand="x"],
  html[data-brand="x"] .light,
  .light[data-brand="x"] {
    /* light values */
  }
  ```

  `themes/neutral.css` is updated as the reference implementation. Overlays that
  never scope light keep working at the document root; the shadowing only shows up
  inside a scoped island.
