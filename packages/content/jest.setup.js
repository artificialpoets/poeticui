/* eslint-disable @typescript-eslint/no-require-imports -- Jest setup runs in Node CJS */
require('@testing-library/jest-dom')

// Polyfill ResizeObserver for jsdom — HeadlessUI uses it internally
// (via SegmentedTabs wrapped by <PersistentTabs>).
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}
