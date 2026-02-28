import { FilterEditIcon, FilterIcon, FilterRemoveIcon } from '@hugeicons/core-free-icons'
import { X } from 'lucide-react'
import type * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/Components/twc-ui/button'
import { Checkbox } from '@/Components/twc-ui/checkbox'
import { ComboBox } from '@/Components/twc-ui/combo-box'
import { DateRangePicker } from '@/Components/twc-ui/date-range-picker'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { Popover, PopoverDialog, PopoverTrigger } from '@/Components/twc-ui/popover'
import { Badge } from '@/Components/ui/badge'
import {
  type FilterConfig,
  type FilterItem,
  getFilterBadgeLabel,
  getUpdatedFilters,
  parseFilterDateRange
} from '@/Lib/FilterHelper'

interface Props {
  contacts: App.Data.ContactData[]
  types: App.Data.DocumentTypeData[]
  projects: App.Data.ProjectData[]
  filters: FilterConfig
  onFiltersChange: (filters: FilterConfig) => void
}

export const FilterForm: React.FC<Props> = ({
  contacts,
  projects,
  types,
  filters,
  onFiltersChange
}) => {
  const currentFilters = useMemo(() => {
    const issuedBetween = filters?.filters?.issuedBetween?.value
    const dateRange = parseFilterDateRange(issuedBetween)

    const f = filters?.filters || {}

    return {
      contact: f.contact?.value,
      document_type_id: f.document_type_id?.value,
      project_id: f.project_id?.value,
      is_hidden: f.is_hidden?.value,
      is_inbound: f.is_inbound?.value,
      issuedBetween: dateRange
    }
  }, [filters?.filters])

  const activeFiltersCount = useMemo(() => {
    return Object.keys(filters?.filters || {}).length
  }, [filters?.filters])

  const [localIssuedBetween, setLocalIssuedBetween] = useState<any>(currentFilters.issuedBetween)

  useEffect(() => {
    setLocalIssuedBetween(currentFilters.issuedBetween)
  }, [currentFilters.issuedBetween])

  const updateFilters = (key: string, item: FilterItem | null) => {
    onFiltersChange(getUpdatedFilters(filters, key, item))
  }

  const handleClearFilters = () => {
    onFiltersChange({
      filters: {},
      boolean: 'AND'
    })
  }

  return (
    <div className="flex items-center gap-0.5">
      <PopoverTrigger>
        <Button
          variant="toolbar"
          size="icon"
          icon={activeFiltersCount > 0 ? FilterEditIcon : FilterIcon}
          title={activeFiltersCount > 0 ? 'Filter bearbeiten' : 'Filter hinzufügen'}
        />

        <Popover>
          <PopoverDialog className="max-w-md">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Filter</h4>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleClearFilters} icon={X}>
                    Zurücksetzen
                  </Button>
                )}
              </div>

              <FormGrid className="px-0">
                <div className="col-span-24 space-y-2">
                  <DateRangePicker
                    label="Zeitraum"
                    value={localIssuedBetween}
                    onChange={setLocalIssuedBetween}
                    onBlur={() => {
                      updateFilters(
                        'issuedBetween',
                        localIssuedBetween?.start && localIssuedBetween?.end
                          ? {
                              operator: 'scope',
                              value: [
                                localIssuedBetween.start.toString(),
                                localIssuedBetween.end.toString()
                              ]
                            }
                          : null
                      )
                    }}
                  />
                </div>

                <div className="col-span-24 space-y-2">
                  <ComboBox<App.Data.DocumentTypeData>
                    label="Dokumenttyp"
                    name="document_type_id"
                    isOptional
                    value={currentFilters.document_type_id}
                    onChange={value =>
                      updateFilters('document_type_id', value ? { operator: '=', value } : null)
                    }
                    items={types ?? []}
                  />
                </div>
                <div className="col-span-24 space-y-2">
                  <ComboBox<App.Data.ContactData>
                    label="Kontakt"
                    name="contact_id"
                    isOptional
                    value={currentFilters.contact}
                    onChange={value =>
                      updateFilters('contact', value ? { operator: 'scope', value } : null)
                    }
                    items={contacts ?? []}
                    itemName="full_name"
                  />
                </div>

                <div className="col-span-24 space-y-2">
                  <div className="space-y-2">
                    <Checkbox
                      isSelected={currentFilters.is_hidden}
                      name="is_hidden"
                      onChange={checked =>
                        updateFilters('is_hidden', checked ? { operator: '=', value: true } : null)
                      }
                    >
                      ausgeblendete Dokumente
                    </Checkbox>
                    <Checkbox
                      isSelected={currentFilters.is_inbound}
                      name="is_inbound"
                      onChange={checked =>
                        updateFilters(
                          'is_inbound',
                          checked ? { operator: 'scope', value: true } : null
                        )
                      }
                    >
                      nur eingegangene Dokumente
                    </Checkbox>
                  </div>
                </div>
              </FormGrid>
            </div>
          </PopoverDialog>
        </Popover>
      </PopoverTrigger>
      {activeFiltersCount > 0 && (
        <Button
          variant="toolbar"
          size="icon"
          icon={FilterRemoveIcon}
          title="Filter zurücksetzen"
          onClick={handleClearFilters}
        />
      )}
      {activeFiltersCount > 0 && (
        <div className="ml-2 flex flex-wrap items-center gap-1">
          {Object.entries(filters?.filters || {}).map(([key, filter]) => (
            <Badge key={key} variant="secondary" className="text-xs">
              {getFilterBadgeLabel(key, filter, {
                contacts,
                projects,
                document_types: types
              })}
              <button
                type="button"
                className="ml-1 hover:text-destructive"
                onClick={() => updateFilters(key, null)}
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
