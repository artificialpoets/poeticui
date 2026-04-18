import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./button";

const meta = {
  title: "Core/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "outline", "plain"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    color: {
      control: "select",
      options: [
        "dark/zinc",
        "light",
        "dark/white",
        "dark",
        "white",
        "zinc",
        "indigo",
        "cyan",
        "red",
        "orange",
        "amber",
        "yellow",
        "lime",
        "green",
        "emerald",
        "teal",
        "sky",
        "blue",
        "violet",
        "purple",
        "fuchsia",
        "pink",
        "rose",
      ],
    },
    disabled: { control: "boolean" },
  },
  args: {
    children: "Click me",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Solid: Story = {
  args: { variant: "solid" },
};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Plain: Story = {
  args: { variant: "plain" },
};

export const Disabled: Story = {
  args: { variant: "solid", disabled: true },
};

/**
 * VariantMatrix — all three variants × three sizes.
 * Useful for eyeballing the full combinatorial space in one glance.
 */
export const VariantMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["solid", "outline", "plain"] as const).map((variant) => (
        <div key={variant} className="flex items-center gap-3">
          <span className="w-16 text-sm text-muted-foreground">{variant}</span>
          {(["sm", "md", "lg"] as const).map((size) => (
            <Button key={size} variant={variant} size={size}>
              {size}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};
