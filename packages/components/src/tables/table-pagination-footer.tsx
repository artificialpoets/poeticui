"use client";

import clsx from "clsx";
import type React from "react";

type Props = {
  page: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions: readonly number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  rightSlot?: React.ReactNode;
  className?: string;
};

export function TablePaginationFooter({
  page,
  totalPages,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  rightSlot,
  className,
}: Props) {
  return (
    <div className={clsx("table-footer", className)}>
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Per page</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="panel-action-select min-w-[3.25rem]"
            aria-label="Records per page"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      </div>

      {totalPages > 1 || rightSlot ? (
        <div className="flex items-center gap-4">
          {totalPages > 1 ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="panel-action-secondary disabled:pointer-events-none disabled:opacity-50"
              >
                Previous
              </button>

              {totalPages > 3 ? (
                <label className="inline-flex items-center">
                  <span className="sr-only">Go to page</span>
                  <select
                    value={page}
                    onChange={(e) => onPageChange(Number(e.target.value))}
                    className="panel-action-select min-w-[3.25rem]"
                    aria-label="Go to page"
                  >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ),
                    )}
                  </select>
                </label>
              ) : null}

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="panel-action-secondary disabled:pointer-events-none disabled:opacity-50"
              >
                Next
              </button>
            </div>
          ) : null}

          {rightSlot}
        </div>
      ) : null}
    </div>
  );
}
