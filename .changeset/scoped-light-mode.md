---
"@artificialpoets/tokens": minor
---

Light is scopable now, the way dark always was

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
.light[data-brand="x"] { /* light values */ }
```

`themes/neutral.css` is updated as the reference implementation. Overlays that
never scope light keep working at the document root; the shadowing only shows up
inside a scoped island.
