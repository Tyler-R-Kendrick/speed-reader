module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'lit', 'sonarjs', 'unicorn'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:lit/recommended',
    'plugin:sonarjs/recommended-legacy',
    'plugin:unicorn/recommended'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'lit/no-invalid-html': 'off',
    'no-console': 'warn',
    'complexity': ['warn', 20],
    'max-depth': ['warn', 4],
    'max-lines-per-function': ['warn', 75],
    'sonarjs/cognitive-complexity': ['warn', 20],
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/filename-case': 'off',
    'sonarjs/public-static-readonly': 'off',
    'sonarjs/unused-import': 'off',
    'sonarjs/no-skipped-tests': 'off',
    'sonarjs/slow-regex': 'off',
    'sonarjs/no-nested-conditional': 'off',
    'unicorn/template-indent': 'off',
    'unicorn/better-regex': 'off',
    'unicorn/numeric-separators-style': 'off',
    'unicorn/prefer-number-properties': 'off',
    'unicorn/switch-case-braces': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-null': 'off',
    'unicorn/no-useless-undefined': 'off',
    'sonarjs/no-duplicate-string': 'warn'
  }
};
