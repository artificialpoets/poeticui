import { fireEvent, render, screen } from "@testing-library/react";

import { Example, LanguageTabs } from "../language-tabs";

describe("<LanguageTabs>", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("renders a tab per <Example> child + shows the first by default", async () => {
    const el = await LanguageTabs({
      children: [
        <Example key="ts" lang="ts" label="TypeScript">
          {`const x: number = 42`}
        </Example>,
        <Example key="js" lang="js" label="JavaScript">
          {`const x = 42`}
        </Example>,
      ],
    });
    render(el);
    expect(screen.getByRole("tab", { name: "TypeScript" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "JavaScript" })).toBeInTheDocument();
    const body = document.querySelector(
      "[data-poeticui-language-tabs-body]",
    ) as HTMLElement;
    expect(body.textContent).toContain("const x: number = 42");
  });

  test("defaults tab label to lang when no label prop provided", async () => {
    const el = await LanguageTabs({
      children: [
        <Example key="ts" lang="ts">{`const x = 1`}</Example>,
        <Example key="py" lang="python">{`x = 1`}</Example>,
      ],
    });
    render(el);
    expect(screen.getByRole("tab", { name: "ts" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "python" })).toBeInTheDocument();
  });

  test("clicking a different language updates body + persists", async () => {
    const el = await LanguageTabs({
      children: [
        <Example key="ts" lang="ts">{`const x: number = 1`}</Example>,
        <Example key="js" lang="js">{`const x = 1`}</Example>,
      ],
    });
    render(el);
    fireEvent.click(screen.getByRole("tab", { name: "js" }));
    const body = document.querySelector(
      "[data-poeticui-language-tabs-body]",
    ) as HTMLElement;
    expect(body.textContent).toContain("const x = 1");
    expect(window.localStorage.getItem("poeticui:pref:language")).toBe("js");
  });

  test("respects explicit defaultValue prop", async () => {
    const el = await LanguageTabs({
      defaultValue: "js",
      children: [
        <Example key="ts" lang="ts">{`const x: number = 1`}</Example>,
        <Example key="js" lang="js">{`const x = 1`}</Example>,
      ],
    });
    render(el);
    const body = document.querySelector(
      "[data-poeticui-language-tabs-body]",
    ) as HTMLElement;
    expect(body.textContent).toContain("const x = 1");
    expect(body.textContent).not.toContain(": number");
  });

  test("stored lang not in this instance's options falls back to default", async () => {
    // User picked "python" globally, but this instance only has ts+js.
    window.localStorage.setItem("poeticui:pref:language", "python");
    const el = await LanguageTabs({
      children: [
        <Example key="ts" lang="ts">{`x`}</Example>,
        <Example key="js" lang="js">{`y`}</Example>,
      ],
    });
    render(el);
    const body = document.querySelector(
      "[data-poeticui-language-tabs-body]",
    ) as HTMLElement;
    // Falls back to first example (ts) rather than crashing.
    expect(body.textContent).toContain("x");
  });

  test("non-<Example> children are ignored", async () => {
    const el = await LanguageTabs({
      children: [
        <Example key="ts" lang="ts">{`const x = 1`}</Example>,
        <span key="junk">ignore me</span>,
        "string child, also ignored",
      ],
    });
    render(el);
    expect(screen.getAllByRole("tab")).toHaveLength(1);
    expect(document.body.textContent).not.toContain("ignore me");
  });

  test("no <Example> children renders an empty wrapper without crashing", async () => {
    const el = await LanguageTabs({ children: null });
    render(el);
    // Wrapper exists, no tabs.
    expect(
      document.querySelector("[data-poeticui-language-tabs]"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
  });
});
