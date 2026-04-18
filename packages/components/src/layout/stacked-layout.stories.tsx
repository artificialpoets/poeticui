import type { Meta, StoryObj } from "@storybook/react";

import { StackedLayout } from "./stacked-layout";
import {
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from "../navigation/navbar";
import {
  Sidebar,
  SidebarBody,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "../navigation/sidebar";

const meta = {
  title: "Layout/StackedLayout",
  component: StackedLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {},
} satisfies Meta<typeof StackedLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

const DEMO_NAVBAR = (
  <Navbar>
    <NavbarSection>
      <NavbarItem href="#" current>
        Dashboard
      </NavbarItem>
      <NavbarItem href="#">Sites</NavbarItem>
      <NavbarItem href="#">Audience</NavbarItem>
    </NavbarSection>
    <NavbarSpacer />
    <NavbarSection>
      <NavbarItem>Profile</NavbarItem>
    </NavbarSection>
  </Navbar>
);

const DEMO_SIDEBAR = (
  <Sidebar>
    <SidebarBody>
      <SidebarSection>
        <SidebarItem href="#" current>
          <SidebarLabel>Dashboard</SidebarLabel>
        </SidebarItem>
        <SidebarItem href="#">
          <SidebarLabel>Sites</SidebarLabel>
        </SidebarItem>
        <SidebarItem href="#">
          <SidebarLabel>Audience</SidebarLabel>
        </SidebarItem>
      </SidebarSection>
    </SidebarBody>
  </Sidebar>
);

/** Navbar top + stacked content. Sidebar is modal-only (hamburger on all sizes). */
export const Default: Story = {
  args: {},
  render: () => (
    <StackedLayout sidebar={DEMO_SIDEBAR} navbar={DEMO_NAVBAR}>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Stacked layout</h1>
        <p className="max-w-prose text-sm text-muted-foreground">
          The navbar stays at the top; main content takes the full width below.
          Use this for marketing-style or app surfaces that benefit from
          horizontal real estate (chart-heavy dashboards, split-view editors).
        </p>
      </div>
    </StackedLayout>
  ),
};
