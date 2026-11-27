import { act, fireEvent, render, screen, within } from "@testing-library/react";
import dayjs from "dayjs";
import React from "react";

import { Calendar } from "../../forms/date-range-picker/calendar";

describe("Calendar day buttons", () => {
  const renderCalendar = () =>
    render(
      <Calendar
        from="2026-11-02"
        to="2026-11-04"
        selectingRange
        onSelectDate={() => {}}
      />,
    );
  const day = (date: string) => screen.getByTestId(`calendar-day-${date}`);
  const tabStops = () =>
    within(screen.getByTestId("date-range-calendar"))
      .getAllByRole("button")
      .filter((button) => button.tabIndex === 0);

  test("are named by their full date; only the range start and end are pressed", () => {
    renderCalendar();
    expect(day("2026-11-02")).toHaveAttribute(
      "aria-label",
      "Monday, November 2, 2026",
    );
    // A day between the ends says so; pressed alone would read "not pressed".
    expect(day("2026-11-03")).toHaveAttribute(
      "aria-label",
      "Tuesday, November 3, 2026, in range",
    );
    expect(day("2026-11-02")).toHaveAttribute("aria-pressed", "true");
    expect(day("2026-11-04")).toHaveAttribute("aria-pressed", "true");
    // In the range, so shaded, but not one of the chosen dates.
    expect(day("2026-11-03")).toHaveAttribute("aria-pressed", "false");
    expect(day("2026-11-20")).toHaveAttribute("aria-pressed", "false");
  });

  test("are one Tab stop, on the range end", () => {
    renderCalendar();
    expect(tabStops()).toEqual([day("2026-11-04")]);
  });

  test("arrow keys, Home/End and PageUp/PageDown move focus and the Tab stop", () => {
    renderCalendar();
    act(() => day("2026-11-04").focus());
    const press = (key: string, expected: string) => {
      fireEvent.keyDown(document.activeElement as Element, { key });
      expect(document.activeElement).toBe(day(expected));
      expect(tabStops()).toEqual([day(expected)]);
    };
    press("ArrowRight", "2026-11-05");
    press("ArrowLeft", "2026-11-04");
    press("ArrowDown", "2026-11-11");
    press("ArrowUp", "2026-11-04");
    press("Home", "2026-11-01"); // Sunday
    press("End", "2026-11-07"); // Saturday
    press("PageUp", "2026-10-07");
    press("PageDown", "2026-11-07");
  });

  test("movement stops at the first and last day shown", () => {
    render(
      <Calendar
        from="2025-07-01"
        to="2025-07-01"
        selectingRange
        onSelectDate={() => {}}
      />,
    );
    act(() => day("2025-07-01").focus());
    fireEvent.keyDown(document.activeElement as Element, { key: "ArrowUp" });
    expect(document.activeElement).toBe(day("2025-07-01"));

    const last = dayjs().endOf("month").format("YYYY-MM-DD");
    act(() => day(last).focus());
    fireEvent.keyDown(document.activeElement as Element, { key: "PageDown" });
    expect(document.activeElement).toBe(day(last));
  });

  test("Alt, Ctrl and Meta combinations are left to the browser", () => {
    renderCalendar();
    act(() => day("2026-11-04").focus());
    for (const modifier of ["altKey", "ctrlKey", "metaKey"]) {
      const event = fireEvent.keyDown(day("2026-11-04"), {
        key: "ArrowLeft",
        [modifier]: true,
      });
      expect(event).toBe(true); // not prevented
      expect(document.activeElement).toBe(day("2026-11-04"));
    }
  });

  test("a new range moves the Tab stop back to the range end", () => {
    const { rerender } = renderCalendar();
    act(() => day("2026-11-04").focus());
    fireEvent.keyDown(day("2026-11-04"), { key: "PageUp" });
    expect(tabStops()).toEqual([day("2026-10-04")]);
    // e.g. the user picks a preset
    rerender(
      <Calendar
        from="2026-11-10"
        to="2026-11-16"
        selectingRange
        onSelectDate={() => {}}
      />,
    );
    expect(tabStops()).toEqual([day("2026-11-16")]);
  });

  test("a cleared end date leaves the Tab stop on the start, not the first month", () => {
    render(
      <Calendar
        from="2026-11-02"
        to=""
        selectingRange
        onSelectDate={() => {}}
      />,
    );
    expect(tabStops()).toEqual([day("2026-11-02")]);
  });

  test("a timestamp range still has a Tab stop and pressed ends", () => {
    render(
      <Calendar
        from="2026-11-02T09:30:00"
        to="2026-11-04T18:00:00"
        selectingRange
        onSelectDate={() => {}}
      />,
    );
    expect(tabStops()).toEqual([day("2026-11-04")]);
    expect(day("2026-11-02")).toHaveAttribute("aria-pressed", "true");
    expect(day("2026-11-04")).toHaveAttribute("aria-pressed", "true");
  });

  test("a click moves the Tab stop to the clicked day", () => {
    renderCalendar();
    fireEvent.click(day("2026-11-12"));
    expect(tabStops()).toEqual([day("2026-11-12")]);
  });
});
