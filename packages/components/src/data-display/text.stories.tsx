import type { Meta, StoryObj } from "@storybook/react";

import { Code, Strong, Text, TextLink } from "./text";

const meta = {
  title: "Data Display/Text",
  component: Text,
  tags: ["autodocs"],
  args: {
    children:
      "Text is the default body copy component — use it for paragraphs, descriptions, and anywhere prose-y content appears.",
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — `<p>` with muted-foreground color and body line-height. */
export const Default: Story = {};

/** Family — `<Text>`, `<Strong>`, `<Code>`, `<TextLink>`. */
export const Family: Story = {
  args: {},
  render: () => (
    <Text>
      When you write copy inside a <Strong>design system</Strong>, reach for{" "}
      <Code>Text</Code>, not raw <Code>&lt;p&gt;</Code>. Inline accents like{" "}
      <TextLink href="#">TextLink</TextLink> pick up the accent token
      automatically.
    </Text>
  ),
};

/** Text in a multi-paragraph flow. */
export const Prose: Story = {
  args: {},
  render: () => (
    <div className="max-w-prose space-y-4">
      <Text>
        The first paragraph. Text wraps at a comfortable measure without needing
        a <Code>max-width</Code> utility at every call site.
      </Text>
      <Text>
        The second paragraph. Notice the consistent line-height and how{" "}
        <Strong>inline emphasis</Strong> settles against the body tone.
      </Text>
    </div>
  ),
};
