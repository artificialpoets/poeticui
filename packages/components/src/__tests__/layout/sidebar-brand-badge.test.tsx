import { render, screen } from "@testing-library/react";
import React from "react";

import { SidebarBrandBadge } from "../../layout/sidebar-brand-badge";

describe("SidebarBrandBadge", () => {
  test("renders the label inside the primary square", () => {
    render(<SidebarBrandBadge label="PH" name="PoeHost" />);
    const label = screen.getByText("PH");
    expect(label).toBeInTheDocument();
    expect(label.className).toMatch(/bg-primary/);
    expect(label.className).toMatch(/text-primary-foreground/);
  });

  test("renders the full brand name", () => {
    render(<SidebarBrandBadge label="IN" name="Intranet" />);
    expect(screen.getByText("Intranet")).toBeInTheDocument();
  });

  test("merges custom className onto the root element", () => {
    const { container } = render(
      <SidebarBrandBadge label="OM" name="Outbound" className="custom-class" />,
    );
    const root = container.firstElementChild;
    expect(root?.className).toMatch(/custom-class/);
  });
});
