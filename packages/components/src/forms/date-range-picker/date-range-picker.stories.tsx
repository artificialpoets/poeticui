import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { DateRangePicker, type DateRange } from "./date-range-picker";
import { getRangeForPreset } from "./presets";

const meta = {
  title: "Forms/DateRangePicker",
  component: DateRangePicker,
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controlled — pair with useState. */
export const Default: Story = {
  args: {},
  render: () => {
    const [range, setRange] = useState<DateRange>(
      getRangeForPreset("last_30_days"),
    );
    return (
      <div className="space-y-3">
        <DateRangePicker value={range} onChange={setRange} />
        <p className="text-xs text-muted-foreground">
          Current value: <code>{range.from}</code> → <code>{range.to}</code>
        </p>
      </div>
    );
  },
};

/** Preset shortcuts — 7d, 30d, 90d, etc. */
export const PresetLast7Days: Story = {
  args: {},
  render: () => {
    const [range, setRange] = useState<DateRange>(
      getRangeForPreset("last_7_days"),
    );
    return <DateRangePicker value={range} onChange={setRange} />;
  },
};
