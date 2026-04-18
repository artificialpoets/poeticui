import type { Meta, StoryObj } from "@storybook/react";

import { Description, Label } from "./fieldset";
import { Radio, RadioField, RadioGroup } from "./radio";

const COLOR_OPTIONS = [
  "dark/zinc",
  "dark/white",
  "white",
  "dark",
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
  title: "Forms/Radio",
  component: Radio,
  tags: ["autodocs"],
  argTypes: {
    color: { control: "select", options: COLOR_OPTIONS },
    disabled: { control: "boolean" },
  },
  args: {
    value: "option-a",
    color: "dark/zinc",
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — a single Radio must live inside a `<RadioGroup>`. */
export const Default: Story = {
  args: {},
  render: () => (
    <RadioGroup defaultValue="a">
      <RadioField>
        <Radio value="a" />
        <Label>Option A</Label>
      </RadioField>
      <RadioField>
        <Radio value="b" />
        <Label>Option B</Label>
      </RadioField>
      <RadioField>
        <Radio value="c" />
        <Label>Option C</Label>
      </RadioField>
    </RadioGroup>
  ),
};

/** With descriptions. */
export const WithDescriptions: Story = {
  args: {},
  render: () => (
    <RadioGroup defaultValue="monthly">
      <RadioField>
        <Radio value="monthly" />
        <Label>Monthly</Label>
        <Description>$29 per month — cancel anytime.</Description>
      </RadioField>
      <RadioField>
        <Radio value="yearly" />
        <Label>Yearly</Label>
        <Description>$290 per year — save 17%.</Description>
      </RadioField>
    </RadioGroup>
  ),
};
