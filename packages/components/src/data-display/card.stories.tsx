import type { Meta, StoryObj } from "@storybook/react";

import { Card } from "./card";

const meta = {
  title: "Data Display/Card",
  component: Card,
  tags: ["autodocs"],
  args: {
    children: (
      <>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Monthly active users
        </p>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          38,241
        </p>
        <p className="mt-1 text-xs text-muted-foreground">+12% vs last month</p>
      </>
    ),
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — a bordered, padded container (`bg-card + border-border + rounded-xl`). */
export const Default: Story = {};

/** Empty — just the chrome. */
export const Empty: Story = {
  args: { children: null, className: "h-32" },
};

/** Card grid — what consumers usually do with it. */
export const Grid: Story = {
  args: {},
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {[
        { label: "Pages", value: "1,234" },
        { label: "Sessions", value: "5,678" },
        { label: "Conversions", value: "12%" },
      ].map((stat) => (
        <Card key={stat.label}>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {stat.label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {stat.value}
          </p>
        </Card>
      ))}
    </div>
  ),
};
