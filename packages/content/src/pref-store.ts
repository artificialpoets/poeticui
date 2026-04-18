"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Preference store — a tiny, synchronous, localStorage-backed key/value
 * store with pub/sub semantics. Powers `<PersistentTabs>` (and any other
 * primitive that wants cross-component, cross-tab preference sync).
 *
 * Design:
 *   - Each key has its own listener set
 *   - `setPref` both writes localStorage AND notifies local listeners
 *     (browsers don't fire `storage` events on the writing tab)
 *   - `subscribe` also installs a cross-tab `storage` event listener
 *   - `usePref` uses React 18's `useSyncExternalStore` → SSR-safe,
 *     no hydration mismatches
 *   - All reads/writes are safe in environments without `window`
 *     (server render, Node tests without jsdom)
 */

type Listener = () => void;

// Per-key listener sets — scoped so an update to one key doesn't re-render
// every subscriber of every key.
const listeners = new Map<string, Set<Listener>>();

function getListeners(key: string): Set<Listener> {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  return set;
}

function notify(key: string): void {
  listeners.get(key)?.forEach((fn) => fn());
}

/**
 * Synchronous read. SSR-safe (returns `defaultValue` when `window` is
 * undefined, and when localStorage access throws — e.g. Safari private
 * browsing mode).
 */
export function getPref(key: string, defaultValue: string): string {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ?? defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Synchronous write. Writes to localStorage if available, then notifies
 * all in-page listeners for this key. Cross-tab sync happens via the
 * browser's `storage` event, which fires in OTHER tabs (not this one),
 * so local notification is what keeps same-page instances in sync.
 */
export function setPref(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // localStorage unavailable (quota, private browsing) — ignore write
    // but still notify so in-page state updates, even if it won't persist.
  }
  notify(key);
}

/**
 * Subscribe to changes for a specific key. Returns an unsubscribe.
 *
 * Installs both an in-page listener (notified by `setPref` on this tab)
 * and a `storage` event listener (notified by browser when another tab
 * changes the same key in localStorage).
 */
export function subscribe(key: string, fn: Listener): () => void {
  const set = getListeners(key);
  set.add(fn);

  const storageHandler = (event: StorageEvent) => {
    // `event.key` is null when localStorage.clear() is called — we ignore
    // that for scoped subscriptions. Other tabs' writes fire with the
    // key name.
    if (event.key === key) fn();
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", storageHandler);
  }

  return () => {
    set.delete(fn);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", storageHandler);
    }
  };
}

/**
 * React hook — returns a `[value, setValue]` tuple bound to a localStorage
 * key. Follows `useState`'s ergonomics but persists across reloads and
 * syncs across component instances + tabs automatically.
 *
 * ```tsx
 * const [pm, setPm] = usePref<"npm" | "pnpm" | "bun" | "yarn">(
 *   "poeticui:pref:package-manager",
 *   "bun",
 * );
 * ```
 *
 * SSR-safe — returns `defaultValue` during server render, hydrates to
 * the stored value on the client with no visual flash (assumes the
 * server-rendered UI was built with `defaultValue`).
 */
export function usePref<T extends string>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const subscribeKey = useCallback(
    (fn: () => void) => subscribe(key, fn),
    [key],
  );
  const getSnapshot = useCallback(
    (): T => getPref(key, defaultValue) as T,
    [key, defaultValue],
  );
  const getServerSnapshot = useCallback((): T => defaultValue, [defaultValue]);

  const value = useSyncExternalStore(
    subscribeKey,
    getSnapshot,
    getServerSnapshot,
  );
  const setValue = useCallback((v: T) => setPref(key, v), [key]);

  return [value, setValue];
}
