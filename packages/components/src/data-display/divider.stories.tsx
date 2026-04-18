import type { Meta, StoryObj } from "@storybook/react";

import { Divider } from "./divider";

const meta = {
  title: "Data Display/Divider",
  component: Divider,
  tags: ["autodocs"],
  argTypes: {
    soft: { control: "boolean" },
  },
  args: { soft: false },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — border-border color. */
export const Default: Story = {
  args: {},
  render: () => (
    <div className="max-w-md space-y-4">
      <p className="text-sm text-muted-foreground">Above the divider.</p>
      <Divider />
      <p className="text-sm text-muted-foreground">Below the divider.</p>
    </div>
  ),
};

/** `soft` — uses the softer muted border tone. Good for nested sections. */
export const Soft: Story = {
  args: { soft: true },
  render: (args) => (
    <div className="max-w-md space-y-4">
      <p className="text-sm text-muted-foreground">Above the soft divider.</p>
      <Divider {...args} />
      <p className="text-sm text-muted-foreground">Below the soft divider.</p>
    </div>
  ),
};
