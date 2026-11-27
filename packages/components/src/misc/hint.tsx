import type { ReactNode } from "react";

/** Dotted-underline label with hover caption (same pattern as MAU on Active users). */
export function Hint({
  message,
  children,
}: {
  message: string;
  children: ReactNode;
}) {
  return (
    <span className="group/hint relative inline-flex items-center">
      {children}
      {/* A solid fill: white on an 80% --primary over a light page read 3.8:1. */}
      <span className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground opacity-0 shadow-lg transition-opacity group-hover/hint:opacity-100">
        {message}
      </span>
    </span>
  );
}
