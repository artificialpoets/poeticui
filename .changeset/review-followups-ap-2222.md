---
"@artificialpoets/components": patch
"@artificialpoets/tokens": patch
---

Follow-ups from the reviews of the AP-2222 audit (AP-2222).

- `DateRangePicker` / `Calendar`: the days are one Tab stop (a roving tabindex) instead of one per day, so Cancel and Apply are one Tab past the calendar. Arrow keys move a day or a week, Home and End go to the start and end of the week, PageUp and PageDown move a month. Tab lands on the range end, or the day last moved to. `aria-pressed` is true only on the range start and end; the days between are shaded, not pressed. Each month is a labelled group.
- `Dialog`: the backdrop (`.modal-backdrop`) uses `bg-overlay` like drawers and sidebars. It was `foreground` at 15% and 50%, which turned it light grey in dark mode.
- `NavbarItem` and `SidebarItem` keep a caller's `aria-current` (for example `"step"`) when `current` is not set. `current` still sets `"page"`.
- `Tabs` and `SegmentedTabs`: in forced colors the selected tab's focus outline is the system `Highlight` colour. `forced-color-adjust-none` had kept it in the brand colour.
- `Table`: the scroll wrapper stays a Tab stop while it has focus, so focus is not dropped when a resize stops the table overflowing.
- Tokens docs: `--overlay` is listed in the README. The README, `semantic.css` and the components CONTRIBUTING now say `--primary-text` was tuned on the AP orange: a green-to-cyan primary (hue about 125° to 240°) can read as low as 3.8:1 on white. A test sweeps every hue.
