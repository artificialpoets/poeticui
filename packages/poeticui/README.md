# poeticui

> One install. Tokens + components in a single package. The convenience layer over `@artificialpoets/tokens` and `@artificialpoets/components`.

```bash
bun  add poeticui
pnpm add poeticui
npm  install poeticui
yarn add poeticui
```

You also need React 19 + the standard styling peers (most projects have these already):

```bash
bun add react@^19 react-dom@^19 @headlessui/react@^2 clsx@^2 tailwind-merge@^3
```

For technical-content primitives (`<CodeBlock>`, `<BlockMath>`, `<PackageManagerTabs>`), install the separate content package — it has heavy peers (Shiki, KaTeX):

```bash
bun add @artificialpoets/content
```

## Quick start

```tsx
import { Button, Card, Heading, Text, Badge } from "poeticui";

export default function Welcome() {
  return (
    <Card>
      <Badge color="green">v0.1.0</Badge>
      <Heading as="h2">Welcome to Poetic UI</Heading>
      <Text>Built with poeticui.</Text>
      <Button color="dark/zinc">Get started</Button>
    </Card>
  );
}
```

Wire the CSS once in your app entry:

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
@import "poeticui/styles/tokens";
```

That's the full install. The library paints with a neutral theme by default; override the 6-slot theme contract in your own CSS to rebrand.

## Two import styles

Pick whichever feels right — both are supported and tree-shake equally well:

```tsx
// Barrel — simplest
import { Button, Card, Heading, Input, Switch } from "poeticui";

// Subpath — explicit category, slightly easier to grep for in big codebases
import { Button } from "poeticui/core";
import { Card, Heading } from "poeticui/data-display";
import { Input, Switch } from "poeticui/forms";
```

## Subpaths

| Subpath | What it re-exports |
|---|---|
| `poeticui` | Everything from `@artificialpoets/components` |
| `poeticui/core` | Button, Link, TouchTarget |
| `poeticui/data-display` | Avatar, Badge, BadgeButton, Card, Code, DescriptionList family, Divider, Heading, Skeleton, Stat, Strong, Subheading, Table family, Text, TextLink |
| `poeticui/forms` | Checkbox, Combobox, Fieldset family, Input, Select, Switch family, Textarea, Date-range-picker |
| `poeticui/feedback` | Alert, Callout, Dialog family, EmptyState, Hint |
| `poeticui/layout` | DrawerShell, PageHeader, SidebarLayout, StackedLayout |
| `poeticui/navigation` | Breadcrumbs, Navbar family, Pagination, SegmentedTabs, Sidebar family, Tabs |
| `poeticui/tables` | DataTable family, FilteredTable, TablePaginationFooter, useDataTableState |
| `poeticui/misc` | Dropdown family, Popover |
| `poeticui/icons` | ServiceIcon |
| `poeticui/lib` | cx() helper |
| `poeticui/styles/tokens` | CSS — OKLCH palette + semantic variables + Tailwind theme mapping + neutral default theme |

## What this is (and isn't)

This package is a **thin wrapper** — it adds zero source code, zero behavior, and depends on the underlying packages via `^0.1.0`. Use it for ergonomics: one install command, one canonical import path. The underlying packages continue to work and remain installable standalone:

```bash
# Granular install style — also supported, identical components
bun add @artificialpoets/components @artificialpoets/tokens
```

The two styles are interchangeable. Pick whichever fits your project.

## License

Apache-2.0. See [LICENSE](../../LICENSE) at the repo root.
