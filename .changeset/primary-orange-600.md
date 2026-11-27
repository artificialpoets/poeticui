---
"@artificialpoets/tokens": minor
"@artificialpoets/components": minor
---

The brand `--primary` is orange-600, so white text on it reads 4.5:1.

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
