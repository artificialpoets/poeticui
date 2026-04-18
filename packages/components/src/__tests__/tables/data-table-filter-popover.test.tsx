import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { DataTableFilterPopover } from "../../tables/data-table-filter-popover";

describe("DataTableFilterPopover", () => {
  test("renders an inactive trigger when value is empty", () => {
    render(<DataTableFilterPopover value="" onChange={() => {}} />);
    const btn = screen.getByRole("button", { name: "Filter column" });
    expect(btn).toBeInTheDocument();
    // No active dot indicator (the rounded-full span with bg-primary)
    expect(btn.querySelector("span.bg-primary")).toBeNull();
  });

  test("renders an active trigger when value is non-empty", () => {
    render(<DataTableFilterPopover value="alice" onChange={() => {}} />);
    expect(
      screen.getByRole("button", { name: /Filter active: "alice"/ }),
    ).toBeInTheDocument();
  });

  test("clicking the trigger reveals the input + fires onChange on typing", async () => {
    const onChange = jest.fn();
    render(<DataTableFilterPopover value="" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Filter column" }));
    const input = await screen.findByPlaceholderText("Type to filter…");
    fireEvent.change(input, { target: { value: "alice" } });
    expect(onChange).toHaveBeenCalledWith("alice");
  });
});
