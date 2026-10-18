import { readFileSync } from "node:fs";
import { join } from "node:path";

import { switchVariants } from "../forms/switch";

/**
 * Switch, Checkbox, Radio and Button mix `var(--color-white)` and `var(--color-black)` inside
 * arbitrary values. Tailwind does not count those as use, so unless the palette emits the two
 * colors statically they never reach :root and every such mix resolves to no color at all
 * (a checked switch had no track in dark mode).
 */
describe("palette colors referenced only inside arbitrary values", () => {
  const palette = readFileSync(
    join(__dirname, "../../../tokens/src/palette.css"),
    "utf8",
  );
  const staticBlock = palette.match(/@theme static \{([^}]*)\}/)?.[1] ?? "";

  test("white and black are emitted statically", () => {
    expect(staticBlock).toMatch(/--color-white:\s*#fff;/);
    expect(staticBlock).toMatch(/--color-black:\s*#000;/);
  });

  test("the components still reference them, so the static block is still needed", () => {
    expect(switchVariants({ color: "dark/zinc" })).toContain(
      "var(--color-white)",
    );
  });
});
