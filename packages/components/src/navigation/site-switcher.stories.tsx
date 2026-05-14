import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { SiteSwitcher, type SiteOption } from "./site-switcher";

const sites: SiteOption[] = [
  {
    id: "midnight",
    name: "Midnight Pantry",
    subtitle: "midnightpantry.co",
    initials: "MP",
  },
  { id: "tollgate", name: "Tollgate", subtitle: "tollgate.co", initials: "TG" },
  {
    id: "pantrydaily",
    name: "Pantry Daily",
    subtitle: "pantrydaily.co",
    initials: "PD",
  },
];

const meta = {
  title: "Navigation/SiteSwitcher",
  component: SiteSwitcher,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    sites,
    current: "all",
    aggregate: {
      id: "all",
      name: "All sites",
      subtitle: "3 sites · enterprise",
    },
  },
  render: (args) => {
    const [current, setCurrent] = useState(args.current);
    return <SiteSwitcher {...args} current={current} onChange={setCurrent} />;
  },
} satisfies Meta<typeof SiteSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Without an aggregate row — pure list of sites. */
export const NoAggregate: Story = {
  args: { aggregate: undefined, current: "midnight" },
};

/** Single tenant — one option, useful for entry-tier views. */
export const SingleSite: Story = {
  args: { sites: sites.slice(0, 1), aggregate: undefined, current: "midnight" },
};

/** Label-only trigger — for tight headers. */
export const HideAvatar: Story = {
  args: { hideAvatar: true, current: "tollgate" },
};
