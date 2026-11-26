import { act, render, screen } from "@testing-library/react";
import React from "react";

import { Table, TableBody, TableCell, TableRow } from "../data-display/table";
import { Slider } from "../forms/slider";
import { SegmentedTabs } from "../navigation/segmented-tabs";
import { Tabs } from "../navigation/tabs";
import { DataTableFilterPopover } from "../tables/data-table-filter-popover";

describe("Selected tabs in forced colors", () => {
  // Forced colors drop background fills. Without system colours the selected
  // tab looked exactly like the others there.
  test("Tabs marks the selected tab with the system selection colours", () => {
    render(
      <Tabs
        tabs={[
          { id: "a", label: "Alpha", content: "A" },
          { id: "b", label: "Beta", content: "B" },
        ]}
      />,
    );
    const selected = screen.getByRole("tab", { name: "Alpha" });
    const other = screen.getByRole("tab", { name: "Beta" });
    expect(selected.className).toContain("forced-colors:bg-[SelectedItem]");
    expect(selected.className).toContain(
      "forced-colors:text-[SelectedItemText]",
    );
    expect(other.className).not.toContain("forced-colors:bg-[SelectedItem]");
  });

  test("SegmentedTabs marks the active tab the same way", () => {
    render(
      <SegmentedTabs
        value="day"
        onValueChange={() => {}}
        options={[
          { value: "day", label: "Day" },
          { value: "week", label: "Week" },
        ]}
      />,
    );
    expect(screen.getByRole("tab", { name: "Day" }).className).toContain(
      "forced-colors:bg-[SelectedItem]",
    );
    expect(screen.getByRole("tab", { name: "Week" }).className).not.toContain(
      "forced-colors:bg-[SelectedItem]",
    );
  });
});

describe("Filter trigger contrast and outlines", () => {
  test("the idle icon uses full muted-foreground, not a faded copy", () => {
    render(<DataTableFilterPopover value="" onChange={() => {}} />);
    const trigger = screen.getByRole("button", { name: "Filter column" });
    expect(trigger.className).toContain("text-muted-foreground");
    expect(trigger.className).not.toMatch(/text-muted-foreground\/\d/);
  });

  test("no control removes its outline in a way forced colors cannot restore", () => {
    const { container } = render(
      <DataTableFilterPopover value="ada" onChange={() => {}} />,
    );
    act(() => {
      screen.getByRole("button", { name: /Filter active/ }).click();
    });
    expect(container.ownerDocument.body.innerHTML).not.toContain(
      "outline-none",
    );
  });
});

describe("Slider track", () => {
  test("a 55% foreground edge outlines the track; the empty fill stays light", () => {
    render(<Slider aria-label="Volume" defaultValue={20} />);
    const slider = screen.getByRole("slider", { name: "Volume" });
    // The edge carries the 3:1 (the light fill alone read about 1.4:1)...
    expect(slider.className).toContain(
      "shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--foreground)_55%,transparent)]",
    );
    // ...and the empty part stays light, so an orange fill still stands apart from it.
    expect(slider.className).toContain("var(--foreground)_15%");
  });
});

describe("Table scroll wrapper", () => {
  const original = {
    scrollWidth: Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "scrollWidth",
    ),
    clientWidth: Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "clientWidth",
    ),
  };

  function fakeWidths(scrollWidth: number, clientWidth: number) {
    Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
      configurable: true,
      get: () => scrollWidth,
    });
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      get: () => clientWidth,
    });
  }

  afterEach(() => {
    for (const [key, descriptor] of Object.entries(original)) {
      if (descriptor)
        Object.defineProperty(HTMLElement.prototype, key, descriptor);
      else
        delete (HTMLElement.prototype as unknown as Record<string, unknown>)[
          key
        ];
    }
  });

  function renderTable(props: React.ComponentProps<typeof Table> = {}) {
    return render(
      <Table {...props}>
        <TableBody>
          <TableRow>
            <TableCell>Ada</TableCell>
            <TableCell>ada@example.com</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
  }

  const scroller = (container: HTMLElement) =>
    container.querySelector('[data-component="table"] > div') as HTMLElement;

  test("is a Tab stop while the table overflows, so Safari users can scroll it", () => {
    fakeWidths(900, 300);
    const { container } = renderTable();
    const el = scroller(container);
    expect(el.getAttribute("tabindex")).toBe("0");
    expect(el.className).toContain("focus-visible:outline-ring");
    // Unnamed: focusable, but not announced as an empty region.
    expect(el.getAttribute("role")).toBeNull();
  });

  test("becomes a named region when the caller names it", () => {
    fakeWidths(900, 300);
    const { container } = renderTable({ "aria-label": "Users" });
    const el = scroller(container);
    expect(el.getAttribute("role")).toBe("region");
    expect(el.getAttribute("aria-label")).toBe("Users");
  });

  test("adds no Tab stop when everything fits", () => {
    fakeWidths(300, 300);
    const { container } = renderTable();
    expect(scroller(container).getAttribute("tabindex")).toBeNull();
  });

  test("adds no Tab stop when scrolling is off", () => {
    fakeWidths(900, 300);
    const { container } = renderTable({ scroll: false });
    expect(scroller(container).getAttribute("tabindex")).toBeNull();
  });
});
