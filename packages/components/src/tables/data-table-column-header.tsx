"use client";

import { ArrowDown, ArrowUp } from "lucide-react";

import { DataTableFilterPopover } from "./data-table-filter-popover";
import {
  getSortedHeaderClass,
  type SortedColumnAlign,
} from "./sorted-column-classes";
import { TableHeader } from "../data-display/table";
import { cx } from "../lib";

/**
 * DataTableColumnHeader — one `<th>` with optional sort + filter affordances.
 *
 * Standalone primitive lifted out of `DataTable`. Consumers can use it in any
 * table built from `@poeticui/components` Table primitives when they need the standard sort
 * button + filter popover behavior without adopting the full `DataTable`
 * orchestrator.
 *
 * ```tsx
 * <TableHead>
 *   <TableRow>
 *     <DataTableColumnHeader
 *       label="Name"
 *       sortable
 *       sorted={sortKey === "name"}
 *       sortDir={sortDir}
 *       onSort={() => toggleSort("name")}
 *       filterable
 *       filterValue={filters.name ?? ""}
 *       onFilterChange={(v) => setFilter("name", v)}
 *     />
 *   </TableRow>
 * </TableHead>
 * ```
 */
export function DataTableColumnHeader({
  label,
  align = "left",
  sortable = false,
  sorted = false,
  sortDir,
  onSort,
  filterable = false,
  filterValue = "",
  onFilterChange,
  className,
}: {
  label: React.ReactNode;
  align?: SortedColumnAlign;
  sortable?: boolean;
  sorted?: boolean;
  sortDir?: "asc" | "desc";
  onSort?: () => void;
  filterable?: boolean;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  className?: string;
}) {
  return (
    <TableHeader
      scope="col"
      className={cx(
        getSortedHeaderClass({ align, isActive: sorted }),
        className,
      )}
    >
      <div
        className={cx(
          "flex items-center gap-1.5",
          align === "right" && "justify-end",
        )}
      >
        {sortable ? (
          <button
            type="button"
            onClick={onSort}
            className={cx(
              "inline-flex items-center gap-1 hover:text-foreground",
              sorted ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <span>{label}</span>
            {sorted ? (
              sortDir === "asc" ? (
                <ArrowUp className="size-3.5 shrink-0" aria-hidden />
              ) : (
                <ArrowDown className="size-3.5 shrink-0" aria-hidden />
              )
            ) : (
              <span
                className="inline-block size-3.5 shrink-0 opacity-0"
                aria-hidden
              />
            )}
          </button>
        ) : (
          <span>{label}</span>
        )}

        {filterable && onFilterChange && (
          <DataTableFilterPopover
            value={filterValue}
            onChange={onFilterChange}
          />
        )}
      </div>
    </TableHeader>
  );
}
