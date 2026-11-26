import type React from "react";

const NAV_KEYS = new Set(["ArrowRight", "ArrowLeft", "Home", "End"]);

/**
 * Arrow-key navigation for a horizontal `role="tablist"` with a roving
 * tabindex (internal — not exported from the package).
 *
 * Only the selected tab is a Tab stop, so without this the other tabs cannot
 * be reached from the keyboard. Selection follows focus: the tab that
 * receives focus is clicked, which runs its own selection handler.
 * ArrowLeft/ArrowRight wrap and swap in right-to-left layouts; Home/End jump
 * to the first/last enabled tab.
 */
export function handleTablistKeyDown(event: React.KeyboardEvent<HTMLElement>) {
  if (!NAV_KEYS.has(event.key)) return;
  if (event.altKey || event.ctrlKey || event.metaKey) return;

  const list = event.currentTarget;
  const tabs = Array.from(
    list.querySelectorAll<HTMLElement>('[role="tab"]'),
  ).filter(
    (tab) =>
      tab.closest('[role="tablist"]') === list &&
      tab.getAttribute("aria-disabled") !== "true" &&
      !(tab as HTMLButtonElement).disabled,
  );
  if (tabs.length === 0) return;

  const current = tabs.findIndex((tab) => tab === event.target);
  if (current === -1) return;

  const rtl = getComputedStyle(list).direction === "rtl";
  let next = current;
  switch (event.key) {
    case "Home":
      next = 0;
      break;
    case "End":
      next = tabs.length - 1;
      break;
    case "ArrowRight":
      next = current + (rtl ? -1 : 1);
      break;
    case "ArrowLeft":
      next = current + (rtl ? 1 : -1);
      break;
  }
  next = (next + tabs.length) % tabs.length;

  event.preventDefault();
  const target = tabs[next];
  target.focus();
  if (target.getAttribute("aria-selected") !== "true") target.click();
}
