import clsx from "clsx";

/**
 * Elevated surface for grouping related content. Renders a `<div>` with
 * border, rounded corners, card background, and 1.5rem padding by default.
 *
 * @example
 * <Card>
 *   <h3>KPI title</h3>
 *   <p>Body content.</p>
 * </Card>
 */
export function Card({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-component="card"
      {...props}
      className={clsx(
        className,
        "rounded-lg border border-border bg-card text-card-foreground p-6",
      )}
    />
  );
}
