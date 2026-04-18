import type { Meta, StoryObj } from "@storybook/react";

import { Select } from "./select";

const meta = {
  title: "Forms/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    multiple: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    multiple: false,
    disabled: false,
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const OPTIONS = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "archived", label: "Archived" },
];

export const Default: Story = {
  args: {},
  render: (args) => (
    <Select {...args} defaultValue="active">
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Select>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <Select {...args} defaultValue="active">
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Select>
  ),
};

/** `multiple` — renders as a multi-select with a taller list. */
export const Multiple: Story = {
  args: { multiple: true },
  render: (args) => (
    <Select {...args} defaultValue={["active", "pending"]} className="h-32">
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Select>
  ),
};
