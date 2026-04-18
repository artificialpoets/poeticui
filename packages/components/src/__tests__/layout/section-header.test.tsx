import { render, screen } from "@testing-library/react";
import { Layers } from "lucide-react";
import React from "react";

import { SectionHeader } from "../../layout/section-header";

describe("SectionHeader", () => {
  test("renders title as h3 by default", () => {
    render(<SectionHeader title="Tech stack" />);
    const heading = screen.getByRole("heading", { name: "Tech stack" });
    expect(heading.tagName).toBe("H3");
  });

  test("as prop changes the semantic tag", () => {
    render(<SectionHeader title="Tech stack" as="h2" />);
    expect(screen.getByRole("heading", { name: "Tech stack" }).tagName).toBe(
      "H2",
    );
  });

  test("icon slot renders a lucide icon", () => {
    const { container } = render(
      <SectionHeader title="Tech stack" icon={Layers} />,
    );
    expect(container.querySelector("svg.lucide")).toBeInTheDocument();
  });

  test("root has data-slot=section-header", () => {
    const { container } = render(<SectionHeader title="X" />);
    expect(container.firstElementChild).toHaveAttribute(
      "data-slot",
      "section-header",
    );
  });

  test("className prop merges onto root", () => {
    const { container } = render(<SectionHeader title="X" className="mt-6" />);
    expect(container.firstElementChild?.className).toMatch(/mt-6/);
  });
});
