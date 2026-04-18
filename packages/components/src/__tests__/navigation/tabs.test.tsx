import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { Tabs, type TabItem } from "../../navigation/tabs";

const OVERVIEW_ID = "overview";
const CHARTS_ID = "charts";
const SETTINGS_ID = "settings";

const TABS: TabItem[] = [
  { id: OVERVIEW_ID, label: "Overview", content: <div>Overview panel</div> },
  { id: CHARTS_ID, label: "Charts", content: <div>Charts panel</div> },
  {
    id: SETTINGS_ID,
    label: "Settings",
    content: <div>Settings panel</div>,
    disabled: true,
  },
];

describe("Tabs (router-agnostic)", () => {
  describe("uncontrolled mode", () => {
    test("defaults to the first non-disabled tab when no defaultTabId is given", () => {
      render(<Tabs tabs={TABS} />);
      expect(screen.getByText("Overview panel")).toBeInTheDocument();
    });

    test("honors defaultTabId when provided", () => {
      render(<Tabs tabs={TABS} defaultTabId={CHARTS_ID} />);
      expect(screen.getByText("Charts panel")).toBeInTheDocument();
      expect(screen.queryByText("Overview panel")).not.toBeInTheDocument();
    });

    test("clicking a tab switches the panel content", () => {
      render(<Tabs tabs={TABS} />);
      fireEvent.click(screen.getByRole("tab", { name: "Charts" }));
      expect(screen.getByText("Charts panel")).toBeInTheDocument();
      expect(screen.queryByText("Overview panel")).not.toBeInTheDocument();
    });
  });

  describe("controlled mode", () => {
    test("uses the `value` prop as the active tab", () => {
      render(<Tabs tabs={TABS} value={CHARTS_ID} onValueChange={() => {}} />);
      expect(screen.getByText("Charts panel")).toBeInTheDocument();
    });

    test("clicking a tab fires onValueChange but doesn't change state internally", () => {
      const onValueChange = jest.fn();
      render(
        <Tabs tabs={TABS} value={OVERVIEW_ID} onValueChange={onValueChange} />,
      );
      fireEvent.click(screen.getByRole("tab", { name: "Charts" }));
      expect(onValueChange).toHaveBeenCalledWith(CHARTS_ID);
      // Active panel did NOT move because parent hasn't updated `value` yet
      expect(screen.getByText("Overview panel")).toBeInTheDocument();
      expect(screen.queryByText("Charts panel")).not.toBeInTheDocument();
    });
  });

  describe("disabled tabs", () => {
    test("disabled tab renders as a span (not a button) with opacity-50", () => {
      render(<Tabs tabs={TABS} />);
      const disabled = screen.getByRole("tab", { name: "Settings" });
      expect(disabled.tagName).toBe("SPAN");
      expect(disabled.className).toMatch(/opacity-50/);
    });

    test("disabled tab cannot be activated", () => {
      const onValueChange = jest.fn();
      render(<Tabs tabs={TABS} onValueChange={onValueChange} />);
      fireEvent.click(screen.getByRole("tab", { name: "Settings" }));
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe("ARIA correctness", () => {
    test("renders role=tablist with horizontal orientation", () => {
      render(<Tabs tabs={TABS} />);
      const list = screen.getByRole("tablist");
      expect(list).toHaveAttribute("aria-orientation", "horizontal");
    });

    test("aria-selected reflects the active tab", () => {
      render(<Tabs tabs={TABS} defaultTabId={CHARTS_ID} />);
      expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute(
        "aria-selected",
        "false",
      );
      expect(screen.getByRole("tab", { name: "Charts" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });

    test("roving tabindex (active = 0, inactive = -1)", () => {
      render(<Tabs tabs={TABS} defaultTabId={CHARTS_ID} />);
      expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute(
        "tabindex",
        "-1",
      );
      expect(screen.getByRole("tab", { name: "Charts" })).toHaveAttribute(
        "tabindex",
        "0",
      );
    });

    test("renders a tabpanel with aria-labelledby pointing at the active tab", () => {
      render(<Tabs tabs={TABS} />);
      const panel = screen.getByRole("tabpanel");
      expect(panel).toHaveAttribute("aria-labelledby", `tab-${OVERVIEW_ID}`);
      expect(panel).toHaveAttribute("id", `panel-${OVERVIEW_ID}`);
    });
  });

  describe("router independence", () => {
    test("renders without throwing when no Next.js router context is present", () => {
      // If Tabs still used next/navigation, this would throw
      expect(() => render(<Tabs tabs={TABS} />)).not.toThrow();
    });

    test("tabs render as <button> elements (not <a>), so no router is required", () => {
      render(<Tabs tabs={TABS} />);
      const tab = screen.getByRole("tab", { name: "Overview" });
      expect(tab.tagName).toBe("BUTTON");
    });
  });
});
