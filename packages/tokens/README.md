# @artificialpoets/tokens

> Pure-CSS design tokens. OKLCH palette, semantic roles, Tailwind v4 theme mapping, neutral default theme. Zero JS dependencies.

```bash
bun  add @artificialpoets/tokens
pnpm add @artificialpoets/tokens
npm  install @artificialpoets/tokens
yarn add @artificialpoets/tokens
```

## What's inside

- **Palette** — OKLCH-encoded base palette (26 hues × 11 shades)
- **Semantic** — role-based CSS variables (`--primary`, `--foreground`, `--muted`, `--card`, `--destructive`, `--success`, etc.) for both `:root` and `.dark`
- **Typography** — `<h1>`–`<h4>` base styles via `@layer base`. **No** `.type-h1` utility classes — HTML semantics carry the typography
- **Tailwind v4 theme mapping** — `@theme inline { }` block that registers every semantic token as a Tailwind utility (`bg-primary`, `text-foreground`, `border-border`, etc.)
- **Neutral default theme** — zinc-based, shadcn-compatible look out of the box

## Setup

Your app entry CSS (e.g. `globals.css`):

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
@import "@artificialpoets/tokens";
```

That's the whole install. Tokens are now available as Tailwind utility classes and as raw CSS variables (`var(--primary)`).

## Theme contract — six slots rebrand the whole library

Every consumer (your app, a third-party brand, anyone) overlays exactly six CSS variables in both `:root` and `.dark` to rebrand:

```css
@layer base {
  :root {
    --primary: oklch(0.488 0.243 264);
    --primary-foreground: oklch(0.985 0 0);
    --ring: oklch(0.488 0.243 264);
    --sidebar-primary: oklch(0.488 0.243 264);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-ring: oklch(0.488 0.243 264);
  }
  .dark {
    --primary: oklch(0.706 0.243 264);
    --primary-foreground: oklch(0.205 0 0);
    --ring: oklch(0.706 0.243 264);
    --sidebar-primary: oklch(0.706 0.243 264);
    --sidebar-primary-foreground: oklch(0.205 0 0);
    --sidebar-ring: oklch(0.706 0.243 264);
  }
}
```

Optionally override `--secondary` if your brand has a second accent. Everything else (surface, semantic-role, structure tokens) inherits sensible defaults.

## Subpath exports

Import only the layers you need:

| Subpath | What it is |
|---|---|
| `@artificialpoets/tokens` | Barrel — imports palette + semantic + typography + tailwind-theme in correct order |
| `@artificialpoets/tokens/palette` | Just the OKLCH palette `--color-*` |
| `@artificialpoets/tokens/semantic` | Just the semantic role tokens (`--primary`, `--foreground`, etc.) |
| `@artificialpoets/tokens/typography` | Just the heading base styles |
| `@artificialpoets/tokens/tailwind-theme` | Just the Tailwind v4 `@theme inline { }` mapping |
| `@artificialpoets/tokens/themes/neutral` | The default neutral theme (zinc-based) |

## Token categories

```
BRAND  (customizable per theme — main personalization surface)
  --primary             --primary-foreground
  --primary-text        (derived from --primary: the brand colour as
                        readable text; themes do not set it)
  --secondary           --secondary-foreground

SEMANTIC ROLE  (meaning; theme may re-tint)
  --destructive         --destructive-foreground
  --success             --success-foreground
  --warning             --warning-foreground
  --info                --info-foreground

SURFACE  (neutral; rare to override)
  --background          --foreground
  --card                --card-foreground
  --popover             --popover-foreground
  --muted               --muted-foreground
  --accent              --accent-foreground

STRUCTURE
  --border              --input              --ring              --radius
  --overlay             (the scrim behind dialogs, drawers and mobile
                        sidebars: black at 30% light, 60% dark)

CHART  (data viz; chromatic, not theme-brand)
  --chart-1 … --chart-10

FIGMA BRIDGE  (1:1 dictionary to the AP Design System sheet, kebab-cased)
  --content-primary/-secondary/-tertiary      + --content-inverse-*
  --background-primary/-secondary/-tertiary   + --background-inverse-*
  --border-primary/-secondary/-tertiary       + --border-inverse-*
  --background-hover                          --background-hover-overlay
  --border-hover-overlay                      + both *-inverse-hover-overlay
  Aliases resolve through the role tokens above (they follow mode flips
  and brand overlays for free); the tertiary text tier and the hover
  layer are net-new and carry real values. The Inverse family is
  dark-first chrome in any mode — the sidebar model, not a mode flip.

SIDEBAR  (dark-first chrome — decoupled from theme mode)
  --sidebar             --sidebar-foreground
  --sidebar-primary     --sidebar-primary-foreground
  --sidebar-accent      --sidebar-accent-foreground
  --sidebar-border      --sidebar-ring
```

`--primary-text` caps the lightness of `--primary` at 0.54 in light mode and raises it to at least 0.84 in dark mode. That gives the AP orange 5.5:1 on white and 5.5:1 on the dark card. It does not promise 4.5:1 for every brand colour. A green, teal or cyan primary (hue about 125° to 240°) keeps more luminance at the cap and can read as low as 3.8:1 on white. Dark mode clears 4.5:1 for every hue. A theme with a primary in that range should check its text contrast, and may set its own `--primary-text` after the token import. `primary-text-contrast.test.tsx` in the components package sweeps the hues.

Every token has explicit `:root` and `.dark` definitions; the design system inverts cleanly without component-level `dark:` prefixes. The chart ramp is the one exception — `--chart-1` … `--chart-10` are mode-invariant (a series keeps its color when the reader flips the theme, because that color carries the legend), so they are declared in `:root` only and inherit into dark.

## Use without Tailwind

Tokens are pure CSS. You can consume them without Tailwind via the CSS variables directly:

```css
.my-button {
  background: var(--primary);
  color: var(--primary-foreground);
}
```

Or via `@import "@artificialpoets/tokens/semantic"` if you only want the variables and not the Tailwind utility registration.

## License

Apache-2.0. See [LICENSE](../../LICENSE) at the repo root.
