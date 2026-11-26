import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { SegmentedTabs } from "./segmented-tabs";

const meta = {
  title: "Navigation/SegmentedTabs",
  component: SegmentedTabs,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md"] },
    fullWidth: { control: "boolean" },
  },
  args: {
    size: "md",
    fullWidth: false,
    value: "",
    onValueChange: () => {},
    options: [],
  },
} satisfies Meta<typeof SegmentedTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controlled via `options` array. */
export const Default: Story = {
  args: {},
  render: ({ size, fullWidth }) => {
    const [value, setValue] = useState("combined");
    return (
      <SegmentedTabs
        size={size}
        fullWidth={fullWidth}
        value={value}
        onValueChange={setValue}
        options={[
          { value: "combined", label: "Combined" },
          { value: "desktop", label: "Desktop" },
          { value: "mobile", label: "Mobile" },
        ]}
      />
    );
  },
};

export const Small: Story = {
  args: { size: "sm" },
  render: ({ size, fullWidth }) => {
    const [value, setValue] = useState("7d");
    return (
      <SegmentedTabs
        size={size}
        fullWidth={fullWidth}
        value={value}
        onValueChange={setValue}
        options={[
          { value: "1d", label: "1d" },
          { value: "7d", label: "7d" },
          { value: "30d", label: "30d" },
          { value: "90d", label: "90d" },
        ]}
      />
    );
  },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  render: ({ size, fullWidth }) => {
    const [value, setValue] = useState("all");
    return (
      <div className="max-w-md">
        <SegmentedTabs
          size={size}
          fullWidth={fullWidth}
          value={value}
          onValueChange={setValue}
          options={[
            { value: "all", label: "All" },
            { value: "open", label: "Open" },
            { value: "done", label: "Done" },
          ]}
        />
      </div>
    );
  },
};
