/**
 * Canonical localStorage keys used by @artificialpoets/content's persistent
 * components. Exported so consumers can read/write them directly (e.g. to
 * set a default in server-rendered HTML, or to mirror the preference into
 * an app-specific analytics event).
 *
 * All keys are prefixed with `poeticui:pref:` to avoid collisions with
 * consumer code.
 */

/** Preferred package manager for <PackageManagerTabs>. */
export const STORAGE_KEY_PACKAGE_MANAGER = "poeticui:pref:package-manager";

/** Preferred programming language for <LanguageTabs>. */
export const STORAGE_KEY_LANGUAGE = "poeticui:pref:language";
