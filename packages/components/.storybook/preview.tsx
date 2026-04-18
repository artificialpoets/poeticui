import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import React from "react";

// All CSS (Tailwind base + tokens + neutral theme + components) lives in
// preview.css so the Tailwind v4 Vite plugin can resolve @apply against
// the token custom-property map at build time. Importing tokens via JS
// hides them from Tailwind's CSS processor.
import "./preview.css";

/**
 * Storybook preview — brand-agnostic neutral theme.
 *
 * Brand overlays (`@ap/brand/theme/*`) are deliberately NOT imported
 * here — the library Storybook is brand-agnostic so `@poeticui/components`
 * stays open-source-publishable. Consumers layer their own theme on top
 * of `@poeticui/tokens` in their app (see `packages/brand/theme/*` for
 * the AP-specific overrides).
 *
 * The `withThemeByClassName` decorator toggles the `.dark` class so the
 * theme switcher in the Storybook toolbar flips light/dark mode.
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
    options: {
      storySort: {
        // Top-level ordering. Anything not listed lands alphabetically
        // after the listed entries.
        order: [
          "Welcome",
          "Design Tokens",
          "Chart Recipes",
          "Core",
          "Forms",
          "Data Display",
          "Feedback",
          "Layout",
          "Navigation",
          "Misc",
          "Tables",
        ],
      },
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
