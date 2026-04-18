import { render, screen } from "@testing-library/react";
import React from "react";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from "../../data-display/table";

describe("Table", () => {
  test("renders with thead and tbody", () => {
    render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Alice</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  test("TableHead renders correct header classes", () => {
    render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Col</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Val</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const thead = screen.getByText("Col").closest("thead");
    expect(thead).toBeInTheDocument();
    expect(thead!.className).toMatch(/text-muted-foreground/);
  });

  test("TableRow, TableHeader, TableCell render expected elements", () => {
    render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Header</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByText("Header").tagName).toBe("TH");
    expect(screen.getByText("Cell").tagName).toBe("TD");
    expect(screen.getByText("Header").closest("tr")).toBeInTheDocument();
  });

  test("striped context propagates", () => {
    render(
      <Table striped>
        <TableBody>
          <TableRow>
            <TableCell>First</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Second</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    // With striped=true, cells should NOT have border-b border-border
    // (the striped context flips that off in TableCell)
    const secondCell = screen.getByText("Second");
    expect(secondCell.className).not.toMatch(/border-b border-border/);
  });
});
