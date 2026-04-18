"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { TrendingDown, TrendingUp } from "lucide-react";

import { cx } from "../lib";
import { Badge } from "./badge";

// ─── Variant system ───────────────────────────────────────────────────────

const statVariants = cva("flex flex-col", {
  variants: {
    size: {
      sm: "gap-1",
      md: "gap-1.5",
      lg: "gap-2",
    },
    bordered: {
      true: "rounded-xl border border-border bg-card p-4",
      false: "",
    },
  },
  defaultVariants: { size: "md", bordered: false },
});

const valueSizeClasses = {
  sm: "text-base font-semibold tracking-tight text-foreground",
  md: "text-2xl font-bold tracking-tight text-foreground",
  lg: "text-3xl font-bold tracking-tight text-foreground",
} as const;

const iconSizeClasses = {
  sm: "size-7 rounded-md",
  md: "size-9 rounded-lg",
  lg: "size-11 rounded-xl",
} as const;

const iconInnerSizeClasses = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
} as const;

// Map iconVariant → background + text tokens
const iconVariantClasses = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
  neutral: "bg-muted text-muted-foreground",
  "chart-1": "bg-chart-1/10 text-chart-1",
  "chart-2": "bg-chart-2/10 text-chart-2",
  "chart-3": "bg-chart-3/10 text-chart-3",
} as const;

type IconVariant = keyof typeof iconVariantClasses;

// ─── Types ────────────────────────────────────────────────────────────────

export interface StatProps extends VariantProps<typeof statVariants> {
  /** Short label above the value (e.g. "Monthly visitors"). */
  label: React.ReactNode;
  /** The big value itself — number, formatted string, or arbitrary node. */
  value: React.ReactNode;
  /** Optional lucide-style icon rendered in a tinted square. */
  icon?: React.ComponentType<{ className?: string }>;
  /** Icon background tint. Defaults to `primary`. */
  iconVariant?: IconVariant;
  /**
   * Trend indicator rendered below the value with an up/down arrow.
   * Colors follow the direction: up → success, down → destructive.
   * Mutually exclusive with `change` — prefer `trend` for rich labels.
   */
  trend?: { direction: "up" | "down"; label: React.ReactNode };
  /**
   * Convenience change badge (legacy AP convention) — pass strings like
   * `"+8.2%"` or `"-3%"`. Renders a lime/pink Badge with "from last week".
   * Mutually exclusive with `trend`; if both supplied, `trend` wins.
   */
  change?: string;
  /** Optional description/hint below the value + trend. */
  description?: React.ReactNode;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────

/**
 * Stat — KPI / metric block.
 *
 * Unified successor to the various hand-rolled stat patterns (MetricCard,
 * scanner StatCard, and the earlier dashboard-local Stat). Subsumes all
 * three via optional props:
 *
 * - Plain label + value — minimal inline KPI
 * - `icon` — adds a tinted icon square (iconVariant picks the tint)
 * - `trend` — adds a rich up/down indicator
 * - `change` — legacy badge-style "+8.2%" change chip
 * - `bordered` — wraps everything in a card chrome (for grid layouts)
 *
 * ```tsx
 * // Minimal
 * <Stat label="Total visitors" value="38.2K" />
 *
 * // With icon + trend, card-framed
 * <Stat
 *   bordered
 *   icon={Users}
 *   iconVariant="info"
 *   label="Monthly active"
 *   value={mau}
 *   trend={{ direction: 'up', label: '+12% this week' }}
 * />
 *
 * // Legacy change-badge form
 * <Stat label="Weekly active users" value="1,234" change="+12%" />
 * ```
 */
export function Stat({
  label,
  value,
  icon: Icon,
  iconVariant = "primary",
  trend,
  change,
  description,
  size = "md",
  bordered,
  className,
  ...props
}: StatProps & Omit<React.HTMLAttributes<HTMLDivElement>, keyof StatProps>) {
  const resolvedSize = size ?? "md";
  const body = (
    <>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className={valueSizeClasses[resolvedSize]}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {trend ? (
        <div
          className={cx(
            "flex items-center gap-1 text-xs",
            trend.direction === "up" ? "text-success" : "text-destructive",
          )}
        >
          {trend.direction === "up" ? (
            <TrendingUp className="size-3.5" aria-hidden />
          ) : (
            <TrendingDown className="size-3.5" aria-hidden />
          )}
          <span>{trend.label}</span>
        </div>
      ) : change ? (
        <div className="text-xs text-muted-foreground">
          <Badge color={changeBadgeColor(change)}>{change}</Badge>
        </div>
      ) : null}
      {description ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : null}
    </>
  );

  return (
    <div
      {...props}
      className={cx(statVariants({ size: resolvedSize, bordered }), className)}
      data-slot="stat"
    >
      {Icon ? (
        <div className="flex items-start gap-3">
          <div
            className={cx(
              "flex shrink-0 items-center justify-center",
              iconSizeClasses[resolvedSize],
              iconVariantClasses[iconVariant],
            )}
            aria-hidden
          >
            <Icon className={iconInnerSizeClasses[resolvedSize]} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">{body}</div>
        </div>
      ) : (
        body
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function changeBadgeColor(
  change: string,
): "lime" | "pink" | "zinc" {
  if (change === "—" || change === "0" || change === "") return "zinc";
  return change.trim().startsWith("-") ? "pink" : "lime";
}

export { statVariants };
