import { render, screen } from "@testing-library/react";
import React from "react";

import { DataTable } from "../../tables/data-table";
import type { DataTableColumn } from "../../tables/data-table";

type TestRow = { id: number; name: string; value: number };

const columns: DataTableColumn<TestRow>[] = [
  { key: "name", header: "Name", cell: (row) => row.name },
  { key: "value", header: "Value", cell: (row) => row.value },
];

const rows: TestRow[] = [
  { id: 1, name: "Alpha", value: 10 },
  { id: 2, name: "Beta", value: 20 },
];

describe("DataTable", () => {
  test("renders columns as headers", () => {
    render(<DataTable columns={columns} rows={rows} getRowKey={(r) => r.id} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();
  });

  test("renders rows", () => {
    render(<DataTable columns={columns} rows={rows} getRowKey={(r) => r.id} />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  test("no hardcoded orange classes remain in rendered output", () => {
    const { container } = render(
      <DataTable columns={columns} rows={rows} getRowKey={(r) => r.id} />,
    );
    // Search entire rendered HTML for hardcoded orange classes
    const html = container.innerHTML;
    // The DataTable itself should not inject any orange-* utility classes
    // (orange may exist in parent button color defs, but not in the table markup itself)
    const orangeClassPattern = /class="[^"]*orange[^"]*"/;
    expect(html).not.toMatch(orangeClassPattern);
  });
});
