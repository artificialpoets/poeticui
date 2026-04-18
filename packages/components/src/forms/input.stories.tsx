import type { Meta, StoryObj } from "@storybook/react";
import { Mail, Search } from "lucide-react";

import { Input, InputGroup } from "./input";

const meta = {
  title: "Forms/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: [
        "text",
        "email",
        "number",
        "password",
        "search",
        "tel",
        "url",
        "date",
        "datetime-local",
        "month",
        "time",
        "week",
      ],
    },
    disabled: { control: "boolean" },
  },
  args: {
    placeholder: "you@example.com",
    type: "email",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true, value: "locked@example.com" },
};

/** With a leading icon via `<InputGroup>`. */
export const WithLeadingIcon: Story = {
  args: {},
  render: () => (
    <div className="max-w-sm space-y-3">
      <InputGroup>
        <Mail data-slot="icon" />
        <Input type="email" placeholder="you@example.com" />
      </InputGroup>
      <InputGroup>
        <Search data-slot="icon" />
        <Input type="search" placeholder="Search sites…" />
      </InputGroup>
    </div>
  ),
};

/** All input types at a glance. */
export const VariantMatrix: Story = {
  args: {},
  render: () => (
    <div className="grid max-w-xl grid-cols-2 gap-3">
      {(
        [
          "text",
          "email",
          "password",
          "number",
          "search",
          "tel",
          "url",
          "date",
        ] as const
      ).map((type) => (
        <div key={type}>
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {type}
          </p>
          <Input type={type} placeholder={type} />
        </div>
      ))}
    </div>
  ),
};
