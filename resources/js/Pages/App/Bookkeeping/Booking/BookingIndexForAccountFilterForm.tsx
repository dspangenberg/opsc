import { FilterHorizontalIcon } from '@hugeicons/core-free-icons'
import { X } from 'lucide-react'
import type * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/Components/twc-ui/button'
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
  filters: FilterConfig
  onFiltersChange: (filters: FilterConfig) => void
}

export const BookingIndexForAccountFilterForm: React.FC<Props> = ({ filters, onFiltersChange }) => {
  const currentFilters = useMemo(() => {
    const issuedBetween = filters?.filters?.issuedBetween?.value
    const dateRange = parseFilterDateRange(issuedBetween)

    return {
      issuedBetween: dateRange
    }
  }, [filters?.filters?.issuedBetween?.value])

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
    <>
      <PopoverTrigger>
        <Button variant="outline" size="lg" icon={FilterHorizontalIcon} className="h-9">
          Filter
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
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
                        localIssuedBetween
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
              </FormGrid>
            </div>
          </PopoverDialog>
        </Popover>
      </PopoverTrigger>

      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          {Object.entries(filters?.filters || {}).map(([key, filter]) => (
            <Badge key={key} variant="secondary" className="text-xs">
              {getFilterBadgeLabel(key, filter, {})}
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
    </>
  )
}
