# @poeticui/tokens

> Pure-CSS design tokens. OKLCH palette, semantic roles, Tailwind v4 theme mapping, neutral default theme. Zero JS dependencies.

```bash
bun  add @poeticui/tokens
pnpm add @poeticui/tokens
npm  install @poeticui/tokens
yarn add @poeticui/tokens
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
@import "@poeticui/tokens";
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
| `@poeticui/tokens` | Barrel — imports palette + semantic + typography + tailwind-theme in correct order |
| `@poeticui/tokens/palette` | Just the OKLCH palette `--color-*` |
| `@poeticui/tokens/semantic` | Just the semantic role tokens (`--primary`, `--foreground`, etc.) |
| `@poeticui/tokens/typography` | Just the heading base styles |
| `@poeticui/tokens/tailwind-theme` | Just the Tailwind v4 `@theme inline { }` mapping |
| `@poeticui/tokens/themes/neutral` | The default neutral theme (zinc-based) |

## Token categories

```
BRAND  (customizable per theme — main personalization surface)
  --primary             --primary-foreground
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

CHART  (data viz; chromatic, not theme-brand)
  --chart-1 … --chart-10

SIDEBAR  (dark-first chrome — decoupled from theme mode)
  --sidebar             --sidebar-foreground
  --sidebar-primary     --sidebar-primary-foreground
  --sidebar-accent      --sidebar-accent-foreground
  --sidebar-border      --sidebar-ring
```

Every token has explicit `:root` and `.dark` definitions; the design system inverts cleanly without component-level `dark:` prefixes.

## Use without Tailwind

Tokens are pure CSS. You can consume them without Tailwind via the CSS variables directly:

```css
.my-button {
  background: var(--primary);
  color: var(--primary-foreground);
}
```

Or via `@import "@poeticui/tokens/semantic"` if you only want the variables and not the Tailwind utility registration.

## License

Apache-2.0. See [LICENSE](../../LICENSE) at the repo root.
