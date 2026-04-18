import * as Headless from "@headlessui/react";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";

import { cx } from "../lib";

export function CheckboxGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="control"
      {...props}
      className={cx(
        // Basic groups
        "space-y-3",
        // With descriptions
        "has-data-[slot=description]:space-y-6 has-data-[slot=description]:**:data-[slot=label]:font-medium",
        className,
      )}
    />
  );
}

export function CheckboxField({
  className,
  ...props
}: { className?: string } & Omit<Headless.FieldProps, "as" | "className">) {
  return (
    <Headless.Field
      data-slot="field"
      {...props}
      className={cx(
        // Base layout
        "grid grid-cols-[1.125rem_1fr] gap-x-4 gap-y-1 sm:grid-cols-[1rem_1fr]",
        // Control layout
        "*:data-[slot=control]:col-start-1 *:data-[slot=control]:row-start-1 *:data-[slot=control]:mt-0.75 sm:*:data-[slot=control]:mt-1",
        // Label layout
        "*:data-[slot=label]:col-start-2 *:data-[slot=label]:row-start-1",
        // Description layout
        "*:data-[slot=description]:col-start-2 *:data-[slot=description]:row-start-2",
        // With description
        "has-data-[slot=description]:**:data-[slot=label]:font-medium",
        className,
      )}
    />
  );
}

/**
 * Checkbox visual variants (Pattern A — single cva() call).
 *
 * Color drives the `--checkbox-check`, `--checkbox-checked-bg`, and
 * `--checkbox-checked-border` custom properties consumed by the base styles.
 *
 * NOTE: base + color presets still reference raw Tailwind palettes
 * (`border-neutral-950/15`, `outline-orange-500`, etc.). Scrubbing these to
 * semantic tokens is tracked in DES-22 and is out of scope for this migration.
 */
export const checkboxVariants = cva(
  [
    // Basic layout
    "relative isolate flex items-center justify-center rounded-[0.3125rem]",
    // Background color + shadow applied to inset pseudo element
    "before:absolute before:inset-0 before:-z-10 before:rounded-[calc(0.3125rem-1px)] before:bg-card before:shadow-sm",
    // Background color when checked
    "group-data-checked:before:bg-(--checkbox-checked-bg)",
    // Dark mode: background moved to control, hide `before`
    "dark:before:hidden",
    "dark:bg-muted/30 dark:group-data-checked:bg-(--checkbox-checked-bg)",
    // Border
    "border border-border group-data-checked:border-transparent group-data-hover:group-data-checked:border-transparent group-data-hover:border-muted-foreground/40 group-data-checked:bg-(--checkbox-checked-border)",
    // Inner highlight shadow
    "after:absolute after:inset-0 after:rounded-[calc(0.3125rem-1px)] after:shadow-[inset_0_1px_--theme(--color-white/15%)]",
    "dark:after:-inset-px dark:after:hidden dark:after:rounded-[0.3125rem] dark:group-data-checked:after:block",
    // Focus ring
    "group-data-focus:outline-2 group-data-focus:outline-offset-2 group-data-focus:outline-ring",
    // Disabled state
    "group-data-disabled:opacity-50",
    "group-data-disabled:border-muted-foreground/30 group-data-disabled:bg-muted/30 group-data-disabled:[--checkbox-check:var(--color-neutral-950)]/50 group-data-disabled:before:bg-transparent",
    "dark:group-data-checked:group-data-disabled:after:hidden",
    // Forced colors mode
    "forced-colors:[--checkbox-check:HighlightText] forced-colors:[--checkbox-checked-bg:Highlight] forced-colors:group-data-disabled:[--checkbox-check:Highlight]",
    "dark:forced-colors:[--checkbox-check:HighlightText] dark:forced-colors:[--checkbox-checked-bg:Highlight] dark:forced-colors:group-data-disabled:[--checkbox-check:Highlight]",
  ],
  {
    variants: {
      color: {
        "dark/zinc": [
          "[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-neutral-900)] [--checkbox-checked-border:var(--color-neutral-950)]/90",
          "dark:[--checkbox-checked-bg:var(--color-neutral-400)]",
        ],
        "dark/white": [
          "[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-neutral-900)] [--checkbox-checked-border:var(--color-neutral-950)]/90",
          "dark:[--checkbox-check:var(--color-neutral-900)] dark:[--checkbox-checked-bg:var(--color-white)] dark:[--checkbox-checked-border:var(--color-neutral-950)]/15",
        ],
        white:
          "[--checkbox-check:var(--color-neutral-900)] [--checkbox-checked-bg:var(--color-white)] [--checkbox-checked-border:var(--color-neutral-950)]/15",
        dark: "[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-neutral-900)] [--checkbox-checked-border:var(--color-neutral-950)]/90",
        zinc: "[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-neutral-400)] [--checkbox-checked-border:var(--color-neutral-700)]/90",
        red: "[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-red-600)] [--checkbox-checked-border:var(--color-red-700)]/90",
        orange:
          "[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-orange-500)] [--checkbox-checked-border:var(--color-orange-600)]/90",
        amber:
          "[--checkbox-check:var(--color-amber-950)] [--checkbox-checked-bg:var(--color-amber-400)] [--checkbox-checked-border:var(--color-amber-500)]/80",
        yellow:
          "[--checkbox-check:var(--color-yellow-950)] [--checkbox-checked-bg:var(--color-yellow-300)] [--checkbox-checked-border:var(--color-yellow-400)]/80",
        lime: "[--checkbox-check:var(--color-lime-950)] [--checkbox-checked-bg:var(--color-lime-300)] [--checkbox-checked-border:var(--color-lime-400)]/80",
        green:
          "[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-green-600)] [--checkbox-checked-border:var(--color-green-700)]/90",
        emerald:
          "[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-emerald-600)] [--checkbox-checked-border:var(--color-emerald-700)]/90",
        teal: "[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-teal-600)] [--checkbox-checked-border:var(--color-teal-700)]/90",
        cyan: "[--checkbox-check:var(--color-cyan-950)] [--checkbox-checked-bg:var(--color-cyan-300)] [--checkbox-checked-border:var(--color-cyan-400)]/80",
        sky: "[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-sky-500)] [--checkbox-checked-border:var(--color-sky-600)]/80",
        blue: "[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-orange-600)] [--checkbox-checked-border:var(--color-orange-700)]/90",
        indigo:
          "[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-indigo-500)] [--checkbox-checked-border:var(--color-indigo-600)]/90",
        violet:
          "[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-violet-500)] [--checkbox-checked-border:var(--color-violet-600)]/90",
        purple:
          "[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-purple-500)] [--checkbox-checked-border:var(--color-purple-600)]/90",
        fuchsia:
          "[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-fuchsia-500)] [--checkbox-checked-border:var(--color-fuchsia-600)]/90",
        pink: "[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-pink-500)] [--checkbox-checked-border:var(--color-pink-600)]/90",
        rose: "[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-rose-500)] [--checkbox-checked-border:var(--color-rose-600)]/90",
      },
      size: {
        sm: "size-3.5 sm:size-3",
        md: "size-4.5 sm:size-4",
      },
    },
    defaultVariants: {
      color: "dark/zinc",
      size: "md",
    },
  },
);

/**
 * Inner checkmark SVG size — scales with the Checkbox `size` variant.
 */
const checkIconVariants = cva(
  "stroke-(--checkbox-check) opacity-0 group-data-checked:opacity-100",
  {
    variants: {
      size: {
        sm: "size-3 sm:size-2.5",
        md: "size-4 sm:h-3.5 sm:w-3.5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type CheckboxColor = NonNullable<
  VariantProps<typeof checkboxVariants>["color"]
>;
export type CheckboxSize = NonNullable<
  VariantProps<typeof checkboxVariants>["size"]
>;

export function Checkbox({
  color,
  size,
  className,
  ...props
}: {
  color?: CheckboxColor;
  size?: CheckboxSize;
  className?: string;
} & Omit<Headless.CheckboxProps, "as" | "className">) {
  return (
    <Headless.Checkbox
      data-slot="control"
      {...props}
      className={cx("group inline-flex focus:outline-hidden", className)}
    >
      <span className={checkboxVariants({ color, size })}>
        <svg
          className={checkIconVariants({ size })}
          viewBox="0 0 14 14"
          fill="none"
        >
          {/* Checkmark icon */}
          <path
            className="opacity-100 group-data-indeterminate:opacity-0"
            d="M3 8L6 11L11 3.5"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Indeterminate icon */}
          <path
            className="opacity-0 group-data-indeterminate:opacity-100"
            d="M3 7H11"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Headless.Checkbox>
  );
}
