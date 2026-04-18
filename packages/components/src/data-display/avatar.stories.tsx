import type { Meta, StoryObj } from "@storybook/react";

import { Avatar, AvatarButton } from "./avatar";

const SAMPLE_SRC = "https://i.pravatar.cc/128?u=poetic-ui";

const meta = {
  title: "Data Display/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    square: { control: "boolean" },
    noRadius: { control: "boolean" },
  },
  args: {
    src: SAMPLE_SRC,
    alt: "Alex Rivera",
    square: false,
    noRadius: false,
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Fallback to initials when `src` is null / fails to load. */
export const InitialsFallback: Story = {
  args: { src: null, initials: "AR", alt: "Alex Rivera" },
};

/** Square chrome (rounded-md corners, not a circle). */
export const Square: Story = { args: { square: true } };

/** Sizes come from Tailwind classes on the wrapper, not a prop. */
export const Sizes: Story = {
  args: {},
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar src={SAMPLE_SRC} alt="" className="size-6" />
      <Avatar src={SAMPLE_SRC} alt="" className="size-8" />
      <Avatar src={SAMPLE_SRC} alt="" className="size-10" />
      <Avatar src={SAMPLE_SRC} alt="" className="size-12" />
      <Avatar src={SAMPLE_SRC} alt="" className="size-16" />
    </div>
  ),
};

/** Clickable — renders as a button or link. */
export const AsButton: Story = {
  args: {},
  render: () => (
    <div className="flex items-center gap-3">
      <AvatarButton
        src={SAMPLE_SRC}
        alt="Profile"
        className="size-10"
        onClick={() => alert("clicked")}
      />
      <AvatarButton
        src={null}
        initials="GS"
        alt="Greg Smith"
        className="size-10"
        href="#"
      />
    </div>
  ),
};

/** Mixed matrix — square + round × image + initials × 3 sizes. */
export const VariantMatrix: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-6">
      {(
        [
          {
            label: "Round + image",
            square: false,
            src: SAMPLE_SRC,
            initials: undefined,
          },
          {
            label: "Round + initials",
            square: false,
            src: null,
            initials: "AR",
          },
          {
            label: "Square + image",
            square: true,
            src: SAMPLE_SRC,
            initials: undefined,
          },
          {
            label: "Square + initials",
            square: true,
            src: null,
            initials: "AR",
          },
        ] as const
      ).map((row) => (
        <div key={row.label}>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {row.label}
          </p>
          <div className="flex items-center gap-3">
            {(
              ["size-6", "size-8", "size-10", "size-12", "size-16"] as const
            ).map((s) => (
              <Avatar
                key={s}
                src={row.src}
                alt=""
                initials={row.initials}
                square={row.square}
                className={s}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
