"use client";

import { Filter, X } from "lucide-react";
import { useRef } from "react";

import { cx } from "../lib";
import { Popover, PopoverButton, PopoverPanel } from "../misc/popover";

/**
 * DataTableFilterPopover — filter-by-text popover anchored to a Filter icon.
 *
 * Standalone primitive lifted out of `DataTable`. Consumers can place it
 * anywhere a columnar filter affordance is wanted (e.g. alongside a
 * `DataTableColumnHeader` inside a `<DataTable>`, or in a custom table
 * built from `@poeticui/components` Table primitives).
 *
 * ```tsx
 * const [value, setValue] = useState("");
 * <DataTableFilterPopover
 *   value={value}
 *   onChange={setValue}
 *   label="Filter"
 *   placeholder="Type to filter…"
 * />
 * ```
 *
 * - Shows a dot indicator on the trigger when `value` is non-empty.
 * - Auto-focuses the text input when the popover opens.
 * - Includes a "clear" affordance + "Clear & close" button while active.
 */
export function DataTableFilterPopover({
  value,
  onChange,
  label = "Filter",
  placeholder = "Type to filter…",
  ariaLabel,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  /** Header shown above the input inside the popover panel. */
  label?: string;
  placeholder?: string;
  /** Accessible name for the trigger button. Defaults to a value-aware string. */
  ariaLabel?: string;
  className?: string;
}) {
  const isActive = value.trim() !== "";
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Popover className={cx("relative", className)}>
      <PopoverButton
        as="button"
        className={cx(
          "relative flex items-center justify-center rounded p-0.5 transition-colors focus:outline-none",
          isActive
            ? "text-primary hover:text-primary/80"
            : "text-muted-foreground/50 hover:text-muted-foreground",
        )}
        aria-label={
          ariaLabel ??
          (isActive ? `Filter active: "${value}"` : "Filter column")
        }
        onMouseDown={(e) => e.preventDefault()}
      >
        <Filter className="size-3.5" aria-hidden />
        {isActive && (
          <span className="absolute -right-0.5 -top-0.5 block size-1.5 rounded-full bg-primary" />
        )}
      </PopoverButton>

      <PopoverPanel anchor="bottom start" className="z-50 w-56">
        {({ close }) => (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <div className="relative">
              <input
                ref={(el) => {
                  (
                    inputRef as React.MutableRefObject<HTMLInputElement | null>
                  ).current = el;
                  if (el) el.focus({ preventScroll: true });
                }}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 pr-7 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none"
              />
              {isActive && (
                <button
                  type="button"
                  onClick={() => {
                    onChange("");
                    inputRef.current?.focus();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground"
                  aria-label="Clear filter"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
            {isActive && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  close();
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear &amp; close
              </button>
            )}
          </div>
        )}
      </PopoverPanel>
    </Popover>
  );
}
