"use client";

import { cx } from "../lib";

export interface SkeletonProps {
  className?: string;
}

/**
 * Loading placeholder. Pulse-animated muted block; sized via consumer
 * className. `role="status"` announces "Thinking" to screen readers.
 *
 * @example
 * <Skeleton className="h-8 w-32" />
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      data-component="skeleton"
      role="status"
      aria-label="Thinking"
      className={cx("animate-pulse rounded bg-muted", className)}
    />
  );
}
