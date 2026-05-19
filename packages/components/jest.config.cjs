/* eslint-disable @typescript-eslint/no-require-imports -- Jest config runs in Node CJS */
const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: __dirname })

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/__mocks__/styleMock.js',
  },
  testPathIgnorePatterns: ['/node_modules/'],
}

module.exports = createJestConfig(customJestConfig)
