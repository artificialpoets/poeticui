import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { DataTableFilterChips } from "../../tables/data-table-filter-chips";

describe("DataTableFilterChips", () => {
  test("renders nothing when filters is empty", () => {
    const { container } = render(
      <DataTableFilterChips
        filters={[]}
        onRemove={() => {}}
        onClearAll={() => {}}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  test("renders one chip per filter with label and quoted value", () => {
    render(
      <DataTableFilterChips
        filters={[
          { key: "name", label: "Name", value: "alice" },
          { key: "email", label: "Email", value: "@example.com" },
        ]}
        onRemove={() => {}}
        onClearAll={() => {}}
      />,
    );
    expect(screen.getByText("Name:")).toBeInTheDocument();
    expect(screen.getByText(/alice/)).toBeInTheDocument();
    expect(screen.getByText("Email:")).toBeInTheDocument();
    expect(screen.getByText(/@example.com/)).toBeInTheDocument();
  });

  test("fires onRemove with the chip key when the X is clicked", () => {
    const onRemove = jest.fn();
    render(
      <DataTableFilterChips
        filters={[{ key: "name", label: "Name", value: "alice" }]}
        onRemove={onRemove}
        onClearAll={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Remove Name filter" }));
    expect(onRemove).toHaveBeenCalledWith("name");
  });

  test("does not show Clear-all button when there is only one filter", () => {
    render(
      <DataTableFilterChips
        filters={[{ key: "name", label: "Name", value: "alice" }]}
        onRemove={() => {}}
        onClearAll={() => {}}
      />,
    );
    expect(
      screen.queryByRole("button", { name: "Clear all" }),
    ).not.toBeInTheDocument();
  });

  test("shows Clear-all button when there are ≥2 filters and fires onClearAll", () => {
    const onClearAll = jest.fn();
    render(
      <DataTableFilterChips
        filters={[
          { key: "name", label: "Name", value: "alice" },
          { key: "email", label: "Email", value: "@" },
        ]}
        onRemove={() => {}}
        onClearAll={onClearAll}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Clear all" }));
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });
});
