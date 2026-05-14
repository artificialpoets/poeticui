"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cx } from "../lib";

// ─── Tokens ───────────────────────────────────────────────────────────────

const TONE_BG: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
  neutral: "bg-muted text-muted-foreground",
  "chart-1": "bg-chart-1/10 text-chart-1",
  "chart-2": "bg-chart-2/10 text-chart-2",
  "chart-3": "bg-chart-3/10 text-chart-3",
  "chart-4": "bg-chart-4/10 text-chart-4",
  "chart-5": "bg-chart-5/10 text-chart-5",
  "chart-6": "bg-chart-6/10 text-chart-6",
  "chart-7": "bg-chart-7/10 text-chart-7",
  "chart-8": "bg-chart-8/10 text-chart-8",
};

const TONE_STROKE: Record<string, string> = {
  primary: "stroke-primary/40",
  success: "stroke-success/40",
  warning: "stroke-warning/40",
  destructive: "stroke-destructive/40",
  info: "stroke-info/40",
  neutral: "stroke-border",
  "chart-1": "stroke-chart-1/40",
  "chart-2": "stroke-chart-2/40",
  "chart-3": "stroke-chart-3/40",
  "chart-4": "stroke-chart-4/40",
  "chart-5": "stroke-chart-5/40",
  "chart-6": "stroke-chart-6/40",
  "chart-7": "stroke-chart-7/40",
  "chart-8": "stroke-chart-8/40",
};

export type FanoutTone = keyof typeof TONE_BG;

// ─── Types ────────────────────────────────────────────────────────────────

export interface FanoutSpoke {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  /** Optional small text rendered under the label (e.g. "62K imp"). */
  value?: React.ReactNode;
  /** When supplied along with `groups`, places this spoke in that group's sector. */
  group?: string;
  /** Color tint for the spoke node + line. Defaults to `neutral`. */
  tone?: FanoutTone;
}

export interface FanoutGroup {
  id: string;
  label: React.ReactNode;
}

const fanoutVariants = cva("relative mx-auto", {
  variants: {
    size: {
      md: "w-full max-w-[460px] aspect-square",
      lg: "w-full max-w-[560px] aspect-square",
      xl: "w-full max-w-[680px] aspect-square",
    },
  },
  defaultVariants: { size: "lg" },
});

export interface FanoutMapProps extends VariantProps<typeof fanoutVariants> {
  /** The hub node — a single short label + optional value. */
  center: { label: React.ReactNode; value?: React.ReactNode };
  spokes: FanoutSpoke[];
  /** Defines display order of group sectors. If omitted, spokes spread evenly around 360°. */
  groups?: FanoutGroup[];
  /** Hide the small group labels rendered around the perimeter. */
  hideGroupLabels?: boolean;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────

/**
 * FanoutMap — radial "one source, N destinations" diagram.
 *
 * A central hub with spokes radiating outward to destination nodes. Useful for
 * any broadcast/distribution visualization: cross-platform publishing, multi-
 * region deploys, source→consumer flows. When `groups` are provided, spokes
 * cluster into angular sectors (e.g. "social" / "email" / "feed") with small
 * sector labels around the perimeter.
 *
 * Optimized to read at a glance — pair with a tabular companion (e.g. `<Funnel>`
 * or a plain `<Table>`) below the map for the precise numbers.
 *
 * ```tsx
 * <FanoutMap
 *   center={{ label: "Article", value: "24,110 views" }}
 *   groups={[
 *     { id: "social", label: "Social" },
 *     { id: "email", label: "Newsletter" },
 *     { id: "feed", label: "Feed" },
 *   ]}
 *   spokes={[
 *     { id: "x", label: "X", icon: <XIcon />, group: "social", tone: "chart-1" },
 *     { id: "li", label: "LinkedIn", icon: <LiIcon />, group: "social", tone: "chart-2" },
 *     { id: "nl", label: "Sat digest", group: "email", tone: "info" },
 *     { id: "feed", label: "Feed", group: "feed", tone: "primary" },
 *   ]}
 * />
 * ```
 */
export function FanoutMap({
  center,
  spokes,
  groups,
  hideGroupLabels = false,
  size,
  className,
}: FanoutMapProps) {
  const layout = React.useMemo(
    () => layoutSpokes(spokes, groups),
    [spokes, groups],
  );

  return (
    <div
      className={cx(fanoutVariants({ size }), className)}
      data-slot="fanout-map"
    >
      {/* SVG layer for spoke lines + group sector labels */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full"
        aria-hidden
      >
        {/* Decorative concentric ring */}
        <circle
          cx="50"
          cy="50"
          r="42"
          className="fill-none stroke-border"
          strokeDasharray="0.6 1.4"
          strokeWidth="0.3"
        />
        {layout.spokes.map((s) => (
          <line
            key={s.id}
            x1="50"
            y1="50"
            x2={s.x}
            y2={s.y}
            className={cx(TONE_STROKE[s.tone ?? "neutral"])}
            strokeWidth="0.4"
            strokeLinecap="round"
          />
        ))}
        {/* Group sector arcs (faint dividers between groups) */}
        {!hideGroupLabels && layout.groupBoundaries.length > 1
          ? layout.groupBoundaries.map((b) => {
              const x = 50 + 46 * Math.cos(b);
              const y = 50 + 46 * Math.sin(b);
              return (
                <line
                  key={b}
                  x1="50"
                  y1="50"
                  x2={x}
                  y2={y}
                  className="stroke-border/50"
                  strokeWidth="0.15"
                  strokeDasharray="0.4 0.6"
                />
              );
            })
          : null}
      </svg>

      {/* Group labels (HTML, perimeter) */}
      {!hideGroupLabels && layout.groupLabels.length > 1 ? (
        <div className="pointer-events-none absolute inset-0">
          {layout.groupLabels.map((g) => (
            <div
              key={g.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
              style={{ left: `${g.x}%`, top: `${g.y}%` }}
            >
              {g.label}
            </div>
          ))}
        </div>
      ) : null}

      {/* Center hub */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex size-24 flex-col items-center justify-center rounded-full border border-border bg-card px-2 text-center shadow-sm">
          <p className="line-clamp-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {center.label}
          </p>
          {center.value ? (
            <p className="mt-1 text-sm font-semibold text-foreground">
              {center.value}
            </p>
          ) : null}
        </div>
      </div>

      {/* Spoke nodes (HTML) */}
      <div className="absolute inset-0">
        {layout.spokes.map((s) => (
          <div
            key={s.id}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 text-center"
            style={{ left: `${s.x}%`, top: `${s.y}%`, maxWidth: "22%" }}
          >
            <div
              className={cx(
                "flex size-9 items-center justify-center rounded-full border border-border bg-card shadow-sm",
                TONE_BG[s.tone ?? "neutral"],
              )}
            >
              {s.icon ?? (
                <span className="text-[10px] font-semibold">
                  {initials(s.label)}
                </span>
              )}
            </div>
            <p className="line-clamp-1 text-[11px] font-medium text-foreground">
              {s.label}
            </p>
            {s.value ? (
              <p className="line-clamp-1 text-[10px] text-muted-foreground">
                {s.value}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Layout helpers ───────────────────────────────────────────────────────

interface PositionedSpoke extends FanoutSpoke {
  x: number; // percent (0–100)
  y: number;
}

interface Layout {
  spokes: PositionedSpoke[];
  groupBoundaries: number[]; // angles (radians)
  groupLabels: { id: string; label: React.ReactNode; x: number; y: number }[];
}

function layoutSpokes(spokes: FanoutSpoke[], groups?: FanoutGroup[]): Layout {
  const RADIUS = 40; // percent — leaves room for labels
  const LABEL_RADIUS = 49;
  const TWO_PI = Math.PI * 2;

  if (!groups || groups.length === 0) {
    // Even distribution starting at top (-π/2)
    const positioned = spokes.map((s, i) => {
      const angle = -Math.PI / 2 + (i / spokes.length) * TWO_PI;
      return {
        ...s,
        x: 50 + RADIUS * Math.cos(angle),
        y: 50 + RADIUS * Math.sin(angle),
      };
    });
    return { spokes: positioned, groupBoundaries: [], groupLabels: [] };
  }

  // Bucket spokes by group, preserving spoke order within each group.
  const buckets = new Map<string, FanoutSpoke[]>();
  for (const g of groups) buckets.set(g.id, []);
  for (const s of spokes) {
    const key = s.group && buckets.has(s.group) ? s.group : groups[0].id;
    buckets.get(key)!.push(s);
  }

  // Per-group angular sector. We weight by spoke count so dense groups don't crowd.
  const total = spokes.length || 1;
  const groupWeights = groups.map(
    (g) => Math.max(buckets.get(g.id)!.length, 1) / total,
  );
  const groupSpans = groupWeights.map((w) => w * TWO_PI);

  // Sectors start at top (-π/2) and walk clockwise.
  const positioned: PositionedSpoke[] = [];
  const boundaries: number[] = [];
  const labels: Layout["groupLabels"] = [];

  let cursor = -Math.PI / 2;
  for (let gi = 0; gi < groups.length; gi++) {
    const g = groups[gi];
    const span = groupSpans[gi];
    boundaries.push(cursor);
    const items = buckets.get(g.id)!;
    const nodeCount = items.length;
    // Place spokes inside the sector, with padding from the boundaries.
    const sectorPad = Math.min(span * 0.18, 0.18);
    const innerSpan = span - sectorPad * 2;
    items.forEach((s, i) => {
      const angle =
        nodeCount === 1
          ? cursor + span / 2
          : cursor + sectorPad + (i / (nodeCount - 1)) * innerSpan;
      positioned.push({
        ...s,
        x: 50 + RADIUS * Math.cos(angle),
        y: 50 + RADIUS * Math.sin(angle),
      });
    });
    // Group label centered in the sector, just outside the spoke radius.
    const midAngle = cursor + span / 2;
    labels.push({
      id: g.id,
      label: g.label,
      x: 50 + LABEL_RADIUS * Math.cos(midAngle),
      y: 50 + LABEL_RADIUS * Math.sin(midAngle),
    });
    cursor += span;
  }
  boundaries.push(cursor);

  return {
    spokes: positioned,
    groupBoundaries: boundaries,
    groupLabels: labels,
  };
}

function initials(label: React.ReactNode): string {
  if (typeof label === "string") {
    const parts = label.trim().split(/\s+/);
    return (
      (parts[0]?.[0] ?? "").toUpperCase() + (parts[1]?.[0] ?? "").toUpperCase()
    );
  }
  return "•";
}

export { fanoutVariants };
