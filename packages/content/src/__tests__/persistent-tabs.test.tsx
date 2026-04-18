import { fireEvent, render, screen } from "@testing-library/react";

import { PersistentTabs } from "../persistent-tabs";

const OPTIONS = [
  { value: "bun", label: "bun" },
  { value: "npm", label: "npm" },
  { value: "pnpm", label: "pnpm" },
];

describe("<PersistentTabs>", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("renders all options + body for the default value", () => {
    render(
      <PersistentTabs
        storageKey="pref:tabs-default"
        defaultValue="bun"
        options={OPTIONS}
      >
        {(active) => <span data-testid="body">selected: {active}</span>}
      </PersistentTabs>,
    );
    expect(screen.getByRole("tab", { name: "bun" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "npm" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "pnpm" })).toBeInTheDocument();
    expect(screen.getByTestId("body")).toHaveTextContent("selected: bun");
  });

  test("clicking a tab updates body + persists in localStorage", () => {
    render(
      <PersistentTabs
        storageKey="pref:tabs-click"
        defaultValue="bun"
        options={OPTIONS}
      >
        {(active) => <span data-testid="body">{active}</span>}
      </PersistentTabs>,
    );
    fireEvent.click(screen.getByRole("tab", { name: "pnpm" }));
    expect(screen.getByTestId("body")).toHaveTextContent("pnpm");
    expect(window.localStorage.getItem("pref:tabs-click")).toBe("pnpm");
  });

  test("two instances with same storageKey stay in sync", () => {
    render(
      <>
        <PersistentTabs
          storageKey="pref:tabs-sync"
          defaultValue="bun"
          options={OPTIONS}
        >
          {(active) => <span data-testid="body-a">{active}</span>}
        </PersistentTabs>
        <PersistentTabs
          storageKey="pref:tabs-sync"
          defaultValue="bun"
          options={OPTIONS}
        >
          {(active) => <span data-testid="body-b">{active}</span>}
        </PersistentTabs>
      </>,
    );
    // Both start on bun
    expect(screen.getByTestId("body-a")).toHaveTextContent("bun");
    expect(screen.getByTestId("body-b")).toHaveTextContent("bun");
    // Click "npm" on the FIRST set of buttons (getAllByRole returns both)
    const npmTabs = screen.getAllByRole("tab", { name: "npm" });
    fireEvent.click(npmTabs[0]);
    // Both bodies reflect the new value
    expect(screen.getByTestId("body-a")).toHaveTextContent("npm");
    expect(screen.getByTestId("body-b")).toHaveTextContent("npm");
  });

  test("stale stored value (not in options) falls back to default", () => {
    // Simulate: user had "yarn" selected last visit, then we shipped a
    // version that removed "yarn" from the options. Must not crash.
    window.localStorage.setItem("pref:tabs-stale", "yarn-classic");
    render(
      <PersistentTabs
        storageKey="pref:tabs-stale"
        defaultValue="bun"
        options={OPTIONS}
      >
        {(active) => <span data-testid="body">{active}</span>}
      </PersistentTabs>,
    );
    // Displayed tab is default, not the stale value
    expect(screen.getByTestId("body")).toHaveTextContent("bun");
  });

  test("className passthrough on the outer wrapper", () => {
    const { container } = render(
      <PersistentTabs
        storageKey="pref:tabs-class"
        defaultValue="bun"
        options={OPTIONS}
        className="my-tabs"
      >
        {() => null}
      </PersistentTabs>,
    );
    const wrapper = container.querySelector(
      "[data-poeticui-persistent-tabs]",
    ) as HTMLElement;
    expect(wrapper).toHaveClass("my-tabs");
  });
});
