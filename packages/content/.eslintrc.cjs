/**
 * @artificialpoets/content — ESLint config.
 *
 * Same neutral-boundary rules as @artificialpoets/components:
 * - no next/* imports (framework-agnostic)
 * - no @ap/brand imports (no brand coupling)
 * - no @/* or @ap/dashboard/* imports (no app coupling)
 *
 * This package depends on @artificialpoets/components + @artificialpoets/tokens; those
 * ARE allowed, since @artificialpoets/content sits downstream in the layer graph:
 *
 *   tokens → components → content → consumers (apps or @ap/brand)
 */
module.exports = {
  parser: '@typescript-eslint/parser',
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  parserOptions: {
    ecmaFeatures: { jsx: true },
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import', 'filename-rules'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
  ],
  root: true,
  env: {
    browser: true,
    es2022: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'filename-rules/match': [2, 'kebab-case'],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', ['parent', 'sibling', 'index']],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@ap/brand', '@ap/brand/*'],
            message:
              '@artificialpoets/content is neutral — @ap/brand must never be imported here.',
          },
          {
            group: ['next', 'next/*'],
            message:
              '@artificialpoets/content is framework-agnostic — no next/* imports. Works in Next App Router, Remix, Astro, plain SPAs.',
          },
          {
            group: ['@/*', '@ap/dashboard/*', '@ap/intranet/*', '@ap/poehost/*'],
            message:
              '@artificialpoets/content must not reach into app code. Arrows only point downward.',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['src/__tests__/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
  ],
};
