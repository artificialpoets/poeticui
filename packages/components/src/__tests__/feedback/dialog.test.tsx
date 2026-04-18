import { render, screen } from "@testing-library/react";
import React from "react";

import {
  Alert,
  AlertActions,
  AlertBody,
  AlertDescription,
  AlertTitle,
} from "../../feedback/alert";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "../../feedback/dialog";

describe("Dialog", () => {
  describe("default variant", () => {
    test("renders when open=true", () => {
      render(
        <Dialog open={true} onClose={() => {}}>
          <DialogBody>Dialog content</DialogBody>
        </Dialog>,
      );
      expect(screen.getByText("Dialog content")).toBeInTheDocument();
    });

    test("DialogTitle renders as an h2 by default", () => {
      render(
        <Dialog open={true} onClose={() => {}}>
          <DialogTitle>My Title</DialogTitle>
          <DialogBody>Body</DialogBody>
        </Dialog>,
      );
      const title = screen.getByText("My Title");
      expect(title.tagName).toBe("H2");
      // Default variant title is left-aligned (no text-center)
      expect(title.className).not.toMatch(/text-center/);
    });

    test("DialogBody uses mt-6 spacing", () => {
      render(
        <Dialog open={true} onClose={() => {}}>
          <DialogBody data-testid="body">Body</DialogBody>
        </Dialog>,
      );
      expect(screen.getByTestId("body").className).toMatch(/mt-6/);
    });

    test("DialogActions uses mt-8 spacing", () => {
      render(
        <Dialog open={true} onClose={() => {}}>
          <DialogActions data-testid="actions">action</DialogActions>
        </Dialog>,
      );
      expect(screen.getByTestId("actions").className).toMatch(/mt-8/);
    });

    test("accepts size prop", () => {
      render(
        <Dialog open={true} onClose={() => {}} size="xl">
          <DialogBody>Sized dialog</DialogBody>
        </Dialog>,
      );
      expect(screen.getByText("Sized dialog")).toBeInTheDocument();
    });
  });

  describe('variant="alert"', () => {
    test("DialogTitle is center-aligned on mobile in alert variant", () => {
      render(
        <Dialog open={true} onClose={() => {}} variant="alert">
          <DialogTitle>Confirm</DialogTitle>
        </Dialog>,
      );
      const title = screen.getByText("Confirm");
      expect(title.className).toMatch(/text-center/);
      expect(title.className).toMatch(/sm:text-left/);
    });

    test("DialogBody uses mt-4 spacing (tighter than default)", () => {
      render(
        <Dialog open={true} onClose={() => {}} variant="alert">
          <DialogBody data-testid="body">Body</DialogBody>
        </Dialog>,
      );
      expect(screen.getByTestId("body").className).toMatch(/mt-4/);
      expect(screen.getByTestId("body").className).not.toMatch(/mt-6/);
    });

    test("DialogActions uses mt-6 sm:mt-4 spacing", () => {
      render(
        <Dialog open={true} onClose={() => {}} variant="alert">
          <DialogActions data-testid="actions">action</DialogActions>
        </Dialog>,
      );
      expect(screen.getByTestId("actions").className).toMatch(/mt-6/);
      expect(screen.getByTestId("actions").className).toMatch(/sm:mt-4/);
    });

    test("DialogDescription is center-aligned on mobile", () => {
      render(
        <Dialog open={true} onClose={() => {}} variant="alert">
          <DialogTitle>Confirm</DialogTitle>
          <DialogDescription>Are you sure?</DialogDescription>
        </Dialog>,
      );
      const desc = screen.getByText("Are you sure?");
      expect(desc.className).toMatch(/text-center/);
      expect(desc.className).toMatch(/sm:text-left/);
    });
  });
});

describe("Alert (deprecated aliases)", () => {
  test("<Alert> renders the alert variant of Dialog", () => {
    render(
      <Alert open={true} onClose={() => {}}>
        <AlertTitle>Warning</AlertTitle>
        <AlertBody data-testid="alert-body">Please confirm</AlertBody>
      </Alert>,
    );
    // Title should have alert-variant centering
    expect(screen.getByText("Warning").className).toMatch(/text-center/);
    // Body should use alert's mt-4
    expect(screen.getByTestId("alert-body").className).toMatch(/mt-4/);
  });

  test("AlertTitle / AlertActions / AlertDescription are the Dialog equivalents", () => {
    render(
      <Alert open={true} onClose={() => {}}>
        <AlertTitle>T</AlertTitle>
        <AlertDescription>D</AlertDescription>
        <AlertActions data-testid="actions">A</AlertActions>
      </Alert>,
    );
    // Actions renders with alert-variant spacing (mt-6 sm:mt-4)
    expect(screen.getByTestId("actions").className).toMatch(/mt-6/);
    expect(screen.getByTestId("actions").className).toMatch(/sm:mt-4/);
  });
});
