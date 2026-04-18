import type { Meta, StoryObj } from "@storybook/react";

import { Skeleton } from "./skeleton";

const meta = {
  title: "Data Display/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  args: {
    className: "h-4 w-40",
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — a single muted, pulsing bar. */
export const Default: Story = {};

/** Circle — using `size-*` + `rounded-full`. */
export const Circle: Story = {
  args: { className: "size-10 rounded-full" },
};

/** Card-shell pattern — nested skeletons mimic a real card layout. */
export const CardShell: Story = {
  args: {},
  render: () => (
    <div className="rounded-xl border border-border bg-card p-5">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-3 h-7 w-28" />
      <Skeleton className="mt-2 h-3 w-40" />
    </div>
  ),
};

/** Table-shell pattern — bordered wrapper + header row + body rows. */
export const TableShell: Story = {
  args: {},
  render: () => (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border bg-muted/40 px-6 py-4">
        <div className="flex items-center gap-8">
          <Skeleton className="h-3 w-32 flex-1" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-8 px-6 py-5">
            <Skeleton className="h-4 w-40 flex-1" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  ),
};

/** Common shapes side-by-side. */
export const VariantMatrix: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="size-10 rounded-full" />
    </div>
  ),
};
