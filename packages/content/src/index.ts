/**
 * @poeticui/content — primitives for rendering technical content.
 *
 * This barrel re-exports every primitive. Consumers can also import from
 * subpaths for zero-risk tree-shaking:
 *
 *   import { CodeBlock } from "@poeticui/content/code-block";
 *   import { BlockMath } from "@poeticui/content/math";
 *   import { PersistentTabs } from "@poeticui/content/persistent-tabs";
 *   import { PackageManagerTabs } from "@poeticui/content/package-manager-tabs";
 *   import { LanguageTabs, Example } from "@poeticui/content/language-tabs";
 *   import { usePref, setPref, getPref } from "@poeticui/content/pref-store";
 *
 * See the package README for the four layers of bundle control.
 */

// Storage key constants — exported early so consumers can wire their own
// persistence layer against the same namespace.
export * from "./utils/storage-keys";
