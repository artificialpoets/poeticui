# Poetic UI

> A neutral, agent-friendly React design system. Tokens, components, and technical-content primitives. Open source under Apache-2.0.

```bash
bun  add poeticui
pnpm add poeticui
npm  install poeticui
yarn add poeticui
```

For technical-content surfaces (docs pages, API references, marketing landing pages) — opt-in, heavy peers (Shiki, KaTeX):

```bash
bun add @artificialpoets/content
```

Prefer granular installs? The underlying packages work standalone — identical components:

```bash
bun add @artificialpoets/components @artificialpoets/tokens
```

## Quick start

```tsx
import { Button, Card, Heading, Text, Badge } from "poeticui";

export default function HelloWorld() {
  return (
    <Card>
      <Badge color="green">v0.1.0</Badge>
      <Heading as="h2">Welcome to Poetic UI</Heading>
      <Text>A neutral, themable React design system.</Text>
      <Button color="dark/zinc">Get started</Button>
    </Card>
  );
}
```

Wire the CSS once in your app entry — `globals.css`, `src/styles.css`, or equivalent:

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
@import "poeticui/styles/tokens";

/* Optional: layer your brand by overriding the 6-slot theme contract */
@layer base {
  :root {
    --primary: oklch(0.488 0.243 264);
    --primary-foreground: oklch(0.985 0 0);
    --ring: oklch(0.488 0.243 264);
    --sidebar-primary: oklch(0.488 0.243 264);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-ring: oklch(0.488 0.243 264);
  }
  .dark { /* same six, dark values */ }
}
```

That's it. The library paints with a neutral theme by default; the six-slot overlay above turns it into your brand.

## What's in the box

| Package | Purpose |
|---|---|
| [`poeticui`](./packages/poeticui) | One-install convenience layer — re-exports tokens + components. |
| [`@artificialpoets/tokens`](./packages/tokens) | Pure CSS. OKLCH palette, semantic role variables, Tailwind v4 theme mapping, neutral default theme. Zero JS deps. |
| [`@artificialpoets/components`](./packages/components) | ~50 React primitives. Consume tokens exclusively. HeadlessUI v2 + CVA. Framework-agnostic (no `next/*` imports). |
| [`@artificialpoets/content`](./packages/content) | Technical-content primitives: Shiki-powered `<CodeBlock>` (server-rendered), KaTeX `<BlockMath>`/`<InlineMath>`, `<PersistentTabs>`, `<PackageManagerTabs>`, `<LanguageTabs>`. Opt-in — consumers who don't install pay zero bytes. |

**Arrows only point downward:** `consumers → content → components → tokens`. The neutral-boundary contract is enforced by CI (`.github/workflows/ci.yml`).

## Live preview — Storybook

```bash
git clone https://github.com/artificialpoets/poeticui.git
cd poeticui && bun install
bun run storybook
```

Opens at `http://localhost:6006` with every component, every variant, light/dark toggle, axe-core a11y addon.

## Design principles

Seven non-negotiable rules — full RFC in [`packages/components/docs/RFC-ARCHITECTURE.md`](./packages/components/docs/RFC-ARCHITECTURE.md):

1. **HTML semantics first** — `<h1>` with base styles, no `.type-h1` utility classes
2. **Semantic tokens** — `bg-primary` and `text-muted-foreground`, never `bg-orange-500`
3. **Neutral by default, customizable per brand** — overlay defines six required slots; everything else inherits
4. **Light + dark is a contract** — every token has `:root` and `.dark` values; components never write `dark:` prefixes
5. **Primary / Secondary / Semantic role / Surface** — four distinct token categories
6. **LLM-friendly** — `data-component` attributes on every primitive, JSDoc `@example` per export, single canonical export path
7. **No utility class that duplicates HTML meaning**

## Why this exists

Built on the lessons of shipping a design system across four production dashboards. The differentiators vs other React UI libraries:

- **Real package, not copy-paste.** Versioned npm releases — one bug fix propagates to every consumer. No re-running a CLI per repo.
- **`@artificialpoets/content`** — server-rendered `<CodeBlock>`, package-manager / language tabs with cross-tab preference sync, KaTeX math. No equivalent in shadcn or Mantine.
- **Theme as a contract** — six CSS variables rebrand the whole library. Light and dark are first-class, not a `dark:` afterthought.
- **Built for agents.** `data-component` attributes on every primitive. JSDoc `@example` blocks (the canonical examples agents copy). Stable error messages with `[@artificialpoets/components/<category>/<name>]` prefix. Forthcoming: a machine-readable component manifest (`registry.json`), `llms.txt`, MCP server, JSON token export.
- **CI-enforced framework-agnostic.** No `next/*` imports allowed in `@artificialpoets/components`. Tested in Next.js, Vite, Astro, Remix, plain SPAs.

## Architecture

```
your-app
   │ imports @artificialpoets/components, @artificialpoets/tokens, optionally @artificialpoets/content
   ▼
@artificialpoets/content       (opt-in: Shiki + KaTeX + tab primitives)
   │ depends on @artificialpoets/components + @artificialpoets/tokens
   ▼
@artificialpoets/components    (React UI primitives)
   │ depends on @artificialpoets/tokens
   ▼
@artificialpoets/tokens        (pure CSS, zero deps)
```

## Develop

```bash
git clone https://github.com/artificialpoets/poeticui.git
cd poeticui
bun install

bun run lint           # eslint across all packages
bun run test           # jest across components + content
bun run build          # turbo build (source-only packages → echo)
bun run storybook      # http://localhost:6006
bun run storybook:build
```

## Release

Versioning via Changesets. Every PR that touches `packages/*` includes a changeset file describing what bumped and at what level:

```bash
bun run changeset
# → interactive prompt; creates .changeset/<slug>.md
git add .changeset && git commit -m "chore: add changeset"
```

Bump levels:
- **patch** — bug fix, internal refactor, a11y tweak
- **minor** — new primitive, new prop on existing primitive (non-breaking)
- **major** — breaking API change

Merging a PR with a changeset opens (or updates) a "Version Packages" PR. Merging the Version Packages PR applies the bumps + writes per-package `CHANGELOG.md` entries + publishes to npm.

Packages are versioned **independently** — `tokens@0.1.1` and `components@0.2.0` can ship together. Only packages listed in the changeset bump.

## Contributing

The authoring spec is in [`packages/components/CONTRIBUTING.md`](./packages/components/CONTRIBUTING.md) — ~700 lines covering:

1. Slot-composition pattern (`data-slot` attributes)
2. CVA for variants (Pattern A single-call, Pattern B for color-as-orthogonal-axis)
3. Semantic token usage (raw `bg-gray-500` banned)
4. HeadlessUI integration
5. Ref forwarding and polymorphic `as`
6. Testing conventions
7. File organization
8. Worked example: `<Toggle>`
9. Authoring for agents (`data-component`, JSDoc `@example`, error prefixes, dev warnings, single canonical export path)

CI enforces a subset of these rules via greps and ESLint.

## License

Apache-2.0. See [LICENSE](./LICENSE).
