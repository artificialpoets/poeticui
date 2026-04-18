import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { ImageWithFallback } from "../../data-display/image-with-fallback";

describe("ImageWithFallback", () => {
  describe("image rendering", () => {
    test("renders the first candidate URL when src is an array", () => {
      render(
        <ImageWithFallback
          src={[
            "https://a.example/favicon.ico",
            "https://b.example/favicon.ico",
          ]}
          alt="Acme Site"
        />,
      );
      const img = screen.getByAltText("Acme Site") as HTMLImageElement;
      expect(img.tagName).toBe("IMG");
      expect(img.src).toBe("https://a.example/favicon.ico");
    });

    test("accepts a single string src", () => {
      render(
        <ImageWithFallback src="https://one.example/logo.png" alt="One" />,
      );
      const img = screen.getByAltText("One") as HTMLImageElement;
      expect(img.src).toBe("https://one.example/logo.png");
    });

    test("advances to the next candidate on image error", () => {
      render(
        <ImageWithFallback
          src={["https://a.example/broken.ico", "https://b.example/good.ico"]}
          alt="Cascading site"
        />,
      );
      const img = screen.getByAltText("Cascading site") as HTMLImageElement;
      expect(img.src).toBe("https://a.example/broken.ico");

      fireEvent.error(img);
      const next = screen.getByAltText("Cascading site") as HTMLImageElement;
      expect(next.src).toBe("https://b.example/good.ico");
    });

    test("filters out null/undefined candidates", () => {
      render(
        <ImageWithFallback
          src={[null, undefined, "https://real.example/logo.png"]}
          alt="Filtered"
        />,
      );
      const img = screen.getByAltText("Filtered") as HTMLImageElement;
      expect(img.src).toBe("https://real.example/logo.png");
    });
  });

  describe("fallback placeholder", () => {
    test("renders the default initial-letter tile when no candidates are provided", () => {
      render(<ImageWithFallback src={[]} alt="Acme Inc" />);
      const placeholder = screen.getByRole("img", { name: /acme inc/i });
      expect(placeholder).toHaveTextContent("A");
      expect(placeholder.className).toMatch(/bg-muted/);
      expect(placeholder.className).toMatch(/ring-border/);
    });

    test("placeholder uppercases the initial", () => {
      render(<ImageWithFallback src={[]} alt="lowercase site" />);
      expect(
        screen.getByRole("img", { name: /lowercase site/i }),
      ).toHaveTextContent("L");
    });

    test("handles empty alt gracefully (shows ?)", () => {
      render(<ImageWithFallback src={[]} alt="" />);
      const placeholder = screen.getByRole("img");
      expect(placeholder).toHaveTextContent("?");
    });

    test("renders the custom fallback when all candidates fail and fallback is set", () => {
      render(
        <ImageWithFallback
          src={[]}
          alt="Custom"
          fallback={<div data-testid="my-fallback">Custom fallback</div>}
        />,
      );
      expect(screen.getByTestId("my-fallback")).toBeInTheDocument();
      expect(screen.getByText("Custom fallback")).toBeInTheDocument();
    });

    test("advances to the placeholder when every candidate errors", () => {
      render(
        <ImageWithFallback
          src={[
            "https://a.example/broken.ico",
            "https://b.example/also-broken.ico",
          ]}
          alt="Totally broken"
        />,
      );
      let img = screen.getByAltText("Totally broken") as HTMLImageElement;
      fireEvent.error(img);
      img = screen.getByAltText("Totally broken") as HTMLImageElement;
      fireEvent.error(img);
      // Now the placeholder should be rendered instead
      const placeholder = screen.getByRole("img", { name: /totally broken/i });
      expect(placeholder).toHaveTextContent("T");
      expect(placeholder.tagName).not.toBe("IMG");
    });
  });

  describe("className forwarding", () => {
    test("applies className to both the image and the placeholder", () => {
      const { rerender } = render(
        <ImageWithFallback
          src="https://x.example/x.png"
          alt="With class"
          className="size-14 rounded-xl"
        />,
      );
      const img = screen.getByAltText("With class");
      expect(img.className).toMatch(/size-14/);
      expect(img.className).toMatch(/rounded-xl/);

      rerender(
        <ImageWithFallback
          src={[]}
          alt="With class"
          className="size-14 rounded-xl"
        />,
      );
      const placeholder = screen.getByRole("img", { name: /with class/i });
      expect(placeholder.className).toMatch(/size-14/);
      expect(placeholder.className).toMatch(/rounded-xl/);
    });
  });
});
