import { render, screen } from "@testing-library/react";
import React from "react";

import { AppShell } from "../../layout/app-shell";

describe("AppShell", () => {
  test("renders all 4 required slots + children", () => {
    render(
      <AppShell
        sidebarHeader={<div data-testid="header">BRAND</div>}
        sidebarSections={<div data-testid="sections">NAV</div>}
        sidebarFooter={<div data-testid="footer">USER</div>}
        navbarRight={<div data-testid="navbar-right">AVATAR</div>}
      >
        <main data-testid="content">Hello</main>
      </AppShell>,
    );
    expect(screen.getByTestId("header")).toHaveTextContent("BRAND");
    expect(screen.getByTestId("sections")).toHaveTextContent("NAV");
    expect(screen.getByTestId("footer")).toHaveTextContent("USER");
    expect(screen.getByTestId("navbar-right")).toHaveTextContent("AVATAR");
    expect(screen.getByTestId("content")).toHaveTextContent("Hello");
  });

  test("renders topContent above the navbar when provided", () => {
    render(
      <AppShell
        sidebarHeader={<div>H</div>}
        sidebarSections={<div>S</div>}
        sidebarFooter={<div>F</div>}
        topContent={<div data-testid="top">TAB BAR</div>}
      >
        <main>content</main>
      </AppShell>,
    );
    expect(screen.getByTestId("top")).toHaveTextContent("TAB BAR");
  });

  test("full `navbar` prop overrides the default navbar", () => {
    render(
      <AppShell
        sidebarHeader={<div>H</div>}
        sidebarSections={<div>S</div>}
        sidebarFooter={<div>F</div>}
        navbar={<nav data-testid="custom-navbar">CUSTOM</nav>}
        navbarRight={<div data-testid="navbar-right">IGNORED</div>}
      >
        <main>content</main>
      </AppShell>,
    );
    expect(screen.getByTestId("custom-navbar")).toHaveTextContent("CUSTOM");
    // navbarRight should NOT render when full navbar is passed
    expect(screen.queryByTestId("navbar-right")).not.toBeInTheDocument();
  });
});
