import clsx from "clsx";

type HeadingProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
} & React.ComponentPropsWithoutRef<"h1" | "h2" | "h3" | "h4" | "h5" | "h6">;

function getHeadingTypeClass(level: 1 | 2 | 3 | 4 | 5 | 6): string {
  switch (level) {
    case 1:
      return "type-h1";
    case 2:
      return "type-h2";
    case 3:
      return "type-h3";
    case 4:
      return "type-h4";
    case 5:
      return "text-base/7";
    case 6:
      return "text-sm/6";
    default: {
      const _exhaustive: never = level;
      return _exhaustive;
    }
  }
}

export function Heading({ className, level = 1, ...props }: HeadingProps) {
  const Element: `h${typeof level}` = `h${level}`;

  return (
    <Element
      {...props}
      className={clsx("text-foreground", getHeadingTypeClass(level), className)}
    />
  );
}

export function Subheading({ className, level = 2, ...props }: HeadingProps) {
  const Element: `h${typeof level}` = `h${level}`;

  return (
    <Element
      {...props}
      className={clsx(
        "text-muted-foreground",
        getHeadingTypeClass(level),
        className,
      )}
    />
  );
}
