"use client";

import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import * as React from "react";

import { DropdownButton } from "../misc/dropdown";

/**
 * TableFilterTrigger — low-emphasis dropdown trigger for table headers.
 *
 * Renders as a plain <button> styled to blend with table column headers:
 *   - `text-muted-foreground`, hover → `text-foreground`
 *   - transparent outline (focus ring on focus)
 *   - automatic trailing `ChevronDown`
 *
 * Pair with `<Dropdown>` and `<DropdownMenu>` from `@artificialpoets/components/misc`:
 *
 * ```tsx
 * <Dropdown>
 *   <TableFilterTrigger aria-label="Filter by device">
 *     Device
 *   </TableFilterTrigger>
 *   <DropdownMenu anchor="bottom start">…</DropdownMenu>
 * </Dropdown>
 * ```
 *
 * Two size variants:
 *   - `fit`  (default) — shrinks to content (`inline-flex items-center gap-1`)
 *   - `fill` — spans the full header cell (`w-full justify-between gap-2`)
 *
 * Passing `className` merges on top of the base — last-write-wins for conflicts.
 */
export type TableFilterTriggerVariant = "fit" | "fill";

export interface TableFilterTriggerProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  /** Trigger label + optional inline summary (e.g. "(all)", counter badges). */
  children: React.ReactNode;
  /**
   * Size variant:
   * - `fit` (default) — tight auto-width layout.
   * - `fill` — fills the parent header cell with a justify-between layout.
   */
  variant?: TableFilterTriggerVariant;
  /** Replace the trailing chevron. Pass `null` to hide it. Defaults to `ChevronDown`. */
  endIcon?: React.ReactNode;
  /** Extra classes merged after the base styles (last write wins). */
  className?: string;
}

const BASE_CLASSES =
  "rounded font-bold text-muted-foreground outline-1 -outline-offset-1 outline-transparent hover:text-foreground focus:outline-2 focus:-outline-offset-2 focus:outline-ring";

const VARIANT_CLASSES: Record<TableFilterTriggerVariant, string> = {
  fit: "inline-flex items-center gap-1",
  fill: "inline-flex w-full items-center justify-between gap-2",
};

const DEFAULT_END_ICON = (
  <ChevronDown className="size-4 shrink-0" aria-hidden />
);

export function TableFilterTrigger({
  children,
  variant = "fit",
  endIcon = DEFAULT_END_ICON,
  className,
  type = "button",
  ...buttonProps
}: TableFilterTriggerProps) {
  return (
    <DropdownButton
      as="button"
      type={type}
      className={clsx(VARIANT_CLASSES[variant], BASE_CLASSES, className)}
      {...buttonProps}
    >
      {children}
      {endIcon}
    </DropdownButton>
  );
}
