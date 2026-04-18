import { render } from "@testing-library/react";

import { BlockMath, InlineMath } from "../math";

describe("<BlockMath>", () => {
  test("renders a common equation", () => {
    const { container } = render(
      <BlockMath math={String.raw`a^2 + b^2 = c^2`} />,
    );
    const wrapper = container.querySelector(
      "[data-poeticui-block-math]",
    ) as HTMLElement;
    expect(wrapper).toBeInTheDocument();
    // KaTeX renders into a <span class="katex-display"><span class="katex">…</span></span>
    expect(wrapper.querySelector(".katex")).toBeInTheDocument();
  });

  test("className passthrough on the wrapper", () => {
    const { container } = render(
      <BlockMath math="x + y = z" className="my-block" />,
    );
    const wrapper = container.querySelector(
      "[data-poeticui-block-math]",
    ) as HTMLElement;
    expect(wrapper).toHaveClass("my-block");
  });

  test("size=compact applies compact class", () => {
    const { container } = render(<BlockMath math="1 + 1 = 2" size="compact" />);
    const wrapper = container.querySelector(
      "[data-poeticui-block-math]",
    ) as HTMLElement;
    expect(wrapper.className).toContain("text-sm");
  });
});

describe("<InlineMath>", () => {
  test("renders inline with a .katex child", () => {
    const { container } = render(<InlineMath math="\\pi" />);
    const wrapper = container.querySelector(
      "[data-poeticui-inline-math]",
    ) as HTMLElement;
    expect(wrapper).toBeInTheDocument();
    expect(wrapper.tagName).toBe("SPAN");
    expect(wrapper.querySelector(".katex")).toBeInTheDocument();
  });

  test("className passthrough", () => {
    const { container } = render(
      <InlineMath math="\\alpha" className="my-inline" />,
    );
    const wrapper = container.querySelector(
      "[data-poeticui-inline-math]",
    ) as HTMLElement;
    expect(wrapper).toHaveClass("my-inline");
  });
});
