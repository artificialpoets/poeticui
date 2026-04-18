import dayjs from "dayjs";

export type PresetId =
  | "today"
  | "yesterday"
  | "this_week"
  | "last_7_days"
  | "last_week"
  | "last_28_days"
  | "last_30_days"
  | "this_month"
  | "last_month"
  | "last_90_days"
  | "quarter_to_date"
  | "this_year"
  | "last_calendar_year"
  | "custom";

export interface DateRange {
  from: string;
  to: string;
}

export interface PresetOption {
  id: PresetId;
  label: string;
}

export const PRESETS: PresetOption[] = [
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "this_week", label: "This week (Sun - Today)" },
  { id: "last_7_days", label: "Last 7 days" },
  { id: "last_week", label: "Last week (Sun - Sat)" },
  { id: "last_28_days", label: "Last 28 days" },
  { id: "last_30_days", label: "Last 30 days" },
  { id: "this_month", label: "This month" },
  { id: "last_month", label: "Last month" },
  { id: "last_90_days", label: "Last 90 days" },
  { id: "quarter_to_date", label: "Quarter to date" },
  { id: "this_year", label: "This year (Jan - Today)" },
  { id: "last_calendar_year", label: "Last calendar year" },
  { id: "custom", label: "Custom" },
];

function formatYYYYMMDD(d: dayjs.Dayjs): string {
  return d.format("YYYY-MM-DD");
}

/**
 * Returns the date range for a preset. Uses local time. Week starts Sunday.
 * For 'custom' returns today–today (caller should use calendar selection).
 */
export function getRangeForPreset(
  presetId: PresetId,
  refDate: Date = new Date(),
): DateRange {
  const today = dayjs(refDate).startOf("day");
  let from = today;
  let to = today;

  switch (presetId) {
    case "today":
      break;
    case "yesterday": {
      const y = today.subtract(1, "day");
      from = y;
      to = y;
      break;
    }
    case "this_week": {
      // Sunday = 0 in dayjs; startOf('week') is Monday by default, so we adjust
      const dayOfWeek = today.day();
      const sunday = today.subtract(dayOfWeek, "day");
      from = sunday;
      to = today;
      break;
    }
    case "last_7_days":
      from = today.subtract(6, "day");
      to = today;
      break;
    case "last_week": {
      const dayOfWeek = today.day();
      const lastSunday = today.subtract(dayOfWeek + 7, "day");
      const lastSaturday = lastSunday.add(6, "day");
      from = lastSunday;
      to = lastSaturday;
      break;
    }
    case "last_28_days":
      from = today.subtract(27, "day");
      to = today;
      break;
    case "last_30_days":
      from = today.subtract(29, "day");
      to = today;
      break;
    case "this_month":
      from = today.startOf("month");
      to = today;
      break;
    case "last_month": {
      const firstThisMonth = today.startOf("month");
      const lastMonthEnd = firstThisMonth.subtract(1, "day");
      from = lastMonthEnd.startOf("month");
      to = lastMonthEnd;
      break;
    }
    case "last_90_days":
      from = today.subtract(89, "day");
      to = today;
      break;
    case "quarter_to_date": {
      const month = today.month();
      const quarterStartMonth = Math.floor(month / 3) * 3;
      from = today.month(quarterStartMonth).startOf("month");
      to = today;
      break;
    }
    case "this_year":
      from = today.startOf("year");
      to = today;
      break;
    case "last_calendar_year": {
      const lastYear = today.year() - 1;
      from = dayjs(refDate).year(lastYear).startOf("year");
      to = dayjs(refDate).year(lastYear).endOf("year");
      break;
    }
    case "custom":
      break;
    default:
      from = today.subtract(29, "day");
      to = today;
  }

  return { from: formatYYYYMMDD(from), to: formatYYYYMMDD(to) };
}

/**
 * Returns the preset id that matches the given range, or null if none (e.g. custom).
 */
export function getPresetIdForRange(
  range: DateRange,
  refDate: Date = new Date(),
): PresetId | null {
  const { from, to } = range;
  for (const preset of PRESETS) {
    if (preset.id === "custom") continue;
    const presetRange = getRangeForPreset(preset.id, refDate);
    if (presetRange.from === from && presetRange.to === to) return preset.id;
  }
  return null;
}

/**
 * Human-readable label for a range: preset label or formatted dates.
 */
export function getLabelForRange(
  range: DateRange,
  refDate: Date = new Date(),
): string {
  const presetId = getPresetIdForRange(range, refDate);
  if (presetId) {
    const preset = PRESETS.find((p) => p.id === presetId);
    return preset?.label ?? formatRangeFallback(range);
  }
  return formatRangeFallback(range);
}

function formatRangeFallback(range: DateRange): string {
  const fromFormatted = dayjs(range.from).format("MMM D, YYYY");
  const toFormatted = dayjs(range.to).format("MMM D, YYYY");
  return `${fromFormatted} – ${toFormatted}`;
}
