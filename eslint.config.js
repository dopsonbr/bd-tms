//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  {
    ignores: ['.output/**', 'node_modules/**', 'eslint.config.js', 'prettier.config.js'],
  },
  ...tanstackConfig,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      'import/order': 'off',
    },
  },
]
