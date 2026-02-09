import { FilterHorizontalIcon } from '@hugeicons/core-free-icons'
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
  accounts: App.Data.BookkeepingAccountData[]
  filters: FilterConfig
  onFiltersChange: (filters: FilterConfig) => void
}

export const BookingIndexFilterForm: React.FC<Props> = ({ accounts, filters, onFiltersChange }) => {
  const currentFilters = useMemo(() => {
    const issuedBetween = filters?.filters?.issuedBetween?.value
    const dateRange = parseFilterDateRange(issuedBetween)

    const f = filters?.filters || {}

    return {
      is_locked: !!f.is_locked,
      hide_private: !!f.hide_private,
      hide_transit: !!f.hide_transit,
      account_id_credit: f.account_id_credit?.operator === '=' ? f.account_id_credit.value : 0,
      account_id_debit: f.account_id_debit?.operator === '=' ? f.account_id_debit.value : 0,
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
                <div className="col-span-24 space-y-2">
                  <ComboBox<App.Data.BookkeepingAccountData>
                    label="Habenkonto"
                    name="account_id_credit"
                    isOptional
                    value={currentFilters.account_id_credit}
                    onChange={value =>
                      updateFilters('account_id_credit', value ? { operator: '=', value } : null)
                    }
                    items={accounts}
                    itemName="label"
                    itemValue="account_number"
                  />
                </div>
                <div className="col-span-24 space-y-2">
                  <ComboBox<App.Data.BookkeepingAccountData>
                    label="Sollkonto"
                    name="account_id_debit"
                    isOptional
                    value={currentFilters.account_id_debit}
                    onChange={value =>
                      updateFilters('account_id_debit', value ? { operator: '=', value } : null)
                    }
                    items={accounts}
                    itemName="label"
                    itemValue="account_number"
                  />
                </div>
                <div className="col-span-24 space-y-2">
                  <div className="space-y-2">
                    <Checkbox
                      isSelected={currentFilters.is_locked}
                      name="is_locked"
                      onChange={checked =>
                        updateFilters('is_locked', checked ? { operator: '=', value: true } : null)
                      }
                    >
                      nur bestätigte Buchungen
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
                      private Buchungen ausblenden
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
                      Transit ausblenden
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
              {getFilterBadgeLabel(key, filter, {
                accounts
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
    </>
  )
}
