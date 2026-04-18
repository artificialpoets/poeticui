/**
 * Storybook-only sync wrappers for `@poeticui/content`.
 *
 * The library's public API exposes `<CodeBlock>`, `<PackageManagerTabs>`,
 * and `<LanguageTabs>` as **async Server Components** — they pre-render
 * Shiki HTML on the server and ship zero client JS. Storybook 8, however,
 * renders everything in the browser and doesn't support async React
 * components, so we need a client-side bridge.
 *
 * These helpers re-implement the same visual output using `useEffect` to
 * lazy-highlight after mount. First paint shows plain `<pre>`, second
 * paint (~50ms later) shows the Shiki-highlighted version. That flash is
 * tolerable in a Storybook doc page and doesn't leak into production.
 *
 * **Do not export from the library package.** These wrappers are
 * Storybook plumbing; real consumers should use the Server-Component
 * APIs.
 */

import {
  commandFor,
  getDefaultHighlighter,
  PACKAGE_MANAGERS,
  PersistentTabs,
  STORAGE_KEY_LANGUAGE,
  STORAGE_KEY_PACKAGE_MANAGER,
  usePref,
  type ContentHighlighter,
  type PackageManager,
  type PackageManagerVerb,
} from "@poeticui/content";
import { SegmentedTabs } from "@poeticui/components/navigation";
import { cx } from "@poeticui/components/lib";
import React, { useEffect, useMemo, useState } from "react";

// ── Lazy-highlight hook ────────────────────────────────────────────────

function useHighlightedHtml(code: string, lang: string): string | null {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getDefaultHighlighter().then((hl: ContentHighlighter) => {
      if (cancelled) return;
      try {
        const loaded = hl.getLoadedLanguages() as string[];
        const resolvedLang = loaded.includes(lang) ? lang : "text";
        const out = hl.codeToHtml(code, {
          lang: resolvedLang,
          themes: { light: "github-light", dark: "github-dark-dimmed" },
          defaultColor: false,
        });
        setHtml(out);
      } catch {
        setHtml(null);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  return html;
}

// ── CodeBlockStorybook ─────────────────────────────────────────────────

export interface CodeBlockStorybookProps {
  code: string;
  lang?: string;
  className?: string;
}

/**
 * Sync client-side `<CodeBlock>` for Storybook. Use this in any MDX file
 * under `.storybook/`.
 */
export function CodeBlockStorybook({
  code,
  lang = "text",
  className,
}: CodeBlockStorybookProps) {
  const html = useHighlightedHtml(code, lang);
  const wrapperClass = cx(
    "overflow-hidden rounded-xl border border-border bg-card text-sm",
    "[&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:p-4",
    className,
  );

  if (html === null) {
    return (
      <div className={wrapperClass} data-poeticui-code-block>
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    );
  }
  return (
    <div
      className={wrapperClass}
      data-poeticui-code-block
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// ── PackageManagerTabsStorybook ────────────────────────────────────────

export interface PackageManagerTabsStorybookProps {
  install?: boolean | string;
  add?: string;
  remove?: string;
  run?: string;
  exec?: string;
  create?: string;
  defaultValue?: PackageManager;
  className?: string;
}

const PM_OPTIONS: Array<{ value: PackageManager; label: string }> = [
  { value: "bun", label: "bun" },
  { value: "pnpm", label: "pnpm" },
  { value: "npm", label: "npm" },
  { value: "yarn", label: "yarn" },
];

export function PackageManagerTabsStorybook({
  install,
  add,
  remove,
  run,
  exec,
  create,
  defaultValue = "bun",
  className,
}: PackageManagerTabsStorybookProps) {
  const { verb, args } = resolveVerb({
    install,
    add,
    remove,
    run,
    exec,
    create,
  });
  const commands = useMemo(() => {
    return Object.fromEntries(
      PACKAGE_MANAGERS.map((pm) => [pm, commandFor(pm, verb, args)]),
    ) as Record<PackageManager, string>;
  }, [verb, args]);

  const [stored, setStored] = usePref<PackageManager>(
    STORAGE_KEY_PACKAGE_MANAGER,
    defaultValue,
  );
  const active: PackageManager = PACKAGE_MANAGERS.includes(stored)
    ? stored
    : defaultValue;

  return (
    <div
      className={cx("space-y-3", className)}
      data-poeticui-package-manager-tabs
    >
      <SegmentedTabs<PackageManager>
        value={active}
        onValueChange={setStored}
        options={PM_OPTIONS}
        size="sm"
      />
      <div data-poeticui-package-manager-tabs-body>
        <CodeBlockStorybook code={commands[active]} lang="bash" />
      </div>
    </div>
  );
}

function resolveVerb(props: {
  install?: boolean | string;
  add?: string;
  remove?: string;
  run?: string;
  exec?: string;
  create?: string;
}): { verb: PackageManagerVerb; args: string } {
  if (props.install !== undefined && props.install !== false) {
    return {
      verb: "install",
      args: typeof props.install === "string" ? props.install : "",
    };
  }
  if (props.add !== undefined) return { verb: "add", args: props.add };
  if (props.remove !== undefined) return { verb: "remove", args: props.remove };
  if (props.run !== undefined) return { verb: "run", args: props.run };
  if (props.exec !== undefined) return { verb: "exec", args: props.exec };
  if (props.create !== undefined) return { verb: "create", args: props.create };
  return { verb: "install", args: "" };
}

// ── LanguageTabsStorybook ──────────────────────────────────────────────

export interface LanguageExample {
  lang: string;
  label?: string;
  code: string;
}

export interface LanguageTabsStorybookProps {
  examples: LanguageExample[];
  defaultValue?: string;
  className?: string;
}

/**
 * Sync client-side `<LanguageTabs>` for Storybook. Takes the examples as
 * a plain array rather than `<Example>` JSX children — MDX's compiler
 * handles plain arrays more reliably than React.Children introspection.
 */
export function LanguageTabsStorybook({
  examples,
  defaultValue,
  className,
}: LanguageTabsStorybookProps) {
  const resolvedDefault = defaultValue ?? examples[0]?.lang ?? "text";
  const options = examples.map((ex) => ({
    value: ex.lang,
    label: ex.label ?? ex.lang,
  }));

  if (examples.length === 0) {
    return <div className={className} data-poeticui-language-tabs />;
  }

  return (
    <PersistentTabs
      storageKey={STORAGE_KEY_LANGUAGE}
      defaultValue={resolvedDefault}
      options={options}
      className={className}
      size="sm"
    >
      {(active) => {
        const ex = examples.find((e) => e.lang === active) ?? examples[0];
        return <CodeBlockStorybook code={ex.code} lang={ex.lang} />;
      }}
    </PersistentTabs>
  );
}
