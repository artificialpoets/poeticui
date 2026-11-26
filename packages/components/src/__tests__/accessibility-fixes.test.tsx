import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import React from "react";

import { Dialog, DialogTitle } from "../feedback/dialog";
import { DateRangePicker } from "../forms/date-range-picker/date-range-picker";
import { ErrorMessage, Field } from "../forms/fieldset";
import { Listbox, ListboxLabel, ListboxOption } from "../forms/listbox";
import { Slider } from "../forms/slider";
import { DrawerShell } from "../layout/drawer-shell";
import { Breadcrumbs } from "../navigation/breadcrumbs";
import { Navbar, NavbarItem } from "../navigation/navbar";
import { SidebarItem } from "../navigation/sidebar";
import { SiteSwitcher } from "../navigation/site-switcher";
import { DataTableColumnHeader } from "../tables/data-table-column-header";
import { DataTableFilterPopover } from "../tables/data-table-filter-popover";

const PALETTE =
  /\b(?:text|bg|border|ring|stroke|fill|outline)-(?:neutral|zinc|gray|red|orange)-\d|(?:^|\s)(?:dark:)?(?:text|bg|border|ring)-(?:white|black)\b/;

function classesIn(root: ParentNode): string {
  return Array.from(root.querySelectorAll<HTMLElement>("[class]"))
    .map((el) => el.getAttribute("class") ?? "")
    .join(" ");
}

describe("Dialog role", () => {
  test("the alert variant is an alertdialog", () => {
    render(
      <Dialog variant="alert" open onClose={() => {}}>
        <DialogTitle>Delete site?</DialogTitle>
      </Dialog>,
    );
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });

  test("the default variant stays a dialog, and a caller role wins", () => {
    const { unmount } = render(
      <Dialog open onClose={() => {}}>
        <DialogTitle>Settings</DialogTitle>
      </Dialog>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    unmount();
    render(
      <Dialog variant="alert" role="dialog" open onClose={() => {}}>
        <DialogTitle>Notice</DialogTitle>
      </Dialog>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

describe("DrawerShell", () => {
  test("the title names the dialog", () => {
    render(
      <DrawerShell open onClose={() => {}} title="Edit customer">
        <p>Body</p>
      </DrawerShell>,
    );
    expect(
      screen.getByRole("dialog", { name: "Edit customer" }),
    ).toBeInTheDocument();
  });
});

describe("DataTableColumnHeader aria-sort", () => {
  function Header(props: React.ComponentProps<typeof DataTableColumnHeader>) {
    return (
      <table>
        <thead>
          <tr>
            <DataTableColumnHeader {...props} />
          </tr>
        </thead>
      </table>
    );
  }

  test("a sorted column announces its direction", () => {
    const { rerender } = render(
      <Header label="Name" sortable sorted sortDir="asc" onSort={() => {}} />,
    );
    expect(screen.getByRole("columnheader")).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
    rerender(
      <Header label="Name" sortable sorted sortDir="desc" onSort={() => {}} />,
    );
    expect(screen.getByRole("columnheader")).toHaveAttribute(
      "aria-sort",
      "descending",
    );
  });

  test("an unsorted column has no aria-sort", () => {
    render(<Header label="Name" sortable onSort={() => {}} />);
    expect(screen.getByRole("columnheader")).not.toHaveAttribute("aria-sort");
  });
});

describe("DataTableFilterPopover", () => {
  test("the filter input is named and the trigger has a keyboard focus ring", () => {
    render(<DataTableFilterPopover value="" onChange={() => {}} />);
    const trigger = screen.getByRole("button", { name: "Filter column" });
    expect(trigger.className).toContain("focus-visible:ring-2");
    fireEvent.click(trigger);
    expect(screen.getByRole("textbox", { name: "Filter" })).toHaveFocus();
  });

  test("a re-render does not pull focus back into the input", () => {
    const { rerender } = render(
      <DataTableFilterPopover value="ada" onChange={() => {}} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Filter active/ }));
    const clear = screen.getByRole("button", { name: "Clear & close" });
    clear.focus();
    rerender(<DataTableFilterPopover value="ada" onChange={() => {}} />);
    expect(clear).toHaveFocus();
  });
});

describe("SiteSwitcher", () => {
  test("renders nothing instead of crashing when there are no sites", () => {
    const { container } = render(
      <SiteSwitcher sites={[]} current="x" onChange={() => {}} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("row text follows the focused item's primary fill", () => {
    render(
      <SiteSwitcher
        sites={[{ id: "a", name: "Alpha", subtitle: "alpha.co" }]}
        current="a"
        onChange={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    const item = screen.getByRole("menuitem");
    expect(item).toHaveAttribute("aria-current", "true");
    expect(within(item).getByText("Alpha").className).toContain(
      "group-data-focus:text-primary-foreground",
    );
  });
});

describe("Navigation current-page semantics", () => {
  test("a current NavbarItem link carries aria-current=page", () => {
    render(
      <Navbar>
        <NavbarItem href="/home" current>
          Home
        </NavbarItem>
        <NavbarItem href="/docs">Docs</NavbarItem>
      </Navbar>,
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Docs" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  // aria-current used to come after {...props} and wipe the caller's value.
  test("NavbarItem keeps a caller's aria-current when current is unset", () => {
    render(
      <Navbar>
        <NavbarItem href="/step-2" aria-current="step">
          Step 2
        </NavbarItem>
        <NavbarItem aria-current="true">Filter</NavbarItem>
        <NavbarItem href="/home" current aria-current="step">
          Home
        </NavbarItem>
      </Navbar>,
    );
    expect(screen.getByRole("link", { name: "Step 2" })).toHaveAttribute(
      "aria-current",
      "step",
    );
    expect(screen.getByRole("button", { name: "Filter" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    // current wins: the item is the page.
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("SidebarItem keeps a caller's aria-current when current is unset", () => {
    render(
      <>
        <SidebarItem href="/step-2" aria-current="step">
          Step 2
        </SidebarItem>
        <SidebarItem aria-current="location">Here</SidebarItem>
        <SidebarItem href="/home" current>
          Home
        </SidebarItem>
        <SidebarItem href="/docs">Docs</SidebarItem>
      </>,
    );
    expect(screen.getByRole("link", { name: "Step 2" })).toHaveAttribute(
      "aria-current",
      "step",
    );
    expect(screen.getByRole("button", { name: "Here" })).toHaveAttribute(
      "aria-current",
      "location",
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Docs" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  test("Breadcrumbs is a list and marks the last item as the current page", () => {
    render(
      <Breadcrumbs
        items={[{ label: "Sites", href: "/sites" }, { label: "Example" }]}
      />,
    );
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav.querySelectorAll("li")).toHaveLength(2);
    expect(screen.getByText("Example")).toHaveAttribute("aria-current", "page");
  });
});

describe("Slider", () => {
  test("draws a keyboard focus ring on the Firefox thumb too", () => {
    render(<Slider aria-label="Volume" defaultValue={40} />);
    const cls = screen.getByRole("slider").className;
    expect(cls).toContain("focus-visible:[&::-moz-range-thumb]:ring-2");
    expect(cls).toContain("rtl:bg-[linear-gradient(to_left");
  });
});

describe("DateRangePicker", () => {
  test("opens a popover (not a menu) whose date inputs keep unique labels", () => {
    render(
      <>
        <DateRangePicker
          value={{ from: "2026-11-01", to: "2026-11-07" }}
          onChange={() => {}}
        />
        <DateRangePicker
          value={{ from: "2026-11-01", to: "2026-11-07" }}
          onChange={() => {}}
        />
      </>,
    );
    const [first] = screen.getAllByRole("button", { name: "Time range" });
    fireEvent.click(first);
    expect(screen.queryByRole("menu")).toBeNull();
    const start = screen.getByLabelText("Start date");
    const end = screen.getByLabelText("End date");
    expect(start.id).not.toBe("date-range-start");
    expect(start.id).not.toBe(end.id);
    // Presets are toggle buttons, not listbox options without arrow-key support.
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(
      screen.getAllByRole("button", { pressed: true }).length,
    ).toBeGreaterThan(0);
  });

  // Since the panel became a Popover every day was a Tab stop: about 500
  // Tabs from the calendar to Cancel and Apply.
  test("the calendar is one Tab stop between the date inputs and Cancel/Apply", () => {
    render(
      <DateRangePicker
        value={{ from: "2026-11-01", to: "2026-11-07" }}
        onChange={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Time range" }));
    const tabbable = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".date-range-dropdown button, .date-range-dropdown input",
      ),
    ).filter((el) => el.tabIndex >= 0 && !el.hasAttribute("disabled"));
    const names = tabbable.map(
      (el) => el.getAttribute("aria-label") ?? el.textContent ?? el.id,
    );
    const calendarStop = names.indexOf("Saturday, November 7, 2026");
    expect(calendarStop).toBeGreaterThan(-1);
    expect(names.slice(calendarStop + 1)).toEqual(["Cancel", "Apply"]);
    expect(tabbable.filter((el) => el.hasAttribute("data-date"))).toHaveLength(
      1,
    );
  });

  test("Apply sends the draft and closes the panel", async () => {
    const onChange = jest.fn();
    render(
      <DateRangePicker
        value={{ from: "2026-11-01", to: "2026-11-07" }}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Time range" }));
    fireEvent.click(screen.getByTestId("date-range-apply"));
    expect(onChange).toHaveBeenCalledWith({
      from: "2026-11-01",
      to: "2026-11-07",
    });
    await waitFor(() =>
      expect(screen.queryByTestId("date-range-apply")).toBeNull(),
    );
  });
});

describe("Token purity of scrubbed components", () => {
  test("Listbox uses semantic tokens only", () => {
    render(
      <Listbox aria-label="Plan" placeholder="Pick a plan" onChange={() => {}}>
        <ListboxOption value="free">
          <ListboxLabel>Free</ListboxLabel>
        </ListboxOption>
      </Listbox>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Plan/ }));
    const all = classesIn(document.body);
    expect(all).toContain("ring-ring");
    expect(all).not.toMatch(PALETTE);
  });

  test("ErrorMessage uses the destructive token", () => {
    render(
      <Field>
        <ErrorMessage>Email is required.</ErrorMessage>
      </Field>,
    );
    const cls = screen.getByText("Email is required.").className;
    expect(cls).toContain("text-destructive");
    expect(cls).not.toMatch(/red-\d/);
  });
});
