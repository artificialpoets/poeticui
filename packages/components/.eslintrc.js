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
  ignorePatterns: ['.eslintrc.js', '.storybook/**'],
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
    // ─── Neutral-boundary enforcement (RFC Step 7 / Principle P3) ──────
    // @poeticui/components is the public-ready neutral primitives package.
    // It must never depend on AP-specific code, Next.js, or app paths.
    // If a component truly needs something brand-flavored, factor it out
    // and put the brand-aware wrapper in @ap/brand — or, for generic
    // primitives that happen to need Next, export a neutral version here
    // and a Next-specific wrapper in the consumer app (DES-30 is the
    // template: Tabs neutral → QueryTabs in apps/dashboard).
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@ap/brand', '@ap/brand/*'],
            message:
              '@poeticui/components is neutral — @ap/brand must never be imported here. Move the dependency upward to @ap/brand itself, or find a neutral abstraction.',
          },
          {
            group: ['next', 'next/*'],
            message:
              '@poeticui/components is framework-agnostic — no next/* imports. Factor into a Next-specific wrapper in the app or in @ap/brand. See DES-30 (Tabs → QueryTabs) for the template.',
          },
          {
            group: ['@/*', '@ap/dashboard/*', '@ap/intranet/*', '@ap/poehost/*'],
            message:
              '@poeticui/components must not reach into app code. Arrows only point downward: apps/* → @ap/brand → @poeticui/components → @poeticui/tokens.',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      // Tests may relax the next/* ban if mocking router context is needed.
      // Prefer pure React testing, but don't block on it.
      files: ['src/__tests__/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
    {
      // FIXME (follow-up: file new issue "Decouple Link/Avatar from next/*"):
      // These two primitives still import next/link and next/image respectively.
      // They should be refactored into framework-agnostic versions (plain <a> +
      // <img>, or render-prop abstraction) — similar to how Tabs was decoupled
      // in DES-30. Allowlisted here until that refactor lands so the boundary
      // rule can still catch NEW violations in every other file.
      files: ['src/core/link.tsx', 'src/data-display/avatar.tsx'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
  ],
};
