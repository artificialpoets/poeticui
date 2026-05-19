import { Children, isValidElement, type ReactNode } from "react";

import { CodeBlock } from "./code-block";
import { LanguageTabsShell } from "./language-tabs-shell";

// ── <Example> child marker ─────────────────────────────────────────────

export interface ExampleProps {
  /**
   * Language identifier for `<CodeBlock>` — e.g. `"ts"`, `"bash"`,
   * `"python"`. Must be loaded in the active highlighter (defaults to
   * the package's 10-grammar default set).
   */
  lang: string;
  /** Optional display label for the tab. Defaults to `lang`. */
  label?: string;
  /** Code string to highlight. Must be a string (not a React subtree). */
  children: string;
}

/**
 * `<Example>` — marker child for `<LanguageTabs>`.
 *
 * The component itself renders nothing; `<LanguageTabs>` reads its props
 * via `React.Children` to build the tab list + pre-render each code
 * sample. This keeps the authoring API clean:
 *
 * ```tsx
 * <LanguageTabs defaultValue="ts">
 *   <Example lang="ts" label="TypeScript">
 *     {`const x: number = 42`}
 *   </Example>
 *   <Example lang="js" label="JavaScript">
 *     {`const x = 42`}
 *   </Example>
 * </LanguageTabs>
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- marker component: props are read by parent via React.Children, not here
export function Example(props: ExampleProps): ReactNode {
  return null;
}

// Attach a nominal brand so we can identify `<Example>` children at
// runtime even if JSX wrapping or minifiers mangle the function identity.
const EXAMPLE_BRAND = Symbol.for("@artificialpoets/content/Example");
(Example as unknown as { $$brand?: symbol }).$$brand = EXAMPLE_BRAND;

// ── <LanguageTabs> ─────────────────────────────────────────────────────

export interface LanguageTabsProps {
  /**
   * Starting tab. Must match one of the `<Example lang="…" />` children.
   * Defaults to the first example's `lang`.
   */
  defaultValue?: string;
  /** Extra classes on the outer wrapper. */
  className?: string;
  /**
   * `<Example>` children — one per language. Order here is the tab
   * order. Non-`<Example>` children are ignored.
   */
  children: ReactNode;
}

/**
 * LanguageTabs — a `<PersistentTabs>` specialised for cross-language
 * code samples (TS vs JS, Python vs Go, bash vs PowerShell, …). Uses
 * `<Example lang="…">code</Example>` children for a clean declarative
 * API.
 *
 * All instances on a page (and across browser tabs) stay in sync because
 * they share `storageKey="poeticui:pref:language"` internally. If the
 * user has picked e.g. "ts" in one tab, every other `<LanguageTabs>`
 * that includes a "ts" example defaults to "ts" too.
 *
 * **Server Component** — pre-renders each `<CodeBlock>` server-side;
 * Shiki's WASM + grammars never ship to the browser.
 */
export async function LanguageTabs({
  defaultValue,
  className,
  children,
}: LanguageTabsProps) {
  const examples = extractExamples(children);

  if (examples.length === 0) {
    // No <Example> children — render an empty wrapper rather than
    // crashing. Makes the component safe to use in conditional MDX.
    return (
      <div className={className} data-poeticui-language-tabs>
        {null}
      </div>
    );
  }

  // Pre-render each CodeBlock server-side, keyed by lang.
  const entries = await Promise.all(
    examples.map(async (ex) => {
      const block = await CodeBlock({ code: ex.code, lang: ex.lang });
      return [ex.lang, block] as const;
    }),
  );
  const slots: Record<string, ReactNode> = Object.fromEntries(entries);

  const options = examples.map((ex) => ({
    value: ex.lang,
    label: ex.label ?? ex.lang,
  }));
  const resolvedDefault = defaultValue ?? examples[0].lang;

  return (
    <LanguageTabsShell
      slots={slots}
      options={options}
      defaultValue={resolvedDefault}
      className={className}
    />
  );
}

// ── helpers ────────────────────────────────────────────────────────────

interface ExtractedExample {
  lang: string;
  label?: string;
  code: string;
}

function extractExamples(children: ReactNode): ExtractedExample[] {
  const out: ExtractedExample[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    // Identify by branded type (safe across HMR + minified identities).
    const type = child.type as unknown as { $$brand?: symbol };
    if (type?.$$brand !== EXAMPLE_BRAND) return;
    const props = child.props as ExampleProps;
    if (typeof props.children !== "string") {
      // Skip invalid children rather than blow up the tree — but warn
      // in dev so authors notice.
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn(
          `[@artificialpoets/content] <Example lang="${props.lang}"> expects a string child (the code sample), got ${typeof props.children}. Skipping.`,
        );
      }
      return;
    }
    out.push({ lang: props.lang, label: props.label, code: props.children });
  });
  return out;
}
