# Contributing to @poeticui/components (Poetic UI)

This document is the written spec for **how we build components in Poetic UI**. Read it before adding or modifying anything in `packages/components/src/`. Reviewers will reference it; new contributors should come out of a single read knowing enough to ship a PR that looks like the rest of the library.

The guide is organized into seven sections that track the decisions you'll make while designing a component, followed by a **fully-worked `Toggle` example** that puts every rule together.

1. [Slot-composition pattern](#1-slot-composition-pattern)
2. [CVA for variants](#2-cva-for-variants)
3. [Semantic token usage](#3-semantic-token-usage)
4. [HeadlessUI integration](#4-headlessui-integration)
5. [Ref forwarding and polymorphic `as`](#5-ref-forwarding-and-polymorphic-as)
6. [Testing conventions](#6-testing-conventions)
7. [File organization](#7-file-organization)
8. [Worked example: `<Toggle>`](#8-worked-example-toggle)

---

## 1. Slot-composition pattern

The **default shape** of a Poetic UI component is a family of small, named sub-components that compose together — not a single component with dozens of props. The canonical reference is the `Fieldset` family:

```tsx
<Fieldset>
  <Legend>Shipping address</Legend>
  <Text>Where should we send it?</Text>
  <FieldGroup>
    <Field>
      <Label>Street</Label>
      <Input name="street" />
      <Description>Building number first.</Description>
    </Field>
    <Field>
      <Label>Country</Label>
      <Select name="country">{/* ... */}</Select>
      <ErrorMessage>Please pick a country.</ErrorMessage>
    </Field>
  </FieldGroup>
</Fieldset>
```

Other examples already in-tree: `Dialog` + `DialogTitle` + `DialogBody` + `DialogActions`, `Sidebar` + `SidebarHeader` + `SidebarBody` + `SidebarItem`, `SwitchGroup` + `SwitchField`, `DataTable` + `DataTableColumnHeader` + `DataTableFilterChips` + `DataTableEmptyState`.

### When to reach for this pattern

Use slot composition when the component has **more than one child slot** whose order, presence, or styling the consumer legitimately wants to control.

- **Good candidates:** forms (label + input + description + error), dialogs (title + body + actions), tables (header + row + footer), sidebars (header + body + footer), cards with action slots.
- **Not a good fit:** a leaf component with a single label (`Button`, `Badge`, `Skeleton`) — one component, plain children, done.

### How to design the sub-component API

1. **Every sub-component is its own named export.** No object-as-namespace tricks (`Dialog.Title`); just top-level named exports. The import surface becomes `import { Dialog, DialogTitle, DialogBody } from "@poeticui/components/feedback"`.
2. **Styling between siblings uses `data-slot` selectors.** Each sub-component sets `data-slot="label"` / `"control"` / `"description"` / `"icon"` on its root element. The parent targets them with Tailwind attribute selectors:
   ```css
   "[&>[data-slot=label]+[data-slot=control]]:mt-3"
   ```
   This lets the sub-components stay position-agnostic — they can appear in any order and the parent still knows how to space them.
3. **ARIA flows through HeadlessUI.** When the family is auth-y (form Field / Legend / ErrorMessage), build on `@headlessui/react`'s `Field` / `Label` / `Description` primitives. They wire `aria-labelledby`, `aria-describedby`, `aria-invalid`, and `aria-errormessage` automatically via context. See §4.
4. **Prefer context over prop drilling for cross-sibling state.** When a parent needs to broadcast a variant (e.g. `Dialog variant="alert"` styling its children), use a small React context defined in the parent file. See `packages/components/src/feedback/dialog.tsx` for the canonical example — `DialogTitle` and `DialogActions` read from `DialogContext` rather than taking a redundant `variant` prop at every call site.

### What the parent contributes

The parent typically:

- sets up layout utilities (`flex flex-col`, `space-y-8`),
- defines the inter-slot spacing via `data-slot` selectors,
- provides any HeadlessUI-backed context (Field, Disclosure, Menu, etc.),
- forwards a `className` pass-through.

Children are generally **structural primitives that the parent decorates via CSS selectors**. That's the whole trick — the composition is declarative at the JSX level but stays flexible because all the styling hooks live on attributes, not props.

---

## 2. CVA for variants

For any component that exposes **multiple visual variants, sizes, or color presets**, use [class-variance-authority](https://cva.style).

### Why CVA

- **Type-safe variants** — `<Button variant="outline">` autocompletes, typos fail compile
- **Composable** — combining variants is declarative, not imperative `clsx` chains
- **Tree-shakable** — unused variants don't ship
- **Industry standard** — shadcn/ui uses it; shared vocabulary for outside contributors

### When NOT to use CVA

If a component has exactly one visual shape and no sizes or presets, CVA adds ceremony for nothing. `Divider`, `Heading`, `Card`, `Skeleton` remain plain components with a `className` pass-through.

CVA is worth adopting the moment you'd otherwise write:

```tsx
// Don't do this
const classes = clsx(
  base,
  variant === 'outline' && outlineStyles,
  color === 'red' && redStyles,
  size === 'sm' && smallStyles,
);
```

### Pattern A — single `cva()` call (recommended)

When every (variant × size × color) combination is meaningful, express everything in one call.

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cx } from '../lib';

const badgeVariants = cva(
  'inline-flex items-center rounded-full font-medium',
  {
    variants: {
      color: {
        default: 'bg-muted text-muted-foreground',
        success: 'bg-success/20 text-success',
        warning: 'bg-warning/20 text-warning',
        danger: 'bg-destructive/20 text-destructive',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
      },
    },
    defaultVariants: { color: 'default', size: 'md' },
  },
);

type BadgeVariants = VariantProps<typeof badgeVariants>;

export function Badge({
  color,
  size,
  className,
  children,
}: BadgeVariants & { className?: string; children: React.ReactNode }) {
  return (
    <span className={cx(badgeVariants({ color, size }), className)}>
      {children}
    </span>
  );
}
```

### Pattern B — separate color lookup (for axis asymmetry)

Reach for this when one axis is only meaningful inside one branch. `Button` is the canonical case: 18 color presets apply only to `variant="solid"`. Putting color inside CVA would mean a 54-row `compoundVariants` array or style pollution. Instead keep CVA focused on `(variant, size)` and handle color with a separate lookup:

```tsx
const buttonVariants = cva(base, {
  variants: {
    variant: { solid, outline, plain },
    size: { sm, md, lg },
  },
  defaultVariants: { variant: 'solid', size: 'md' },
});

const buttonColors = {
  'dark/zinc': ['[--btn-bg:var(--color-neutral-900)]', /* ... */],
  orange: ['[--btn-bg:var(--color-orange-500)]', /* ... */],
  // ...
} as const;

export function Button({ variant, color, size, className, ...props }) {
  const resolvedVariant = variant ?? 'solid';
  return (
    <button
      className={cx(
        buttonVariants({ variant: resolvedVariant, size }),
        resolvedVariant === 'solid'
          ? buttonColors[color ?? 'dark/zinc']
          : null,
        className,
      )}
      {...props}
    />
  );
}
```

Reference: `packages/components/src/core/button.tsx`.

### CVA conventions (non-negotiable)

1. **Export the variants function** when it has reuse potential (`buttonVariants`, `badgeVariants`). This lets consumers generate styled elements without the wrapper (`<a className={buttonVariants({ variant: 'outline' })}>`).
2. **Derive types from CVA** via `VariantProps<typeof yourVariants>`. Never hand-redeclare variant names — they drift.
3. **Always include `defaultVariants`** for every axis so the component works with no props.
4. **Always use `cx()`** (not `clsx`) at the call site. `cx` applies tailwind-merge so consumer `className` cleanly overrides conflicting utilities.
5. **Keep base classes terse.** If you catch yourself writing 10+ utility classes in `base`, consider splitting the component instead.
6. **During migration, preserve backward compat.** Keep legacy boolean props as `@deprecated` aliases; resolve them into the new `variant` prop internally. Don't break existing call sites.

   ```tsx
   /** @deprecated Use `variant="outline"` instead. */
   outline?: boolean;
   // ...
   const resolvedVariant = variant ?? (outline ? 'outline' : 'solid');
   ```

---

## 3. Semantic token usage

Raw Tailwind color utilities (`text-gray-500`, `bg-white`, `border-red-200`, `text-neutral-950 dark:text-white`) are **banned** in `@poeticui/components` source. The dashboard ESLint rule enforces the same ban there (see DES-17). You must reach for the semantic token that expresses the role.

### The token map

| Role | Token | When to use |
|------|-------|-------------|
| Primary body text | `text-foreground` | Default label, heading, paragraph copy |
| Secondary / dimmed | `text-muted-foreground` | Help text, placeholder, inactive state |
| Primary surface | `bg-background` | Page chrome |
| Elevated surface | `bg-card` | Card containers, popover panels |
| Subtle surface | `bg-muted` | Striped rows, disabled backgrounds, subtle fills |
| Strong surface (inversion) | `bg-foreground` + `text-background` | "Active pill" that auto-inverts in dark mode |
| Divider | `border-border`, `ring-border`, `divide-border` | Every structural border |
| Focus outline | `outline-ring`, `ring-ring` | Focus affordance (maps to brand color via theme) |
| Brand accent | `bg-primary` + `text-primary-foreground` | Primary CTA, active state with brand color |
| Destructive | `text-destructive`, `bg-destructive/10`, `border-destructive/40` | Errors, destructive actions |
| Success | `text-success`, `bg-success/10` | Positive confirmation, success chips |
| Warning | `text-warning`, `bg-warning/10` | Amber warnings |
| Info | `text-info`, `bg-info/10`, `border-info/40` | Informational callouts, tip banners (blue) |
| Chart data | `text-chart-1` … `text-chart-10` | Non-semantic data-viz accents (blue, violet, cyan, etc.) |

### When the color is "data" (not styling)

Charts, Kanban-stage color maps, user-picked badge colors — these reference the palette intentionally. They go in `lib/chart-*.ts` or `components/charts/**` and are exempted from the ESLint rule via the app's allowlist. Keep them narrow: a chart-data config file is an allowlist candidate; a regular component is not.

### White text on colored backgrounds

Never write `text-white` in `@poeticui/components`. If the text paints on a brand or status background, pair the background with its matching foreground token:

```tsx
// ❌ Don't
<span className="bg-primary text-white">Save</span>

// ✅ Do
<span className="bg-primary text-primary-foreground">Save</span>
```

The foreground tokens auto-invert in dark mode; `text-white` doesn't.

### Opacity slots

Every semantic token accepts Tailwind's `/N` opacity suffix: `bg-primary/10`, `border-destructive/40`, `ring-ring/50`. Use these for soft backgrounds and subtle borders instead of picking a lighter shade from the raw palette.

---

## 4. HeadlessUI integration

We use `@headlessui/react` (v2.2+) for accessibility-heavy primitives — Menu, Popover, Dialog, Combobox, Listbox, Field. Wrap them rather than building from scratch when:

- The primitive needs keyboard + screen-reader behavior that is non-trivial (roving tabindex, focus trap, ARIA wiring).
- HeadlessUI already solves it (check [their docs](https://headlessui.com)).

**Don't wrap HeadlessUI when** the component is pure presentation (Badge, Skeleton, Stat) — no state, no interaction, no ARIA complexity.

### Conventions

1. **Re-export the primitive family under our names.** Consumers import from `@poeticui/components`, not `@headlessui/react`:

   ```tsx
   export function Popover(props: Headless.PopoverProps) {
     return <Headless.Popover {...props} />;
   }
   export function PopoverButton<T extends React.ElementType = typeof Button>({
     as = Button,
     ...props
   }: ...) {
     return <Headless.PopoverButton as={as} {...props} />;
   }
   export function PopoverPanel({ anchor = 'bottom', className, ...props }) {
     return (
       <Headless.PopoverPanel
         {...props}
         transition
         anchor={anchor}
         className={cx(/* our opinionated base styles */, className)}
       />
     );
   }
   ```

2. **Apply our styling in the wrapper.** That's where `bg-popover/90`, `backdrop-blur-xl`, `shadow-lg`, `ring-1 ring-border` go. Never ask consumers to style the panel.
3. **Keep anchor / transition / as props pass-through.** HeadlessUI's escape hatches are genuinely useful; don't swallow them.
4. **Pair with a `DropdownMenu` / `PopoverPanel` / `DialogPanel` wrapper.** The trigger stays structural (it's just a Button); the panel carries the visual chrome.

### When HeadlessUI context leaks into a child

Some components need to close a parent menu/popover when clicked (e.g. `SidebarItem` inside a mobile nav needs to call `CloseButton`). In those cases, use `Headless.CloseButton as={OurComponent}` to upgrade the trigger:

```tsx
<Headless.CloseButton as={Link} href={href} className={classes} />
```

Preserves the imperative close behavior without exposing Headless in the callsite.

---

## 5. Ref forwarding and polymorphic `as`

### `forwardRef`

Use `React.forwardRef` for any component that:

- wraps a native interactive element (`button`, `input`, `a`),
- might be used as a target for focus / scroll APIs,
- is composed with HeadlessUI (Headless often forwards refs down the tree).

Don't forwardRef a pure layout primitive (`Card`, `Stack`, `Divider`) unless there's a concrete need.

```tsx
export const SidebarItem = forwardRef(function SidebarItem(
  { current, className, children, ...props }: SidebarItemProps,
  ref: React.ForwardedRef<HTMLAnchorElement | HTMLButtonElement>,
) {
  // ...
});
```

Name the inner function (not anonymous) so React DevTools shows `SidebarItem` not `ForwardRef`.

### Polymorphic `as`

The `as` prop lets a component render as a different element while keeping its styling. It's useful but should be rare — most components have one sensible HTML element.

**Components that SHOULD support `as`:**
- `Button` (renders as `<button>` or `<a>` depending on whether `href` is passed — handled automatically).
- `DropdownButton`, `PopoverButton`, `MenuButton` — the HeadlessUI primitives that need to render as whatever the consumer's trigger is (`SidebarItem`, `NavbarItem`, a custom button).
- `Link` — our wrapper over `next/link` that also renders as a bare `<a>` when passed `href` directly.

**Components that SHOULDN'T support `as`:**
- Pure layout primitives (`Card`, `Stack`).
- Structured content families (`Dialog`, `Fieldset`, `Sidebar`) — they have semantic HTML assumptions baked in.

When supporting `as`, preserve the HeadlessUI type shape:

```tsx
export function DropdownButton<T extends React.ElementType = typeof Button>({
  as = Button,
  ...props
}: { className?: string } & Omit<Headless.MenuButtonProps<T>, 'as' | 'className'>) {
  return <Headless.MenuButton as={as} {...props} />;
}
```

The generic `T` flows consumer prop types through so `<DropdownButton as={Link} href="/foo" />` type-checks correctly.

---

## 6. Testing conventions

We use Jest + `@testing-library/react` (no `@testing-library/user-event` in `@poeticui/components` — use `fireEvent`). Tests live in `packages/components/src/__tests__/{directory}/{component}.test.tsx`, mirroring the source tree.

### Required coverage per component

At minimum, a component's test file covers:

1. **Default render** — component renders without throwing; children appear.
2. **Each variant / size** — visible evidence of the variant (class match, aria-selected, role).
3. **User-facing callbacks** — every `onX` prop is fired when the user performs the action (typically via `fireEvent.click` / `change` / `submit`).
4. **The `className` pass-through** — consumer-supplied className wins over conflicting base classes (verifies `cx()` wiring).

### Nice-to-haves

- **ARIA correctness** for interactive components: `role`, `aria-expanded`, `aria-selected`, `aria-invalid`. If the component uses HeadlessUI, you usually get this for free but should still assert the key attributes.
- **Controlled / uncontrolled mode** if the component exposes both.
- **Backward compat** if the component has `@deprecated` legacy props — one test asserts the legacy prop still works.

### What we don't do

- **No visual-regression snapshots.** They're brittle and don't catch real bugs.
- **No `userEvent`-style flaky typing simulations.** `fireEvent.change` is enough for our coverage level.
- **No 100% line coverage chasing.** We test *behaviors*, not lines.

### Harnesses

Some primitives need a surrounding context to mount (e.g. `TableCell` needs to live inside a `<table>`; `DropdownMenu` needs a `<Dropdown>`). Write a tiny `Wrap` helper at the top of the test file rather than rendering invalid HTML:

```tsx
function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <Dropdown>
      <DropdownButton>Open</DropdownButton>
      {children}
    </Dropdown>
  );
}
```

### ResizeObserver polyfill

HeadlessUI Menu / Popover use `ResizeObserver` internally. jsdom doesn't ship it. The polyfill lives in `jest.setup.js` — don't re-stub it per test.

---

## 7. File organization

```
packages/components/src/
  core/              # Button, Link — foundational primitives used by everything else
  data-display/      # Avatar, Badge, Card, Skeleton, Stat, Table
  feedback/          # Alert, Dialog, Hint, Toast wrapper
  forms/             # Fieldset family, Input, Select, Combobox, Checkbox, Switch, Radio
  layout/            # SidebarLayout, AppShell, PageHeader, StackedLayout, DrawerShell
  misc/              # Dropdown, Popover (generic primitives that don't fit elsewhere)
  navigation/        # Navbar, Sidebar, Breadcrumbs, Pagination, Tabs, SegmentedTabs
  tables/            # DataTable family, TablePaginationFooter
  styles/            # tokens.css, components.css, themes/
  lib/               # cx() helper
  __tests__/         # mirror of source tree

  {category}/index.ts    # barrel export for the category
  index.ts               # root barrel (re-exports every category)
```

### Rules

1. **One component per file.** The file name matches the primary export in kebab-case (`data-table-column-header.tsx` exports `DataTableColumnHeader`).
2. **Helpers live alongside the component that needs them.** A `use-data-table-state.ts` hook lives next to `data-table.tsx` in `tables/`, not in a top-level `hooks/` directory.
3. **Category `index.ts` re-exports every file in that directory.** Adding a new file in `forms/` means adding one line to `forms/index.ts`.
4. **Tests mirror the source directory.** `src/forms/checkbox.tsx` → `src/__tests__/forms/checkbox.test.tsx`.
5. **Feature-specific CSS lives in `src/styles/components.css`** — not colocated. This is a Tailwind-first library; ad-hoc component CSS files are a smell. If you catch yourself writing one, question whether it's really needed (usually it isn't).
6. **Respect the `"use client"` directive.** Any component that uses React state, refs, or event handlers gets `"use client"` at the top. Server-safe primitives (Skeleton, Badge) don't need it.

### Barrel exports

The root `src/index.ts` re-exports from each category:

```ts
// src/index.ts
export * from './core';
export * from './data-display';
// ...
```

The `package.json` subpath exports (`@poeticui/components/forms`, `@poeticui/components/tables`) map directly to the category `index.ts`:

```json
{
  "exports": {
    "./forms": "./src/forms/index.ts",
    "./tables": "./src/tables/index.ts"
  }
}
```

When you add a new file, add one line to the category barrel. When you add a new category, add a line to the root barrel **and** a subpath export to `package.json`.

---

## 8. Worked example: `<Toggle>`

A hypothetical two-state toggle button (pressed / not-pressed) that demonstrates every rule above. Not shipped — it's a reference, not production code.

### Design decisions

- It's a **leaf component** (single child — the label), so it doesn't need slot composition (§1).
- It has a `size` axis (`sm` / `md` / `lg`) and a `variant` axis (`default` / `outline`), so it uses **CVA Pattern A** (§2).
- It paints on semantic tokens only — `bg-primary`, `text-primary-foreground`, `bg-muted`, `border-border` (§3).
- No accessibility complexity beyond `role="button"` + `aria-pressed`, so **no HeadlessUI wrapper needed** (§4).
- It wraps `<button>` → **forwardRef** so it can be focused programmatically (§5).
- Lives at `packages/components/src/core/toggle.tsx` with a test at `packages/components/src/__tests__/core/toggle.test.tsx` (§7).

### Source

```tsx
// packages/components/src/core/toggle.tsx
"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

import { cx } from "../lib";

const toggleVariants = cva(
  // Base — structure + focus + transition
  [
    "inline-flex items-center justify-center gap-2 rounded-md font-medium",
    "outline-offset-2 transition-colors",
    "focus-visible:outline-2 focus-visible:outline-ring",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: [
          // Not pressed
          "bg-muted text-foreground hover:bg-muted/80",
          // Pressed (via aria-pressed="true")
          "aria-pressed:bg-primary aria-pressed:text-primary-foreground",
        ],
        outline: [
          "border border-border bg-transparent text-foreground hover:bg-muted",
          "aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:border-primary",
        ],
      },
      size: {
        sm: "h-7 px-2 text-xs",
        md: "h-9 px-3 text-sm",
        lg: "h-11 px-4 text-base",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

type ToggleVariants = VariantProps<typeof toggleVariants>;

export interface ToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange">,
    ToggleVariants {
  /** Controlled pressed state. */
  pressed?: boolean;
  /** Fires when the user clicks to toggle. */
  onPressedChange?: (pressed: boolean) => void;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { pressed = false, onPressedChange, variant, size, className, onClick, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={pressed}
      data-slot="control"
      className={cx(toggleVariants({ variant, size }), className)}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) onPressedChange?.(!pressed);
      }}
      {...props}
    >
      {children}
    </button>
  );
});
```

### Test

```tsx
// packages/components/src/__tests__/core/toggle.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { Toggle } from "../../core/toggle";

describe("Toggle", () => {
  test("renders with default variant/size", () => {
    render(<Toggle>Bold</Toggle>);
    const btn = screen.getByRole("button", { name: "Bold" });
    expect(btn).toHaveAttribute("aria-pressed", "false");
  });

  test("reflects `pressed` via aria-pressed", () => {
    render(<Toggle pressed>Bold</Toggle>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  test("fires onPressedChange with the inverted value on click", () => {
    const onPressedChange = jest.fn();
    render(<Toggle pressed={false} onPressedChange={onPressedChange}>Bold</Toggle>);
    fireEvent.click(screen.getByRole("button"));
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  test("outline variant swaps to border-based chrome", () => {
    const { container } = render(<Toggle variant="outline">Bold</Toggle>);
    expect(container.firstElementChild?.className).toMatch(/border-border/);
  });

  test("consumer className overrides conflicting base classes (cx/tailwind-merge)", () => {
    render(
      <Toggle className="bg-destructive" pressed>
        Bold
      </Toggle>,
    );
    // When pressed, base applies aria-pressed:bg-primary — but consumer-supplied
    // bg-destructive should win via tailwind-merge.
    const btn = screen.getByRole("button");
    expect(btn.className).toMatch(/bg-destructive/);
  });

  test("disabled state blocks the click handler", () => {
    const onPressedChange = jest.fn();
    render(
      <Toggle disabled pressed={false} onPressedChange={onPressedChange}>
        Bold
      </Toggle>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onPressedChange).not.toHaveBeenCalled();
  });
});
```

### What this covers from every section

| Section | Rule | How `<Toggle>` applies it |
|---|---|---|
| §1 | Leaf component doesn't need slot composition | Single `children` prop, no sub-components |
| §2 | Pattern A (single `cva()`) | Variant + size expressed in one call; `VariantProps<>` for the types |
| §3 | Semantic tokens only | `bg-muted`, `bg-primary`, `text-primary-foreground`, `border-border`, `outline-ring` |
| §4 | No HeadlessUI needed | Pure native `<button>` + `aria-pressed` |
| §5 | `forwardRef` because it wraps an interactive element | `forwardRef<HTMLButtonElement, ToggleProps>` |
| §6 | Default render, every variant, callback, className override, disabled | 6 tests, each aligned to a rule |
| §7 | `core/toggle.tsx` + `__tests__/core/toggle.test.tsx` | Mirrored directory structure; one component per file |

Ship a PR that follows this template and a reviewer should only need to check your semantic-token choices and the behavioral tests. Everything else is mechanical.

---

## 9. Authoring for agents

Coding agents (Claude Code, Cursor, Codex) consume PoeticUI through a machine-readable surface — `registry.json`, `llms.txt`, the MCP server, JSON tokens. The conventions below make components grep-able, predictable, and self-documenting, minimizing the failure modes that cause agents to hallucinate component names, prop values, or compositions.

These rules are **non-negotiable for new components**. Existing components are migrated as part of [DES tracking issue AP-503](https://linear.app/artificial-poets/issue/AP-503/anti-hallucination-authoring-conventions).

### 9.1. `data-component` attribute (required)

Every primitive's root JSX element sets `data-component="<kebab-case-name>"`. Slot-family sub-components each get their own value.

```tsx
// Single primitive
export function Card({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div data-component="card" {...props} className={cx("...", className)} />;
}

// Slot family — every sub-component gets its own value
export function Fieldset(props) { return <Headless.Fieldset data-component="fieldset" {...props} />; }
export function Legend(props)   { return <Headless.Legend   data-component="legend"   {...props} />; }
export function FieldGroup(props){ return <div              data-component="field-group" {...props} />; }
```

This lets an agent inspecting rendered DOM disambiguate `<button data-component="button">` from `<button data-component="dropdown-trigger">`. The attribute is also used by `registry.json`'s tag inference and by integration tests.

**The `data-slot` attribute is preserved alongside.** `data-slot` describes the *role within a parent's layout* (`label`, `control`, `description`); `data-component` describes *which primitive emitted this DOM*. Both can coexist on one element.

### 9.2. JSDoc `@example` block (required)

Every exported primitive has a JSDoc block above its declaration containing **one canonical example**. This becomes the `canonicalExample` field in `registry.json`, the per-component section in `llms-full.txt`, and the `get_component(name)` MCP tool response — the example an agent will copy verbatim.

```tsx
/**
 * A solid, outline, or plain button with 18 color presets.
 *
 * @example
 * <Button variant="outline" size="sm">
 *   Save
 * </Button>
 */
export const Button = forwardRef(...);
```

Rules:
- **One** `@example` per export. Pick the most idiomatic — defaults, no exotic combos.
- The example must be copy-paste-runnable: no undeclared variables, no missing imports.
- Prefer string children; reserve composed JSX for components whose whole point is composition (Fieldset, Dialog, DataTable).
- Use callbacks like `onClick={() => console.log(...)}`, not references to undefined `handleClick`.

For a slot family, document each sub-component with its own `@example` showing how it composes:

```tsx
/** Title for a Dialog. Required first child. */
export function DialogTitle(props) { ... }

/** @example <DialogActions><Button>Cancel</Button><Button color="dark/zinc">Save</Button></DialogActions> */
export function DialogActions(props) { ... }
```

### 9.3. Stable error message prefixes

Any `throw new Error(...)` (or `console.warn`/`console.error` for dev guards) inside a component uses this format:

```
[@poeticui/components/<category>/<name>] <description>
```

```tsx
// Bad — agent has to guess where this came from
throw new Error("Invalid children");

// Good — single grep finds it
throw new Error(
  `[@poeticui/components/navigation/segmented-tabs] expected children to be SegmentedTabsItem; got ${typeof child}`,
);
```

### 9.4. Ambiguous overloads → dev warnings

When prop A makes prop B unused (e.g. `Button`'s `color` is only honored when `variant === 'solid'`), warn in development. Production stays silent — warnings exist to surface bugs during agent iteration.

```tsx
if (process.env.NODE_ENV !== "production" && variant !== "solid" && color) {
  console.warn(
    `[@poeticui/components/core/button] \`color\` is only applied when \`variant="solid"\`; got variant=${variant}`,
  );
}
```

### 9.5. One canonical export path

Every primitive is exported through:
1. Its category's `index.ts` (e.g. `core/index.ts` → `Button`)
2. The root `src/index.ts` barrel

There is no third path — no deep imports that compete (`@poeticui/components/core/button` versus `@poeticui/components/core` versus `@poeticui/components`). Agents and the MCP server return one stable import for each component; aliases dilute that.

### 9.6. `as` polymorphism stays rare

§5 already says "the `as` prop should be rare." Apply strictly:
- For non-trivial polymorphism, prefer named exports (`<ButtonLink>`) over `<Button as={Link}>`.
- Where `as` is essential (HeadlessUI slot patterns like `MenuButton as={Link}`), JSDoc the typing pattern explicitly with an `@example`.

### 9.7. PR checklist

Reviewers verify each item before merging a new primitive:

- [ ] Root element has `data-component="<kebab-name>"`
- [ ] Every export has a JSDoc block with one `@example`
- [ ] Errors use the `[@poeticui/components/...]` prefix
- [ ] Ambiguous prop combinations have dev warnings
- [ ] Component is exported from category `index.ts` and root barrel
- [ ] No new `as` prop usage without RFC discussion

CI fails (via `.github/workflows/ci.yml` greps) when:
- A `.tsx` file under `src/` has an `export function` / `export const` declaration without a preceding `@example` JSDoc tag
- A primitive's root element omits `data-component`
- A `throw new Error(` inside `src/` lacks the `[@poeticui/components/` prefix

---

## Storybook — preview & docs

Every new component lands with a `<component>.stories.tsx` file next to the source. The Storybook surface is the design system reference — live previews, variant matrices, theme switcher, a11y checks, and MDX doc pages.

```
bun run storybook          # dev server on :6006
bun run storybook:build    # static build → packages/components/storybook-static/
```

### Story file conventions

- **File location**: `<component>.stories.tsx` next to the component file
- **Title format**: `"<Category>/<Component>"` — one of `Core`, `Data Display`, `Forms`, `Feedback`, `Layout`, `Misc`, `Navigation`, `Tables`
- **Meta**: `satisfies Meta<typeof Component>` with `tags: ["autodocs"]`
- **argTypes**: `control: "select"` with explicit `options` for union-type props; `control: "boolean"` for booleans; omit for `React.ReactNode` slots
- **Required exports**: `Default`, one story per meaningful variant, and a final `VariantMatrix` render for combinatorial review
- **Composite families** (Dropdown, Dialog, Fieldset, Table): **one story file** in the family's barrel folder, multiple top-level stories showing different slot compositions

Reference file: `src/core/button.stories.tsx` — matches every convention above.

### MDX docs

Category intros live at `.storybook/*.mdx`. `Welcome.mdx` is the landing page, `DesignTokens.mdx` documents the token contract + OKLCH palette, `ChartRecipes.mdx` holds Recharts composition patterns (charts live in the dashboard). Add one sentence to the relevant category MDX when introducing a new component.

## See also

- `docs/RFC-ARCHITECTURE.md` — the neutral-primitives / branded-overlay split that shapes the library's future package structure.
- `src/styles/tokens.css` — the full token map (re-exported from `@poeticui/tokens`).
- `apps/dashboard/eslint.config.mjs` — the raw-color ban rule, for reference.
- **Storybook** — `bun run storybook` from the monorepo root → `http://localhost:6006`. Full component catalog, live previews, theme switcher, a11y notes.
- **`@poeticui/content`** (`packages/content/`) — the sibling package for **technical-content primitives** (syntax-highlighted `<CodeBlock>`, `<BlockMath>`/`<InlineMath>`, `<PackageManagerTabs>`, `<LanguageTabs>`). Reach for it in docs/examples/marketing pages or any app surface that needs cross-instance preference sync. Opt-in — consumers who don't install pay zero bytes. See `packages/content/README.md`.
