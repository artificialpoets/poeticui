import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import remarkGfm from "remark-gfm";

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
  /**
   * Enable GitHub-flavored markdown (tables, strikethrough, task lists) in
   * MDX docs pages. Storybook 8's default MDX pipeline routes remark
   * plugins through the top-level `docs.mdxPluginOptions` option — passing
   * them to `addon-essentials.options.docs` doesn't reach the compiler.
   */
  docs: {
    mdxPluginOptions: {
      mdxCompileOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  } as StorybookConfig["docs"],
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  /**
   * - Inject the Tailwind v4 Vite plugin so stories can use utility
   *   classes (flex, gap-*, p-*, etc.). The plugin scans files pointed
   *   at by `@source` directives inside `.storybook/preview.css`.
   * - Shim `process.env` / `process.browser` for the two primitives that
   *   still import `next/link` and `next/image` (see ESLint allowlist
   *   in `.eslintrc.js`; tracked as DES-49). Without this, their
   *   stories crash with `ReferenceError: process is not defined`
   *   because Vite's browser bundle has no Node globals.
   */
  async viteFinal(config) {
    config.plugins = [...(config.plugins ?? []), tailwindcss()];
    // Bundle-time substitution for the one thing Next checks a lot.
    // Everything else (bare `process`, `process.browser`, etc.) is
    // shimmed at runtime by `.storybook/preview-head.html`.
    config.define = {
      ...config.define,
      "process.env.NODE_ENV": JSON.stringify("production"),
    };
    return config;
  },
};

export default config;
