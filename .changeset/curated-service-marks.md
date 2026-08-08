---
"@artificialpoets/components": minor
---

ServiceIcon draws far more brands, and draws the hard ones properly.

The simple-icons map grows to cover the services our sites actually name,
and brands simple-icons cannot ship (AWS, Azure, OpenAI, LinkedIn, Slack,
Salesforce, Tableau) are now hand-curated SVGs rather than a Lucide glyph
tinted to a brand hex. Curated marks may carry their own viewBox and
multiple paths, which real artwork often needs and a forced 24x24 square
would distort.

Each curated entry records where its artwork came from, and the header
states the rule the licences do not: every one of these is trademarked
regardless of the artwork's licence, so they identify the services we
integrate with, never endorsement — and a mark is never redrawn by hand.

No public API change: ServiceIcon's props and SERVICE_ICON_NAMES are
unchanged, and the curated-icon type is internal.
