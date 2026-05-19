# Contributing to Poetic UI

> For the full component-authoring spec (slot composition, CVA variants, token usage, HeadlessUI wrapping), read **[`packages/components/CONTRIBUTING.md`](./packages/components/CONTRIBUTING.md)**. That document is ~650 lines of detailed rules with a worked `Toggle` example. This root file covers workflow, release, and CI — the moving parts that live at the repo root.

---

## Dev workflow

```bash
# Fresh clone
git clone git@github.com:artificialpoets/poeticui.git
cd poeticui
bun install

# Run the Storybook dev server for live visual review
bun run storybook          # → http://localhost:6006

# Lint / test across all workspaces
bun run lint
bun run test

# Work on a feature
git checkout -b feat/<ticket-or-description>
# … edit …
bun run lint && bun run test
bun run changeset          # describe the version bump
git add .
git commit -m "feat(components): add Toggle primitive"
git push -u origin feat/<name>
# → open PR on GitHub
```

## Editing from the Artificial Poets monorepo

This repo is also mounted as a **git submodule** inside the monorepo at `vendor/poeticui/`. Most of the time you'll edit `@artificialpoets/*` source from *inside* the monorepo so the dashboard hot-reloads. The commit flow has a gotcha:

1. `cd vendor/poeticui` to drop into the submodule.
2. `git checkout -b feat/<name>`, make edits, `bun run lint && bun run test`, add a changeset, commit, push.
3. Open a PR in `artificialpoets/poeticui` and merge it.
4. Back in the monorepo: `git add vendor/poeticui && git commit -m "chore: bump poeticui pin"`.
5. Push the monorepo bump.

Set `git config submodule.recurse=true` once (the monorepo's `tooling/bootstrap.sh` does this) so that `git pull/push` descend into submodules automatically. Pre-push hooks in the monorepo catch the "forgot to push submodule first" case.

## Releases (Changesets)

Every PR that changes `packages/*` **must include a changeset file** describing which packages bump and at which semver level:

```bash
bun run changeset
# → interactive prompt
# → creates .changeset/<slug>.md
git add .changeset && git commit -m "chore: add changeset"
```

Bump levels:

- **patch** — bug fix, internal refactor, a11y tweak
- **minor** — new primitive, new prop on an existing primitive (non-breaking)
- **major** — breaking API change (removed prop, renamed component, dependency bump that forces consumer changes)

When the PR merges, the `Release` workflow opens or updates a "Version Packages" PR that aggregates pending changesets. Merging that PR applies the bumps + writes per-package `CHANGELOG.md` entries on `main`.

**External publishing is currently deferred** (see the top of `.github/workflows/release.yml` for the rationale — the `@poeticui` scope doesn't match any GitHub org). Today's only consumer is the `artificialpoets/monorepo` submodule, which picks up new versions by bumping its submodule pin to the post-release SHA.

Packages are versioned **independently** (`tokens@0.1.1` and `components@0.2.0` can ship together). Only packages listed in the changeset bump.

## Neutral-boundary rules

All six rules are checked by `.github/workflows/ci.yml`. A violation fails CI:

1. `@artificialpoets/components` never imports `@ap/brand`.
2. `@artificialpoets/components` never imports `next/*`.
3. `@artificialpoets/components/package.json` has no `@ap/brand` dep.
4. `@artificialpoets/tokens` has no `@ap/*` references.
5. `@artificialpoets/content` has no `@ap/*` references.
6. `@artificialpoets/content` never imports `next/*`.

If you need a piece of Next.js integration (e.g. `next/link`), write a thin wrapper in the **consumer** app — not in `@artificialpoets/components`. Example: `SegmentedTabs` (neutral) + `QueryTabs` (Next-aware wrapper in `apps/dashboard`).

## File structure conventions

- **Kebab-case filenames**: enforced by `eslint-plugin-filename-rules`.
- **Category folders in components**: `core/`, `data-display/`, `forms/`, `feedback/`, `layout/`, `navigation/`, `misc/`, `tables/`. New primitives go in the matching folder, not `misc/` as a dumping ground.
- **Stories colocated**: `button.tsx` lives next to `button.stories.tsx`.
- **Tests colocated or in `src/__tests__/`** — either convention is fine; consistency per package matters.
- **Exports**: add to both the category's `index.ts` and (if needed) to the top-level package `src/index.ts` barrel.

## Commit message style

Conventional-ish. Prefix with scope:

```
feat(components): add <Toggle> primitive
fix(content): CodeBlock lang fallback no longer emits undefined
chore(deps): bump shiki to 4.1.0
docs(components): expand CONTRIBUTING.md section 3
```

This doesn't drive release automation (Changesets do), but it keeps `git log` greppable.
