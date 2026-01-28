import { describe, expect, it } from 'vitest'

import { toDateValue } from './DateHelper'

describe('toDateValue', () => {
  it('converts a Date into a DateValue', () => {
    const date = new Date(2026, 0, 28)

    expect(toDateValue(date).toString()).toBe('2026-01-28')
  })
})
