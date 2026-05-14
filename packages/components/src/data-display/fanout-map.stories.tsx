import type { Meta, StoryObj } from "@storybook/react";
import { Globe, Mail, Newspaper, Play, Tv } from "lucide-react";

import { FanoutMap } from "./fanout-map";

const meta = {
  title: "Data Display/FanoutMap",
  component: FanoutMap,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    size: { control: "select", options: ["md", "lg", "xl"] },
  },
  args: {
    size: "lg",
    center: { label: "Article", value: "24,110 views" },
    groups: [
      { id: "social", label: "Social" },
      { id: "email", label: "Newsletter" },
      { id: "i18n", label: "Translations" },
      { id: "transforms", label: "Transforms" },
      { id: "feed", label: "Feed" },
    ],
    spokes: [
      { id: "x", label: "X", value: "62K", group: "social", tone: "chart-1" },
      {
        id: "li",
        label: "LinkedIn",
        value: "18K",
        group: "social",
        tone: "chart-2",
      },
      {
        id: "ig",
        label: "Instagram",
        value: "44K",
        group: "social",
        tone: "chart-3",
      },
      {
        id: "tt",
        label: "TikTok",
        value: "112K",
        group: "social",
        tone: "chart-4",
      },
      {
        id: "fb",
        label: "Facebook",
        value: "21K",
        group: "social",
        tone: "chart-5",
      },
      {
        id: "th",
        label: "Threads",
        value: "4K",
        group: "social",
        tone: "chart-6",
      },
      {
        id: "nl",
        label: "Saturday digest",
        value: "9.8K · 41% open",
        icon: <Mail className="size-4" />,
        group: "email",
        tone: "info",
      },
      {
        id: "es",
        label: "Español",
        icon: <Globe className="size-4" />,
        group: "i18n",
        tone: "chart-7",
      },
      {
        id: "fr",
        label: "Français",
        icon: <Globe className="size-4" />,
        group: "i18n",
        tone: "chart-7",
      },
      {
        id: "pt",
        label: "Português",
        icon: <Globe className="size-4" />,
        group: "i18n",
        tone: "chart-7",
      },
      {
        id: "it",
        label: "Italiano",
        icon: <Globe className="size-4" />,
        group: "i18n",
        tone: "chart-7",
      },
      {
        id: "video",
        label: "Video",
        icon: <Play className="size-4" />,
        group: "transforms",
        tone: "primary",
      },
      {
        id: "story",
        label: "Story",
        icon: <Newspaper className="size-4" />,
        group: "transforms",
        tone: "primary",
      },
      {
        id: "feed",
        label: "Feed",
        value: "48K imp",
        icon: <Tv className="size-4" />,
        group: "feed",
        tone: "success",
      },
    ],
  },
} satisfies Meta<typeof FanoutMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** No groups — spokes spread evenly around 360°. */
export const NoGroups: Story = {
  args: {
    groups: undefined,
    spokes: [
      { id: "x", label: "X", value: "62K", tone: "chart-1" },
      { id: "li", label: "LinkedIn", value: "18K", tone: "chart-2" },
      { id: "ig", label: "Instagram", value: "44K", tone: "chart-3" },
      { id: "tt", label: "TikTok", value: "112K", tone: "chart-4" },
      { id: "fb", label: "Facebook", value: "21K", tone: "chart-5" },
      { id: "th", label: "Threads", value: "4K", tone: "chart-6" },
    ],
  },
};

/** Sparse — a single article fanning out to four destinations. */
export const Sparse: Story = {
  args: {
    spokes: [
      { id: "x", label: "X", value: "8K", group: "social", tone: "chart-1" },
      {
        id: "li",
        label: "LinkedIn",
        value: "2K",
        group: "social",
        tone: "chart-2",
      },
      {
        id: "nl",
        label: "Newsletter",
        value: "9.8K",
        icon: <Mail className="size-4" />,
        group: "email",
        tone: "info",
      },
      {
        id: "feed",
        label: "Feed",
        value: "12K",
        icon: <Tv className="size-4" />,
        group: "feed",
        tone: "success",
      },
    ],
    groups: [
      { id: "social", label: "Social" },
      { id: "email", label: "Email" },
      { id: "feed", label: "Feed" },
    ],
  },
};
