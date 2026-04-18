import { useCallback, useMemo, useState } from "react";

export type SortDir = "asc" | "desc";

export function useFilteredTable<
  Row,
  SortKey extends string,
  Filters extends Record<string, unknown>,
>(opts: {
  rows: Row[];
  defaultSort: { key: SortKey; dir: SortDir };
  initialFilters: Filters;
  pageSizeOptions: readonly number[];
  defaultPageSize?: number;
  getSortValue: (row: Row, key: SortKey) => number | string;
}) {
  const {
    rows,
    defaultSort,
    initialFilters,
    pageSizeOptions,
    defaultPageSize = pageSizeOptions[0] ?? 25,
    getSortValue,
  } = opts;

  const [sortKey, setSortKey] = useState<SortKey>(defaultSort.key);
  const [sortDir, setSortDir] = useState<SortDir>(defaultSort.dir);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const handleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        return;
      }
      setSortKey(key);
      setSortDir("desc");
    },
    [sortKey],
  );

  const sortedRows = useMemo(() => {
    if (rows.length === 0) return [];
    const arr = [...rows];
    const mul = sortDir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      const left = getSortValue(a, sortKey);
      const right = getSortValue(b, sortKey);
      return left > right ? mul : left < right ? -mul : 0;
    });
    return arr;
  }, [rows, sortDir, sortKey, getSortValue]);

  const totalCount = sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const paginatedRows = useMemo(
    () => sortedRows.slice((page - 1) * pageSize, page * pageSize),
    [sortedRows, page, pageSize],
  );

  const setPageSafe = useCallback((next: number) => {
    setPage(Math.max(1, next));
  }, []);

  const reset = useCallback(() => {
    setFilters(initialFilters);
    setSortKey(defaultSort.key);
    setSortDir(defaultSort.dir);
    setPage(1);
    setPageSize(defaultPageSize);
  }, [defaultPageSize, defaultSort.dir, defaultSort.key, initialFilters]);

  return {
    // data
    sortedRows,
    paginatedRows,
    totalCount,
    totalPages,
    // sorting
    sortKey,
    sortDir,
    setSortKey,
    setSortDir,
    handleSort,
    // pagination
    page,
    pageSize,
    pageSizeOptions,
    setPage,
    setPageSafe,
    setPageSize,
    // filters
    filters,
    setFilters,
    // actions
    reset,
  };
}
