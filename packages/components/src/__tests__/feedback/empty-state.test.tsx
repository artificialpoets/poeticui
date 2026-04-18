import { render, screen } from "@testing-library/react";
import { Inbox } from "lucide-react";
import React from "react";

import { EmptyState } from "../../feedback/empty-state";

describe("EmptyState", () => {
  test("renders a title with role=status for a11y", () => {
    render(<EmptyState title="No results" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("No results")).toBeInTheDocument();
  });

  test("optional description renders when provided", () => {
    render(
      <EmptyState title="No sites" description="Connect your first site." />,
    );
    expect(screen.getByText("Connect your first site.")).toBeInTheDocument();
  });

  test("icon slot renders a lucide icon in a muted circle", () => {
    const { container } = render(
      <EmptyState title="Nothing here" icon={Inbox} />,
    );
    expect(container.querySelector("svg.lucide")).toBeInTheDocument();
    const circle = container.querySelector("[aria-hidden]");
    expect(circle?.className).toMatch(/rounded-full/);
    expect(circle?.className).toMatch(/bg-muted/);
  });

  test("action slot renders arbitrary children", () => {
    render(
      <EmptyState
        title="Nothing here"
        action={<button type="button">Add one</button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Add one" })).toBeInTheDocument();
  });

  test.each(["sm", "md", "lg"] as const)(
    "size=%s applies matching title class",
    (size) => {
      render(<EmptyState title="X" size={size} />);
      const title = screen.getByText("X");
      const matches = {
        sm: /text-sm/,
        md: /text-base/,
        lg: /text-lg/,
      } as const;
      expect(title.className).toMatch(matches[size]);
    },
  );

  test("bordered adds dashed border card chrome", () => {
    const { container } = render(<EmptyState title="X" bordered />);
    expect(container.firstElementChild?.className).toMatch(/rounded-xl/);
    expect(container.firstElementChild?.className).toMatch(/border-dashed/);
    expect(container.firstElementChild?.className).toMatch(/border-border/);
  });

  test("className override merges cleanly (cx + tailwind-merge)", () => {
    const { container } = render(<EmptyState title="X" className="py-4" />);
    // md default is py-12; py-4 should win via tailwind-merge
    expect(container.firstElementChild?.className).toMatch(/\bpy-4\b/);
    expect(container.firstElementChild?.className).not.toMatch(/\bpy-12\b/);
  });
});
