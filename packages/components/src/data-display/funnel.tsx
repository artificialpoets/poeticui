"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown, ChevronRight } from "lucide-react";

import { cx } from "../lib";

// ─── Types ────────────────────────────────────────────────────────────────

export type FunnelTone =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "info"
  | "chart-1"
  | "chart-2"
  | "chart-3"
  | "chart-4"
  | "chart-5"
  | "chart-6";

const STAGE_TONE: Record<FunnelTone, string> = {
  default: "border-border bg-card",
  primary: "border-primary/30 bg-primary/5",
  success: "border-success/30 bg-success/5",
  warning: "border-warning/30 bg-warning/5",
  info: "border-info/30 bg-info/5",
  "chart-1": "border-chart-1/30 bg-chart-1/5",
  "chart-2": "border-chart-2/30 bg-chart-2/5",
  "chart-3": "border-chart-3/30 bg-chart-3/5",
  "chart-4": "border-chart-4/30 bg-chart-4/5",
  "chart-5": "border-chart-5/30 bg-chart-5/5",
  "chart-6": "border-chart-6/30 bg-chart-6/5",
};

export interface FunnelStage {
  id?: string;
  /** Stage name, e.g. "Visitors". */
  label: React.ReactNode;
  /** Numeric or formatted display value. Numbers are auto-formatted with `toLocaleString()`. */
  value: number | string;
  /**
   * Conversion from the *previous* stage. Provide a fraction between 0–1
   * (e.g. `0.275` → "27.5%"). Ignored on the first stage.
   */
  conversion?: number;
  /** Optional small caption (e.g. "+312 this week", "avg 2:14 read"). */
  hint?: React.ReactNode;
  tone?: FunnelTone;
}

const funnelVariants = cva("", {
  variants: {
    orientation: {
      horizontal:
        "grid auto-cols-fr grid-flow-col gap-3 sm:gap-4 overflow-x-auto",
      vertical: "flex flex-col gap-3",
    },
  },
  defaultVariants: { orientation: "horizontal" },
});

export interface FunnelProps extends VariantProps<typeof funnelVariants> {
  stages: FunnelStage[];
  /** Hide the arrow + conversion delta between stages. */
  hideArrows?: boolean;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────

/**
 * Funnel — stage-by-stage flow with conversion deltas.
 *
 * Renders a row (or column) of stage cards, with an arrow + conversion %
 * between each. Useful for any conversion / onboarding / activation funnel:
 * visitor → engaged → subscribed → lead, signup → activation → retention,
 * MQL → SQL → opp → close.
 *
 * ```tsx
 * <Funnel
 *   stages={[
 *     { label: "Visitors", value: 428_000 },
 *     { label: "Engaged", value: 118_000, conversion: 0.275, hint: "avg 2:14 read" },
 *     { label: "Subscribers", value: 9_841, conversion: 0.083 },
 *     { label: "Leads", value: 1_416, conversion: 0.144, tone: "primary" },
 *   ]}
 * />
 * ```
 */
export function Funnel({
  stages,
  orientation = "horizontal",
  hideArrows = false,
  className,
}: FunnelProps) {
  const Arrow = orientation === "vertical" ? ChevronDown : ChevronRight;
  return (
    <ol
      className={cx(funnelVariants({ orientation }), className)}
      data-slot="funnel"
      data-orientation={orientation}
    >
      {stages.map((s, i) => {
        const showArrow = !hideArrows && i < stages.length - 1;
        return (
          <li key={s.id ?? i} className="contents">
            <div
              className={cx(
                "flex flex-col gap-1.5 rounded-xl border p-4 transition",
                STAGE_TONE[s.tone ?? "default"],
              )}
              data-slot="funnel-stage"
            >
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {s.label}
              </p>
              <p className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {typeof s.value === "number"
                  ? s.value.toLocaleString()
                  : s.value}
              </p>
              {s.hint ? (
                <p className="text-xs text-muted-foreground">{s.hint}</p>
              ) : null}
            </div>
            {showArrow ? (
              <div
                className={cx(
                  "flex items-center justify-center text-muted-foreground",
                  orientation === "vertical" ? "py-1" : "px-1",
                )}
                aria-hidden
                data-slot="funnel-arrow"
              >
                <div className="flex flex-col items-center gap-0.5">
                  <Arrow className="size-4" />
                  {stages[i + 1]?.conversion !== undefined ? (
                    <span className="text-[10px] font-medium tabular-nums text-muted-foreground">
                      {formatPct(stages[i + 1].conversion!)}
                    </span>
                  ) : null}
                </div>
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function formatPct(n: number): string {
  if (n >= 0.1) return `${(n * 100).toFixed(0)}%`;
  return `${(n * 100).toFixed(1)}%`;
}

export { funnelVariants };
