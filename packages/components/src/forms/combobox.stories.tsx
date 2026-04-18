import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import {
  Combobox,
  ComboboxDescription,
  ComboboxLabel,
  ComboboxOption,
} from "./combobox";

const meta = {
  title: "Forms/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

const SITES = [
  { id: "acme-news", name: "acme-news.com" },
  { id: "acme-market", name: "acme-market.com" },
  { id: "acme-blog", name: "acme-blog.com" },
  { id: "acme-docs", name: "acme-docs.com" },
  { id: "acme-jobs", name: "acme-jobs.com" },
];

/** Single-select combobox with client-side filtering. */
export const Default: Story = {
  args: {},
  render: () => {
    const [value, setValue] = useState<(typeof SITES)[number] | null>(SITES[0]);
    return (
      <div className="w-80">
        <Combobox
          options={SITES}
          displayValue={(s) => s?.name ?? ""}
          value={value}
          onChange={setValue}
          aria-label="Pick a site"
          placeholder="Search sites…"
        >
          {(site) => (
            <ComboboxOption value={site}>
              <ComboboxLabel>{site.name}</ComboboxLabel>
            </ComboboxOption>
          )}
        </Combobox>
      </div>
    );
  },
};

/** Option rows with a description below each label. */
export const WithDescriptions: Story = {
  args: {},
  render: () => {
    const [value, setValue] = useState<(typeof SITES)[number] | null>(null);
    return (
      <div className="w-80">
        <Combobox
          options={SITES}
          displayValue={(s) => s?.name ?? ""}
          value={value}
          onChange={setValue}
          aria-label="Pick a site"
          placeholder="Start typing…"
        >
          {(site) => (
            <ComboboxOption value={site}>
              <ComboboxLabel>{site.name}</ComboboxLabel>
              <ComboboxDescription>{site.id}</ComboboxDescription>
            </ComboboxOption>
          )}
        </Combobox>
      </div>
    );
  },
};
