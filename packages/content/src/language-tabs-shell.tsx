"use client";

import { cx } from "@poeticui/components/lib";
import { SegmentedTabs } from "@poeticui/components/navigation";
import type { ReactNode } from "react";

import { usePref } from "./pref-store";
import { STORAGE_KEY_LANGUAGE } from "./utils/storage-keys";

export interface LanguageTabsShellProps {
  /** Pre-rendered `<CodeBlock>` per lang, keyed by `lang` identifier. */
  slots: Record<string, ReactNode>;
  /** Tab options — order controls display order. */
  options: Array<{ value: string; label: string }>;
  /** Starting tab. Already validated to exist in `slots`. */
  defaultValue: string;
  /** Extra classes on the outer wrapper. */
  className?: string;
}

/**
 * Client shell for `<LanguageTabs>` — drives the active tab off
 * `usePref()` so every `<LanguageTabs>` on the page (and across browser
 * tabs) picks up the user's current lang preference.
 *
 * Graceful degradation: if the stored lang isn't in this instance's
 * options (e.g. this card only has ts+js but the user picked python
 * elsewhere), we fall back to `defaultValue`. The global preference
 * still persists for other `<LanguageTabs>` instances that do offer it.
 */
export function LanguageTabsShell({
  slots,
  options,
  defaultValue,
  className,
}: LanguageTabsShellProps) {
  const [stored, setStored] = usePref<string>(
    STORAGE_KEY_LANGUAGE,
    defaultValue,
  );

  const optionValues = options.map((o) => o.value);
  const active = optionValues.includes(stored) ? stored : defaultValue;

  return (
    <div className={cx("space-y-3", className)} data-poeticui-language-tabs>
      <SegmentedTabs<string>
        value={active}
        onValueChange={setStored}
        options={options}
        size="sm"
      />
      <div data-poeticui-language-tabs-body>{slots[active]}</div>
    </div>
  );
}
