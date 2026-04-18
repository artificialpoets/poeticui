import type { Meta, StoryObj } from "@storybook/react";

import { PageHeader } from "./page-header";
import { Button } from "../core/button";

const meta = {
  title: "Layout/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  args: {
    title: "Active users",
    description:
      "Monthly active and average daily active users across all sites and device segments.",
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TitleOnly: Story = {
  args: { title: "Sites", description: undefined },
};

/** With a right-side action slot (filters, date picker, primary CTA). */
export const WithRightSlot: Story = {
  args: {
    right: (
      <div className="flex items-center gap-2">
        <Button outline>Export CSV</Button>
        <Button>New report</Button>
      </div>
    ),
  },
};
