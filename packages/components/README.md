# @artificialpoets/components

> ~50 neutral React UI primitives. Tokens-only styling. HeadlessUI v2. CVA variants. Framework-agnostic.

```bash
bun  add @artificialpoets/components @artificialpoets/tokens
pnpm add @artificialpoets/components @artificialpoets/tokens
npm  install @artificialpoets/components @artificialpoets/tokens
yarn add @artificialpoets/components @artificialpoets/tokens
```

Peer dependencies you also need: `react@^19`, `react-dom@^19`, `@headlessui/react@^2`, `clsx@^2`, `tailwind-merge@^3`, `motion@^12`, `lucide-react@^1`, `dayjs@^1.11`. Next.js is currently a peer too (DES-49 will decouple `Link` + `Avatar` from `next/*`).

## Quick start

```tsx
import { Button } from "@artificialpoets/components/core";
import { Card, Heading, Text, Badge } from "@artificialpoets/components/data-display";

export default function Example() {
  return (
    <Card>
      <Badge color="green">v0.1.0</Badge>
      <Heading as="h2">Welcome</Heading>
      <Text>Built with @artificialpoets/components.</Text>
      <Button color="dark/zinc">Get started</Button>
    </Card>
  );
}
```

Wire the CSS once in your app entry — your `globals.css` or equivalent:

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
@import "@artificialpoets/tokens";
```

That's it. Components paint with the neutral theme by default. To rebrand, layer a theme overlay defining the 6 brand slots — see [`@artificialpoets/tokens`](../tokens) for the contract.

## Component categories

Each category is a separate subpath export so bundlers tree-shake unused code, and so the import surface is grep-able:

| Subpath | Components |
|---|---|
| `@artificialpoets/components/core` | Button, Link, TouchTarget |
| `@artificialpoets/components/data-display` | Avatar, Badge, BadgeButton, Card, Code, DescriptionList family, Divider, Heading, ImageWithFallback, Skeleton, Stat, Strong, Subheading, Table family, Text, TextLink |
| `@artificialpoets/components/forms` | Checkbox, Combobox, Date-range-picker, Fieldset family (Field, Label, Description, ErrorMessage), Input, Listbox, Radio, Select, Switch family, Textarea |
| `@artificialpoets/components/feedback` | Alert, Callout, Dialog family, EmptyState, Hint |
| `@artificialpoets/components/layout` | DrawerShell, PageHeader, SectionHeader, SidebarLayout, StackedLayout |
| `@artificialpoets/components/navigation` | Breadcrumbs, Navbar family, Pagination, SegmentedTabs, Sidebar family, Tabs |
| `@artificialpoets/components/tables` | DataTable family, FilteredTable, TablePaginationFooter, useDataTableState, useFilteredTable |
| `@artificialpoets/components/misc` | Dropdown family, Hint, Popover |
| `@artificialpoets/components/icons` | ServiceIcon |

The full root barrel re-exports everything: `import { Button } from "@artificialpoets/components"` works too — pick whichever import style you prefer.

## Live preview — Storybook

```bash
git clone https://github.com/artificialpoets/poeticui.git
cd poeticui && bun install
bun run storybook
```

Opens at `http://localhost:6006` with every component, every variant, light/dark toggle, a11y addon.

## Design principles

Seven non-negotiable rules drive every authoring decision. See [`docs/RFC-ARCHITECTURE.md`](./docs/RFC-ARCHITECTURE.md) for the full RFC and [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the authoring spec.

1. **HTML semantics first** — `<h1>` with base styles, no `.type-h1` utility
2. **Semantic tokens** — `bg-primary` and `text-muted-foreground`, never `bg-orange-500`
3. **Neutral by default** — theme overlay rebrands the whole library in 20 lines of CSS
4. **Light + dark is a contract** — every token has `:root` + `.dark` values; no `dark:` prefixes in component source
5. **Primary / Secondary / Semantic role / Surface** — four distinct token categories with clear use cases
6. **LLM-friendly** — `data-component` attributes, JSDoc `@example` per primitive, single canonical export path
7. **No utility class that duplicates HTML meaning** — kills `.type-h1`, `.type-body`, etc.

## Theme contract

Six CSS variables turn the neutral library into your brand:

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
    /* same six, dark values */
  }
}
```

Full theming guide in [`@artificialpoets/tokens`](../tokens).

## Contributing

The authoring spec is in [`CONTRIBUTING.md`](./CONTRIBUTING.md) — ~650 lines covering slot composition, CVA patterns, semantic token usage, HeadlessUI integration, ref forwarding, testing conventions, file organization, and agent-friendly authoring (§9).

## License

Apache-2.0. See [LICENSE](../../LICENSE) at the repo root.
