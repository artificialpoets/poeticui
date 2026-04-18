/* eslint-disable @typescript-eslint/no-require-imports -- Jest config runs in Node CJS */

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
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
    '^@poeticui/components/(.+)$': '<rootDir>/../components/src/$1/index.ts',
    '^@poeticui/components$': '<rootDir>/../components/src/index.ts',
    '^@poeticui/tokens$': '<rootDir>/../tokens/src/index.ts',
  },
  testPathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
}
