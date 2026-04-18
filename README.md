# Poetic UI

**Private. Closed source. Hosted at [`artificialpoets/poeticui`](https://github.com/artificialpoets/poeticui).**

A three-package design system:

| Package | Purpose |
|---|---|
| [`@poeticui/tokens`](./packages/tokens) | Pure CSS — OKLCH palette, semantic aliases, typography base, Tailwind v4 theme mapping, default neutral theme. Zero JS deps. |
| [`@poeticui/components`](./packages/components) | ~50 neutral React primitives. Consume tokens exclusively. No brand assumptions. Framework-agnostic (no `next/*` imports). |
| [`@poeticui/content`](./packages/content) | Technical-content primitives: Shiki-powered `<CodeBlock>`, KaTeX `<BlockMath>`/`<InlineMath>`, `<PersistentTabs>`, `<PackageManagerTabs>`, `<LanguageTabs>`. Opt-in — consumers who don't install pay zero bytes. |

**Arrows only point downward:** `consumers → content → components → tokens`. The neutral-boundary contract is enforced by the CI workflow (`.github/workflows/ci.yml`).

## How this repo is consumed

### From the Artificial Poets monorepo

Mounted as a git submodule at `vendor/poeticui/`. The monorepo's Bun workspaces glob includes `vendor/poeticui/packages/*`, so every `import '@poeticui/*'` resolves via symlink with no version bump required on day-to-day edits.

```bash
# In the monorepo
git clone --recurse-submodules git@github.com:artificialpoets/monorepo.git
cd monorepo && bash tooling/bootstrap.sh
# Edit vendor/poeticui/packages/components/src/... → dashboard hot-reloads
```

### From any other (future) app

Install as a registered npm dependency via GitHub Packages:

```bash
# One-time: create a PAT with read:packages scope, then:
echo "@poeticui:registry=https://npm.pkg.github.com" >> ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=ghp_YOUR_PAT_HERE" >> ~/.npmrc
```

```bash
bun add @poeticui/components @poeticui/tokens @poeticui/content
```

## Develop

```bash
bun install
bun run lint          # eslint across all three packages
bun run test          # jest across components + content (tokens is pure CSS)
bun run build         # turbo build (source-only packages → echo)
bun run storybook     # Storybook dev server at http://localhost:6006
bun run storybook:build
```

## Release

Changesets drives versioning. To propose a version bump, add a changeset entry in the same PR that contains the change:

```bash
bun run changeset
# → opens an interactive prompt; pick the packages + bump level + write a summary
# → commits .changeset/<slug>.md in your PR
```

When PRs land on `main`, the `release.yml` workflow opens (or updates) a "Version Packages" PR. Merging that PR publishes the bumped packages to GitHub Packages and creates GitHub Releases automatically.

## Storybook

All three packages share a Storybook hosted in `packages/components/.storybook/`. The MDX pages under `packages/components/.storybook/ContentToolkit.mdx` and `packages/components/.storybook/examples/ApiLandingPage.mdx` live-demo the `@poeticui/content` primitives.

## Layout

```
poeticui/
├── .changeset/                 Changesets state + config
├── .github/workflows/          ci.yml + release.yml
├── packages/
│   ├── tokens/                 pure CSS
│   ├── components/             neutral React primitives (hosts Storybook)
│   └── content/                content primitives
├── package.json                workspaces, hoisted devDeps, scripts
├── tsconfig.base.json          shared TS compilerOptions
├── turbo.json                  build/test/lint pipelines
├── .npmrc                      @poeticui → GitHub Packages
└── bun.lock                    single workspace lock
```

## Neutral-boundary rules (enforced in CI)

1. `@poeticui/components` never imports `@ap/brand`.
2. `@poeticui/components` never imports `next/*`.
3. `@poeticui/components/package.json` has no `@ap/brand` dep.
4. `@poeticui/tokens` has no `@ap/*` references.
5. `@poeticui/content` has no `@ap/*` references.
6. `@poeticui/content` never imports `next/*`.

Each rule is a grep check; a violation fails the CI job.

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the authoring spec (tokens-only styling, `cx()`, CVA, etc.) and the full component library contract at [`packages/components/CONTRIBUTING.md`](./packages/components/CONTRIBUTING.md).
