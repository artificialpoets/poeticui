import { render, screen } from "@testing-library/react";
import { AlertTriangle } from "lucide-react";
import React from "react";

import {
  Callout,
  CalloutDescription,
  CalloutTitle,
} from "../../feedback/callout";

describe("Callout", () => {
  test("renders with neutral variant by default", () => {
    const { container } = render(<Callout>Heads up</Callout>);
    const root = container.firstElementChild;
    expect(root).toHaveAttribute("data-variant", "neutral");
    expect(root?.className).toMatch(/border-border/);
    expect(root?.className).toMatch(/bg-muted/);
    expect(screen.getByText("Heads up")).toBeInTheDocument();
  });

  test("destructive variant paints with destructive tokens", () => {
    const { container } = render(
      <Callout variant="destructive">Blocker</Callout>,
    );
    const root = container.firstElementChild;
    expect(root).toHaveAttribute("data-variant", "destructive");
    expect(root?.className).toMatch(/border-destructive/);
    expect(root?.className).toMatch(/bg-destructive/);
    expect(root?.className).toMatch(/text-destructive/);
  });

  test("info variant exercises the new --info token", () => {
    const { container } = render(
      <Callout variant="info">Preview environment</Callout>,
    );
    const root = container.firstElementChild;
    expect(root?.className).toMatch(/border-info/);
    expect(root?.className).toMatch(/bg-info/);
    expect(root?.className).toMatch(/text-info/);
  });

  test.each(["success", "warning", "primary", "info"] as const)(
    "variant=%s renders with matching role tokens",
    (variant) => {
      const { container } = render(
        <Callout variant={variant}>body</Callout>,
      );
      const root = container.firstElementChild;
      expect(root?.className).toMatch(new RegExp(`border-${variant}`));
      expect(root?.className).toMatch(new RegExp(`bg-${variant}`));
    },
  );

  test("icon prop renders the lucide-style icon", () => {
    const { container } = render(
      <Callout variant="warning" icon={AlertTriangle}>
        Why now
      </Callout>,
    );
    // lucide icons render as <svg class="lucide lucide-triangle-alert">
    expect(container.querySelector("svg.lucide")).toBeInTheDocument();
  });

  test("shorthand title prop renders a CalloutTitle heading", () => {
    render(<Callout variant="info" title="Preview mode" />);
    const heading = screen.getByRole("heading", { name: "Preview mode" });
    expect(heading.tagName).toBe("H3");
    expect(heading).toHaveAttribute("data-slot", "callout-title");
  });

  test("consumer className wins over conflicting base classes (cx + tailwind-merge)", () => {
    const { container } = render(
      <Callout variant="success" className="rounded-none p-8">
        body
      </Callout>,
    );
    const root = container.firstElementChild;
    // cx uses tailwind-merge — rounded-none should override the base rounded-xl
    expect(root?.className).toMatch(/rounded-none/);
    expect(root?.className).not.toMatch(/\brounded-xl\b/);
    // p-8 should override the base p-5
    expect(root?.className).toMatch(/\bp-8\b/);
  });

  test("composition: Title + Description render as slot children", () => {
    render(
      <Callout variant="destructive">
        <CalloutTitle as="h4">Build failed</CalloutTitle>
        <CalloutDescription>
          Vite errored on an unresolved import.
        </CalloutDescription>
      </Callout>,
    );
    const title = screen.getByRole("heading", { name: "Build failed" });
    expect(title.tagName).toBe("H4");
    expect(title).toHaveAttribute("data-slot", "callout-title");

    const desc = screen.getByText(/Vite errored/);
    expect(desc).toHaveAttribute("data-slot", "callout-description");
  });
});
