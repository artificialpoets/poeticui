import type { Meta, StoryObj } from "@storybook/react";

import { Checkbox, CheckboxField, CheckboxGroup } from "./checkbox";
import { Description, Label } from "./fieldset";

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
  title: "Forms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    color: { control: "select", options: COLOR_OPTIONS },
    size: { control: "select", options: ["sm", "md"] },
    disabled: { control: "boolean" },
    checked: { control: "boolean" },
    indeterminate: { control: "boolean" },
  },
  args: {
    color: "dark/zinc",
    size: "md",
    checked: false,
    disabled: false,
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Checked: Story = { args: { checked: true } };
export const Indeterminate: Story = { args: { indeterminate: true } };
export const Disabled: Story = { args: { disabled: true, checked: true } };

/** With label + description via `<CheckboxField>`. */
export const AsField: Story = {
  args: {},
  render: () => (
    <CheckboxField>
      <Checkbox />
      <Label>Email me product updates</Label>
      <Description>Roughly once a month, never spam.</Description>
    </CheckboxField>
  ),
};

/** Group — stacked checkboxes sharing a label. */
export const AsGroup: Story = {
  args: {},
  render: () => (
    <CheckboxGroup>
      <CheckboxField>
        <Checkbox defaultChecked />
        <Label>Enable marketing emails</Label>
      </CheckboxField>
      <CheckboxField>
        <Checkbox />
        <Label>Enable product update emails</Label>
      </CheckboxField>
      <CheckboxField>
        <Checkbox />
        <Label>Enable weekly digest</Label>
      </CheckboxField>
    </CheckboxGroup>
  ),
};

/** States × sizes. */
export const VariantMatrix: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-6">
      {(["sm", "md"] as const).map((size) => (
        <section key={size}>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            size={size}
          </p>
          <div className="flex items-center gap-6">
            <Checkbox size={size} />
            <Checkbox size={size} defaultChecked />
            <Checkbox size={size} indeterminate />
            <Checkbox size={size} disabled />
            <Checkbox size={size} defaultChecked disabled />
          </div>
        </section>
      ))}
    </div>
  ),
};
