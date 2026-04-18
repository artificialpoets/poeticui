import type { Meta, StoryObj } from "@storybook/react";

import { Breadcrumbs } from "./breadcrumbs";

const meta = {
  title: "Navigation/Breadcrumbs",
  component: Breadcrumbs,
  tags: ["autodocs"],
  args: {
    items: [
      { label: "Sites", href: "#" },
      { label: "acme-news.com", href: "#" },
      { label: "Settings" },
    ],
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleLevel: Story = {
  args: {
    items: [{ label: "Dashboard" }],
  },
};

export const Deep: Story = {
  args: {
    items: [
      { label: "Sites", href: "#" },
      { label: "acme-news.com", href: "#" },
      { label: "Posts", href: "#" },
      { label: "2026 archive", href: "#" },
      { label: "Rising AI in publishing" },
    ],
  },
};
