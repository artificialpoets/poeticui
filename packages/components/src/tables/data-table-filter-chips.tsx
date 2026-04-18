"use client";

import { X } from "lucide-react";

import { cx } from "../lib";

export type DataTableFilterChip = {
  /** Stable key matching a column key. */
  key: string;
  /** Human-readable column label. */
  label: string;
  /** Current filter value (shown in the chip). */
  value: string;
};

/**
 * DataTableFilterChips — active filter indicator row.
 *
 * Horizontal band of pill-shaped chips showing which columns currently have
 * filters applied. Each chip has an X to clear its filter; when ≥2 chips are
 * present a "Clear all" button is shown.
 *
 * Renders nothing when `filters` is empty, so callers can drop it in
 * unconditionally.
 *
 * ```tsx
 * <DataTableFilterChips
 *   filters={[{ key: "name", label: "Name", value: "alice" }]}
 *   onRemove={(key) => clearFilter(key)}
 *   onClearAll={() => clearAll()}
 * />
 * ```
 */
export function DataTableFilterChips({
  filters,
  onRemove,
  onClearAll,
  className,
}: {
  filters: DataTableFilterChip[];
  onRemove: (key: string) => void;
  onClearAll: () => void;
  className?: string;
}) {
  if (filters.length === 0) return null;

  return (
    <div
      className={cx(
        "flex flex-wrap items-center gap-2 border-b border-border px-4 py-2",
        className,
      )}
    >
      {filters.map((f) => (
        <span
          key={f.key}
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
        >
          <span className="text-primary/60">{f.label}:</span>
          <span>&ldquo;{f.value}&rdquo;</span>
          <button
            type="button"
            onClick={() => onRemove(f.key)}
            className="text-primary/60 hover:text-primary/80"
            aria-label={`Remove ${f.label} filter`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      {filters.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
