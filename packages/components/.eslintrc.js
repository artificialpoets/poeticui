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
  },
};
