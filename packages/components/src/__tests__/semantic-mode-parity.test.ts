import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The semantic tokens declare a light payload on `:root, .light` and a dark
 * payload on `.dark`. The two blocks must declare exactly the same custom
 * properties: a token only in the light block never flips, and a `.light`
 * island inside a `.dark` document cannot restore a token only in `.dark`.
 */
const semantic = readFileSync(
  join(__dirname, "../../../tokens/src/semantic.css"),
  "utf8",
);

function block(selector: RegExp): string {
  const match = semantic.match(selector);
  if (!match) throw new Error(`block not found: ${selector}`);
  return match[1];
}

function declarations(css: string): Map<string, string> {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const out = new Map<string, string>();
  for (const m of withoutComments.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    out.set(m[1], m[2].trim());
  }
  return out;
}

const light = declarations(block(/:root,\s*\.light\s*\{([^}]*)\}/));
const dark = declarations(block(/\.dark\s*\{([^}]*)\}/));

describe("semantic token mode blocks", () => {
  test("the light and dark blocks declare the same tokens", () => {
    expect([...dark.keys()].sort()).toEqual([...light.keys()].sort());
  });

  test("the Figma divider tiers flip with the mode", () => {
    expect(light.get("--border-secondary")).toBe("var(--color-neutral-100)");
    expect(light.get("--border-tertiary")).toBe("var(--color-neutral-50)");
    expect(dark.get("--border-secondary")).toBe("var(--color-neutral-800)");
    // Not neutral-900: dark --card is neutral-900, so the divider vanished on cards.
    expect(dark.get("--border-tertiary")).toBe("oklch(1 0 0 / 6%)");
    expect(dark.get("--border-tertiary")).not.toBe(dark.get("--card"));
  });

  test("the scrim token is declared per mode, deeper in dark", () => {
    expect(light.get("--overlay")).toBe("oklch(0 0 0 / 30%)");
    expect(dark.get("--overlay")).toBe("oklch(0 0 0 / 60%)");
  });

  test("destructive uses the shades that pass 4.5:1 as text and under its label", () => {
    expect(light.get("--destructive")).toBe("var(--color-red-700)");
    expect(light.get("--destructive-foreground")).toBe("oklch(1 0 0)");
    expect(dark.get("--destructive")).toBe("var(--color-red-400)");
    expect(dark.get("--destructive-foreground")).toBe(
      "var(--color-neutral-950)",
    );
  });

  test("the divider tiers are not also pinned on the mode-invariant :root block", () => {
    const rootOnly = declarations(block(/:root\s*\{([^}]*)\}/));
    expect(rootOnly.has("--border-secondary")).toBe(false);
    expect(rootOnly.has("--border-tertiary")).toBe(false);
  });
});
