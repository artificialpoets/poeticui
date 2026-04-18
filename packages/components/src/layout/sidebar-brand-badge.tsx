"use client";

import { cx } from "../lib";

/**
 * SidebarBrandBadge — 2-letter primary-colored square + brand name.
 *
 * The standard sidebar header used across dashboards that don't need an
 * organization switcher. For layouts with more complex headers (org switch
 * dropdowns, logo uploads), pass a custom ReactNode into `AppShell`'s
 * `sidebarHeader` slot instead.
 *
 * ```tsx
 * <SidebarHeader>
 *   <SidebarBrandBadge label="PH" name="PoeHost" />
 * </SidebarHeader>
 * ```
 */
export function SidebarBrandBadge({
  label,
  name,
  className,
}: {
  /** Short text inside the primary badge (usually 2 uppercase letters). */
  label: string;
  /** Full brand name shown next to the badge. */
  name: string;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "flex items-center gap-2 px-1.5 py-1 sm:px-2 sm:py-1.5",
        className,
      )}
    >
      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
        {label}
      </div>
      <span className="min-w-0 flex-1 truncate text-sm font-semibold tracking-tight text-foreground">
        {name}
      </span>
    </div>
  );
}
