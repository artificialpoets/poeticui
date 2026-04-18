import { render, screen } from "@testing-library/react";
import { Users } from "lucide-react";
import React from "react";

import { Stat } from "../../data-display/stat";

describe("Stat", () => {
  test("renders the minimum label + value", () => {
    render(<Stat label="Total visitors" value="38.2K" />);
    expect(screen.getByText("Total visitors")).toBeInTheDocument();
    expect(screen.getByText("38.2K")).toBeInTheDocument();
  });

  test("number values are localized via toLocaleString", () => {
    render(<Stat label="Count" value={12450} />);
    // In en-US, 12450 → "12,450". The test runs in jsdom which defaults to en-US.
    expect(screen.getByText("12,450")).toBeInTheDocument();
  });

  test("icon slot renders a lucide icon", () => {
    const { container } = render(
      <Stat label="Users" value="1,234" icon={Users} />,
    );
    expect(container.querySelector("svg.lucide")).toBeInTheDocument();
  });

  test("iconVariant=info paints the tinted square with info tokens", () => {
    const { container } = render(
      <Stat label="Users" value="1,234" icon={Users} iconVariant="info" />,
    );
    const square = container.querySelector("[aria-hidden]");
    expect(square?.className).toMatch(/bg-info/);
    expect(square?.className).toMatch(/text-info/);
  });

  test("trend={up} renders success-colored arrow + label", () => {
    const { container } = render(
      <Stat
        label="Revenue"
        value="$120K"
        trend={{ direction: "up", label: "+12% vs last week" }}
      />,
    );
    expect(screen.getByText("+12% vs last week")).toBeInTheDocument();
    expect(container.querySelector(".lucide-trending-up")).toBeInTheDocument();
  });

  test("trend={down} renders destructive-colored arrow + label", () => {
    const { container } = render(
      <Stat
        label="Errors"
        value="3%"
        trend={{ direction: "down", label: "-1.2% vs yesterday" }}
      />,
    );
    expect(
      container.querySelector(".lucide-trending-down"),
    ).toBeInTheDocument();
    const trendWrap = screen.getByText("-1.2% vs yesterday").closest("div");
    expect(trendWrap?.className).toMatch(/text-destructive/);
  });

  test("change prop renders a Badge with 'from last week'", () => {
    render(<Stat label="WAU" value="1,234" change="+8.2%" />);
    expect(screen.getByText("+8.2%")).toBeInTheDocument();
  });

  test("trend wins when both trend and change are provided", () => {
    const { container } = render(
      <Stat
        label="X"
        value="Y"
        change="+8%"
        trend={{ direction: "up", label: "trend-label" }}
      />,
    );
    expect(screen.getByText("trend-label")).toBeInTheDocument();
    expect(container.querySelector(".lucide-trending-up")).toBeInTheDocument();
    // change should NOT appear
    expect(screen.queryByText("+8%")).not.toBeInTheDocument();
  });

  test("bordered=true wraps in card chrome", () => {
    const { container } = render(<Stat label="X" value="Y" bordered />);
    expect(container.firstElementChild?.className).toMatch(/rounded-xl/);
    expect(container.firstElementChild?.className).toMatch(/border-border/);
    expect(container.firstElementChild?.className).toMatch(/bg-card/);
  });

  test("bordered unset → no chrome", () => {
    const { container } = render(<Stat label="X" value="Y" />);
    expect(container.firstElementChild?.className).not.toMatch(/rounded-xl/);
  });

  test.each(["sm", "md", "lg"] as const)(
    "size=%s applies the matching value + icon classes",
    (size) => {
      render(<Stat label="X" value="Y" size={size} icon={Users} />);
      // Each size has a characteristic text-* class on the value
      const matches: Record<typeof size, RegExp> = {
        sm: /text-base/,
        md: /text-2xl/,
        lg: /text-3xl/,
      };
      const valueEl = screen.getByText("Y");
      expect(valueEl.className).toMatch(matches[size]);
    },
  );

  test("className override merges cleanly (cx + tailwind-merge)", () => {
    const { container } = render(
      <Stat label="X" value="Y" bordered className="p-8" />,
    );
    // p-4 is the bordered default; p-8 should win via tailwind-merge
    expect(container.firstElementChild?.className).toMatch(/\bp-8\b/);
    expect(container.firstElementChild?.className).not.toMatch(/\bp-4\b/);
  });
});
