import type { Meta, StoryObj } from "@storybook/react";

import { ImageWithFallback } from "./image-with-fallback";

const meta = {
  title: "Data Display/ImageWithFallback",
  component: ImageWithFallback,
  tags: ["autodocs"],
  args: {
    src: "https://i.pravatar.cc/96?u=poetic-ui",
    alt: "Alex",
    className: "size-16 rounded-xl",
  },
} satisfies Meta<typeof ImageWithFallback>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — image loads, shown at class-based size. */
export const Default: Story = {};

/** Fallback — `src` fails → placeholder uses `alt.charAt(0)` as initial. */
export const Fallback: Story = {
  args: {
    src: "https://this-domain-will-never-exist.example/invalid.png",
    alt: "Acme Corp",
  },
};

/** Array of sources — tried in order, fallback once all fail. */
export const SourceArray: Story = {
  args: {
    src: [
      "https://this-will-fail.example/first.png",
      "https://this-also-fails.example/second.png",
      "https://i.pravatar.cc/96?u=third-works",
    ],
    alt: "Tried three sources",
  },
};

/** A common dashboard use — site favicon with multi-tier fallback. */
export const FaviconGrid: Story = {
  args: {},
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      {[
        { host: "https://acme-news.com", label: "AN" },
        { host: "https://nonexistent.example", label: "NE" },
        { host: "https://another-fake.example", label: "AF" },
        { host: "https://i.pravatar.cc/128?u=poetic", label: "PA" },
      ].map((row) => (
        <div key={row.host} className="flex items-center gap-3">
          <ImageWithFallback
            src={[`${row.host}/favicon.ico`]}
            alt={row.label}
            className="size-10 rounded-lg"
          />
          <span className="text-sm text-muted-foreground">{row.label}</span>
        </div>
      ))}
    </div>
  ),
};
