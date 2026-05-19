import * as Headless from "@headlessui/react";
import NextLink, { type LinkProps } from "next/link";
import React, { forwardRef } from "react";

/**
 * Anchor element wrapped by HeadlessUI's `DataInteractive` so it picks up
 * `data-active` / `data-hover` / `data-focus` for state-driven styling.
 * Currently delegates to `next/link`; decoupling from `next/*` is tracked
 * in DES-49.
 *
 * @example
 * <Link href="/docs">Read the docs</Link>
 */
export const Link = forwardRef(function Link(
  props: LinkProps & React.ComponentPropsWithoutRef<"a">,
  ref: React.ForwardedRef<HTMLAnchorElement>,
) {
  return (
    <Headless.DataInteractive>
      <NextLink data-component="link" {...props} ref={ref} />
    </Headless.DataInteractive>
  );
});
