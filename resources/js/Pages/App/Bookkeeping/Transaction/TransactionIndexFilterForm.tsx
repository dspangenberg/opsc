import { FilterHorizontalIcon } from '@hugeicons/core-free-icons'
import { X } from 'lucide-react'
import type * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/Components/twc-ui/button'
import { Checkbox } from '@/Components/twc-ui/checkbox'
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
  accounts: App.Data.BookkeepingAccountData[]
  filters: FilterConfig
  onFiltersChange: (filters: FilterConfig) => void
  bankAccountId: number
}

export const TransactionIndexFilterForm: React.FC<Props> = ({
  accounts,
  filters,
  onFiltersChange,
  bankAccountId
}) => {
  const currentFilters = useMemo(() => {
    const f = filters?.filters || {}
    return {
      is_locked: !!f.is_locked,
      without_counter_account:
        f.counter_account_id?.operator === '=' && f.counter_account_id?.value === 0,
      hide_private: !!f.hide_private,
      hide_transit: !!f.hide_transit
    }
  }, [filters?.filters])

  const activeFiltersCount = useMemo(() => {
    return Object.keys(filters?.filters || {}).length
  }, [filters?.filters])

  const currentIssuedBetween = useMemo(() => {
    return parseFilterDateRange(filters?.filters?.issuedBetween?.value)
  }, [filters?.filters?.issuedBetween?.value])

  const [localIssuedBetween, setLocalIssuedBetween] = useState<any>(currentIssuedBetween)

  useEffect(() => {
    setLocalIssuedBetween(currentIssuedBetween)
  }, [currentIssuedBetween])

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
        <Button variant="outline" size="sm" icon={FilterHorizontalIcon} className="h-9">
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

              <FormGrid>
                <div className="col-span-24 space-y-2">
                  <DateRangePicker
                    label="Belegdatum"
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
                <div className="col-span-24 space-y-2">
                  <div className="space-y-2">
                    <Checkbox
                      isSelected={currentFilters.is_locked}
                      name="is_locked"
                      onChange={checked =>
                        updateFilters('is_locked', checked ? { operator: '=', value: 0 } : null)
                      }
                    >
                      Nur unbestätigte Transaktionen
                    </Checkbox>

                    <Checkbox
                      isSelected={currentFilters.without_counter_account}
                      name="without_counter_account"
                      onChange={checked =>
                        updateFilters(
                          'counter_account_id',
                          checked ? { operator: '=', value: 0 } : null
                        )
                      }
                    >
                      Nur Transaktionen ohne Gegenkonto
                    </Checkbox>

                    <Checkbox
                      isSelected={currentFilters.hide_private}
                      name="hide_private"
                      onChange={checked =>
                        updateFilters(
                          'hide_private',
                          checked ? { operator: 'scope', value: true } : null
                        )
                      }
                    >
                      Private Transaktionen ausblenden
                    </Checkbox>
                    <Checkbox
                      isSelected={currentFilters.hide_transit}
                      name="hide_transit"
                      onChange={checked =>
                        updateFilters(
                          'hide_transit',
                          checked ? { operator: 'scope', value: true } : null
                        )
                      }
                    >
                      Geldtransit ausblenden
                    </Checkbox>
                  </div>
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
              {getFilterBadgeLabel(key, filter)}
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
