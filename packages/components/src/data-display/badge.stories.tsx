import type { Meta, StoryObj } from "@storybook/react";

import { Badge, BadgeButton } from "./badge";

const COLOR_OPTIONS = [
  "muted",
  "foreground",
  "zinc",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
] as const;

const meta = {
  title: "Data Display/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    color: { control: "select", options: COLOR_OPTIONS },
    size: { control: "select", options: ["sm", "md"] },
  },
  args: {
    children: "Paid",
    color: "green",
    size: "md",
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = { args: { size: "sm" } };

export const Muted: Story = { args: { color: "muted", children: "Draft" } };

export const Destructive: Story = {
  args: { color: "red", children: "Overdue" },
};

/** Clickable variant — renders as a `<button>` or `<a>` if `href` set. */
export const AsButton: Story = {
  args: {},
  render: () => (
    <div className="flex items-center gap-3">
      <BadgeButton color="blue" onClick={() => alert("Clicked")}>
        Click me
      </BadgeButton>
      <BadgeButton color="emerald" href="#">
        Link badge
      </BadgeButton>
    </div>
  ),
};

/** All colors at md + sm sizes. */
export const VariantMatrix: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-6">
      <section>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          md
        </p>
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map((color) => (
            <Badge key={color} color={color}>
              {color}
            </Badge>
          ))}
        </div>
      </section>
      <section>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          sm
        </p>
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map((color) => (
            <Badge key={color} color={color} size="sm">
              {color}
            </Badge>
          ))}
        </div>
      </section>
    </div>
  ),
};
