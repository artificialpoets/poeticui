"use client";

import { cx } from "@artificialpoets/components/lib";
import { SegmentedTabs } from "@artificialpoets/components/navigation";
import type { ReactNode } from "react";

import { usePref } from "./pref-store";
import { PACKAGE_MANAGERS, type PackageManager } from "./utils/pm-commands";
import { STORAGE_KEY_PACKAGE_MANAGER } from "./utils/storage-keys";

export interface PackageManagerTabsShellProps {
  /**
   * Pre-rendered `<CodeBlock>` node per PM. `PackageManagerTabs` (a
   * Server Component) renders these server-side and hands them in here;
   * this shell just toggles which one is visible based on the stored
   * preference.
   */
  slots: Record<PackageManager, ReactNode>;
  /** Starting PM if no preference is stored yet. */
  defaultValue: PackageManager;
  /** Extra classes on the outer wrapper. */
  className?: string;
}

const OPTIONS: Array<{ value: PackageManager; label: string }> = [
  { value: "bun", label: "bun" },
  { value: "pnpm", label: "pnpm" },
  { value: "npm", label: "npm" },
  { value: "yarn", label: "yarn" },
];

/**
 * Client shell for `<PackageManagerTabs>`. Exported in case a consumer
 * wants to assemble their own Server-Component pipeline and pass slots
 * directly — but the public API everyone should use is
 * `<PackageManagerTabs>`.
 */
export function PackageManagerTabsShell({
  slots,
  defaultValue,
  className,
}: PackageManagerTabsShellProps) {
  const [stored, setStored] = usePref<PackageManager>(
    STORAGE_KEY_PACKAGE_MANAGER,
    defaultValue,
  );

  // Stale-value guard — if the stored PM was removed from our list (or
  // contains junk from another app using the same key), fall back.
  const active: PackageManager = PACKAGE_MANAGERS.includes(stored)
    ? stored
    : defaultValue;

  return (
    <div
      className={cx("space-y-3", className)}
      data-poeticui-package-manager-tabs
    >
      <SegmentedTabs<PackageManager>
        value={active}
        onValueChange={setStored}
        options={OPTIONS}
        size="sm"
      />
      <div data-poeticui-package-manager-tabs-body>{slots[active]}</div>
    </div>
  );
}
