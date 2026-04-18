import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(ts|tsx)",
    "../.storybook/*.mdx",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  /**
   * Inject the Tailwind v4 Vite plugin so stories can use utility classes
   * (flex, gap-*, p-*, etc.). Without this, only CSS-variable tokens work
   * and any Tailwind utility in a story renders as a no-op.
   *
   * The plugin scans files pointed at by `@source` directives inside our
   * CSS entry (see `.storybook/preview.css`).
   */
  async viteFinal(config) {
    config.plugins = [...(config.plugins ?? []), tailwindcss()];
    return config;
  },
};

export default config;
