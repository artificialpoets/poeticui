/**
 * Package-manager command generator.
 *
 * Encapsulates the per-PM syntax differences for install / add / remove /
 * run / exec / create so `<PackageManagerTabs>` can emit the right string
 * for each tab without duplicating conditional logic across call sites.
 *
 * The matrix:
 *
 * | verb    | bun                | pnpm                 | npm                  | yarn                |
 * |---------|--------------------|----------------------|----------------------|---------------------|
 * | install | `bun install`      | `pnpm install`       | `npm install`        | `yarn install`      |
 * | add     | `bun add <args>`   | `pnpm add <args>`    | `npm install <args>` | `yarn add <args>`   |
 * | remove  | `bun remove <args>`| `pnpm remove <args>` | `npm uninstall <args>`| `yarn remove <args>`|
 * | run     | `bun run <args>`   | `pnpm run <args>`    | `npm run <args>`     | `yarn run <args>`   |
 * | exec    | `bunx <args>`      | `pnpm dlx <args>`    | `npx <args>`         | `yarn dlx <args>`   |
 * | create  | `bun create <args>`| `pnpm create <args>` | `npm create <args>`  | `yarn create <args>`|
 *
 * `yarn` syntax assumes modern Yarn (berry / v2+). Classic Yarn v1 users
 * will mostly see the same strings — the only difference in the matrix
 * is `dlx`, which v1 doesn't support (they'd use `npx` directly).
 */

export type PackageManager = "bun" | "pnpm" | "npm" | "yarn";

export type PackageManagerVerb =
  | "install"
  | "add"
  | "remove"
  | "run"
  | "exec"
  | "create";

/** Ordered list of supported package managers — drives the tab order. */
export const PACKAGE_MANAGERS: readonly PackageManager[] = [
  "bun",
  "pnpm",
  "npm",
  "yarn",
] as const;

/**
 * Build a shell command for the given package manager + verb + args.
 *
 * `args` is whatever should follow the command's leading verb — a package
 * name, a list of packages, a script name, a template+app name, etc.
 * Passing an empty string for verbs that take args yields a usable command
 * (e.g. `bun add ` — trailing space, but still runnable after the user
 * appends their package name).
 *
 * ```ts
 * commandFor("bun",  "add",    "react"       ) // "bun add react"
 * commandFor("npm",  "remove", "lodash"      ) // "npm uninstall lodash"
 * commandFor("pnpm", "exec",   "tsc --watch" ) // "pnpm dlx tsc --watch"
 * commandFor("yarn", "create", "next-app my-app") // "yarn create next-app my-app"
 * ```
 */
export function commandFor(
  pm: PackageManager,
  verb: PackageManagerVerb,
  args: string,
): string {
  const clean = args.trim();
  switch (pm) {
    case "bun":
      switch (verb) {
        case "install":
          return "bun install";
        case "add":
          return `bun add ${clean}`.trimEnd();
        case "remove":
          return `bun remove ${clean}`.trimEnd();
        case "run":
          return `bun run ${clean}`.trimEnd();
        case "exec":
          return `bunx ${clean}`.trimEnd();
        case "create":
          return `bun create ${clean}`.trimEnd();
        default:
          return assertNeverVerb(verb);
      }
    case "pnpm":
      switch (verb) {
        case "install":
          return "pnpm install";
        case "add":
          return `pnpm add ${clean}`.trimEnd();
        case "remove":
          return `pnpm remove ${clean}`.trimEnd();
        case "run":
          return `pnpm run ${clean}`.trimEnd();
        case "exec":
          return `pnpm dlx ${clean}`.trimEnd();
        case "create":
          return `pnpm create ${clean}`.trimEnd();
        default:
          return assertNeverVerb(verb);
      }
    case "npm":
      switch (verb) {
        case "install":
          return "npm install";
        case "add":
          return `npm install ${clean}`.trimEnd();
        case "remove":
          return `npm uninstall ${clean}`.trimEnd();
        case "run":
          return `npm run ${clean}`.trimEnd();
        case "exec":
          return `npx ${clean}`.trimEnd();
        case "create":
          return `npm create ${clean}`.trimEnd();
        default:
          return assertNeverVerb(verb);
      }
    case "yarn":
      switch (verb) {
        case "install":
          return "yarn install";
        case "add":
          return `yarn add ${clean}`.trimEnd();
        case "remove":
          return `yarn remove ${clean}`.trimEnd();
        case "run":
          return `yarn run ${clean}`.trimEnd();
        case "exec":
          return `yarn dlx ${clean}`.trimEnd();
        case "create":
          return `yarn create ${clean}`.trimEnd();
        default:
          return assertNeverVerb(verb);
      }
    default:
      return assertNeverPm(pm);
  }
}

function assertNeverVerb(x: never): never {
  throw new Error(`Unknown package-manager verb: ${String(x)}`);
}

function assertNeverPm(x: never): never {
  throw new Error(`Unknown package manager: ${String(x)}`);
}
