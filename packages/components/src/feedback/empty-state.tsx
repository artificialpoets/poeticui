"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { cx } from "../lib";

// ─── Variant system ───────────────────────────────────────────────────────

const emptyStateVariants = cva(
  "flex flex-col items-center justify-center text-center",
  {
    variants: {
      size: {
        sm: "gap-2 py-8",
        md: "gap-3 py-12",
        lg: "gap-4 py-20",
      },
      bordered: {
        true: "rounded-xl border border-dashed border-border",
        false: "",
      },
    },
    defaultVariants: { size: "md", bordered: false },
  },
);

const iconSizeClasses = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
} as const;

const iconInnerSizeClasses = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
} as const;

const titleSizeClasses = {
  sm: "text-sm font-medium text-foreground",
  md: "text-base font-semibold text-foreground",
  lg: "text-lg font-semibold text-foreground",
} as const;

// ─── Types ────────────────────────────────────────────────────────────────

export interface EmptyStateProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof emptyStateVariants> {
  /** Optional icon rendered in a muted circle above the title. */
  icon?: React.ComponentType<{ className?: string }>;
  /** Primary headline. Required. */
  title: React.ReactNode;
  /** Optional muted explanation beneath the title. */
  description?: React.ReactNode;
  /** Optional action — typically a `<Button>` — rendered below description. */
  action?: React.ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────

/**
 * EmptyState — general-purpose "no data" placeholder.
 *
 * Use when a list, section, or page has no content to show. For table-
 * specific empty rows, prefer `<DataTableEmptyState>` in `@poeticui/
 * components/tables` which spans the table cell correctly.
 *
 * ```tsx
 * // Minimal
 * <EmptyState title="No results" />
 *
 * // Full shape
 * <EmptyState
 *   icon={Inbox}
 *   title="No sites yet"
 *   description="Connect your first site to get started."
 *   action={<Button href="/sites/new">Add a site</Button>}
 * />
 *
 * // With dashed-border card chrome
 * <EmptyState bordered size="lg" title="All caught up" icon={CheckCircle2} />
 * ```
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  size = "md",
  bordered,
  className,
  ...props
}: EmptyStateProps) {
  const resolvedSize = size ?? "md";
  return (
    <div
      {...props}
      className={cx(
        emptyStateVariants({ size: resolvedSize, bordered }),
        className,
      )}
      data-slot="empty-state"
      role="status"
    >
      {Icon && (
        <div
          className={cx(
            "flex items-center justify-center rounded-full bg-muted text-muted-foreground",
            iconSizeClasses[resolvedSize],
          )}
          aria-hidden
        >
          <Icon className={iconInnerSizeClasses[resolvedSize]} />
        </div>
      )}
      <div className={titleSizeClasses[resolvedSize]}>{title}</div>
      {description && (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

export { emptyStateVariants };
