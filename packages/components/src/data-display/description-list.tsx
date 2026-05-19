import clsx from "clsx";

/**
 * Two-column term/details list (responsive: stacked on mobile, two-up
 * on `sm:` and above). Compose with `DescriptionTerm` and `DescriptionDetails`.
 *
 * @example
 * <DescriptionList>
 *   <DescriptionTerm>Plan</DescriptionTerm>
 *   <DescriptionDetails>Pro</DescriptionDetails>
 *   <DescriptionTerm>Renews</DescriptionTerm>
 *   <DescriptionDetails>2026-12-01</DescriptionDetails>
 * </DescriptionList>
 */
export function DescriptionList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"dl">) {
  return (
    <dl
      data-component="description-list"
      {...props}
      className={clsx(
        className,
        "grid grid-cols-1 text-base/6 sm:grid-cols-[min(50%,--spacing(80))_auto] sm:text-sm/6",
      )}
    />
  );
}

/**
 * Term cell within a {@link DescriptionList}. Renders muted-foreground.
 *
 * @example
 * <DescriptionTerm>Plan</DescriptionTerm>
 */
export function DescriptionTerm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"dt">) {
  return (
    <dt
      data-component="description-term"
      {...props}
      className={clsx(
        className,
        "col-start-1 border-t border-border pt-3 text-muted-foreground first:border-none sm:border-t sm:border-border sm:py-3",
      )}
    />
  );
}

/**
 * Details cell within a {@link DescriptionList}. Renders foreground.
 *
 * @example
 * <DescriptionDetails>Pro</DescriptionDetails>
 */
export function DescriptionDetails({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"dd">) {
  return (
    <dd
      data-component="description-details"
      {...props}
      className={clsx(
        className,
        "pt-1 pb-3 text-foreground sm:border-t sm:border-border sm:py-3 sm:nth-2:border-none",
      )}
    />
  );
}
