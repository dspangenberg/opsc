import { FilterEditIcon, FilterIcon } from '@hugeicons/core-free-icons'
import { X } from 'lucide-react'
import type * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/Components/twc-ui/button'
import { Popover, PopoverDialog, PopoverTrigger } from '@/Components/twc-ui/popover'
import { Tab, TabList, TabPanel, Tabs } from '@/Components/twc-ui/tabs'
import { Badge } from '@/Components/ui/badge'
import { FilterGroupBuilder } from '@/Pages/App/Document/_Components/FilterBuilder'
import {
  buildFilterTree,
  describeCondition,
  emptyFilterState,
  type FilterState,
  flattenConditions,
  parseFilterTree,
  removeConditionById
} from '@/Pages/App/Document/_Components/filterTree'

interface Props {
  contacts: App.Data.ContactData[]
  types: App.Data.DocumentTypeData[]
  tags: App.Data.DocumentTagData[]
  projects: App.Data.ProjectData[]
  state: FilterState
  isDirty: boolean
  onStateChange: (state: FilterState) => void
  onApply: () => void
}

export const FilterForm: React.FC<Props> = ({
  contacts,
  projects,
  tags,
  types,
  state,
  isDirty,
  onStateChange,
  onApply
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const conditions = useMemo(() => flattenConditions(state.builder), [state.builder])
  const activeFiltersCount = conditions.length
  const describeOptions = { contacts, types, tags, projects }
  const filterJson = useMemo(() => JSON.stringify(buildFilterTree(state), null, 2), [state])
  const [jsonText, setJsonText] = useState(filterJson)

  useEffect(() => {
    setJsonText(filterJson)
  }, [filterJson])

  const onBuilderChange = (builder: FilterState['builder']) => onStateChange({ ...state, builder })

  const handleJsonBlur = () => {
    try {
      onStateChange(parseFilterTree(JSON.parse(jsonText)))
    } catch {
      // malformed JSON keeps the previous filter state
    }
  }

  const handleRemoveCondition = (id: string) =>
    onStateChange({ ...state, builder: removeConditionById(state.builder, id) })

  const handleClearFilters = () => onStateChange(emptyFilterState())

  const handleApply = () => {
    setIsOpen(false)
    onApply()
  }

  return (
    <div className="flex items-center gap-0.5">
      <PopoverTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
        <Button
          variant="toolbar"
          size="icon"
          icon={activeFiltersCount > 0 || isDirty ? FilterEditIcon : FilterIcon}
          title={activeFiltersCount > 0 ? 'Filter bearbeiten' : 'Filter hinzufügen'}
        />

        <Popover>
          <PopoverDialog className="w-2xl max-w-[calc(100vw-2rem)]">
            <div className="space-y-4">
              <Tabs defaultSelectedKey="filters" variant="underlined" className="w-full">
                <TabList aria-label="Filteransicht">
                  <Tab id="filters">Filter</Tab>
                  <Tab id="json">JSON</Tab>
                </TabList>

                <TabPanel id="filters">
                  <div className="space-y-4">
                    <FilterGroupBuilder
                      group={state.builder}
                      contacts={contacts}
                      projects={projects}
                      types={types}
                      tags={tags}
                      isRoot
                      onChange={onBuilderChange}
                    />
                  </div>
                </TabPanel>

                <TabPanel id="json">
                  <textarea
                    aria-label="Filter-JSON"
                    spellCheck={false}
                    className="h-96 w-full resize-y rounded-sm border border-input bg-background p-3 font-mono text-xs outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20"
                    value={jsonText}
                    onChange={event => setJsonText(event.target.value)}
                    onBlur={handleJsonBlur}
                  />
                </TabPanel>
              </Tabs>

              <div className="flex items-center justify-between gap-2 border-border border-t pt-3">
                <Button variant="ghost" size="sm" icon={X} onClick={handleClearFilters}>
                  Zurücksetzen
                </Button>
                <Button variant="default" size="sm" onClick={handleApply}>
                  Filter anwenden
                </Button>
              </div>
            </div>
          </PopoverDialog>
        </Popover>
      </PopoverTrigger>
      {isDirty && (
        <Button variant="default" size="sm" onClick={onApply}>
          Filter anwenden
        </Button>
      )}
      {activeFiltersCount > 0 && (
        <div className="ml-2 flex flex-wrap items-center gap-1">
          {conditions.map(condition => (
            <Badge key={condition.id} variant="secondary" className="text-xs">
              {describeCondition(condition, describeOptions)}
              <button
                type="button"
                aria-label="Filter entfernen"
                className="ml-1 hover:text-destructive"
                onClick={() => handleRemoveCondition(condition.id)}
              >
                <X size={10} />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
