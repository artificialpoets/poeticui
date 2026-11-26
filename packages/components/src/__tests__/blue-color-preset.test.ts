import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The `blue` colour preset of Button, Checkbox, Radio and Switch once pointed
 * at the orange palette (a stray search-and-replace), so `color="blue"`
 * rendered orange. Each preset must draw from the palette it is named after.
 */
const files = {
  button: "../core/button.tsx",
  checkbox: "../forms/checkbox.tsx",
  radio: "../forms/radio.tsx",
  switch: "../forms/switch.tsx",
};

function bluePreset(source: string): string {
  // `blue: "…"` (one string) or `blue: [ "…", "…" ]` (an array of strings,
  // closed by a `]` on its own line: the class strings contain brackets too).
  const match = source.match(/\n\s*blue:\s*(\[[\s\S]*?\n\s*\]|"[^"]*")/);
  if (!match) throw new Error("blue preset not found");
  return match[1];
}

describe.each(Object.entries(files))("%s blue preset", (_name, path) => {
  const preset = bluePreset(readFileSync(join(__dirname, path), "utf8"));

  test("uses the blue palette", () => {
    expect(preset).toMatch(/--color-blue-\d+/);
  });

  test("never uses another hue", () => {
    const hues = [...preset.matchAll(/--color-([a-z]+)-\d+/g)].map((m) => m[1]);
    expect(new Set(hues)).toEqual(new Set(["blue"]));
  });
});
