import { describe, expect, it } from 'vitest'
import {
  buildFilterTree,
  describeCondition,
  emptyFilterState,
  encodeFilter,
  type FilterCondition,
  type FilterState,
  flattenConditions,
  newCondition,
  newGroup,
  parseFilterTree,
  removeConditionById
} from '@/Pages/App/Document/_Components/filterTree'

const stateWith = (...children: FilterState['builder']['children']): FilterState => ({
  builder: { ...newGroup('and'), children }
})

const condition = (overrides: Partial<FilterCondition>): FilterCondition => ({
  ...newCondition(),
  ...overrides
})

describe('buildFilterTree', () => {
  it('builds an empty tree without any conditions', () => {
    expect(buildFilterTree(emptyFilterState())).toEqual({ and: [] })
  })

  it('builds a leaf for a title condition', () => {
    const tree = buildFilterTree(
      stateWith(condition({ field: 'title', operator: 'like', value: 'Rechnung' }))
    )

    expect(tree).toEqual({
      and: [{ field: 'title', operator: 'like', value: '%Rechnung%' }]
    })
  })

  it('builds a between leaf for a date range', () => {
    const tree = buildFilterTree(
      stateWith(
        condition({
          field: 'issued_on',
          operator: 'between',
          value: ['2026-05-01', '2026-05-30']
        })
      )
    )

    expect(tree).toEqual({
      and: [{ field: 'issued_on', operator: 'between', value: ['2026-05-01', '2026-05-30'] }]
    })
  })

  it('builds a nested or group for any selected tags', () => {
    const tree = buildFilterTree(
      stateWith(condition({ field: 'tags', operator: 'any', value: [12, 15] }))
    )

    expect(tree).toEqual({
      and: [
        {
          or: [
            { field: 'tags.id', operator: 'eq', value: 12 },
            { field: 'tags.id', operator: 'eq', value: 15 }
          ]
        }
      ]
    })
  })

  it('builds a nested and group for all selected tags', () => {
    const tree = buildFilterTree(
      stateWith(condition({ field: 'tags', operator: 'all', value: [12, 15] }))
    )

    expect(tree).toEqual({
      and: [
        {
          and: [
            { field: 'tags.id', operator: 'eq', value: 12 },
            { field: 'tags.id', operator: 'eq', value: 15 }
          ]
        }
      ]
    })
  })

  it('wraps root or-children in a single or group', () => {
    const builder = {
      ...newGroup('or'),
      children: [
        condition({ field: 'title', operator: 'like', value: 'A' }),
        condition({ field: 'title', operator: 'like', value: 'B' })
      ]
    }

    expect(buildFilterTree({ builder })).toEqual({
      and: [
        {
          or: [
            { field: 'title', operator: 'like', value: '%A%' },
            { field: 'title', operator: 'like', value: '%B%' }
          ]
        }
      ]
    })
  })

  it('drops empty conditions and empty groups', () => {
    const empty = { ...newGroup('or'), children: [condition({ field: 'title', value: '' })] }

    expect(buildFilterTree(stateWith(condition({ field: 'title', value: '' }), empty))).toEqual({
      and: []
    })
  })
})

describe('parseFilterTree', () => {
  it('parses a complex tree into editable conditions', () => {
    const state = parseFilterTree({
      and: [
        { field: 'is_hidden', operator: 'eq', value: 0 },
        { field: 'issued_on', operator: 'between', value: ['2026-05-01', '2026-05-30'] },
        {
          or: [
            { field: 'tags.id', operator: 'eq', value: 12 },
            { field: 'tags.id', operator: 'eq', value: 15 }
          ]
        }
      ]
    })

    expect(state.builder.children).toHaveLength(2)

    const [date, tags] = state.builder.children

    expect(date).toMatchObject({
      type: 'condition',
      field: 'issued_on',
      operator: 'between',
      value: ['2026-05-01', '2026-05-30']
    })
    expect(tags).toMatchObject({
      type: 'condition',
      field: 'tags',
      operator: 'any',
      value: [12, 15]
    })
  })

  it('drops legacy is_hidden conditions', () => {
    const state = parseFilterTree({ and: [{ field: 'is_hidden', operator: 'eq', value: 1 }] })

    expect(state.builder.children).toEqual([])
  })

  it('coerces numeric field values from legacy string queries', () => {
    const state = parseFilterTree({
      and: [
        { field: 'sender_contact_id', operator: 'eq', value: '204' },
        { field: 'document_type_id', operator: 'eq', value: '7' }
      ]
    })

    const [sender, type] = state.builder.children

    expect(sender).toMatchObject({ field: 'sender_contact_id', value: 204 })
    expect(type).toMatchObject({ field: 'document_type_id', value: 7 })
  })

  it('describes a contact condition with the resolved name for legacy string ids', () => {
    const contacts = [
      { id: 204, full_name: 'Acme GmbH', reverse_full_name: 'Acme GmbH' }
    ] as unknown as App.Data.ContactData[]

    const state = parseFilterTree({
      and: [
        {
          or: [
            { field: 'sender_contact_id', operator: 'eq', value: '204' },
            { field: 'receiver_contact_id', operator: 'eq', value: '204' }
          ]
        }
      ]
    })

    const [sender, receiver] = flattenConditions(state.builder)

    expect(describeCondition(sender, { contacts })).toBe('Absender: Acme GmbH')
    expect(describeCondition(receiver, { contacts })).toBe('Empfänger: Acme GmbH')
  })

  it('round-trips a title condition stripping wildcards', () => {
    const state = parseFilterTree(
      buildFilterTree(stateWith(condition({ field: 'title', operator: 'like', value: 'Rechnung' })))
    )

    expect(flattenConditions(state.builder)[0]).toMatchObject({
      field: 'title',
      operator: 'like',
      value: 'Rechnung'
    })
  })

  it('round-trips an any-tags condition', () => {
    const state = parseFilterTree(
      buildFilterTree(stateWith(condition({ field: 'tags', operator: 'any', value: [12, 15] })))
    )

    expect(flattenConditions(state.builder)[0]).toMatchObject({
      field: 'tags',
      operator: 'any',
      value: [12, 15]
    })
  })

  it('round-trips an all-tags condition', () => {
    const state = parseFilterTree(
      buildFilterTree(stateWith(condition({ field: 'tags', operator: 'all', value: [12, 15] })))
    )

    expect(flattenConditions(state.builder)[0]).toMatchObject({
      field: 'tags',
      operator: 'all',
      value: [12, 15]
    })
  })

  it('returns an empty state for malformed input', () => {
    for (const input of [null, 'nope', 42]) {
      const state = parseFilterTree(input)

      expect(state.builder.combinator).toBe('and')
      expect(state.builder.children).toEqual([])
    }
  })
})

describe('encodeFilter', () => {
  it('produces a JSON string that parses back into the same conditions', () => {
    const state = stateWith(condition({ field: 'tags', operator: 'any', value: [12, 15] }))
    const encoded = encodeFilter(state)

    expect(typeof encoded).toBe('string')

    const parsed = parseFilterTree(encoded)

    expect(flattenConditions(parsed.builder)[0]).toMatchObject({
      field: 'tags',
      operator: 'any',
      value: [12, 15]
    })
  })

  it('round-trips a deep nested group without loss', () => {
    const nested = {
      ...newGroup('or'),
      children: [condition({ field: 'tags', operator: 'any', value: [6] })]
    }
    const state = stateWith(condition({ field: 'title', operator: 'like', value: 'A' }), nested)
    const encoded = encodeFilter(state)

    expect(encodeFilter(parseFilterTree(encoded))).toBe(encoded)
  })
})

describe('builder helpers', () => {
  it('flattens conditions across nested groups', () => {
    const first = condition({ field: 'title' })
    const second = condition({ field: 'issued_on' })
    const third = condition({ field: 'tags' })
    const builder = {
      ...newGroup('and'),
      children: [first, { ...newGroup('or'), children: [second, third] }]
    }

    expect(flattenConditions(builder)).toEqual([first, second, third])
  })

  it('removes a condition from a nested group by id', () => {
    const first = condition({ field: 'title' })
    const second = condition({ field: 'issued_on' })
    const builder = {
      ...newGroup('and'),
      children: [first, { ...newGroup('or'), children: [second] }]
    }

    expect(flattenConditions(removeConditionById(builder, second.id))).toEqual([first])
  })

  it('describes a title condition', () => {
    expect(
      describeCondition(condition({ field: 'title', operator: 'like', value: 'Rechnung' }))
    ).toBe('Titel enthält „Rechnung“')
  })

  it('describes a date range condition', () => {
    const label = describeCondition(
      condition({ field: 'issued_on', operator: 'between', value: ['2026-05-01', '2026-05-30'] })
    )

    expect(label).toContain('Datum:')
    expect(label).toContain('–')
  })
})
