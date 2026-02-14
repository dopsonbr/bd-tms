//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  { ignores: ['.output/**', '.worktrees/**', '.nitro/**', '*.config.js', '*.config.mjs'] },
  ...tanstackConfig,
]
