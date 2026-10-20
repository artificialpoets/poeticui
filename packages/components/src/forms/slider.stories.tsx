import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { Description, Field, Label } from "./fieldset";
import { Slider } from "./slider";

const meta = {
  title: "Forms/Slider",
  component: Slider,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
  },
  args: {
    min: 0,
    max: 100,
    defaultValue: 60,
    disabled: false,
    "aria-label": "Sensitivity",
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };

/** Controlled, with a label and the value beside it. */
export const AsField: Story = {
  render: () => {
    const [value, setValue] = useState(0.6);
    return (
      <Field>
        <Label>Sensitivity</Label>
        <Description>Higher is stricter: fewer, closer matches.</Description>
        <div className="mt-3 flex items-center gap-3">
          <Slider
            aria-label="Sensitivity"
            min={0}
            max={1}
            step={0.01}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
          <span className="w-12 text-right font-mono text-sm tabular-nums">
            {Math.round(value * 100)}%
          </span>
        </div>
      </Field>
    );
  },
};
