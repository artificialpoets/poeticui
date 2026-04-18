import type { Meta, StoryObj } from "@storybook/react";

import { FilteredTableShell } from "./filtered-table";
import { Button } from "../core/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../data-display/table";

const meta = {
  title: "Tables/FilteredTableShell",
  component: FilteredTableShell,
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof FilteredTableShell>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Layout wrapper — controls on the right of the table. */
export const Default: Story = {
  args: {},
  render: () => (
    <FilteredTableShell
      headerRight={
        <div className="flex items-center gap-2">
          <Button outline>Export CSV</Button>
          <Button>New row</Button>
        </div>
      }
    >
      <Table striped>
        <TableHead>
          <TableRow>
            <TableHeader>Site</TableHeader>
            <TableHeader>Visitors</TableHeader>
            <TableHeader>Trend</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>acme-news.com</TableCell>
            <TableCell>12.4K</TableCell>
            <TableCell>+12%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>acme-market.com</TableCell>
            <TableCell>8.7K</TableCell>
            <TableCell>+3%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </FilteredTableShell>
  ),
};
