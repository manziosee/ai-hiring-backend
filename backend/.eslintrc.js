module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    // Only basic syntax checking, no type checking
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'no-debugger': 'warn',
  },
};