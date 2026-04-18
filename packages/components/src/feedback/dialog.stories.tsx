import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "./dialog";
import { Button } from "../core/button";

const meta = {
  title: "Feedback/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "alert"] },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl"],
    },
  },
  args: {
    variant: "default",
    size: "md",
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function Controlled({
  variant,
  size,
}: {
  variant?: "default" | "alert";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
}) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog open={open} onClose={setOpen} variant={variant} size={size}>
        <DialogTitle>Confirm deletion</DialogTitle>
        <DialogDescription>
          This action can&apos;t be undone. 3 sites will be unlinked from the
          project.
        </DialogDescription>
        <DialogBody>
          <p className="text-sm text-muted-foreground">
            You can always reconnect sites later from the Sites tab.
          </p>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={() => setOpen(false)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

/** Default — renders in an open state on mount so you can see it without clicking. */
export const Default: Story = {
  args: {},
  render: (args) => <Controlled variant={args.variant} size={args.size} />,
};

/** Destructive-style "alert" variant — applied via `variant="alert"`. */
export const AlertVariant: Story = {
  args: { variant: "alert" },
  render: (args) => <Controlled variant={args.variant} size={args.size} />,
};

/** Larger size. */
export const Large: Story = {
  args: { size: "2xl" },
  render: (args) => <Controlled variant={args.variant} size={args.size} />,
};
