import { fireEvent, render, screen } from "@testing-library/react";

import { PackageManagerTabs } from "../package-manager-tabs";

describe("<PackageManagerTabs>", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("renders all 4 PM tabs + shows the bun command by default", async () => {
    const el = await PackageManagerTabs({ add: "react" });
    render(el);
    expect(screen.getByRole("tab", { name: "bun" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "pnpm" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "npm" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "yarn" })).toBeInTheDocument();
    const body = document.querySelector(
      "[data-poeticui-package-manager-tabs-body]",
    ) as HTMLElement;
    expect(body.textContent).toContain("bun add react");
  });

  test("clicking pnpm tab switches body + persists in localStorage", async () => {
    const el = await PackageManagerTabs({ add: "lodash" });
    render(el);
    fireEvent.click(screen.getByRole("tab", { name: "pnpm" }));
    const body = document.querySelector(
      "[data-poeticui-package-manager-tabs-body]",
    ) as HTMLElement;
    expect(body.textContent).toContain("pnpm add lodash");
    expect(window.localStorage.getItem("poeticui:pref:package-manager")).toBe(
      "pnpm",
    );
  });

  test("stored preference is restored on next render across instances", async () => {
    window.localStorage.setItem("poeticui:pref:package-manager", "npm");
    const el = await PackageManagerTabs({ add: "react" });
    render(el);
    const body = document.querySelector(
      "[data-poeticui-package-manager-tabs-body]",
    ) as HTMLElement;
    // npm uses `install` for the add verb
    expect(body.textContent).toContain("npm install react");
  });

  test("exec verb uses the correct per-PM binary", async () => {
    const el = await PackageManagerTabs({ exec: "tsc --watch" });
    render(el);
    // Default is bun → bunx
    const body = document.querySelector(
      "[data-poeticui-package-manager-tabs-body]",
    ) as HTMLElement;
    expect(body.textContent).toContain("bunx tsc --watch");
    // Switch to npm → npx
    fireEvent.click(screen.getByRole("tab", { name: "npm" }));
    expect(body.textContent).toContain("npx tsc --watch");
  });

  test("bare install (boolean true) renders `<pm> install`", async () => {
    const el = await PackageManagerTabs({ install: true });
    render(el);
    const body = document.querySelector(
      "[data-poeticui-package-manager-tabs-body]",
    ) as HTMLElement;
    expect(body.textContent).toContain("bun install");
  });

  test("stale stored value falls back to defaultValue", async () => {
    window.localStorage.setItem(
      "poeticui:pref:package-manager",
      "rando-pm-from-another-app",
    );
    const el = await PackageManagerTabs({ add: "react", defaultValue: "pnpm" });
    render(el);
    // Falls back to pnpm, not bun, because caller set defaultValue="pnpm"
    const body = document.querySelector(
      "[data-poeticui-package-manager-tabs-body]",
    ) as HTMLElement;
    expect(body.textContent).toContain("pnpm add react");
  });

  test("className passthrough on the outer wrapper", async () => {
    const el = await PackageManagerTabs({ add: "react", className: "my-pmt" });
    render(el);
    const wrapper = document.querySelector(
      "[data-poeticui-package-manager-tabs]",
    ) as HTMLElement;
    expect(wrapper).toHaveClass("my-pmt");
  });
});
