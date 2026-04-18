import {
  commandFor,
  PACKAGE_MANAGERS,
  type PackageManager,
  type PackageManagerVerb,
} from "../../utils/pm-commands";

describe("commandFor", () => {
  // Exhaustive per-PM snapshot: every verb × every PM. Single source of
  // truth — if the matrix ever shifts, this table is the place to look.
  const expected: Record<
    PackageManager,
    Record<PackageManagerVerb, { args: string; out: string }>
  > = {
    bun: {
      install: { args: "", out: "bun install" },
      add: { args: "react", out: "bun add react" },
      remove: { args: "lodash", out: "bun remove lodash" },
      run: { args: "build", out: "bun run build" },
      exec: { args: "tsc --watch", out: "bunx tsc --watch" },
      create: { args: "next-app my-app", out: "bun create next-app my-app" },
    },
    pnpm: {
      install: { args: "", out: "pnpm install" },
      add: { args: "react", out: "pnpm add react" },
      remove: { args: "lodash", out: "pnpm remove lodash" },
      run: { args: "build", out: "pnpm run build" },
      exec: { args: "tsc --watch", out: "pnpm dlx tsc --watch" },
      create: { args: "next-app my-app", out: "pnpm create next-app my-app" },
    },
    npm: {
      install: { args: "", out: "npm install" },
      add: { args: "react", out: "npm install react" },
      remove: { args: "lodash", out: "npm uninstall lodash" },
      run: { args: "build", out: "npm run build" },
      exec: { args: "tsc --watch", out: "npx tsc --watch" },
      create: { args: "next-app my-app", out: "npm create next-app my-app" },
    },
    yarn: {
      install: { args: "", out: "yarn install" },
      add: { args: "react", out: "yarn add react" },
      remove: { args: "lodash", out: "yarn remove lodash" },
      run: { args: "build", out: "yarn run build" },
      exec: { args: "tsc --watch", out: "yarn dlx tsc --watch" },
      create: { args: "next-app my-app", out: "yarn create next-app my-app" },
    },
  };

  describe.each(PACKAGE_MANAGERS)("for %s", (pm) => {
    const verbs: PackageManagerVerb[] = [
      "install",
      "add",
      "remove",
      "run",
      "exec",
      "create",
    ];
    test.each(verbs)("verb %s", (verb) => {
      const { args, out } = expected[pm][verb];
      expect(commandFor(pm, verb, args)).toBe(out);
    });
  });

  test("trims surrounding whitespace from args", () => {
    expect(commandFor("bun", "add", "  react  ")).toBe("bun add react");
  });

  test("handles multi-package args by preserving internal spaces", () => {
    expect(commandFor("pnpm", "add", "react react-dom classnames")).toBe(
      "pnpm add react react-dom classnames",
    );
  });

  test("add with empty args yields the bare command (no trailing space)", () => {
    expect(commandFor("npm", "add", "")).toBe("npm install");
  });
});
