"use client";

import type React from "react";

export function PageHeader({
  title,
  description,
  right,
}: {
  title: string;
  description?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-3xl">
        <h1 className="type-h2 text-foreground">{title}</h1>
        {description ? (
          <p className="mt-3 text-sm/6 text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {right ? (
        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          {right}
        </div>
      ) : null}
    </div>
  );
}
