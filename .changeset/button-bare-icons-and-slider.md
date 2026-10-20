---
"@artificialpoets/components": minor
---

Button centres an icon passed without `data-slot="icon"`, and a new Slider.

A bare `<svg>` inside a Button (a lucide icon with only `className="size-4"`)
sat on the text baseline, so it looked raised beside the label, and it kept the
text colour. Button now gives any direct svg child the icon slot's alignment,
size per button size, and `--btn-icon` colour. Icons with `data-slot="icon"`
are unchanged.

`Slider` (forms) is a themed `<input type="range">`: a track that reads on cards
in both themes, `--primary` fill up to the thumb, and a `--primary` thumb, for
WebKit/Blink and Firefox. Controlled or uncontrolled, like an input.
