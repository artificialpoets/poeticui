import type { Meta, StoryObj } from "@storybook/react";

import { DataTable, type DataTableColumn } from "./data-table";

const meta = {
  title: "Tables/DataTable",
  component: DataTable,
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

interface SiteRow {
  id: string;
  domain: string;
  visitors: number;
  engagement: number;
  status: "active" | "archived" | "pending";
}

const ROWS: SiteRow[] = [
  {
    id: "1",
    domain: "acme-news.com",
    visitors: 12400,
    engagement: 68,
    status: "active",
  },
  {
    id: "2",
    domain: "acme-market.com",
    visitors: 8700,
    engagement: 52,
    status: "active",
  },
  {
    id: "3",
    domain: "acme-blog.com",
    visitors: 5100,
    engagement: 41,
    status: "active",
  },
  {
    id: "4",
    domain: "acme-docs.com",
    visitors: 2300,
    engagement: 77,
    status: "pending",
  },
  {
    id: "5",
    domain: "acme-jobs.com",
    visitors: 900,
    engagement: 23,
    status: "archived",
  },
];

const COLUMNS: DataTableColumn<SiteRow>[] = [
  {
    key: "domain",
    header: "Domain",
    cell: (row) => row.domain,
    sortValue: (row) => row.domain,
    searchValue: (row) => row.domain,
  },
  {
    key: "visitors",
    header: "Visitors",
    cell: (row) => row.visitors.toLocaleString(),
    sortValue: (row) => row.visitors,
    align: "right",
  },
  {
    key: "engagement",
    header: "Engagement",
    cell: (row) => `${row.engagement}%`,
    sortValue: (row) => row.engagement,
    align: "right",
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => row.status,
    sortValue: (row) => row.status,
  },
];

/** Full DataTable — sort, search, paginate out of the box. */
export const Default: Story = {
  args: {},
  render: () => (
    <DataTable
      columns={COLUMNS}
      rows={ROWS}
      getRowKey={(row) => row.id}
      defaultSortKey="visitors"
      defaultSortDir="desc"
    />
  ),
};

/** Empty state — no rows. */
export const Empty: Story = {
  args: {},
  render: () => (
    <DataTable
      columns={COLUMNS}
      rows={[]}
      getRowKey={(row) => row.id}
      emptyMessage="No sites yet. Add your first domain."
    />
  ),
};
