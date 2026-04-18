import type { Meta, StoryObj } from "@storybook/react";
import { Monitor } from "lucide-react";

import { TableFilterTrigger } from "./table-filter-trigger";
import { Dropdown, DropdownItem, DropdownMenu } from "../misc/dropdown";

const meta = {
  title: "Tables/TableFilterTrigger",
  component: TableFilterTrigger,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["fit", "fill"] },
  },
  args: {
    variant: "fit",
    children: "Device",
  },
} satisfies Meta<typeof TableFilterTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — fit variant (auto width). */
export const Default: Story = {
  args: {},
  render: (args) => (
    <Dropdown>
      <TableFilterTrigger {...args} />
      <DropdownMenu anchor="bottom start" className="min-w-40">
        <DropdownItem>All</DropdownItem>
        <DropdownItem>Desktop</DropdownItem>
        <DropdownItem>Mobile</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

/** With an active-filter suffix + icon. */
export const WithActiveFilter: Story = {
  args: {
    children: (
      <>
        Device
        <span className="text-primary">
          (<Monitor className="inline size-3.5" />)
        </span>
      </>
    ),
  },
  render: (args) => (
    <Dropdown>
      <TableFilterTrigger {...args} />
      <DropdownMenu anchor="bottom start" className="min-w-40">
        <DropdownItem>All</DropdownItem>
        <DropdownItem>Desktop</DropdownItem>
        <DropdownItem>Mobile</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

/** Fill variant — stretches to the full header cell width. */
export const FillVariant: Story = {
  args: { variant: "fill" },
  render: (args) => (
    <div className="w-48 rounded border border-border bg-card p-2">
      <Dropdown>
        <TableFilterTrigger {...args} />
        <DropdownMenu anchor="bottom start">
          <DropdownItem>All</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  ),
};
