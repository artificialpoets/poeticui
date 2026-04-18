import { render, screen } from "@testing-library/react";
import React from "react";

import {
  Sidebar,
  SidebarItem,
  SidebarSection,
  SidebarHeading,
} from "../../navigation/sidebar";

describe("Sidebar", () => {
  test("renders a nav element with expected classes", () => {
    render(<Sidebar data-testid="sidebar">Nav content</Sidebar>);
    const nav = screen.getByTestId("sidebar");
    expect(nav.tagName).toBe("NAV");
    expect(nav.className).toMatch(/flex/);
    expect(nav.className).toMatch(/flex-col/);
  });
});

describe("SidebarItem", () => {
  test("renders with children", () => {
    render(<SidebarItem>Dashboard</SidebarItem>);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
});

describe("SidebarSection", () => {
  test("renders with heading", () => {
    render(
      <SidebarSection>
        <SidebarHeading>Main</SidebarHeading>
        <SidebarItem>Home</SidebarItem>
      </SidebarSection>,
    );
    expect(screen.getByText("Main")).toBeInTheDocument();
    expect(screen.getByText("Main").tagName).toBe("H3");
    expect(screen.getByText("Home")).toBeInTheDocument();
  });
});
