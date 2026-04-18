"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import clsx from "clsx";
import dayjs from "dayjs";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Calendar } from "./calendar";
import {
  PRESETS,
  getRangeForPreset,
  getPresetIdForRange,
  getLabelForRange,
  type PresetId,
  type DateRange,
} from "./presets";

export interface DateRangePickerProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange: (value: DateRange) => void;
  className?: string;
}

const defaultRange = (): DateRange => getRangeForPreset("last_30_days");

export function DateRangePicker({
  value: controlledValue,
  defaultValue,
  onChange,
  className,
}: DateRangePickerProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<DateRange>(
    () => defaultValue ?? defaultRange(),
  );
  const value = isControlled ? controlledValue! : internalValue;

  const [draft, setDraft] = useState<DateRange>(value);
  const [activePreset, setActivePreset] = useState<PresetId>(
    () => getPresetIdForRange(value) ?? "custom",
  );
  const [customStart, setCustomStart] = useState<string | null>(null);
  const calendarScrollRef = useRef<HTMLDivElement>(null);
  const lastSyncedValueRef = useRef<DateRange>(value);

  const setCalendarScrollRef = useCallback((el: HTMLDivElement | null) => {
    (
      calendarScrollRef as React.MutableRefObject<HTMLDivElement | null>
    ).current = el;
    if (el) {
      const scrollToBottom = () => {
        el.scrollTop = el.scrollHeight;
      };
      requestAnimationFrame(() => requestAnimationFrame(scrollToBottom));
      setTimeout(scrollToBottom, 50);
      setTimeout(scrollToBottom, 200);
    }
  }, []);

  // Only sync draft from value when value actually changed (e.g. after Apply or external update).
  // Avoids overwriting the user's in-picker selection when the parent re-renders for other reasons.
  // Defer setState to avoid react-hooks/set-state-in-effect (sync setState in effect triggers cascading renders).
  useEffect(() => {
    if (
      value.from === lastSyncedValueRef.current.from &&
      value.to === lastSyncedValueRef.current.to
    ) {
      return;
    }
    lastSyncedValueRef.current = value;
    queueMicrotask(() => {
      setDraft(value);
      setActivePreset(getPresetIdForRange(value) ?? "custom");
    });
  }, [value.from, value.to, value]);

  useEffect(() => {
    const el = calendarScrollRef.current;
    if (!el) return;
    const scrollToBottom = () => {
      el.scrollTop = el.scrollHeight;
    };
    const runScroll = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToBottom);
      });
      const t = setTimeout(scrollToBottom, 150);
      return t;
    };
    // Scroll to bottom as soon as the panel is mounted so latest months are visible
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    timeoutId = runScroll();
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          clearTimeout(timeoutId);
          timeoutId = runScroll();
        }
      },
      { threshold: 0 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);

  const displayLabel = useMemo(() => getLabelForRange(value), [value]);

  const handlePresetClick = useCallback((presetId: PresetId) => {
    if (presetId === "custom") {
      setActivePreset("custom");
      setCustomStart(null);
      return;
    }
    setCustomStart(null);
    setActivePreset(presetId);
    const range = getRangeForPreset(presetId);
    setDraft(range);
  }, []);

  const handleCalendarSelect = useCallback(
    (dateStr: string) => {
      if (customStart === null) {
        setCustomStart(dateStr);
        setDraft({ from: dateStr, to: dateStr });
        return;
      }
      const [a, b] = [dayjs(customStart), dayjs(dateStr)].sort(
        (x, y) => x.valueOf() - y.valueOf(),
      );
      const nextRange = {
        from: a.format("YYYY-MM-DD"),
        to: b.format("YYYY-MM-DD"),
      };
      setDraft(nextRange);
      setActivePreset(getPresetIdForRange(nextRange) ?? "custom");
      setCustomStart(null);
    },
    [customStart],
  );

  const handleApply = useCallback(() => {
    if (isControlled) {
      onChange(draft);
    } else {
      setInternalValue(draft);
      onChange(draft);
    }
  }, [draft, isControlled, onChange]);

  const handleCancel = useCallback(() => {
    setDraft(value);
    setActivePreset(getPresetIdForRange(value) ?? "custom");
    setCustomStart(null);
  }, [value]);

  const startInput = draft.from;
  const endInput = draft.to;

  const setStartInput = useCallback((from: string) => {
    setDraft((prev) => {
      const next = { ...prev, from };
      setActivePreset(getPresetIdForRange(next) ?? "custom");
      return next;
    });
  }, []);
  const setEndInput = useCallback((to: string) => {
    setDraft((prev) => {
      const next = { ...prev, to };
      setActivePreset(getPresetIdForRange(next) ?? "custom");
      return next;
    });
  }, []);

  return (
    <Menu as="div" className={clsx("relative inline-block", className)}>
      <MenuButton className="date-range-trigger" aria-label="Time range">
        {displayLabel}
        <ChevronDown
          aria-hidden="true"
          className="-mr-0.5 size-5 text-muted-foreground"
        />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom start"
        portal={false}
        className="dropdown-panel date-range-dropdown w-[560px]"
      >
        <div className="flex max-h-[420px]">
          <div
            className="date-range-sidebar"
            role="listbox"
            aria-label="Date range presets"
          >
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                role="option"
                aria-selected={activePreset === preset.id}
                onClick={() => handlePresetClick(preset.id)}
                className={clsx(
                  "date-range-preset-btn",
                  activePreset === preset.id &&
                    "bg-primary/20 font-medium text-primary dark:bg-primary/30 dark:text-primary",
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="date-range-content">
            {/* Top row: Start date and End date */}
            <div className="grid grid-cols-2 gap-4 pb-4">
              <div>
                <label
                  htmlFor="date-range-start"
                  className="date-range-input-label"
                >
                  Start date
                </label>
                <input
                  id="date-range-start"
                  type="date"
                  value={startInput}
                  onChange={(e) => setStartInput(e.target.value)}
                  className="input-date"
                  data-testid="date-range-start-input"
                />
              </div>
              <div>
                <label
                  htmlFor="date-range-end"
                  className="date-range-input-label"
                >
                  End date
                </label>
                <input
                  id="date-range-end"
                  type="date"
                  value={endInput}
                  onChange={(e) => setEndInput(e.target.value)}
                  className="input-date"
                  data-testid="date-range-end-input"
                />
              </div>
            </div>
            {/* Scrollable row: months from July 2025 to current month; scroll to bottom when opened */}
            <div
              ref={setCalendarScrollRef}
              className="date-range-calendar-scroll"
            >
              <Calendar
                from={draft.from}
                to={draft.to}
                selectingRange={true}
                tempFrom={customStart}
                tempTo={customStart ? null : null}
                onSelectDate={handleCalendarSelect}
              />
            </div>
          </div>
        </div>

        <div className="date-range-footer">
          <MenuItem>
            <button
              type="button"
              onClick={handleCancel}
              className="date-range-btn-secondary"
              data-testid="date-range-cancel"
            >
              Cancel
            </button>
          </MenuItem>
          <MenuItem>
            <button
              type="button"
              onClick={handleApply}
              className="date-range-btn-primary"
              data-testid="date-range-apply"
            >
              Apply
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}
