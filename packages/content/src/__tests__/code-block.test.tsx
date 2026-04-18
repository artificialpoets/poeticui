import { render } from "@testing-library/react";

import { CodeBlock } from "../code-block";
import { createHighlighter } from "../utils/default-highlighter";

describe("<CodeBlock>", () => {
  test("renders highlighted TypeScript with both light + dark CSS variables", async () => {
    const el = await CodeBlock({
      code: "const x: number = 42",
      lang: "ts",
    });
    const { container } = render(el);
    const wrapper = container.querySelector(
      "[data-poeticui-code-block]",
    ) as HTMLElement;
    expect(wrapper).toBeInTheDocument();
    // Shiki's dual-theme mode emits inline style variables for both.
    const html = wrapper.innerHTML;
    expect(html).toContain("--shiki-light");
    expect(html).toContain("--shiki-dark");
    // The word "const" should appear wrapped in a styled span.
    expect(html).toContain("const");
  });

  test("renders plain JSON as a pre/code without errors", async () => {
    const el = await CodeBlock({
      code: `{ "hello": "world" }`,
      lang: "json",
    });
    const { container } = render(el);
    const pre = container.querySelector("pre");
    expect(pre).toBeInTheDocument();
    expect(container.textContent).toContain(`"hello"`);
  });

  test("falls back to plain <pre> for unknown language (text)", async () => {
    // The fallback path intentionally emits a console.warn in dev mode.
    // Silence it so the test run stays clean.
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const el = await CodeBlock({
        code: "hello world",
        lang: "totally-made-up",
      });
      const { container } = render(el);
      // Still renders — just without highlighting.
      expect(container.textContent).toContain("hello world");
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("totally-made-up"),
      );
    } finally {
      warnSpy.mockRestore();
    }
  });

  test("className passthrough on the outer wrapper", async () => {
    const el = await CodeBlock({
      code: "const x = 1",
      lang: "js",
      className: "my-custom-class",
    });
    const { container } = render(el);
    const wrapper = container.querySelector(
      "[data-poeticui-code-block]",
    ) as HTMLElement;
    expect(wrapper).toHaveClass("my-custom-class");
  });

  test("consumer-supplied custom highlighter overrides default", async () => {
    const customHighlighter = await createHighlighter({
      langs: ["bash"],
      themes: ["github-light", "github-dark-dimmed"],
    });
    const el = await CodeBlock({
      code: "echo hello",
      lang: "bash",
      highlighter: customHighlighter,
    });
    const { container } = render(el);
    const wrapper = container.querySelector(
      "[data-poeticui-code-block]",
    ) as HTMLElement;
    expect(wrapper).toBeInTheDocument();
    expect(container.textContent).toContain("echo");
  });
});
