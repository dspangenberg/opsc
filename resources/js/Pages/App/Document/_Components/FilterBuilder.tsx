import type { DateValue } from '@internationalized/date'
import { parseDate } from '@internationalized/date'
import { Plus, Trash2 } from 'lucide-react'
import type * as React from 'react'
import { Button } from '@/Components/twc-ui/button'
import { ComboBox } from '@/Components/twc-ui/combo-box'
import { DatePicker } from '@/Components/twc-ui/date-picker'
import { DateRangePicker } from '@/Components/twc-ui/date-range-picker'
import { FormCheckboxGroup } from '@/Components/twc-ui/form-checkbox-group'
import { RadioGroup } from '@/Components/twc-ui/radio-group'
import { Select } from '@/Components/twc-ui/select'
import { TextField } from '@/Components/twc-ui/text-field'
import {
  type Combinator,
  defaultOperatorForField,
  FILTER_FIELDS,
  type FilterCondition,
  type FilterGroup,
  type FilterNode,
  type FilterTreeValue,
  newCondition,
  newGroup,
  operatorsForField
} from '@/Pages/App/Document/_Components/filterTree'

interface FieldOption {
  id: string
  name: string
}

interface Props {
  group: FilterGroup
  contacts: App.Data.ContactData[]
  projects: App.Data.ProjectData[]
  types: App.Data.DocumentTypeData[]
  tags: App.Data.DocumentTagData[]
  isRoot?: boolean
  onChange: (group: FilterGroup) => void
  onRemove?: () => void
}

const toDateValue = (value: FilterTreeValue): DateValue | null =>
  typeof value === 'string' && value !== '' ? parseDate(value.slice(0, 10)) : null

const fieldOptions = (field: string): FieldOption[] => {
  if (FILTER_FIELDS.some(option => option.id === field)) {
    return FILTER_FIELDS
  }

  return [...FILTER_FIELDS, { id: field, name: field }]
}

const comboValue = (value: FilterTreeValue): number | null => {
  if (value === '' || value === null || value === undefined) {
    return null
  }

  const numeric = Number(value)

  return Number.isNaN(numeric) ? null : numeric
}

const ContactValue: React.FC<{
  condition: FilterCondition
  contacts: App.Data.ContactData[]
  onChange: (value: FilterTreeValue) => void
}> = ({ condition, contacts, onChange }) => (
  <ComboBox<App.Data.ContactData>
    label="Kontakt"
    name={`sender-${condition.id}`}
    isOptional
    value={comboValue(condition.value)}
    onChange={value => onChange(value ?? '')}
    items={contacts ?? []}
    itemName="full_name"
  />
)

const TypeValue: React.FC<{
  condition: FilterCondition
  types: App.Data.DocumentTypeData[]
  onChange: (value: FilterTreeValue) => void
}> = ({ condition, types, onChange }) => (
  <ComboBox<App.Data.DocumentTypeData>
    label="Dokumenttyp"
    name={`document_type-${condition.id}`}
    isOptional
    value={comboValue(condition.value)}
    onChange={value => onChange(value ?? '')}
    items={types ?? []}
  />
)

const ProjectValue: React.FC<{
  condition: FilterCondition
  projects: App.Data.ProjectData[]
  onChange: (value: FilterTreeValue) => void
}> = ({ condition, projects, onChange }) => (
  <ComboBox<App.Data.ProjectData>
    label="Projekt"
    name={`project-${condition.id}`}
    isOptional
    value={comboValue(condition.value)}
    onChange={value => onChange(value ?? '')}
    items={projects ?? []}
  />
)

const TagsValue: React.FC<{
  condition: FilterCondition
  tags: App.Data.DocumentTagData[]
  onChange: (value: FilterTreeValue) => void
}> = ({ condition, tags, onChange }) => (
  <FormCheckboxGroup<App.Data.DocumentTagData>
    label="Tags"
    name={`tags-${condition.id}`}
    items={tags}
    itemName="name"
    listClassName="max-h-44 overflow-auto"
    value={Array.isArray(condition.value) ? (condition.value as number[]) : []}
    onChange={selected => onChange(selected)}
  />
)

const ValueInput: React.FC<{
  condition: FilterCondition
  contacts: App.Data.ContactData[]
  types: App.Data.DocumentTypeData[]
  projects: App.Data.ProjectData[]
  tags: App.Data.DocumentTagData[]
  onChange: (value: FilterTreeValue) => void
}> = ({ condition, contacts, projects, types, tags, onChange }) => {
  switch (condition.field) {
    case 'sender_contact_id':
    case 'receiver_contact_id':
      return <ContactValue condition={condition} contacts={contacts} onChange={onChange} />
    case 'document_type_id':
      return <TypeValue condition={condition} types={types} onChange={onChange} />
    case 'project_id':
      return <ProjectValue condition={condition} projects={projects} onChange={onChange} />
    case 'tags':
      return <TagsValue condition={condition} tags={tags} onChange={onChange} />
    case 'issued_on':
      if (condition.operator === 'between') {
        const value = Array.isArray(condition.value) ? condition.value : []
        const start = toDateValue(value[0])
        const end = toDateValue(value[1])

        return (
          <DateRangePicker
            label="Zeitraum"
            value={start && end ? { start, end } : null}
            onChange={range =>
              onChange(range ? [range.start.toString(), range.end.toString()] : [])
            }
          />
        )
      }

      return (
        <DatePicker
          label="Datum"
          value={toDateValue(condition.value)}
          onChange={value => onChange(value ? value.toString() : '')}
        />
      )
    default:
      return (
        <TextField
          label="Wert"
          value={(condition.value as string) ?? ''}
          onChange={(value: string | null) => onChange(value ?? '')}
        />
      )
  }
}

const ConditionRow: React.FC<{
  condition: FilterCondition
  contacts: App.Data.ContactData[]
  projects: App.Data.ProjectData[]
  types: App.Data.DocumentTypeData[]
  tags: App.Data.DocumentTagData[]
  onChange: (condition: FilterCondition) => void
  onRemove: () => void
}> = ({ condition, contacts, projects, types, tags, onChange, onRemove }) => {
  const changeField = (field: string) => {
    const operator = defaultOperatorForField(field)

    onChange({
      ...condition,
      field,
      operator,
      value: field === 'tags' || operator === 'between' ? [] : ''
    })
  }

  return (
    <div className="flex items-center gap-2 rounded-md border border-border/60 p-2">
      <Select
        className="w-32 shrink-0"
        label="Feld"
        value={condition.field}
        items={fieldOptions(condition.field)}
        onChange={value => value && changeField(String(value))}
      />
      <Select
        className="w-28 shrink-0"
        label="Operator"
        value={condition.operator}
        items={operatorsForField(condition.field)}
        onChange={value => value && onChange({ ...condition, operator: String(value) })}
      />
      <div className="min-w-0 flex-1">
        <ValueInput
          condition={condition}
          contacts={contacts}
          projects={projects}
          types={types}
          tags={tags}
          onChange={value => onChange({ ...condition, value })}
        />
      </div>
      <Button
        aria-label="Bedingung entfernen"
        variant="ghost-destructive"
        size="icon-sm"
        icon={Trash2}
        onClick={onRemove}
      />
    </div>
  )
}

export const FilterGroupBuilder: React.FC<Props> = ({
  group,
  contacts,
  projects,
  types,
  tags,
  isRoot = false,
  onChange,
  onRemove
}) => {
  const replaceChild = (index: number, node: FilterNode) =>
    onChange({ ...group, children: group.children.map((child, i) => (i === index ? node : child)) })

  const removeChild = (index: number) =>
    onChange({ ...group, children: group.children.filter((_, i) => i !== index) })

  const addCondition = () => onChange({ ...group, children: [...group.children, newCondition()] })

  const addGroup = () =>
    onChange({
      ...group,
      children: [...group.children, newGroup(group.combinator === 'and' ? 'or' : 'and')]
    })

  return (
    <div className="space-y-2 rounded-md border border-border p-2">
      <div className="flex items-center justify-between gap-2">
        <RadioGroup
          name={`combinator-${group.id}`}
          label="Verknüpfung"
          orientation="horizontal"
          items={[
            { id: 'and', name: 'und' },
            { id: 'or', name: 'oder' }
          ]}
          value={group.combinator}
          onChange={value => onChange({ ...group, combinator: value as Combinator })}
        />

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" icon={Plus} onClick={addCondition}>
            Bedingung
          </Button>
          <Button variant="ghost" size="sm" icon={Plus} onClick={addGroup}>
            Gruppe
          </Button>
          {!isRoot && (
            <Button
              aria-label="Gruppe entfernen"
              variant="ghost-destructive"
              size="icon-sm"
              icon={Trash2}
              onClick={onRemove}
            />
          )}
        </div>
      </div>

      {group.children.map((child, index) =>
        child.type === 'group' ? (
          <FilterGroupBuilder
            key={child.id}
            group={child}
            contacts={contacts}
            projects={projects}
            types={types}
            tags={tags}
            onChange={node => replaceChild(index, node)}
            onRemove={() => removeChild(index)}
          />
        ) : (
          <ConditionRow
            key={child.id}
            condition={child}
            contacts={contacts}
            projects={projects}
            types={types}
            tags={tags}
            onChange={node => replaceChild(index, node)}
            onRemove={() => removeChild(index)}
          />
        )
      )}
    </div>
  )
}
