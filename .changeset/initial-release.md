---
"@poeticui/tokens": patch
"@poeticui/components": patch
"@poeticui/content": patch
---

Initial release from the extracted `artificialpoets/poeticui` repo.

This is the first version of each package published from this repo (rather
than from the parent `artificialpoets/monorepo`). No behavioral changes vs.
the pre-extraction source — the packages were moved wholesale with full
git history preserved via `git filter-repo`, then re-bundled under a fresh
repo root with Changesets + GitHub Packages publishing.

- `@poeticui/tokens@0.1.1` — CSS design tokens (palette, semantic aliases,
  typography, Tailwind theme map, neutral default theme)
- `@poeticui/components@0.0.2` — neutral React primitives (~50 components)
  + colocated Storybook at `packages/components/.storybook/`
- `@poeticui/content@0.1.1` — technical-content primitives: `<CodeBlock>`
  (Shiki), `<BlockMath>`/`<InlineMath>` (KaTeX), `<PersistentTabs>`,
  `<PackageManagerTabs>`, `<LanguageTabs>`

The `artificialpoets/monorepo` consumes these via git submodule at
`vendor/poeticui/`; future external consumers can install via GitHub
Packages (`@poeticui` scope → `npm.pkg.github.com`).
