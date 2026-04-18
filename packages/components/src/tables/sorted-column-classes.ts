import clsx from "clsx";

export type SortedColumnAlign = "left" | "right";

const SORTED_BG = "bg-primary/5 text-foreground dark:bg-primary/10";
const UNSORTED_TEXT = "text-muted-foreground";

export function getSortedHeaderClass(opts: {
  align: SortedColumnAlign;
  isActive: boolean;
}) {
  return clsx(
    "table-header-sticky font-bold",
    opts.align === "left" ? "text-left" : "text-right",
    opts.isActive ? SORTED_BG : UNSORTED_TEXT,
  );
}

export function getSortedCellClass(opts: {
  align: SortedColumnAlign;
  isActive: boolean;
}) {
  return clsx(
    "whitespace-nowrap tabular-nums",
    opts.align === "left" ? "text-left" : "text-right",
    opts.isActive ? `${SORTED_BG} font-semibold` : UNSORTED_TEXT,
  );
}
