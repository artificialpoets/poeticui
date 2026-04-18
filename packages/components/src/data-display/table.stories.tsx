import type { Meta, StoryObj } from "@storybook/react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

const meta = {
  title: "Data Display/Table",
  component: Table,
  tags: ["autodocs"],
  argTypes: {
    striped: { control: "boolean" },
    bleed: { control: "boolean" },
    compact: { control: "boolean" },
    dense: { control: "boolean" },
    grid: { control: "boolean" },
  },
  args: {
    striped: false,
    bleed: false,
    compact: false,
    dense: false,
    grid: false,
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const ROWS = [
  { id: 1, name: "acme-news.com", visitors: "12.4K", trend: "+12%" },
  { id: 2, name: "acme-market.com", visitors: "8.7K", trend: "+3%" },
  { id: 3, name: "acme-blog.com", visitors: "5.1K", trend: "-2%" },
  { id: 4, name: "acme-docs.com", visitors: "2.3K", trend: "+18%" },
];

function Body() {
  return (
    <>
      <TableHead>
        <TableRow>
          <TableHeader>Site</TableHeader>
          <TableHeader>Visitors</TableHeader>
          <TableHeader>Trend</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {ROWS.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-medium">{r.name}</TableCell>
            <TableCell>{r.visitors}</TableCell>
            <TableCell>{r.trend}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}

export const Default: Story = {
  args: {},
  render: (args) => (
    <Table {...args}>
      <Body />
    </Table>
  ),
};

export const Striped: Story = {
  args: { striped: true },
  render: (args) => (
    <Table {...args}>
      <Body />
    </Table>
  ),
};

export const Compact: Story = {
  args: { compact: true, striped: true },
  render: (args) => (
    <Table {...args}>
      <Body />
    </Table>
  ),
};

export const Grid: Story = {
  args: { grid: true },
  render: (args) => (
    <Table {...args}>
      <Body />
    </Table>
  ),
};

/** Rows as links — pass `href` on `<TableRow>` and the first cell becomes clickable. */
export const LinkedRows: Story = {
  args: { striped: true },
  render: (args) => (
    <Table {...args}>
      <TableHead>
        <TableRow>
          <TableHeader>Site</TableHeader>
          <TableHeader>Visitors</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {ROWS.map((r) => (
          <TableRow key={r.id} href="#">
            <TableCell className="font-medium">{r.name}</TableCell>
            <TableCell>{r.visitors}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/** Flag combinations at a glance. */
export const VariantMatrix: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-8">
      {(
        [
          { label: "Plain", props: {} },
          { label: "striped", props: { striped: true } },
          {
            label: "striped + compact",
            props: { striped: true, compact: true },
          },
          { label: "grid", props: { grid: true } },
          { label: "grid + dense", props: { grid: true, dense: true } },
        ] as const
      ).map((spec) => (
        <section key={spec.label}>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {spec.label}
          </p>
          <Table {...spec.props}>
            <Body />
          </Table>
        </section>
      ))}
    </div>
  ),
};
