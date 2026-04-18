"use client";

import * as Headless from "@headlessui/react";
import { LayoutGroup, motion } from "motion/react";
import React, { forwardRef, useId } from "react";

import { TouchTarget } from "../core/button";
import { Link } from "../core/link";
import { cx } from "../lib";

export function Navbar({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"nav">) {
  return (
    <nav
      {...props}
      className={cx("flex flex-1 items-center gap-4 py-2.5", className)}
    />
  );
}

export function NavbarDivider({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      aria-hidden="true"
      {...props}
      className={cx("h-6 w-px bg-border", className)}
    />
  );
}

export function NavbarSection({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const id = useId();

  return (
    <LayoutGroup id={id}>
      <div {...props} className={cx("flex items-center gap-3", className)} />
    </LayoutGroup>
  );
}

export function NavbarSpacer({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      aria-hidden="true"
      {...props}
      className={cx("-ml-4 flex-1", className)}
    />
  );
}

export const NavbarItem = forwardRef(function NavbarItem(
  {
    current,
    className,
    children,
    ...props
  }: { current?: boolean; className?: string; children: React.ReactNode } & (
    | ({ href?: never } & Omit<Headless.ButtonProps, "as" | "className">)
    | ({ href: string } & Omit<
        React.ComponentPropsWithoutRef<typeof Link>,
        "className"
      >)
  ),
  ref: React.ForwardedRef<HTMLAnchorElement | HTMLButtonElement>,
) {
  const classes = cx(
    // Base
    "relative flex min-w-0 items-center gap-3 rounded-lg p-2 text-left text-base/6 font-medium text-foreground sm:text-sm/5",
    // Leading icon/icon-only
    "*:data-[slot=icon]:size-6 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:text-muted-foreground sm:*:data-[slot=icon]:size-5",
    // Trailing icon (down chevron or similar)
    "*:not-nth-2:last:data-[slot=icon]:ml-auto *:not-nth-2:last:data-[slot=icon]:size-5 sm:*:not-nth-2:last:data-[slot=icon]:size-4",
    // Avatar
    "*:data-[slot=avatar]:-m-0.5 *:data-[slot=avatar]:size-7 *:data-[slot=avatar]:[--avatar-radius:var(--radius-md)] sm:*:data-[slot=avatar]:size-6",
    // Hover
    "data-hover:bg-muted data-hover:*:data-[slot=icon]:text-foreground",
    // Active
    "data-active:bg-muted data-active:*:data-[slot=icon]:text-foreground",
  );

  return (
    <span className={cx("relative", className)}>
      {current && (
        <motion.span
          layoutId="current-indicator"
          className="absolute inset-x-2 -bottom-2.5 h-0.5 rounded-full bg-foreground"
        />
      )}
      {typeof props.href === "string" ? (
        <Link
          {...props}
          className={classes}
          data-current={current ? "true" : undefined}
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
        >
          <TouchTarget>{children}</TouchTarget>
        </Link>
      ) : (
        <Headless.Button
          {...props}
          className={cx("cursor-default", classes)}
          data-current={current ? "true" : undefined}
          ref={ref}
        >
          <TouchTarget>{children}</TouchTarget>
        </Headless.Button>
      )}
    </span>
  );
});

export function NavbarLabel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"span">) {
  return <span {...props} className={cx("truncate", className)} />;
}
