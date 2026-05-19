/**
 * @artificialpoets/poeticui — convenience barrel.
 *
 * Re-exports the entire surface of @artificialpoets/components. Tokens are
 * CSS-only and consumed via the `./styles/tokens` subpath, not from here.
 *
 * Two valid import styles:
 *
 * @example
 * // Barrel — simplest:
 * import { Button, Card, Heading } from "@artificialpoets/poeticui";
 *
 * @example
 * // Subpath — explicit, helps some bundlers tree-shake:
 * import { Button } from "@artificialpoets/poeticui/core";
 * import { Card } from "@artificialpoets/poeticui/data-display";
 *
 * For technical-content primitives (CodeBlock, Math, tabs), install
 * `@artificialpoets/content` separately. It carries heavy peer deps
 * (Shiki, KaTeX) and isn't pulled in here.
 */
export * from "@artificialpoets/components";
