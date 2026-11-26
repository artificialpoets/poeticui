import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "../../misc/dropdown";

/**
 * A menu trigger must look pressed while its menu is open: Button styles
 * `data-active`, and Headless UI sets it on the trigger for as long as the
 * menu is open, next to `aria-expanded="true"`. If either attribute stops
 * following the open state, the trigger looks idle over an open menu.
 */
function renderMenu() {
  return render(
    <Dropdown>
      <DropdownButton outline>Options</DropdownButton>
      <DropdownMenu>
        <DropdownItem>Rename</DropdownItem>
      </DropdownMenu>
    </Dropdown>,
  );
}

describe("DropdownButton open state", () => {
  test("is not active or expanded while the menu is closed", () => {
    renderMenu();
    const trigger = screen.getByRole("button", { name: "Options" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).not.toHaveAttribute("data-active");
  });

  test("is active and expanded while the menu is open", async () => {
    renderMenu();
    const trigger = screen.getByRole("button", { name: "Options" });
    await act(async () => {
      fireEvent.click(trigger);
    });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("data-active");
    expect(trigger).toHaveAttribute("data-open");
  });

  test("the outline Button styles its active state", () => {
    renderMenu();
    const trigger = screen.getByRole("button", { name: "Options" });
    expect(trigger.className).toMatch(/data-active:bg-muted/);
  });
});
