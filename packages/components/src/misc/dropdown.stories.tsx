import type { Meta, StoryObj } from "@storybook/react";
import { ChevronDown, MoreHorizontal } from "lucide-react";

import {
  Dropdown,
  DropdownButton,
  DropdownDescription,
  DropdownDivider,
  DropdownHeader,
  DropdownHeading,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  DropdownSection,
  DropdownShortcut,
} from "./dropdown";
import { Button } from "../core/button";

const meta = {
  title: "Misc/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Basic — button trigger + menu of items. */
export const Default: Story = {
  args: {},
  render: () => (
    <Dropdown>
      <DropdownButton as={Button}>
        Options
        <ChevronDown data-slot="icon" />
      </DropdownButton>
      <DropdownMenu>
        <DropdownItem>View</DropdownItem>
        <DropdownItem>Edit</DropdownItem>
        <DropdownItem>Duplicate</DropdownItem>
        <DropdownDivider />
        <DropdownItem>
          <DropdownLabel>Delete</DropdownLabel>
          <DropdownShortcut keys="⌘⌫" />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

/** With sections + headings. */
export const WithSections: Story = {
  args: {},
  render: () => (
    <Dropdown>
      <DropdownButton as={Button} outline>
        Filters <ChevronDown data-slot="icon" />
      </DropdownButton>
      <DropdownMenu className="min-w-64">
        <DropdownSection>
          <DropdownHeading>Status</DropdownHeading>
          <DropdownItem>Active</DropdownItem>
          <DropdownItem>Pending</DropdownItem>
          <DropdownItem>Archived</DropdownItem>
        </DropdownSection>
        <DropdownDivider />
        <DropdownSection>
          <DropdownHeading>Owner</DropdownHeading>
          <DropdownItem>Me</DropdownItem>
          <DropdownItem>Anyone</DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  ),
};

/** Kebab trigger — the row-action pattern. */
export const KebabTrigger: Story = {
  args: {},
  render: () => (
    <Dropdown>
      <DropdownButton plain aria-label="More actions">
        <MoreHorizontal data-slot="icon" />
      </DropdownButton>
      <DropdownMenu anchor="bottom end">
        <DropdownItem>View</DropdownItem>
        <DropdownItem>Rename</DropdownItem>
        <DropdownDivider />
        <DropdownItem>Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

/** With description under each item. */
export const WithDescriptions: Story = {
  args: {},
  render: () => (
    <Dropdown>
      <DropdownButton as={Button}>Account</DropdownButton>
      <DropdownMenu className="min-w-72">
        <DropdownHeader>Signed in as alex@poets.com</DropdownHeader>
        <DropdownDivider />
        <DropdownItem>
          <DropdownLabel>Settings</DropdownLabel>
          <DropdownDescription>
            Manage profile, notifications, and API keys.
          </DropdownDescription>
        </DropdownItem>
        <DropdownItem>
          <DropdownLabel>Billing</DropdownLabel>
          <DropdownDescription>
            Invoices, payment methods, and plan changes.
          </DropdownDescription>
        </DropdownItem>
        <DropdownDivider />
        <DropdownItem>Log out</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};
