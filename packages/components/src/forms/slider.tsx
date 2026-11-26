import type React from "react";
import { useState } from "react";

import { cx } from "../lib";

export type SliderProps = Omit<React.ComponentPropsWithoutRef<"input">, "type">;

/** Where `value` sits between `min` and `max`, as a percentage for the track's fill. */
export function sliderFillPercent(
  value: number | string | undefined,
  min: number | string = 0,
  max: number | string = 100,
): number {
  const lo = Number(min);
  const hi = Number(max);
  const v = Number(value);
  if (
    !Number.isFinite(v) ||
    !Number.isFinite(lo) ||
    !Number.isFinite(hi) ||
    hi <= lo
  )
    return 0;
  return Math.min(100, Math.max(0, ((v - lo) / (hi - lo)) * 100));
}

/**
 * A range input in the theme: a track that reads against the surface, filled with
 * `--primary` up to the thumb, and a `--primary` thumb. A native `<input type="range">`
 * with `appearance-none` drops the browser's own track and thumb, and `accent-color`
 * no longer applies, so both are drawn here for WebKit/Blink and Firefox.
 *
 * Controlled (`value` + `onChange`) or uncontrolled (`defaultValue`), like an input.
 *
 * @example
 * <Slider min={0} max={1} step={0.01} value={v} onChange={(e) => setV(Number(e.target.value))} />
 */
export function Slider({
  className,
  style,
  value,
  defaultValue,
  min = 0,
  max = 100,
  onChange,
  ...props
}: SliderProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? min);
  const current = value ?? uncontrolled;
  const fill = sliderFillPercent(
    current as number | string,
    min as number | string,
    max as number | string,
  );
  return (
    <input
      type="range"
      data-slot="control"
      data-component="slider"
      min={min}
      max={max}
      value={value}
      defaultValue={value === undefined ? defaultValue : undefined}
      onChange={(e) => {
        if (value === undefined) setUncontrolled(e.target.value);
        onChange?.(e);
      }}
      {...props}
      style={{ ...style, "--slider-fill": `${fill}%` } as React.CSSProperties}
      className={cx(
        "h-1.5 w-full cursor-pointer appearance-none rounded-full bg-transparent",
        // Track: --primary up to the thumb, then a light neutral, so the fill stands apart.
        "bg-[linear-gradient(to_right,var(--primary)_var(--slider-fill),color-mix(in_oklab,var(--foreground)_15%,transparent)_var(--slider-fill))]",
        // Right-to-left: the thumb starts at the right edge, so the fill must too.
        "rtl:bg-[linear-gradient(to_left,var(--primary)_var(--slider-fill),color-mix(in_oklab,var(--foreground)_15%,transparent)_var(--slider-fill))]",
        // The light neutral alone read about 1.4:1, so a 1px inset edge at 55% foreground
        // outlines the whole track at 3:1 or more on --card and --background in both themes.
        // A darker empty track would match an orange fill in lightness instead.
        "shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--foreground)_55%,transparent)]",
        // Thumb (WebKit/Blink)
        "[&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-sm",
        // Thumb (Firefox)
        "[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:shadow-sm",
        "[&::-moz-range-track]:bg-transparent",
        // Focus and disabled
        "focus-visible:outline-hidden focus-visible:[&::-webkit-slider-thumb]:ring-2 focus-visible:[&::-webkit-slider-thumb]:ring-ring focus-visible:[&::-webkit-slider-thumb]:ring-offset-2",
        // Firefox draws its own thumb, so it needs its own ring (the outline is hidden above).
        "focus-visible:[&::-moz-range-thumb]:ring-2 focus-visible:[&::-moz-range-thumb]:ring-ring focus-visible:[&::-moz-range-thumb]:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    />
  );
}
