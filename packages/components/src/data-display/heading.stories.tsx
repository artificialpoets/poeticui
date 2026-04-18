import type { Meta, StoryObj } from "@storybook/react";

import { Heading, Subheading } from "./heading";

const meta = {
  title: "Data Display/Heading",
  component: Heading,
  tags: ["autodocs"],
  argTypes: {
    as: { control: "select", options: ["h1", "h2", "h3", "h4", "h5", "h6"] },
    level: { control: "select", options: [1, 2, 3, 4] },
  },
  args: {
    children: "Design system is better than no design system",
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — renders as `<h1>` with `level={1}` styling. */
export const Default: Story = {};

/** Use `level` to decouple the semantic tag from the visual size. */
export const LevelOverride: Story = {
  args: { as: "h2", level: 4, children: "Semantic h2, styled as level 4" },
};

/** `<Subheading>` — pairs with a `<Heading>` above it. */
export const WithSubheading: Story = {
  args: {},
  render: () => (
    <div>
      <Heading>Dashboard overview</Heading>
      <Subheading>Snapshot of last 7 days across all sites</Subheading>
    </div>
  ),
};

/** All 4 visual levels × all 6 semantic tags. */
export const VariantMatrix: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-6">
      {([1, 2, 3, 4] as const).map((level) => (
        <section key={level} className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            level={level}
          </p>
          <Heading as="h1" level={level}>
            The quick brown fox jumps over the lazy dog
          </Heading>
        </section>
      ))}
    </div>
  ),
};
