import type { Meta, StoryObj } from "@storybook/react";

import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarLabel,
  NavbarSection,
  NavbarSpacer,
} from "./navbar";

const meta = {
  title: "Navigation/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: () => (
    <Navbar>
      <NavbarSection>
        <NavbarItem href="#" current>
          <NavbarLabel>Dashboard</NavbarLabel>
        </NavbarItem>
        <NavbarItem href="#">
          <NavbarLabel>Sites</NavbarLabel>
        </NavbarItem>
        <NavbarItem href="#">
          <NavbarLabel>Audience</NavbarLabel>
        </NavbarItem>
      </NavbarSection>
      <NavbarDivider />
      <NavbarSection>
        <NavbarItem href="#">Docs</NavbarItem>
      </NavbarSection>
      <NavbarSpacer />
      <NavbarSection>
        <NavbarItem>Profile</NavbarItem>
      </NavbarSection>
    </Navbar>
  ),
};
