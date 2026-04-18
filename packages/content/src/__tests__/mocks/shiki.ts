/**
 * Mock for the `shiki` module used by unit tests.
 *
 * Jest can't evaluate Shiki's ESM-only `.mjs` build in the default CJS
 * runtime (the Shiki stack has ~20 ESM-only transitive deps). Rather
 * than fight the transform chain, we substitute a minimal fake via
 * `moduleNameMapper` in `jest.config.js`.
 *
 * This is fine because:
 *   - Unit tests verify our wrapper logic (lang fallback, className
 *     passthrough, custom-highlighter handoff), not Shiki's tokenization
 *   - Real Shiki output is visually verified in Storybook + via the
 *     package's static build pipeline
 *   - Production bundles (Vite, Next, Astro) handle ESM natively; this
 *     mock only lives in the Jest environment
 */

type MockHighlighter = {
  getLoadedLanguages: () => string[];
  codeToHtml: (code: string, opts: { lang: string; themes: unknown }) => string;
  dispose?: () => void;
};

export function createHighlighter(options: {
  langs: string[];
  themes: string[];
}): Promise<MockHighlighter> {
  return Promise.resolve({
    getLoadedLanguages: () => [...options.langs],
    codeToHtml: (code, { lang }) => {
      // Emit mock HTML that mirrors real Shiki's `defaultColor: false`
      // output: both `--shiki-light` and `--shiki-dark` CSS vars on each
      // token span. Enough for tests to assert CSS-variable emission +
      // token presence without invoking real Shiki.
      return [
        `<pre class="shiki shiki-themes mock-light mock-dark" `,
        `style="--shiki-light:#24292e;--shiki-light-bg:#fff;--shiki-dark:#e1e4e8;--shiki-dark-bg:#1e1e1e" `,
        `tabindex="0" data-mock-lang="${lang}">`,
        `<code>`,
        `<span class="line"><span style="--shiki-light:#d73a49;--shiki-dark:#f97583">${escape(code)}</span></span>`,
        `</code>`,
        `</pre>`,
      ].join("");
    },
    dispose: () => {},
  });
}

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
