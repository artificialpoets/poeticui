import type { Meta, StoryObj } from "@storybook/react";

import { Tabs } from "./tabs";

const meta = {
  title: "Navigation/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Uncontrolled — Tabs owns the active state. */
export const Default: Story = {
  args: {},
  render: () => (
    <Tabs
      defaultTabId="overview"
      tabs={[
        {
          id: "overview",
          label: "Overview",
          content: (
            <p className="text-sm text-muted-foreground">
              Summary metrics go here.
            </p>
          ),
        },
        {
          id: "audit",
          label: "Audit",
          content: (
            <p className="text-sm text-muted-foreground">
              Log of changes and events.
            </p>
          ),
        },
        {
          id: "settings",
          label: "Settings",
          content: (
            <p className="text-sm text-muted-foreground">
              Configuration knobs.
            </p>
          ),
          disabled: true,
        },
      ]}
    />
  ),
};
