"use client";

import { cx } from "../lib";

export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Thinking"
      className={cx("animate-pulse rounded bg-muted", className)}
    />
  );
}
