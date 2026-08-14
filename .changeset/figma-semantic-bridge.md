---
"@artificialpoets/tokens": minor
---

The Figma vocabulary resolves in CSS now, and dark secondary text is legible

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
the stone ramp because that is what the sheet binds; the sheet's zinc-*
captions are stale (bindings win, and the captions are being fixed in
the file).

P5 holds: the light and dark payloads still declare identical token
sets, 35 each. The bridge lives on `:root` alone, where var() chains
re-resolve per subtree.
