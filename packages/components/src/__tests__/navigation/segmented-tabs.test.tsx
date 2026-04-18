import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { SegmentedTabs } from "../../navigation/segmented-tabs";

describe("SegmentedTabs", () => {
  const OPTIONS = [
    { value: "combined", label: "Combined" },
    { value: "desktop", label: "Desktop" },
    { value: "mobile", label: "Mobile" },
  ];

  describe("rendering (options-prop API)", () => {
    test("renders a tablist with one tab per option", () => {
      render(
        <SegmentedTabs
          value="combined"
          onValueChange={() => {}}
          options={OPTIONS}
          aria-label="Device filter"
        />,
      );
      const list = screen.getByRole("tablist", { name: /device filter/i });
      expect(list).toBeInTheDocument();
      expect(screen.getAllByRole("tab")).toHaveLength(3);
    });

    test("marks the active tab with aria-selected=true", () => {
      render(
        <SegmentedTabs
          value="desktop"
          onValueChange={() => {}}
          options={OPTIONS}
        />,
      );
      expect(screen.getByRole("tab", { name: /combined/i })).toHaveAttribute(
        "aria-selected",
        "false",
      );
      expect(screen.getByRole("tab", { name: /desktop/i })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });

    test("active tab gets the highlighted pill styling (bg-card)", () => {
      render(
        <SegmentedTabs
          value="combined"
          onValueChange={() => {}}
          options={OPTIONS}
        />,
      );
      const active = screen.getByRole("tab", { name: /combined/i });
      expect(active.className).toMatch(/bg-card/);
      expect(active.className).toMatch(/text-foreground/);
    });

    test("inactive tab gets muted-foreground text", () => {
      render(
        <SegmentedTabs
          value="combined"
          onValueChange={() => {}}
          options={OPTIONS}
        />,
      );
      const inactive = screen.getByRole("tab", { name: /mobile/i });
      expect(inactive.className).toMatch(/text-muted-foreground/);
      expect(inactive.className).not.toMatch(/\bbg-card\b/);
    });
  });

  describe("interaction", () => {
    test("clicking a tab calls onValueChange with that value", () => {
      const onValueChange = jest.fn();
      render(
        <SegmentedTabs
          value="combined"
          onValueChange={onValueChange}
          options={OPTIONS}
        />,
      );
      fireEvent.click(screen.getByRole("tab", { name: /desktop/i }));
      expect(onValueChange).toHaveBeenCalledWith("desktop");
    });

    test("keyboard focus moves to active tab (roving tabindex)", () => {
      render(
        <SegmentedTabs
          value="mobile"
          onValueChange={() => {}}
          options={OPTIONS}
        />,
      );
      expect(screen.getByRole("tab", { name: /combined/i })).toHaveAttribute(
        "tabindex",
        "-1",
      );
      expect(screen.getByRole("tab", { name: /mobile/i })).toHaveAttribute(
        "tabindex",
        "0",
      );
    });
  });

  describe("size variant", () => {
    test("defaults to md (h-8 buttons)", () => {
      render(
        <SegmentedTabs
          value="combined"
          onValueChange={() => {}}
          options={OPTIONS}
        />,
      );
      const tab = screen.getByRole("tab", { name: /combined/i });
      expect(tab.className).toMatch(/\bh-8\b/);
    });

    test('size="sm" applies h-7 to buttons', () => {
      render(
        <SegmentedTabs
          size="sm"
          value="combined"
          onValueChange={() => {}}
          options={OPTIONS}
        />,
      );
      const tab = screen.getByRole("tab", { name: /combined/i });
      expect(tab.className).toMatch(/\bh-7\b/);
    });
  });

  describe("compound children API", () => {
    test("<SegmentedTabs.Item> renders inside a parent SegmentedTabs", () => {
      render(
        <SegmentedTabs value="a" onValueChange={() => {}}>
          <SegmentedTabs.Item value="a">A</SegmentedTabs.Item>
          <SegmentedTabs.Item value="b">B</SegmentedTabs.Item>
        </SegmentedTabs>,
      );
      expect(screen.getAllByRole("tab")).toHaveLength(2);
      expect(screen.getByRole("tab", { name: /^a$/i })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });

    test("<SegmentedTabs.Item> outside a parent throws", () => {
      // Suppress the React error boundary log for this intentional failure.
      const spy = jest.spyOn(console, "error").mockImplementation(() => {});
      expect(() =>
        render(<SegmentedTabs.Item value="orphan">Orphan</SegmentedTabs.Item>),
      ).toThrow(/must be rendered inside a <SegmentedTabs>/i);
      spy.mockRestore();
    });
  });

  describe("fullWidth variant", () => {
    test("default container has w-fit (no wrap)", () => {
      const { container } = render(
        <SegmentedTabs
          value="combined"
          onValueChange={() => {}}
          options={OPTIONS}
        />,
      );
      const list = container.querySelector("[role='tablist']");
      expect(list?.className).toMatch(/\bw-fit\b/);
    });

    test("fullWidth container uses w-full on mobile (flex wrap)", () => {
      const { container } = render(
        <SegmentedTabs
          fullWidth
          value="combined"
          onValueChange={() => {}}
          options={OPTIONS}
        />,
      );
      const list = container.querySelector("[role='tablist']");
      expect(list?.className).toMatch(/\bw-full\b/);
      expect(list?.className).toMatch(/flex-wrap/);
    });
  });
});
