"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cx } from "../lib";

/**
 * Segmented pill tabs — a row of mutually-exclusive buttons with a highlighted
 * active pill, typically used as a view-mode toggle (e.g. "Combined | Desktop
 * | Mobile").
 *
 * This is the Poetic UI replacement for the `flex rounded-lg bg-muted/50 p-1
 * + button[role=tab]` pattern that was duplicated across 4 dashboard files.
 *
 * Supports both APIs:
 *
 * 1. **Options-prop (simple)** — pass an `options` array:
 *    ```tsx
 *    <SegmentedTabs value={v} onValueChange={setV} options={[
 *      { value: 'combined', label: 'Combined' },
 *      { value: 'desktop',  label: 'Desktop' },
 *    ]} />
 *    ```
 *
 * 2. **Compound children (flexible)** — use `<SegmentedTabs.Item>` for custom
 *    content (icons, long labels, etc.):
 *    ```tsx
 *    <SegmentedTabs value={v} onValueChange={setV}>
 *      <SegmentedTabs.Item value="desktop"><Monitor /> Desktop</SegmentedTabs.Item>
 *    </SegmentedTabs>
 *    ```
 */

const containerVariants = cva("inline-flex gap-1 rounded-lg bg-muted/50", {
  variants: {
    size: {
      sm: "p-0.5",
      md: "p-1",
    },
    fullWidth: {
      true: "flex w-full flex-wrap sm:w-fit",
      false: "w-fit",
    },
  },
  defaultVariants: {
    size: "md",
    fullWidth: false,
  },
});

const itemVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium leading-none transition-colors",
  {
    variants: {
      size: {
        sm: "h-7 px-2.5 text-xs",
        md: "h-8 px-3 text-sm",
      },
      active: {
        true: "bg-card text-foreground shadow-sm",
        false: "text-muted-foreground hover:text-foreground",
      },
    },
    defaultVariants: {
      size: "md",
      active: false,
    },
  },
);

export type SegmentedTabsSize = NonNullable<
  VariantProps<typeof containerVariants>["size"]
>;

interface SegmentedTabsContextValue {
  value: string;
  onValueChange: (next: string) => void;
  size: SegmentedTabsSize;
}

const SegmentedTabsContext =
  React.createContext<SegmentedTabsContextValue | null>(null);

function useSegmentedTabsContext(component: string): SegmentedTabsContextValue {
  const ctx = React.useContext(SegmentedTabsContext);
  if (!ctx) {
    throw new Error(
      `[@poeticui/components/navigation/segmented-tabs] <${component} /> must be rendered inside a <SegmentedTabs> parent.`,
    );
  }
  return ctx;
}

export interface SegmentedTabsOption<TValue extends string = string> {
  value: TValue;
  label: React.ReactNode;
}

interface BaseSegmentedTabsProps<TValue extends string = string> {
  value: TValue;
  onValueChange: (next: TValue) => void;
  /** `md` (default, 32px tall) or `sm` (28px tall). */
  size?: SegmentedTabsSize;
  /** When true, the row takes full width on mobile and auto width from `sm:` up. */
  fullWidth?: boolean;
  /** ARIA label for the tablist (recommended when no visible heading precedes the tabs). */
  "aria-label"?: string;
  className?: string;
}

interface OptionsPropProps<
  TValue extends string,
> extends BaseSegmentedTabsProps<TValue> {
  options: SegmentedTabsOption<TValue>[];
  children?: never;
}

interface ChildrenProps<
  TValue extends string,
> extends BaseSegmentedTabsProps<TValue> {
  options?: never;
  children: React.ReactNode;
}

type SegmentedTabsProps<TValue extends string> =
  | OptionsPropProps<TValue>
  | ChildrenProps<TValue>;

export function SegmentedTabs<TValue extends string = string>({
  value,
  onValueChange,
  size = "md",
  fullWidth = false,
  className,
  options,
  children,
  ...rest
}: SegmentedTabsProps<TValue>) {
  const ctx = React.useMemo<SegmentedTabsContextValue>(
    () => ({
      value,
      onValueChange: onValueChange as (next: string) => void,
      size,
    }),
    [value, onValueChange, size],
  );

  return (
    <SegmentedTabsContext.Provider value={ctx}>
      <div
        role="tablist"
        aria-label={rest["aria-label"]}
        className={cx(containerVariants({ size, fullWidth }), className)}
      >
        {options
          ? options.map((opt) => (
              <SegmentedTabsItem key={opt.value} value={opt.value}>
                {opt.label}
              </SegmentedTabsItem>
            ))
          : children}
      </div>
    </SegmentedTabsContext.Provider>
  );
}

export interface SegmentedTabsItemProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "value" | "onSelect"
> {
  value: string;
  children: React.ReactNode;
}

export function SegmentedTabsItem({
  value,
  children,
  className,
  onClick,
  ...buttonProps
}: SegmentedTabsItemProps) {
  const ctx = useSegmentedTabsContext("SegmentedTabs.Item");
  const active = ctx.value === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      onClick={(event) => {
        ctx.onValueChange(value);
        onClick?.(event);
      }}
      className={cx(itemVariants({ size: ctx.size, active }), className)}
      {...buttonProps}
    >
      {children}
    </button>
  );
}

// Attach for the compound-component API: <SegmentedTabs.Item>
SegmentedTabs.Item = SegmentedTabsItem;
