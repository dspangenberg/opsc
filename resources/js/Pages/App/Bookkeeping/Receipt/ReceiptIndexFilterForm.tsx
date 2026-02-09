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
import { Select } from '@/Components/twc-ui/select'
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
  filters: FilterConfig
  onFiltersChange: (filters: FilterConfig) => void
  cost_centers: App.Data.CostCenterData[]
  currencies: App.Data.CurrencyData[]
}

export const ReceiptIndexFilterForm: React.FC<Props> = ({
  contacts,
  cost_centers,
  currencies,
  filters,
  onFiltersChange
}) => {
  const currentFilters = useMemo(() => {
    const issuedBetween = filters?.filters?.issuedBetween?.value
    const dateRange = parseFilterDateRange(issuedBetween)

    const f = filters?.filters || {}

    return {
      is_unpaid: !!f.is_unpaid,
      withoutBookings: !!f.withoutBookings,
      contact_id: f.contact_id?.operator === '=' ? f.contact_id.value : 0,
      cost_center_id: f.cost_center_id?.operator === '=' ? f.cost_center_id.value : 0,
      org_currency: f.org_currency?.operator === '=' ? f.org_currency.value : '',
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
                  <ComboBox<App.Data.ContactData>
                    label="Kreditor"
                    name="contact_id"
                    isOptional
                    value={currentFilters.contact_id}
                    onChange={value =>
                      updateFilters('contact_id', value ? { operator: '=', value } : null)
                    }
                    items={contacts}
                    itemName="reverse_full_name"
                  />
                </div>
                <div className="col-span-24 space-y-2">
                  <Select<App.Data.CostCenterData>
                    label="Kostenstelle"
                    name="cost_center_id"
                    isOptional
                    value={currentFilters.cost_center_id}
                    onChange={value =>
                      updateFilters('cost_center_id', value ? { operator: '=', value } : null)
                    }
                    items={cost_centers}
                  />
                </div>
                <div className="col-span-24 space-y-2">
                  <Select<App.Data.CurrencyData>
                    label="Währung"
                    name="org_currency"
                    isOptional
                    value={currentFilters.org_currency}
                    onChange={value =>
                      updateFilters('org_currency', value ? { operator: '=', value } : null)
                    }
                    items={currencies}
                    itemValue="code"
                  />
                </div>
                <div className="col-span-24 space-y-2">
                  <div className="space-y-2">
                    <Checkbox
                      isSelected={currentFilters.is_unpaid}
                      name="is_unpaid"
                      onChange={checked =>
                        updateFilters('is_unpaid', checked ? { operator: 'scope', value: 1 } : null)
                      }
                    >
                      nur unbezahlte Belege
                    </Checkbox>
                    <Checkbox
                      isSelected={currentFilters.withoutBookings}
                      name="withoutBookings"
                      onChange={checked =>
                        updateFilters(
                          'withoutBookings',
                          checked ? { operator: 'scope', value: 1 } : null
                        )
                      }
                    >
                      ohne Buchung
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
                contacts,
                cost_centers,
                currencies
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
