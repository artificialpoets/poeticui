import { render, screen } from "@testing-library/react";
import React from "react";

import { Switch, SwitchField, SwitchGroup } from "../../forms/switch";

describe("Switch", () => {
  describe("default rendering", () => {
    test("renders as a switch control", () => {
      render(<Switch aria-label="Enable feature" />);
      const sw = screen.getByRole("switch", { name: /enable feature/i });
      expect(sw).toBeInTheDocument();
    });

    test("default color is dark/zinc (applies preset CSS variables)", () => {
      render(<Switch aria-label="Default color" />);
      const sw = screen.getByRole("switch", { name: /default color/i });
      // dark/zinc sets --switch-bg to neutral-900
      expect(sw.className).toContain("--switch-bg:var(--color-neutral-900)");
    });
  });

  describe("color variant", () => {
    test('color="red" sets red-600 track background', () => {
      render(<Switch color="red" aria-label="Red" />);
      const sw = screen.getByRole("switch", { name: /red/i });
      expect(sw.className).toContain("--switch-bg:var(--color-red-600)");
    });

    test('color="orange" sets orange-500 track background', () => {
      render(<Switch color="orange" aria-label="Orange" />);
      const sw = screen.getByRole("switch", { name: /orange/i });
      expect(sw.className).toContain("--switch-bg:var(--color-orange-500)");
    });
  });

  describe("size variant", () => {
    test("defaults to md track dimensions", () => {
      render(<Switch aria-label="Default size" />);
      const sw = screen.getByRole("switch", { name: /default size/i });
      expect(sw.className).toMatch(/\bh-6\b/);
      expect(sw.className).toMatch(/\bw-10\b/);
    });

    test('size="sm" gives smaller track', () => {
      render(<Switch size="sm" aria-label="Small" />);
      const sw = screen.getByRole("switch", { name: /small/i });
      expect(sw.className).toMatch(/\bh-4\b/);
      expect(sw.className).toMatch(/\bw-7\b/);
    });

    test('size="lg" gives larger track', () => {
      render(<Switch size="lg" aria-label="Large" />);
      const sw = screen.getByRole("switch", { name: /large/i });
      expect(sw.className).toMatch(/\bh-7\b/);
      expect(sw.className).toMatch(/\bw-12\b/);
    });

    test("thumb translate distance matches track size", () => {
      render(<Switch size="sm" aria-label="Small thumb" />);
      const sw = screen.getByRole("switch", { name: /small thumb/i });
      const thumb = sw.querySelector("span[aria-hidden='true']");
      // sm size moves thumb 3 (size-3)
      expect(thumb?.className).toMatch(/translate-x-3\b/);
    });
  });

  describe("composition layers", () => {
    test("SwitchGroup renders wrapper", () => {
      render(
        <SwitchGroup>
          <Switch aria-label="A" />
        </SwitchGroup>,
      );
      const slots = document.querySelectorAll("[data-slot='control']");
      expect(slots.length).toBeGreaterThan(0);
    });

    test("SwitchField renders wrapper with data-slot=field", () => {
      render(
        <SwitchField>
          <Switch aria-label="A" />
        </SwitchField>,
      );
      expect(document.querySelector("[data-slot='field']")).toBeInTheDocument();
    });
  });
});
