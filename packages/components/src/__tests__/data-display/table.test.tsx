import { act, render, screen } from "@testing-library/react";
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

describe("Table keyboard scrolling (ResizeObserver path)", () => {
  // jest.setup.cjs polyfills a ResizeObserver that never calls back. Swap in
  // one that records its callback, so the test can play a resize.
  let callbacks: ResizeObserverCallback[] = [];
  let scrollWidth = 0;
  let clientWidth = 0;
  const original = globalThis.ResizeObserver;
  const descriptors = {
    scrollWidth: Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "scrollWidth",
    ),
    clientWidth: Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "clientWidth",
    ),
  };

  beforeEach(() => {
    callbacks = [];
    globalThis.ResizeObserver = class {
      constructor(callback: ResizeObserverCallback) {
        callbacks.push(callback);
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
    Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
      configurable: true,
      get: () => scrollWidth,
    });
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      get: () => clientWidth,
    });
  });

  afterEach(() => {
    globalThis.ResizeObserver = original;
    for (const [name, descriptor] of Object.entries(descriptors)) {
      if (descriptor)
        Object.defineProperty(HTMLElement.prototype, name, descriptor);
    }
  });

  const resize = (scroll: number, client: number) => {
    scrollWidth = scroll;
    clientWidth = client;
    act(() => {
      for (const callback of callbacks) callback([], {} as ResizeObserver);
    });
  };

  const renderTable = () =>
    render(
      <Table aria-label="Sites" data-testid="wrapper">
        <TableBody>
          <TableRow>
            <TableCell>Alice</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

  test("becomes a named Tab stop when a resize makes it overflow, and stops being one when it fits", () => {
    scrollWidth = 200;
    clientWidth = 200;
    renderTable();
    const wrapper = screen.getByTestId("wrapper");
    expect(wrapper).not.toHaveAttribute("tabindex");
    expect(callbacks).toHaveLength(1);

    resize(800, 200);
    expect(wrapper).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("region", { name: "Sites" })).toBe(wrapper);

    resize(200, 200);
    expect(wrapper).not.toHaveAttribute("tabindex");
    expect(screen.queryByRole("region")).toBeNull();
  });

  test("keeps the Tab stop while it has focus, so focus is not lost when it stops overflowing", () => {
    scrollWidth = 800;
    clientWidth = 200;
    renderTable();
    const wrapper = screen.getByTestId("wrapper");
    expect(wrapper).toHaveAttribute("tabindex", "0");

    act(() => wrapper.focus());
    resize(200, 200);
    expect(wrapper).toHaveAttribute("tabindex", "0");
    expect(document.activeElement).toBe(wrapper);

    act(() => wrapper.blur());
    expect(wrapper).not.toHaveAttribute("tabindex");
  });

  test("a focus on a cell inside does not hold the Tab stop", () => {
    scrollWidth = 200;
    clientWidth = 200;
    render(
      <Table data-testid="wrapper">
        <TableBody>
          <TableRow>
            <TableCell>
              <button type="button">Edit</button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    act(() => screen.getByRole("button", { name: "Edit" }).focus());
    expect(screen.getByTestId("wrapper")).not.toHaveAttribute("tabindex");
  });
});
