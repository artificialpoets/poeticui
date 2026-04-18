"use client";

import clsx from "clsx";
import dayjs from "dayjs";
import { useMemo } from "react";

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

  return (
    <div
      className={clsx("flex flex-col", className)}
      data-testid="date-range-calendar"
    >
      <div className="flex flex-col gap-6 overflow-y-auto overflow-x-hidden">
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
            >
              <div className="date-range-calendar-month-label">
                {monthLabel}
              </div>
              <div className="date-range-calendar-weekdays">
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
                      onClick={() => onSelectDate?.(dateStr)}
                      disabled={!isSelectable}
                      className={clsx(
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
