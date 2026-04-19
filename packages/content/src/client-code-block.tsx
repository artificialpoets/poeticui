"use client";

import { useEffect, useState } from "react";
import type { BundledLanguage } from "shiki";

import { cx } from "@poeticui/components/lib";

import {
  DEFAULT_THEMES,
  getDefaultHighlighter,
  type ContentHighlighter,
} from "./utils/default-highlighter";

export interface ClientCodeBlockProps {
  /** Code string to highlight. Re-highlights on change. */
  code: string;
  /**
   * Language identifier — e.g. `"ts"`, `"json"`, `"bash"`. Unknown
   * languages fall back to plain text. Defaults to `"text"`.
   */
  lang?: string;
  /**
   * Optional custom highlighter. Pass the return value of
   * `createHighlighter({ langs, themes })` to narrow or extend the
   * bundled grammar/theme set. Defaults to the shared default highlighter.
   */
  highlighter?: ContentHighlighter;
  /** Override the dual-theme pair. */
  themes?: { light?: string; dark?: string };
  /** Extra classes on the outer `<div>`. */
  className?: string;
}

/**
 * ClientCodeBlock — client-side sibling of {@link CodeBlock}.
 *
 * Use this when the code string is only available at runtime in a
 * client component (e.g. a toggleable "Raw JSON" view of fetched data,
 * live-edited code in a playground). For static code known at render
 * time, prefer the server-rendered {@link CodeBlock} — it ships zero
 * client JS for highlighting.
 *
 * Renders a plain `<pre>` fallback until Shiki finishes loading, then
 * swaps in the highlighted markup. Subsequent prop changes re-highlight
 * via the cached default highlighter singleton (no redundant WASM loads).
 *
 * Companion styles (required for dark-mode flip):
 *
 *     import "@poeticui/content/styles/code-block";
 *
 * ```tsx
 * <ClientCodeBlock code={JSON.stringify(data, null, 2)} lang="json" />
 * ```
 */
export function ClientCodeBlock({
  code,
  lang = "text",
  highlighter,
  themes,
  className,
}: ClientCodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const activeThemes = {
      light: themes?.light ?? DEFAULT_THEMES.light,
      dark: themes?.dark ?? DEFAULT_THEMES.dark,
    };

    const run = async () => {
      const hl = highlighter ?? (await getDefaultHighlighter());
      if (cancelled) return;

      const loadedLangs = hl.getLoadedLanguages();
      const resolvedLang =
        lang === "text" || loadedLangs.includes(lang as BundledLanguage)
          ? lang
          : "text";

      try {
        const out = hl.codeToHtml(code, {
          lang: resolvedLang,
          themes: activeThemes,
          defaultColor: false,
        });
        if (!cancelled) setHtml(out);
      } catch {
        if (!cancelled) {
          setHtml(`<pre><code>${escapeHtml(code)}</code></pre>`);
        }
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [code, lang, highlighter, themes?.light, themes?.dark]);

  if (html === null) {
    return (
      <div
        className={cx(
          "overflow-hidden rounded-xl border border-border bg-card text-sm",
          className,
        )}
        data-poeticui-code-block
      >
        <pre className="m-0 overflow-x-auto p-4 text-foreground">
          <code>{code}</code>
        </pre>
      </div>
    );
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
