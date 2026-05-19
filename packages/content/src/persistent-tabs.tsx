"use client";

import { cx } from "@artificialpoets/components/lib";
import { SegmentedTabs } from "@artificialpoets/components/navigation";
import type { ReactNode } from "react";

import { usePref } from "./pref-store";

export interface PersistentTabsProps<TValue extends string = string> {
  /**
   * localStorage key used to persist + sync the active tab. All
   * `<PersistentTabs>` instances sharing the same key stay in lockstep
   * on the same page (via in-memory pub/sub) and across browser tabs
   * (via the `storage` event).
   *
   * Recommended namespacing: `"<app>:<feature>:<what>"`, e.g.
   * `"poeticui:pref:package-manager"`.
   */
  storageKey: string;
  /**
   * Fallback value when no preference has been stored yet, or when the
   * stored value isn't in `options` (e.g. the consumer removed an option
   * but a user still has the old value in localStorage).
   */
  defaultValue: TValue;
  /** Tab list — order controls display order. */
  options: Array<{ value: TValue; label: string }>;
  /**
   * Renders the body below the tab strip. Receives the currently active
   * value so the body can change with the tab.
   */
  children: (activeValue: TValue) => ReactNode;
  /** Extra classes on the outer wrapper. */
  className?: string;
  /** Segmented-tabs size. Passed through to `<SegmentedTabs>`. */
  size?: "sm" | "md";
}

/**
 * PersistentTabs — a segmented tab strip whose active state is stored in
 * localStorage and synced across every instance sharing the same
 * `storageKey`.
 *
 * Built on `<SegmentedTabs>` from `@artificialpoets/components/navigation` plus
 * `usePref()` from `./pref-store`. Use this when you want:
 *
 *   - **Cross-instance sync**: two `<PersistentTabs storageKey="x">` on
 *     the same page update together when either is clicked
 *   - **Cross-tab sync**: open the same page in another tab, change the
 *     pref, and the first tab updates
 *   - **Persistence**: the choice sticks across reloads and navigation
 *
 * Composes into domain-specific widgets like `<PackageManagerTabs>` and
 * `<LanguageTabs>` — see `./package-manager-tabs.tsx`.
 *
 * ```tsx
 * <PersistentTabs
 *   storageKey="my-app:theme-preview"
 *   defaultValue="auto"
 *   options={[
 *     { value: "light", label: "Light" },
 *     { value: "dark",  label: "Dark" },
 *     { value: "auto",  label: "Auto" },
 *   ]}
 * >
 *   {(active) => <p>You picked: {active}</p>}
 * </PersistentTabs>
 * ```
 */
export function PersistentTabs<TValue extends string = string>({
  storageKey,
  defaultValue,
  options,
  children,
  className,
  size = "md",
}: PersistentTabsProps<TValue>) {
  const [stored, setStored] = usePref<TValue>(storageKey, defaultValue);

  // Guard against a stale stored value (e.g. consumer removed an option
  // after users had already picked it). Fall back to defaultValue for
  // the display so <SegmentedTabs> gets a valid option.
  const optionValues = options.map((o) => o.value);
  const active = optionValues.includes(stored) ? stored : defaultValue;

  return (
    <div className={cx("space-y-3", className)} data-poeticui-persistent-tabs>
      <SegmentedTabs<TValue>
        value={active}
        onValueChange={setStored}
        options={options}
        size={size}
      />
      <div data-poeticui-persistent-tabs-body>{children(active)}</div>
    </div>
  );
}
