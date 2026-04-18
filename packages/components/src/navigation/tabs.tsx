"use client";

import React, { useCallback, useMemo, useState } from "react";

import { cx } from "../lib";

export type TabItem = {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
};

export interface TabsProps {
  tabs: TabItem[];
  /** Controlled active tab id. Pair with `onValueChange`. */
  value?: string;
  /** Uncontrolled initial tab id. Ignored when `value` is set. */
  defaultTabId?: string;
  /** Called when the active tab changes — both controlled and uncontrolled modes. */
  onValueChange?: (tabId: string) => void;
  className?: string;
  tabsClassName?: string;
  panelClassName?: string;
}

const TABLIST_CLASS =
  "inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1";

const TAB_BASE_CLASS =
  "rounded-md px-3 py-1.5 text-sm/6 font-medium transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background";

const TAB_SELECTED_CLASS = "bg-foreground text-background";

const TAB_UNSELECTED_CLASS =
  "text-muted-foreground hover:bg-muted hover:text-foreground";

/**
 * Tabs — accessible, router-agnostic tabs primitive.
 *
 * Pure controlled / uncontrolled state. No Next.js dependency; renders tabs
 * as buttons (not `<a>` links). Pair with your own router adapter if you need
 * URL-persisted active tab — see `apps/dashboard/components/tabs/query-tabs.tsx`
 * for a Next.js query-param wrapper.
 *
 * - Controlled: pass `value` + `onValueChange`.
 * - Uncontrolled: pass `defaultTabId` (defaults to the first non-disabled tab).
 */
export function Tabs({
  tabs,
  value,
  defaultTabId,
  onValueChange,
  className,
  tabsClassName,
  panelClassName,
}: TabsProps) {
  const enabledTabs = useMemo(() => tabs.filter((t) => !t.disabled), [tabs]);

  const initialId = useMemo(() => {
    if (defaultTabId && enabledTabs.some((t) => t.id === defaultTabId))
      return defaultTabId;
    return enabledTabs[0]?.id ?? tabs[0]?.id;
  }, [defaultTabId, enabledTabs, tabs]);

  const [internalValue, setInternalValue] = useState<string | undefined>(
    initialId,
  );

  const isControlled = value !== undefined;
  const activeCandidate = isControlled ? value : internalValue;
  const activeId = tabs.some((t) => t.id === activeCandidate)
    ? activeCandidate
    : initialId;

  const handleChange = useCallback(
    (tabId: string) => {
      if (!isControlled) setInternalValue(tabId);
      onValueChange?.(tabId);
    },
    [isControlled, onValueChange],
  );

  const activeTab = tabs.find((t) => t.id === activeId) ?? tabs[0];

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-orientation="horizontal"
        className={cx(TABLIST_CLASS, tabsClassName)}
      >
        {tabs.map((tab) => {
          const selected = tab.id === activeId;

          if (tab.disabled) {
            return (
              <span
                key={tab.id}
                role="tab"
                aria-selected={false}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                className={cx(TAB_BASE_CLASS, "cursor-not-allowed opacity-50")}
              >
                {tab.label}
              </span>
            );
          }

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => handleChange(tab.id)}
              className={cx(
                TAB_BASE_CLASS,
                selected ? TAB_SELECTED_CLASS : TAB_UNSELECTED_CLASS,
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`panel-${activeTab?.id}`}
        aria-labelledby={`tab-${activeTab?.id}`}
        className={cx("mt-6", panelClassName)}
      >
        {activeTab?.content}
      </div>
    </div>
  );
}
