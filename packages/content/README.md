# @poeticui/content

**Primitives for rendering technical content — code, math, persistent multi-variant tabs.**

Part of the [Poetic UI](https://github.com/artificial-poets/monorepo/tree/main/packages) ecosystem. Opt-in: consumers who don't install this package pay **zero bytes**. Those who do get strict bundle discipline baked in (see below).

> Full usage documentation + live Storybook examples will land with DES-63. Until then, see `.storybook/ContentToolkit.mdx` + `.storybook/examples/ApiLandingPage.mdx` in `@poeticui/components`.

## What's inside

| Primitive | Purpose |
|---|---|
| `<CodeBlock>` + `createHighlighter()` | Shiki-powered syntax highlighting, dual light/dark theme via CSS variables |
| `<BlockMath>` / `<InlineMath>` | KaTeX math rendering |
| `<PersistentTabs>` + `usePref()` | Generic tabs with localStorage-backed preference, cross-instance + cross-tab sync |
| `<PackageManagerTabs>` | Composed tabs for npm / pnpm / bun / yarn |
| `<LanguageTabs>` + `<Example>` | Composed tabs for ts / js / php / py / go / rust / bash |

## Status

v0.1 — scaffold only. Components land in DES-58 → DES-62. Tracking: [Poetic UI @poeticui/content project](https://linear.app/artificial-poets/project/poetic-ui-poeticuicontent-technical-content-primitives-f06e41632b1d).
