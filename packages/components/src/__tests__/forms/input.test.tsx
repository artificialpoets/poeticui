import { render, screen } from "@testing-library/react";
import React from "react";

import { Input, InputGroup } from "../../forms/input";

describe("Input", () => {
  test("renders an input element", () => {
    render(<Input data-testid="test-input" />);
    const input = screen.getByTestId("test-input");
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe("INPUT");
  });

  test("uses ring-ring semantic token (not ring-orange-500)", () => {
    const { container } = render(<Input />);
    // The wrapper span has the focus ring class
    const wrapper = container.querySelector('span[data-slot="control"]');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper!.className).toMatch(/ring-ring/);
    expect(wrapper!.className).not.toMatch(/ring-orange-500/);
  });
});

describe("InputGroup", () => {
  test('wraps children with data-slot="control"', () => {
    render(
      <InputGroup>
        <span>icon</span>
        <Input data-testid="grouped-input" />
      </InputGroup>,
    );
    const wrapper = document.querySelector('span[data-slot="control"]');
    expect(wrapper).toBeInTheDocument();
    expect(screen.getByTestId("grouped-input")).toBeInTheDocument();
  });
});
