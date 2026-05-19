import * as Headless from "@headlessui/react";
import React, { forwardRef } from "react";

import { cx } from "../lib";

/**
 * Multi-line text input. Same chrome as {@link Input} (border, focus ring,
 * data-state attributes). `resizable` (default `true`) toggles vertical resize.
 *
 * @example
 * <Textarea name="bio" placeholder="Tell us about yourself" rows={4} />
 *
 * @example
 * <Textarea name="comment" resizable={false} />
 */
export const Textarea = forwardRef(function Textarea(
  {
    className,
    resizable = true,
    ...props
  }: { className?: string; resizable?: boolean } & Omit<
    Headless.TextareaProps,
    "as" | "className"
  >,
  ref: React.ForwardedRef<HTMLTextAreaElement>,
) {
  return (
    <span
      data-component="textarea"
      data-slot="control"
      className={cx(
        className,
        // Basic layout
        "relative block w-full",
        // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
        "before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:bg-card before:shadow-sm",
        // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
        "dark:before:hidden",
        // Focus ring
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-transparent after:ring-inset sm:focus-within:after:ring-2 sm:focus-within:after:ring-ring",
        // Disabled state
        "has-data-disabled:opacity-50 has-data-disabled:before:bg-muted has-data-disabled:before:shadow-none",
      )}
    >
      <Headless.Textarea
        ref={ref}
        {...props}
        className={cx(
          // Basic layout
          "relative block h-full w-full appearance-none rounded-lg px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)]",
          // Typography
          "text-base/6 text-foreground placeholder:text-muted-foreground sm:text-sm/6",
          // Border
          "border border-border data-hover:border-muted-foreground/40",
          // Background color
          "bg-transparent dark:bg-muted/30",
          // Hide default focus styles
          "focus:outline-hidden",
          // Invalid state
          "data-invalid:border-destructive data-invalid:data-hover:border-destructive",
          // Disabled state
          "disabled:border-muted-foreground/30 disabled:bg-muted/20",
          // Resizable
          resizable ? "resize-y" : "resize-none",
        )}
      />
    </span>
  );
});
