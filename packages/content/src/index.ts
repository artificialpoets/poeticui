/**
 * @artificialpoets/content — primitives for rendering technical content.
 *
 * This barrel re-exports every primitive. Consumers can also import from
 * subpaths for zero-risk tree-shaking:
 *
 *   import { CodeBlock } from "@artificialpoets/content/code-block";
 *   import { BlockMath } from "@artificialpoets/content/math";
 *   import { PersistentTabs } from "@artificialpoets/content/persistent-tabs";
 *   import { PackageManagerTabs } from "@artificialpoets/content/package-manager-tabs";
 *   import { LanguageTabs, Example } from "@artificialpoets/content/language-tabs";
 *   import { usePref, setPref, getPref } from "@artificialpoets/content/pref-store";
 *
 * See the package README for the four layers of bundle control.
 */

// Storage key constants — exported early so consumers can wire their own
// persistence layer against the same namespace.
export * from "./utils/storage-keys";

// Code rendering
export { CodeBlock, type CodeBlockProps } from "./code-block";
export {
  ClientCodeBlock,
  type ClientCodeBlockProps,
} from "./client-code-block";
export {
  createHighlighter,
  getDefaultHighlighter,
  DEFAULT_LANGS,
  DEFAULT_THEMES,
  type ContentHighlighter,
} from "./utils/default-highlighter";

// Math rendering
export { BlockMath, InlineMath, mathVariants, type MathProps } from "./math";

// Persistent preferences (localStorage-backed, cross-component + cross-tab sync)
export { getPref, setPref, subscribe, usePref } from "./pref-store";
export { PersistentTabs, type PersistentTabsProps } from "./persistent-tabs";

// Composed tabs — package manager + language pickers with per-PM / per-lang
// command generators baked in.
export {
  PackageManagerTabs,
  type PackageManagerTabsProps,
} from "./package-manager-tabs";
export {
  commandFor,
  PACKAGE_MANAGERS,
  type PackageManager,
  type PackageManagerVerb,
} from "./utils/pm-commands";
export {
  LanguageTabs,
  Example,
  type LanguageTabsProps,
  type ExampleProps,
} from "./language-tabs";
