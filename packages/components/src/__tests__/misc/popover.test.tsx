import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { Popover, PopoverButton, PopoverPanel } from "../../misc/popover";

describe("Popover", () => {
  test("renders the trigger button, panel is closed initially", () => {
    render(
      <Popover>
        <PopoverButton as="button">Open</PopoverButton>
        <PopoverPanel>Panel body</PopoverPanel>
      </Popover>,
    );
    expect(screen.getByRole("button", { name: /open/i })).toBeInTheDocument();
    expect(screen.queryByText("Panel body")).not.toBeInTheDocument();
  });

  test("clicking the button opens the panel (content becomes visible)", () => {
    render(
      <Popover>
        <PopoverButton as="button">Open</PopoverButton>
        <PopoverPanel>Panel body</PopoverPanel>
      </Popover>,
    );
    fireEvent.click(screen.getByRole("button", { name: /open/i }));
    expect(screen.getByText("Panel body")).toBeInTheDocument();
  });

  test("PopoverPanel carries the glass-blur + ring styling from the primitive", () => {
    render(
      <Popover>
        <PopoverButton as="button">Open</PopoverButton>
        <PopoverPanel>Body</PopoverPanel>
      </Popover>,
    );
    fireEvent.click(screen.getByRole("button", { name: /open/i }));
    const panel = screen.getByText("Body");
    expect(panel.className).toMatch(/bg-popover/);
    expect(panel.className).toMatch(/backdrop-blur-xl/);
    expect(panel.className).toMatch(/ring-border/);
  });

  test("PopoverButton accepts `as='button'` and renders a plain button element", () => {
    render(
      <Popover>
        <PopoverButton as="button">Open</PopoverButton>
        <PopoverPanel>Body</PopoverPanel>
      </Popover>,
    );
    const btn = screen.getByRole("button", { name: /open/i });
    expect(btn.tagName).toBe("BUTTON");
    // Plain button shouldn't carry the styled-Button component's before:absolute
    expect(btn.className).not.toMatch(/before:absolute/);
  });

  test("className override on PopoverPanel is merged, not clobbered", () => {
    render(
      <Popover>
        <PopoverButton as="button">Open</PopoverButton>
        <PopoverPanel className="my-custom w-64">Body</PopoverPanel>
      </Popover>,
    );
    fireEvent.click(screen.getByRole("button", { name: /open/i }));
    const panel = screen.getByText("Body");
    expect(panel.className).toMatch(/my-custom/);
    expect(panel.className).toMatch(/\bw-64\b/);
    // Base styles still present
    expect(panel.className).toMatch(/bg-popover/);
  });
});
