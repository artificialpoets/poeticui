import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { Slider, sliderFillPercent } from "../../forms/slider";

describe("Slider", () => {
  test("renders a range input in the theme's colors", () => {
    render(<Slider aria-label="Sensitivity" defaultValue={60} />);
    const slider = screen.getByRole("slider", { name: /sensitivity/i });
    expect(slider).toHaveAttribute("type", "range");
    expect(slider.className).toContain("var(--primary)_var(--slider-fill)");
    expect(slider.className).toContain(
      "[&::-webkit-slider-thumb]:border-primary",
    );
    expect(slider.className).toContain("[&::-moz-range-thumb]:border-primary");
  });

  test("fills the track up to a controlled value", () => {
    render(
      <Slider
        aria-label="S"
        min={0}
        max={1}
        step={0.01}
        value={0.25}
        onChange={() => {}}
      />,
    );
    expect(
      screen.getByRole("slider").style.getPropertyValue("--slider-fill"),
    ).toBe("25%");
  });

  test("moves the fill with the thumb when uncontrolled", () => {
    const onChange = jest.fn();
    render(<Slider aria-label="S" defaultValue={10} onChange={onChange} />);
    const slider = screen.getByRole("slider");
    expect(slider.style.getPropertyValue("--slider-fill")).toBe("10%");
    fireEvent.change(slider, { target: { value: "70" } });
    expect(slider.style.getPropertyValue("--slider-fill")).toBe("70%");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test("keeps the consumer's className last, so it can override", () => {
    render(<Slider aria-label="S" className="h-2" />);
    expect(screen.getByRole("slider").className).toMatch(/h-2/);
    expect(screen.getByRole("slider").className).not.toMatch(/\bh-1\.5\b/);
  });

  test("clamps the fill and survives a degenerate range", () => {
    expect(sliderFillPercent(150, 0, 100)).toBe(100);
    expect(sliderFillPercent(-5, 0, 100)).toBe(0);
    expect(sliderFillPercent(5, 10, 10)).toBe(0);
    expect(sliderFillPercent("0.5", "0", "1")).toBe(50);
  });
});
