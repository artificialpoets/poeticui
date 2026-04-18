"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { createContext, useContext } from "react";

import { cx } from "../lib";

// ─── Variant system (CVA Pattern A) ──────────────────────────────────────

const calloutVariants = cva(
  // Base — structure that applies to every variant
  "rounded-xl border p-5",
  {
    variants: {
      variant: {
        neutral: "border-border bg-muted/40 text-foreground",
        info: "border-info/40 bg-info/10 text-info dark:border-info/40 dark:bg-info/20",
        success:
          "border-success/40 bg-success/10 text-success dark:border-success/40 dark:bg-success/20",
        warning:
          "border-warning/40 bg-warning/10 text-warning dark:border-warning/40 dark:bg-warning/20",
        destructive:
          "border-destructive/40 bg-destructive/10 text-destructive dark:border-destructive/40 dark:bg-destructive/20",
        primary:
          "border-primary/40 bg-primary/10 text-primary dark:border-primary/40 dark:bg-primary/20",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

type CalloutVariant = NonNullable<
  VariantProps<typeof calloutVariants>["variant"]
>;

// ─── Context (propagates variant to sub-components) ──────────────────────

type CalloutContextValue = { variant: CalloutVariant };
const CalloutContext = createContext<CalloutContextValue>({
  variant: "neutral",
});

function useCalloutVariant(): CalloutVariant {
  return useContext(CalloutContext).variant;
}

// ─── <Callout> ────────────────────────────────────────────────────────────

export interface CalloutProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof calloutVariants> {
  /** Optional icon slot — rendered at the top-left of the callout. */
  icon?: React.ComponentType<{ className?: string }>;
  /** Convenience for single-line callouts. Prefer `<CalloutTitle>` for anything richer. */
  title?: React.ReactNode;
}

/**
 * Callout — tinted banner for contextual messages.
 *
 * Replaces the hand-rolled `<div className="rounded-xl border border-{role}/40 bg-{role}/10 p-5 ...">`
 * pattern. Picks its tint from the `variant` prop (maps to the semantic
 * role tokens: `info`, `success`, `warning`, `destructive`, `primary`,
 * `neutral`).
 *
 * Slot family for richer layouts:
 *
 * ```tsx
 * <Callout variant="destructive" icon={AlertTriangle}>
 *   <CalloutTitle>What's blocking?</CalloutTitle>
 *   <CalloutDescription>Procurement is stalled on SOC-2 review.</CalloutDescription>
 * </Callout>
 * ```
 *
 * Quick single-line form:
 *
 * ```tsx
 * <Callout variant="info" title="Heads up: this is a preview environment." />
 * ```
 */
export function Callout({
  variant = "neutral",
  icon: Icon,
  title,
  className,
  children,
  ...props
}: CalloutProps) {
  const resolvedVariant: CalloutVariant = variant ?? "neutral";
  return (
    <CalloutContext.Provider value={{ variant: resolvedVariant }}>
      <div
        {...props}
        className={cx(calloutVariants({ variant: resolvedVariant }), className)}
        data-variant={resolvedVariant}
      >
        {(Icon || title) && (
          <div className="mb-2 flex items-center gap-2">
            {Icon && <Icon className="size-4 shrink-0" aria-hidden />}
            {title && <CalloutTitle>{title}</CalloutTitle>}
          </div>
        )}
        {children}
      </div>
    </CalloutContext.Provider>
  );
}

// ─── <CalloutTitle> ──────────────────────────────────────────────────────

export interface CalloutTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Semantic heading level. Default `h3`. */
  as?: "h2" | "h3" | "h4" | "h5" | "h6";
}

/**
 * CalloutTitle — semantic heading inside a Callout. Defaults to `<h3>`.
 * Inherits color from the parent Callout's variant.
 */
export function CalloutTitle({
  as = "h3",
  className,
  ...props
}: CalloutTitleProps) {
  const Tag = as;
  return (
    <Tag
      {...props}
      className={cx("text-sm font-semibold", className)}
      data-slot="callout-title"
    />
  );
}

// ─── <CalloutDescription> ────────────────────────────────────────────────

/**
 * CalloutDescription — muted body text inside a Callout. Keeps readable
 * contrast on any variant because it uses the foreground token, not the
 * variant color.
 */
export function CalloutDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      {...props}
      className={cx(
        "text-sm text-foreground/80 dark:text-foreground/85",
        className,
      )}
      data-slot="callout-description"
    />
  );
}

// Re-export context hook for consumers who want to build custom sub-slots.
export { useCalloutVariant, calloutVariants };
