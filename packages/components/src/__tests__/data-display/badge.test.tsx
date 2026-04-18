import { render, screen } from "@testing-library/react";
import React from "react";

import { Badge, BadgeButton } from "../../data-display/badge";

describe("Badge", () => {
  describe("color", () => {
    test("defaults to zinc (which maps to bg-muted)", () => {
      render(<Badge>Default</Badge>);
      const badge = screen.getByText("Default");
      expect(badge).toBeInTheDocument();
      expect(badge.className).toMatch(/bg-muted/);
    });

    test('color="red" applies red palette classes', () => {
      render(<Badge color="red">Error</Badge>);
      const badge = screen.getByText("Error");
      expect(badge.className).toMatch(/bg-red-500\/15/);
      expect(badge.className).toMatch(/text-red-700/);
    });

    test('color="muted" and color="zinc" both map to bg-muted', () => {
      render(
        <>
          <Badge color="muted">Muted</Badge>
          <Badge color="zinc">Zinc</Badge>
        </>,
      );
      expect(screen.getByText("Muted").className).toMatch(/bg-muted/);
      expect(screen.getByText("Zinc").className).toMatch(/bg-muted/);
    });

    test('color="foreground" applies inverse palette', () => {
      render(<Badge color="foreground">Strong</Badge>);
      const badge = screen.getByText("Strong");
      expect(badge.className).toMatch(/bg-foreground/);
      expect(badge.className).toMatch(/text-background/);
    });
  });

  describe("size", () => {
    test("defaults to md", () => {
      render(<Badge>Default size</Badge>);
      const badge = screen.getByText("Default size");
      expect(badge.className).toMatch(/px-1\.5/);
    });

    test('size="sm" applies smaller padding + text', () => {
      render(<Badge size="sm">Small</Badge>);
      const badge = screen.getByText("Small");
      expect(badge.className).toMatch(/text-xs/);
      expect(badge.className).toMatch(/px-1\b/);
    });
  });

  describe("className merging", () => {
    test("forwards custom className", () => {
      render(<Badge className="my-extra">Custom</Badge>);
      expect(screen.getByText("Custom").className).toContain("my-extra");
    });
  });
});

describe("BadgeButton", () => {
  test("renders as a button by default", () => {
    render(<BadgeButton>Click</BadgeButton>);
    const btn = screen.getByRole("button", { name: /click/i });
    expect(btn).toBeInTheDocument();
  });

  test("renders as a link when href is provided", () => {
    render(<BadgeButton href="/test">Badge Link</BadgeButton>);
    const link = screen.getByRole("link", { name: /badge link/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
  });

  test("passes color + size to inner Badge", () => {
    render(
      <BadgeButton color="red" size="sm">
        Small red
      </BadgeButton>,
    );
    const inner = screen.getByText("Small red");
    expect(inner.className).toMatch(/bg-red-500\/15/);
    expect(inner.className).toMatch(/text-xs/);
  });
});
