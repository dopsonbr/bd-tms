import { describe, expect, it } from 'vitest'

import { buildSeedSnapshot } from '@/data/seed/build-seed'
import { validateSeedIntegrity } from '@/domain/guards'

describe('seed snapshot', () => {
  it('creates deterministic entity counts', () => {
    const seed = buildSeedSnapshot()
    expect(seed.trucks).toHaveLength(45)
    expect(seed.drivers).toHaveLength(30)
    expect(seed.loads).toHaveLength(80)
    expect(seed.shippers).toHaveLength(15)
    expect(seed.carriers).toHaveLength(25)
  })

  it('passes integrity checks', () => {
    const seed = buildSeedSnapshot()
    expect(validateSeedIntegrity(seed)).toEqual([])
  })
})
