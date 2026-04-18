import { render, screen } from "@testing-library/react";
import React from "react";

import { Button, TouchTarget } from "../../core/button";

describe("Button", () => {
  describe("rendering", () => {
    test("renders as a button by default (no href)", () => {
      render(<Button>Click me</Button>);
      const btn = screen.getByRole("button", { name: /click me/i });
      expect(btn).toBeInTheDocument();
      expect(btn.tagName).toBe("BUTTON");
    });

    test("renders as a link when href is provided", () => {
      render(<Button href="/test">Link button</Button>);
      const link = screen.getByRole("link", { name: /link button/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/test");
    });
  });

  describe("variant (new API)", () => {
    test("defaults to solid variant", () => {
      render(<Button>Solid</Button>);
      const btn = screen.getByRole("button", { name: /solid/i });
      // Solid variant includes the before:absolute pseudo-layer
      expect(btn.className).toMatch(/before:absolute/);
    });

    test('variant="outline" applies outline styles', () => {
      render(<Button variant="outline">Outline</Button>);
      const btn = screen.getByRole("button", { name: /outline/i });
      expect(btn.className).toMatch(/border-border/);
      expect(btn.className).not.toMatch(/before:absolute/);
    });

    test('variant="plain" applies plain styles', () => {
      render(<Button variant="plain">Plain</Button>);
      const btn = screen.getByRole("button", { name: /plain/i });
      expect(btn.className).toMatch(/border-transparent/);
      expect(btn.className).not.toMatch(/before:absolute/);
    });
  });

  describe("variant (legacy boolean props — kept for backward compat)", () => {
    test("outline prop still applies outline styles", () => {
      render(<Button outline>Outline</Button>);
      const btn = screen.getByRole("button", { name: /outline/i });
      expect(btn.className).toMatch(/border-border/);
    });

    test("plain prop still applies plain styles", () => {
      render(<Button plain>Plain</Button>);
      const btn = screen.getByRole("button", { name: /plain/i });
      expect(btn.className).toMatch(/border-transparent/);
      expect(btn.className).not.toMatch(/before:absolute/);
    });

    test("variant prop wins over legacy outline prop when both are set", () => {
      render(
        <Button outline variant="solid">
          Solid wins
        </Button>,
      );
      const btn = screen.getByRole("button", { name: /solid wins/i });
      // Resolved to solid → has the before:absolute layer
      expect(btn.className).toMatch(/before:absolute/);
    });
  });

  describe("color (solid only)", () => {
    test("solid + color sets --btn-bg custom property class", () => {
      render(<Button color="orange">Orange</Button>);
      const btn = screen.getByRole("button", { name: /orange/i });
      // Orange color preset sets --btn-bg to the orange-500 token
      expect(btn.className).toContain("--btn-bg:var(--color-orange-500)");
    });

    test("outline ignores the color prop (no --btn-bg class from preset)", () => {
      render(
        <Button variant="outline" color="orange">
          Outline ignores color
        </Button>,
      );
      const btn = screen.getByRole("button", {
        name: /outline ignores color/i,
      });
      // Outline sets its own [--btn-bg:transparent], not the color preset
      expect(btn.className).not.toContain("--btn-bg:var(--color-orange-500)");
    });

    test("plain ignores the color prop", () => {
      render(
        <Button variant="plain" color="red">
          Plain ignores color
        </Button>,
      );
      const btn = screen.getByRole("button", { name: /plain ignores color/i });
      expect(btn.className).not.toContain("--btn-bg:var(--color-red-600)");
    });

    test("default color is dark/zinc when variant is solid", () => {
      render(<Button>Default color</Button>);
      const btn = screen.getByRole("button", { name: /default color/i });
      // dark/zinc preset sets --btn-bg to neutral-900
      expect(btn.className).toContain("--btn-bg:var(--color-neutral-900)");
    });
  });

  describe("size", () => {
    test("default size is md", () => {
      render(<Button>Default size</Button>);
      const btn = screen.getByRole("button", { name: /default size/i });
      // md size has text-base/6 at the base breakpoint
      expect(btn.className).toMatch(/text-base\/6/);
    });

    test('size="sm" applies small sizing', () => {
      render(<Button size="sm">Small</Button>);
      const btn = screen.getByRole("button", { name: /small/i });
      expect(btn.className).toMatch(/text-xs/);
    });

    test('size="lg" applies large sizing', () => {
      render(<Button size="lg">Large</Button>);
      const btn = screen.getByRole("button", { name: /large/i });
      expect(btn.className).toMatch(/text-lg/);
    });
  });

  describe("className merging", () => {
    test("forwards className and lets consumer override via tailwind-merge", () => {
      render(<Button className="my-custom-class">Custom</Button>);
      const btn = screen.getByRole("button", { name: /custom/i });
      expect(btn.className).toContain("my-custom-class");
    });
  });
});

describe("TouchTarget", () => {
  test("renders an accessible hidden span element", () => {
    render(<TouchTarget>Content</TouchTarget>);
    const hidden = document.querySelector('span[aria-hidden="true"]');
    expect(hidden).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
