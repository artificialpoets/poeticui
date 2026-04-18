import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { Table, TableHead, TableRow } from "../../data-display/table";
import { DataTableColumnHeader } from "../../tables/data-table-column-header";

/** Harness: headers have to live inside a `<table>` to render without warnings. */
function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <Table>
      <TableHead>
        <TableRow>{children}</TableRow>
      </TableHead>
    </Table>
  );
}

describe("DataTableColumnHeader", () => {
  test("renders the label as plain text when not sortable", () => {
    render(
      <Wrap>
        <DataTableColumnHeader label="Name" />
      </Wrap>,
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  test("renders a sort button when sortable", () => {
    render(
      <Wrap>
        <DataTableColumnHeader label="Name" sortable onSort={() => {}} />
      </Wrap>,
    );
    const btn = screen.getByRole("button", { name: /Name/ });
    expect(btn).toBeInTheDocument();
  });

  test("fires onSort when the sort button is clicked", () => {
    const onSort = jest.fn();
    render(
      <Wrap>
        <DataTableColumnHeader label="Name" sortable onSort={onSort} />
      </Wrap>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Name/ }));
    expect(onSort).toHaveBeenCalledTimes(1);
  });

  test("shows ArrowDown when sorted desc", () => {
    const { container } = render(
      <Wrap>
        <DataTableColumnHeader
          label="Name"
          sortable
          sorted
          sortDir="desc"
          onSort={() => {}}
        />
      </Wrap>,
    );
    // lucide icons render as <svg class="lucide lucide-arrow-down …">
    expect(container.querySelector(".lucide-arrow-down")).toBeInTheDocument();
    expect(container.querySelector(".lucide-arrow-up")).not.toBeInTheDocument();
  });

  test("shows ArrowUp when sorted asc", () => {
    const { container } = render(
      <Wrap>
        <DataTableColumnHeader
          label="Name"
          sortable
          sorted
          sortDir="asc"
          onSort={() => {}}
        />
      </Wrap>,
    );
    expect(container.querySelector(".lucide-arrow-up")).toBeInTheDocument();
  });

  test("does not render a filter popover when filterable is false", () => {
    render(
      <Wrap>
        <DataTableColumnHeader label="Name" sortable onSort={() => {}} />
      </Wrap>,
    );
    expect(
      screen.queryByRole("button", { name: /Filter/ }),
    ).not.toBeInTheDocument();
  });

  test("renders a filter popover trigger when filterable + onFilterChange", () => {
    render(
      <Wrap>
        <DataTableColumnHeader
          label="Name"
          filterable
          filterValue=""
          onFilterChange={() => {}}
        />
      </Wrap>,
    );
    expect(
      screen.getByRole("button", { name: "Filter column" }),
    ).toBeInTheDocument();
  });

  test("right-aligned header gets justify-end on the inner flex row", () => {
    const { container } = render(
      <Wrap>
        <DataTableColumnHeader label="Value" align="right" />
      </Wrap>,
    );
    const innerRow = container.querySelector(".flex.items-center");
    expect(innerRow?.className).toMatch(/justify-end/);
  });
});
