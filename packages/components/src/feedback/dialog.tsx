"use client";

import * as Headless from "@headlessui/react";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { Text } from "../data-display/text";
import { cx } from "../lib";

/**
 * Dialog — modal overlay with two visual variants.
 *
 * - `variant="default"` (the default) renders as a bottom-sheet style modal
 *   on mobile (slides up, rounded top) and a centered card on desktop.
 * - `variant="alert"` renders as a fully centered card, tighter spacing, and
 *   center-aligned title + description on mobile. Replaces the old Alert
 *   component (still exported as a deprecated alias from `./alert`).
 *
 * Sub-components (`DialogTitle`, `DialogDescription`, `DialogBody`,
 * `DialogActions`) pick up the parent's variant via React context and adapt
 * their spacing + alignment accordingly — no need to pass `variant` to each.
 */

export type DialogVariant = "default" | "alert";
export type DialogSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl";

const DialogVariantContext = React.createContext<DialogVariant>("default");

const containerVariants = cva(
  "grid min-h-full justify-items-center sm:grid-rows-[1fr_auto_3fr] sm:p-4",
  {
    variants: {
      variant: {
        default: "grid-rows-[1fr_auto]",
        alert: "grid-rows-[1fr_auto_1fr] p-8",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const panelVariants = cva("modal-panel row-start-2 w-full min-w-0", {
  variants: {
    variant: {
      default:
        "rounded-t-3xl p-8 sm:mb-auto sm:rounded-2xl data-closed:translate-y-12 sm:data-closed:translate-y-0 sm:data-closed:data-enter:scale-95",
      alert: "p-8 sm:p-6 data-closed:data-enter:scale-95",
    },
    size: {
      xs: "sm:max-w-xs",
      sm: "sm:max-w-sm",
      md: "sm:max-w-md",
      lg: "sm:max-w-lg",
      xl: "sm:max-w-xl",
      "2xl": "sm:max-w-2xl",
      "3xl": "sm:max-w-3xl",
      "4xl": "sm:max-w-4xl",
      "5xl": "sm:max-w-5xl",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "lg",
  },
});

export type DialogPanelVariants = VariantProps<typeof panelVariants>;

type DialogProps = {
  /** Visual variant. `default` = bottom-sheet modal; `alert` = centered compact card. */
  variant?: DialogVariant;
  /** Max-width of the panel. Defaults to `lg` for `default` and `md` for `alert`. */
  size?: DialogSize;
  className?: string;
  children: React.ReactNode;
} & Omit<Headless.DialogProps, "as" | "className">;

export function Dialog({
  variant = "default",
  size,
  className,
  children,
  ...props
}: DialogProps) {
  // Match the old Alert default (md) when variant is 'alert' and no size is set.
  const resolvedSize: DialogSize = size ?? (variant === "alert" ? "md" : "lg");

  return (
    <DialogVariantContext.Provider value={variant}>
      <Headless.Dialog {...props}>
        <Headless.DialogBackdrop transition className="modal-backdrop" />

        <div className="fixed inset-0 w-screen overflow-y-auto pt-6 sm:pt-0">
          <div className={containerVariants({ variant })}>
            <Headless.DialogPanel
              transition
              className={cx(
                panelVariants({ variant, size: resolvedSize }),
                className,
              )}
            >
              {children}
            </Headless.DialogPanel>
          </div>
        </div>
      </Headless.Dialog>
    </DialogVariantContext.Provider>
  );
}

// ── Sub-components (variant-aware via context) ───────────────────────────────

const titleVariants = cva("font-semibold text-balance text-foreground", {
  variants: {
    variant: {
      default: "text-lg/6 sm:text-base/6",
      alert: "text-center text-base/6 sm:text-left sm:text-sm/6 sm:text-wrap",
    },
  },
  defaultVariants: { variant: "default" },
});

export function DialogTitle({
  className,
  ...props
}: { className?: string } & Omit<
  Headless.DialogTitleProps,
  "as" | "className"
>) {
  const variant = React.useContext(DialogVariantContext);
  return (
    <Headless.DialogTitle
      {...props}
      className={cx(titleVariants({ variant }), className)}
    />
  );
}

const descriptionVariants = cva("mt-2 text-pretty", {
  variants: {
    variant: {
      default: "",
      alert: "text-center sm:text-left",
    },
  },
  defaultVariants: { variant: "default" },
});

export function DialogDescription({
  className,
  ...props
}: { className?: string } & Omit<
  Headless.DescriptionProps<typeof Text>,
  "as" | "className"
>) {
  const variant = React.useContext(DialogVariantContext);
  return (
    <Headless.Description
      as={Text}
      {...props}
      className={cx(descriptionVariants({ variant }), className)}
    />
  );
}

const bodyVariants = cva("", {
  variants: {
    variant: {
      default: "mt-6",
      alert: "mt-4",
    },
  },
  defaultVariants: { variant: "default" },
});

export function DialogBody({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const variant = React.useContext(DialogVariantContext);
  return (
    <div {...props} className={cx(bodyVariants({ variant }), className)} />
  );
}

const actionsVariants = cva(
  "flex flex-col-reverse items-center justify-end gap-3 *:w-full sm:flex-row sm:*:w-auto",
  {
    variants: {
      variant: {
        default: "mt-8",
        alert: "mt-6 sm:mt-4",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function DialogActions({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const variant = React.useContext(DialogVariantContext);
  return (
    <div {...props} className={cx(actionsVariants({ variant }), className)} />
  );
}
