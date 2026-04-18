"use client";

import clsx from "clsx";
import type React from "react";
import { createContext, useContext, useState } from "react";

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
  return (
    <TableContext.Provider
      value={
        { bleed, compact, dense, grid, striped } as React.ContextType<
          typeof TableContext
        >
      }
    >
      <div className="flow-root">
        <div
          {...props}
          className={clsx(
            className,
            "-mx-(--gutter) whitespace-nowrap",
            scroll && "overflow-x-auto",
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

export function TableHead({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"thead">) {
  return (
    <thead {...props} className={clsx(className, "text-muted-foreground")} />
  );
}

export function TableBody(props: React.ComponentPropsWithoutRef<"tbody">) {
  return <tbody {...props} />;
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

export function TableHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"th">) {
  const { bleed, compact, grid } = useContext(TableContext);

  return (
    <th
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
