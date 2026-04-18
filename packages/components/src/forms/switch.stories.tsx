import type { Meta, StoryObj } from "@storybook/react";

import { Description, Label } from "./fieldset";
import { Switch, SwitchField, SwitchGroup } from "./switch";

const COLOR_OPTIONS = [
  "dark/zinc",
  "dark/white",
  "dark",
  "zinc",
  "white",
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
  title: "Forms/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    color: { control: "select", options: COLOR_OPTIONS },
    size: { control: "select", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
  },
  args: {
    color: "dark/zinc",
    size: "md",
    disabled: false,
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const On: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };

/** With label + description via `<SwitchField>`. */
export const AsField: Story = {
  args: {},
  render: () => (
    <SwitchField>
      <Label>Ship updates weekly</Label>
      <Description>
        A roundup of what&apos;s new, typically Friday morning.
      </Description>
      <Switch defaultChecked />
    </SwitchField>
  ),
};

/** Group — stacked switches in a settings panel. */
export const AsGroup: Story = {
  args: {},
  render: () => (
    <SwitchGroup>
      <SwitchField>
        <Label>Enable marketing emails</Label>
        <Switch defaultChecked />
      </SwitchField>
      <SwitchField>
        <Label>Enable product update emails</Label>
        <Switch />
      </SwitchField>
      <SwitchField>
        <Label>Enable weekly digest</Label>
        <Switch defaultChecked />
      </SwitchField>
    </SwitchGroup>
  ),
};

/** Sizes × states. */
export const VariantMatrix: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-6">
      {(["sm", "md", "lg"] as const).map((size) => (
        <section key={size}>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            size={size}
          </p>
          <div className="flex items-center gap-6">
            <Switch size={size} />
            <Switch size={size} defaultChecked />
            <Switch size={size} disabled />
            <Switch size={size} defaultChecked disabled />
          </div>
        </section>
      ))}
    </div>
  ),
};
