import type { Meta, StoryObj } from "@storybook/react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Megaphone,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import { Callout, CalloutDescription, CalloutTitle } from "./callout";

const meta = {
  title: "Feedback/Callout",
  component: Callout,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "neutral",
        "info",
        "success",
        "warning",
        "destructive",
        "primary",
      ],
    },
  },
  args: {
    variant: "neutral",
    title: "What users see right now",
    children: (
      <CalloutDescription>
        Callouts are tinted banners for contextual messages. Pick a variant that
        matches the semantic role — not the color.
      </CalloutDescription>
    ),
  },
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = { args: { variant: "neutral" } };
export const Info_: Story = {
  name: "Info",
  args: { variant: "info" },
};
export const Success: Story = { args: { variant: "success" } };
export const Warning: Story = { args: { variant: "warning" } };
export const Destructive: Story = { args: { variant: "destructive" } };
export const Primary: Story = { args: { variant: "primary" } };

/** Shorthand single-line form via the `title` prop. */
export const SingleLine: Story = {
  args: {
    variant: "info",
    title: "Heads up: this is a preview environment.",
    children: undefined,
  },
};

/** With icon slot + `<CalloutTitle>` + `<CalloutDescription>` subcomponents. */
export const WithIconAndSlots: Story = {
  args: {
    variant: "destructive",
    icon: ShieldAlert,
    title: undefined,
    children: (
      <>
        <CalloutTitle>SOC-2 review blocked</CalloutTitle>
        <CalloutDescription>
          Procurement is stalled on vendor review. Last response: 14 days ago.
        </CalloutDescription>
      </>
    ),
  },
};

/** All six variants stacked for at-a-glance review. */
export const VariantMatrix: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-3">
      <Callout variant="neutral" icon={Megaphone}>
        <CalloutTitle>Neutral — generic info banner</CalloutTitle>
        <CalloutDescription>
          Soft muted background, no urgency implied.
        </CalloutDescription>
      </Callout>
      <Callout variant="info" icon={Info}>
        <CalloutTitle>Info — helpful context</CalloutTitle>
        <CalloutDescription>
          Use for tips, system status, onboarding hints.
        </CalloutDescription>
      </Callout>
      <Callout variant="success" icon={CheckCircle2}>
        <CalloutTitle>Success — positive confirmation</CalloutTitle>
        <CalloutDescription>
          Use sparingly — most successes are signalled by the UI moving forward,
          not by a banner.
        </CalloutDescription>
      </Callout>
      <Callout variant="warning" icon={AlertTriangle}>
        <CalloutTitle>Warning — caution required</CalloutTitle>
        <CalloutDescription>
          Something isn&apos;t broken yet, but the user should pay attention.
        </CalloutDescription>
      </Callout>
      <Callout variant="destructive" icon={ShieldAlert}>
        <CalloutTitle>Destructive — blocker or failure</CalloutTitle>
        <CalloutDescription>
          Operation failed, action blocked, data at risk.
        </CalloutDescription>
      </Callout>
      <Callout variant="primary" icon={Sparkles}>
        <CalloutTitle>Primary — branded highlight</CalloutTitle>
        <CalloutDescription>
          Accent-colored. Good for feature launches or in-product announcements.
        </CalloutDescription>
      </Callout>
    </div>
  ),
};
