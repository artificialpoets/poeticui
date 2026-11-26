// jest.setup.cjs loads @testing-library/jest-dom at runtime; this gives
// TypeScript its matchers (toBeInTheDocument, toHaveAttribute…) too.
import "@testing-library/jest-dom";
