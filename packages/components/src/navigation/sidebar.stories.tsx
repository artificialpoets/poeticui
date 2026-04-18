import type { Meta, StoryObj } from "@storybook/react";
import { BarChart3, DollarSign, Home, Monitor, Users } from "lucide-react";

import {
  Sidebar,
  SidebarBody,
  SidebarDivider,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from "./sidebar";

const meta = {
  title: "Navigation/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  args: {},
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: () => (
    <div className="h-[640px] w-64 border border-border bg-card">
      <Sidebar>
        <SidebarHeader>
          <SidebarHeading>Artificial Poets</SidebarHeading>
        </SidebarHeader>
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
          </SidebarSection>
          <SidebarDivider />
          <SidebarSection>
            <SidebarHeading>Analytics</SidebarHeading>
            <SidebarItem href="#">
              <Users data-slot="icon" />
              <SidebarLabel>Audience</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="#">
              <BarChart3 data-slot="icon" />
              <SidebarLabel>Engagement</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="#">
              <DollarSign data-slot="icon" />
              <SidebarLabel>Revenue</SidebarLabel>
            </SidebarItem>
          </SidebarSection>
          <SidebarSpacer />
        </SidebarBody>
        <SidebarFooter>
          <SidebarItem href="#">
            <SidebarLabel>Settings</SidebarLabel>
          </SidebarItem>
        </SidebarFooter>
      </Sidebar>
    </div>
  ),
};
