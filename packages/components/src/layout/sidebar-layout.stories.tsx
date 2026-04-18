import type { Meta, StoryObj } from "@storybook/react";
import { BarChart3, Home, Monitor, Users } from "lucide-react";

import { SidebarLayout } from "./sidebar-layout";
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
  title: "Layout/SidebarLayout",
  component: SidebarLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {},
} satisfies Meta<typeof SidebarLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

const DEMO_SIDEBAR = (
  <Sidebar>
    <SidebarBody>
      <SidebarSection>
        <SidebarItem href="#" current>
          <Home data-slot="icon" />
          <SidebarLabel>Dashboard</SidebarLabel>
        </SidebarItem>
        <SidebarItem href="#">
          <Monitor data-slot="icon" />
          <SidebarLabel>Sites</SidebarLabel>
        </SidebarItem>
        <SidebarItem href="#">
          <Users data-slot="icon" />
          <SidebarLabel>Audience</SidebarLabel>
        </SidebarItem>
        <SidebarItem href="#">
          <BarChart3 data-slot="icon" />
          <SidebarLabel>Engagement</SidebarLabel>
        </SidebarItem>
      </SidebarSection>
    </SidebarBody>
  </Sidebar>
);

const DEMO_NAVBAR = (
  <Navbar>
    <NavbarSpacer />
    <NavbarSection>
      <NavbarItem>Profile</NavbarItem>
    </NavbarSection>
  </Navbar>
);

export const Default: Story = {
  args: {},
  render: () => (
    <SidebarLayout sidebar={DEMO_SIDEBAR} navbar={DEMO_NAVBAR}>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          This is the main content area. The sidebar on the left is fixed at
          256px wide on desktop and collapses into a modal on mobile.
        </p>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-5"
            >
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Stat {i}
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">42</p>
            </div>
          ))}
        </div>
      </div>
    </SidebarLayout>
  ),
};
