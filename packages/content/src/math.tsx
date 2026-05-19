"use client";

import { cx } from "@artificialpoets/components/lib";
import { cva, type VariantProps } from "class-variance-authority";
import {
  BlockMath as ReactKatexBlock,
  InlineMath as ReactKatexInline,
} from "react-katex";

// ── Variant system ─────────────────────────────────────────────────────

const mathVariants = cva("", {
  variants: {
    size: {
      default: "",
      compact: "text-sm [&_.katex]:!text-[0.9em]",
    },
  },
  defaultVariants: { size: "default" },
});

type MathVariantProps = VariantProps<typeof mathVariants>;

// ── Shared props ───────────────────────────────────────────────────────

interface BaseMathProps extends MathVariantProps {
  /** LaTeX / TeX source string. */
  math: string;
  /** Extra classes applied to the wrapper. */
  className?: string;
  /** Optional render function for KaTeX parse errors. */
  errorColor?: string;
  /** Called with the KaTeX ParseError when parsing fails. */
  renderError?: (error: Error) => React.ReactNode;
}

// ── <BlockMath> ────────────────────────────────────────────────────────

/**
 * BlockMath — display-style equation, centered on its own line.
 *
 * ```tsx
 * <BlockMath math={String.raw`\int_0^\infty e^{-x^2}\,dx = \frac{\sqrt{\pi}}{2}`} />
 * ```
 *
 * **Client component** — KaTeX renders on the client for layout-sensitive
 * math. If you need server-rendered math (e.g. for SEO), swap this for
 * a pre-rendered server call to `katex.renderToString(...)`.
 *
 * **CSS opt-in:** requires `import "@artificialpoets/content/styles/katex"` in
 * your app entry. Without it, math renders structurally but without
 * KaTeX's font + spacing.
 */
export function BlockMath({
  math,
  size,
  className,
  errorColor,
  renderError,
}: BaseMathProps) {
  return (
    <div
      className={cx("katex-block", mathVariants({ size }), className)}
      data-poeticui-block-math
    >
      <ReactKatexBlock
        math={math}
        errorColor={errorColor}
        renderError={renderError}
      />
    </div>
  );
}

// ── <InlineMath> ───────────────────────────────────────────────────────

/**
 * InlineMath — in-flow equation, reads inline with surrounding text.
 *
 * ```tsx
 * The Pythagorean identity <InlineMath math="a^2 + b^2 = c^2" />.
 * ```
 *
 * Same CSS opt-in rule as `<BlockMath>`.
 */
export function InlineMath({
  math,
  size,
  className,
  errorColor,
  renderError,
}: BaseMathProps) {
  return (
    <span
      className={cx("katex-inline", mathVariants({ size }), className)}
      data-poeticui-inline-math
    >
      <ReactKatexInline
        math={math}
        errorColor={errorColor}
        renderError={renderError}
      />
    </span>
  );
}

export { mathVariants };
export type { BaseMathProps as MathProps };
