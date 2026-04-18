import type { Meta, StoryObj } from "@storybook/react";

import { Link } from "./link";

const meta = {
  title: "Core/Link",
  component: Link,
  tags: ["autodocs"],
  args: {
    href: "#",
    children: "Read the docs",
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Plain link — defaults to Next.js Link semantics. */
export const Default: Story = {};

/** Inline prose with a link in the middle. */
export const Inline: Story = {
  args: {},
  render: () => (
    <p className="text-sm text-foreground">
      The quick brown fox <Link href="#">jumps over</Link> the lazy dog.
    </p>
  ),
};
