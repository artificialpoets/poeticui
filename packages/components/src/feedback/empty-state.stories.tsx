import type { Meta, StoryObj } from "@storybook/react";
import { Box, Inbox, Search, SearchX, Users } from "lucide-react";

import { EmptyState } from "./empty-state";
import { Button } from "../core/button";

const meta = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    bordered: { control: "boolean" },
  },
  args: {
    icon: Inbox,
    title: "No items yet",
    description: "Your items will appear here once you create some.",
    size: "md",
    bordered: false,
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — icon + title + description. */
export const Default: Story = {};

/** Minimal — title only. */
export const TitleOnly: Story = {
  args: { title: "Nothing to show", description: undefined, icon: undefined },
};

/** Full loadout — icon, title, description, and an action button. */
export const WithAction: Story = {
  args: {
    icon: Users,
    title: "No team members yet",
    description: "Invite teammates to collaborate on this project.",
    action: <Button>Invite people</Button>,
  },
};

/** Search-result empty state (no match). */
export const SearchEmpty: Story = {
  args: {
    icon: SearchX,
    title: "No results for 'acme corp'",
    description: "Try a different search term or clear filters.",
    action: <Button outline>Clear filters</Button>,
  },
};

/** Card-framed (dashed border) — good for empty table/grid panels. */
export const BorderedLarge: Story = {
  args: {
    bordered: true,
    size: "lg",
    icon: Box,
    title: "No sites yet",
    description: "Your PoeHost sites will appear here once provisioned.",
  },
};

/** Three sizes side by side. */
export const VariantMatrix: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-6">
      <section className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Sizes (sm / md / lg) — bordered
        </p>
        <div className="grid grid-cols-3 gap-4">
          {(["sm", "md", "lg"] as const).map((size) => (
            <EmptyState
              key={size}
              bordered
              size={size}
              icon={Search}
              title={`Size ${size}`}
              description="Consistent vertical rhythm, icon circle scales with size."
            />
          ))}
        </div>
      </section>
    </div>
  ),
};
