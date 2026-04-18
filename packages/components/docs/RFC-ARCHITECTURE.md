# RFC: Phase 2 — Poetic UI abstraction + `@ap/brand` split

> Status: **Mostly shipped (7 of 9 steps landed; Storybook partial, /design-system deletion pending).**
> Author: @matias
> Linear: "Poetic UI Phase 2: Public-Ready Architecture" project (DES-38 → DES-49)
> Last updated: 2026-04-18

### Step status

| Step | Issue | Status |
|------|-------|--------|
| 1. Rename `@ap/tokens` → `@poeticui/tokens` | DES-39 | ✅ Done (`c05f8bad`) |
| 2. Rename `@ap/ui` → `@poeticui/components` + dir rename | DES-40 | ✅ Done (`9190b36f`) |
| 3. Extract `@ap/brand` | DES-43 | ✅ Done (`6c4ddb2c`) |
| 4. Add `--info` + formalize theme contract | DES-42 | ✅ Done (`0dbb658f`) |
| 5. Typography cleanup | DES-41 | ✅ Done (`813bdb99`) |
| 6a. Storybook scaffold | DES-44 | ⚠️ Partial (`265d02e3`) — config + smoke story in place, boot deferred pending Tailwind-v4/Vite interop fix |
| 6b. Port stories | DES-45 | ⏳ Blocked on 6a boot |
| 6c. Delete `/design-system` page | DES-46 | ⏳ Blocked on 6b |
| 7. Enforcement + CI | DES-47 | ✅ Done (`c09a45ba`) |
| 8. Documentation sweep | DES-48 | ✅ In progress |
| 9. Verification | — | Final verification bundled with the PR |

Follow-ups filed during the work:
- **DES-49** — Decouple `Link` + `Avatar` from `next/*` (surfaced by the DES-47 ESLint rule; currently allowlisted with a FIXME).

## Summary

Phase 1 (DES-16 → DES-33) built the foundation: semantic tokens, CVA pattern, scrubbed raw colors, `AppShell` extraction, CONTRIBUTING guide. Phase 2 takes the pieces we have and reshapes them into a public-ready design system.

This RFC proposes the end state and the path to get there. Four big moves:

1. **Rename and split packages** — `@ap/tokens` → `@poeticui/tokens`, `@ap/ui` → `@poeticui/components`, plus a new `@ap/brand` that carries every AP-specific piece (AppShell, brand badge, account menu, org switcher).
2. **Codify design principles** — HTML-first semantics, no utility classes that duplicate HTML meaning (kill `.type-h1`), primary/secondary/semantic-role vocabulary, full light + dark support as a first-class contract.
3. **Replace `/design-system` with Storybook** — the bespoke showcase page disappears; Storybook becomes the single source of truth for component documentation, variant matrices, a11y notes, and eventually the public docs surface.
4. **Formalize the customization model** — anyone (AP, PoeHost, a future open-source consumer) layers their brand on top of `@poeticui/components` by shipping a thin theme + overlay package. `@ap/brand` is the reference implementation.

The goal is to end Phase 2 with **Poetic UI usable standalone** (neutral defaults, clean primary/secondary customization, Storybook docs) while AP keeps its unique chrome through `@ap/brand`.

---

## Guiding principles

These principles are the "why" behind every decision below. They're deliberately short and testable so contributors can cite them in code review.

### P1. HTML semantics come first

A component expresses its role through the HTML element it renders, not through a utility class layered on top.

- ✅ `<h1>` with a base-layer style. Any page that writes `<h1>` gets the intended visual automatically.
- ❌ `<div className="type-h1">`. Duplicates HTML semantics in a CSS class; readers and screen readers disagree.

**Concrete rule:** we remove `.type-h1` / `.type-h2` / `.type-h3` / `.type-h4` from `@poeticui/tokens`. The `@layer base` rules on the HTML elements stay. If a page needs heading-sized text on a non-heading element (rare), it uses the token directly: `style={{ fontSize: 'var(--heading-1-size)' }}`.

### P2. Semantic tokens over palette tokens

Consumers name **roles**, not **colors**. `bg-primary`, not `bg-orange-500`. `text-destructive`, not `text-red-600`.

This is already enforced via the ESLint rule (DES-17). The RFC codifies it as a first principle.

### P3. Neutral by default, customizable per brand

`@poeticui/components` ships with a neutral theme that looks good out of the box. Any brand — AP, a consumer, an external user — supplies a theme overlay that overrides primary/secondary and optionally any semantic role. No forks, no CSS!important, no monkey-patching.

### P4. Full light + dark as a contract

Every semantic token has a `:root` value and a `.dark` value. Components that reference those tokens automatically invert with the theme. No component ships a hardcoded `dark:` variant because the token already carries that information.

### P5. Primary / Secondary / Semantic role

Three distinct categories of color:

- **Brand** — `--primary` (required), `--secondary` (required, defaults to neutral for low-emphasis actions). Customizable per theme.
- **Semantic role** — `--destructive`, `--success`, `--warning`, `--info` (new). Meaning, not brand. Theme may re-tint but should keep the intent.
- **Surface** — `--background`, `--card`, `--popover`, `--muted`, `--accent`. Neutral surfaces. Theme rarely overrides.

### P6. LLM-friendly: save context, clear reading

- Predictable file layout (one component per file, mirror tests, barrel per category).
- Predictable class names (`bg-primary`, `text-muted-foreground` — role + slot — not `.my-card-title-emphasis-variant-b`).
- No private naming schemes. Every class a reader encounters either comes from Tailwind, our semantic tokens, or the CONTRIBUTING map.
- Components are small and composable, so an agent can load 1–2 files instead of skimming a 400-LOC monolith.

### P7. No utility class that duplicates HTML

This is P1's general form. Applied broadly:

| Role | HTML element | DON'T also ship a class |
|------|--------------|-------------------------|
| Heading 1 | `<h1>` | ~~`.type-h1`~~ |
| Heading 2 | `<h2>` | ~~`.type-h2`~~ |
| Heading 3 | `<h3>` | ~~`.type-h3`~~ |
| Heading 4 | `<h4>` | ~~`.type-h4`~~ |
| Inline code | `<code>` | ~~`.type-code`~~ |
| Emphasis | `<strong>` / `<em>` | — |
| Paragraph | `<p>` | ~~`.type-body`~~ |

If the styling absolutely has to apply to a non-standard element (e.g. "card heading styled like h3 but needs to be a span for layout"), use the raw token in `style={{ fontSize: 'var(--heading-3-size)', ... }}`. It's uglier on purpose — makes the mismatch visible.

---

## Current state (mid-Phase 1)

```
packages/
├── tokens/        @ap/tokens       pure CSS; neutral palette + semantic vars + theme overlays
│   └── src/
│       ├── palette.css             OKLCH palette (26 × 11)
│       ├── semantic.css            --foreground, --primary, --muted, …
│       ├── typography.css          h1–h4 base rules + .type-h1…h4 utilities  ← to remove
│       ├── tailwind-theme.css      CSS var → Tailwind utility names
│       ├── index.css               barrel import
│       └── themes/
│           ├── platform.css        orange primary (AP)
│           ├── poehost.css         blue primary
│           └── intranet.css        amber primary
│
└── ui/            @ap/ui           ~50 React components
    ├── src/
    │   ├── core/                   Button, Link
    │   ├── data-display/           Avatar, Badge, Card, Skeleton, Stat, Table, ImageWithFallback
    │   ├── feedback/               Alert, Dialog, Hint
    │   ├── forms/                  Fieldset family, Input, Select, Combobox, Checkbox, Switch, Radio
    │   ├── layout/                 ⚠️  MIXED neutral + brand
    │   │   ├── sidebar-layout           ✓ neutral
    │   │   ├── stacked-layout           ✓ neutral
    │   │   ├── page-header              ✓ neutral
    │   │   ├── drawer-shell             ✓ neutral
    │   │   ├── app-shell                🟠 AP-flavored (brand badge + AP footer chip shape)
    │   │   ├── account-dropdown-menu    🟠 AP-flavored ("Account Settings / Sign out")
    │   │   ├── sidebar-brand-badge      🟠 AP-flavored (2-letter primary square convention)
    │   │   ├── sidebar-user-chip        🟠 AP-flavored (avatar + name + subtitle + ChevronUp)
    │   │   └── navbar-avatar-dropdown   🟠 AP-flavored
    │   ├── misc/                   Dropdown, Popover
    │   ├── navigation/             Navbar, Sidebar, Breadcrumbs, Pagination, Tabs, SegmentedTabs
    │   └── tables/                 DataTable family + TablePaginationFooter
    ├── CONTRIBUTING.md
    └── docs/RFC-ARCHITECTURE.md    ← this file
```

**Dashboard consumes both directly.** `apps/dashboard/` imports from `@ap/ui/layout` for both neutral primitives (`SidebarLayout`) and brand-flavored ones (`AppShell`, `SidebarBrandBadge`). There's also a `/design-system` showcase page (`apps/dashboard/app/design-system/`) — we're going to delete it in favor of Storybook.

---

## Target state

### Package structure

```
packages/
├── tokens/                 @poeticui/tokens        (was @ap/tokens — renamed)
│   └── src/
│       ├── palette.css
│       ├── semantic.css    light + dark for every role
│       ├── typography.css  h1–h4 base rules only; no utility aliases
│       ├── tailwind-theme.css
│       ├── index.css
│       └── themes/
│           └── neutral.css  ← NEW: zinc/slate-based default (shadcn-style)
│                              Replaces platform.css as the library's default
│
├── components/             @poeticui/components    (was @ap/ui — renamed; scoped to match)
│   ├── src/
│   │   ├── core/                     Button, Link
│   │   ├── data-display/             Avatar, Badge, Card, Skeleton, Stat, Table, ImageWithFallback
│   │   ├── feedback/                 Alert, Dialog, Hint
│   │   ├── forms/                    Fieldset family, Input, Select, Combobox, Checkbox, Switch, Radio
│   │   ├── layout/                   SidebarLayout, StackedLayout, PageHeader, DrawerShell
│   │   │                             ← brand-flavored pieces REMOVED from here
│   │   ├── misc/                     Dropdown, Popover
│   │   ├── navigation/               Navbar, Sidebar, Breadcrumbs, Pagination, Tabs, SegmentedTabs
│   │   └── tables/                   DataTable family + TablePaginationFooter
│   ├── .storybook/                   ← NEW: replaces /design-system page
│   │   ├── main.ts
│   │   ├── preview.tsx               loads @poeticui/tokens + neutral theme
│   │   └── themes.ts                 neutral / AP-platform / AP-poehost toggle
│   ├── CONTRIBUTING.md
│   ├── docs/RFC-ARCHITECTURE.md
│   └── (**/*.stories.tsx alongside each component)
│
└── brand/                  @ap/brand               (NEW package — AP's opinionated overlay)
    ├── src/
    │   ├── theme/
    │   │   ├── platform.css          was @ap/tokens/themes/platform.css
    │   │   ├── poehost.css           was @ap/tokens/themes/poehost.css
    │   │   ├── intranet.css          was @ap/tokens/themes/intranet.css
    │   │   └── outboundmode.css      new, currently inline in dashboard
    │   └── layout/
    │       ├── app-shell
    │       ├── account-dropdown-menu
    │       ├── sidebar-brand-badge
    │       ├── sidebar-user-chip
    │       └── navbar-avatar-dropdown
    │                                  ← these move from @ap/ui
    └── package.json
```

### What each package is

**`@poeticui/tokens`** — the design language. Pure CSS. Zero runtime deps. Ships a neutral default theme (zinc-ish, shadcn-compatible) so any consumer gets a look that works without bringing their own theme. Customization is a theme overlay — a small CSS file that overrides the required brand slots.

**`@poeticui/components`** — ~50 React components. Consume tokens exclusively. Zero brand assumptions. Zero framework lock-in beyond React + HeadlessUI. This is what eventually publishes publicly on npm. Includes Storybook as the authoring + docs surface.

**`@ap/brand`** — AP-specific product chrome + theme overlays. Private. Depends on `@poeticui/components` + `@poeticui/tokens`. Contains `AppShell`, `AccountDropdownMenu`, `SidebarBrandBadge`, `SidebarUserChip`, `NavbarAvatarDropdown`, plus the 4 AP theme files.

### Dependency arrows

```
apps/dashboard
      │ imports @ap/brand (AppShell, SidebarBrandBadge, theme CSS)
      │ imports @poeticui/components (Button, DataTable, Fieldset, …)
      │ imports @poeticui/tokens (CSS)
      ▼
@ap/brand
      │ imports @poeticui/components
      │ imports @poeticui/tokens
      ▼
@poeticui/components
      │ imports @poeticui/tokens
      ▼
@poeticui/tokens
      (pure CSS, zero deps)
```

**Arrows only point downward.** Enforced by `no-restricted-imports` ESLint rules and a CI grep that fails when a lower package reaches up.

---

## Theme contract — primary, secondary, semantic, surface

### Four categories of token

```
BRAND  (customizable per theme — main surface for personalization)
  --primary            --primary-foreground
  --secondary          --secondary-foreground

SEMANTIC ROLE  (meaning; theme re-tints but keeps intent)
  --destructive        --destructive-foreground     (error, delete, dangerous)
  --success            --success-foreground         (confirmation, positive)
  --warning            --warning-foreground         (caution, pending)
  --info               --info-foreground            (informational; NEW — maps to chart-1 by default)

SURFACE  (neutral; rare to override)
  --background         --foreground                 (page chrome)
  --card               --card-foreground            (elevated surface)
  --popover            --popover-foreground         (floating surface)
  --muted              --muted-foreground           (subtle fill / dim text)
  --accent             --accent-foreground          (subtle emphasis)

STRUCTURE
  --border             (divider, input border, card ring)
  --input              (form-input background)
  --ring               (focus ring — typically mirrors --primary)
  --radius             (corner radius token)

CHART  (data visualization — chromatic, not theme-brand)
  --chart-1 through --chart-10
  Chart tokens are data, not brand. Themes MAY override but rarely should.

SIDEBAR  (dark-first sidebar chrome — decoupled from theme mode)
  --sidebar            --sidebar-foreground
  --sidebar-primary    --sidebar-primary-foreground
  --sidebar-accent     --sidebar-accent-foreground
  --sidebar-border
  --sidebar-ring
```

### Minimum theme contract (what a theme overlay MUST define)

In both `:root` and `.dark`:

```css
--primary
--primary-foreground
--ring                          /* typically mirrors --primary */
--sidebar-primary               /* sidebar active-indicator color */
--sidebar-primary-foreground
--sidebar-ring
```

That's 6 slots (unchanged from Phase 1). Everything else inherits from `@poeticui/tokens/semantic` defaults.

### Optional overrides

A theme MAY additionally define `--secondary` (+ its foreground) if the brand has two accent colors (e.g. AP's orange + a secondary tone). Defaults to neutral (so it feels like shadcn's secondary-button grey) if not set.

### Dark mode is not optional

Every theme overlay declares its tokens in **both** `:root` and `.dark`. Components never write `dark:` prefixes against palette colors — they use tokens, and the tokens handle the mode switch. Reference: `@poeticui/tokens/themes/neutral.css` will be the template.

### Example — AP platform theme (post-split)

```css
/* @ap/brand/theme/platform.css */
@layer base {
  :root {
    --primary: var(--color-orange-500);
    --primary-foreground: oklch(1 0 0);
    --ring: var(--color-orange-500);
    --sidebar-primary: var(--color-orange-500);
    --sidebar-primary-foreground: oklch(1 0 0);
    --sidebar-ring: var(--color-orange-500);
  }
  .dark {
    --primary: var(--color-orange-500);
    --primary-foreground: oklch(1 0 0);
    --ring: var(--color-orange-500);
    --sidebar-primary: var(--color-orange-500);
    --sidebar-primary-foreground: oklch(1 0 0);
    --sidebar-ring: var(--color-orange-500);
  }
}
```

(Platform uses orange identically in both modes — intentional, AP's brand is mode-agnostic. PoeHost / Intranet follow the same 6-slot template with their own primaries.)

### Example — a hypothetical external consumer

```css
/* acme-corp/ui-theme.css — an open-source consumer layering their brand */
@layer base {
  :root {
    --primary: #3b82f6;              /* Acme blue */
    --primary-foreground: #ffffff;
    --ring: #3b82f6;
    --sidebar-primary: #3b82f6;
    --sidebar-primary-foreground: #ffffff;
    --sidebar-ring: #3b82f6;
    /* Acme has two brand accents — override secondary too */
    --secondary: #f97316;            /* accent orange */
    --secondary-foreground: #ffffff;
  }
  .dark {
    --primary: #60a5fa;
    --primary-foreground: #0b1120;
    --ring: #60a5fa;
    --sidebar-primary: #60a5fa;
    --sidebar-primary-foreground: #0b1120;
    --sidebar-ring: #60a5fa;
    --secondary: #fb923c;
    --secondary-foreground: #0b1120;
  }
}
```

A 20-line file makes the entire `@poeticui/components` library render in Acme's brand.

---

## Typography policy — HTML-first, no duplicate utilities

### Rule

Heading scale lives on the HTML elements via `@layer base`. No `.type-h1` / `.type-h2` / `.type-h3` / `.type-h4` utility classes.

### What changes in Phase 2

```diff
// packages/tokens/src/typography.css

  @layer base {
    h1 { font-size: var(--heading-1-size); ... }
    h2 { font-size: var(--heading-2-size); ... }
    h3 { font-size: var(--heading-3-size); ... }
    h4 { font-size: var(--heading-4-size); ... }
  }

- @layer utilities {
-   .type-h1 { font-size: var(--heading-1-size); ... }
-   .type-h2 { ... }
-   .type-h3 { ... }
-   .type-h4 { ... }
- }
```

### Migration

Grep for `.type-h[1-4]` usage across the monorepo. Replace with the corresponding HTML element. For the rare case where heading-sized text must appear on a non-heading element (layout reasons), reference the token directly:

```tsx
// before
<span className="type-h2">{kpi}</span>

// after
<span style={{ fontSize: 'var(--heading-2-size)', lineHeight: 'var(--heading-2-line-height)' }}>
  {kpi}
</span>
// — or, cleaner, wrap in the actual heading element if semantically it is one
<h2>{kpi}</h2>
```

### Other utility-class smells to audit during the migration

- **`.type-code`** / **`.type-body`** — anywhere we have a utility that duplicates what `<code>` or `<p>` already means, remove it.
- **Component-prefixed utilities** like `.site-overview-card-title` (if any leftover from the pre-split CSS) — these should either move to the component as a React-level abstraction or drop.
- **`dark:<palette>` pairs in component source** — already banned by the DES-17 rule; re-confirm during the audit.

---

## Storybook

### Why Storybook (and why now)

- `/design-system` was a handroll: a set of sibling pages under `apps/dashboard/app/design-system/`. Every new component needed its own page + nav entry. Not scalable and not public-facing.
- Storybook ships the tooling we'd otherwise rebuild: isolated component rendering, control panels, a11y addon, viewport toggles, theming toggles, auto-generated docs.
- Post-public-launch (Phase 3), the Storybook instance becomes `poeticui.com/components` — same source, one deploy.

### Scope in Phase 2

1. **Add Storybook to `@poeticui/components`** — colocated stories, `@storybook/react-vite` runner, `bun run storybook` dev command.
2. **Port every existing `/design-system` page to a story file** — `src/core/button.stories.tsx`, `src/forms/fieldset.stories.tsx`, etc. Naming convention: `component.stories.tsx` next to `component.tsx`.
3. **Theme switcher in the toolbar** — lets reviewers toggle between neutral / AP-platform / AP-poehost / AP-intranet to spot-check themability.
4. **Delete `/design-system` page** — the entire `apps/dashboard/app/design-system/` directory goes away. `design-system-header.tsx`, `design-system-nav.ts`, `buttons/`, `charts/`, `forms/`, `stats/`, `tables/`, `text/`, `global-defaults/` — all removed.
5. **Add Storybook build artifact to the doc pipeline** — eventually hosted at `poeticui.artificialpoets.com` (internal) and later `poeticui.com` (public).

### Story file template

```tsx
// packages/components/src/core/button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta = {
  title: 'Core/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['solid', 'outline', 'plain'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    color: {
      control: 'select',
      options: ['dark/zinc', 'orange', 'red', 'green', /* ... */],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Solid: Story = { args: { variant: 'solid', children: 'Click me' } };
export const Outline: Story = { args: { variant: 'outline', children: 'Click me' } };
export const Plain: Story = { args: { variant: 'plain', children: 'Click me' } };

export const VariantMatrix: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {['solid', 'outline', 'plain'].map((v) => (
        <Button key={v} variant={v as 'solid' | 'outline' | 'plain'}>
          {v}
        </Button>
      ))}
    </div>
  ),
};
```

### What Storybook replaces — side-by-side

| Today (`/design-system`) | Post-Phase 2 (Storybook) |
|---|---|
| Handrolled route group in `apps/dashboard` | First-class docs tool in `packages/components` |
| Sibling pages per section | Stories colocated with component source |
| Manual nav building | Auto-discovered via Storybook's glob |
| No theme toggle | Theme switcher in the toolbar |
| No a11y output | `@storybook/addon-a11y` runs axe on every story |
| Locked to AP dashboard | Ships wherever `@poeticui/components` ships |
| No public URL | Future: `poeticui.com/components` |

---

## Migration plan

Phase 2 is a bounded project — estimated **4–6 engineering days**. Landed in a dedicated branch, merged in a single PR, reverted as a unit if anything regresses.

### Step 1 — Rename `@ap/tokens` → `@poeticui/tokens`

- Create `packages/tokens/package.json` with `"name": "@poeticui/tokens"` (was `@ap/tokens`).
- Update workspace dependents: `packages/ui/package.json`, `apps/dashboard/package.json`, anywhere else that lists it as a dep.
- Grep-and-replace all `@ap/tokens` imports → `@poeticui/tokens` in both TypeScript and CSS (`@import`).
- Verify: `bun install`, `bun run build`, `bun run test`.

### Step 2 — Rename `@ap/ui` → `@poeticui/components`

- Create `packages/components/` (renamed directory) OR keep `packages/ui/` on disk but rebrand the package name. Recommendation: **rename the directory too** so filesystem matches package name (cleaner mental model). `git mv packages/ui packages/components`.
- Update `packages/components/package.json` with `"name": "@poeticui/components"` + subpath exports.
- Update all imports across the monorepo: `@ap/ui` → `@poeticui/components`, `@ap/ui/forms` → `@poeticui/components/forms`, etc. (Mechanical find-and-replace.)
- Update `tsconfig.json` path aliases if any reference `packages/ui/`.
- Verify: full workspace build + test.

### Step 3 — Extract `@ap/brand` from `@poeticui/components`

- Create `packages/brand/package.json` with `"name": "@ap/brand"`, deps on `@poeticui/components` + `@poeticui/tokens`.
- Move 5 files from `packages/components/src/layout/` → `packages/brand/src/layout/`:
  - `app-shell.tsx`
  - `account-dropdown-menu.tsx`
  - `sidebar-brand-badge.tsx`
  - `sidebar-user-chip.tsx`
  - `navbar-avatar-dropdown.tsx`
- Move 4 theme CSS files from `packages/tokens/src/themes/` → `packages/brand/src/theme/`:
  - `platform.css`, `poehost.css`, `intranet.css`
  - Create `outboundmode.css` (currently the outbound layout uses platform's orange — formalize).
- Replace the `themes/platform.css` in `@poeticui/tokens` with `themes/neutral.css` — a zinc/slate-based default so the public library has a sensible starting look.
- Remove the 5 components from `packages/components/src/layout/index.ts` barrel.
- Add `packages/brand/src/layout/index.ts` barrel.
- Update dashboard imports: `@poeticui/components/layout` → `@ap/brand/layout` for the moved 5; CSS imports `@poeticui/tokens/themes/platform` → `@ap/brand/theme/platform`.

### Step 4 — Add `--info` semantic role + formalize the theme contract

- Add `--info` and `--info-foreground` to `@poeticui/tokens/semantic.css` (both `:root` and `.dark`). Default: `--info: var(--color-blue-500)`, `--info-foreground: oklch(1 0 0)`.
- Add the `@theme inline` mapping so `bg-info`, `text-info-foreground`, etc. are valid Tailwind utilities.
- Update `packages/components/CONTRIBUTING.md` (formerly `packages/ui/CONTRIBUTING.md`) to document the updated theme contract (6 required + optional `--secondary`).
- Update `apps/dashboard/AGENTS.md` token map table to include `--info`.

### Step 5 — Typography cleanup

- Remove the `@layer utilities { .type-h1 { … } }` block from `@poeticui/tokens/typography.css`.
- Grep the monorepo for `.type-h[1-4]` usage (should be zero after DES-22/23 cleanup, but confirm).
- If any usages remain: replace with the HTML element or `style={{ fontSize: 'var(--heading-N-size)', … }}`.

### Step 6 — Replace `/design-system` with Storybook

- Install Storybook (`@storybook/react-vite`, `@storybook/addon-a11y`, `@storybook/addon-themes`) as dev deps of `packages/components`.
- Configure `.storybook/main.ts` to scan `packages/components/src/**/*.stories.tsx`.
- `.storybook/preview.tsx` imports `@poeticui/tokens` + `neutral` theme; provides a theme toggle (neutral / AP-platform / AP-poehost / AP-intranet).
- Port every page under `apps/dashboard/app/design-system/` to a story file next to its component. Suggested mapping:
  - `design-system/buttons/*.tsx` → `packages/components/src/core/button.stories.tsx`
  - `design-system/forms/*.tsx` → `packages/components/src/forms/{checkbox,switch,input,…}.stories.tsx`
  - `design-system/tables/*.tsx` → `packages/components/src/tables/{data-table,table}.stories.tsx`
  - `design-system/stats/*.tsx` → `packages/components/src/data-display/{stat,card,badge}.stories.tsx`
  - `design-system/text/*.tsx` → `packages/components/src/core/typography.stories.mdx` (text samples, heading scale)
  - `design-system/charts/*.tsx` → chart stories colocated with chart components (or documented as Recharts-in-the-wild examples)
  - `design-system/global-defaults/*.tsx` → a dedicated `.storybook/Introduction.mdx` page covering tokens, palette, theme contract.
- Add `bun run storybook` + `bun run storybook:build` scripts.
- **Delete** the `apps/dashboard/app/design-system/` directory entirely (including `layout.tsx`, `page.tsx`, `design-system-header.tsx`, `design-system-nav.ts` and all subdirectories).
- Remove the `/design-system` link from any dashboard nav.

### Step 7 — Enforcement + CI

- Add `no-restricted-imports` ESLint rule in `packages/components/.eslintrc` banning `@ap/brand`, `next/*`, `apps/*`.
- Add a `packages/components/.eslintrc` rule banning raw `@headlessui/react` imports inside consumer code (components are allowed to wrap it internally; the barrel surface must not re-export raw Headless).
- Add CI grep job that scans `packages/components/src/` for `import .+ from ['"]@ap/brand['"]` or `next/`. Fail the build on hit.
- Add a CI check: `packages/brand/` must not appear as a dep in `packages/components/package.json`.

### Step 8 — Documentation updates

- `packages/components/CONTRIBUTING.md` — rename references (was `@ap/ui` → now `@poeticui/components`), add the "how to add a Story" section.
- `packages/components/docs/RFC-ARCHITECTURE.md` — mark this RFC as "Phase 2 — Shipped" at the top once the branch merges.
- `apps/dashboard/AGENTS.md` — update import examples from `@ap/ui` → `@poeticui/components` and from `@ap/ui/layout` → `@ap/brand/layout` for AppShell et al.
- Monorepo root `AGENTS.md` — update the Shared Packages table.

### Step 9 — Verification

- `bun install` — workspace graph resolves cleanly.
- `bun run build` — every workspace builds (`@poeticui/tokens`, `@poeticui/components`, `@ap/brand`, `@ap/dashboard`, etc.).
- `bun run test` — `@poeticui/components` tests pass (156+ expected); `@ap/dashboard` tests pass (211+ expected).
- `bun run lint` — zero errors at error level.
- `bun run storybook` — starts; every component has at least one story; theme toggle works.
- Manual sweep: all 4 dashboards (platform / intranet / poehost / outboundmode) + `/a13s` render identically. Light and dark modes verified for each.
- Visual regression check: compare CSS bundle size pre/post — should be within ±5%.

---

## Versioning

### Monorepo phase (now through public launch)

- Packages stay at `0.x` with no changelog discipline. Workspace = source of truth.
- `@poeticui/tokens` and `@poeticui/components` version in lockstep.
- `@ap/brand` versions independently (it's private and coupled to our app cadence).

### Once `@poeticui/*` ships on npm (Phase 3, not this RFC)

- Adopt Changesets for PRs touching either `@poeticui/*` package.
- `@poeticui/tokens` and `@poeticui/components` at matched major versions.
- Semantic versioning strictly: a component's public prop changes → major; internal refactor → patch.
- `@ap/brand` stays private, still independent.

---

## Open questions

1. **Does `@poeticui/components` ship a default theme import?** Proposal: `@poeticui/components/styles.css` re-exports `@poeticui/tokens` + the neutral theme so a consumer needs exactly one CSS import. Trade-off: bundles the neutral theme into consumers who will override it anyway. Current lean: **yes**, because the ergonomics win — consumers who need to override just layer their overlay after the import.

2. **`@poeticui/components` or `@poeticui/ui` as the package name?** You've specified `@poeticui/components`. It's more descriptive but longer. Sticking with it unless you want to revisit.

3. **Secondary as brand-color-2, or secondary as low-emphasis-neutral (shadcn convention)?** Proposal in this RFC: the default is neutral (shadcn-compatible), but themes MAY override `--secondary` to a second brand color if they want it. Dashboards that don't need two brand colors leave it at the default. Open to overriding this call.

4. **Does AP dashboard migrate to the neutral theme of `@poeticui/tokens`, then opt into `@ap/brand/theme/platform`, or does it always import AP's theme?** Proposal: the dashboard always imports the AP theme (it's an AP product; there's no reason to render with neutral). But Storybook does toggle between neutral and AP themes to demonstrate the theming system.

5. **Does Storybook live in its own package (`packages/storybook`) or inside `packages/components`?** Proposal: inside `packages/components` because the stories are colocated with component source (and we want them to stay that way for open-source shipping). If build concerns arise, we can extract later.

6. **Do we formally deprecate old `@ap/*` package names via a stub release?** No — this is an internal rename and every consumer is inside this monorepo. Cut the imports atomically in one PR. Deprecation stubs are for external consumers, which we don't have yet.

7. **Do the 4 theme overlays belong in `@ap/brand/theme/` or in `@ap/brand/themes/`?** Tiny bikeshed. Proposal: `theme/` (singular) because each file IS a complete theme. Either works.

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Rename churn breaks a dependent we forgot | Medium | Medium | CI catches it via `bun run build`. Do the rename in a single commit per package. |
| Storybook build fails in monorepo context | Low | Low | Storybook 8 has mature monorepo support; validate in a spike before merging. |
| `--info` semantic addition causes color clashes in existing dashboard code | Low | Low | Default `--info: var(--color-blue-500)` is visually distinct from every existing role. ESLint rule would catch any new raw-blue usage. |
| Removing `.type-h1` breaks dashboard pages | Low | Medium | Grep before the removal; confirm zero usage or migrate the holdouts. |
| Deleting `/design-system` page surprises a teammate | Medium | Low | Announce in the PR description; the docs already redirect them to Storybook. |
| `@ap/brand` accidentally gets imported from `@poeticui/components` | Medium | High | `no-restricted-imports` ESLint rule + CI grep. Revert any PR that adds the import. |
| Public release (Phase 3) reveals a leaked AP assumption | Medium | Medium | Storybook with theme toggle is our early-warning system — if a neutral-theme render shows AP orange somewhere, that's a leak. |
| `bun.lock` churn creates merge conflicts with other branches | High | Low | Do the rename + `bun install` as one of the first commits in Phase 2; every downstream branch rebases from there. |

---

## Decision + next steps

**Proposal:** approve this v2 RFC and schedule Phase 2 as a 4–6 day engineering project. Output: a single branch `feat/poeticui-phase2` containing all 9 steps, merged as one PR.

### Prerequisites (all ✅ already landed)

- DES-16 / DES-17 (CVA pattern + raw-color ESLint ban)
- DES-22 / DES-23 (raw-color scrub — both library and dashboard)
- DES-24 (AppShell + brand primitives extracted into `@ap/ui/layout`)
- DES-29 (DataTable decomposed)
- DES-31 (CONTRIBUTING guide)
- DES-33 v1 (this RFC's predecessor)

### Once approved

- Close DES-33 v1 with a pointer to this v2.
- Open a new Linear epic "Poetic UI Phase 2: public-ready architecture".
- File the 9 step issues from §Migration plan.
- Schedule 4–6 days in a future sprint.

### After Phase 2 lands

Phase 3 (not in scope of this RFC) is the public launch: npm publish `@poeticui/tokens` + `@poeticui/components`, set up `poeticui.com` using the Storybook build, write a getting-started guide, announce.

---

## Appendix — quick reference: principles digest

1. HTML semantics first. `<h1>`, not `.type-h1`.
2. Semantic tokens only. `bg-primary`, not `bg-orange-500`.
3. Neutral by default, customizable by theme overlay.
4. Light + dark is a contract, not a variant.
5. Primary + Secondary (brand) / Semantic roles / Surface — know the category.
6. Small, predictable, LLM-friendly. Files mirror categories; classes name roles.
7. No utility class that duplicates HTML meaning.

## Appendix — quick reference: package map

| Name | Scope | Deps | Contents |
|------|-------|------|----------|
| `@poeticui/tokens` | public-ready | none | palette, semantic vars, typography base rules, neutral default theme |
| `@poeticui/components` | public-ready | `@poeticui/tokens` | ~50 React primitives + Storybook |
| `@ap/brand` | private | `@poeticui/components` + `@poeticui/tokens` | AppShell, brand badges, account menus, AP theme overlays |
| `apps/dashboard` | private | all of the above | four dashboards + a13s |

## Appendix — see also

- `packages/components/CONTRIBUTING.md` (post-rename) — component authoring conventions
- `apps/dashboard/AGENTS.md` — enforced design principles per the dashboard ESLint rules
- Phase 1 RFC (v1 of this file, pre-2026-04-18) — archived in git history as the original `DES-33` output
