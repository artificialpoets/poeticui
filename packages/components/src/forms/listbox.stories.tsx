import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import {
  Listbox,
  ListboxDescription,
  ListboxLabel,
  ListboxOption,
} from "./listbox";

const meta = {
  title: "Forms/Listbox",
  component: Listbox,
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Listbox>;

export default meta;
type Story = StoryObj<typeof meta>;

const PLANS = [
  { id: "free", name: "Free", seats: "1 seat" },
  { id: "team", name: "Team", seats: "Up to 10 seats" },
  { id: "business", name: "Business", seats: "Up to 50 seats" },
  { id: "enterprise", name: "Enterprise", seats: "Unlimited" },
];

export const Default: Story = {
  args: {},
  render: () => {
    const [plan, setPlan] = useState(PLANS[1].id);
    return (
      <div className="w-72">
        <Listbox value={plan} onChange={setPlan} aria-label="Pick a plan">
          {PLANS.map((p) => (
            <ListboxOption key={p.id} value={p.id}>
              <ListboxLabel>{p.name}</ListboxLabel>
              <ListboxDescription>{p.seats}</ListboxDescription>
            </ListboxOption>
          ))}
        </Listbox>
      </div>
    );
  },
};
