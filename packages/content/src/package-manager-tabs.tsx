import type { ReactNode } from "react";

import { CodeBlock } from "./code-block";
import { PackageManagerTabsShell } from "./package-manager-tabs-shell";
import {
  commandFor,
  PACKAGE_MANAGERS,
  type PackageManager,
  type PackageManagerVerb,
} from "./utils/pm-commands";

export interface PackageManagerTabsProps {
  /** `bun install` / `pnpm install` / … — no args. */
  install?: boolean | string;
  /** `bun add <args>` / `pnpm add <args>` / … */
  add?: string;
  /** `bun remove <args>` / `pnpm remove <args>` / … */
  remove?: string;
  /** `bun run <args>` / `pnpm run <args>` / … */
  run?: string;
  /** `bunx <args>` / `pnpm dlx <args>` / `npx <args>` / `yarn dlx <args>`. */
  exec?: string;
  /** `bun create <args>` / `pnpm create <args>` / … */
  create?: string;
  /** Starting tab if no preference is stored yet. Defaults to `"bun"`. */
  defaultValue?: PackageManager;
  /** Extra classes on the outer wrapper. */
  className?: string;
}

/**
 * PackageManagerTabs — a `<PersistentTabs>` specialised for the npm /
 * pnpm / bun / yarn picker that docs pages almost always need.
 *
 * Pass **exactly one** verb prop; the component generates the correct
 * command for every package manager via `commandFor()` and renders a
 * syntax-highlighted `<CodeBlock lang="bash">` per tab:
 *
 * ```tsx
 * <PackageManagerTabs add="react react-dom" />
 * <PackageManagerTabs create="next-app my-app" />
 * <PackageManagerTabs run="build" />
 * <PackageManagerTabs install />
 * ```
 *
 * All instances on a page (and across browser tabs) stay in sync because
 * they share `storageKey="poeticui:pref:package-manager"` internally.
 *
 * **Server Component** — pre-renders all four `<CodeBlock>`s server-side
 * so Shiki's WASM + grammars never ship to the browser. A thin client
 * shell (`PackageManagerTabsShell`) handles tab switching + persistence.
 */
export async function PackageManagerTabs({
  install,
  add,
  remove,
  run,
  exec,
  create,
  defaultValue = "bun",
  className,
}: PackageManagerTabsProps) {
  const { verb, args } = resolveVerb({
    install,
    add,
    remove,
    run,
    exec,
    create,
  });

  // Pre-render all four CodeBlocks server-side in parallel. Each one
  // gets its own PM-specific command string via `commandFor()`.
  const entries = await Promise.all(
    PACKAGE_MANAGERS.map(async (pm) => {
      const code = commandFor(pm, verb, args);
      const block = await CodeBlock({ code, lang: "bash" });
      return [pm, block] as const;
    }),
  );
  const slots = Object.fromEntries(entries) as Record<
    PackageManager,
    ReactNode
  >;

  return (
    <PackageManagerTabsShell
      slots={slots}
      defaultValue={defaultValue}
      className={className}
    />
  );
}

// ── helpers ────────────────────────────────────────────────────────────

/**
 * Picks the verb the consumer supplied and extracts its args. Exactly
 * one verb prop should be set; if multiple are set we take the first
 * defined one in declaration order (install > add > remove > run > exec
 * > create), matching the props declaration order above. If none are
 * set we default to bare `install` — safer than throwing at render.
 */
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
  // No verb supplied — fall back to bare install for the 4 PMs.
  return { verb: "install", args: "" };
}
