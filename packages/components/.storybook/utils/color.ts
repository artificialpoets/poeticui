/**
 * Color-space utilities for the Storybook Design Tokens doc page.
 *
 * Ported verbatim from `apps/dashboard/app/design-system/global-defaults/color-utils.ts`
 * (DES-46 — `/design-system/` route deleted). Lives here so the Design Tokens
 * MDX page can render live OKLCH ↔ hex ↔ rgba conversions without a dashboard
 * dependency.
 *
 * References:
 * - https://bottosson.github.io/posts/oklab/
 */

export type Rgba = { r: number; g: number; b: number; a: number };

export function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

export function parseCssRgb(input: string): Rgba | null {
  const s = input.trim().toLowerCase();
  if (!s.startsWith("rgb")) return null;

  // Handles: rgb(r g b / a), rgba(r, g, b, a), rgb(r, g, b)
  const inside = s.slice(s.indexOf("(") + 1, s.lastIndexOf(")")).trim();
  if (!inside) return null;

  const normalized = inside.replace(/,/g, " ").replace(/\s+/g, " ").trim();
  const [left, alphaPart] = normalized.split(" / ");
  const parts = left.split(" ").filter(Boolean);
  if (parts.length < 3) return null;

  const r = Number(parts[0]);
  const g = Number(parts[1]);
  const b = Number(parts[2]);
  const a =
    alphaPart !== undefined
      ? Number(alphaPart)
      : parts[3] !== undefined
        ? Number(parts[3])
        : 1;
  if (![r, g, b, a].every((n) => Number.isFinite(n))) return null;

  return { r, g, b, a: clamp01(a) };
}

function toHexByte(n: number): string {
  const v = Math.round(Math.min(255, Math.max(0, n)));
  return v.toString(16).padStart(2, "0");
}

export function rgbaToHex({ r, g, b, a }: Rgba): string {
  const base = `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`;
  if (a >= 1) return base;
  return `${base}${toHexByte(a * 255)}`;
}

export function rgbaToCssRgba({ r, g, b, a }: Rgba): string {
  const alpha = Math.round(a * 1000) / 1000;
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;
}

// --- OKLCH conversion (sRGB D65) ---

function srgbToLinear(c: number): number {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

function linearToOklab(
  r: number,
  g: number,
  b: number,
): { L: number; a: number; b: number } {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const lCbrt = Math.cbrt(l);
  const mCbrt = Math.cbrt(m);
  const sCbrt = Math.cbrt(s);

  return {
    L: 0.2104542553 * lCbrt + 0.793617785 * mCbrt - 0.0040720468 * sCbrt,
    a: 1.9779984951 * lCbrt - 2.428592205 * mCbrt + 0.4505937099 * sCbrt,
    b: 0.0259040371 * lCbrt + 0.7827717662 * mCbrt - 0.808675766 * sCbrt,
  };
}

export function rgbaToOklch(rgba: Rgba): { l: number; c: number; h: number } {
  const rLin = srgbToLinear(rgba.r);
  const gLin = srgbToLinear(rgba.g);
  const bLin = srgbToLinear(rgba.b);
  const lab = linearToOklab(rLin, gLin, bLin);
  const c = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
  let h = Math.atan2(lab.b, lab.a) * (180 / Math.PI);
  if (h < 0) h += 360;
  return { l: lab.L, c, h };
}

export function formatOklch({
  l,
  c,
  h,
}: {
  l: number;
  c: number;
  h: number;
}): string {
  const L = Math.round(l * 1000) / 1000;
  const C = Math.round(c * 1000) / 1000;
  const H = Math.round(h * 100) / 100;
  return `oklch(${L} ${C} ${H})`;
}
