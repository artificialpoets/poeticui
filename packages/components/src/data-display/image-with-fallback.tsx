"use client";

import * as React from "react";

import { cx } from "../lib";

/**
 * `<ImageWithFallback>` — try a list of URLs in order, advance on error, and
 * fall back to a placeholder when every candidate fails.
 *
 * Common case: site favicons with multiple candidate URLs (Google CDN, the
 * site's own favicon.ico, a logo URL, etc.), with an initial-letter tile as
 * the final fallback.
 *
 * ```tsx
 * <ImageWithFallback
 *   src={[site.info?.faviconUrl, site.info?.logoUrl, '/default-logo.svg']}
 *   alt={site.displayName}
 *   className="size-14 rounded-xl ring-1 ring-border"
 * />
 * ```
 *
 * The placeholder default is an initial-letter tile (`alt.charAt(0)`) rendered
 * with `bg-muted text-muted-foreground ring-1 ring-border`. Override with
 * `fallback` for full control. The `className` applies to both the `<img>` and
 * the placeholder so sizing/shape stays consistent.
 */
export interface ImageWithFallbackProps extends Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src"
> {
  /**
   * URLs tried in order. Nullish / empty entries are filtered out. The first
   * URL that loads without error is shown; when all fail, the placeholder
   * renders.
   */
  src: string | Array<string | null | undefined>;
  /**
   * Accessible label — also used to derive the initial letter for the default
   * placeholder. Required.
   */
  alt: string;
  /**
   * Replacement placeholder rendered when all `src` candidates fail (or when
   * no candidates are provided). Receives the same `className` as the image
   * for consistent sizing.
   */
  fallback?: React.ReactNode;
  /**
   * Padding around the image content. Useful for logos where the source image
   * doesn't have its own padding. Default: `"p-2"` (matches the original
   * site-avatar styling).
   */
  imagePadding?: string;
}

function firstInitial(alt: string): string {
  const trimmed = alt.trim();
  if (!trimmed) return "?";
  return trimmed.charAt(0).toUpperCase();
}

function toCandidates(src: ImageWithFallbackProps["src"]): string[] {
  const arr = Array.isArray(src) ? src : [src];
  return arr.filter((v): v is string => typeof v === "string" && v.length > 0);
}

export function ImageWithFallback({
  src,
  alt,
  fallback,
  imagePadding = "p-2",
  className,
  ...imgProps
}: ImageWithFallbackProps) {
  const candidates = React.useMemo(() => toCandidates(src), [src]);
  const [index, setIndex] = React.useState(0);

  // Reset index when the candidate list changes (new site loaded, etc.).
  React.useEffect(() => {
    setIndex(0);
  }, [candidates.join("\0")]);

  const activeSrc = candidates[index];

  if (!activeSrc) {
    if (fallback !== undefined) {
      return <>{fallback}</>;
    }
    // Default placeholder — initial letter on a muted tile.
    return (
      <div
        role="img"
        aria-label={alt}
        className={cx(
          "flex flex-none items-center justify-center bg-muted font-sans text-lg font-semibold text-muted-foreground ring-1 ring-border",
          className,
        )}
      >
        {firstInitial(alt)}
      </div>
    );
  }

  // Next.js `<Image>` isn't suitable here: the source list is dynamic with an
  // onError-driven fallback chain that `<Image>` doesn't support cleanly.
  return (
    <img
      {...imgProps}
      key={activeSrc}
      src={activeSrc}
      alt={alt}
      onError={() => setIndex((i) => i + 1)}
      className={cx(
        "flex-none bg-muted object-contain ring-1 ring-border",
        imagePadding,
        className,
      )}
    />
  );
}
