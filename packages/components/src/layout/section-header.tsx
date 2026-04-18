"use client";

import { cx } from "../lib";

/**
 * SectionHeader — icon + title row used as a tab-section heading.
 *
 * ```tsx
 * <SectionHeader title="Tech stack" icon={Layers} />
 * ```
 *
 * Renders a heading (default `<h3>`) with a muted lucide icon to its left.
 * For page-level headings, reach for `<PageHeader>` (title + description +
 * right-slot chrome). For fine-grained level control without the icon row,
 * use `<Heading>`.
 */
export function SectionHeader({
  title,
  icon: Icon,
  as = "h3",
  className,
}: {
  title: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  /** Semantic heading level. Defaults to `h3`. */
  as?: "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
}) {
  const Tag = as;
  return (
    <div
      className={cx("flex items-center gap-2 pb-2", className)}
      data-slot="section-header"
    >
      {Icon && <Icon className="size-4 text-muted-foreground" aria-hidden />}
      <Tag className="text-sm font-semibold text-foreground">{title}</Tag>
    </div>
  );
}
