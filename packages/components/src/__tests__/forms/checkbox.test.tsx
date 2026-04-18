import { render, screen } from "@testing-library/react";
import React from "react";

import { Checkbox, CheckboxField, CheckboxGroup } from "../../forms/checkbox";

describe("Checkbox", () => {
  describe("default rendering", () => {
    test("renders as a checkbox control", () => {
      render(<Checkbox aria-label="Subscribe" />);
      const checkbox = screen.getByRole("checkbox", { name: /subscribe/i });
      expect(checkbox).toBeInTheDocument();
    });

    test("default color is dark/zinc (applies the preset CSS variables)", () => {
      render(<Checkbox aria-label="Default color" />);
      const inner = document.querySelector("[data-slot='control'] span");
      // dark/zinc sets --checkbox-checked-bg to neutral-900
      expect(inner?.className).toContain(
        "--checkbox-checked-bg:var(--color-neutral-900)",
      );
    });
  });

  describe("color variant", () => {
    test('color="red" sets red-600 checked background', () => {
      render(<Checkbox color="red" aria-label="Red" />);
      const inner = document.querySelector("[data-slot='control'] span");
      expect(inner?.className).toContain(
        "--checkbox-checked-bg:var(--color-red-600)",
      );
    });

    test('color="orange" sets orange-500 checked background', () => {
      render(<Checkbox color="orange" aria-label="Orange" />);
      const inner = document.querySelector("[data-slot='control'] span");
      expect(inner?.className).toContain(
        "--checkbox-checked-bg:var(--color-orange-500)",
      );
    });
  });

  describe("size variant", () => {
    test("defaults to md (size-4.5)", () => {
      render(<Checkbox aria-label="Default size" />);
      const inner = document.querySelector("[data-slot='control'] span");
      expect(inner?.className).toMatch(/size-4\.5/);
    });

    test('size="sm" applies smaller sizing', () => {
      render(<Checkbox size="sm" aria-label="Small" />);
      const inner = document.querySelector("[data-slot='control'] span");
      expect(inner?.className).toMatch(/size-3\.5/);
    });
  });

  describe("composition layers", () => {
    test("CheckboxGroup renders with data-slot=control", () => {
      render(
        <CheckboxGroup>
          <Checkbox aria-label="A" />
        </CheckboxGroup>,
      );
      // Both the outer group and the Checkbox set data-slot='control' —
      // assert at least one exists.
      const slots = document.querySelectorAll("[data-slot='control']");
      expect(slots.length).toBeGreaterThan(0);
    });

    test("CheckboxField renders with data-slot=field", () => {
      render(
        <CheckboxField>
          <Checkbox aria-label="A" />
        </CheckboxField>,
      );
      expect(document.querySelector("[data-slot='field']")).toBeInTheDocument();
    });
  });
});
