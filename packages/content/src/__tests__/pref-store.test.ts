import { act, renderHook } from "@testing-library/react";

import { getPref, setPref, subscribe, usePref } from "../pref-store";

describe("pref-store", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe("getPref", () => {
    test("returns default when key absent", () => {
      expect(getPref("pref:absent", "fallback")).toBe("fallback");
    });

    test("returns stored value when present", () => {
      window.localStorage.setItem("pref:exists", "stored");
      expect(getPref("pref:exists", "fallback")).toBe("stored");
    });
  });

  describe("setPref", () => {
    test("writes to localStorage", () => {
      setPref("pref:write", "hello");
      expect(window.localStorage.getItem("pref:write")).toBe("hello");
    });

    test("notifies local subscribers", () => {
      const fn = jest.fn();
      const unsubscribe = subscribe("pref:notify", fn);
      setPref("pref:notify", "value");
      expect(fn).toHaveBeenCalledTimes(1);
      unsubscribe();
    });

    test("does not notify subscribers of other keys", () => {
      const fnA = jest.fn();
      const fnB = jest.fn();
      const unsubA = subscribe("pref:a", fnA);
      const unsubB = subscribe("pref:b", fnB);
      setPref("pref:a", "value");
      expect(fnA).toHaveBeenCalledTimes(1);
      expect(fnB).not.toHaveBeenCalled();
      unsubA();
      unsubB();
    });
  });

  describe("subscribe", () => {
    test("returns unsubscribe that stops future notifications", () => {
      const fn = jest.fn();
      const unsubscribe = subscribe("pref:unsub", fn);
      setPref("pref:unsub", "first");
      expect(fn).toHaveBeenCalledTimes(1);
      unsubscribe();
      setPref("pref:unsub", "second");
      expect(fn).toHaveBeenCalledTimes(1); // still 1, not 2
    });

    test("responds to cross-tab storage events", () => {
      const fn = jest.fn();
      const unsubscribe = subscribe("pref:cross-tab", fn);
      // Simulate another tab's write — the browser would fire this.
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "pref:cross-tab",
          newValue: "from-other-tab",
        }),
      );
      expect(fn).toHaveBeenCalledTimes(1);
      unsubscribe();
    });

    test("ignores cross-tab events for unrelated keys", () => {
      const fn = jest.fn();
      const unsubscribe = subscribe("pref:my-key", fn);
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "pref:other-key",
          newValue: "unrelated",
        }),
      );
      expect(fn).not.toHaveBeenCalled();
      unsubscribe();
    });
  });

  describe("usePref hook", () => {
    test("returns default when no value stored", () => {
      const { result } = renderHook(() => usePref("pref:hook-default", "bun"));
      expect(result.current[0]).toBe("bun");
    });

    test("setValue updates returned value + persists", () => {
      const { result } = renderHook(() => usePref("pref:hook-set", "bun"));
      expect(result.current[0]).toBe("bun");
      act(() => {
        result.current[1]("npm");
      });
      expect(result.current[0]).toBe("npm");
      expect(window.localStorage.getItem("pref:hook-set")).toBe("npm");
    });

    test("multiple hook instances with same key stay in sync", () => {
      const { result: hookA } = renderHook(() =>
        usePref("pref:hook-sync", "bun"),
      );
      const { result: hookB } = renderHook(() =>
        usePref("pref:hook-sync", "bun"),
      );
      expect(hookA.current[0]).toBe("bun");
      expect(hookB.current[0]).toBe("bun");
      act(() => {
        hookA.current[1]("pnpm");
      });
      expect(hookA.current[0]).toBe("pnpm");
      expect(hookB.current[0]).toBe("pnpm");
    });
  });
});
