"use client";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableEmptyState } from "./data-table-empty-state";
import { DataTableFilterChips } from "./data-table-filter-chips";
import {
  getSortedCellClass,
  type SortedColumnAlign,
} from "./sorted-column-classes";
import { TablePaginationFooter } from "./table-pagination-footer";
import { useDataTableState } from "./use-data-table-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../data-display/table";
import { cx } from "../lib";

// ─── Column definition ────────────────────────────────────────────────────────

export type DataTableColumn<Row> = {
  key: string;
  header: string;
  cell: (row: Row) => React.ReactNode;
  /** Makes the column sortable using this extractor */
  sortValue?: (row: Row) => string | number;
  /** Makes the column filterable using this extractor */
  searchValue?: (row: Row) => string;
  align?: SortedColumnAlign;
  className?: string;
};

export type DataTableProps<Row> = {
  columns: DataTableColumn<Row>[];
  rows: Row[];
  getRowKey?: (row: Row, index: number) => React.Key;
  defaultSortKey?: string;
  defaultSortDir?: "asc" | "desc";
  pageSizeOptions?: readonly number[];
  emptyMessage?: string;
  /**
   * A leading "#" column with each row's position in the current sort and
   * filter, counting across pages (page 3 at 25 per page starts at 51).
   * - `"never"` (default): no column.
   * - `"always"`: always shown.
   * - `"auto"`: shown when `rows` (the unfiltered total) has more than
   *   `rowNumbersThreshold` records. It stays while the reader filters.
   */
  rowNumbers?: "never" | "always" | "auto";
  /** Record count `"auto"` row numbers must exceed. Default 10. */
  rowNumbersThreshold?: number;
};

const DEFAULT_PAGE_SIZE_OPTIONS = [25, 50, 100] as const;
const DEFAULT_ROW_NUMBERS_THRESHOLD = 10;
const ROW_NUMBER_WIDTH_CLASS = "w-12 min-w-12 max-w-12";

/** Whether a DataTable with `total` records shows its "#" column. */
export function showsRowNumbers(
  mode: NonNullable<DataTableProps<unknown>["rowNumbers"]>,
  total: number,
  threshold: number = DEFAULT_ROW_NUMBERS_THRESHOLD,
): boolean {
  switch (mode) {
    case "always":
      return true;
    case "never":
      return false;
    case "auto":
      return total > threshold;
    default: {
      const exhaustive: never = mode;
      return exhaustive;
    }
  }
}

/**
 * DataTable — orchestrator for a sortable, filterable, paginated table.
 *
 * Thin shell around composable sub-components. All are individually exported
 * from `@artificialpoets/components/tables` for hand-assembly:
 *
 * - `useDataTableState` — state + derived data hook
 * - `DataTableFilterChips` — active filter indicators
 * - `DataTableColumnHeader` — sortable + filterable `<th>`
 * - `DataTableFilterPopover` — standalone filter input (used inside column header)
 * - `DataTableEmptyState` — no-rows fallback
 * - `TablePaginationFooter` — page + per-page controls
 */
export function DataTable<Row>({
  columns,
  rows,
  getRowKey,
  defaultSortKey,
  defaultSortDir = "desc",
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  emptyMessage = "No results.",
  rowNumbers = "never",
  rowNumbersThreshold = DEFAULT_ROW_NUMBERS_THRESHOLD,
}: DataTableProps<Row>) {
  const state = useDataTableState({
    columns,
    rows,
    defaultSortKey,
    defaultSortDir,
    pageSizeOptions,
  });

  const resultCount =
    state.totalCount !== rows.length
      ? `${state.totalCount.toLocaleString()} of ${rows.length.toLocaleString()} results`
      : state.totalCount === 1
        ? "1 result"
        : `${state.totalCount.toLocaleString()} results`;

  const numbered = showsRowNumbers(
    rowNumbers,
    rows.length,
    rowNumbersThreshold,
  );
  const firstRowNumber = (state.page - 1) * state.pageSize + 1;

  return (
    <div
      className={cx(
        "table-with-filters-viewport",
        state.paginatedRows.length < 6 && "table-with-filters-viewport--auto",
      )}
    >
      <div className="table-panel">
        <DataTableFilterChips
          filters={state.filterChips}
          onRemove={(key) => state.handleSearchChange(key, "")}
          onClearAll={state.clearAllFilters}
        />

        <div className="table-scroll-region">
          <Table
            bleed
            compact
            scroll={false}
            striped
            className="!mx-0 w-full [--gutter:--spacing(3)] lg:[--gutter:--spacing(5)]"
          >
            <TableHead>
              <TableRow>
                {numbered && (
                  <TableHeader
                    scope="col"
                    className={cx(
                      ROW_NUMBER_WIDTH_CLASS,
                      // Sticky like every other DataTable header, so "#" stays with them on scroll.
                      "table-header-sticky text-right font-bold text-muted-foreground",
                    )}
                  >
                    #
                  </TableHeader>
                )}
                {columns.map((col) => (
                  <DataTableColumnHeader
                    key={col.key}
                    label={col.header}
                    align={col.align ?? "left"}
                    sortable={!!col.sortValue}
                    sorted={state.sortKey === col.key}
                    sortDir={
                      state.sortKey === col.key ? state.sortDir : undefined
                    }
                    onSort={() => state.handleSort(col.key)}
                    filterable={!!col.searchValue}
                    filterValue={state.columnSearch[col.key] ?? ""}
                    onFilterChange={(v) => state.handleSearchChange(col.key, v)}
                    className={col.className}
                  />
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {state.paginatedRows.length === 0 ? (
                <DataTableEmptyState
                  colSpan={columns.length + (numbered ? 1 : 0)}
                  message={emptyMessage}
                  hasFilters={state.filterChips.length > 0}
                />
              ) : (
                state.paginatedRows.map((row, i) => (
                  <TableRow key={getRowKey ? getRowKey(row, i) : i}>
                    {numbered && (
                      <TableCell
                        className={cx(
                          ROW_NUMBER_WIDTH_CLASS,
                          "text-right tabular-nums text-muted-foreground",
                        )}
                      >
                        {firstRowNumber + i}
                      </TableCell>
                    )}
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        className={cx(
                          getSortedCellClass({
                            align: col.align ?? "left",
                            isActive: state.sortKey === col.key,
                          }),
                          col.className,
                        )}
                      >
                        {col.cell(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <TablePaginationFooter
          page={state.page}
          totalPages={state.totalPages}
          pageSize={state.pageSize}
          pageSizeOptions={pageSizeOptions}
          onPageChange={state.setPage}
          onPageSizeChange={state.setPageSize}
          rightSlot={
            <span className="text-sm text-muted-foreground">{resultCount}</span>
          }
        />
      </div>
    </div>
  );
}
