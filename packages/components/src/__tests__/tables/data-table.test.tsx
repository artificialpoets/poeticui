import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { DataTable, showsRowNumbers } from "../../tables/data-table";
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

describe("DataTable row numbers", () => {
  const many: TestRow[] = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: i < 3 ? `Match ${i + 1}` : `Row ${i + 1}`,
    value: 100 - i,
  }));
  const filterable: DataTableColumn<TestRow>[] = [
    {
      key: "name",
      header: "Name",
      cell: (row) => row.name,
      searchValue: (row) => row.name,
    },
    {
      key: "value",
      header: "Value",
      cell: (row) => row.value,
      sortValue: (row) => row.value,
    },
  ];

  test("decides visibility by mode and unfiltered total", () => {
    expect(showsRowNumbers("never", 100)).toBe(false);
    expect(showsRowNumbers("always", 1)).toBe(true);
    expect(showsRowNumbers("auto", 10)).toBe(false);
    expect(showsRowNumbers("auto", 11)).toBe(true);
    expect(showsRowNumbers("auto", 6, 5)).toBe(true);
  });

  test("renders no # column by default", () => {
    render(
      <DataTable columns={filterable} rows={many} getRowKey={(r) => r.id} />,
    );
    expect(
      screen.queryByRole("columnheader", { name: "#" }),
    ).not.toBeInTheDocument();
  });

  test("auto mode hides # for 10 or fewer records", () => {
    render(
      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(r) => r.id}
        rowNumbers="auto"
      />,
    );
    expect(
      screen.queryByRole("columnheader", { name: "#" }),
    ).not.toBeInTheDocument();
  });

  test("auto mode numbers rows across pages", () => {
    render(
      <DataTable
        columns={filterable}
        rows={many}
        getRowKey={(r) => r.id}
        defaultSortKey="value"
        rowNumbers="auto"
        pageSizeOptions={[25]}
      />,
    );
    expect(screen.getByRole("columnheader", { name: "#" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "25" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByRole("cell", { name: "26" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "30" })).toBeInTheDocument();
    expect(screen.queryByRole("cell", { name: "1" })).not.toBeInTheDocument();
  });

  test("keeps the # column when a filter leaves few rows", () => {
    render(
      <DataTable
        columns={filterable}
        rows={many}
        getRowKey={(r) => r.id}
        rowNumbers="auto"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Filter column" }));
    fireEvent.change(screen.getByPlaceholderText("Type to filter…"), {
      target: { value: "Match" },
    });
    expect(screen.getByRole("columnheader", { name: "#" })).toBeInTheDocument();
    expect(screen.getAllByText(/^Match /)).toHaveLength(3);
    expect(screen.getByRole("cell", { name: "3" })).toBeInTheDocument();
  });

  test("the # header sticks with the other headers", () => {
    render(
      <DataTable
        columns={filterable}
        rows={many}
        getRowKey={(r) => r.id}
        rowNumbers="always"
      />,
    );
    expect(screen.getByRole("columnheader", { name: "#" })).toHaveClass(
      "table-header-sticky",
    );
  });

  test("the empty state spans the # column too", () => {
    render(
      <DataTable
        columns={filterable}
        rows={many}
        getRowKey={(r) => r.id}
        rowNumbers="auto"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Filter column" }));
    fireEvent.change(screen.getByPlaceholderText("Type to filter…"), {
      target: { value: "no such row" },
    });
    const cell = screen.getByRole("cell");
    expect(cell).toHaveAttribute("colspan", String(filterable.length + 1));
  });
});
