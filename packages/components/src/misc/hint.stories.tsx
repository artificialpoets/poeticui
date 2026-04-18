import type { Meta, StoryObj } from "@storybook/react";

import { Hint } from "./hint";

const meta = {
  title: "Misc/Hint",
  component: Hint,
  tags: ["autodocs"],
  args: {
    message: "Rolling window — always based on the last 30 days.",
    children: (
      <span className="cursor-default underline decoration-dotted underline-offset-4 text-muted-foreground">
        MAU
      </span>
    ),
  },
} satisfies Meta<typeof Hint>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Hover the dotted-underline text. */
export const Default: Story = {};

/** Used to annotate a column header with a clarifying definition. */
export const OnTableHeader: Story = {
  args: {},
  render: () => (
    <div className="rounded-xl border border-border bg-card px-6 py-4">
      <div className="flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <Hint message="Monthly active users — sessions with at least one event in the last 30 days.">
          <span className="cursor-default underline decoration-dotted underline-offset-4">
            MAU
          </span>
        </Hint>
        <Hint message="Daily active users — unique sessions per day.">
          <span className="cursor-default underline decoration-dotted underline-offset-4">
            DAU
          </span>
        </Hint>
        <Hint message="Engaged sessions lasting 10s+.">
          <span className="cursor-default underline decoration-dotted underline-offset-4">
            Engagement
          </span>
        </Hint>
      </div>
    </div>
  ),
};
