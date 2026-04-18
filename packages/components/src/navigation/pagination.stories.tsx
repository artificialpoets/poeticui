import type { Meta, StoryObj } from "@storybook/react";

import {
  Pagination,
  PaginationGap,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "./pagination";

const meta = {
  title: "Navigation/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: () => (
    <Pagination>
      <PaginationPrevious href="#" />
      <PaginationList>
        <PaginationPage href="#">1</PaginationPage>
        <PaginationPage href="#" current>
          2
        </PaginationPage>
        <PaginationPage href="#">3</PaginationPage>
        <PaginationGap />
        <PaginationPage href="#">12</PaginationPage>
      </PaginationList>
      <PaginationNext href="#" />
    </Pagination>
  ),
};

export const FirstPage: Story = {
  args: {},
  render: () => (
    <Pagination>
      <PaginationPrevious href={null} />
      <PaginationList>
        <PaginationPage href="#" current>
          1
        </PaginationPage>
        <PaginationPage href="#">2</PaginationPage>
        <PaginationPage href="#">3</PaginationPage>
      </PaginationList>
      <PaginationNext href="#" />
    </Pagination>
  ),
};
