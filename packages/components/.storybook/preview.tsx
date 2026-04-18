import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import React from "react";

// Poetic UI tokens — palette + semantic vars + Tailwind theme mapping
import "@poeticui/tokens/palette";
import "@poeticui/tokens/semantic";
import "@poeticui/tokens/typography";
import "@poeticui/tokens/tailwind-theme";

// Out-of-the-box neutral theme (shadcn-compatible default)
import "@poeticui/tokens/themes/neutral";

// Generic component styles
import "@poeticui/components/styles/components";

// Tailwind base layer — stories use Tailwind utilities directly
import "./preview.css";

// AP brand themes (for theme switcher toolbar)
import "@ap/brand/theme/platform";
import "@ap/brand/theme/poehost";
import "@ap/brand/theme/intranet";

/**
 * Storybook preview — applies the token layering:
 *   1. @poeticui/tokens (palette + semantic + typography + tailwind mapping)
 *   2. neutral default theme (zinc-based)
 *   3. OPTIONAL brand overlay (picked via the toolbar theme switcher below)
 *
 * The `withThemeByClassName` decorator sets a data-theme attribute that our
 * theme CSS can target. Each theme is itself an `@layer base` block so it
 * overrides on top of the neutral default.
 */
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "background",
      values: [
        { name: "background", value: "var(--background)" },
        { name: "card", value: "var(--card)" },
      ],
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
    (Story) => (
      <div
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          padding: "2rem",
          minHeight: "100vh",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
