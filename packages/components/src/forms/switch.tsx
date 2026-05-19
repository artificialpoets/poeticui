import * as Headless from "@headlessui/react";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";

import { cx } from "../lib";

/**
 * Vertical group of {@link SwitchField} elements. Spacing tightens when
 * fields lack descriptions; loosens when they have them.
 *
 * @example
 * <SwitchGroup>
 *   <SwitchField><Label>Comments</Label><Switch defaultChecked /></SwitchField>
 *   <SwitchField><Label>Newsletter</Label><Switch /></SwitchField>
 * </SwitchGroup>
 */
export function SwitchGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-component="switch-group"
      data-slot="control"
      {...props}
      className={cx(
        // Basic groups
        "space-y-3 **:data-[slot=label]:font-normal",
        // With descriptions
        "has-data-[slot=description]:space-y-6 has-data-[slot=description]:**:data-[slot=label]:font-medium",
        className,
      )}
    />
  );
}

/**
 * Pair a {@link Switch} with a {@link Label} and optional {@link Description}.
 * Two-column grid: label/description on the left, switch on the right.
 *
 * @example
 * <SwitchField>
 *   <Label>Email me weekly summaries</Label>
 *   <Description>Sent on Monday mornings.</Description>
 *   <Switch name="weekly" defaultChecked />
 * </SwitchField>
 */
export function SwitchField({
  className,
  ...props
}: { className?: string } & Omit<Headless.FieldProps, "as" | "className">) {
  return (
    <Headless.Field
      data-component="switch-field"
      data-slot="field"
      {...props}
      className={cx(
        // Base layout
        "grid grid-cols-[1fr_auto] gap-x-8 gap-y-1 sm:grid-cols-[1fr_auto]",
        // Control layout
        "*:data-[slot=control]:col-start-2 *:data-[slot=control]:self-start sm:*:data-[slot=control]:mt-0.5",
        // Label layout
        "*:data-[slot=label]:col-start-1 *:data-[slot=label]:row-start-1",
        // Description layout
        "*:data-[slot=description]:col-start-1 *:data-[slot=description]:row-start-2",
        // With description
        "has-data-[slot=description]:**:data-[slot=label]:font-medium",
        className,
      )}
    />
  );
}

/**
 * Switch track variants (Pattern A — single cva() call).
 *
 * `color` drives the `--switch-bg`, `--switch-bg-ring`, `--switch`,
 * `--switch-ring`, and `--switch-shadow` custom properties consumed by the
 * base styles.
 *
 * `size` adjusts track dimensions. The thumb uses a sibling `switchThumbVariants`
 * with matching size classes so the translate distance stays in sync.
 *
 * NOTE: base + color presets still reference raw Tailwind palettes
 * (`bg-neutral-800`, `outline-orange-500`, etc.). Scrubbing these to semantic
 * tokens is tracked in DES-22.
 */
export const switchVariants = cva(
  [
    // Base layout
    "group relative isolate inline-flex shrink-0 cursor-default rounded-full",
    // Transitions
    "transition duration-0 ease-in-out data-changing:duration-200",
    // Forced-colors mode
    "forced-colors:outline forced-colors:[--switch-bg:Highlight] dark:forced-colors:[--switch-bg:Highlight]",
    // Unchecked
    "bg-muted ring-1 ring-border ring-inset",
    // Checked
    "data-checked:bg-(--switch-bg) data-checked:ring-(--switch-bg-ring) dark:data-checked:bg-(--switch-bg) dark:data-checked:ring-(--switch-bg-ring)",
    // Focus
    "focus:not-data-focus:outline-hidden data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-ring",
    // Hover
    "data-hover:ring-muted-foreground/30 data-hover:data-checked:ring-(--switch-bg-ring)",
    // Disabled
    "data-disabled:bg-muted data-disabled:opacity-50 data-disabled:data-checked:bg-muted data-disabled:data-checked:ring-border",
  ],
  {
    variants: {
      color: {
        "dark/zinc": [
          "[--switch-bg-ring:var(--color-neutral-950)]/90 [--switch-bg:var(--color-neutral-900)] dark:[--switch-bg-ring:transparent] dark:[--switch-bg:var(--color-white)]/25",
          "[--switch-ring:var(--color-neutral-950)]/90 [--switch-shadow:var(--color-black)]/10 [--switch:white] dark:[--switch-ring:var(--color-neutral-700)]/90",
        ],
        "dark/white": [
          "[--switch-bg-ring:var(--color-neutral-950)]/90 [--switch-bg:var(--color-neutral-900)] dark:[--switch-bg-ring:transparent] dark:[--switch-bg:var(--color-white)]",
          "[--switch-ring:var(--color-neutral-950)]/90 [--switch-shadow:var(--color-black)]/10 [--switch:white] dark:[--switch-ring:transparent] dark:[--switch:var(--color-neutral-900)]",
        ],
        dark: [
          "[--switch-bg-ring:var(--color-neutral-950)]/90 [--switch-bg:var(--color-neutral-900)] dark:[--switch-bg-ring:var(--color-white)]/15",
          "[--switch-ring:var(--color-neutral-950)]/90 [--switch-shadow:var(--color-black)]/10 [--switch:white]",
        ],
        zinc: [
          "[--switch-bg-ring:var(--color-neutral-700)]/90 [--switch-bg:var(--color-neutral-400)] dark:[--switch-bg-ring:transparent]",
          "[--switch-shadow:var(--color-black)]/10 [--switch:white] [--switch-ring:var(--color-neutral-700)]/90",
        ],
        white: [
          "[--switch-bg-ring:var(--color-black)]/15 [--switch-bg:white] dark:[--switch-bg-ring:transparent]",
          "[--switch-shadow:var(--color-black)]/10 [--switch-ring:transparent] [--switch:var(--color-neutral-950)]",
        ],
        red: [
          "[--switch-bg-ring:var(--color-red-700)]/90 [--switch-bg:var(--color-red-600)] dark:[--switch-bg-ring:transparent]",
          "[--switch:white] [--switch-ring:var(--color-red-700)]/90 [--switch-shadow:var(--color-red-900)]/20",
        ],
        orange: [
          "[--switch-bg-ring:var(--color-orange-600)]/90 [--switch-bg:var(--color-orange-500)] dark:[--switch-bg-ring:transparent]",
          "[--switch:white] [--switch-ring:var(--color-orange-600)]/90 [--switch-shadow:var(--color-orange-900)]/20",
        ],
        amber: [
          "[--switch-bg-ring:var(--color-amber-500)]/80 [--switch-bg:var(--color-amber-400)] dark:[--switch-bg-ring:transparent]",
          "[--switch-ring:transparent] [--switch-shadow:transparent] [--switch:var(--color-amber-950)]",
        ],
        yellow: [
          "[--switch-bg-ring:var(--color-yellow-400)]/80 [--switch-bg:var(--color-yellow-300)] dark:[--switch-bg-ring:transparent]",
          "[--switch-ring:transparent] [--switch-shadow:transparent] [--switch:var(--color-yellow-950)]",
        ],
        lime: [
          "[--switch-bg-ring:var(--color-lime-400)]/80 [--switch-bg:var(--color-lime-300)] dark:[--switch-bg-ring:transparent]",
          "[--switch-ring:transparent] [--switch-shadow:transparent] [--switch:var(--color-lime-950)]",
        ],
        green: [
          "[--switch-bg-ring:var(--color-green-700)]/90 [--switch-bg:var(--color-green-600)] dark:[--switch-bg-ring:transparent]",
          "[--switch:white] [--switch-ring:var(--color-green-700)]/90 [--switch-shadow:var(--color-green-900)]/20",
        ],
        emerald: [
          "[--switch-bg-ring:var(--color-emerald-600)]/90 [--switch-bg:var(--color-emerald-500)] dark:[--switch-bg-ring:transparent]",
          "[--switch:white] [--switch-ring:var(--color-emerald-600)]/90 [--switch-shadow:var(--color-emerald-900)]/20",
        ],
        teal: [
          "[--switch-bg-ring:var(--color-teal-700)]/90 [--switch-bg:var(--color-teal-600)] dark:[--switch-bg-ring:transparent]",
          "[--switch:white] [--switch-ring:var(--color-teal-700)]/90 [--switch-shadow:var(--color-teal-900)]/20",
        ],
        cyan: [
          "[--switch-bg-ring:var(--color-cyan-400)]/80 [--switch-bg:var(--color-cyan-300)] dark:[--switch-bg-ring:transparent]",
          "[--switch-ring:transparent] [--switch-shadow:transparent] [--switch:var(--color-cyan-950)]",
        ],
        sky: [
          "[--switch-bg-ring:var(--color-sky-600)]/80 [--switch-bg:var(--color-sky-500)] dark:[--switch-bg-ring:transparent]",
          "[--switch:white] [--switch-ring:var(--color-sky-600)]/80 [--switch-shadow:var(--color-sky-900)]/20",
        ],
        blue: [
          "[--switch-bg-ring:var(--color-orange-700)]/90 [--switch-bg:var(--color-orange-600)] dark:[--switch-bg-ring:transparent]",
          "[--switch:white] [--switch-ring:var(--color-orange-700)]/90 [--switch-shadow:var(--color-orange-900)]/20",
        ],
        indigo: [
          "[--switch-bg-ring:var(--color-indigo-600)]/90 [--switch-bg:var(--color-indigo-500)] dark:[--switch-bg-ring:transparent]",
          "[--switch:white] [--switch-ring:var(--color-indigo-600)]/90 [--switch-shadow:var(--color-indigo-900)]/20",
        ],
        violet: [
          "[--switch-bg-ring:var(--color-violet-600)]/90 [--switch-bg:var(--color-violet-500)] dark:[--switch-bg-ring:transparent]",
          "[--switch:white] [--switch-ring:var(--color-violet-600)]/90 [--switch-shadow:var(--color-violet-900)]/20",
        ],
        purple: [
          "[--switch-bg-ring:var(--color-purple-600)]/90 [--switch-bg:var(--color-purple-500)] dark:[--switch-bg-ring:transparent]",
          "[--switch:white] [--switch-ring:var(--color-purple-600)]/90 [--switch-shadow:var(--color-purple-900)]/20",
        ],
        fuchsia: [
          "[--switch-bg-ring:var(--color-fuchsia-600)]/90 [--switch-bg:var(--color-fuchsia-500)] dark:[--switch-bg-ring:transparent]",
          "[--switch:white] [--switch-ring:var(--color-fuchsia-600)]/90 [--switch-shadow:var(--color-fuchsia-900)]/20",
        ],
        pink: [
          "[--switch-bg-ring:var(--color-pink-600)]/90 [--switch-bg:var(--color-pink-500)] dark:[--switch-bg-ring:transparent]",
          "[--switch:white] [--switch-ring:var(--color-pink-600)]/90 [--switch-shadow:var(--color-pink-900)]/20",
        ],
        rose: [
          "[--switch-bg-ring:var(--color-rose-600)]/90 [--switch-bg:var(--color-rose-500)] dark:[--switch-bg-ring:transparent]",
          "[--switch:white] [--switch-ring:var(--color-rose-600)]/90 [--switch-shadow:var(--color-rose-900)]/20",
        ],
      },
      size: {
        sm: "h-4 w-7 p-[2px]",
        md: "h-6 w-10 p-[3px] sm:h-5 sm:w-8",
        lg: "h-7 w-12 p-[4px]",
      },
    },
    defaultVariants: {
      color: "dark/zinc",
      size: "md",
    },
  },
);

/**
 * Switch thumb (the sliding circle). Size variant must match the track's
 * `size` so the translate distance lines up.
 */
const switchThumbVariants = cva(
  [
    // Basic layout
    "pointer-events-none relative inline-block rounded-full",
    // Transition
    "translate-x-0 transition duration-200 ease-in-out",
    // Invisible border for forced-colors visibility
    "border border-transparent",
    // Unchecked
    "bg-white shadow-sm ring-1 ring-black/5",
    // Checked
    "group-data-checked:bg-(--switch) group-data-checked:shadow-(--switch-shadow) group-data-checked:ring-(--switch-ring)",
    // Disabled
    "group-data-checked:group-data-disabled:bg-white group-data-checked:group-data-disabled:shadow-sm group-data-checked:group-data-disabled:ring-black/5",
  ],
  {
    variants: {
      size: {
        sm: "size-3 group-data-checked:translate-x-3",
        md: "size-4.5 sm:size-3.5 group-data-checked:translate-x-4 sm:group-data-checked:translate-x-3",
        lg: "size-5 group-data-checked:translate-x-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type SwitchColor = NonNullable<
  VariantProps<typeof switchVariants>["color"]
>;
export type SwitchSize = NonNullable<
  VariantProps<typeof switchVariants>["size"]
>;

/**
 * On/off toggle. Three sizes (`sm`, `md`, `lg`) and 22 color presets.
 * Keyboard-accessible (Space toggles, Tab navigates) via HeadlessUI.
 *
 * @example
 * <Switch defaultChecked />
 *
 * @example
 * <Switch color="green" size="sm" defaultChecked />
 */
export function Switch({
  color,
  size,
  className,
  ...props
}: {
  color?: SwitchColor;
  size?: SwitchSize;
  className?: string;
} & Omit<Headless.SwitchProps, "as" | "className" | "children">) {
  return (
    <Headless.Switch
      data-component="switch"
      data-slot="control"
      {...props}
      className={cx(switchVariants({ color, size }), className)}
    >
      <span aria-hidden="true" className={switchThumbVariants({ size })} />
    </Headless.Switch>
  );
}
