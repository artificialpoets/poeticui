# @poeticui/content

**Primitives for rendering technical content — syntax-highlighted code, math equations, persistent multi-variant tabs.**

Part of the [Poetic UI](https://github.com/artificial-poets/monorepo/tree/main/packages) ecosystem. Neutral React components (no brand coupling, no `next/*` imports) that work in any React-19 app — Next App Router, Remix, Astro, plain SPAs.

> **Opt-in.** Consumers who don't install this package pay **zero bytes**. Those who do get per-component subpath exports + `sideEffects: false` for tree-shaking, plus Server-Component pre-rendering that keeps Shiki's WASM and grammars off the client. See [Four layers of bundle control](#four-layers-of-bundle-control) below.

---

## Install

```bash
bun  add @poeticui/content
pnpm add @poeticui/content
npm  install @poeticui/content
yarn add @poeticui/content
```

Peer dependencies: `react@^19`, `react-dom@^19`.

Runtime deps pulled in automatically: `shiki`, `katex`, `react-katex`, plus the two sibling workspace packages `@poeticui/components` and `@poeticui/tokens`.

## Quick start

```tsx
import {
  BlockMath,
  CodeBlock,
  Example,
  InlineMath,
  LanguageTabs,
  PackageManagerTabs,
  PersistentTabs,
} from "@poeticui/content";

// Opt-in CSS — import once in your app entry:
import "@poeticui/content/styles/code-block";
import "@poeticui/content/styles/katex";

export default function QuickStart() {
  return (
    <section>
      <PackageManagerTabs add="@acme/api-client" />

      <CodeBlock
        lang="ts"
        code={`const x: number = 42;\nconsole.log(x);`}
      />

      <LanguageTabs defaultValue="ts">
        <Example lang="ts" label="TypeScript">
          {`const client = new Poet({ apiKey: process.env.POET_KEY! });`}
        </Example>
        <Example lang="python" label="Python">
          {`client = Poet(api_key=os.environ["POET_KEY"])`}
        </Example>
      </LanguageTabs>

      <p>
        The Pythagorean identity <InlineMath math="a^2 + b^2 = c^2" /> is the
        basis of the Euclidean norm.
      </p>
      <BlockMath math={String.raw`\int_0^\infty e^{-x^2}\,dx = \frac{\sqrt{\pi}}{2}`} />
    </section>
  );
}
```

## The primitives

### `<CodeBlock>` — Shiki syntax highlighting

**Async Server Component.** Renders syntax-highlighted HTML at render time and ships zero client JS for the highlighter. Emits dual-theme CSS variables so a `.dark` ancestor class flips colors instantly with no re-render.

```tsx
<CodeBlock lang="ts" code="const x: number = 42;" />

// Customize the theme pair:
<CodeBlock
  lang="tsx"
  themes={{ light: "github-light", dark: "one-dark-pro" }}
  code="…"
/>
```

**Default grammars (10):** `ts`, `tsx`, `js`, `jsx`, `bash`, `json`, `css`, `html`, `md`, `python`.
**Default themes:** `github-light`, `github-dark-dimmed`.

Need more grammars? Build your own highlighter and pass it in:

```tsx
import { CodeBlock, createHighlighter } from "@poeticui/content";

const highlighter = await createHighlighter({
  langs: ["ts", "bash", "php", "ruby", "rust"],
  themes: ["github-light", "github-dark-dimmed"],
});

<CodeBlock lang="rust" highlighter={highlighter} code={`fn main() {}`} />
```

### `<BlockMath>` / `<InlineMath>` — KaTeX

Client-rendered via `react-katex`. Two sizes (`default`, `compact`) via CVA:

```tsx
<BlockMath math={String.raw`\sum_{n=1}^\infty \frac{1}{n^2} = \frac{\pi^2}{6}`} />
<InlineMath math="e^{i\pi} + 1 = 0" size="compact" />
```

**CSS is opt-in.** `import "@poeticui/content/styles/katex"` once in your app entry to pull in KaTeX's fonts and spacing. Without it, math renders structurally but looks plain. The bundled CSS also adds `color: currentColor` so equations inherit your theme's text color automatically.

### `<PersistentTabs>` — generic tab strip with preference sync

Built on `<SegmentedTabs>` from `@poeticui/components/navigation` plus `usePref()`. Every `<PersistentTabs>` instance sharing the same `storageKey` stays in lockstep on the page (same-tab) and across browser tabs (via the `storage` event).

```tsx
<PersistentTabs
  storageKey="my-app:theme-preview"
  defaultValue="auto"
  options={[
    { value: "light", label: "Light" },
    { value: "dark",  label: "Dark" },
    { value: "auto",  label: "Auto" },
  ]}
>
  {(active) => <p>You picked: {active}</p>}
</PersistentTabs>
```

Under the hood: `useSyncExternalStore` with a per-key pub/sub. SSR-safe — returns `defaultValue` during server render, hydrates to the stored value on the client with no visual flash (assuming the server-rendered UI was built with `defaultValue`).

### `<PackageManagerTabs>` — bun / pnpm / npm / yarn

Pass exactly one verb prop; the component generates the correct command for every package manager:

```tsx
<PackageManagerTabs install />
<PackageManagerTabs add="react react-dom" />
<PackageManagerTabs remove="lodash" />
<PackageManagerTabs run="build" />
<PackageManagerTabs exec="tsc --watch" />
<PackageManagerTabs create="next-app my-app --typescript" />
```

Every `<PackageManagerTabs>` on the page syncs under `storageKey="poeticui:pref:package-manager"`. Your visitor picks "bun" once; every install/add/run snippet across your docs reflects that choice from then on.

### `<LanguageTabs>` + `<Example>` — cross-language code samples

Children-based API. The `<Example>` marker tells `<LanguageTabs>` which samples to expose:

```tsx
<LanguageTabs defaultValue="ts">
  <Example lang="ts" label="TypeScript">
    {`const client = new Poet({ apiKey: process.env.POET_KEY! });`}
  </Example>
  <Example lang="python" label="Python">
    {`client = Poet(api_key=os.environ["POET_KEY"])`}
  </Example>
  <Example lang="bash" label="cURL">
    {`curl -H "Authorization: Bearer $POET_KEY" https://api.acme.com/v1/me`}
  </Example>
</LanguageTabs>
```

Sync key: `poeticui:pref:language`. Graceful degradation — if the user picked `python` on another page but this card only has ts + bash, we fall back to the first example instead of crashing.

---

## Four layers of bundle control

The package is designed so consumers can precisely pick what ships to the browser. Each layer composes with the ones above it.

### Layer 1 — Package

**Don't install `@poeticui/content` and you pay zero bytes.** Most line-of-business dashboards and admin UIs fall here. This is the default. Only reach for the package when a concrete feature needs a primitive.

### Layer 2 — Import (subpath exports)

Per-component subpaths let you bypass the barrel for zero-risk tree-shaking — even bundlers that conservatively keep barrel imports will get per-export granularity:

```tsx
// Only pulls CodeBlock + Shiki. Nothing else from the package loads.
import { CodeBlock } from "@poeticui/content/code-block";

// Only pulls Math + KaTeX.
import { BlockMath } from "@poeticui/content/math";

// Only pulls PersistentTabs — no CodeBlock, no Math.
import { PersistentTabs } from "@poeticui/content/persistent-tabs";
```

All subpaths:

- `@poeticui/content` — barrel (everything)
- `@poeticui/content/code-block`
- `@poeticui/content/math`
- `@poeticui/content/persistent-tabs`
- `@poeticui/content/package-manager-tabs`
- `@poeticui/content/language-tabs`
- `@poeticui/content/pref-store`
- `@poeticui/content/storage-keys`
- `@poeticui/content/styles/code-block` — CSS
- `@poeticui/content/styles/katex` — CSS

### Layer 3 — Route-level (Next App Router / equivalent)

In a framework that code-splits per route, any primitive only loads on the routes that import it. Your marketing landing page imports `<CodeBlock>` → it's in the marketing chunk. Your dashboard index route doesn't → the dashboard chunk stays lean.

### Layer 4 — Dynamic import

Defer the heaviest primitives (Shiki's WASM is ~500KB with default grammars) to first use:

```tsx
const { CodeBlock } = await import("@poeticui/content/code-block");
```

Or with React's `<Suspense>`:

```tsx
import { lazy } from "react";

const CodeBlock = lazy(() =>
  import("@poeticui/content/code-block").then((m) => ({ default: m.CodeBlock })),
);
```

---

## Server Components & the `'use client'` boundary

| Primitive | Boundary | Why |
|---|---|---|
| `<CodeBlock>` | **Server** (async) | Shiki highlighting is async; pre-rendering keeps the highlighter off the client. |
| `<BlockMath>` / `<InlineMath>` | **Client** | `react-katex` needs DOM layout. |
| `<PersistentTabs>` | **Client** | Needs `localStorage` + `useSyncExternalStore`. |
| `<PackageManagerTabs>` | **Server** (async) | Pre-renders 4 CodeBlocks server-side, hands them to an internal client shell that toggles visibility. |
| `<LanguageTabs>` | **Server** (async) | Same pattern as above — pre-renders each `<Example>`'s CodeBlock server-side. |

Practical impact: **Shiki never reaches the browser** for the tab components. The only JS that ships for a `<PackageManagerTabs>` is the ~2KB shell that toggles which pre-rendered block is visible. KaTeX CSS + JS does reach the browser (it has to — math layout is client-only), but only on pages that import it.

---

## Design tokens & theming

Same rule as `@poeticui/components`: tokens-only. `bg-card` instead of `bg-white`, `text-foreground` instead of `text-zinc-900`. Every primitive flips with the `.dark` ancestor class for free, and picks up your brand's primary/secondary colors if you've layered a theme overlay on top of `@poeticui/tokens`.

---

## Live examples

- **[Content / Overview](https://poeticui.com/storybook)** — full tour of every primitive (Poetic UI Storybook)
- **[Content / Examples / API Landing Page](https://poeticui.com/storybook)** — realistic end-to-end mock combining every primitive in a developer-facing marketing page

(Run locally: `bun run storybook` from `packages/components/` → `http://localhost:6006` → **Content**.)

---

## Contributing

Open a PR with tests (`jest` + `@testing-library/react`) and a story. See [`packages/components/CONTRIBUTING.md`](../components/CONTRIBUTING.md) for the authoring spec — the same rules apply here (semantic tokens only, `cx()` helper, CVA for variants, tests colocated under `src/__tests__/`).

## License

Apache-2.0. See [LICENSE](../../LICENSE) at the repo root.
