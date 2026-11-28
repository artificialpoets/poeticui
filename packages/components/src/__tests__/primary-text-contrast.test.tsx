import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { render, screen } from "@testing-library/react";
import React from "react";

import { Callout } from "../feedback/callout";
import { DataTableFilterChips } from "../tables/data-table-filter-chips";

/**
 * --primary-text is the brand colour as text. These tests read the rules out
 * of semantic.css and apply them to the palette the way the browser does
 * (oklch relative colour), so a change to the clamps, the palette or a
 * surface that drops brand-coloured text under 4.5:1 fails here rather than
 * in the dashboard. The website theme (apps/poetic-theme in the monorepo)
 * carries the same rule and the same test.
 */
const TAG = "[@artificialpoets/components/__tests__/primary-text-contrast]";
const tokens = join(__dirname, "../../../tokens/src");
const semantic = readFileSync(join(tokens, "semantic.css"), "utf8");
const palette = readFileSync(join(tokens, "palette.css"), "utf8");
const tailwind = readFileSync(join(tokens, "tailwind-theme.css"), "utf8");
const neutralTheme = readFileSync(join(tokens, "themes/neutral.css"), "utf8");

type Oklch = [number, number, number];
type Rgb = [number, number, number];

function color(name: string): Oklch {
  const m = new RegExp(
    `--color-${name}:\\s*oklch\\(([\\d.]+) ([\\d.]+) ([\\d.]+)\\)`,
  ).exec(palette);
  if (!m) throw new Error(`${TAG} palette colour not found: ${name}`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

const WHITE: Oklch = [1, 0, 0];
const BLACK: Oklch = [0, 0, 0];

/** oklch → gamma-encoded sRGB, clipped to the gamut. */
function srgb([L, C, h]: Oklch): Rgb {
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((x) => Math.min(1, Math.max(0, x)));
  return linear.map((x) =>
    x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055,
  ) as Rgb;
}

function luminance(rgb: Rgb): number {
  const [r, g, b] = rgb.map((x) =>
    x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(x: Rgb, y: Rgb): number {
  const [hi, lo] = [luminance(x), luminance(y)].sort((p, q) => q - p);
  return (hi + 0.05) / (lo + 0.05);
}

/** `bg-primary/N` painted over `backdrop`, as the browser composites it. */
function tint(primary: Oklch, alpha: number, backdrop: Oklch): Rgb {
  const fg = srgb(primary);
  const bg = srgb(backdrop);
  return fg.map((x, i) => x * alpha + bg[i] * (1 - alpha)) as Rgb;
}

const SUPPORTS =
  "@supports (color: oklch(from red min(l, 0.55) min(c, 0.19) h))";

/** The `oklch(from var(--primary) …)` rule declared for `selector`, applied to `primary`. */
function derive(selector: RegExp, primary: Oklch): Oklch {
  const at = semantic.indexOf(SUPPORTS);
  if (at < 0) throw new Error(`${TAG} no ${SUPPORTS} block in semantic.css`);
  const rule = new RegExp(
    `${selector.source}\\s*\\{\\s*--primary-text:\\s*oklch\\(from var\\(--primary\\) ([^;]*)\\);`,
  ).exec(semantic.slice(at));
  if (!rule) throw new Error(`${TAG} no --primary-text rule for ${selector}`);
  const [lExpr, cExpr, hExpr] = rule[1].split(/\s+(?![^(]*\))/);
  expect(hExpr).toBe("h");
  const evaluate = (expr: string, channel: "l" | "c", value: number) => {
    if (expr === channel) return value;
    const fn = /^(min|max)\(([lc]), ([\d.]+)\)$/.exec(expr);
    if (!fn || fn[2] !== channel)
      throw new Error(`${TAG} unexpected ${channel} expression: ${expr}`);
    const limit = Number(fn[3]);
    return fn[1] === "min" ? Math.min(value, limit) : Math.max(value, limit);
  };
  return [
    evaluate(lExpr, "l", primary[0]),
    evaluate(cExpr, "c", primary[1]),
    primary[2],
  ];
}

const LIGHT = /:root,\s*\.light/;
const DARK = /\.dark/;

/** The value a mode block of semantic.css gives a token, as a palette colour. */
function semanticColor(block: RegExp, token: string): Oklch {
  const body = new RegExp(`${block.source}\\s*\\{([^}]*)\\}`).exec(
    semantic,
  )?.[1];
  const value = body
    ? new RegExp(`${token}:\\s*([^;]+);`).exec(body)?.[1].trim()
    : undefined;
  if (value === "oklch(1 0 0)") return WHITE;
  const ref = value && /^var\(--color-([\w-]+)\)$/.exec(value);
  if (!ref)
    throw new Error(`${TAG} ${token} is not a palette colour: ${value}`);
  return color(ref[1]);
}

const ORANGE = color("orange-600");
const light = {
  background: semanticColor(LIGHT, "--background"),
  card: semanticColor(LIGHT, "--card"),
  muted: semanticColor(LIGHT, "--muted"),
};
const dark = {
  background: semanticColor(DARK, "--background"),
  card: semanticColor(DARK, "--card"),
  muted: semanticColor(DARK, "--muted"),
};

// --primary is the fill behind --primary-foreground: buttons, banners, the
// active sidebar item. White on the old orange-500 read 3.45:1 (AP-2222).
describe("--primary as a fill", () => {
  test("is orange-600 in both modes; orange-500 was under 4.5:1 with white", () => {
    expect(semanticColor(LIGHT, "--primary")).toEqual(ORANGE);
    expect(semanticColor(DARK, "--primary")).toEqual(ORANGE);
    expect(contrast(srgb(WHITE), srgb(color("orange-500")))).toBeLessThan(4.5);
  });

  test("--primary-foreground reads 4.5:1 or more on it, at rest and under the Button's hover", () => {
    for (const block of [LIGHT, DARK]) {
      const fill = semanticColor(block, "--primary");
      const ink = srgb(semanticColor(block, "--primary-foreground"));
      expect(contrast(ink, srgb(fill))).toBeGreaterThanOrEqual(4.5);
      // The primary Button darkens on hover: black at 10% over the fill.
      expect(contrast(ink, tint(BLACK, 0.1, fill))).toBeGreaterThanOrEqual(4.5);
    }
  });

  test("--sidebar-primary-foreground reads 4.5:1 or more on --sidebar-primary", () => {
    for (const block of [LIGHT, DARK]) {
      const fill = srgb(semanticColor(block, "--sidebar-primary"));
      const ink = srgb(semanticColor(block, "--sidebar-primary-foreground"));
      expect(contrast(ink, fill)).toBeGreaterThanOrEqual(4.5);
    }
  });

  test("the focus ring reads 3:1 or more on the page in both modes", () => {
    const ring = (block: RegExp) =>
      new RegExp(`${block.source}\\s*\\{([^}]*)\\}`)
        .exec(semantic)?.[1]
        .match(/--ring:\s*([^;]+);/)?.[1]
        .trim();
    // Light: the fill itself. Dark: orange-600 is 2.9:1 on the dark page,
    // so the ring takes the lifted --primary-text.
    expect(ring(LIGHT)).toBe("var(--primary)");
    expect(
      contrast(srgb(ORANGE), srgb(light.background)),
    ).toBeGreaterThanOrEqual(3);
    expect(ring(DARK)).toBe("var(--primary-text)");
    expect(contrast(srgb(ORANGE), srgb(dark.background))).toBeLessThan(3);
    expect(
      contrast(srgb(derive(DARK, ORANGE)), srgb(dark.background)),
    ).toBeGreaterThanOrEqual(3);
  });
});

describe("--primary-text", () => {
  test("is needed: the orange-600 fill as text fails 4.5:1 on the dark card", () => {
    expect(contrast(srgb(ORANGE), srgb(dark.card))).toBeLessThan(4.5);
  });

  test("reads 4.5:1 or more on the light background, card and muted", () => {
    const text = srgb(derive(LIGHT, ORANGE));
    for (const surface of Object.values(light)) {
      expect(contrast(text, srgb(surface))).toBeGreaterThanOrEqual(4.5);
    }
  });

  test("reads 4.5:1 or more on the dark background, card and muted", () => {
    const text = srgb(derive(DARK, ORANGE));
    for (const surface of Object.values(dark)) {
      expect(contrast(text, srgb(surface))).toBeGreaterThanOrEqual(4.5);
    }
  });

  // The tints the components put behind text-primary-text: Callout, the
  // filter chips and the date-range preset use bg-primary/10 in light and
  // up to /20 in dark. They sit on the page, a card or a popover (= card).
  // --muted is left out on purpose: a /10 tint over light --muted reads
  // 4.49:1 and a /20 tint over dark --muted 4.38:1, so do not put a primary
  // tint behind brand-coloured text on a muted surface.
  test("reads 4.5:1 or more on the primary tints the components use", () => {
    const lightText = srgb(derive(LIGHT, ORANGE));
    const darkText = srgb(derive(DARK, ORANGE));
    for (const surface of [light.background, light.card]) {
      expect(
        contrast(lightText, tint(ORANGE, 0.1, surface)),
      ).toBeGreaterThanOrEqual(4.5);
    }
    for (const surface of [dark.background, dark.card]) {
      for (const alpha of [0.1, 0.2]) {
        expect(
          contrast(darkText, tint(ORANGE, alpha, surface)),
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  // The clamps were tuned on the AP orange. Lightness alone does not fix
  // contrast across hues: at the 0.54 cap a green, teal or cyan primary
  // (hue about 125° to 240°) keeps more luminance and reads 3.8:1 to 4.5:1
  // on white. The tokens README says so; this sweep keeps that sentence true.
  // Each primary is taken lighter and more saturated than the caps, so the
  // caps decide the result (the worst case for that hue).
  const HUES = Array.from({ length: 72 }, (_, i) => i * 5);
  const SHORT_BAND = { from: 120, to: 245, floor: 3.8 };

  test("light: every hue outside green to cyan reads 4.5:1 on the background and card; none under 3.8:1", () => {
    const short: number[] = [];
    for (const h of HUES) {
      const text = srgb(derive(LIGHT, [0.7, 0.25, h]));
      for (const surface of [light.background, light.card]) {
        const ratio = contrast(text, srgb(surface));
        expect(ratio).toBeGreaterThanOrEqual(SHORT_BAND.floor);
        if (ratio < 4.5) short.push(h);
      }
    }
    expect(short.length).toBeGreaterThan(0); // else the README overstates it
    for (const h of short) {
      expect(h).toBeGreaterThanOrEqual(SHORT_BAND.from);
      expect(h).toBeLessThanOrEqual(SHORT_BAND.to);
    }
  });

  test("dark: every hue reads 4.5:1 on the dark background and card", () => {
    for (const h of HUES) {
      const text = srgb(derive(DARK, [0.4, 0.25, h]));
      for (const surface of [dark.background, dark.card]) {
        expect(contrast(text, srgb(surface))).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  test("leaves a black or white primary (the a13s brand) unchanged", () => {
    expect(derive(LIGHT, BLACK)).toEqual(BLACK);
    expect(derive(DARK, WHITE)).toEqual(WHITE);
  });

  test("leaves the neutral theme's zinc primaries unchanged", () => {
    const zinc = (block: RegExp) => {
      const body = new RegExp(`${block.source}\\s*\\{([^}]*)\\}`).exec(
        neutralTheme,
      )?.[1];
      const ref = body && /--primary:\s*var\(--color-([\w-]+)\)/.exec(body);
      if (!ref) throw new Error(`${TAG} neutral theme --primary not found`);
      return color(ref[1]);
    };
    expect(derive(LIGHT, zinc(LIGHT))).toEqual(zinc(LIGHT));
    expect(derive(DARK, zinc(DARK))).toEqual(zinc(DARK));
  });

  test("falls back to --primary in both mode blocks where relative colour is unsupported", () => {
    const before = semantic.slice(0, semantic.indexOf(SUPPORTS));
    for (const block of [LIGHT, DARK]) {
      const body = new RegExp(`${block.source}\\s*\\{([^}]*)\\}`).exec(
        before,
      )?.[1];
      expect(body).toMatch(/--primary-text:\s*var\(--primary\);/);
    }
  });

  test("is a Tailwind colour, so text-primary-text exists", () => {
    expect(tailwind).toMatch(/--color-primary-text:\s*var\(--primary-text\);/);
  });
});

describe("components use text-primary-text for brand-coloured text", () => {
  test("the primary Callout", () => {
    render(
      <Callout variant="primary" data-testid="callout">
        Heads up
      </Callout>,
    );
    const className = screen.getByTestId("callout").className;
    expect(className).toContain("text-primary-text");
    expect(className).not.toMatch(/(^|\s)text-primary(\s|$)/);
  });

  test("the filter chips, with the label set apart by weight, not opacity", () => {
    render(
      <DataTableFilterChips
        filters={[{ key: "name", label: "Name", value: "alice" }]}
        onRemove={() => {}}
        onClearAll={() => {}}
      />,
    );
    const label = screen.getByText("Name:");
    expect(label.parentElement?.className).toContain("text-primary-text");
    expect(label.className).toBe("font-normal");
  });

  // Bare text-primary is allowed only where the brand colour is on an icon,
  // which needs 3:1, not 4.5:1. Anything else should be text-primary-text.
  test("no other source file paints text in bare text-primary", () => {
    const ICON_ONLY = new Set([
      "data-display/stat.tsx", // iconVariant tints the stat icon
      "tables/data-table-filter-popover.tsx", // the active filter icon
      "tables/data-table-filter-chips.tsx", // the chip's remove (X) icon
    ]);
    const root = join(__dirname, "..");
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) {
          if (name !== "__tests__") walk(path);
        } else if (
          /\.(tsx?|css)$/.test(name) &&
          !/\.(test|stories)\.tsx?$/.test(name)
        ) {
          files.push(path);
        }
      }
    };
    walk(root);
    const offenders = files
      .map((path) => relative(root, path))
      .filter((rel) => !ICON_ONLY.has(rel))
      .filter((rel) =>
        /(^|[\s"':])text-primary(\/\d+)?(?![\w-])/.test(
          readFileSync(join(root, rel), "utf8"),
        ),
      );
    expect(offenders).toEqual([]);
  });
});
