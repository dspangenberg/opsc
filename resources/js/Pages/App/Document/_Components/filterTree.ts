export type FilterTreeValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | FilterTreeValue[]
  | { [key: string]: FilterTreeValue }

export type FilterTreeLeaf = {
  field: string
  operator: string
  value: FilterTreeValue
}

export type FilterTreeGroup = {
  [key: string]: FilterTreeNode[]
}

export type FilterTreeNode = FilterTreeLeaf | FilterTreeGroup

export type Combinator = 'and' | 'or'

export interface FilterCondition {
  id: string
  type: 'condition'
  field: string
  operator: string
  value: FilterTreeValue
}

export interface FilterGroup {
  id: string
  type: 'group'
  combinator: Combinator
  children: FilterNode[]
}

export type FilterNode = FilterCondition | FilterGroup

export interface FilterState {
  builder: FilterGroup
}

export interface FilterFieldOption {
  id: string
  name: string
}

export const FILTER_FIELDS: FilterFieldOption[] = [
  { id: 'title', name: 'Titel' },
  { id: 'issued_on', name: 'Datum' },
  { id: 'sender_contact_id', name: 'Absender' },
  { id: 'receiver_contact_id', name: 'Empfänger' },
  { id: 'project_id', name: 'Projekt' },
  { id: 'document_type_id', name: 'Dokumenttyp' },
  { id: 'tags', name: 'Tags' }
]

const OPERATORS: Record<string, FilterFieldOption[]> = {
  title: [
    { id: 'like', name: 'enthält' },
    { id: 'eq', name: 'ist' },
    { id: 'neq', name: 'ist nicht' }
  ],
  issued_on: [
    { id: 'between', name: 'zwischen' },
    { id: 'gte', name: 'ab' },
    { id: 'lte', name: 'bis' },
    { id: 'eq', name: 'am' }
  ],
  sender_contact_id: [{ id: 'eq', name: 'ist' }],
  receiver_contact_id: [{ id: 'eq', name: 'ist' }],
  project_id: [{ id: 'eq', name: 'ist' }],
  document_type_id: [{ id: 'eq', name: 'ist' }],
  tags: [
    { id: 'any', name: 'irgendein Tag' },
    { id: 'all', name: 'alle Tags' }
  ]
}

const TREE_OPERATORS: Record<string, string> = {
  '=': 'eq',
  '==': 'eq',
  eq: 'eq',
  '!=': 'neq',
  '<>': 'neq',
  ne: 'neq',
  neq: 'neq',
  '<': 'lt',
  lt: 'lt',
  '<=': 'lte',
  le: 'lte',
  lte: 'lte',
  '>': 'gt',
  gt: 'gt',
  '>=': 'gte',
  ge: 'gte',
  gte: 'gte',
  like: 'like',
  not_like: 'nlike',
  nlike: 'nlike',
  in: 'in',
  not_in: 'nin',
  nin: 'nin',
  between: 'between',
  not_between: 'nbetween',
  nbetween: 'nbetween',
  null: 'null',
  not_null: 'notnull',
  notnull: 'notnull'
}

export const operatorsForField = (field: string): FilterFieldOption[] =>
  OPERATORS[field] ?? [{ id: 'eq', name: 'ist' }]

export const defaultOperatorForField = (field: string): string => operatorsForField(field)[0].id

const toTreeOperator = (operator: string): string => TREE_OPERATORS[operator] ?? operator

let idCounter = 0
const nextId = (): string => `f${++idCounter}`

const initialValue = (field: string, operator: string): FilterTreeValue => {
  if (field === 'tags' || operator === 'between') {
    return []
  }

  return ''
}

export const newCondition = (field = 'title'): FilterCondition => {
  const operator = defaultOperatorForField(field)

  return { id: nextId(), type: 'condition', field, operator, value: initialValue(field, operator) }
}

export const newGroup = (combinator: Combinator = 'and'): FilterGroup => ({
  id: nextId(),
  type: 'group',
  combinator,
  children: []
})

export const emptyFilterState = (): FilterState => ({
  builder: newGroup('and')
})

const asArray = (value: FilterTreeValue): FilterTreeValue[] => (Array.isArray(value) ? value : [])

const isGroup = (node: FilterTreeNode): node is FilterTreeGroup => {
  const group = node as FilterTreeGroup

  return Array.isArray(group.and) || Array.isArray(group.or)
}

const isTagsLeaf = (node: FilterTreeNode): boolean => {
  const leaf = node as FilterTreeLeaf

  return leaf?.field === 'tags.id' && leaf.operator === 'eq'
}

const withWildcards = (value: FilterTreeValue, operator: string): FilterTreeValue => {
  if ((operator === 'like' || operator === 'nlike') && typeof value === 'string') {
    return `%${value}%`
  }

  return value
}

const stripWildcards = (value: FilterTreeValue, operator: string): FilterTreeValue => {
  if ((operator === 'like' || operator === 'nlike') && typeof value === 'string') {
    return value.replace(/^%+|%+$/g, '')
  }

  return value
}

const NUMERIC_FIELDS = new Set([
  'sender_contact_id',
  'receiver_contact_id',
  'document_type_id',
  'project_id'
])

const coerceValue = (field: string, value: FilterTreeValue): FilterTreeValue => {
  if (!NUMERIC_FIELDS.has(field)) {
    return value
  }

  if (value === '' || value === null || value === undefined || Array.isArray(value)) {
    return value
  }

  const numeric = Number(value)

  return Number.isNaN(numeric) ? value : numeric
}

const conditionToTree = (condition: FilterCondition): FilterTreeNode | null => {
  if (condition.field === 'tags') {
    const ids = asArray(condition.value).filter(id => id !== null && id !== undefined && id !== '')
    const leaves = ids.map(id => ({ field: 'tags.id', operator: 'eq', value: id }))

    if (leaves.length === 0) {
      return null
    }

    return condition.operator === 'all' ? { and: leaves } : { or: leaves }
  }

  if (condition.operator === 'between') {
    const [start, end] = asArray(condition.value)

    if (!start || !end) {
      return null
    }

    return { field: condition.field, operator: 'between', value: [start, end] }
  }

  if (condition.value === null || condition.value === undefined || condition.value === '') {
    return null
  }

  const operator = toTreeOperator(condition.operator)

  return {
    field: condition.field,
    operator,
    value: withWildcards(condition.value, operator)
  }
}

const builderNodeToTree = (node: FilterNode): FilterTreeNode | null => {
  if (node.type === 'group') {
    const children = node.children
      .map(builderNodeToTree)
      .filter((child): child is FilterTreeNode => child !== null)

    return children.length > 0 ? { [node.combinator]: children } : null
  }

  return conditionToTree(node)
}

export const buildFilterTree = (state: FilterState): FilterTreeGroup => {
  const children = state.builder.children
    .map(builderNodeToTree)
    .filter((child): child is FilterTreeNode => child !== null)

  const conditions: FilterTreeNode[] =
    state.builder.combinator === 'or' && children.length > 0 ? [{ or: children }] : children

  return { and: conditions }
}

const leafToCondition = (leaf: FilterTreeLeaf): FilterCondition => {
  const operator = toTreeOperator(leaf.operator)

  return {
    id: nextId(),
    type: 'condition',
    field: leaf.field,
    operator,
    value: coerceValue(leaf.field, stripWildcards(leaf.value, operator))
  }
}

const treeNodeToBuilder = (node: FilterTreeNode): FilterNode | null => {
  if (isGroup(node)) {
    const group = node as FilterTreeGroup
    const children = (group.or ?? group.and) as FilterTreeNode[]
    const combinator: Combinator = group.and ? 'and' : 'or'

    if (children.length > 0 && children.every(isTagsLeaf)) {
      return {
        id: nextId(),
        type: 'condition',
        field: 'tags',
        operator: combinator === 'and' ? 'all' : 'any',
        value: children.map(child => Number((child as FilterTreeLeaf).value))
      }
    }

    return {
      id: nextId(),
      type: 'group',
      combinator,
      children: children
        .map(treeNodeToBuilder)
        .filter((child): child is FilterNode => child !== null)
    }
  }

  return leafToCondition(node as FilterTreeLeaf)
}

export const encodeFilter = (state: FilterState): string => JSON.stringify(buildFilterTree(state))

const normalizeTree = (input: unknown): unknown => {
  if (typeof input !== 'string') {
    return input
  }

  const trimmed = input.trim()

  if (trimmed === '') {
    return null
  }

  try {
    return JSON.parse(trimmed)
  } catch {
    return null
  }
}

export const parseFilterTree = (input: unknown): FilterState => {
  const tree = normalizeTree(input)

  if (!tree || typeof tree !== 'object') {
    return emptyFilterState()
  }

  const root = tree as Record<string, unknown>
  const isOr = Array.isArray(root.or)
  const group = isOr ? root.or : root.and
  const nodes: FilterTreeNode[] = Array.isArray(group)
    ? (group as FilterTreeNode[])
    : typeof root.field === 'string'
      ? [tree as FilterTreeNode]
      : []

  const children: FilterNode[] = []

  for (const node of nodes) {
    const leaf = node as FilterTreeLeaf

    if (!isGroup(node) && leaf.field === 'is_hidden') {
      continue
    }

    const parsed = treeNodeToBuilder(node)

    if (parsed) {
      children.push(parsed)
    }
  }

  return {
    builder: { id: nextId(), type: 'group', combinator: isOr ? 'or' : 'and', children }
  }
}

export const flattenConditions = (group: FilterGroup): FilterCondition[] => {
  const conditions: FilterCondition[] = []

  for (const child of group.children) {
    if (child.type === 'condition') {
      conditions.push(child)
    } else {
      conditions.push(...flattenConditions(child))
    }
  }

  return conditions
}

export const removeConditionById = (group: FilterGroup, id: string): FilterGroup => ({
  ...group,
  children: group.children
    .filter(child => child.id !== id)
    .map(child => (child.type === 'group' ? removeConditionById(child, id) : child))
})

export interface DescribeOptions {
  contacts?: App.Data.ContactData[]
  types?: App.Data.DocumentTypeData[]
  tags?: App.Data.DocumentTagData[]
  projects?: App.Data.ProjectData[]
}

const operatorLabel = (operator: string, field: string): string =>
  operatorsForField(field).find(option => option.id === operator)?.name ?? operator

const formatDate = (value: FilterTreeValue): string => {
  if (typeof value !== 'string' || value === '') {
    return ''
  }

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('de-DE')
}

export const describeCondition = (
  condition: FilterCondition,
  options: DescribeOptions = {}
): string => {
  switch (condition.field) {
    case 'title':
      return `Titel ${operatorLabel(condition.operator, condition.field)} „${condition.value}“`
    case 'issued_on': {
      if (condition.operator === 'between') {
        const [start, end] = asArray(condition.value)

        return `Datum: ${formatDate(start)} – ${formatDate(end)}`
      }

      return `Datum ${operatorLabel(condition.operator, condition.field)} ${formatDate(condition.value)}`
    }
    case 'sender_contact_id':
      return `Absender: ${options.contacts?.find(contact => contact.id === condition.value)?.reverse_full_name ?? condition.value}`
    case 'project_id':
      return `Projekt: ${options.projects?.find(project => project.id === condition.value)?.name ?? condition.value}`
    case 'receiver_contact_id':
      return `Empfänger: ${options.contacts?.find(contact => contact.id === condition.value)?.reverse_full_name ?? condition.value}`
    case 'document_type_id':
      return `Dokumenttyp: ${options.types?.find(type => type.id === condition.value)?.name ?? condition.value}`
    case 'tags': {
      const names = asArray(condition.value)
        .map(id => options.tags?.find(tag => tag.id === id)?.name ?? id)
        .join(', ')

      return `Tags${condition.operator === 'all' ? ' (alle)' : ''}: ${names}`
    }
    default:
      return `${condition.field}: ${condition.value}`
  }
}
