import { fireEvent, render, screen } from "@testing-library/react";
import React, { useState } from "react";

import { SegmentedTabs } from "../../navigation/segmented-tabs";
import { Tabs, type TabItem } from "../../navigation/tabs";

const TABS: TabItem[] = [
  { id: "overview", label: "Overview", content: <div>Overview panel</div> },
  { id: "charts", label: "Charts", content: <div>Charts panel</div> },
  {
    id: "settings",
    label: "Settings",
    content: <div>Settings panel</div>,
    disabled: true,
  },
  { id: "logs", label: "Logs", content: <div>Logs panel</div> },
];

describe("Tabs keyboard navigation", () => {
  test("ArrowRight moves focus to the next tab and selects it", () => {
    render(<Tabs tabs={TABS} />);
    const overview = screen.getByRole("tab", { name: "Overview" });
    overview.focus();
    fireEvent.keyDown(overview, { key: "ArrowRight" });
    const charts = screen.getByRole("tab", { name: "Charts" });
    expect(charts).toHaveFocus();
    expect(charts).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Charts panel")).toBeInTheDocument();
  });

  test("skips disabled tabs and wraps from last to first", () => {
    render(<Tabs tabs={TABS} defaultTabId="charts" />);
    const charts = screen.getByRole("tab", { name: "Charts" });
    charts.focus();
    fireEvent.keyDown(charts, { key: "ArrowRight" });
    const logs = screen.getByRole("tab", { name: "Logs" });
    expect(logs).toHaveFocus();
    fireEvent.keyDown(logs, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveFocus();
  });

  test("Home and End jump to the first and last enabled tab", () => {
    render(<Tabs tabs={TABS} defaultTabId="charts" />);
    const charts = screen.getByRole("tab", { name: "Charts" });
    charts.focus();
    fireEvent.keyDown(charts, { key: "End" });
    expect(screen.getByRole("tab", { name: "Logs" })).toHaveFocus();
    fireEvent.keyDown(screen.getByRole("tab", { name: "Logs" }), {
      key: "Home",
    });
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveFocus();
  });

  test("ArrowLeft from the first tab wraps to the last", () => {
    const onValueChange = jest.fn();
    render(<Tabs tabs={TABS} onValueChange={onValueChange} />);
    const overview = screen.getByRole("tab", { name: "Overview" });
    overview.focus();
    fireEvent.keyDown(overview, { key: "ArrowLeft" });
    expect(onValueChange).toHaveBeenCalledWith("logs");
  });

  test("the disabled tab is marked aria-disabled", () => {
    render(<Tabs tabs={TABS} />);
    expect(screen.getByRole("tab", { name: "Settings" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  test("only the selected tab points at a panel, and the panel is focusable", () => {
    render(<Tabs tabs={TABS} />);
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute(
      "aria-controls",
      "panel-overview",
    );
    expect(screen.getByRole("tab", { name: "Charts" })).not.toHaveAttribute(
      "aria-controls",
    );
    expect(screen.getByRole("tabpanel")).toHaveAttribute("tabindex", "0");
  });

  test("focus ring only shows for keyboard focus", () => {
    render(<Tabs tabs={TABS} />);
    const cls = screen.getByRole("tab", { name: "Overview" }).className;
    expect(cls).toContain("focus-visible:ring-2");
    expect(cls).not.toMatch(/(^|\s)focus:ring-2/);
  });
});

describe("SegmentedTabs keyboard navigation", () => {
  const OPTIONS = [
    { value: "combined", label: "Combined" },
    { value: "desktop", label: "Desktop" },
    { value: "mobile", label: "Mobile" },
  ];

  function Harness() {
    const [value, setValue] = useState("combined");
    return (
      <SegmentedTabs value={value} onValueChange={setValue} options={OPTIONS} />
    );
  }

  test("ArrowRight selects and focuses the next tab", () => {
    render(<Harness />);
    const combined = screen.getByRole("tab", { name: "Combined" });
    combined.focus();
    fireEvent.keyDown(combined, { key: "ArrowRight" });
    const desktop = screen.getByRole("tab", { name: "Desktop" });
    expect(desktop).toHaveFocus();
    expect(desktop).toHaveAttribute("aria-selected", "true");
    expect(desktop).toHaveAttribute("tabindex", "0");
  });

  test("End selects the last tab", () => {
    render(<Harness />);
    const combined = screen.getByRole("tab", { name: "Combined" });
    combined.focus();
    fireEvent.keyDown(combined, { key: "End" });
    expect(screen.getByRole("tab", { name: "Mobile" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("tabs carry a visible keyboard focus style", () => {
    render(<Harness />);
    expect(screen.getByRole("tab", { name: "Combined" }).className).toContain(
      "focus-visible:outline-ring",
    );
  });
});
