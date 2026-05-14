import type { Meta, StoryObj } from "@storybook/react";

import { Funnel } from "./funnel";

const meta = {
  title: "Data Display/Funnel",
  component: Funnel,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    hideArrows: { control: "boolean" },
  },
  args: {
    orientation: "horizontal",
    hideArrows: false,
    stages: [
      { label: "Visitors", value: 428_000 },
      {
        label: "Engaged readers",
        value: 118_000,
        conversion: 0.275,
        hint: "avg 2:14 read",
      },
      {
        label: "Subscribers",
        value: 9_841,
        conversion: 0.083,
        hint: "+312 this week",
      },
      {
        label: "Leads",
        value: 1_416,
        conversion: 0.144,
        hint: "+124 this week",
        tone: "primary",
      },
    ],
  },
} satisfies Meta<typeof Funnel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Vertical: Story = {
  args: { orientation: "vertical" },
};

/** Sales funnel — different domain, same shape. */
export const SalesPipeline: Story = {
  args: {
    stages: [
      { label: "Leads", value: 1240, tone: "info" },
      { label: "MQL", value: 320, conversion: 0.258 },
      { label: "SQL", value: 92, conversion: 0.288 },
      { label: "Opportunity", value: 28, conversion: 0.304 },
      { label: "Closed-won", value: 9, conversion: 0.321, tone: "success" },
    ],
  },
};

/** Hide arrows for a simple stage report. */
export const NoArrows: Story = {
  args: { hideArrows: true },
};
