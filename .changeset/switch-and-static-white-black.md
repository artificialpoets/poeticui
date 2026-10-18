---
"@artificialpoets/tokens": patch
"@artificialpoets/components": minor
---

The palette emits `--color-white` and `--color-black`, and Switch gains `color="primary"` as its default.

Switch, Checkbox, Radio and Button reference white and black only inside
arbitrary values. Tailwind does not count that as use, so the two colors never
reached `:root`, and every mix of them resolved to no color. A checked switch
had no track in dark mode. `@theme static` now always emits them.

`primary` draws the checked track from `--primary`, deepened toward black as on
the primary Button. An off switch is an outlined track with a grey thumb, so it
reads on light and dark cards alike. Pass `color="dark/zinc"` to keep the
neutral look.
