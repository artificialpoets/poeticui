import type { Meta, StoryObj } from "@storybook/react";

import { Checkbox, CheckboxField } from "./checkbox";
import {
  Description,
  ErrorMessage,
  Field,
  FieldGroup,
  Fieldset,
  Label,
  Legend,
} from "./fieldset";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Button } from "../core/button";

const meta = {
  title: "Forms/Fieldset",
  component: Fieldset,
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Fieldset>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A single `<Field>` — label + input + description. Order matters. */
export const SingleField: Story = {
  args: {},
  render: () => (
    <Field>
      <Label>Email</Label>
      <Input type="email" placeholder="you@example.com" />
      <Description>We&apos;ll never share it.</Description>
    </Field>
  ),
};

/** With an error message. */
export const FieldWithError: Story = {
  args: {},
  render: () => (
    <Field>
      <Label>Email</Label>
      <Input type="email" defaultValue="not an email" invalid />
      <ErrorMessage>Please enter a valid email address.</ErrorMessage>
    </Field>
  ),
};

/** Full form — `<Fieldset>` + `<Legend>` + `<FieldGroup>` of `<Field>`s. */
export const FullForm: Story = {
  args: {},
  render: () => (
    <form className="max-w-lg space-y-8">
      <Fieldset>
        <Legend>Shipping address</Legend>
        <FieldGroup>
          <Field>
            <Label>Full name</Label>
            <Input name="full-name" />
          </Field>
          <Field>
            <Label>Street address</Label>
            <Input name="street" />
            <Description>Building number first.</Description>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <Label>City</Label>
              <Input name="city" />
            </Field>
            <Field>
              <Label>ZIP</Label>
              <Input name="zip" />
            </Field>
          </div>
        </FieldGroup>
      </Fieldset>

      <Fieldset>
        <Legend>Order notes</Legend>
        <FieldGroup>
          <Field>
            <Label>Special instructions</Label>
            <Textarea rows={4} placeholder="Leave it at the back door…" />
          </Field>
          <CheckboxField>
            <Checkbox />
            <Label>Email me a confirmation</Label>
          </CheckboxField>
        </FieldGroup>
      </Fieldset>

      <div className="flex justify-end gap-3">
        <Button plain>Cancel</Button>
        <Button>Place order</Button>
      </div>
    </form>
  ),
};
