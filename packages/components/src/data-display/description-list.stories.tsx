import type { Meta, StoryObj } from "@storybook/react";

import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "./description-list";

const meta = {
  title: "Data Display/DescriptionList",
  component: DescriptionList,
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — label/value pairs laid out in a 2-column grid on desktop. */
export const Default: Story = {
  args: {},
  render: () => (
    <DescriptionList>
      <DescriptionTerm>Plan</DescriptionTerm>
      <DescriptionDetails>Professional</DescriptionDetails>

      <DescriptionTerm>Billing cycle</DescriptionTerm>
      <DescriptionDetails>Annual</DescriptionDetails>

      <DescriptionTerm>Seats</DescriptionTerm>
      <DescriptionDetails>12 of 25</DescriptionDetails>

      <DescriptionTerm>Next invoice</DescriptionTerm>
      <DescriptionDetails>Feb 14, 2027 · $2,400</DescriptionDetails>
    </DescriptionList>
  ),
};

/** Multi-line values — the layout accommodates wrapping. */
export const WithLongValues: Story = {
  args: {},
  render: () => (
    <div className="max-w-xl">
      <DescriptionList>
        <DescriptionTerm>Description</DescriptionTerm>
        <DescriptionDetails>
          A multi-site platform optimized for WordPress publishers, spanning 34
          active domains with a cumulative monthly audience north of 2M MAU.
        </DescriptionDetails>

        <DescriptionTerm>Primary contact</DescriptionTerm>
        <DescriptionDetails>
          Alex Rivera — alex@example.com — founder and CTO.
        </DescriptionDetails>
      </DescriptionList>
    </div>
  ),
};
