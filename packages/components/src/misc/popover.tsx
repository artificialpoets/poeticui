"use client";

import * as Headless from "@headlessui/react";
import type React from "react";

import { Button } from "../core/button";
import { cx } from "../lib";

/**
 * Popover — floating panel anchored to a trigger button.
 *
 * Mirrors the Dropdown family pattern (same `anchor` semantics, same glass-blur
 * panel styling) but displays arbitrary content rather than a menu of items.
 * Reach for this when you need a tooltip-style hover card, a filter form, a
 * settings flyout, or any other "click a button → show a panel" UX that isn't
 * a menu.
 *
 * ```tsx
 * <Popover>
 *   <PopoverButton>Open filters</PopoverButton>
 *   <PopoverPanel anchor="bottom start">
 *     <MyFilterForm />
 *   </PopoverPanel>
 * </Popover>
 * ```
 */

export function Popover(props: Headless.PopoverProps) {
  return <Headless.Popover {...props} />;
}

export function PopoverButton<T extends React.ElementType = typeof Button>({
  as = Button,
  ...props
}: { className?: string } & Omit<Headless.PopoverButtonProps<T>, "className">) {
  return <Headless.PopoverButton as={as} {...props} />;
}

export function PopoverPanel({
  anchor = "bottom",
  className,
  ...props
}: { className?: string } & Omit<
  Headless.PopoverPanelProps,
  "as" | "className"
>) {
  return (
    <Headless.PopoverPanel
      {...props}
      transition
      anchor={anchor}
      className={cx(
        // Anchor positioning — matches Dropdown conventions
        "[--anchor-gap:--spacing(2)] [--anchor-padding:--spacing(1)] data-[anchor~=end]:[--anchor-offset:6px] data-[anchor~=start]:[--anchor-offset:-6px] sm:data-[anchor~=end]:[--anchor-offset:4px] sm:data-[anchor~=start]:[--anchor-offset:-4px]",
        // Base styles
        "isolate w-max rounded-xl p-3",
        // Invisible border for forced-colors accessibility
        "outline outline-transparent focus:outline-hidden",
        // Handle scrolling when panel won't fit in viewport
        "overflow-y-auto",
        // Popover background
        "bg-popover/90 text-popover-foreground backdrop-blur-xl",
        // Shadows + subtle border
        "shadow-lg ring-1 ring-border dark:ring-inset",
        // Transitions
        "transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0",
        className,
      )}
    />
  );
}
