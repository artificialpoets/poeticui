import { render, screen } from "@testing-library/react";
import React from "react";

import { Table, TableBody } from "../../data-display/table";
import { DataTableEmptyState } from "../../tables/data-table-empty-state";

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <Table>
      <TableBody>{children}</TableBody>
    </Table>
  );
}

describe("DataTableEmptyState", () => {
  test("renders the default message when hasFilters is false", () => {
    render(
      <Wrap>
        <DataTableEmptyState colSpan={3} />
      </Wrap>,
    );
    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  test("renders the filtered message when hasFilters is true", () => {
    render(
      <Wrap>
        <DataTableEmptyState colSpan={3} hasFilters />
      </Wrap>,
    );
    expect(
      screen.getByText("No results match your filters."),
    ).toBeInTheDocument();
  });

  test("honors custom copy for both states", () => {
    const { rerender } = render(
      <Wrap>
        <DataTableEmptyState
          colSpan={3}
          message="No sites yet."
          filteredMessage="Try clearing filters."
        />
      </Wrap>,
    );
    expect(screen.getByText("No sites yet.")).toBeInTheDocument();
    rerender(
      <Wrap>
        <DataTableEmptyState
          colSpan={3}
          hasFilters
          message="No sites yet."
          filteredMessage="Try clearing filters."
        />
      </Wrap>,
    );
    expect(screen.getByText("Try clearing filters.")).toBeInTheDocument();
  });

  test("spans the given number of columns", () => {
    render(
      <Wrap>
        <DataTableEmptyState colSpan={5} />
      </Wrap>,
    );
    const cell = screen.getByText("No results.").closest("td");
    expect(cell).toHaveAttribute("colspan", "5");
  });
});
