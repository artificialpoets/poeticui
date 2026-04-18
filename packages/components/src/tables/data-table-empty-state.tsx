"use client";

import { TableCell, TableRow } from "../data-display/table";
import { cx } from "../lib";

/**
 * DataTableEmptyState — single `<tr>` with a full-width centered message.
 *
 * Use inside a `<TableBody>` when there are no rows to render. Distinguishes
 * between "no data at all" and "no data matches your filters" so the copy
 * can adapt.
 *
 * ```tsx
 * <TableBody>
 *   {rows.length === 0 ? (
 *     <DataTableEmptyState
 *       colSpan={columns.length}
 *       hasFilters={activeFilters > 0}
 *       message="No sites yet."
 *       filteredMessage="No sites match your filters."
 *     />
 *   ) : (
 *     rows.map(...)
 *   )}
 * </TableBody>
 * ```
 */
export function DataTableEmptyState({
  colSpan,
  message = "No results.",
  hasFilters = false,
  filteredMessage = "No results match your filters.",
  className,
}: {
  colSpan: number;
  message?: string;
  hasFilters?: boolean;
  filteredMessage?: string;
  className?: string;
}) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className={cx(
          "py-10 text-center text-sm text-muted-foreground",
          className,
        )}
      >
        {hasFilters ? filteredMessage : message}
      </TableCell>
    </TableRow>
  );
}
