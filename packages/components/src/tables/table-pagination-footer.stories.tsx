import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { TablePaginationFooter } from "./table-pagination-footer";

const meta = {
  title: "Tables/TablePaginationFooter",
  component: TablePaginationFooter,
  tags: ["autodocs"],
  args: {
    page: 3,
    totalPages: 12,
    pageSize: 25,
    pageSizeOptions: [25, 50, 100],
  },
} satisfies Meta<typeof TablePaginationFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controlled pagination widget — dropped below any table. */
export const Default: Story = {
  args: {},
  render: () => {
    const [page, setPage] = useState(3);
    const [pageSize, setPageSize] = useState(25);
    return (
      <TablePaginationFooter
        page={page}
        totalPages={12}
        pageSize={pageSize}
        pageSizeOptions={[25, 50, 100]}
        onPageChange={setPage}
        onPageSizeChange={(n) => {
          setPageSize(n);
          setPage(1);
        }}
      />
    );
  },
};

/** With a right slot for a result counter. */
export const WithRightSlot: Story = {
  args: {},
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    return (
      <TablePaginationFooter
        page={page}
        totalPages={4}
        pageSize={pageSize}
        pageSizeOptions={[25, 50, 100]}
        onPageChange={setPage}
        onPageSizeChange={(n) => {
          setPageSize(n);
          setPage(1);
        }}
        rightSlot={
          <span className="text-xs text-muted-foreground">
            83 total results
          </span>
        }
      />
    );
  },
};
