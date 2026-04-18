import { render, screen } from "@testing-library/react";
import React from "react";

import { Dropdown } from "../../misc/dropdown";
import { TableFilterTrigger } from "../../tables/table-filter-trigger";

function renderInDropdown(node: React.ReactNode) {
  return render(<Dropdown>{node}</Dropdown>);
}

describe("TableFilterTrigger", () => {
  test("renders as a plain <button> element (not the styled Button component)", () => {
    renderInDropdown(
      <TableFilterTrigger aria-label="Filter by device">
        Device
      </TableFilterTrigger>,
    );
    const btn = screen.getByRole("button", { name: /filter by device/i });
    expect(btn).toBeInTheDocument();
    expect(btn.tagName).toBe("BUTTON");
    // The styled Button component produces a `before:absolute` pseudo-layer.
    // A plain header-cell trigger must NOT have that.
    expect(btn.className).not.toMatch(/before:absolute/);
  });

  test("defaults to the `fit` variant (inline-flex, gap-1, no w-full)", () => {
    renderInDropdown(
      <TableFilterTrigger aria-label="Filter by device">
        Device
      </TableFilterTrigger>,
    );
    const btn = screen.getByRole("button", { name: /filter by device/i });
    expect(btn.className).toMatch(/inline-flex/);
    expect(btn.className).toMatch(/gap-1/);
    expect(btn.className).not.toMatch(/\bw-full\b/);
    expect(btn.className).not.toMatch(/justify-between/);
  });

  test("applies the `fill` variant when requested (w-full, justify-between, gap-2)", () => {
    renderInDropdown(
      <TableFilterTrigger variant="fill" aria-label="Filter by site">
        Site
      </TableFilterTrigger>,
    );
    const btn = screen.getByRole("button", { name: /filter by site/i });
    expect(btn.className).toMatch(/\bw-full\b/);
    expect(btn.className).toMatch(/justify-between/);
    expect(btn.className).toMatch(/gap-2/);
  });

  test("renders a trailing chevron by default", () => {
    renderInDropdown(
      <TableFilterTrigger aria-label="Filter by device">
        Device
      </TableFilterTrigger>,
    );
    const btn = screen.getByRole("button", { name: /filter by device/i });
    // Chevron is the trailing svg child (aria-hidden so not queryable by role).
    const svg = btn.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
  });

  test("allows hiding the chevron by passing endIcon={null}", () => {
    renderInDropdown(
      <TableFilterTrigger endIcon={null} aria-label="Filter by device">
        Device
      </TableFilterTrigger>,
    );
    const btn = screen.getByRole("button", { name: /filter by device/i });
    expect(btn.querySelector("svg")).toBeNull();
  });

  test("bakes in the low-emphasis header styling (muted → hover foreground + focus ring)", () => {
    renderInDropdown(
      <TableFilterTrigger aria-label="Filter by device">
        Device
      </TableFilterTrigger>,
    );
    const btn = screen.getByRole("button", { name: /filter by device/i });
    expect(btn.className).toMatch(/text-muted-foreground/);
    expect(btn.className).toMatch(/hover:text-foreground/);
    expect(btn.className).toMatch(/focus:outline-ring/);
    expect(btn.className).toMatch(/font-bold/);
  });

  test("forwards arbitrary className through (last-write-wins merge)", () => {
    renderInDropdown(
      <TableFilterTrigger
        className="my-extra-class"
        aria-label="Filter by device"
      >
        Device
      </TableFilterTrigger>,
    );
    const btn = screen.getByRole("button", { name: /filter by device/i });
    expect(btn.className).toMatch(/my-extra-class/);
    // Base classes still present
    expect(btn.className).toMatch(/inline-flex/);
  });

  test("defaults type to 'button' (prevents accidental form submits)", () => {
    renderInDropdown(
      <TableFilterTrigger aria-label="Filter by device">
        Device
      </TableFilterTrigger>,
    );
    const btn = screen.getByRole("button", { name: /filter by device/i });
    expect(btn).toHaveAttribute("type", "button");
  });

  test("renders children (label + summary) before the chevron", () => {
    renderInDropdown(
      <TableFilterTrigger aria-label="Filter by site">
        Site <span data-testid="summary">(all)</span>
      </TableFilterTrigger>,
    );
    const summary = screen.getByTestId("summary");
    expect(summary).toHaveTextContent("(all)");
    const btn = screen.getByRole("button", { name: /filter by site/i });
    // Children render BEFORE the chevron
    const svg = btn.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(
      summary.compareDocumentPosition(svg!) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
