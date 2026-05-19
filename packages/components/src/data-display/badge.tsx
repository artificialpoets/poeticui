import * as Headless from "@headlessui/react";
import { cva, type VariantProps } from "class-variance-authority";
import React, { forwardRef } from "react";

import { TouchTarget } from "../core/button";
import { Link } from "../core/link";
import { cx } from "../lib";

/**
 * Badge variants (Pattern A — single cva() call).
 *
 * Both `color` and `size` apply universally; there's no axis asymmetry like
 * Button has, so a single CVA block covers every valid combination.
 *
 * NOTE: most color presets still reference raw Tailwind palettes
 * (`bg-red-500/15`, `text-red-700`, etc.). Migrating each to semantic tokens
 * is tracked in DES-22 (Scrub raw color utilities from @poeticui/components) and is
 * intentionally out of scope for the CVA migration itself.
 */
export const badgeVariants = cva(
  [
    "inline-flex items-center gap-x-1.5 rounded-md font-medium forced-colors:outline",
  ],
  {
    variants: {
      color: {
        muted:
          "bg-muted text-muted-foreground group-data-hover:bg-accent group-data-hover:text-accent-foreground",
        foreground: "bg-foreground text-background group-data-hover:opacity-90",
        zinc: "bg-muted text-muted-foreground group-data-hover:bg-accent group-data-hover:text-accent-foreground",
        red: "bg-red-500/15 text-red-700 group-data-hover:bg-red-500/25 dark:bg-red-500/10 dark:text-red-400 dark:group-data-hover:bg-red-500/20",
        orange:
          "bg-orange-500/15 text-orange-700 group-data-hover:bg-orange-500/25 dark:bg-orange-500/10 dark:text-orange-400 dark:group-data-hover:bg-orange-500/20",
        amber:
          "bg-amber-400/20 text-amber-700 group-data-hover:bg-amber-400/30 dark:bg-amber-400/10 dark:text-amber-400 dark:group-data-hover:bg-amber-400/15",
        yellow:
          "bg-yellow-400/20 text-yellow-700 group-data-hover:bg-yellow-400/30 dark:bg-yellow-400/10 dark:text-yellow-300 dark:group-data-hover:bg-yellow-400/15",
        lime: "bg-lime-400/20 text-lime-700 group-data-hover:bg-lime-400/30 dark:bg-lime-400/10 dark:text-lime-300 dark:group-data-hover:bg-lime-400/15",
        green:
          "bg-green-500/15 text-green-700 group-data-hover:bg-green-500/25 dark:bg-green-500/10 dark:text-green-400 dark:group-data-hover:bg-green-500/20",
        emerald:
          "bg-emerald-500/15 text-emerald-700 group-data-hover:bg-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:group-data-hover:bg-emerald-500/20",
        teal: "bg-teal-500/15 text-teal-700 group-data-hover:bg-teal-500/25 dark:bg-teal-500/10 dark:text-teal-300 dark:group-data-hover:bg-teal-500/20",
        cyan: "bg-cyan-400/20 text-cyan-700 group-data-hover:bg-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-300 dark:group-data-hover:bg-cyan-400/15",
        sky: "bg-sky-500/15 text-sky-700 group-data-hover:bg-sky-500/25 dark:bg-sky-500/10 dark:text-sky-300 dark:group-data-hover:bg-sky-500/20",
        blue: "bg-blue-500/15 text-blue-700 group-data-hover:bg-blue-500/25 dark:bg-blue-500/10 dark:text-blue-400 dark:group-data-hover:bg-blue-500/20",
        indigo:
          "bg-indigo-500/15 text-indigo-700 group-data-hover:bg-indigo-500/25 dark:text-indigo-400 dark:group-data-hover:bg-indigo-500/20",
        violet:
          "bg-violet-500/15 text-violet-700 group-data-hover:bg-violet-500/25 dark:text-violet-400 dark:group-data-hover:bg-violet-500/20",
        purple:
          "bg-purple-500/15 text-purple-700 group-data-hover:bg-purple-500/25 dark:text-purple-400 dark:group-data-hover:bg-purple-500/20",
        fuchsia:
          "bg-fuchsia-400/15 text-fuchsia-700 group-data-hover:bg-fuchsia-400/25 dark:bg-fuchsia-400/10 dark:text-fuchsia-400 dark:group-data-hover:bg-fuchsia-400/20",
        pink: "bg-pink-400/15 text-pink-700 group-data-hover:bg-pink-400/25 dark:bg-pink-400/10 dark:text-pink-400 dark:group-data-hover:bg-pink-400/20",
        rose: "bg-rose-400/15 text-rose-700 group-data-hover:bg-rose-400/25 dark:bg-rose-400/10 dark:text-rose-400 dark:group-data-hover:bg-rose-400/20",
      },
      size: {
        sm: "px-1 py-px text-xs",
        md: "px-1.5 py-0.5 text-sm/5 sm:text-xs/5",
      },
    },
    defaultVariants: {
      color: "zinc",
      size: "md",
    },
  },
);

export type BadgeColor = NonNullable<
  VariantProps<typeof badgeVariants>["color"]
>;
export type BadgeSize = NonNullable<VariantProps<typeof badgeVariants>["size"]>;

type BadgeVariantProps = {
  color?: BadgeColor;
  size?: BadgeSize;
};

/**
 * Status chip / count indicator / label tag. Eighteen color presets covering
 * neutral + every Tailwind hue. Two sizes (`sm`, `md`).
 *
 * @example
 * <Badge color="green">active</Badge>
 *
 * @example
 * <Badge color="red" size="sm">3</Badge>
 */
export function Badge({
  color,
  size,
  className,
  ...props
}: BadgeVariantProps & React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      data-component="badge"
      {...props}
      className={cx(badgeVariants({ color, size }), className)}
    />
  );
}

/**
 * Clickable / linkable {@link Badge}. Use for chips that filter, navigate,
 * or trigger an action. Renders `<a>` when `href` is present, else `<button>`.
 *
 * @example
 * <BadgeButton color="blue" onClick={() => alert("clicked")}>
 *   filter
 * </BadgeButton>
 *
 * @example
 * <BadgeButton color="zinc" href="/customers/123">View</BadgeButton>
 */
export const BadgeButton = forwardRef(function BadgeButton(
  {
    color,
    size,
    className,
    children,
    ...props
  }: BadgeVariantProps & { className?: string; children: React.ReactNode } & (
      | ({ href?: never } & Omit<Headless.ButtonProps, "as" | "className">)
      | ({ href: string } & Omit<
          React.ComponentPropsWithoutRef<typeof Link>,
          "className"
        >)
    ),
  ref: React.ForwardedRef<HTMLElement>,
) {
  const classes = cx(
    "group relative inline-flex rounded-md focus:outline-hidden data-focus:ring-2 data-focus:ring-ring data-focus:ring-offset-2 data-focus:ring-offset-background",
    className,
  );

  return typeof props.href === "string" ? (
    <Link
      data-component="badge-button"
      {...props}
      className={classes}
      ref={ref as React.ForwardedRef<HTMLAnchorElement>}
    >
      <TouchTarget>
        <Badge color={color} size={size}>
          {children}
        </Badge>
      </TouchTarget>
    </Link>
  ) : (
    <Headless.Button
      data-component="badge-button"
      {...props}
      className={classes}
      ref={ref}
    >
      <TouchTarget>
        <Badge color={color} size={size}>
          {children}
        </Badge>
      </TouchTarget>
    </Headless.Button>
  );
});
