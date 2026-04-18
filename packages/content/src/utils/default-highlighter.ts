import type { BundledLanguage, BundledTheme, HighlighterGeneric } from "shiki";

/**
 * Default language set — the 10 grammars that cover most marketing /
 * docs / API-reference contexts. Consumers who need more can pass their
 * own highlighter via `<CodeBlock highlighter={...} />`.
 */
export const DEFAULT_LANGS: BundledLanguage[] = [
  "ts",
  "tsx",
  "js",
  "jsx",
  "bash",
  "json",
  "css",
  "html",
  "md",
  "python",
];

/**
 * Default dual-theme pair. Shiki emits both sets of colors as CSS
 * variables on each span; the companion `styles/code-block.css`
 * selects between them based on the `.dark` ancestor class.
 */
export const DEFAULT_THEMES = {
  light: "github-light" as BundledTheme,
  dark: "github-dark-dimmed" as BundledTheme,
} as const;

export type ContentHighlighter = HighlighterGeneric<
  BundledLanguage,
  BundledTheme
>;

export interface CreateHighlighterOptions {
  langs: BundledLanguage[];
  themes: BundledTheme[];
}

/**
 * Create a Shiki highlighter with the given language + theme set.
 *
 * Uses dynamic import internally so bundlers and test runners that can't
 * natively load Shiki's ESM-only build (Jest, CommonJS Node) still work.
 * The cost is one extra microtask on first call — negligible in every
 * real-world context (server render, dev server).
 *
 * ```ts
 * const hl = await createHighlighter({
 *   langs: ["ts", "bash"],
 *   themes: ["github-light", "github-dark-dimmed"],
 * });
 * ```
 */
export async function createHighlighter(
  options: CreateHighlighterOptions,
): Promise<ContentHighlighter> {
  const shiki = await import("shiki");
  return shiki.createHighlighter(options);
}

/**
 * Lazily-constructed default highlighter singleton. First call creates
 * the highlighter (loads WASM + requested grammars); subsequent calls
 * return the same promise. Safe to call from multiple components in
 * parallel — Shiki handles the dedup.
 */
let defaultHighlighterPromise: Promise<ContentHighlighter> | null = null;

export function getDefaultHighlighter(): Promise<ContentHighlighter> {
  if (!defaultHighlighterPromise) {
    defaultHighlighterPromise = createHighlighter({
      langs: DEFAULT_LANGS,
      themes: [DEFAULT_THEMES.light, DEFAULT_THEMES.dark],
    });
  }
  return defaultHighlighterPromise;
}
