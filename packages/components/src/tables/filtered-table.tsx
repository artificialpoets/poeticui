"use client";

import type React from "react";

export function FilteredTableShell({
  headerRight,
  children,
}: React.PropsWithChildren<{
  headerRight?: React.ReactNode;
}>) {
  return (
    <div>
      {headerRight ? (
        <div className="mb-4 flex flex-wrap items-center justify-end gap-3">
          {headerRight}
        </div>
      ) : null}
      {children}
    </div>
  );
}
