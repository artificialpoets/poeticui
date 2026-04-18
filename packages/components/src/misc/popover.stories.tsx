import type { Meta, StoryObj } from "@storybook/react";
import { Info } from "lucide-react";

import { Popover, PopoverButton, PopoverPanel } from "./popover";
import { Button } from "../core/button";

const meta = {
  title: "Misc/Popover",
  component: Popover,
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Popover with arbitrary content (not a menu). */
export const Default: Story = {
  args: {},
  render: () => (
    <Popover>
      <PopoverButton as={Button} outline>
        <Info data-slot="icon" />
        Help
      </PopoverButton>
      <PopoverPanel className="w-72 space-y-2 p-4">
        <p className="text-sm font-semibold text-foreground">
          What counts as a session?
        </p>
        <p className="text-sm text-muted-foreground">
          Any series of events from the same visitor within 30 minutes. Idle
          &gt; 30m starts a new session.
        </p>
      </PopoverPanel>
    </Popover>
  ),
};

/** With a form inside — quick-actions pattern. */
export const WithForm: Story = {
  args: {},
  render: () => (
    <Popover>
      <PopoverButton as={Button}>Schedule report</PopoverButton>
      <PopoverPanel className="w-80 space-y-3 p-4">
        <p className="text-sm font-semibold text-foreground">Weekly report</p>
        <p className="text-sm text-muted-foreground">
          We&apos;ll email a summary every Monday at 9am.
        </p>
        <div className="flex justify-end gap-2">
          <Button plain>Cancel</Button>
          <Button>Schedule</Button>
        </div>
      </PopoverPanel>
    </Popover>
  ),
};
