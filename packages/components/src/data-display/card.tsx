import clsx from "clsx";

export function Card({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        "rounded-lg border border-border bg-card text-card-foreground p-6",
      )}
    />
  );
}
