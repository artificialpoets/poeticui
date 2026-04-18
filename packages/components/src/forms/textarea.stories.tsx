import type { Meta, StoryObj } from "@storybook/react";

import { Textarea } from "./textarea";

const meta = {
  title: "Forms/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    resizable: { control: "boolean" },
    disabled: { control: "boolean" },
    rows: { control: "number" },
  },
  args: {
    placeholder: "Tell us more…",
    resizable: true,
    rows: 4,
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NotResizable: Story = { args: { resizable: false } };

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue:
      "Locked content — the textarea keeps its padding / border but can't be edited.",
  },
};

export const PreFilled: Story = {
  args: {
    defaultValue:
      "We've been using the platform for about 3 months now. The biggest wins: cleaner data, less manual work, faster reporting. Wishlist: better CSV export.",
    rows: 6,
  },
};
