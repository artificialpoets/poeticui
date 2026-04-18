import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { DrawerShell } from "./drawer-shell";
import { Button } from "../core/button";

const meta = {
  title: "Layout/DrawerShell",
  component: DrawerShell,
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof DrawerShell>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ title }: { title?: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <DrawerShell open={open} onClose={() => setOpen(false)} title={title}>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            Drawers slide in from the right and are ideal for row-level detail
            views — a single-click expansion without navigating away.
          </p>
          <p>
            They scroll internally, so the drawer body can contain arbitrarily
            long content.
          </p>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Detail
            </p>
            <p className="mt-1 text-foreground">
              Any component tree can go in the drawer body.
            </p>
          </div>
        </div>
      </DrawerShell>
    </>
  );
}

export const Default: Story = {
  args: {},
  render: () => <Demo title="Site details" />,
};

export const WithoutTitle: Story = {
  args: {},
  render: () => <Demo />,
};
