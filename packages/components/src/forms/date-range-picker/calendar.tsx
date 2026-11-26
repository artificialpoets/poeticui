"use client";

import dayjs from "dayjs";
import { useCallback, useId, useMemo, useRef, useState } from "react";

import { cx } from "../../lib";

/** First month shown in the calendar (July 2025), like Google Analytics from 2017 to present */
const FIRST_CALENDAR_MONTH = dayjs("2025-07-01").startOf("month");

export interface CalendarProps {
  from: string;
  to: string;
  /** When true, clicking a day sets start or end of range (for Custom) */
  selectingRange?: boolean;
  /** Temporary range while selecting (e.g. hover or first click) */
  tempFrom?: string | null;
  tempTo?: string | null;
  onSelectDate?: (date: string) => void;
  className?: string;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function isInRange(
  date: string,
  from: string,
  to: string,
  tempFrom?: string | null,
  tempTo?: string | null,
): boolean {
  const d = dayjs(date);
  const a = tempFrom ?? from;
  const b = tempTo ?? to;
  const [start, end] = [dayjs(a), dayjs(b)].sort(
    (x, y) => x.valueOf() - y.valueOf(),
  );
  return (
    (d.isAfter(start) && d.isBefore(end)) ||
    d.isSame(start, "day") ||
    d.isSame(end, "day")
  );
}

function isStartOrEnd(
  date: string,
  from: string,
  to: string,
  tempFrom?: string | null,
  tempTo?: string | null,
): "start" | "end" | false {
  const a = tempFrom ?? from;
  const b = tempTo ?? to;
  const dateStr = dayjs(date).format("YYYY-MM-DD");
  if (dateStr === a) return "start";
  if (dateStr === b) return "end";
  return false;
}

/**
 * Arrow-key moves, as in the WAI-ARIA date picker pattern: a day, a week,
 * the start or end of the week, a month.
 */
function nextDate(date: dayjs.Dayjs, key: string): dayjs.Dayjs | null {
  switch (key) {
    case "ArrowLeft":
      return date.subtract(1, "day");
    case "ArrowRight":
      return date.add(1, "day");
    case "ArrowUp":
      return date.subtract(1, "week");
    case "ArrowDown":
      return date.add(1, "week");
    case "Home":
      return date.startOf("week");
    case "End":
      return date.endOf("week");
    case "PageUp":
      return date.subtract(1, "month");
    case "PageDown":
      return date.add(1, "month");
    default:
      return null;
  }
}

/**
 * The months from July 2025 to the current one, one day button per date.
 *
 * The days are one Tab stop (a roving tabindex): Tab lands on the range end,
 * or the last day moved to, and the arrow keys, Home/End and PageUp/PageDown
 * move between days. So a keyboard user reaches what follows the calendar
 * (the picker's Cancel and Apply) in one Tab, not one per day.
 *
 * @example
 * <Calendar
 *   from="2026-11-01"
 *   to="2026-11-07"
 *   selectingRange
 *   onSelectDate={(date) => console.log(date)}
 * />
 */
export function Calendar({
  from,
  to,
  selectingRange = false,
  tempFrom,
  tempTo,
  onSelectDate,
  className,
}: CalendarProps) {
  const today = useMemo(() => dayjs().format("YYYY-MM-DD"), []);
  const daysRef = useRef<HTMLDivElement>(null);
  const idPrefix = useId();
  // The day the user last moved to; until then the Tab stop follows the range.
  const [focusDate, setFocusDate] = useState<string | null>(null);

  const monthList = useMemo(() => {
    const list: dayjs.Dayjs[] = [];
    const endMonth = dayjs().endOf("month");
    let m = FIRST_CALENDAR_MONTH;
    while (m.isBefore(endMonth) || m.isSame(endMonth, "month")) {
      list.push(m);
      m = m.add(1, "month");
    }
    return list;
  }, []);

  const firstDate = monthList[0].format("YYYY-MM-DD");
  const lastDate = monthList[monthList.length - 1]
    .endOf("month")
    .format("YYYY-MM-DD");
  const clamp = useCallback(
    (date: string) =>
      date < firstDate ? firstDate : date > lastDate ? lastDate : date,
    [firstDate, lastDate],
  );
  // The one day in the Tab order. YYYY-MM-DD strings compare as dates.
  const tabStop = clamp(focusDate ?? tempFrom ?? to ?? today);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const current = target.dataset.date;
    if (!current) return;
    const next = nextDate(dayjs(current), event.key);
    if (!next) return;
    event.preventDefault();
    const nextStr = clamp(next.format("YYYY-MM-DD"));
    daysRef.current
      ?.querySelector<HTMLButtonElement>(`[data-date="${nextStr}"]`)
      ?.focus();
    setFocusDate(nextStr);
  };

  return (
    <div
      className={cx("flex flex-col", className)}
      data-testid="date-range-calendar"
    >
      <div
        ref={daysRef}
        onKeyDown={handleKeyDown}
        className="flex flex-col gap-6 overflow-y-auto overflow-x-hidden"
      >
        {monthList.map((monthStart) => {
          const monthLabel = monthStart.format("MMMM YYYY");
          const firstDay = monthStart.startOf("month");
          const dayOfWeek = firstDay.day();
          const daysInMonth = firstDay.daysInMonth();
          const leadingBlanks = dayOfWeek;
          const totalCells = leadingBlanks + daysInMonth;
          const rows = Math.ceil(totalCells / 7);

          return (
            <div
              key={monthStart.format("YYYY-MM")}
              className="date-range-calendar-month"
              role="group"
              aria-labelledby={`${idPrefix}-${monthStart.format("YYYY-MM")}`}
            >
              <div
                id={`${idPrefix}-${monthStart.format("YYYY-MM")}`}
                className="date-range-calendar-month-label"
              >
                {monthLabel}
              </div>
              <div className="date-range-calendar-weekdays" aria-hidden="true">
                {WEEKDAY_LABELS.map((label) => (
                  <div key={label}>{label}</div>
                ))}
              </div>
              <div className="mt-1 grid grid-cols-7 gap-0.5">
                {Array.from({ length: rows * 7 }, (_, i) => {
                  const dayIndex = i - leadingBlanks;
                  if (dayIndex < 0 || dayIndex >= daysInMonth) {
                    return <div key={i} className="aspect-square" />;
                  }
                  const d = firstDay.add(dayIndex, "day");
                  const dateStr = d.format("YYYY-MM-DD");
                  const isToday = dateStr === today;
                  const inRange = isInRange(
                    dateStr,
                    from,
                    to,
                    tempFrom,
                    tempTo,
                  );
                  const startOrEnd = isStartOrEnd(
                    dateStr,
                    from,
                    to,
                    tempFrom,
                    tempTo,
                  );
                  const isSelectable = selectingRange || !!onSelectDate;

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setFocusDate(dateStr);
                        onSelectDate?.(dateStr);
                      }}
                      disabled={!isSelectable}
                      tabIndex={dateStr === tabStop ? 0 : -1}
                      className={cx(
                        "date-range-calendar-day",
                        isSelectable && "date-range-calendar-day-selectable",
                        !isSelectable && "cursor-default",
                        inRange && "date-range-calendar-day-in-range",
                        startOrEnd && "date-range-calendar-day-edge",
                        isToday &&
                          !startOrEnd &&
                          !inRange &&
                          "date-range-calendar-day-today",
                      )}
                      // The visible label is only the day number; name the full date.
                      aria-label={d.format("dddd, MMMM D, YYYY")}
                      // Pressed marks the chosen dates, the range start and end;
                      // the days between are shaded, not chosen.
                      aria-pressed={
                        isSelectable ? Boolean(startOrEnd) : undefined
                      }
                      aria-current={isToday ? "date" : undefined}
                      data-date={dateStr}
                      data-testid={`calendar-day-${dateStr}`}
                    >
                      {d.date()}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
