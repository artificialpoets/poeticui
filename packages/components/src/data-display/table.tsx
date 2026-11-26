"use client";

import clsx from "clsx";
import type React from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";

import { Link } from "../core/link";

const TableContext = createContext<{
  bleed: boolean;
  compact: boolean;
  dense: boolean;
  grid: boolean;
  striped: boolean;
}>({
  bleed: false,
  compact: false,
  dense: false,
  grid: false,
  striped: false,
});

/**
 * Tabular data with horizontal scrolling, striping, dense rows, gridlines.
 * Compose with {@link TableHead}, {@link TableBody}, {@link TableRow},
 * {@link TableHeader}, and {@link TableCell}. Pass `href` on a row to make
 * the entire row clickable.
 *
 * @example
 * <Table striped>
 *   <TableHead>
 *     <TableRow>
 *       <TableHeader>Name</TableHeader>
 *       <TableHeader>Email</TableHeader>
 *     </TableRow>
 *   </TableHead>
 *   <TableBody>
 *     <TableRow href="/users/1">
 *       <TableCell>Ada</TableCell>
 *       <TableCell>ada@example.com</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 */
export function Table({
  bleed = false,
  compact = false,
  dense = false,
  grid = false,
  scroll = true,
  striped = false,
  className,
  tableClassName,
  children,
  onFocus,
  onBlur,
  ...props
}: {
  bleed?: boolean;
  compact?: boolean;
  dense?: boolean;
  grid?: boolean;
  scroll?: boolean;
  striped?: boolean;
  /** Merged onto the native `<table>` element (e.g. `table-fixed border-collapse`). */
  tableClassName?: string;
} & React.ComponentPropsWithoutRef<"div">) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const overflowing = useHorizontalOverflow(scrollRef, scroll);
  // Whether the wrapper itself (not a cell inside it) has focus.
  const [wrapperFocused, setWrapperFocused] = useState(false);
  // Safari never makes a scroll container a Tab stop, so a keyboard user could
  // not reach the hidden columns. While the table overflows, the wrapper is
  // focusable (arrow keys scroll it) and, when the caller names it, a region.
  // It stays focusable while it has focus, so a table that stops overflowing
  // (the window widened) does not drop focus to the body.
  const focusable = overflowing || wrapperFocused;
  const named = props["aria-label"] != null || props["aria-labelledby"] != null;
  const scrollA11y: React.ComponentPropsWithoutRef<"div"> = focusable
    ? { tabIndex: 0, ...(named ? { role: "region" } : {}) }
    : {};

  return (
    <TableContext.Provider
      value={
        { bleed, compact, dense, grid, striped } as React.ContextType<
          typeof TableContext
        >
      }
    >
      <div data-component="table" className="flow-root">
        <div
          ref={scrollRef}
          {...scrollA11y}
          {...props}
          onFocus={(event) => {
            if (event.target === event.currentTarget) setWrapperFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            if (event.target === event.currentTarget) setWrapperFocused(false);
            onBlur?.(event);
          }}
          className={clsx(
            className,
            "-mx-(--gutter) whitespace-nowrap",
            scroll && "overflow-x-auto",
            focusable &&
              "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
          )}
        >
          <div
            className={clsx(
              "inline-block min-w-full align-middle",
              !bleed && "sm:px-(--gutter)",
            )}
          >
            <table
              className={clsx(
                "min-w-full text-left text-sm/6 text-foreground",
                tableClassName,
              )}
            >
              {children}
            </table>
          </div>
        </div>
      </div>
    </TableContext.Provider>
  );
}

/**
 * True while the element's content is wider than its box. Starts false on both
 * server and client (no hydration mismatch) and is measured in an effect.
 */
function useHorizontalOverflow(
  ref: React.RefObject<HTMLElement | null>,
  enabled: boolean,
): boolean {
  const [overflowing, setOverflowing] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) {
      setOverflowing(false);
      return;
    }
    const measure = () => setOverflowing(el.scrollWidth > el.clientWidth + 1);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    // The table grows inside the wrapper without resizing it: watch it too.
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => observer.disconnect();
  }, [ref, enabled]);
  return overflowing;
}

/**
 * Header section of a {@link Table}. Wraps `<thead>`.
 *
 * @example <TableHead><TableRow><TableHeader>Name</TableHeader></TableRow></TableHead>
 */
export function TableHead({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"thead">) {
  return (
    <thead
      data-component="table-head"
      {...props}
      className={clsx(className, "text-muted-foreground")}
    />
  );
}

/**
 * Body section of a {@link Table}. Wraps `<tbody>`.
 *
 * @example <TableBody><TableRow>...</TableRow></TableBody>
 */
export function TableBody(props: React.ComponentPropsWithoutRef<"tbody">) {
  return <tbody data-component="table-body" {...props} />;
}

const TableRowContext = createContext<{
  href?: string;
  target?: string;
  title?: string;
}>({
  href: undefined,
  target: undefined,
  title: undefined,
});

/**
 * A row in a {@link Table}. When `href` is provided, the entire row becomes
 * clickable (an invisible Link covers each cell while preserving cell content).
 *
 * @example
 * <TableRow href="/customers/abc">
 *   <TableCell>Acme Co.</TableCell>
 *   <TableCell>$1,200</TableCell>
 * </TableRow>
 */
export function TableRow({
  href,
  target,
  title,
  className,
  ...props
}: {
  href?: string;
  target?: string;
  title?: string;
} & React.ComponentPropsWithoutRef<"tr">) {
  const { striped } = useContext(TableContext);

  return (
    <TableRowContext.Provider
      value={
        { href, target, title } as React.ContextType<typeof TableRowContext>
      }
    >
      <tr
        data-component="table-row"
        {...props}
        className={clsx(
          className,
          href &&
            "focus-within:bg-muted has-[[data-row-link][data-focus]]:ring-2 has-[[data-row-link][data-focus]]:ring-ring has-[[data-row-link][data-focus]]:ring-inset",
          striped && "even:bg-muted/50",
        )}
      />
    </TableRowContext.Provider>
  );
}

/**
 * Column-header cell within a {@link TableHead} {@link TableRow}.
 *
 * @example <TableHeader>Name</TableHeader>
 */
export function TableHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"th">) {
  const { bleed, compact, grid } = useContext(TableContext);

  return (
    <th
      data-component="table-header"
      {...props}
      className={clsx(
        className,
        // Use the same vertical rhythm as `.table-footer` (py-4) so sticky headers
        // feel proportionate next to the pagination footer.
        "table-header-sticky border-b border-b-border py-4 font-bold first:pl-(--gutter,--spacing(2)) last:pr-(--gutter,--spacing(2))",
        compact ? "px-2" : "px-4",
        grid && "border-l border-l-border first:border-l-0",
        !bleed && "sm:first:pl-1 sm:last:pr-1",
      )}
    />
  );
}

/**
 * Data cell within a {@link TableBody} {@link TableRow}.
 *
 * @example <TableCell>Acme Co.</TableCell>
 */
export function TableCell({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"td">) {
  const { bleed, compact, dense, grid, striped } = useContext(TableContext);
  const { href, target, title } = useContext(TableRowContext);
  const [cellRef, setCellRef] = useState<HTMLElement | null>(null);

  return (
    <td
      data-component="table-cell"
      ref={href ? setCellRef : undefined}
      {...props}
      className={clsx(
        className,
        "relative first:pl-(--gutter,--spacing(2)) last:pr-(--gutter,--spacing(2))",
        compact ? "px-2" : "px-4",
        !striped && "border-b border-border",
        grid && "border-l border-l-border first:border-l-0",
        dense ? "py-2.5" : "py-4",
        !bleed && "sm:first:pl-1 sm:last:pr-1",
      )}
    >
      {href && (
        <Link
          data-row-link
          href={href}
          target={target}
          aria-label={title}
          tabIndex={cellRef?.previousElementSibling === null ? 0 : -1}
          className="absolute inset-0 focus:outline-hidden"
        />
      )}
      {children}
    </td>
  );
}
