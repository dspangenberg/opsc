import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FilterForm } from '@/Pages/App/Document/_Components/FilterForm'
import {
  type FilterCondition,
  type FilterState,
  flattenConditions,
  newCondition,
  newGroup
} from '@/Pages/App/Document/_Components/filterTree'

const tags = [
  { id: 12, name: 'Tag A', color: null, icon: null },
  { id: 15, name: 'Tag B', color: null, icon: null }
] as unknown as App.Data.DocumentTagData[]

const condition = (overrides: Partial<FilterCondition>): FilterCondition => ({
  ...newCondition(),
  ...overrides
})

const stateWith = (...children: FilterState['builder']['children']): FilterState => ({
  builder: { ...newGroup('and'), children }
})

const renderForm = (
  state: FilterState,
  overrides: Partial<React.ComponentProps<typeof FilterForm>> = {}
) =>
  render(
    <FilterForm
      contacts={[]}
      projects={[]}
      types={[]}
      tags={tags}
      state={state}
      isDirty={false}
      onStateChange={() => {}}
      onApply={() => {}}
      {...overrides}
    />
  )

describe('FilterForm', () => {
  it('renders a badge describing a title condition', () => {
    renderForm(stateWith(condition({ field: 'title', operator: 'like', value: 'Rechnung' })))

    expect(screen.getByText('Titel enthält „Rechnung“')).toBeInTheDocument()
  })

  it('renders a badge with the tag names for a tags condition', () => {
    renderForm(stateWith(condition({ field: 'tags', operator: 'any', value: [12, 15] })))

    expect(screen.getByText('Tags: Tag A, Tag B')).toBeInTheDocument()
  })

  it('removes a condition when its badge is dismissed', () => {
    const onStateChange = vi.fn()
    const target = condition({ field: 'title', operator: 'like', value: 'Rechnung' })

    renderForm(stateWith(target), { onStateChange })
    fireEvent.click(screen.getByRole('button', { name: 'Filter entfernen' }))

    const next = onStateChange.mock.calls[0][0] as FilterState

    expect(flattenConditions(next.builder)).toEqual([])
  })

  it('stages a new condition without applying it', () => {
    const onStateChange = vi.fn()
    const onApply = vi.fn()

    renderForm(stateWith(), { onStateChange, onApply })
    fireEvent.click(screen.getByRole('button', { name: 'Filter hinzufügen' }))
    fireEvent.click(screen.getByRole('button', { name: 'Bedingung' }))

    const next = onStateChange.mock.calls[0][0] as FilterState

    expect(next.builder.children).toHaveLength(1)
    expect(next.builder.children[0]).toMatchObject({ type: 'condition' })
    expect(onApply).not.toHaveBeenCalled()
  })

  it('switches the group combinator to or', () => {
    const onStateChange = vi.fn()

    renderForm(stateWith(), { onStateChange })
    fireEvent.click(screen.getByRole('button', { name: 'Filter hinzufügen' }))
    fireEvent.click(screen.getByRole('radio', { name: 'oder' }))

    const next = onStateChange.mock.calls.at(-1)?.[0] as FilterState

    expect(next.builder.combinator).toBe('or')
  })

  it('updates a tags condition when a tag is selected', () => {
    const onStateChange = vi.fn()

    renderForm(stateWith(condition({ field: 'tags', operator: 'any', value: [] })), {
      onStateChange
    })
    fireEvent.click(screen.getByRole('button', { name: 'Filter bearbeiten' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Tag A' }))

    const next = onStateChange.mock.calls.at(-1)?.[0] as FilterState

    expect(flattenConditions(next.builder)[0]).toMatchObject({ field: 'tags', value: [12] })
  })

  it('resets the staged filter state', () => {
    const onStateChange = vi.fn()

    renderForm(stateWith(condition({ field: 'title', operator: 'like', value: 'Rechnung' })), {
      onStateChange
    })
    fireEvent.click(screen.getByRole('button', { name: 'Filter bearbeiten' }))
    fireEvent.click(screen.getByRole('button', { name: 'Zurücksetzen' }))

    const next = onStateChange.mock.calls.at(-1)?.[0] as FilterState

    expect(flattenConditions(next.builder)).toEqual([])
  })

  it('applies the filter when the apply button is pressed', () => {
    const onApply = vi.fn()

    renderForm(stateWith(condition({ field: 'title', operator: 'like', value: 'Rechnung' })), {
      onApply
    })
    fireEvent.click(screen.getByRole('button', { name: 'Filter bearbeiten' }))
    fireEvent.click(screen.getByRole('button', { name: 'Filter anwenden' }))

    expect(onApply).toHaveBeenCalledTimes(1)
  })

  it('offers a toolbar apply button while there are unapplied changes', () => {
    const onApply = vi.fn()

    renderForm(stateWith(condition({ field: 'title', operator: 'like', value: 'Rechnung' })), {
      isDirty: true,
      onApply
    })

    fireEvent.click(screen.getByRole('button', { name: 'Filter anwenden' }))

    expect(onApply).toHaveBeenCalledTimes(1)
  })

  it('hides the toolbar apply button when there is nothing to apply', () => {
    renderForm(stateWith(condition({ field: 'title', operator: 'like', value: 'Rechnung' })))

    expect(screen.queryByRole('button', { name: 'Filter anwenden' })).not.toBeInTheDocument()
  })

  it('shows the encoded filter tree in an editable JSON textarea', () => {
    renderForm(stateWith(condition({ field: 'title', operator: 'like', value: 'Rechnung' })))

    fireEvent.click(screen.getByRole('button', { name: 'Filter bearbeiten' }))
    fireEvent.click(screen.getByRole('tab', { name: 'JSON' }))

    const textarea = screen.getByRole('textbox', { name: 'Filter-JSON' }) as HTMLTextAreaElement

    expect(textarea).toHaveClass('font-mono')
    expect(textarea.value).toContain('"field": "title"')
    expect(textarea.value).toContain('"value": "%Rechnung%"')
  })

  it('updates the filter state when edited JSON loses focus', () => {
    const onStateChange = vi.fn()

    renderForm(stateWith(condition({ field: 'title', operator: 'like', value: 'Rechnung' })), {
      onStateChange
    })
    fireEvent.click(screen.getByRole('button', { name: 'Filter bearbeiten' }))
    fireEvent.click(screen.getByRole('tab', { name: 'JSON' }))

    const textarea = screen.getByRole('textbox', { name: 'Filter-JSON' })

    fireEvent.change(textarea, {
      target: { value: '{"and":[{"field":"title","operator":"like","value":"Angebot"}]}' }
    })
    fireEvent.blur(textarea)

    const next = onStateChange.mock.calls.at(-1)?.[0] as FilterState

    expect(flattenConditions(next.builder)[0]).toMatchObject({ field: 'title', value: 'Angebot' })
  })

  it('keeps the previous filter state when the edited JSON is malformed', () => {
    const onStateChange = vi.fn()

    renderForm(stateWith(condition({ field: 'title', operator: 'like', value: 'Rechnung' })), {
      onStateChange
    })
    fireEvent.click(screen.getByRole('button', { name: 'Filter bearbeiten' }))
    fireEvent.click(screen.getByRole('tab', { name: 'JSON' }))

    const textarea = screen.getByRole('textbox', { name: 'Filter-JSON' })

    fireEvent.change(textarea, { target: { value: '{broken' } })
    fireEvent.blur(textarea)

    expect(onStateChange).not.toHaveBeenCalled()
  })
})

describe('FilterBuilder', () => {
  const contacts = [
    { id: 1, full_name: 'Max Mustermann', reverse_full_name: 'Mustermann, Max' }
  ] as unknown as App.Data.ContactData[]

  const types = [{ id: 3, name: 'Rechnung' }] as unknown as App.Data.DocumentTypeData[]

  it('renders a value editor for every supported field', () => {
    render(
      <FilterForm
        contacts={contacts}
        projects={[]}
        types={types}
        tags={tags}
        state={stateWith(
          condition({ field: 'title' }),
          condition({ field: 'issued_on', operator: 'between', value: [] }),
          condition({ field: 'sender_contact_id' }),
          condition({ field: 'receiver_contact_id' }),
          condition({ field: 'document_type_id' }),
          condition({ field: 'tags' })
        )}
        isDirty={false}
        onStateChange={() => {}}
        onApply={() => {}}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Filter bearbeiten' }))

    expect(screen.getAllByText('Feld:')).toHaveLength(6)
    expect(screen.getAllByText('Kontakt:')).toHaveLength(2)
    expect(screen.getAllByText('Zeitraum:')).toHaveLength(1)
    expect(screen.getAllByText('Wert:')).toHaveLength(1)
    expect(screen.getAllByRole('checkbox')).toHaveLength(2)
  })

  it('renders a nested group next to its sibling conditions', () => {
    const nested = { ...newGroup('or'), children: [condition({ field: 'title' })] }

    render(
      <FilterForm
        contacts={contacts}
        projects={[]}
        types={types}
        tags={tags}
        state={stateWith(condition({ field: 'title' }), nested)}
        isDirty={false}
        onStateChange={() => {}}
        onApply={() => {}}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Filter bearbeiten' }))

    expect(screen.getAllByText('und')).not.toHaveLength(0)
    expect(screen.getAllByText('oder')).not.toHaveLength(0)
    expect(screen.getAllByRole('button', { name: 'Gruppe entfernen' })).toHaveLength(1)
    expect(screen.getAllByRole('button', { name: 'Bedingung entfernen' })).toHaveLength(2)
  })
})
