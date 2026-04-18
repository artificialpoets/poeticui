"use client";

import type React from "react";

import { TableCell, TableHeader } from "../data-display/table";

export function ActionsTableHeader({ className }: { className?: string }) {
  return (
    <TableHeader scope="col" className={className}>
      Actions
    </TableHeader>
  );
}

export function ActionsTableCell({
  className,
  children,
}: React.PropsWithChildren<{
  className?: string;
}>) {
  return <TableCell className={className}>{children}</TableCell>;
}
