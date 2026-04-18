import type { Meta, StoryObj } from "@storybook/react";
import { BarChart3, Gauge, Layers, Users } from "lucide-react";

import { SectionHeader } from "./section-header";

const meta = {
  title: "Layout/SectionHeader",
  component: SectionHeader,
  tags: ["autodocs"],
  argTypes: {
    as: {
      control: "select",
      options: ["h2", "h3", "h4", "h5", "h6"],
    },
  },
  args: {
    title: "Tech stack",
    icon: Layers,
    as: "h3",
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — h3 with an icon. */
export const Default: Story = {};

/** Without an icon slot. */
export const NoIcon: Story = {
  args: { icon: undefined, title: "Overview" },
};

/** As h2 — for larger section breaks. */
export const AsH2: Story = {
  args: { as: "h2", title: "Site health" },
};

/** All five heading levels stacked — shows the semantic tier without any style change. */
export const VariantMatrix: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-4">
      {[
        { as: "h2" as const, icon: BarChart3, title: "h2 — Top-level section" },
        { as: "h3" as const, icon: Gauge, title: "h3 — Default section" },
        { as: "h4" as const, icon: Users, title: "h4 — Nested subsection" },
        { as: "h5" as const, icon: Layers, title: "h5 — Deep nesting" },
        { as: "h6" as const, icon: Layers, title: "h6 — Deepest nesting" },
      ].map((spec) => (
        <SectionHeader
          key={spec.as}
          as={spec.as}
          icon={spec.icon}
          title={spec.title}
        />
      ))}
      <p className="text-xs text-muted-foreground">
        Visual treatment is identical across levels — <code>as</code> only
        affects the semantic HTML tag, not the typography. Use it so
        accessibility / SEO tools see the correct outline.
      </p>
    </div>
  ),
};
