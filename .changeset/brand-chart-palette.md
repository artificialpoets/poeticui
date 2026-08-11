---
"@artificialpoets/tokens": minor
---

Chart ramp: the ten brand data-viz colors, and one color per slot in both modes

`--chart-1` … `--chart-10` now carry the brand data-viz palette. Slot order is
unchanged, so a chart that used `--chart-3` still uses `--chart-3` — only the
color it resolves to moves:

| slot | was | now | brand |
| --- | --- | --- | --- |
| `--chart-1` | `blue-500` | `blue-500` | Blue `#2874D7` |
| `--chart-2` | `rose-500` | `rose-600` | Rose `#DE3A74` |
| `--chart-3` | `violet-500` | `violet-600` | Violet `#906DCC` |
| `--chart-4` | `amber-500` | `amber-500` | Amber `#FF9501` |
| `--chart-5` | `orange-500` | `orange-500` | Orange `#FC4903` |
| `--chart-6` | `cyan-500` | `sky-500` | Sky `#27B4D7` |
| `--chart-7` | `fuchsia-500` | `indigo-600` | Indigo `#7078D8` |
| `--chart-8` | `teal-500` | `yellow-500` | Yellow `#FFC801` |
| `--chart-9` | `pink-500` | `red-600` | Red `#E8362A` |
| `--chart-10` | `lime-500` | `lime-400` | Lime `#B2BF2D` |

Every one of the ten already existed in the palette, so this stays a
palette-reference change — no literals enter the semantic layer.

The ramp is also mode-invariant now. It used to be declared twice, and the two
copies had drifted: `--chart-3` was violet in light and amber in dark, `--chart-4`
the reverse. A series changed color when the reader flipped the theme, which
silently re-labels the data against its own legend. The ten are declared in
`:root` only and inherit into dark; the `.dark` copy is gone.

Themes may still override the ramp, in both modes or one.
