/* eslint-disable @typescript-eslint/no-require-imports -- Jest config runs in Node CJS */

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
        },
      },
    ],
  },
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/__mocks__/styleMock.js',
    // Resolve workspace package subpaths directly to source during tests.
    '^@artificialpoets/components/(.+)$': '<rootDir>/../components/src/$1/index.ts',
    '^@artificialpoets/components$': '<rootDir>/../components/src/index.ts',
    '^@artificialpoets/tokens$': '<rootDir>/../tokens/src/index.ts',
    // Shiki is ESM-only and its transitive deps can't be evaluated by
    // Jest's default CJS runtime. Unit tests use a minimal mock that
    // emits Shiki-shaped HTML — enough to verify wrapper logic (lang
    // fallback, className passthrough, custom-highlighter handoff).
    // Real Shiki output is verified visually via Storybook + the static
    // build pipeline.
    '^shiki$': '<rootDir>/src/__tests__/mocks/shiki.ts',
  },
  testPathIgnorePatterns: ['/node_modules/'],
  testRegex: '/__tests__/(?!mocks/).*\\.test\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
}
