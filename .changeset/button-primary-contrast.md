---
"@artificialpoets/components": minor
---

Button gains `color="primary"`, and the default color reads in dark mode.

`primary` draws on the theme's `--primary` and `--primary-foreground`, with
the background deepened toward black so white text clears 4.5:1 for a
mid-lightness brand hue in both themes.

The default `dark/zinc` used the palette's `neutral-400` in dark mode with
white text. This palette's neutral scale is much lighter than Tailwind's,
so that pair read at about 1.9:1. Dark mode now inverts on `--foreground`
and `--background`. Light mode is unchanged.
