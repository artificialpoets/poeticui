import type { Meta, StoryObj } from "@storybook/react";

import { SERVICE_ICON_NAMES, ServiceIcon } from "./service-icon";

const meta = {
  title: "Icons/ServiceIcon",
  component: ServiceIcon,
  tags: ["autodocs"],
  args: {
    name: "qdrant",
    className: "size-6",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Single entry point for service marks. Resolves a name to a simple-icons brand glyph, a tinted Lucide fallback for trademark-blocked brands (AWS, OpenAI, Acast, MUX, LinkedIn, Slack, Salesforce, Azure), or a generic category icon for infra terms (embedder, recommender, queue, …). Pass `brandColor` to render in the brand hue instead of `currentColor`.",
      },
    },
  },
} satisfies Meta<typeof ServiceIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — single icon, currentColor. */
export const Default: Story = {};

/** Same icon, but rendered in the brand colour. */
export const BrandColour: Story = {
  args: { brandColor: true },
};

/** A trademark-blocked brand (AWS) — falls through to a tinted Lucide icon. */
export const FallbackBrand: Story = {
  args: { name: "aws", brandColor: true },
};

/** A generic category alias (used in engine dashboards). */
export const CategoryAlias: Story = {
  args: { name: "embedder" },
};

/** Catalogue — every brand simple-icons covers, in `currentColor`. */
export const SimpleIconsCatalogue: Story = {
  render: () => (
    <Catalogue title="simple-icons brands" names={SERVICE_ICON_NAMES.brands} />
  ),
};

/** Hand-curated single-colour brand SVGs for trademark-blocked brands. */
export const CustomBrandsCatalogue: Story = {
  render: () => (
    <Catalogue
      title="Custom curated brands"
      names={SERVICE_ICON_NAMES.customBrands}
      brandColor
    />
  ),
};

/** Trademark-blocked brands — Lucide fallbacks with brand tint. */
export const FallbackCatalogue: Story = {
  render: () => (
    <Catalogue
      title="Trademark-blocked brands (Lucide-tinted fallback)"
      names={SERVICE_ICON_NAMES.fallbackBrands}
      brandColor
    />
  ),
};

/** Generic category aliases used by engine dashboards. */
export const CategoryCatalogue: Story = {
  render: () => (
    <Catalogue title="Category aliases" names={SERVICE_ICON_NAMES.categories} />
  ),
};

function Catalogue({
  title,
  names,
  brandColor,
}: {
  title: string;
  names: readonly string[];
  brandColor?: boolean;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {title}
      </h3>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {names.map((name) => (
          <li
            key={name}
            className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            <ServiceIcon
              name={name}
              className="size-5 shrink-0"
              brandColor={brandColor}
            />
            <span className="truncate text-muted-foreground" title={name}>
              {name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
