import clsx from "clsx";

/**
 * Horizontal rule using the semantic `border` token. `soft` halves the
 * opacity for subtler separation between related content blocks.
 *
 * @example
 * <Divider />
 *
 * @example
 * <Divider soft />
 */
export function Divider({
  soft = false,
  className,
  ...props
}: { soft?: boolean } & React.ComponentPropsWithoutRef<"hr">) {
  return (
    <hr
      data-component="divider"
      role="presentation"
      {...props}
      className={clsx(
        className,
        "w-full border-t",
        soft && "border-border/50",
        !soft && "border-border",
      )}
    />
  );
}
