---
"@artificialpoets/components": minor
---

DataTable learns an optional leading "#" column.

`rowNumbers="always"` shows each row's position in the current sort and
filter, counting across pages, so page 3 at 25 per page starts at 51.
`rowNumbers="auto"` shows it only when the unfiltered rows exceed
`rowNumbersThreshold` (default 10), and keeps it while the reader filters.
`showsRowNumbers(mode, total, threshold)` exposes the same decision for
hand-assembled tables.

Additive only. The default is `"never"`, so every table renders exactly as
it did.
