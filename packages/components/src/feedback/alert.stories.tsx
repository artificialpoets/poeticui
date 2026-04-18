import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import {
  Alert,
  AlertActions,
  AlertBody,
  AlertDescription,
  AlertTitle,
} from "./alert";
import { Button } from "../core/button";

const meta = {
  title: "Feedback/Alert (Legacy)",
  component: Alert,
  tags: ["autodocs"],
  args: {},
  parameters: {
    docs: {
      description: {
        component:
          '**Deprecated.** `Alert` is a thin alias for `<Dialog variant="alert">` kept for backward compatibility. New code should use `Dialog` directly — the alert variant preset is available via the `variant` prop.',
      },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button color="red" onClick={() => setOpen(true)}>
        Delete project
      </Button>
      <Alert open={open} onClose={() => setOpen(false)}>
        <AlertTitle>Delete project?</AlertTitle>
        <AlertDescription>
          This action permanently removes the project and all its data.
        </AlertDescription>
        <AlertBody>
          <p className="text-sm text-muted-foreground">
            Team members will lose access. Billing will stop at the end of the
            current period.
          </p>
        </AlertBody>
        <AlertActions>
          <Button plain onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={() => setOpen(false)}>
            Delete permanently
          </Button>
        </AlertActions>
      </Alert>
    </>
  );
}

/** Legacy alias. Prefer `<Dialog variant="alert">` in new code. */
export const Default: Story = {
  args: {},
  render: () => <Demo />,
};
