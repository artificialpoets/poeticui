"use client";

import { useCallback, useMemo, useState } from "react";

import type { DataTableColumn } from "./data-table";
import type { DataTableFilterChip } from "./data-table-filter-chips";

/**
 * useDataTableState — state + derived data for a `DataTable`.
 *
 * Exposed publicly so consumers can hand-compose a table from
 * `DataTableColumnHeader` / `DataTableFilterChips` / `DataTableEmptyState` /
 * `TablePaginationFooter` while reusing the orchestrator's filter→sort→page
 * pipeline.
 */
export function useDataTableState<Row>({
  columns,
  rows,
  defaultSortKey,
  defaultSortDir = "desc",
  pageSizeOptions,
}: {
  columns: DataTableColumn<Row>[];
  rows: Row[];
  defaultSortKey?: string;
  defaultSortDir?: "asc" | "desc";
  pageSizeOptions: readonly number[];
}) {
  const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(defaultSortDir);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0] ?? 25);
  const [columnSearch, setColumnSearch] = useState<Record<string, string>>({});

  const handleSort = useCallback(
    (key: string) => {
      if (sortKey === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir("desc");
      }
      setPage(1);
    },
    [sortKey],
  );

  const handleSearchChange = useCallback((key: string, value: string) => {
    setColumnSearch((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const clearAllFilters = useCallback(() => {
    setColumnSearch({});
    setPage(1);
  }, []);

  // Filter → sort → paginate
  const filteredRows = useMemo(() => {
    let result = rows;
    for (const col of columns) {
      const term = columnSearch[col.key]?.trim().toLowerCase();
      if (!term || !col.searchValue) continue;
      result = result.filter((row) =>
        col.searchValue!(row).toLowerCase().includes(term),
      );
    }
    return result;
  }, [rows, columns, columnSearch]);

  const sortedRows = useMemo(() => {
    if (!sortKey) return filteredRows;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return filteredRows;
    const mul = sortDir === "asc" ? 1 : -1;
    return [...filteredRows].sort((a, b) => {
      const va = col.sortValue!(a);
      const vb = col.sortValue!(b);
      return va > vb ? mul : va < vb ? -mul : 0;
    });
  }, [filteredRows, sortKey, sortDir, columns]);

  const totalCount = sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginatedRows = useMemo(
    () => sortedRows.slice((safePage - 1) * pageSize, safePage * pageSize),
    [sortedRows, safePage, pageSize],
  );

  const filterChips = useMemo<DataTableFilterChip[]>(
    () =>
      columns
        .filter((col) => (columnSearch[col.key] ?? "").trim() !== "")
        .map((col) => ({
          key: col.key,
          label: col.header,
          value: columnSearch[col.key] ?? "",
        })),
    [columns, columnSearch],
  );

  return {
    // state
    sortKey,
    sortDir,
    page: safePage,
    pageSize,
    columnSearch,
    // derived
    paginatedRows,
    totalCount,
    totalPages,
    filterChips,
    // handlers
    handleSort,
    handleSearchChange,
    clearAllFilters,
    setPage: useCallback(
      (p: number) => setPage(Math.max(1, Math.min(p, totalPages))),
      [totalPages],
    ),
    setPageSize: useCallback((s: number) => {
      setPageSize(s);
      setPage(1);
    }, []),
  };
}
