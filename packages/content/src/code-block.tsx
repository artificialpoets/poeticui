import { cx } from "@artificialpoets/components/lib";
import type { BundledLanguage, BundledTheme, HighlighterGeneric } from "shiki";

import {
  DEFAULT_THEMES,
  getDefaultHighlighter,
  type ContentHighlighter,
} from "./utils/default-highlighter";

export interface CodeBlockProps {
  /** Code string to highlight. */
  code: string;
  /**
   * Language identifier — e.g. `"ts"`, `"js"`, `"bash"`, `"json"`.
   * Unknown languages fall back to plain text (no highlighting) and
   * emit a dev-mode warning to the console. Defaults to `"text"`.
   */
  lang?: string;
  /**
   * Optional custom highlighter — useful when you want to narrow the
   * bundled grammar/theme set or add languages beyond the default 10.
   * Pass the return value of `createHighlighter({ langs, themes })`.
   * Defaults to the package's shared default highlighter.
   */
  highlighter?: HighlighterGeneric<BundledLanguage, BundledTheme>;
  /**
   * Override the dual-theme pair. Any Shiki theme id works. Defaults to
   * `{ light: "github-light", dark: "github-dark-dimmed" }`.
   */
  themes?: { light?: string; dark?: string };
  /** Extra classes applied to the outer `<div>`. */
  className?: string;
}

/**
 * CodeBlock — async React component that renders syntax-highlighted
 * code with dual-theme CSS variables.
 *
 * **Server-component compatible** — render from a server tree (Next App
 * Router, Astro islands, etc.) to ship zero client JavaScript. Shiki's
 * highlighting happens at render time; the emitted HTML is static.
 *
 * **Dual-theme flip via CSS variables** — `.dark` ancestor class selects
 * the dark palette with no re-render. Companion styles:
 *
 *     import "@artificialpoets/content/styles/code-block";
 *
 * Without those styles, code renders readably in the light theme but
 * won't flip on `.dark`.
 *
 * ```tsx
 * <CodeBlock
 *   code={`const x: number = 42`}
 *   lang="ts"
 * />
 * ```
 */
export async function CodeBlock({
  code,
  lang = "text",
  highlighter,
  themes,
  className,
}: CodeBlockProps) {
  const activeThemes = {
    light: themes?.light ?? DEFAULT_THEMES.light,
    dark: themes?.dark ?? DEFAULT_THEMES.dark,
  };
  const hl: ContentHighlighter = highlighter ?? (await getDefaultHighlighter());

  const loadedLangs = hl.getLoadedLanguages();
  const resolvedLang =
    lang === "text" || loadedLangs.includes(lang as BundledLanguage)
      ? lang
      : "text";

  if (resolvedLang !== lang && process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.warn(
      `[@artificialpoets/content] <CodeBlock lang="${lang}" /> — language not loaded in the active highlighter. Falling back to plain text. Pass a custom highlighter that includes "${lang}" to fix.`,
    );
  }

  let html: string;
  try {
    html = hl.codeToHtml(code, {
      lang: resolvedLang,
      themes: activeThemes,
      defaultColor: false,
    });
  } catch {
    // Ultra-defensive fallback — should be unreachable given the
    // language-loaded check above, but keeps render safe if Shiki
    // changes surface area.
    html = `<pre><code>${escapeHtml(code)}</code></pre>`;
  }

  return (
    <div
      className={cx(
        "overflow-hidden rounded-xl border border-border bg-card text-sm",
        "[&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:p-4",
        className,
      )}
      data-poeticui-code-block
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
