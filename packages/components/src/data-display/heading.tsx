import { cx } from "../lib";

type HeadingLevel = 1 | 2 | 3 | 4;
type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type HeadingProps = {
  /**
   * The **semantic** HTML tag to render.
   * Defaults to `h1`. Choose based on document outline (a11y / SEO), not visual size.
   */
  as?: HeadingTag;
  /**
   * The **visual** heading level (font-size / line-height / letter-spacing).
   * Defaults to the numeric part of `as` when that's between 1 and 4, else `1`.
   * Pass `level` when the HTML tag must differ from the visual weight
   * (e.g. page title is `<h1>` semantically but designed at h2 size).
   */
  level?: HeadingLevel;
} & React.ComponentPropsWithoutRef<HeadingTag>;

function parseLevel(as: HeadingTag, level?: HeadingLevel): HeadingLevel {
  if (level) return level;
  const n = Number(as[1]);
  return n >= 1 && n <= 4 ? (n as HeadingLevel) : 1;
}

function sizeStyleFor(level: HeadingLevel): React.CSSProperties {
  return {
    fontSize: `var(--heading-${level}-size)`,
    lineHeight: `var(--heading-${level}-line-height)`,
    letterSpacing: `var(--heading-${level}-letter-spacing)`,
  };
}

/**
 * Semantic heading with independently-controllable HTML tag and visual size.
 *
 * Principle P1 (HTML semantics first): pick `as` for document outline. Pick
 * `level` only when the visual size must differ from the tag — e.g. a page
 * title that's semantically `<h1>` but rendered at h2 size.
 *
 * ```tsx
 * // Semantically and visually an h1 — the default
 * <Heading>Hero</Heading>
 *
 * // Section heading (h2 everywhere)
 * <Heading as="h2">Activity</Heading>
 *
 * // Page title: h1 for a11y + SEO, but visually smaller (h2 size)
 * <Heading as="h1" level={2}>Content Intent — Posts</Heading>
 * ```
 */
export function Heading({
  as = "h1",
  level,
  className,
  style,
  ...props
}: HeadingProps) {
  const Tag = as;
  const resolvedLevel = parseLevel(as, level);
  return (
    <Tag
      {...props}
      className={cx("text-foreground", className)}
      style={{ ...sizeStyleFor(resolvedLevel), ...style }}
    />
  );
}

/**
 * Muted variant of Heading. Same API; renders with `text-muted-foreground`.
 */
export function Subheading({
  as = "h2",
  level,
  className,
  style,
  ...props
}: HeadingProps) {
  const Tag = as;
  const resolvedLevel = parseLevel(as, level);
  return (
    <Tag
      {...props}
      className={cx("text-muted-foreground", className)}
      style={{ ...sizeStyleFor(resolvedLevel), ...style }}
    />
  );
}
