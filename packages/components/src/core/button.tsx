import * as Headless from "@headlessui/react";
import { cva, type VariantProps } from "class-variance-authority";
import React, { forwardRef } from "react";

import { cx } from "../lib";
import { Link } from "./link";

/**
 * Button variants, built with CVA.
 *
 * The base styles + (variant, size) combinations are managed by CVA. Color
 * presets live in a separate `buttonColors` object because color is ONLY
 * meaningful when `variant === 'solid'` — the `outline` and `plain` variants
 * don't consume the color-driven `--btn-*` custom properties.
 *
 * Color is applied conditionally in the component below so outline/plain
 * don't accidentally pick up solid-only color classes.
 */
export const buttonVariants = cva(
  // Base — always applied
  [
    "relative isolate inline-flex items-baseline justify-center gap-x-2 rounded-lg border font-semibold",
    // Focus
    "focus:outline-hidden data-focus:ring-2 data-focus:ring-ring data-focus:ring-offset-2 data-focus:ring-offset-background",
    // Disabled
    "data-disabled:opacity-50",
    // Icon slot
    "*:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:my-0.5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:self-center *:data-[slot=icon]:text-(--btn-icon) forced-colors:[--btn-icon:ButtonText] forced-colors:data-hover:[--btn-icon:ButtonText]",
  ],
  {
    variants: {
      variant: {
        solid: [
          // Optical border, implemented as the button background to avoid corner artifacts
          "border-transparent bg-(--btn-border)",
          // Dark mode: border is rendered on `after`, background goes on control
          "dark:bg-(--btn-bg)",
          // Background layer for light mode + drop shadow
          "before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-lg)-1px)] before:bg-(--btn-bg) before:shadow-sm",
          // Dark mode: hide background layer, subtle white outline
          "dark:before:hidden dark:border-white/5",
          // Overlay layer for hover + inner highlight
          "after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-lg)-1px)]",
          "after:shadow-[inset_0_1px_--theme(--color-white/15%)]",
          "data-active:after:bg-(--btn-hover-overlay) data-hover:after:bg-(--btn-hover-overlay)",
          "dark:after:-inset-px dark:after:rounded-lg",
          // Disabled
          "data-disabled:before:shadow-none data-disabled:after:shadow-none",
        ],
        outline: [
          "border-border text-foreground data-active:bg-muted data-hover:bg-muted",
          "[--btn-bg:transparent] [--btn-icon:var(--muted-foreground)] data-active:[--btn-icon:var(--foreground)] data-hover:[--btn-icon:var(--foreground)]",
        ],
        plain: [
          "border-transparent text-foreground data-active:bg-muted data-hover:bg-muted",
          "[--btn-icon:var(--muted-foreground)] data-active:[--btn-icon:var(--foreground)] data-hover:[--btn-icon:var(--foreground)]",
        ],
      },
      size: {
        sm: [
          "px-[calc(--spacing(2.5)-1px)] py-[calc(--spacing(1.5)-1px)] text-xs sm:px-[calc(--spacing(2)-1px)] sm:py-[calc(--spacing(1)-1px)] sm:text-xs",
          "*:data-[slot=icon]:size-4 sm:*:data-[slot=icon]:size-3.5",
        ],
        md: [
          "px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] text-base/6 sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)] sm:text-sm/6",
          "*:data-[slot=icon]:size-5 sm:*:data-[slot=icon]:my-1 sm:*:data-[slot=icon]:size-4",
        ],
        lg: [
          "px-[calc(--spacing(5)-1px)] py-[calc(--spacing(3)-1px)] text-lg sm:px-[calc(--spacing(4)-1px)] sm:py-[calc(--spacing(2)-1px)] sm:text-base",
          "*:data-[slot=icon]:size-6 sm:*:data-[slot=icon]:size-5",
        ],
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  },
);

/**
 * Color presets — applied only when `variant === 'solid'`.
 *
 * Each preset sets the four CSS custom properties consumed by the `solid`
 * variant: `--btn-bg`, `--btn-border`, `--btn-hover-overlay`, `--btn-icon`.
 *
 * NOTE: these still contain raw-color utility classes. Migrating each to
 * semantic tokens is tracked in DES-22 (Scrub raw color utilities from @poeticui/components)
 * and is intentionally out of scope for the CVA migration itself.
 */
const buttonColors = {
  "dark/zinc": [
    "text-white [--btn-bg:var(--color-neutral-900)] [--btn-border:var(--color-neutral-950)]/90 [--btn-hover-overlay:var(--color-white)]/10",
    "dark:text-white dark:[--btn-bg:var(--color-neutral-400)] dark:[--btn-hover-overlay:var(--color-white)]/5",
    "[--btn-icon:var(--color-neutral-600)] data-active:[--btn-icon:var(--color-neutral-700)] data-hover:[--btn-icon:var(--color-neutral-700)]",
  ],
  light: [
    "text-neutral-950 [--btn-bg:white] [--btn-border:var(--color-neutral-950)]/10 [--btn-hover-overlay:var(--color-neutral-950)]/2.5 data-active:[--btn-border:var(--color-neutral-950)]/15 data-hover:[--btn-border:var(--color-neutral-950)]/15",
    "dark:text-white dark:[--btn-hover-overlay:var(--color-white)]/5 dark:[--btn-bg:var(--color-neutral-800)]",
    "[--btn-icon:var(--color-neutral-500)] data-active:[--btn-icon:var(--color-neutral-700)] data-hover:[--btn-icon:var(--color-neutral-700)] dark:[--btn-icon:var(--color-neutral-500)] dark:data-active:[--btn-icon:var(--color-neutral-600)] dark:data-hover:[--btn-icon:var(--color-neutral-600)]",
  ],
  "dark/white": [
    "text-white [--btn-bg:var(--color-neutral-900)] [--btn-border:var(--color-neutral-950)]/90 [--btn-hover-overlay:var(--color-white)]/10",
    "dark:text-neutral-950 dark:[--btn-bg:white] dark:[--btn-hover-overlay:var(--color-neutral-950)]/5",
    "[--btn-icon:var(--color-neutral-600)] data-active:[--btn-icon:var(--color-neutral-700)] data-hover:[--btn-icon:var(--color-neutral-700)] dark:[--btn-icon:var(--color-neutral-500)] dark:data-active:[--btn-icon:var(--color-neutral-600)] dark:data-hover:[--btn-icon:var(--color-neutral-600)]",
  ],
  dark: [
    "text-white [--btn-bg:var(--color-neutral-900)] [--btn-border:var(--color-neutral-950)]/90 [--btn-hover-overlay:var(--color-white)]/10",
    "dark:[--btn-hover-overlay:var(--color-white)]/5 dark:[--btn-bg:var(--color-neutral-800)]",
    "[--btn-icon:var(--color-neutral-600)] data-active:[--btn-icon:var(--color-neutral-700)] data-hover:[--btn-icon:var(--color-neutral-700)]",
  ],
  white: [
    "text-neutral-950 [--btn-bg:white] [--btn-border:var(--color-neutral-950)]/10 [--btn-hover-overlay:var(--color-neutral-950)]/2.5 data-active:[--btn-border:var(--color-neutral-950)]/15 data-hover:[--btn-border:var(--color-neutral-950)]/15",
    "dark:[--btn-hover-overlay:var(--color-neutral-950)]/5",
    "[--btn-icon:var(--color-neutral-600)] data-active:[--btn-icon:var(--color-neutral-500)] data-hover:[--btn-icon:var(--color-neutral-500)]",
  ],
  zinc: [
    "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-neutral-400)] [--btn-border:var(--color-neutral-700)]/90",
    "dark:[--btn-hover-overlay:var(--color-white)]/5",
    "[--btn-icon:var(--color-neutral-600)] data-active:[--btn-icon:var(--color-neutral-700)] data-hover:[--btn-icon:var(--color-neutral-700)]",
  ],
  indigo: [
    "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-indigo-500)] [--btn-border:var(--color-indigo-600)]/90",
    "[--btn-icon:var(--color-indigo-300)] data-active:[--btn-icon:var(--color-indigo-200)] data-hover:[--btn-icon:var(--color-indigo-200)]",
  ],
  cyan: [
    "text-cyan-950 [--btn-bg:var(--color-cyan-300)] [--btn-border:var(--color-cyan-400)]/80 [--btn-hover-overlay:var(--color-white)]/25",
    "[--btn-icon:var(--color-cyan-500)]",
  ],
  red: [
    "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-red-600)] [--btn-border:var(--color-red-700)]/90",
    "[--btn-icon:var(--color-red-300)] data-active:[--btn-icon:var(--color-red-200)] data-hover:[--btn-icon:var(--color-red-200)]",
  ],
  orange: [
    "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-orange-500)] [--btn-border:var(--color-orange-600)]/90",
    "[--btn-icon:var(--color-orange-300)] data-active:[--btn-icon:var(--color-orange-200)] data-hover:[--btn-icon:var(--color-orange-200)]",
  ],
  amber: [
    "text-amber-950 [--btn-hover-overlay:var(--color-white)]/25 [--btn-bg:var(--color-amber-400)] [--btn-border:var(--color-amber-500)]/80",
    "[--btn-icon:var(--color-amber-600)]",
  ],
  yellow: [
    "text-yellow-950 [--btn-hover-overlay:var(--color-white)]/25 [--btn-bg:var(--color-yellow-300)] [--btn-border:var(--color-yellow-400)]/80",
    "[--btn-icon:var(--color-yellow-600)] data-active:[--btn-icon:var(--color-yellow-700)] data-hover:[--btn-icon:var(--color-yellow-700)]",
  ],
  lime: [
    "text-lime-950 [--btn-hover-overlay:var(--color-white)]/25 [--btn-bg:var(--color-lime-300)] [--btn-border:var(--color-lime-400)]/80",
    "[--btn-icon:var(--color-lime-600)] data-active:[--btn-icon:var(--color-lime-700)] data-hover:[--btn-icon:var(--color-lime-700)]",
  ],
  green: [
    "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-green-600)] [--btn-border:var(--color-green-700)]/90",
    "[--btn-icon:var(--color-white)]/60 data-active:[--btn-icon:var(--color-white)]/80 data-hover:[--btn-icon:var(--color-white)]/80",
  ],
  emerald: [
    "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-emerald-600)] [--btn-border:var(--color-emerald-700)]/90",
    "[--btn-icon:var(--color-white)]/60 data-active:[--btn-icon:var(--color-white)]/80 data-hover:[--btn-icon:var(--color-white)]/80",
  ],
  teal: [
    "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-teal-600)] [--btn-border:var(--color-teal-700)]/90",
    "[--btn-icon:var(--color-white)]/60 data-active:[--btn-icon:var(--color-white)]/80 data-hover:[--btn-icon:var(--color-white)]/80",
  ],
  sky: [
    "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-sky-500)] [--btn-border:var(--color-sky-600)]/80",
    "[--btn-icon:var(--color-white)]/60 data-active:[--btn-icon:var(--color-white)]/80 data-hover:[--btn-icon:var(--color-white)]/80",
  ],
  blue: [
    "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-orange-600)] [--btn-border:var(--color-orange-700)]/90",
    "[--btn-icon:var(--color-orange-400)] data-active:[--btn-icon:var(--color-orange-300)] data-hover:[--btn-icon:var(--color-orange-300)]",
  ],
  violet: [
    "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-violet-500)] [--btn-border:var(--color-violet-600)]/90",
    "[--btn-icon:var(--color-violet-300)] data-active:[--btn-icon:var(--color-violet-200)] data-hover:[--btn-icon:var(--color-violet-200)]",
  ],
  purple: [
    "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-purple-500)] [--btn-border:var(--color-purple-600)]/90",
    "[--btn-icon:var(--color-purple-300)] data-active:[--btn-icon:var(--color-purple-200)] data-hover:[--btn-icon:var(--color-purple-200)]",
  ],
  fuchsia: [
    "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-fuchsia-500)] [--btn-border:var(--color-fuchsia-600)]/90",
    "[--btn-icon:var(--color-fuchsia-300)] data-active:[--btn-icon:var(--color-fuchsia-200)] data-hover:[--btn-icon:var(--color-fuchsia-200)]",
  ],
  pink: [
    "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-pink-500)] [--btn-border:var(--color-pink-600)]/90",
    "[--btn-icon:var(--color-pink-300)] data-active:[--btn-icon:var(--color-pink-200)] data-hover:[--btn-icon:var(--color-pink-200)]",
  ],
  rose: [
    "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-rose-500)] [--btn-border:var(--color-rose-600)]/90",
    "[--btn-icon:var(--color-rose-300)] data-active:[--btn-icon:var(--color-rose-200)] data-hover:[--btn-icon:var(--color-rose-200)]",
  ],
} as const;

export type ButtonColor = keyof typeof buttonColors;
export type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>["variant"]
>;
export type ButtonSize = NonNullable<
  VariantProps<typeof buttonVariants>["size"]
>;

/**
 * Resolve the variant from the new `variant` prop OR the legacy `outline` /
 * `plain` boolean props. The new prop wins if both are provided.
 */
function resolveVariant(
  variant: ButtonVariant | undefined,
  outline: boolean | undefined,
  plain: boolean | undefined,
): ButtonVariant {
  if (variant) return variant;
  if (outline) return "outline";
  if (plain) return "plain";
  return "solid";
}

type BaseButtonProps = {
  /**
   * Visual variant. Prefer this over the legacy `outline` / `plain` booleans.
   */
  variant?: ButtonVariant;
  /**
   * Color preset. Only applied when `variant` resolves to `"solid"`.
   * @default "dark/zinc"
   */
  color?: ButtonColor;
  /**
   * Size. Defaults to `"md"` to match the legacy default.
   * @default "md"
   */
  size?: ButtonSize;
  /**
   * @deprecated Use `variant="outline"` instead.
   */
  outline?: boolean;
  /**
   * @deprecated Use `variant="plain"` instead.
   */
  plain?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = BaseButtonProps &
  (
    | ({ href?: never } & Omit<Headless.ButtonProps, "as" | "className">)
    | ({ href: string } & Omit<
        React.ComponentPropsWithoutRef<typeof Link>,
        "className"
      >)
  );

export const Button = forwardRef(function Button(
  {
    variant,
    color,
    size,
    outline,
    plain,
    className,
    children,
    ...props
  }: ButtonProps,
  ref: React.ForwardedRef<HTMLElement>,
) {
  const resolvedVariant = resolveVariant(variant, outline, plain);

  const classes = cx(
    buttonVariants({ variant: resolvedVariant, size }),
    // Color presets only apply to the solid variant — outline/plain have
    // their own text/icon colors baked in via semantic tokens.
    resolvedVariant === "solid" ? buttonColors[color ?? "dark/zinc"] : null,
    className,
  );

  return typeof props.href === "string" ? (
    <Link
      {...props}
      className={classes}
      ref={ref as React.ForwardedRef<HTMLAnchorElement>}
    >
      <TouchTarget>{children}</TouchTarget>
    </Link>
  ) : (
    <Headless.Button
      {...props}
      className={cx(classes, "cursor-default")}
      ref={ref}
    >
      <TouchTarget>{children}</TouchTarget>
    </Headless.Button>
  );
});

/**
 * Expand the hit area to at least 44x44px on touch devices.
 */
export function TouchTarget({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span
        className="absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden"
        aria-hidden="true"
      />
      {children}
    </>
  );
}
