import clsx from "clsx";

import { Link } from "../core/link";

/**
 * Body paragraph with `muted-foreground` color. Sets `data-slot="text"`
 * so parents can target it via attribute selectors for spacing.
 *
 * @example
 * <Text>Where should we send the receipt?</Text>
 */
export function Text({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  return (
    <p
      data-component="text"
      data-slot="text"
      {...props}
      className={clsx(
        className,
        "text-base/6 text-muted-foreground sm:text-sm/6",
      )}
    />
  );
}

/**
 * Inline link styled for prose. Wraps {@link Link}, adds underline
 * decoration that becomes opaque on hover.
 *
 * @example
 * <TextLink href="/docs">Read the docs</TextLink>
 */
export function TextLink({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link
      data-component="text-link"
      {...props}
      className={clsx(
        className,
        "text-foreground underline decoration-foreground/50 data-hover:decoration-foreground",
      )}
    />
  );
}

/**
 * Bolded text within prose. Renders `<strong>` with `font-medium` and
 * full-strength foreground color.
 *
 * @example
 * <Text>Pay with <Strong>Visa ••• 1234</Strong></Text>
 */
export function Strong({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"strong">) {
  return (
    <strong
      data-component="strong"
      {...props}
      className={clsx(className, "font-medium text-foreground")}
    />
  );
}

/**
 * Inline code snippet. Bordered, muted background, monospace.
 *
 * @example
 * <Text>Run <Code>bun install</Code> to start.</Text>
 */
export function Code({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"code">) {
  return (
    <code
      data-component="code"
      {...props}
      className={clsx(
        className,
        "rounded-sm border border-border bg-muted/30 px-0.5 text-sm font-medium text-foreground sm:text-[0.8125rem]",
      )}
    />
  );
}
