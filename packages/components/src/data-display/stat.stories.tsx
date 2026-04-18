import type { Meta, StoryObj } from "@storybook/react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Gauge,
  Info,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import { Stat } from "./stat";

const meta = {
  title: "Data Display/Stat",
  component: Stat,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    iconVariant: {
      control: "select",
      options: [
        "primary",
        "success",
        "warning",
        "destructive",
        "info",
        "neutral",
        "chart-1",
        "chart-2",
        "chart-3",
      ],
    },
    bordered: { control: "boolean" },
  },
  args: {
    label: "Monthly active users",
    value: "38.2K",
    size: "md",
    bordered: false,
  },
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Minimal — label + value only. */
export const Default: Story = {};

/** Compact size — for sidebars or dense grids. */
export const Small: Story = {
  args: { size: "sm", value: "1,234" },
};

/** Largest size — for hero metrics. */
export const Large: Story = {
  args: { size: "lg", value: "92%" },
};

/** With an icon square (tinted with `iconVariant`). */
export const WithIcon: Story = {
  args: {
    icon: Users,
    iconVariant: "info",
    label: "Active users",
    value: 9014,
  },
};

/** Trend indicator with directional color (up → success, down → destructive). */
export const WithTrendUp: Story = {
  args: {
    icon: TrendingUp,
    iconVariant: "success",
    label: "Revenue",
    value: "$42.1K",
    trend: { direction: "up", label: "+12% this week" },
  },
};

export const WithTrendDown: Story = {
  args: {
    icon: Gauge,
    iconVariant: "destructive",
    label: "Error rate",
    value: "1.4%",
    trend: { direction: "down", label: "+0.3% (worse) today" },
  },
};

/** Legacy change-badge form (lime/pink chips). */
export const WithChangeBadge: Story = {
  args: { label: "Weekly active users", value: "1,234", change: "+12%" },
};

/** Card-framed — ready to drop into a grid. */
export const Bordered: Story = {
  args: {
    bordered: true,
    icon: Zap,
    iconVariant: "primary",
    label: "Sessions",
    value: "128,493",
    description: "Last 7 days",
  },
};

/** Full sweep: 3 sizes × icon + trend + bordered. */
export const VariantMatrix: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Sizes (sm / md / lg) · inline, no card frame
        </p>
        <div className="grid grid-cols-3 gap-6">
          <Stat size="sm" label="Users" value="12.4K" />
          <Stat size="md" label="Users" value="12.4K" />
          <Stat size="lg" label="Users" value="12.4K" />
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Icon variants — 9 tints
        </p>
        <div className="grid grid-cols-3 gap-4">
          {(
            [
              { v: "primary", icon: Sparkles, label: "Primary", value: "Hero" },
              {
                v: "success",
                icon: CheckCircle2,
                label: "Success",
                value: "OK",
              },
              {
                v: "warning",
                icon: AlertTriangle,
                label: "Warning",
                value: "Alert",
              },
              {
                v: "destructive",
                icon: AlertTriangle,
                label: "Destructive",
                value: "Error",
              },
              { v: "info", icon: Info, label: "Info", value: "Note" },
              { v: "neutral", icon: Activity, label: "Neutral", value: "—" },
              { v: "chart-1", icon: DollarSign, label: "Chart-1", value: "$X" },
              { v: "chart-2", icon: DollarSign, label: "Chart-2", value: "$X" },
              { v: "chart-3", icon: DollarSign, label: "Chart-3", value: "$X" },
            ] as const
          ).map((spec) => (
            <Stat
              key={spec.v}
              bordered
              icon={spec.icon}
              iconVariant={spec.v}
              label={spec.label}
              value={spec.value}
            />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Trends — up (success tone) + down (destructive tone)
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Stat
            bordered
            icon={TrendingUp}
            iconVariant="success"
            label="Revenue"
            value="$42.1K"
            trend={{ direction: "up", label: "+12% this week" }}
          />
          <Stat
            bordered
            icon={Gauge}
            iconVariant="destructive"
            label="Error rate"
            value="1.4%"
            trend={{ direction: "down", label: "+0.3% vs last week" }}
          />
        </div>
      </section>
    </div>
  ),
};
