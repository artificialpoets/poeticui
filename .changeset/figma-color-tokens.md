---
"@artificialpoets/tokens": minor
---

The palette matches Figma, and the chart ramp is one shade again

The AP Design System file is the source for 14 of the 26 hues — gray, zinc,
neutral, red, orange, amber, yellow, lime, green, sky, blue, indigo, violet,
rose. Those 154 tokens now render the Figma hex exactly. The remaining 12 hues
keep their values everywhere except `-500` and `-600`, which are re-seated to
the shape the Figma ramps imply.

**What was wrong.** The ramp was generated from a fixed lightness per shade
with a per-hue chroma curve, and `-500` was picked as the most chromatic
in-gamut point for its hue. That put `-500` wherever the gamut boundary
happened to fall, so the ordering broke in two directions at once. Yellow,
lime, green, emerald, teal and cyan came out with a `-500` *lighter* than
their `-400` — lime-500 sat at L 0.888 against lime-400's 0.770. Blue,
indigo, violet, purple, pink, rose and every neutral came out with a `-500`
*darker* than their `-600`, because `-600` was pinned at a flat L 0.610 for
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
